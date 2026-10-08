"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

type LoginResponse = {
  token: string;
  userId: number;
  name: string;
  email: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await apiRequest<LoginResponse>(
        "/api/users/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: trimmedEmail,
            password,
          }),
        }
      );

      localStorage.setItem(
        "ledgerly_token",
        response.token
      );

      localStorage.setItem(
        "ledgerly_user",
        JSON.stringify({
          userId: response.userId,
          name: response.name,
          email: response.email,
        })
      );

      router.push("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1D1D1B]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* Brand panel */}
        <section className="relative hidden overflow-hidden bg-[#1D1D1B] p-12 text-[#F4F1EA] lg:flex lg:flex-col lg:justify-between xl:p-16">

          <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full border border-[#C87958]/20" />

          <Link
            href="/"
            className="relative z-10 text-xl font-semibold tracking-tight"
          >
            ledgerly.
          </Link>

          <div className="relative z-10 max-w-xl">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-[#C87958]">
              Personal Finance Intelligence
            </p>

            <h1 className="text-6xl font-semibold leading-[1.02] tracking-tight xl:text-7xl">
              Your money,
              <br />
              clearly understood.
            </h1>

            <p className="mt-8 max-w-md text-base leading-7 text-[#B8B4AB]">
              Keep track of what comes in, what goes out, and where
              your financial position stands.
            </p>

            <div className="mt-10 grid max-w-md grid-cols-2 gap-px border border-white/10 bg-white/10">
              <div className="bg-[#1D1D1B] px-5 py-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#77736B]">
                  Track
                </p>

                <p className="mt-2 text-sm font-medium">
                  Every transaction
                </p>
              </div>

              <div className="bg-[#1D1D1B] px-5 py-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#77736B]">
                  Understand
                </p>

                <p className="mt-2 text-sm font-medium">
                  Your financial picture
                </p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs text-[#77736B]">
            © 2026 Ledgerly
          </p>
        </section>

        {/* Login panel */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:min-h-0 lg:px-14 xl:px-20">
          <div className="w-full max-w-md">

            <div className="mb-12 lg:hidden">
              <Link
                href="/"
                className="text-xl font-semibold tracking-tight"
              >
                ledgerly.
              </Link>
            </div>

            <div className="mb-9">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-[#A65332]">
                Welcome back
              </p>

              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Sign in
              </h2>

              <p className="mt-4 leading-6 text-[#6B6860]">
                Access your personal finance dashboard.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A867D]"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full border border-[#1D1D1B]/15 bg-[#FBF9F4] py-3.5 pl-11 pr-4 outline-none transition placeholder:text-[#B4B0A7] focus:border-[#A65332] focus:bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A867D]"
                  />

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full border border-[#1D1D1B]/15 bg-[#FBF9F4] py-3.5 pl-11 pr-4 outline-none transition placeholder:text-[#B4B0A7] focus:border-[#A65332] focus:bg-white"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="border border-[#A65332]/30 bg-[#A65332]/5 px-4 py-3 text-sm leading-6 text-[#A65332]"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 bg-[#1D1D1B] px-6 py-4 text-sm font-medium text-white transition hover:bg-[#A65332] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#1D1D1B]/10" />
              <span className="text-xs text-[#8A867D]">
                New to Ledgerly?
              </span>
              <div className="h-px flex-1 bg-[#1D1D1B]/10" />
            </div>

            <Link
              href="/register"
              className="flex w-full items-center justify-center border border-[#1D1D1B]/15 bg-[#FBF9F4] px-6 py-3.5 text-sm font-medium transition hover:border-[#A65332] hover:text-[#A65332]"
            >
              Create an account
            </Link>

            <p className="mt-8 text-center text-xs leading-5 text-[#8A867D]">
              Your financial data is protected behind authenticated
              access.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}