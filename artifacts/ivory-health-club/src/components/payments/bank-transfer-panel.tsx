import { useState } from "react";
import { CheckCircle2, Copy, FileUp, Landmark, Loader2, ShieldCheck } from "lucide-react";
import { useGetPaymentSettings } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type ReceiptEntity = "booking" | "enrollment";

type BankTransferPanelProps = {
  entityType?: ReceiptEntity;
  entityId?: number | null;
  uploadToken?: string | null;
  initialFile?: File | null;
};

export const MAX_RECEIPT_SIZE = 10 * 1024 * 1024;
export const ALLOWED_RECEIPT_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

export function validateReceiptFile(candidate: File | undefined): string | null {
  if (!candidate) return null;
  if (!ALLOWED_RECEIPT_TYPES.has(candidate.type)) {
    return "Choose a PDF, JPG, PNG, or WEBP file.";
  }
  if (candidate.size > MAX_RECEIPT_SIZE) {
    return "Receipt files must be no larger than 10 MB.";
  }
  return null;
}

export function BankTransferDetails({ compact = false }: { compact?: boolean }) {
  const { data, isLoading, isError } = useGetPaymentSettings();

  if (isLoading) {
    return <div className="rounded-sm border border-primary/20 bg-primary/5 p-5 text-sm text-gray-500">Loading bank transfer details…</div>;
  }
  if (isError || !data) {
    return <div className="rounded-sm border border-red-200 bg-red-50 p-5 text-sm text-red-700">Bank transfer details are temporarily unavailable. Please contact our concierge team.</div>;
  }

  const copyAccountNumber = async () => {
    await navigator.clipboard?.writeText(data.accountNumber);
  };

  return (
    <div className={`rounded-sm border border-primary/30 bg-primary/5 ${compact ? "p-5" : "p-6"}`}>
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-primary/20 p-2 text-secondary"><Landmark size={18} /></div>
        <div>
          <h3 className="font-bold text-secondary">Pay by bank transfer</h3>
          <p className="text-xs text-gray-600">BANK TRANSFER is the only accepted payment method.</p>
        </div>
      </div>
      <div className="grid gap-3 text-sm sm:grid-cols-3">
        <div><p className="text-xs uppercase tracking-wider text-gray-500">Bank Name</p><p className="font-semibold text-secondary">{data.bankName}</p></div>
        <div><p className="text-xs uppercase tracking-wider text-gray-500">Account Name</p><p className="font-semibold text-secondary">{data.accountName}</p></div>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500">Account Number</p>
          <button type="button" onClick={copyAccountNumber} className="inline-flex items-center gap-2 font-semibold text-secondary hover:text-primary">
            {data.accountNumber}<Copy size={14} />
          </button>
        </div>
      </div>
      <div className="mt-4 border-t border-primary/20 pt-4 text-sm text-gray-700">
        <p className="mb-1 font-semibold text-secondary">Payment instructions</p>
        <p className="whitespace-pre-wrap leading-6">{data.instructions}</p>
      </div>
    </div>
  );
}

export function BankTransferPanel({ entityType, entityId, uploadToken, initialFile }: BankTransferPanelProps) {
  const [file, setFile] = useState<File | null>(initialFile ?? null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (candidate: File | undefined) => {
    if (!candidate) {
      setFile(null);
      return;
    }

    const validationError = validateReceiptFile(candidate);
    if (validationError) {
      setFile(null);
      toast({
        title: "Receipt file not accepted",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setFile(candidate);
  };

  const uploadReceipt = async () => {
    if (!file || !entityType || !entityId || !uploadToken) return;
    setUploading(true);
    try {
      const requestResponse = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType,
          entityId,
          token: uploadToken,
          name: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });
      const request = await requestResponse.json();
      if (!requestResponse.ok) throw new Error(request.error || "Could not prepare upload");

      const uploadResponse = await fetch(request.uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadResponse.ok) throw new Error("Could not upload receipt");

      const completeResponse = await fetch("/api/storage/uploads/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType,
          entityId,
          token: uploadToken,
          objectPath: request.objectPath,
          name: file.name,
          contentType: file.type,
        }),
      });
      const completed = await completeResponse.json();
      if (!completeResponse.ok) throw new Error(completed.error || "Could not link receipt");

      setUploaded(true);
      toast({ title: "Receipt uploaded", description: "Our team will review your bank transfer before approval." });
    } catch (error) {
      toast({ title: "Receipt upload failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5 text-left">
      <BankTransferDetails />
      {entityId && uploadToken ? (
        <div className="rounded-sm border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-start gap-3">
            <ShieldCheck className="mt-0.5 text-secondary" size={18} />
            <div>
              <h3 className="font-bold text-secondary">Upload your payment receipt</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-gray-600">
                <li>Complete the bank transfer using the details above.</li>
                <li>Select the transfer receipt and upload it here.</li>
                <li>Our team will review it before approving this {entityType}.</li>
              </ol>
            </div>
          </div>
          {uploaded ? (
            <div aria-live="polite" className="flex items-center gap-2 rounded-sm bg-green-50 p-3 text-sm font-medium text-green-700"><CheckCircle2 size={18} /> Receipt received and awaiting review.</div>
          ) : (
            <div className="space-y-3">
              <Input
                type="file"
                accept=".pdf,image/jpeg,image/png,image/webp"
                onChange={(event) => handleFileChange(event.target.files?.[0])}
                disabled={uploading}
                className="h-11 bg-gray-50"
              />
              {file && (
                <p className="truncate text-sm text-gray-600">
                  Selected: <span className="font-medium text-secondary">{file.name}</span>
                </p>
              )}
              <div className="flex justify-end">
              <Button type="button" onClick={uploadReceipt} disabled={!file || uploading} className="shrink-0 bg-secondary text-white hover:bg-primary hover:text-secondary">
                {uploading ? <Loader2 className="animate-spin" /> : <FileUp />}
                {uploading ? "Uploading…" : "Upload receipt"}
              </Button>
              </div>
            </div>
          )}
          <p className="mt-3 text-xs text-gray-500">Accepted: PDF, JPG, PNG, or WEBP up to 10 MB.</p>
        </div>
      ) : (
        <p className="text-sm text-gray-600">After submitting, you’ll receive a reference and a secure receipt upload link.</p>
      )}
    </div>
  );
}