import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDateShort(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${year}/${month}/${day}`;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "確認待ち",
    confirmed: "確認済み",
    rejected: "要修正",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    事務用品費: "bg-blue-100 text-blue-800",
    交際費: "bg-purple-100 text-purple-800",
    旅費交通費: "bg-indigo-100 text-indigo-800",
    外注費: "bg-orange-100 text-orange-800",
    ソフトウェア: "bg-cyan-100 text-cyan-800",
    広告宣伝費: "bg-pink-100 text-pink-800",
    "備品・設備費": "bg-teal-100 text-teal-800",
    水道光熱費: "bg-sky-100 text-sky-800",
    売上: "bg-green-100 text-green-800",
    その他: "bg-gray-100 text-gray-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
}

export function generateId(): string {
  return crypto.randomUUID();
}
