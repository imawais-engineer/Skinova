import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "../components/legal-page";

export const metadata: Metadata = {
  title: "Privacy — Skinova",
  description: "How Skinova collects, uses, and protects your information."
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="August 16, 2026">
      <LegalSection title="Overview">
        <p>
          Skinova (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a consumer skincare intelligence application built for
          educational guidance. This Privacy Policy explains what information we collect, how we use it, and the choices
          you have when you use Skinova at{" "}
          <Link href="/" className="text-cyan-200 underline-offset-2 hover:underline">
            skinova-ai.vercel.app
          </Link>{" "}
          or other deployments of the Skinova application.
        </p>
        <p>
          Skinova is designed to keep sensitive API credentials server-side and to limit unnecessary exposure of personal
          skincare data. We do not sell your personal information.
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <p>
          <strong className="text-white">Account information.</strong> When you create an account, we collect your name,
          email address, and a hashed version of your password. Account records are stored in our database (Neon Postgres).
          We do not store your password in plain text.
        </p>
        <p>
          <strong className="text-white">Session and authentication data.</strong> When you sign in, we issue a secure
          HTTP-only session cookie so you can stay logged in. Session tokens expire after seven days unless you log out
          sooner.
        </p>
        <p>
          <strong className="text-white">Skin scan data.</strong> When you run a skin scan, you may upload a selfie or use
          a demo sample. Selfies are transmitted through our servers to YouCam Skin AI for analysis. Skinova does not
          permanently store raw selfie images on our own servers as part of the standard scan workflow. Analysis results
          (scores, concern summaries, and related metadata) are returned to your browser and held in session storage for
          the current browsing session so you can view results, routines, and progress within the app.
        </p>
        <p>
          <strong className="text-white">Skin Coach messages.</strong> If you use Skin Coach while signed in, your questions
          and the coach responses may be stored in our database to support the coaching experience and improve reliability.
          Coach responses are generated using server-side AI services and educational knowledge content — not for medical
          diagnosis.
        </p>
        <p>
          <strong className="text-white">Technical and usage data.</strong> Like most web applications, our hosting
          provider (for example, Vercel) may automatically collect standard log data such as IP address, browser type,
          request timestamps, and error logs needed to operate and secure the service.
        </p>
      </LegalSection>

      <LegalSection title="How we use information">
        <ul className="list-disc space-y-2 pl-5">
          <li>Create and manage your account and authenticated sessions.</li>
          <li>Process skin scans and display educational insights, routines, and progress views.</li>
          <li>Power Skin Coach with context from your latest scan when available.</li>
          <li>Maintain security, prevent abuse, and troubleshoot service issues.</li>
          <li>Improve the product experience within the scope of this hackathon and demo deployment.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Third-party services">
        <p>
          Skinova relies on trusted third-party providers to operate. These may include:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-white">YouCam / Perfect Corp. Skin AI</strong> — processes selfie images for skin
            analysis. Their handling of image data is subject to their own privacy terms.
          </li>
          <li>
            <strong className="text-white">Neon Postgres</strong> — stores account and coaching data.
          </li>
          <li>
            <strong className="text-white">Vercel</strong> — hosts the application and edge infrastructure.
          </li>
          <li>
            <strong className="text-white">AI providers</strong> — power embeddings and Skin Coach responses on the
            server only; API keys are never exposed to the browser.
          </li>
        </ul>
        <p>
          We encourage you to review the privacy policies of these providers. YouCam-related documentation is available
          from Perfect Corp. as part of the YouCam API program.
        </p>
      </LegalSection>

      <LegalSection title="Data retention">
        <p>
          Account information is retained while your account remains active. Scan analysis results in your browser session
          storage are cleared when you close the browser tab or session, unless you load new scan data during the same
          session. Coach message history may be retained in our database for operational purposes.
        </p>
        <p>
          You may request account deletion by contacting us through the project repository listed on our public GitHub
          page. We will delete or anonymize account data within a reasonable period, subject to legal and operational
          requirements.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          We use industry-standard practices including password hashing, server-side API calls, HTTP-only session cookies,
          and environment-isolated secrets. No system is completely secure; please use a strong, unique password and
          avoid uploading images you do not want processed for analysis.
        </p>
      </LegalSection>

      <LegalSection title="Children's privacy">
        <p>
          Skinova is not directed at children under 13 (or the minimum age required in your jurisdiction). We do not
          knowingly collect personal information from children. If you believe a child has provided us information, please
          contact us so we can remove it.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <ul className="list-disc space-y-2 pl-5">
          <li>You may decline to create an account, but authenticated features will not be available.</li>
          <li>You may log out at any time to end your session.</li>
          <li>You may choose not to upload a selfie and instead use demo sample data where offered.</li>
          <li>You may close your browser to clear session-stored scan results.</li>
        </ul>
      </LegalSection>

      <LegalSection title="International users">
        <p>
          Skinova may be hosted in the United States or other regions depending on deployment. By using the service, you
          understand that your information may be processed in countries that may have different data protection laws than
          your own.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top of this page
          will reflect the latest version. Continued use of Skinova after changes become effective constitutes acceptance
          of the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          For privacy questions or requests, open an issue or contact the maintainers through the Skinova repository at{" "}
          <a
            href="https://github.com/imawais-engineer/Skinova"
            className="text-cyan-200 underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/imawais-engineer/Skinova
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
