import { signIn } from "@/lib/auth";
import Link from "next/link";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const callbackUrl = sp?.callbackUrl ?? "/app";

  const hasGoogle = !!process.env.GOOGLE_CLIENT_ID;
  const hasEmail =
    !!process.env.RESEND_API_KEY || !!process.env.EMAIL_SERVER_HOST;

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
          {hasGoogle && (
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: callbackUrl });
              }}
            >
              <button className="btn-outline w-full justify-center h-10">
                <GoogleIcon />
                Google ile devam et
              </button>
            </form>
          )}

          {hasEmail && (
            <form
              action={async (formData) => {
                "use server";
                const email = String(formData.get("email") ?? "").trim();
                if (!email) return;
                await signIn(
                  process.env.RESEND_API_KEY ? "resend" : "nodemailer",
                  { email, redirectTo: callbackUrl },
                );
              }}
              className="space-y-2"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="ornek@sirket.com"
                className="input h-10"
              />
              <button className="btn-primary w-full justify-center h-10">
                Magic link gönder
              </button>
            </form>
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0012 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18a10.99 10.99 0 000 9.86l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
