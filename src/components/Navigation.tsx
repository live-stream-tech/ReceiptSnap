"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Upload,
  FileText,
  BarChart3,
  Settings,
  FileDown,
  BookOpen,
  CreditCard,
  ChevronDown,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

// トップレベルのナビ項目
const topNavItems = [
  { href: "/",        label: "ホーム",   icon: Home,       color: "from-sky-400 to-blue-500" },
  { href: "/guide",   label: "使い方",   icon: BookOpen,   color: "from-amber-400 to-orange-500" },
  { href: "/pricing", label: "料金",     icon: CreditCard, color: "from-rose-400 to-pink-500" },
];

// 「書類管理」配下のサブ項目
const docNavItems = [
  { href: "/upload",   label: "アップロード", icon: Upload,    color: "from-cyan-400 to-teal-500" },
  { href: "/receipts", label: "証憑一覧",     icon: FileText,  color: "from-teal-400 to-emerald-500" },
  { href: "/report",   label: "レポート",     icon: BarChart3, color: "from-blue-400 to-indigo-500" },
  { href: "/export",   label: "PDF出力",      icon: FileDown,  color: "from-violet-400 to-purple-500" },
];

const bottomNavItems = [
  { href: "/settings", label: "設定", icon: Settings, color: "from-slate-400 to-slate-600" },
];

// モバイル用ボトムナビ（設定はヘッダーに移動したので除外）
const mobileNavItems = [
  { href: "/",        label: "ホーム",       icon: Home,       color: "from-sky-400 to-blue-500" },
  { href: "/upload",  label: "アップロード", icon: Upload,     color: "from-cyan-400 to-teal-500" },
  { href: "/receipts",label: "証憑一覧",     icon: FileText,   color: "from-teal-400 to-emerald-500" },
  { href: "/report",  label: "レポート",     icon: BarChart3,  color: "from-blue-400 to-indigo-500" },
  { href: "/export",  label: "PDF出力",      icon: FileDown,   color: "from-violet-400 to-purple-500" },
];

function NavLink({ href, label, icon: Icon, color, indent = false }: {
  href: string; label: string; icon: React.ElementType; color: string; indent?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group",
        indent ? "pl-6" : "",
        active
          ? "bg-white/15 text-white shadow-lg"
          : "text-sky-100/70 hover:bg-white/10 hover:text-white"
      )}
    >
      <div className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0",
        active
          ? `bg-gradient-to-br ${color} shadow-md`
          : "bg-white/10 group-hover:bg-white/20"
      )}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="font-medium">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-300" />}
    </Link>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const isDocActive = docNavItems.some(item => pathname === item.href);
  const [docOpen, setDocOpen] = useState(isDocActive);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen fixed left-0 top-0 z-30 sidebar-gradient shadow-2xl">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="ReceiptSnap"
              width={160}
              height={48}
              className="object-contain group-hover:opacity-90 transition-opacity duration-200"
              priority
            />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {/* トップ項目 */}
          {topNavItems.map(item => (
            <NavLink key={item.href} {...item} />
          ))}

          {/* 書類管理アコーディオン */}
          <div>
            <button
              onClick={() => setDocOpen(v => !v)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group",
                isDocActive
                  ? "bg-white/15 text-white shadow-lg"
                  : "text-sky-100/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0",
                isDocActive
                  ? "bg-gradient-to-br from-emerald-400 to-teal-600 shadow-md"
                  : "bg-white/10 group-hover:bg-white/20"
              )}>
                <FolderOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium flex-1 text-left">書類管理</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform duration-200",
                docOpen ? "rotate-180" : ""
              )} />
            </button>

            {/* サブ項目 */}
            {docOpen && (
              <div className="mt-1 ml-3 pl-3 border-l border-white/20 space-y-1">
                {docNavItems.map(item => (
                  <NavLink key={item.href} {...item} />
                ))}
              </div>
            )}
          </div>

          {/* 設定 */}
          <div className="pt-2 border-t border-white/10 mt-2">
            {bottomNavItems.map(item => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>
        </nav>

        {/* Bottom CTA */}
        <div className="px-4 pb-6">
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                <span className="text-white text-sm">⚡</span>
              </div>
              <p className="text-xs font-semibold text-white">電子帳簿保存法対応</p>
            </div>
            <p className="text-[11px] text-sky-200/70 leading-relaxed">
              書類を7年間クラウド保存し、法的要件を自動で満たします
            </p>
          </div>
        </div>
      </aside>

      {/* ── Mobile header ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30">
        <div className="card-glass border-b border-sky-100/60 flex items-center justify-between px-4 py-2.5">
          {/* ロゴ */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="ReceiptSnap"
              width={120}
              height={36}
              className="object-contain"
              priority
            />
          </Link>

          {/* 設定アイコン */}
          <Link
            href="/settings"
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
              pathname === "/settings"
                ? "bg-gradient-to-br from-slate-400 to-slate-600 shadow-md"
                : "bg-sky-50 hover:bg-sky-100"
            )}
            aria-label="設定"
          >
            <Settings className={cn(
              "w-5 h-5",
              pathname === "/settings" ? "text-white" : "text-slate-500"
            )} />
          </Link>
        </div>
      </header>

      {/* ── Mobile bottom navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 safe-area-bottom">
        <div className="card-glass border-t border-sky-100 flex items-center justify-around px-1 py-2">
          {mobileNavItems.map(({ href, label, icon: Icon, color }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-200 flex-shrink-0",
                  active ? "text-brand-600" : "text-slate-400"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                  active
                    ? `bg-gradient-to-br ${color} shadow-md scale-110`
                    : "bg-slate-100"
                )}>
                  <Icon className={cn("w-4 h-4", active ? "text-white" : "text-slate-400")} />
                </div>
                <span className="text-[9px] font-medium leading-tight text-center">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
