import type { Metadata } from "next";
import { AuthForm } from "../components/auth-form";

export const metadata: Metadata = {
  title: "Log In — Skinova",
  description: "Sign in to your Skinova account."
};

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next && params.next.startsWith("/") ? params.next : "/dashboard";

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AuthForm mode="login" nextPath={nextPath} />
      </div>
    </main>
  );
}
