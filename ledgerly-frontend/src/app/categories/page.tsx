"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ArrowRight,
  Plus,
  Tags,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { apiRequest } from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";

type Category = {
  id: number;
  name: string;
};

export default function CategoriesPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadCategories = useCallback(async () => {
    const token = localStorage.getItem("ledgerly_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const data = await apiRequest<Category[]>(
        "/api/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories(data);
    } catch {
      localStorage.removeItem("ledgerly_token");
      localStorage.removeItem("ledgerly_user");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCategories();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadCategories]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    const token = localStorage.getItem("ledgerly_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setError("");
    setCreating(true);

    try {
      await apiRequest<Category>("/api/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      setName("");
      await loadCategories();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create category."
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#F4F1EA] text-[#1D1D1B]">
        <Navbar />

        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10 lg:py-14">

          {/* Header */}
          <section className="mb-12">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-[#A65332]">
              Organisation
            </p>

            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Categories
                </h1>

                <p className="mt-4 max-w-xl leading-7 text-[#6B6860]">
                  Give your transactions structure with categories that
                  reflect how you actually spend and earn.
                </p>
              </div>

              <div className="flex items-center gap-3 border border-[#1D1D1B]/10 bg-[#FBF9F4] px-4 py-3">
                <Tags
                  size={18}
                  className="text-[#A65332]"
                />

                <div>
                  <p className="text-lg font-semibold leading-none">
                    {categories.length}
                  </p>

                  <p className="mt-1 text-xs text-[#8A867D]">
                    {categories.length === 1
                      ? "category"
                      : "categories"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">

            {/* Create */}
            <section className="border border-[#1D1D1B]/10 bg-[#FBF9F4] p-6 sm:p-8">
              <div className="mb-8">
                <div className="mb-5 flex h-11 w-11 items-center justify-center bg-[#1D1D1B] text-[#F4F1EA]">
                  <Plus size={19} />
                </div>

                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#A65332]">
                  New category
                </p>

                <h2 className="text-2xl font-semibold tracking-tight">
                  Add a category
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#8A867D]">
                  Create a label you can use when recording transactions.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="category-name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Category name
                  </label>

                  <input
                    id="category-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="e.g. Groceries"
                    maxLength={100}
                    className="w-full border border-[#1D1D1B]/15 bg-[#F4F1EA] px-4 py-3.5 outline-none transition focus:border-[#A65332]"
                  />
                </div>

                {error && (
                  <div className="border border-[#A65332]/30 bg-[#A65332]/5 px-4 py-3 text-sm leading-6 text-[#A65332]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={creating}
                  className="flex w-full items-center justify-center gap-2 bg-[#1D1D1B] px-6 py-4 text-sm font-medium text-white transition hover:bg-[#A65332] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={17} />

                  {creating
                    ? "Adding category..."
                    : "Add category"}
                </button>
              </form>
            </section>

            {/* Category list */}
            <section className="border border-[#1D1D1B]/10 bg-[#FBF9F4]">
              <div className="flex items-center justify-between border-b border-[#1D1D1B]/10 px-6 py-5 sm:px-8">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A65332]">
                    Your organisation
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    Your categories
                  </h2>
                </div>

                <Tags
                  size={20}
                  className="text-[#A65332]"
                />
              </div>

              {loading ? (
                <div className="px-6 py-16 text-center sm:px-8">
                  <div className="mx-auto mb-4 h-7 w-7 animate-spin rounded-full border-2 border-[#1D1D1B]/10 border-t-[#A65332]" />

                  <p className="text-sm text-[#6B6860]">
                    Loading categories...
                  </p>
                </div>
              ) : categories.length === 0 ? (
                <div className="px-6 py-16 text-center sm:px-8">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#1D1D1B]/10">
                    <Tags
                      size={20}
                      className="text-[#A65332]"
                    />
                  </div>

                  <p className="mt-5 font-medium">
                    No categories yet.
                  </p>

                  <p className="mt-2 text-sm text-[#8A867D]">
                    Create your first category using the form.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#1D1D1B]/10">
                  {categories.map((category, index) => (
                    <div
                      key={category.id}
                      className="group flex items-center justify-between px-6 py-5 transition hover:bg-[#F4F1EA] sm:px-8"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="text-xs tabular-nums text-[#A65332]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="h-2 w-2 shrink-0 rounded-full bg-[#A65332]" />

                        <span className="truncate font-medium">
                          {category.name}
                        </span>
                      </div>

                      <ArrowRight
                        size={16}
                        className="text-[#B4B0A7] transition group-hover:translate-x-1 group-hover:text-[#A65332]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="mt-8 flex flex-wrap gap-6">
            <button
              onClick={() => router.push("/transactions/new")}
              className="flex items-center gap-2 text-sm font-medium text-[#A65332] hover:underline"
            >
              Add a transaction
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm font-medium text-[#6B6860] hover:text-[#1D1D1B] hover:underline"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}