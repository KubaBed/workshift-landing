import crypto from 'node:crypto';

/**
 * Resend webhook receiver.
 *
 * Resend uses Svix under the hood for webhook delivery, so headers and
 * signature scheme follow Svix conventions:
 *   - svix-id        message UUID
 *   - svix-timestamp unix seconds
 *   - svix-signature space-separated list of "vN,base64sig" tuples
 *
 * Signature is HMAC-SHA256 of `${id}.${timestamp}.${rawBody}` using the
 * webhook secret (you get one when you create the endpoint in Resend).
 *
 * Set RESEND_WEBHOOK_SECRET env var = secret from Resend dashboard
 * (format: "whsec_..."). Without it, all webhooks rejected as 401.
 *
 * Endpoint URL: https://www.workshift.pl/api/resend-webhook
 *
 * Events of interest (Resend → set on subscription):
 *   email.delivered  - successfully landed in recipient mailbox
 *   email.bounced    - permanent failure, remove from audience
 *   email.complained - marked as spam, remove + alert
 *   email.opened     - recipient opened (newsletter open rate)
 *   email.clicked    - recipient clicked link
 */

// Vercel default body parser strips raw body, but we need the EXACT raw
// string for signature verification. Disable parsing and read manually.
export const config = {
    api: { bodyParser: false },
};

async function readRawBody(req) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
}

function verifySvixSignature({ secret, id, timestamp, signatureHeader, rawBody }) {
    if (!secret || !id || !timestamp || !signatureHeader) return false;

    // Drop "whsec_" prefix to get raw secret bytes
    const secretKey = secret.startsWith('whsec_')
        ? Buffer.from(secret.slice(6), 'base64')
        : Buffer.from(secret, 'utf8');

    const signedPayload = `${id}.${timestamp}.${rawBody}`;
    const expected = crypto
        .createHmac('sha256', secretKey)
        .update(signedPayload, 'utf8')
        .digest('base64');

    // Header format: "v1,abc123 v1,def456" — Svix supports multiple sigs
    // for rotation. We accept if ANY matches.
    const signatures = signatureHeader.split(' ').map((p) => p.split(',')[1]).filter(Boolean);
    return signatures.some((sig) => {
        try {
            const a = Buffer.from(sig, 'base64');
            const b = Buffer.from(expected, 'base64');
            return a.length === b.length && crypto.timingSafeEqual(a, b);
        } catch {
            return false;
        }
    });
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const secret = process.env.RESEND_WEBHOOK_SECRET;
    if (!secret) {
        console.error('resend-webhook: RESEND_WEBHOOK_SECRET not set');
        return res.status(500).json({ error: 'Webhook not configured' });
    }

    const rawBody = await readRawBody(req);
    const id = req.headers['svix-id'];
    const timestamp = req.headers['svix-timestamp'];
    const signatureHeader = req.headers['svix-signature'];

    const valid = verifySvixSignature({ secret, id, timestamp, signatureHeader, rawBody });
    if (!valid) {
        console.warn('resend-webhook: invalid signature', { id });
        return res.status(401).json({ error: 'Invalid signature' });
    }

    // Replay-protection: reject events older than 5 min (Svix recommends).
    const tsSec = Number(timestamp);
    if (!Number.isFinite(tsSec) || Math.abs(Date.now() / 1000 - tsSec) > 300) {
        return res.status(400).json({ error: 'Stale timestamp' });
    }

    let event;
    try {
        event = JSON.parse(rawBody);
    } catch {
        return res.status(400).json({ error: 'Malformed JSON' });
    }

    // Log everything to Vercel runtime logs. Later: route to Slack/Discord/DB.
    // Format prosty żebyś łatwo czytał w `vercel logs` lub MCP get_runtime_logs.
    const { type, data } = event;
    const summary = {
        type,
        emailId: data?.email_id,
        to: data?.to,
        subject: data?.subject,
        bounceType: data?.bounce?.type,
        clickedLink: data?.click?.link,
    };

    switch (type) {
        case 'email.delivered':
        case 'email.opened':
        case 'email.clicked':
            console.log(`[resend-webhook] ${type}`, summary);
            break;
        case 'email.bounced':
        case 'email.complained':
            // High-priority: list hygiene / fraud signal. Loguj jako warning
            // żeby łatwo wyfiltrować w Vercel dashboard.
            console.warn(`[resend-webhook] ${type}`, summary);
            // TODO: usunąć kontakt z Resend audience via API tutaj.
            break;
        default:
            console.log(`[resend-webhook] unhandled event ${type}`, summary);
    }

    // Resend wymaga 2xx żeby przestać retry.
    return res.status(200).json({ received: true });
}
