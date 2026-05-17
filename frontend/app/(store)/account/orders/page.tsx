"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ordersApi } from "@/lib/api";
import type { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const STATUS_COLORS: Record<string, "orange" | "green" | "gray" | "red"> = {
  pending: "orange",
  confirmed: "orange",
  processing: "orange",
  shipped: "orange",
  delivered: "green",
  cancelled: "red",
  refunded: "gray",
};

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.myOrders().then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400 py-8 text-center">Loading orders…</div>;

  return (
    <div>
      <h2 className="text-white text-xl font-semibold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="mb-4">No orders yet.</p>
          <Link href="/products"><Button variant="primary">Browse Products</Button></Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a] text-gray-400 text-left">
                <th className="pb-3 pr-4">Order ID</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3 pr-4">Payment</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                  <td className="py-3 pr-4 font-mono text-[#E8670A]">{order.order_number}</td>
                  <td className="py-3 pr-4 text-gray-300">{formatDate(order.created_at)}</td>
                  <td className="py-3 pr-4 text-white font-medium">{formatPrice(order.total)}</td>
                  <td className="py-3 pr-4 text-gray-300 capitalize">{order.payment_method.replace("_", " ")}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={STATUS_COLORS[order.status] ?? "gray"} className="capitalize">
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Link href={`/tracking?order_number=${order.order_number}`}>
                      <Button variant="outline" size="sm">Track</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
