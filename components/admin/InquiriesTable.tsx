"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  MoreHorizontal, 
  Save, 
  Mail, 
  Phone,
  MessageCircle
} from "lucide-react";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateInquiryStatus, updateInquiryNotes } from "@/app/admin/inquiries/actions";

interface Inquiry {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  location: string | null;
  company: string | null;
  inquiryType: string;
  preferredContact: string;
  message: string | null;
  isHandled: boolean;
  adminNotes: string | null;
  createdAt: Date;
}

export function InquiriesTable({ initialData }: { initialData: Inquiry[] }) {
  const [data, setData] = useState(initialData);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    // Optimistic update
    setData(data.map(item => 
      item.id === id ? { ...item, isHandled: newStatus } : item
    ));

    const result = await updateInquiryStatus(id, newStatus);
    
    if (result.success) {
      toast.success(`Marked as ${newStatus ? 'Handled' : 'Pending'}`);
    } else {
      // Revert on failure
      setData(data.map(item => 
        item.id === id ? { ...item, isHandled: currentStatus } : item
      ));
      toast.error(result.message || "Something went wrong");
    }
  };

  const handleOpenNotes = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setNotes(inquiry.adminNotes || "");
    setIsNotesOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    
    setSaving(true);
    const result = await updateInquiryNotes(selectedInquiry.id, notes);
    setSaving(false);

    if (result.success) {
      setData(data.map(item => 
        item.id === selectedInquiry.id ? { ...item, adminNotes: notes } : item
      ));
      toast.success("Notes saved");
      setIsNotesOpen(false);
    } else {
      toast.error(result.message || "Failed to save notes");
    }
  };

  const ContactIcon = ({ method }: { method: string }) => {
    if (method === "WhatsApp") return <MessageCircle className="h-4 w-4 text-green-500" />;
    if (method === "Email") return <Mail className="h-4 w-4 text-blue-500" />;
    return <Phone className="h-4 w-4 text-gray-500" />;
  };

  return (
    <>
      {data.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
            <MessageSquare size={30} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground mb-1">No inquiries yet</h2>
          <p className="text-muted-foreground max-w-sm text-base">
            Contact form submissions will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile card view */}
          <div className="space-y-3 md:hidden">
            {data.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`bg-card rounded-xl border border-border p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${inquiry.isHandled ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground text-base truncate">{inquiry.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{inquiry.phone}</p>
                    {inquiry.email && <p className="text-sm text-muted-foreground truncate">{inquiry.email}</p>}
                  </div>
                  {inquiry.isHandled ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 shrink-0 text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Handled
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 shrink-0 text-xs">
                      <Clock className="w-3 h-3 mr-1" /> Pending
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{inquiry.inquiryType}</Badge>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <ContactIcon method={inquiry.preferredContact} />
                    {inquiry.preferredContact}
                  </span>
                </div>
                {(inquiry.location || inquiry.company) && (
                  <p className="text-sm text-muted-foreground mb-2 truncate">
                    {[inquiry.location, inquiry.company].filter(Boolean).join(" · ")}
                  </p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(inquiry.createdAt))}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div className="inline-flex items-center justify-center rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleToggleStatus(inquiry.id, inquiry.isHandled)}>
                        {inquiry.isHandled ? "Mark as Pending" : "Mark as Handled"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenNotes(inquiry)}>
                        View Details & Notes
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {inquiry.preferredContact === "WhatsApp" && (
                        <DropdownMenuItem onClick={() => window.open(`https://wa.me/${inquiry.phone.replace(/\D/g, '')}`, "_blank")}>
                          WhatsApp Message
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => window.location.href = `tel:${inquiry.phone}`}>
                        Call {inquiry.phone}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table view */}
          <div className="hidden md:block bg-card rounded-2xl border border-border shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type & Pref</TableHead>
                    <TableHead>Location/Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(inquiry.createdAt))}
                        <div className="text-sm text-muted-foreground mt-1">
                          {new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric" }).format(new Date(inquiry.createdAt))}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-medium">{inquiry.name}</div>
                        <div className="text-base text-muted-foreground">{inquiry.phone}</div>
                        {inquiry.email && <div className="text-sm text-muted-foreground">{inquiry.email}</div>}
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline" className="mb-1">{inquiry.inquiryType}</Badge>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                          <ContactIcon method={inquiry.preferredContact} />
                          {inquiry.preferredContact}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {inquiry.location ? (
                          <div className="text-base">{inquiry.location}</div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                        {inquiry.company && (
                          <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            {inquiry.company}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {inquiry.isHandled ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Handled
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            <Clock className="w-3 h-3 mr-1" /> Pending
                          </Badge>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <div className="inline-flex items-center justify-center rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            
                            <DropdownMenuItem onClick={() => handleToggleStatus(inquiry.id, inquiry.isHandled)}>
                              {inquiry.isHandled ? "Mark as Pending" : "Mark as Handled"}
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => handleOpenNotes(inquiry)}>
                              View Details & Notes
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            {inquiry.preferredContact === "WhatsApp" && (
                              <DropdownMenuItem onClick={() => window.open(`https://wa.me/${inquiry.phone.replace(/\D/g, '')}`, "_blank")}>
                                WhatsApp Message
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => window.location.href = `tel:${inquiry.phone}`}>
                              Call {inquiry.phone}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>
              From {selectedInquiry?.name} ({selectedInquiry?.inquiryType})
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {selectedInquiry?.message && (
              <div className="bg-muted p-3 sm:p-4 rounded-lg text-base whitespace-pre-wrap">
                <span className="font-semibold block mb-1">Message:</span>
                {selectedInquiry.message}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="notes">Internal Admin Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about your follow-up here..."
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setIsNotesOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotes} disabled={saving}>
              {saving ? "Saving..." : "Save Notes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
