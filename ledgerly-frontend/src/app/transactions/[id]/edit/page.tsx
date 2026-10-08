import { Suspense } from "react";
import EditTransactionClient from "./EditTransactionClient";

type EditTransactionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditTransactionPage({
  params,
}: EditTransactionPageProps) {
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
      <EditTransactionClient params={params} />
    </Suspense>
  );
}