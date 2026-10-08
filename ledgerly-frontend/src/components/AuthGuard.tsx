"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const token = localStorage.getItem("ledgerly_token");
    const user = localStorage.getItem("ledgerly_user");

    return Boolean(token && user);
  });

  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (
        event.key !== "ledgerly_token" &&
        event.key !== "ledgerly_user"
      ) {
        return;
      }

      const token = localStorage.getItem("ledgerly_token");
      const user = localStorage.getItem("ledgerly_user");

      const isAuthenticated = Boolean(token && user);

      setAuthorized(isAuthenticated);

      if (!isAuthenticated) {
        router.replace("/login");
      }
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router]);

  useEffect(() => {
    if (!authorized) {
      router.replace("/login");
    }
  }, [authorized, router]);

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F1EA] text-[#1D1D1B]">
        <p className="text-sm text-[#6B6860]">
          Checking your session...
        </p>
      </main>
    );
  }

  return <>{children}</>;
}