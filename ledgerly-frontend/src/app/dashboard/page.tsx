"use client";

import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Utensils,
  Car,
  ShoppingBag,
  Plus,
  ReceiptText,
  Tags,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

type Transaction = {
  id: number;
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string;
  transactionDate: string;
  categoryId: number;
  categoryName: string;
};

type DashboardResponse = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  expenseByCategory: Record<string, number>;
};

type User = {
  userId: number;
  name: string;
  email: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [user] = useState<User | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedUser = localStorage.getItem("ledgerly_user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ledgerly_token");

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    async function loadDashboard() {
      try {
        const [dashboardData, transactionData] =
          await Promise.all([
            apiRequest<DashboardResponse>("/api/dashboard", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            apiRequest<Transaction[]>("/api/transactions", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        setDashboard(dashboardData);
        setTransactions(transactionData);
      } catch {
        localStorage.removeItem("ledgerly_token");
        localStorage.removeItem("ledgerly_user");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router, user]);

  if (loading || !dashboard || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F1EA] text-[#1D1D1B]">
        <p className="text-sm text-[#6B6860]">
          Loading your finances...
        </p>
      </main>
    );
  }

  const categories = Object.entries(
    dashboard.expenseByCategory
  ).sort((a, b) => b[1] - a[1]);

  const savingsRate =
    dashboard.totalIncome > 0
      ? (dashboard.balance / dashboard.totalIncome) * 100
      : 0;

  const expenseRate =
    dashboard.totalIncome > 0
      ? (dashboard.totalExpense / dashboard.totalIncome) * 100
      : 0;

  const firstName = user.name.split(" ")[0];

  let financialMessage = "Start by recording your first transaction.";
  let financialTone = "text-[#6B6860]";

  if (transactions.length > 0 && dashboard.balance > 0) {
    financialMessage =
      "Your current position is positive. Keep building the habit.";
    financialTone = "text-[#5F7A61]";
  } else if (dashboard.totalExpense > dashboard.totalIncome) {
    financialMessage =
      "Your expenses are currently higher than your income.";
    financialTone = "text-[#A65332]";
  } else if (transactions.length > 0) {
    financialMessage =
      "Your activity is recorded. Keep an eye on your spending patterns.";
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#F4F1EA] text-[#1D1D1B]">
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-12">

          {/* Header */}
          <section className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-[#A65332]">
                Financial overview
              </p>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Good to see you, {firstName}.
              </h1>

              <p className="mt-3 max-w-xl text-[#6B6860]">
                A clear view of what is coming in, going out, and where
                your money is going.
              </p>
            </div>

            <button
              onClick={() => router.push("/transactions/new")}
              className="group flex w-fit items-center gap-3 bg-[#1D1D1B] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#A65332]"
            >
              <Plus size={17} />
              Add transaction
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </section>

          {/* Main balance */}
          <section className="mb-5 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">

            <div className="relative overflow-hidden bg-[#1D1D1B] p-7 text-[#F4F1EA] sm:p-9">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border border-[#C87958]/20" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#A9A59C]">
                      Current balance
                    </p>

                    <p className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
                      ₹
                      {dashboard.balance.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center border border-white/10 bg-white/5">
                    <Wallet
                      size={22}
                      strokeWidth={1.5}
                      className="text-[#C87958]"
                    />
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-5">
                  <div>
                    <p className="text-xs text-[#A9A59C]">
                      Savings position
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {savingsRate.toFixed(0)}% of income
                    </p>
                  </div>

                  <div className="h-8 w-px bg-white/10" />

                  <div>
                    <p className="text-xs text-[#A9A59C]">
                      Recorded activity
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {transactions.length} transaction
                      {transactions.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#1D1D1B]/10 bg-[#FBF9F4] p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-[#A65332]">
                Financial note
              </p>

              <p className={`mt-5 text-lg font-medium leading-7 ${financialTone}`}>
                {financialMessage}
              </p>

              <div className="mt-8 border-t border-[#1D1D1B]/10 pt-5">
                <p className="text-xs text-[#8A867D]">
                  Expense-to-income ratio
                </p>

                <div className="mt-3 flex items-end justify-between">
                  <p className="text-3xl font-semibold">
                    {expenseRate.toFixed(0)}%
                  </p>

                  {dashboard.totalExpense <= dashboard.totalIncome ? (
                    <TrendingDown
                      size={20}
                      className="text-[#5F7A61]"
                    />
                  ) : (
                    <TrendingUp
                      size={20}
                      className="text-[#A65332]"
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Financial summary */}
          <section className="mb-5 grid gap-px overflow-hidden border border-[#1D1D1B]/10 bg-[#1D1D1B]/10 sm:grid-cols-2">

            <div className="bg-[#FBF9F4] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8A867D]">
                    Total income
                  </p>

                  <p className="mt-4 text-3xl font-semibold">
                    ₹
                    {dashboard.totalIncome.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center bg-[#5F7A61]/10">
                  <ArrowDownLeft
                    size={19}
                    className="text-[#5F7A61]"
                  />
                </div>
              </div>

              <p className="mt-4 text-xs text-[#8A867D]">
                Money recorded as income
              </p>
            </div>

            <div className="bg-[#FBF9F4] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8A867D]">
                    Total expenses
                  </p>

                  <p className="mt-4 text-3xl font-semibold">
                    ₹
                    {dashboard.totalExpense.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center bg-[#A65332]/10">
                  <ArrowUpRight
                    size={19}
                    className="text-[#A65332]"
                  />
                </div>
              </div>

              <p className="mt-4 text-xs text-[#8A867D]">
                Money recorded as expenses
              </p>
            </div>
          </section>

          {/* Quick actions */}
          <section className="mb-10 grid gap-3 sm:grid-cols-3">
            <button
              onClick={() => router.push("/transactions/new")}
              className="group border border-[#1D1D1B]/10 bg-[#FBF9F4] p-5 text-left transition hover:border-[#A65332]"
            >
              <Plus
                size={18}
                className="text-[#A65332]"
              />

              <p className="mt-6 text-sm font-medium">
                Add transaction
              </p>

              <p className="mt-1 text-xs leading-5 text-[#8A867D]">
                Record income or an expense.
              </p>

              <ArrowRight
                size={15}
                className="mt-4 text-[#8A867D] transition-transform group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={() => router.push("/transactions")}
              className="group border border-[#1D1D1B]/10 bg-[#FBF9F4] p-5 text-left transition hover:border-[#A65332]"
            >
              <ReceiptText
                size={18}
                className="text-[#A65332]"
              />

              <p className="mt-6 text-sm font-medium">
                View transactions
              </p>

              <p className="mt-1 text-xs leading-5 text-[#8A867D]">
                Review and manage your activity.
              </p>

              <ArrowRight
                size={15}
                className="mt-4 text-[#8A867D] transition-transform group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={() => router.push("/categories")}
              className="group border border-[#1D1D1B]/10 bg-[#FBF9F4] p-5 text-left transition hover:border-[#A65332]"
            >
              <Tags
                size={18}
                className="text-[#A65332]"
              />

              <p className="mt-6 text-sm font-medium">
                Manage categories
              </p>

              <p className="mt-1 text-xs leading-5 text-[#8A867D]">
                Organize your spending.
              </p>

              <ArrowRight
                size={15}
                className="mt-4 text-[#8A867D] transition-transform group-hover:translate-x-1"
              />
            </button>
          </section>

          {/* Spending */}
          <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">

            <div className="border border-[#1D1D1B]/10 bg-[#FBF9F4] p-7">
              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.18em] text-[#A65332]">
                  Spending
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Where your money goes
                </h2>

                <p className="mt-2 text-sm text-[#8A867D]">
                  Your expense distribution by category.
                </p>
              </div>

              {categories.length === 0 ? (
                <div className="border border-dashed border-[#1D1D1B]/15 py-12 text-center">
                  <p className="text-sm text-[#6B6860]">
                    No expenses recorded yet.
                  </p>

                  <button
                    onClick={() =>
                      router.push("/transactions/new")
                    }
                    className="mt-4 text-sm font-medium text-[#A65332] hover:underline"
                  >
                    Add an expense
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {categories.map(([category, amount]) => {
                    const percentage =
                      dashboard.totalExpense > 0
                        ? (amount / dashboard.totalExpense) * 100
                        : 0;

                    return (
                      <div key={category}>
                        <div className="mb-2 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <CategoryIcon category={category} />

                            <span className="text-sm font-medium">
                              {category}
                            </span>
                          </div>

                          <span className="text-sm font-medium">
                            ₹
                            {amount.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>

                        <div className="h-2 bg-[#E5E0D7]">
                          <div
                            className="h-full bg-[#A65332]"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <p className="mt-1 text-xs text-[#8A867D]">
                          {percentage.toFixed(0)}% of expenses
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent activity */}
            <div className="border border-[#1D1D1B]/10 bg-[#FBF9F4]">
              <div className="flex items-end justify-between border-b border-[#1D1D1B]/10 px-6 py-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#A65332]">
                    Activity
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    Recent
                  </h2>
                </div>

                <button
                  onClick={() => router.push("/transactions")}
                  className="text-xs font-medium text-[#A65332] hover:underline"
                >
                  View all
                </button>
              </div>

              {transactions.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-sm text-[#6B6860]">
                    No transactions yet.
                  </p>

                  <button
                    onClick={() =>
                      router.push("/transactions/new")
                    }
                    className="mt-4 text-sm font-medium text-[#A65332] hover:underline"
                  >
                    Record your first one
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#1D1D1B]/10">
                  {transactions.slice(0, 6).map((transaction) => (
                    <button
                      key={transaction.id}
                      onClick={() =>
                        router.push(
                          `/transactions/${transaction.id}/edit`
                        )
                      }
                      className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition hover:bg-[#F4F1EA]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center ${
                            transaction.type === "INCOME"
                              ? "bg-[#5F7A61]/10 text-[#5F7A61]"
                              : "bg-[#A65332]/10 text-[#A65332]"
                          }`}
                        >
                          {transaction.type === "INCOME" ? (
                            <ArrowDownLeft size={16} />
                          ) : (
                            <ArrowUpRight size={16} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {transaction.description ||
                              "Untitled transaction"}
                          </p>

                          <p className="mt-1 truncate text-xs text-[#8A867D]">
                            {transaction.categoryName} ·{" "}
                            {transaction.transactionDate}
                          </p>
                        </div>
                      </div>

                      <p
                        className={`whitespace-nowrap text-sm font-semibold ${
                          transaction.type === "INCOME"
                            ? "text-[#5F7A61]"
                            : "text-[#A65332]"
                        }`}
                      >
                        {transaction.type === "INCOME" ? "+" : "-"}₹
                        {transaction.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Bottom note */}
          <section className="mt-8 flex flex-col justify-between gap-4 border-t border-[#1D1D1B]/10 pt-6 sm:flex-row sm:items-center">
            <p className="text-xs text-[#8A867D]">
              Ledgerly gives you a clearer view of the money you have
              recorded.
            </p>

            <button
              onClick={() => router.push("/transactions")}
              className="flex items-center gap-2 text-xs font-medium text-[#A65332] hover:underline"
            >
              Review your ledger
              <ArrowRight size={14} />
            </button>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}

function CategoryIcon({
  category,
}: {
  category: string;
}) {
  const name = category.toLowerCase();

  if (name.includes("food")) {
    return (
      <Utensils
        size={17}
        className="text-[#A65332]"
      />
    );
  }

  if (name.includes("transport")) {
    return (
      <Car
        size={17}
        className="text-[#A65332]"
      />
    );
  }

  if (name.includes("shopping")) {
    return (
      <ShoppingBag
        size={17}
        className="text-[#A65332]"
      />
    );
  }

  return (
    <div className="h-4 w-4 rounded-full border-2 border-[#A65332]" />
  );
}