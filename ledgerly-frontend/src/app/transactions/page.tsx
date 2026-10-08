"use client";

import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpLeft,
  ArrowUpRight,
  CalendarDays,
  Pencil,
  Plus,
  Receipt,
  Trash2,
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

type Filter = "ALL" | "INCOME" | "EXPENSE";

export default function TransactionsPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("ledgerly_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    async function loadTransactions() {
      setLoading(true);

      try {
        const endpoint =
          filter === "ALL"
            ? "/api/transactions"
            : `/api/transactions?type=${filter}`;

        const data = await apiRequest<Transaction[]>(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTransactions(data);
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [filter, router]);

  async function deleteTransaction(id: number) {
    const token = localStorage.getItem("ledgerly_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    try {
      await apiRequest<void>(`/api/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions((current) =>
        current.filter(
          (transaction) => transaction.id !== id
        )
      );
    } catch {
      window.alert("Unable to delete transaction.");
    } finally {
      setDeletingId(null);
    }
  }

  const incomeTotal = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const expenseTotal = transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F1EA] text-[#1D1D1B]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-7 w-7 animate-spin rounded-full border-2 border-[#1D1D1B]/10 border-t-[#A65332]" />
          <p className="text-sm text-[#6B6860]">
            Loading transactions...
          </p>
        </div>
      </main>
    );
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#F4F1EA] text-[#1D1D1B]">
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">

          {/* Header */}
          <section className="mb-10">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-[#A65332]">
                  Ledger
                </p>

                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Transactions
                </h1>

                <p className="mt-4 max-w-xl leading-7 text-[#6B6860]">
                  A clear record of everything coming in and going out.
                </p>
              </div>

              <button
                onClick={() =>
                  router.push("/transactions/new")
                }
                className="flex items-center justify-center gap-2 bg-[#1D1D1B] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#A65332]"
              >
                <Plus size={17} />
                Add transaction
              </button>
            </div>
          </section>

          {/* Summary */}
          <section className="mb-8 grid gap-px border border-[#1D1D1B]/10 bg-[#1D1D1B]/10 sm:grid-cols-3">
            <div className="bg-[#FBF9F4] px-6 py-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8A867D]">
                Showing
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {transactions.length}
              </p>

              <p className="mt-1 text-xs text-[#8A867D]">
                {transactions.length === 1
                  ? "transaction"
                  : "transactions"}
              </p>
            </div>

            <div className="bg-[#FBF9F4] px-6 py-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8A867D]">
                Income
              </p>

              <p className="mt-2 text-2xl font-semibold text-[#5F7A61]">
                +₹
                {incomeTotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="bg-[#FBF9F4] px-6 py-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8A867D]">
                Expenses
              </p>

              <p className="mt-2 text-2xl font-semibold text-[#A65332]">
                -₹
                {expenseTotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </section>

          {/* Filters */}
          <section className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              {(["ALL", "INCOME", "EXPENSE"] as const).map(
                (option) => (
                  <button
                    key={option}
                    onClick={() => setFilter(option)}
                    className={`px-5 py-2.5 text-sm font-medium transition ${
                      filter === option
                        ? "bg-[#1D1D1B] text-white"
                        : "border border-[#1D1D1B]/15 bg-[#FBF9F4] text-[#6B6860] hover:border-[#A65332] hover:text-[#1D1D1B]"
                    }`}
                  >
                    {option === "ALL"
                      ? "All"
                      : option === "INCOME"
                        ? "Income"
                        : "Expenses"}
                  </button>
                )
              )}
            </div>

            <p className="text-xs text-[#8A867D]">
              {filter === "ALL"
                ? "All activity"
                : filter === "INCOME"
                  ? "Income only"
                  : "Expenses only"}
            </p>
          </section>

          {/* Transactions */}
          <section className="overflow-hidden border border-[#1D1D1B]/10 bg-[#FBF9F4]">
            {transactions.length === 0 ? (
              <div className="px-6 py-20 text-center sm:px-8">
                <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#1D1D1B]/10">
                  <Receipt
                    size={22}
                    className="text-[#A65332]"
                  />
                </div>

                <h2 className="mt-5 font-semibold">
                  No transactions found
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8A867D]">
                  {filter === "ALL"
                    ? "Your financial activity will appear here once you add your first transaction."
                    : "There are no transactions matching this filter."}
                </p>

                <button
                  onClick={() =>
                    router.push("/transactions/new")
                  }
                  className="mt-6 inline-flex items-center gap-2 bg-[#1D1D1B] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#A65332]"
                >
                  <Plus size={16} />
                  Add transaction
                </button>
              </div>
            ) : (
              <>
                {/* Desktop heading */}
                <div className="hidden border-b border-[#1D1D1B]/10 px-6 py-4 text-xs uppercase tracking-[0.16em] text-[#8A867D] md:grid md:grid-cols-[1fr_160px_110px] md:items-center lg:px-8">
                  <span>Transaction</span>
                  <span>Date</span>
                  <span className="text-right">Amount</span>
                </div>

                <div className="divide-y divide-[#1D1D1B]/10">
                  {transactions.map((transaction) => {
                    const isIncome =
                      transaction.type === "INCOME";

                    return (
                      <div
                        key={transaction.id}
                        className="group px-5 py-5 transition hover:bg-[#F4F1EA] sm:px-6 lg:px-8"
                      >
                        <div className="grid gap-5 md:grid-cols-[1fr_160px_110px] md:items-center">

                          {/* Transaction */}
                          <div className="flex min-w-0 items-center gap-4">
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center ${
                                isIncome
                                  ? "bg-[#5F7A61]/10 text-[#5F7A61]"
                                  : "bg-[#A65332]/10 text-[#A65332]"
                              }`}
                            >
                              {isIncome ? (
                                <ArrowDownLeft size={19} />
                              ) : (
                                <ArrowUpRight size={19} />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {transaction.description ||
                                  "Untitled transaction"}
                              </p>

                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#8A867D]">
                                <span>
                                  {transaction.categoryName}
                                </span>

                                <span className="text-[#B4B0A7]">
                                  •
                                </span>

                                <span>
                                  {isIncome
                                    ? "Income"
                                    : "Expense"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Date */}
                          <div className="flex items-center gap-2 text-sm text-[#6B6860]">
                            <CalendarDays
                              size={15}
                              className="shrink-0 text-[#A65332]"
                            />

                            <span>
                              {transaction.transactionDate}
                            </span>
                          </div>

                          {/* Amount + actions */}
                          <div className="flex items-center justify-between gap-4 md:justify-end">
                            <p
                              className={`text-base font-semibold ${
                                isIncome
                                  ? "text-[#5F7A61]"
                                  : "text-[#A65332]"
                              }`}
                            >
                              {isIncome ? "+" : "-"}₹
                              {transaction.amount.toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                }
                              )}
                            </p>

                            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:transition md:group-hover:opacity-100">
                              <button
                                type="button"
                                title="Edit transaction"
                                aria-label="Edit transaction"
                                onClick={() =>
                                  router.push(
                                    `/transactions/${transaction.id}/edit`
                                  )
                                }
                                className="p-2 text-[#6B6860] transition hover:text-[#A65332]"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                type="button"
                                title="Delete transaction"
                                aria-label="Delete transaction"
                                disabled={
                                  deletingId === transaction.id
                                }
                                onClick={() =>
                                  deleteTransaction(
                                    transaction.id
                                  )
                                }
                                className="p-2 text-[#6B6860] transition hover:text-[#A65332] disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          <div className="mt-8 flex items-center gap-2 text-xs text-[#8A867D]">
            <ArrowUpLeft size={14} />
            Transactions are displayed with the newest activity first.
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}