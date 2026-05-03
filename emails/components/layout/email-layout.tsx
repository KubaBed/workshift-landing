import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
  Font,
  Link,
} from "@react-email/components";
import * as React from "react";

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="pl">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
            format: "woff2",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
        <Font
          fontFamily="IBM Plex Mono"
          fallbackFontFamily="monospace"
          webFont={{
            url: "https://fonts.gstatic.com/s/ibmplexmono/v19/-F63fjptAgt5VM-kVkqdyU8n1iIq129k.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <style>{`
          @media (prefers-color-scheme: dark) {
            .email-body { background-color: #0f0f0f !important; }
            .email-container { background-color: #1a1a1a !important; border: 1px solid rgba(255,255,255,0.1) !important; }
            .email-text { color: #e5e5e5 !important; }
            .email-heading { color: #ffffff !important; }
            .email-divider { border-color: #333333 !important; }
            .email-muted { color: #aaaaaa !important; }
          }
        `}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body className="email-body" style={styles.body}>
        <Container className="email-container" style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Img
              src="https://workshift.pl/logo-dark.png" // Replace with actual logo URL
              width={140}
              height="auto"
              alt="Workshift"
              style={{ display: "block", outline: "none", border: "none" }}
            />
          </Section>
          
          {/* Content */}
          <Section style={styles.content}>
            {children}
          </Section>
          
          {/* Footer */}
          <Hr style={styles.divider} className="email-divider" />
          <Section style={styles.footer}>
            <Text style={styles.footerText} className="email-muted">
              Workshift · Jakub Bednarz
            </Text>
            <Text style={styles.footerText} className="email-muted">
              <Link href="{{unsubscribe_url}}" style={styles.link}>Zrezygnuj z subskrypcji</Link>
              {" · "}
              <Link href="https://workshift.pl/polityka-prywatnosci" style={styles.link}>Polityka prywatności</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#E6E8DD", // Sage
    fontFamily: "Inter, Arial, sans-serif",
    padding: "40px 0",
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
  },
  header: {
    padding: "32px 40px 16px",
  },
  content: {
    padding: "0 40px 32px",
  },
  divider: {
    borderColor: "#E6E8DD",
    margin: "0 40px",
  },
  footer: {
    padding: "24px 40px",
    textAlign: "center" as const,
  },
  footerText: {
    fontSize: "12px",
    color: "#595959", // Muted Dark
    textAlign: "center" as const,
    margin: "4px 0",
  },
  link: {
    color: "#595959",
    textDecoration: "underline",
  },
};
