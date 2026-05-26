"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/collider", label: "知识对撞" },
  { href: "/stress-test", label: "断裂测试" },
  { href: "/mva", label: "MVA 生成" },
  { href: "/translator", label: "双向翻译" },
  { href: "/community", label: "盲盒共创" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1e2e] bg-[#0a0a0f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">NexusMind</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname === item.href
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="切换菜单"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1e1e2e] bg-[#0a0a0f] px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-4 py-2 rounded-lg text-sm font-medium transition-all",
                pathname === item.href
                  ? "bg-purple-600/20 text-purple-300"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
