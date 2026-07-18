"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const WHATSAPP_NUMBER = "916380687811";

const quickMessages = [
  { label: "Order Mushrooms", message: "Hi! I'd like to place an order for fresh mushrooms." },
  { label: "Pre-Order Enquiry", message: "Hi! I'd like to pre-order fresh mushrooms." },
  { label: "Training Info", message: "Hi! I'd like to know about your mushroom farming training programs." },
  { label: "Track My Order", message: "Hi! I'd like to track my order. My order ID is: " },
];

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isCartPage = pathname === "/cart";

  const sendMessage = (message: string) => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    setOpen(false);
  };

  return (
    <div className={`fixed right-4 z-50 md:bottom-8 md:right-8 ${isCartPage ? "bottom-36" : "bottom-20"}`}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-72 rounded-2xl bg-card border border-border shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            <div className="bg-whatsapp px-4 py-3 text-white">
              <h3 className="font-bold text-sm">Chat with us</h3>
              <p className="text-xs text-white/80">Typically replies within minutes</p>
            </div>
            <div className="p-3 space-y-2">
              {quickMessages.map((msg) => (
                <button
                  key={msg.label}
                  onClick={() => sendMessage(msg.message)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-foreground bg-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {msg.label}
                </button>
              ))}
            </div>
            <div className="px-4 pb-3">
              <button
                onClick={() => sendMessage("Hi! I have a question about Sri Amman Mushroom Farms.")}
                className="w-full py-2.5 rounded-xl bg-whatsapp text-white text-sm font-semibold hover:bg-whatsapp-hover transition-colors"
              >
                Start a Conversation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        className="relative w-14 h-14 rounded-full bg-whatsapp text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_24px_rgba(37,211,102,0.5)] hover:scale-105 transition-all flex items-center justify-center"
      >
        {open ? <X size={24} /> : <WhatsAppIcon className="size-7" />}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-whatsapp opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white border-2 border-whatsapp" />
          </span>
        )}
      </button>
    </div>
  );
}
