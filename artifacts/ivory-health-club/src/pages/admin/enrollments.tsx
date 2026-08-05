import { useState } from "react";
import { useListEnrollments, useConfirmPayment } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListEnrollmentsQueryKey } from "@workspace/api-client-react";

export default function AdminEnrollments() {
  const [filter, setFilter] = useState("all");
  const { data: enrollments, isLoading } = useListEnrollments();
  const confirmPayment = useConfirmPayment();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const filtered = enrollments?.filter(e => filter === "all" || e.status === filter) || [];

  const handleConfirmPayment = (id: number, ref: string) => {
    confirmPayment.mutate({ id, data: { paymentReference: ref } }, {
      onSuccess: () => {
        toast({ title: "Payment confirmed and enrollment activated." });
        queryClient.invalidateQueries({ queryKey: getListEnrollmentsQueryKey() });
      },
      onError: () => {
        toast({ title: "Error confirming payment", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-serif font-bold text-secondary">Enrollments</h1>
        <div className="flex gap-2">
          {["all", "pending", "active"].map(f => (
            <Button 
              key={f} 
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              size="sm"
              className={filter === f ? "bg-secondary text-white" : ""}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No enrollments found.</td>
                </tr>
              ) : (
                filtered.map(enroll => (
                  <tr key={enroll.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{enroll.firstName} {enroll.lastName}</div>
                      <div className="text-gray-500 text-xs">{enroll.email}</div>
                      <div className="text-gray-500 text-xs">{enroll.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">{enroll.planName || `Plan #${enroll.planId}`}</td>
                    <td className="px-6 py-4">
                      <Badge variant={enroll.status === 'active' ? 'default' : 'secondary'} className={
                        enroll.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                        enroll.status === 'pending' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' : ''
                      }>
                        {enroll.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={
                        enroll.paymentStatus === 'paid' ? 'border-green-200 text-green-700' : 'border-red-200 text-red-700'
                      }>
                        {enroll.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {format(new Date(enroll.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {enroll.status === 'pending' && enroll.paymentStatus === 'unpaid' && (
                        <PaymentDialog onSubmit={(ref) => handleConfirmPayment(enroll.id, ref)} />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PaymentDialog({ onSubmit }: { onSubmit: (ref: string) => void }) {
  const [open, setOpen] = useState(false);
  const [ref, setRef] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ref) {
      onSubmit(ref);
      setOpen(false);
      setRef("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary hover:text-secondary">Confirm Payment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Payment Reference ID</label>
            <Input required value={ref} onChange={e => setRef(e.target.value)} placeholder="e.g. TXN-123456" />
          </div>
          <Button type="submit" className="w-full bg-secondary text-white hover:bg-primary">Confirm & Activate</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
