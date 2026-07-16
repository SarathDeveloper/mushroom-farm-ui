"use client";

import { useState, useTransition } from "react";
import { Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addOrderNote, deleteOrderNote } from "@/app/admin/actions";
import toast from "react-hot-toast";

type Note = {
  id: string;
  content: string;
  createdAt: string;
};

export function OrderNotes({ orderId, notes }: { orderId: string; notes: Note[] }) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    startTransition(async () => {
      const res = await addOrderNote(orderId, content.trim());
      if (res.success) {
        setContent("");
        toast.success("Note added");
      } else {
        toast.error(res.error || "Failed to add note");
      }
    });
  }

  function handleDelete(noteId: string) {
    startTransition(async () => {
      const res = await deleteOrderNote(noteId);
      if (res.success) {
        toast.success("Note deleted");
      } else {
        toast.error(res.error || "Failed to delete note");
      }
    });
  }

  return (
    <section className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-5">
      <h2 className="font-heading font-semibold text-foreground mb-4">Admin Notes</h2>

      {notes.length > 0 && (
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(note.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
                disabled={isPending}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          placeholder="Add a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
        />
        <Button type="submit" size="sm" disabled={isPending || !content.trim()} className="h-9 gap-1.5">
          <Send size={14} /> Add
        </Button>
      </form>
    </section>
  );
}
