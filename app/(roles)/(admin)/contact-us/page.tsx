/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { 
  useGetContactsQuery, 
  useUpdateContactMutation, 
  useDeleteContactMutation,
  ContactMessage 
} from "@/redux/services/contactApi";
import { 
  Mail, 
  Search, 
  Trash2, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  User,
  RefreshCw,
  X,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ConfirmationModal } from "@/components/Shared/ConfirmationModal";
import { TablePagination } from "@/components/Shared/TablePagination";

export default function ContactManagementPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetContactsQuery({
    page,
    limit,
    status: statusFilter,
    search: searchTerm,
  });

  const [updateContact] = useUpdateContactMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateContact({ id, data: { status: newStatus as any } }).unwrap();
      toast.success("Status updated.");
      if (selectedContact?._id === id) {
        setSelectedContact(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (err) {
      toast.error("Failed to update.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteContact(deleteId).unwrap();
      toast.success("Message permanently deleted.");
      if (selectedContact?._id === deleteId) setSelectedContact(null);
      setDeleteId(null);
    } catch (err) {
      toast.error("Failed to delete message.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-50 text-red-600 border-red-100";
      case "in_progress": return "bg-amber-50 text-amber-600 border-amber-100";
      case "resolved": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "closed": return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-gray-50 text-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "bug": return AlertCircle;
      case "feature": return Tag;
      case "lake_correction": return RefreshCw;
      default: return Mail;
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F9FAFB]">
      <DashboardHeader 
        title="Support Tickets" 
        description="Monitor and resolve user inquiries across the platform."
      />

      <div className="flex-1 p-6 flex flex-col gap-6 w-full">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm overflow-x-auto w-full md:w-fit">
            <FilterButton active={statusFilter === ""} onClick={() => setStatusFilter("")} label="All" />
            <FilterButton active={statusFilter === "open"} onClick={() => setStatusFilter("open")} label="Open" count={statusFilter === "open" ? data?.pagination.total : undefined} />
            <FilterButton active={statusFilter === "in_progress"} onClick={() => setStatusFilter("in_progress")} label="In Progress" />
            <FilterButton active={statusFilter === "resolved"} onClick={() => setStatusFilter("resolved")} label="Resolved" />
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search users or subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-white border border-gray-200 rounded-xl pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100/50 focus:border-indigo-400 shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start w-full flex-1">
          {/* Main List */}
          <div className={`${selectedContact ? 'lg:w-[60%]' : 'w-full'} flex flex-col gap-3 min-w-0`}>
            {isLoading ? (
              <LoadingState />
            ) : data?.contacts.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="flex flex-col gap-3 w-full">
                {data?.contacts.map((contact) => (
                  <div
                    key={contact._id}
                    onClick={() => setSelectedContact(contact)}
                    className={`
                      bg-white p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md hover:border-indigo-300 w-full group
                      ${selectedContact?._id === contact._id ? 'border-indigo-400 ring-2 ring-indigo-50 shadow-sm' : 'border-gray-100 shadow-sm'}
                    `}
                  >
                    <div className="flex items-center justify-between gap-6 w-full">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${getStatusColor(contact.status)}`}>
                          <Mail className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900 truncate text-base">{contact.subject}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(contact.status)} w-fit`}>
                                {contact.status.replace('_', ' ')}
                              </span>
                           </div>
                           <p className="text-xs text-gray-500 truncate font-semibold uppercase tracking-tight">
                             {contact.name} • {contact.email}
                           </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-gray-400 text-[10px] font-black uppercase tracking-wider shrink-0">
                         <span className="hidden sm:inline-block whitespace-nowrap">
                           {format(new Date(contact.createdAt), 'MMM d, h:mm a')}
                         </span>
                         <ChevronRight className={`w-4 h-4 transition-transform ${selectedContact?._id === contact._id ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {data && data.pagination.total > 10 && (
              <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <TablePagination
                  currentPage={page}
                  totalPages={data.pagination.pages}
                  totalItems={data.pagination.total}
                  itemsPerPage={limit}
                  onPageChange={(p) => setPage(p)}
                  onPageSizeChange={(s) => {
                    setLimit(s);
                    setPage(1);
                  }}
                  showPageSize={true}
                  pageSizeOptions={[10, 20, 30, 50, 100]}
                />
              </div>
            )}
          </div>

          {/* Pane */}
          <AnimatePresence>
            {selectedContact && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:w-[40%] sticky top-24 w-full"
              >
                <div className="bg-white rounded-[2rem] border border-gray-200 shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <div className="flex items-center gap-3">
                       <button onClick={() => setSelectedContact(null)} className="p-2 hover:bg-white rounded-xl text-gray-400 cursor-pointer transition-all duration-150 hover:text-red-500"><X className="w-5 h-5" /></button>
                       <span className="text-xs font-black uppercase tracking-widest text-gray-400">Response Console</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(selectedContact._id)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-all duration-150"><Trash2 className="w-5 h-5" /></Button>
                  </div>

                  <div className="p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        {selectedContact.user?.avatar ? <img src={selectedContact.user.avatar} className="w-full h-full object-cover rounded-2xl" alt="" /> : <User className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 leading-none mb-1">{selectedContact.name}</h4>
                        <p className="text-sm text-indigo-600 font-bold">{selectedContact.email}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Message Body</span>
                       <h3 className="text-base font-bold text-gray-900 mb-4">{selectedContact.subject}</h3>
                       <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <MetricCard label="Priority" value={selectedContact.priority || 'Medium'} />
                       <MetricCard label="Category" value={selectedContact.category.replace('_', ' ')} />
                    </div>

                    <div className="flex flex-col gap-3">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Take Action</span>
                       <div className="flex gap-2">
                          <StatusBtn active={selectedContact.status === 'in_progress'} onClick={() => handleStatusChange(selectedContact._id, 'in_progress')} label="Work" icon={Clock} color="amber" />
                          <StatusBtn active={selectedContact.status === 'resolved'} onClick={() => handleStatusChange(selectedContact._id, 'resolved')} label="Resolve" icon={CheckCircle2} color="emerald" />
                          <StatusBtn active={selectedContact.status === 'closed'} onClick={() => handleStatusChange(selectedContact._id, 'closed')} label="Close" icon={X} color="gray" />
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Message"
        message="This will permanently remove this inquiry. This action cannot be undone."
        confirmText="Delete Message"
        cancelText="Keep Message"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
}

function FilterButton({ active, onClick, label, count }: { active: boolean, onClick: () => void, label: string, count?: number }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${active ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}>
      {label} {count !== undefined && <span className="ml-1 px-1.5 py-0.5 rounded-md bg-indigo-500 text-[9px] text-white">{count}</span>}
    </button>
  );
}

function StatusBtn({ active, onClick, label, icon: Icon, color }: { active: boolean, onClick: () => void, label: string, icon: any, color: "amber" | "emerald" | "gray" }) {
  const styles = {
    amber: active ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-600 hover:bg-amber-100",
    emerald: active ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    gray: active ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
  };
  return (
    <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center py-4 rounded-2xl gap-2 transition-all font-bold text-[10px] uppercase tracking-widest cursor-pointer ${styles[color]}`}>
      <Icon className="w-5 h-5" /> {label}
    </button>
  );
}

function MetricCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">{label}</span>
      <span className="text-xs font-bold text-gray-900">{value}</span>
    </div>
  );
}

function LoadingState() {
  return <div className="flex flex-col gap-3 w-full animate-pulse">{[1, 2, 3].map(i => <div key={i} className="h-24 bg-white border border-gray-100 rounded-2xl shadow-sm w-full" />)}</div>;
}

function EmptyState() {
  return (
    <div className="bg-white border border-gray-200 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center text-center w-full mx-auto">
       <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-6"><Mail className="w-10 h-10" /></div>
       <h3 className="text-xl font-bold text-gray-900 mb-2">No messages</h3>
       <p className="text-gray-500 max-w-xs font-medium">Inbox is clear!</p>
    </div>
  );
}
