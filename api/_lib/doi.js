import crypto from 'node:crypto';

// Stateless Double Opt-In token: base64url(payload).hex(hmac-sha256).
// Using HMAC means no database — the secret alone proves the link was minted
// by us. `exp` (unix seconds) forces revocation by time.

export function signToken(payload, secret) {
    const json = JSON.stringify(payload);
    const b64 = Buffer.from(json, 'utf-8').toString('base64url');
    const sig = crypto.createHmac('sha256', secret).update(b64).digest('hex');
    return `${b64}.${sig}`;
}

export function verifyToken(token, secret) {
    if (typeof token !== 'string' || !token.includes('.')) return null;
    const [b64, sig] = token.split('.', 2);
    const expected = crypto.createHmac('sha256', secret).update(b64).digest('hex');

    const sigBuf = Buffer.from(sig, 'hex');
    const expBuf = Buffer.from(expected, 'hex');
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        return null;
    }

    try {
        const payload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf-8'));
        if (!payload?.exp || Math.floor(Date.now() / 1000) > payload.exp) return null;
        return payload;
    } catch {
        return null;
    }
}
