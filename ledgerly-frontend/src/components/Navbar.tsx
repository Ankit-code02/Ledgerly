"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Menu,
  Receipt,
  Tags,
  X,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/transactions",
      label: "Transactions",
      icon: Receipt,
    },
    {
      href: "/categories",
      label: "Categories",
      icon: Tags,
    },
  ];

  function logout() {
    localStorage.removeItem("ledgerly_token");
    localStorage.removeItem("ledgerly_user");
    router.replace("/login");
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="border-b border-[#1D1D1B]/10 bg-[#F4F1EA]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Main navigation */}
        <div className="flex h-[72px] items-center justify-between">
          <Link
            href="/dashboard"
            onClick={closeMobileMenu}
            className="text-xl font-semibold tracking-tight"
          >
            ledgerly.
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-[#1D1D1B] text-white"
                      : "text-[#6B6860] hover:bg-[#FBF9F4] hover:text-[#1D1D1B]"
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop sign out */}
          <button
            type="button"
            onClick={logout}
            className="hidden items-center gap-2 px-3 py-2 text-sm text-[#6B6860] transition hover:text-[#A65332] sm:flex"
          >
            <LogOut size={16} />
            Sign out
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center text-[#1D1D1B] md:hidden"
          >
            {mobileOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {mobileOpen && (
          <div className="border-t border-[#1D1D1B]/10 py-4 md:hidden">
            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-[#1D1D1B] text-white"
                        : "text-[#6B6860] hover:bg-[#FBF9F4] hover:text-[#1D1D1B]"
                    }`}
                  >
                    <Icon size={17} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 border-t border-[#1D1D1B]/10 pt-3">
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-[#6B6860] transition hover:bg-[#FBF9F4] hover:text-[#A65332]"
              >
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}