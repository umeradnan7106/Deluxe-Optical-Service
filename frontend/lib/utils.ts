import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, ONLINE_PAYMENT_DISCOUNT_PERCENT } from "./constants";

export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getDiscountPercent(original: number, sale: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - sale) / original) * 100);
}

export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export function calculatePaymentDiscount(subtotal: number, method: string): number {
  const onlineMethods = ["easypaisa", "jazzcash", "bank_transfer"];
  if (onlineMethods.includes(method)) {
    return Math.round(subtotal * (ONLINE_PAYMENT_DISCOUNT_PERCENT / 100));
  }
  return 0;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
