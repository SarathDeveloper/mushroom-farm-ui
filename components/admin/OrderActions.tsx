"use client";

import { Printer, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type OrderActionsProps = {
  order: {
    id: string;
    totalAmount: number;
    status: string;
    orderItems: Array<{
      id: string;
      quantity: number;
      price: number;
      product: { name: string; weight: string };
    }>;
  };
  address: {
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
    deliverySlot?: string;
  };
};

export function OrderActions({ order, address }: OrderActionsProps) {
  function handlePrint() {
    const printContent = `
      <html>
        <head>
          <title>Order #${order.id.slice(0, 8).toUpperCase()}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
            h1 { font-size: 18px; margin-bottom: 5px; }
            h2 { font-size: 14px; margin: 15px 0 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .meta { color: #666; font-size: 12px; margin-bottom: 15px; }
            .item { display: flex; justify-content: space-between; margin: 8px 0; font-size: 13px; }
            .item-name { flex: 1; }
            .total { border-top: 2px solid #000; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 16px; }
            .address { font-size: 13px; line-height: 1.5; }
            .slot { background: #f5f5f5; padding: 8px; margin-top: 10px; font-size: 12px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>Sri Amman Mushroom Farms</h1>
          <p class="meta">Order #${order.id.slice(0, 8).toUpperCase()} · ${order.status}</p>
          
          <h2>Items</h2>
          ${order.orderItems.map((item) => `
            <div class="item">
              <span class="item-name">${item.product.name} (${item.product.weight}) × ${item.quantity}</span>
              <span>₹${item.price * item.quantity}</span>
            </div>
          `).join("")}
          <div class="item total">
            <span>Total</span>
            <span>₹${order.totalAmount}</span>
          </div>
          
          <h2>Deliver To</h2>
          <div class="address">
            ${address.name ? `<strong>${address.name}</strong><br>` : ""}
            ${address.street ? `${address.street}<br>` : ""}
            ${[address.city, address.state, address.pincode].filter(Boolean).join(", ")}<br>
            ${address.phone ? `📞 ${address.phone}` : ""}
          </div>
          ${address.deliverySlot ? `<div class="slot">🕐 ${address.deliverySlot}</div>` : ""}
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  function handleWhatsApp() {
    const items = order.orderItems
      .map((item) => `• ${item.product.name} (${item.product.weight}) × ${item.quantity} = ₹${item.price * item.quantity}`)
      .join("\n");

    const addressLine = [
      address.name,
      address.street,
      [address.city, address.state, address.pincode].filter(Boolean).join(", "),
    ]
      .filter(Boolean)
      .join("\n");

    const message = `*Sri Amman Mushroom Farms - Packing Slip*

Order: #${order.id.slice(0, 8).toUpperCase()}
Status: ${order.status}

*Items:*
${items}

*Total: ₹${order.totalAmount}*

*Deliver To:*
${addressLine}
${address.phone ? `📞 ${address.phone}` : ""}
${address.deliverySlot ? `\n🕐 Slot: ${address.deliverySlot}` : ""}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
        <Printer size={14} /> Print
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={handleWhatsApp}>
        <MessageCircle size={14} /> WhatsApp
      </Button>
    </div>
  );
}
