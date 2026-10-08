"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CircleDollarSign,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1D1D1B]">
      {/* Navigation */}
      <header className="border-b border-[#1D1D1B]/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <button
            onClick={() => router.push("/")}
            className="text-xl font-semibold tracking-tight"
          >
            ledgerly.
          </button>

          <nav className="hidden items-center gap-8 text-sm text-[#6B6860] md:flex">
            <a href="#how-it-works" className="transition hover:text-[#1D1D1B]">
              How it works
            </a>
            <a href="#features" className="transition hover:text-[#1D1D1B]">
              Features
            </a>
            <a href="#about" className="transition hover:text-[#1D1D1B]">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/login")}
              className="hidden px-4 py-2 text-sm text-[#6B6860] transition hover:text-[#1D1D1B] sm:block"
            >
              Sign in
            </button>

            <button
              onClick={() => router.push("/register")}
              className="bg-[#1D1D1B] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#A65332]"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#1D1D1B]/10">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:py-28">
          <div>
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-[#A65332]" />
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#A65332]">
                Personal finance intelligence
              </p>
            </div>

            <h1 className="max-w-4xl text-6xl font-semibold leading-[0.94] tracking-[-0.045em] sm:text-7xl lg:text-8xl">
              Make your
              <br />
              money make
              <br />
              <span className="text-[#A65332]">sense.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[#6B6860]">
              Ledgerly brings your income, spending, categories, and financial
              position into one clear place, so you can understand your money
              instead of just tracking it.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => router.push("/register")}
                className="group flex items-center gap-3 bg-[#1D1D1B] px-7 py-4 text-sm font-medium text-white transition hover:bg-[#A65332]"
              >
                Start tracking
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => router.push("/login")}
                className="px-6 py-4 text-sm font-medium text-[#6B6860] transition hover:text-[#A65332]"
              >
                I already have an account
              </button>
            </div>
          </div>

          {/* Editorial dashboard preview */}
          <div className="relative">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-[#A65332]/20" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 border border-[#1D1D1B]/10" />

            <div className="relative border border-[#1D1D1B]/15 bg-[#FBF9F4] p-6 shadow-[18px_18px_0_rgba(29,29,27,0.06)]">
              <div className="flex items-start justify-between border-b border-[#1D1D1B]/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8A867D]">
                    Your position
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">
                    ₹84,240
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center bg-[#A65332]/10 text-[#A65332]">
                  <CircleDollarSign size={20} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-[#1D1D1B]/10 py-5">
                <div>
                  <p className="text-xs text-[#8A867D]">Income</p>
                  <p className="mt-1 font-semibold text-[#5F7A61]">
                    +₹1,24,500
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#8A867D]">Expenses</p>
                  <p className="mt-1 font-semibold text-[#A65332]">
                    -₹40,260
                  </p>
                </div>
              </div>

              <div className="pt-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium">Spending overview</p>
                  <BarChart3 size={17} className="text-[#8A867D]" />
                </div>

                <div className="flex h-32 items-end gap-3">
                  <div className="h-[38%] flex-1 bg-[#D8D2C7]" />
                  <div className="h-[58%] flex-1 bg-[#D8D2C7]" />
                  <div className="h-[45%] flex-1 bg-[#D8D2C7]" />
                  <div className="h-[76%] flex-1 bg-[#A65332]" />
                  <div className="h-[61%] flex-1 bg-[#D8D2C7]" />
                  <div className="h-[88%] flex-1 bg-[#1D1D1B]" />
                  <div className="h-[67%] flex-1 bg-[#D8D2C7]" />
                </div>

                <div className="mt-3 flex justify-between text-[10px] uppercase tracking-widest text-[#8A867D]">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl border-t border-[#1D1D1B]/10 px-6 lg:px-10">
          <div className="grid divide-y divide-[#1D1D1B]/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex items-center gap-4 py-6 sm:px-6 sm:first:pl-0">
              <ReceiptText size={19} className="text-[#A65332]" />
              <div>
                <p className="text-sm font-medium">Track transactions</p>
                <p className="text-xs text-[#8A867D]">
                  Every rupee accounted for.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-6 sm:px-6">
              <BarChart3 size={19} className="text-[#A65332]" />
              <div>
                <p className="text-sm font-medium">See your patterns</p>
                <p className="text-xs text-[#8A867D]">
                  Understand where money goes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-6 sm:px-6 sm:last:pr-0">
              <ShieldCheck size={19} className="text-[#A65332]" />
              <div>
                <p className="text-sm font-medium">Private by design</p>
                <p className="text-xs text-[#8A867D]">
                  Your financial data stays yours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32"
      >
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#A65332]">
              How it works
            </p>

            <h2 className="mt-5 max-w-md text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Less bookkeeping.
              <br />
              More understanding.
            </h2>

            <p className="mt-6 max-w-md leading-7 text-[#6B6860]">
              Ledgerly keeps the everyday work simple. Add what happened,
              organize it, and let the numbers tell the story.
            </p>
          </div>

          <div className="border-t border-[#1D1D1B]/15">
            <div className="grid gap-0 sm:grid-cols-3">
              <div className="border-b border-[#1D1D1B]/15 py-7 sm:border-b-0 sm:border-r sm:pr-7">
                <span className="text-sm text-[#A65332]">01</span>
                <h3 className="mt-12 text-lg font-semibold">
                  Add your money
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#6B6860]">
                  Record income and expenses in seconds.
                </p>
              </div>

              <div className="border-b border-[#1D1D1B]/15 py-7 sm:border-b-0 sm:border-r sm:px-7">
                <span className="text-sm text-[#A65332]">02</span>
                <h3 className="mt-12 text-lg font-semibold">
                  Organize it
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#6B6860]">
                  Use categories to give every transaction context.
                </p>
              </div>

              <div className="py-7 sm:pl-7">
                <span className="text-sm text-[#A65332]">03</span>
                <h3 className="mt-12 text-lg font-semibold">
                  Understand it
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#6B6860]">
                  See your balance, spending, and financial patterns clearly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-y border-[#1D1D1B]/10 bg-[#1D1D1B] text-[#F4F1EA]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C87552]">
                Built around your everyday money
              </p>

              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Everything important.
                <br />
                Nothing distracting.
              </h2>
            </div>

            <p className="max-w-sm leading-7 text-[#A9A59C]">
              A focused financial workspace designed to give you clarity
              without turning your finances into a spreadsheet.
            </p>
          </div>

          <div className="mt-16 grid border border-white/10 md:grid-cols-3">
            <div className="border-b border-white/10 p-8 md:border-b-0 md:border-r">
              <ReceiptText size={23} className="text-[#C87552]" />
              <h3 className="mt-16 text-xl font-medium">
                Simple transactions
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#A9A59C]">
                Quickly record income and expenses with the information that
                actually matters.
              </p>
            </div>

            <div className="border-b border-white/10 p-8 md:border-b-0 md:border-r">
              <BarChart3 size={23} className="text-[#C87552]" />
              <h3 className="mt-16 text-xl font-medium">
                Clear financial picture
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#A9A59C]">
                See your balance, income, expenses, and spending breakdown at
                a glance.
              </p>
            </div>

            <div className="p-8">
              <Sparkles size={23} className="text-[#C87552]" />
              <h3 className="mt-16 text-xl font-medium">
                Built to evolve
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#A9A59C]">
                Ledgerly is designed as a foundation for deeper financial
                insights as your data grows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About / CTA */}
      <section
        id="about"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#A65332]">
              Start with clarity
            </p>

            <h2 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1] tracking-tight sm:text-6xl">
              Your money has a story.
              <br />
              <span className="text-[#A65332]">
                Ledgerly helps you read it.
              </span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="leading-7 text-[#6B6860]">
              Start recording your finances today and build a clearer picture
              of where your money is actually going.
            </p>

            <button
              onClick={() => router.push("/register")}
              className="group mt-7 flex items-center gap-3 border-b border-[#1D1D1B] pb-2 text-sm font-medium transition hover:border-[#A65332] hover:text-[#A65332]"
            >
              Create your Ledgerly account
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1D1D1B]/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-7 text-xs text-[#8A867D] sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>ledgerly.</p>
          <p>Personal finance, made clearer.</p>
          <p>© 2026 Ledgerly</p>
        </div>
      </footer>
    </main>
  );
}