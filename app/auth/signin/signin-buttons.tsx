"use client";

import { useState } from "react";

export function GoogleSignInButton({ callbackUrl }: { callbackUrl: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const csrfRes = await fetch("/api/auth/csrf", { cache: "no-store" });
      const { csrfToken } = await csrfRes.json();
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/api/auth/signin/google";
      const csrfInput = document.createElement("input");
      csrfInput.type = "hidden";
      csrfInput.name = "csrfToken";
      csrfInput.value = csrfToken;
      form.appendChild(csrfInput);
      const cbInput = document.createElement("input");
      cbInput.type = "hidden";
      cbInput.name = "callbackUrl";
      cbInput.value = callbackUrl;
      form.appendChild(cbInput);
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setLoading(false);
      alert("Google signin hatası: " + (err as Error).message);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleClick}
      className="btn-outline w-full justify-center h-10"
    >
      <GoogleIcon />
      {loading ? "Yönlendiriliyor..." : "Google ile devam et"}
    </button>
  );
}

export function EmailSignInForm({
  callbackUrl,
  provider,
}: {
  callbackUrl: string;
  provider: "resend" | "nodemailer";
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const email = String(formData.get("email") ?? "").trim();
      if (!email) return;

      const csrfRes = await fetch("/api/auth/csrf", { cache: "no-store" });
      const { csrfToken } = await csrfRes.json();

      const form = document.createElement("form");
      form.method = "POST";
      form.action = `/api/auth/signin/${provider}`;
      for (const [name, value] of [
        ["csrfToken", csrfToken],
        ["callbackUrl", callbackUrl],
        ["email", email],
      ]) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setLoading(false);
      alert("Magic link hatası: " + (err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="email"
        name="email"
        required
        placeholder="ornek@sirket.com"
        className="input h-10"
      />
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center h-10"
      >
        {loading ? "Gönderiliyor..." : "Magic link gönder"}
      </button>
    </form>
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
