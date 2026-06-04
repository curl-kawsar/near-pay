"use client";

import { cn } from "@/lib/utils";
import { Radio } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/customer", label: "Customer" },
  { href: "/merchant", label: "Merchant" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 shadow-md shadow-teal-600/20">
            <Radio className="h-5 w-5 text-white" strokeWidth={2.25} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Near<span className="text-teal-600">Pay</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
