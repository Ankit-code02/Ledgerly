"use client";

import { Suspense, FormEvent, useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";

type Category = {
  id: number;
  name: string;
  createdAt: string;
};

type Transaction = {
  id: number;
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string;
  transactionDate: string;
  categoryId: number;
  categoryName: string;
};

function EditTransactionContent() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState("");
  const [type, setType] =
    useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("ledgerly_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    async function loadData() {
      try {
        const [transaction, categoryData] = await Promise.all([
          apiRequest<Transaction>(`/api/transactions/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          apiRequest<Category[]>("/api/categories", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setAmount(String(transaction.amount));
        setType(transaction.type);
        setDescription(transaction.description || "");
        setTransactionDate(transaction.transactionDate);
        setCategoryId(String(transaction.categoryId));
        setCategories(categoryData);
      } catch {
        setError("Unable to load transaction.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token = localStorage.getItem("ledgerly_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter an amount greater than zero.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      await apiRequest(`/api/transactions/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: numericAmount,
          type,
          description: description.trim(),
          transactionDate,
          categoryId: Number(categoryId),
        }),
      });

      router.push("/transactions");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update transaction."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F1EA] text-[#1D1D1B]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#1D1D1B]/10 border-t-[#A65332]" />
          <p className="text-sm text-[#6B6860]">
            Loading transaction...
          </p>
        </div>
      </main>
    );
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#F4F1EA] text-[#1D1D1B]">
        <header className="border-b border-[#1D1D1B]/10">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 lg:px-10">
            <button
              type="button"
              onClick={() => router.push("/transactions")}
              className="flex items-center gap-2 text-sm text-[#6B6860] transition hover:text-[#A65332]"
            >
              <ArrowLeft size={17} />
              Back to transactions
            </button>

            <span className="text-xl font-semibold tracking-tight">
              ledgerly.
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <section className="lg:sticky lg:top-8">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-[#A65332]">
                Edit entry
              </p>

              <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Make an adjustment.
              </h1>

              <p className="mt-5 max-w-md leading-7 text-[#6B6860]">
                Update the details below and keep your financial record
                accurate.
              </p>

              <div className="mt-10 hidden border-t border-[#1D1D1B]/10 pt-6 lg:block">
                <div className="flex gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#5F7A61]"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Your changes are safe
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#8A867D]">
                      Saving will update this transaction without
                      affecting your other records.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <form
              onSubmit={handleSubmit}
              className="border border-[#1D1D1B]/10 bg-[#FBF9F4] p-6 sm:p-8"
            >
              <div className="space-y-7">
                <div>
                  <label className="mb-3 block text-sm font-medium">
                    What kind of transaction?
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setType("EXPENSE")}
                      className={`flex items-center justify-center gap-2 border px-4 py-4 text-sm font-medium transition ${
                        type === "EXPENSE"
                          ? "border-[#A65332] bg-[#A65332] text-white"
                          : "border-[#1D1D1B]/15 bg-white text-[#6B6860] hover:border-[#A65332]"
                      }`}
                    >
                      <ArrowUpRight size={17} />
                      Expense
                    </button>

                    <button
                      type="button"
                      onClick={() => setType("INCOME")}
                      className={`flex items-center justify-center gap-2 border px-4 py-4 text-sm font-medium transition ${
                        type === "INCOME"
                          ? "border-[#5F7A61] bg-[#5F7A61] text-white"
                          : "border-[#1D1D1B]/15 bg-white text-[#6B6860] hover:border-[#5F7A61]"
                      }`}
                    >
                      <ArrowDownLeft size={17} />
                      Income
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-medium"
                  >
                    Amount
                  </label>

                  <div className="flex items-center border border-[#1D1D1B]/15 bg-white transition focus-within:border-[#A65332]">
                    <span className="pl-4 text-lg text-[#8A867D]">
                      ₹
                    </span>

                    <input
                      id="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={amount}
                      onChange={(event) =>
                        setAmount(event.target.value)
                      }
                      required
                      className="w-full bg-transparent px-3 py-4 text-lg outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium"
                  >
                    Description
                  </label>

                  <input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    placeholder="e.g. Monthly groceries"
                    maxLength={500}
                    className="w-full border border-[#1D1D1B]/15 bg-white px-4 py-3.5 outline-none transition focus:border-[#A65332]"
                  />

                  <p className="mt-2 text-xs text-[#8A867D]">
                    Keep the description short and meaningful.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    value={categoryId}
                    onChange={(event) =>
                      setCategoryId(event.target.value)
                    }
                    required
                    disabled={categories.length === 0}
                    className="w-full border border-[#1D1D1B]/15 bg-white px-4 py-3.5 outline-none transition focus:border-[#A65332] disabled:cursor-not-allowed disabled:bg-[#EDE9E1]"
                  >
                    {categories.length === 0 ? (
                      <option value="">
                        No categories available
                      </option>
                    ) : (
                      categories.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      ))
                    )}
                  </select>

                  {categories.length === 0 && (
                    <p className="mt-2 text-xs text-[#A65332]">
                      No categories are available.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="transactionDate"
                    className="mb-2 block text-sm font-medium"
                  >
                    Date
                  </label>

                  <input
                    id="transactionDate"
                    type="date"
                    value={transactionDate}
                    onChange={(event) =>
                      setTransactionDate(event.target.value)
                    }
                    required
                    className="w-full border border-[#1D1D1B]/15 bg-white px-4 py-3.5 outline-none transition focus:border-[#A65332]"
                  />
                </div>

                {error && (
                  <div className="border border-[#A65332]/30 bg-[#A65332]/5 px-4 py-3 text-sm leading-6 text-[#A65332]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving || categories.length === 0}
                  className="w-full bg-[#1D1D1B] px-6 py-4 text-sm font-medium text-white transition hover:bg-[#A65332] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving changes..."
                    : "Save changes"}
                </button>

                <p className="text-center text-xs text-[#8A867D]">
                  Your transaction will be updated immediately.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}

export default function EditTransactionPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F4F1EA] text-[#1D1D1B]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#1D1D1B]/10 border-t-[#A65332]" />
            <p className="text-sm text-[#6B6860]">
              Loading transaction...
            </p>
          </div>
        </main>
      }
    >
      <EditTransactionContent />
    </Suspense>
  );
}