import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "../components/legal-page";

export const metadata: Metadata = {
  title: "Terms — Skinova",
  description: "Terms of service for using Skinova."
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="August 16, 2026">
      <LegalSection title="Agreement">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of Skinova, a consumer skincare
          intelligence application available at{" "}
          <Link href="/" className="text-cyan-200 underline-offset-2 hover:underline">
            skinova-ai.vercel.app
          </Link>{" "}
          and related deployments (the &quot;Service&quot;). By creating an account or using the Service, you agree to
          these Terms. If you do not agree, do not use Skinova.
        </p>
      </LegalSection>

      <LegalSection title="What Skinova is — and is not">
        <p>
          Skinova provides <strong className="text-white">educational skincare information</strong>, personalized
          guidance, routine suggestions, and progress-oriented views based on skin analysis technology. Skinova is a
          consumer wellness and education tool.
        </p>
        <p>
          Skinova does <strong className="text-white">not</strong> diagnose, treat, cure, or prevent any disease or
          medical condition. Skinova does not replace professional medical advice, dermatology care, or emergency
          treatment. Always consult a qualified healthcare provider for medical concerns.
        </p>
        <p>
          Analysis outputs, scores, routines, coach responses, and progress simulations are informational and may be
          incomplete or inaccurate. You are responsible for how you use this information.
        </p>
      </LegalSection>

      <LegalSection title="Eligibility and accounts">
        <p>
          You must be old enough to consent to these Terms in your jurisdiction. You agree to provide accurate account
          information and to keep your login credentials confidential. You are responsible for activity under your
          account.
        </p>
        <p>
          We may suspend or terminate accounts that violate these Terms, abuse the Service, or create security or legal
          risk.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the Service for unlawful, harmful, or fraudulent purposes.</li>
          <li>Upload content you do not have the right to use, including images of others without permission.</li>
          <li>Attempt to reverse engineer, scrape, overload, or disrupt the Service or its APIs.</li>
          <li>Misrepresent Skinova outputs as medical diagnoses or guaranteed treatment outcomes.</li>
          <li>Circumvent authentication, rate limits, or security controls.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Skin scans and third-party APIs">
        <p>
          Live skin analysis is powered by YouCam Skin AI and related Perfect Corp. API services, subject to their
          applicable terms and usage policies. When you submit a selfie, you authorize Skinova to transmit that image to
          our servers and to the analysis provider solely to deliver the Service.
        </p>
        <p>
          Demo mode may use representative sample data instead of live API analysis. Availability of live analysis depends
          on API configuration, quotas, and service health.
        </p>
      </LegalSection>

      <LegalSection title="Skin Coach">
        <p>
          Skin Coach provides automated, educational responses. It may use your latest scan context when available and
          retrieved knowledge content. Coach responses are not medical advice and should not be relied on for urgent or
          clinical decisions.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          Skinova, its branding, interface, and original content are owned by the project contributors or their licensors.
          YouCam and related marks belong to their respective owners. You receive a limited, non-exclusive,
          non-transferable license to use the Service for personal, non-commercial purposes unless otherwise agreed in
          writing.
        </p>
        <p>
          You retain rights to content you upload. You grant Skinova a limited license to process uploaded selfies and
          related data as needed to operate the Service.
        </p>
      </LegalSection>

      <LegalSection title="Hackathon and demo status">
        <p>
          Skinova was built for the YouCam API Skin AI &amp; Apparel VTO Hackathon and may be offered as a demonstration
          or early-access product. Features, availability, and data handling practices may change as the project evolves.
          The Service is provided without warranties typical of a production consumer health product unless explicitly
          stated otherwise.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer of warranties">
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; TO THE FULLEST EXTENT PERMITTED BY LAW,
          WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR ACCURATE.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          TO THE FULLEST EXTENT PERMITTED BY LAW, SKINOVA AND ITS CONTRIBUTORS WILL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM
          YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE SERVICE WILL NOT EXCEED THE GREATER
          OF (A) THE AMOUNT YOU PAID US IN THE TWELVE MONTHS BEFORE THE CLAIM OR (B) ONE U.S. DOLLAR, EXCEPT WHERE
          LIABILITY CANNOT BE LIMITED BY LAW.
        </p>
      </LegalSection>

      <LegalSection title="Indemnification">
        <p>
          You agree to indemnify and hold harmless Skinova and its contributors from claims, damages, and expenses
          (including reasonable legal fees) arising from your misuse of the Service, your uploaded content, or your
          violation of these Terms.
        </p>
      </LegalSection>

      <LegalSection title="Privacy">
        <p>
          Our collection and use of personal information is described in the{" "}
          <Link href="/privacy" className="text-cyan-200 underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          , which is incorporated into these Terms by reference.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may modify these Terms at any time. We will update the &quot;Last updated&quot; date when changes are
          posted. Material changes may also be communicated through the Service where practical. Continued use after
          changes take effect constitutes acceptance.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These Terms are governed by the laws of the jurisdiction in which the project maintainers operate, without
          regard to conflict-of-law principles, except where mandatory consumer protections in your country apply.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          For questions about these Terms, contact the maintainers through the Skinova repository at{" "}
          <a
            href="https://github.com/imawais-engineer/Skinova"
            className="text-cyan-200 underline-offset-2 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            github.com/imawais-engineer/Skinova
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
