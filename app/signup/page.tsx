import type { Metadata } from "next";
import { AuthForm } from "../components/auth-form";

export const metadata: Metadata = {
  title: "Sign Up — Skinova",
  description: "Create your Skinova account."
};

export default function SignupPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AuthForm mode="signup" nextPath="/dashboard" />
      </div>
    </main>
  );
}
