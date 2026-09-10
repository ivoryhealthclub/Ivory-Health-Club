import { useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, Download, Eye, XCircle } from "lucide-react";
import {
  getListEnrollmentsQueryKey,
  useListEnrollments,
  useReviewEnrollmentPayment,
  type Enrollment,
  type PaymentReviewDecision,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

function enrollmentLabel(enrollment: Enrollment) {
  if (enrollment.enrollmentType === "membership") return enrollment.planName || `Plan #${enrollment.planId ?? "—"}`;
  return enrollment.programName || enrollment.programKey || "Programme enrollment";
}

function typeLabel(type: Enrollment["enrollmentType"]) {
  return type === "membership" ? "Membership" : `${type.charAt(0).toUpperCase()}${type.slice(1)} enrollment`;
}

export default function AdminEnrollments() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Enrollment | null>(null);
  const { data: enrollments, isLoading } = useListEnrollments(undefined, { query: { queryKey: getListEnrollmentsQueryKey(), refetchInterval: 15000 } });

  const filtered = enrollments?.filter((enrollment) => filter === "all" || enrollment.status === filter) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary">Enrollments</h1>
          <p className="mt-1 text-sm text-gray-500">Memberships, academies, and programme enrollments. Bookings are managed separately.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "active", "cancelled"].map((value) => (
            <Button key={value} variant={filter === value ? "default" : "outline"} size="sm" onClick={() => setFilter(value)} className={filter === value ? "bg-secondary text-white" : ""}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 font-medium uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Enrollment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment review</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No enrollments found.</td></tr>
              ) : filtered.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{enrollment.firstName} {enrollment.lastName}</div>
                    <div className="text-xs text-gray-500">{enrollment.email}</div>
                    <div className="text-xs text-gray-500">{enrollment.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{enrollmentLabel(enrollment)}</div>
                    <div className="text-xs text-gray-500">{typeLabel(enrollment.enrollmentType)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={enrollment.status === "active" ? "border-green-200 bg-green-50 text-green-700" : enrollment.status === "pending" ? "border-orange-200 bg-orange-50 text-orange-700" : ""}>
                      {enrollment.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={enrollment.paymentStatus === "paid" ? "border-green-200 text-green-700" : enrollment.paymentStatus === "receipt_submitted" ? "border-blue-200 text-blue-700" : "border-gray-200 text-gray-600"}>
                      {enrollment.paymentStatus === "receipt_submitted" ? "Receipt submitted" : enrollment.paymentStatus}
                    </Badge>
                    {enrollment.receiptFileName && <div className="mt-1 max-w-[160px] truncate text-xs text-gray-500">{enrollment.receiptFileName}</div>}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{format(new Date(enrollment.createdAt), "MMM d, yyyy")}</td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" variant="ghost" onClick={() => setSelected(enrollment)}><Eye size={16} /> Review</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EnrollmentReviewDialog enrollment={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function EnrollmentReviewDialog({ enrollment, onClose }: { enrollment: Enrollment | null; onClose: () => void }) {
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const reviewPayment = useReviewEnrollmentPayment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const submitReview = (decision: PaymentReviewDecision) => {
    if (!enrollment) return;
    reviewPayment.mutate(
      { id: enrollment.id, data: { decision, paymentReference: reference || undefined, notes: notes || undefined } },
      {
        onSuccess: () => {
          toast({ title: decision === "approve" ? "Payment approved and enrollment activated." : "Payment rejected." });
          queryClient.invalidateQueries({ queryKey: getListEnrollmentsQueryKey() });
          onClose();
        },
        onError: (error) => toast({ title: "Payment review failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }),
      },
    );
  };

  return (
    <Dialog open={!!enrollment} onOpenChange={(open) => !open && onClose()}>
      {enrollment && (
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-secondary">Review enrollment payment</DialogTitle>
            <DialogDescription>{enrollment.firstName} {enrollment.lastName} · {enrollmentLabel(enrollment)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3 rounded-md bg-gray-50 p-4 text-sm sm:grid-cols-2">
              <div><p className="text-gray-500">Email</p><p className="font-medium break-all">{enrollment.email}</p></div>
              <div><p className="text-gray-500">Payment status</p><p className="font-medium">{enrollment.paymentStatus}</p></div>
              <div><p className="text-gray-500">Receipt</p><p className="font-medium">{enrollment.receiptFileName || "Not uploaded"}</p></div>
              <div><p className="text-gray-500">Submitted</p><p className="font-medium">{format(new Date(enrollment.createdAt), "MMM d, yyyy")}</p></div>
            </div>
            {enrollment.receiptObjectPath ? (
              <Button variant="outline" asChild className="w-full">
                <a href={`/api/storage${enrollment.receiptObjectPath}`} target="_blank" rel="noreferrer"><Download size={16} /> Download receipt</a>
              </Button>
            ) : (
              <p className="rounded-md border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">No receipt has been uploaded. Approval is disabled until the receipt is reviewed.</p>
            )}
            <Input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Bank transfer reference (optional)" />
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Review notes (optional)" />
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" className="text-red-600" onClick={() => submitReview("reject")} disabled={reviewPayment.isPending}><XCircle size={16} /> Reject</Button>
            <Button onClick={() => submitReview("approve")} disabled={!enrollment.receiptObjectPath || reviewPayment.isPending}><CheckCircle2 size={16} /> Approve & activate</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}