import { Suspense } from "react";
import OrdersContent from "./_Content";

export default function AdminOrdersPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  );
}
