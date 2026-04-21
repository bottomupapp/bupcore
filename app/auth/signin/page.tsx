import Link from "next/link";
import { GoogleSignInButton, EmailSignInForm } from "./signin-buttons";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const callbackUrl = sp?.callbackUrl ?? "/studio";

  const hasGoogle = !!process.env.GOOGLE_CLIENT_ID;
  const hasEmail =
    !!process.env.RESEND_API_KEY || !!process.env.EMAIL_SERVER_HOST;
  const emailProvider: "resend" | "nodemailer" = process.env.RESEND_API_KEY
    ? "resend"
    : "nodemailer";

  return (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="card w-full max-w-md p-8">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-accent" />
          <span className="font-semibold">Studio</span>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight">Giriş yap</h1>
        <p className="text-muted text-sm mt-1">
          Google ya da magic link ile devam et.
        </p>

        {sp?.error && (
          <p className="mt-4 rounded-md bg-red-100 text-red-800 px-3 py-2 text-sm">
            Giriş hatası: {sp.error}
          </p>
        )}

        <div className="mt-6 space-y-3">
          {hasGoogle && <GoogleSignInButton callbackUrl={callbackUrl} />}
          {hasEmail && (
            <EmailSignInForm
              callbackUrl={callbackUrl}
              provider={emailProvider}
            />
          )}
          {!hasGoogle && !hasEmail && (
            <p className="text-sm text-muted">
              Auth provider ayarlı değil. <code>.env</code> dosyasına{" "}
              <code>GOOGLE_CLIENT_ID</code> veya <code>RESEND_API_KEY</code>{" "}
              ekleyin.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
