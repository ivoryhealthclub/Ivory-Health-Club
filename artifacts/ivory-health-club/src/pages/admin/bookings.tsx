import { useState } from "react";
import { useListBookings, useUpdateBookingStatus, BookingStatusUpdateStatus, type Booking } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListBookingsQueryKey } from "@workspace/api-client-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, CheckCircle2, Clock3, Copy, Mail, Phone, UserRound, Users } from "lucide-react";

export default function AdminBookings() {
  const [filter, setFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [confirmationBooking, setConfirmationBooking] = useState<Booking | null>(null);
  const { data: bookings, isLoading } = useListBookings();
  const updateStatus = useUpdateBookingStatus();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const filtered = bookings?.filter(b => filter === "all" || b.status === filter) || [];

  const handleStatusUpdate = (id: number, status: BookingStatusUpdateStatus) => {
    updateStatus.mutate({ id, data: { status } }, {
      onSuccess: (updatedBooking) => {
        toast({ title: `Booking marked as ${status}` });
        queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        if (status === "confirmed") {
          setConfirmationBooking(updatedBooking);
        }
      },
      onError: () => {
        toast({ title: "Error updating status", variant: "destructive" });
      }
    });
  };

  const getServiceLabel = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const openBooking = (booking: Booking) => setSelectedBooking(booking);

  const reviewStatusUpdate = (status: BookingStatusUpdateStatus) => {
    if (!selectedBooking) return;
    handleStatusUpdate(selectedBooking.id, status);
    setSelectedBooking(null);
  };

  const getConfirmationMessage = (booking: Booking) =>
    `Hello ${booking.firstName},\n\nYour ${getServiceLabel(booking.serviceType)} booking at Ivory Health Club has been confirmed.\n\nDate: ${format(new Date(booking.bookingDate), "MMMM d, yyyy")}\nTime: ${booking.bookingTime || "To be arranged"}${booking.numberOfGuests ? `\nGuests: ${booking.numberOfGuests}` : ""}\n\nWe look forward to welcoming you.\n\nIvory Health Club`;

  const copyConfirmationMessage = async () => {
    if (!confirmationBooking) return;
    try {
      await navigator.clipboard.writeText(getConfirmationMessage(confirmationBooking));
      toast({ title: "Confirmation copied", description: "The message is ready to send to the client." });
    } catch {
      toast({ title: "Copy unavailable", description: "Select and copy the message manually.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-serif font-bold text-secondary">Bookings</h1>
        <div className="flex gap-2">
          {["all", "pending", "confirmed", "cancelled"].map(f => (
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
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
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
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No bookings found.</td>
                </tr>
              ) : (
                filtered.map(booking => (
                  <tr key={booking.id} className="cursor-pointer hover:bg-gray-50" onClick={() => openBooking(booking)}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{booking.firstName} {booking.lastName}</div>
                      <div className="text-gray-500 text-xs">{booking.email} • {booking.phone}</div>
                      {booking.numberOfGuests && booking.numberOfGuests > 1 && (
                        <div className="text-xs font-medium text-primary mt-1">Guests: {booking.numberOfGuests}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {getServiceLabel(booking.serviceType)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{format(new Date(booking.bookingDate), 'MMM d, yyyy')}</div>
                      <div className="text-gray-500 text-xs">{booking.bookingTime || 'No specific time'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={booking.paymentStatus === "paid" ? "border-green-200 text-green-700" : booking.paymentStatus === "receipt_submitted" ? "border-blue-200 text-blue-700" : "border-gray-200 text-gray-600"}>
                        {booking.paymentStatus === "receipt_submitted" ? "Receipt submitted" : booking.paymentStatus || "unpaid"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' : 
                        booking.status === 'pending' ? 'bg-orange-100 text-orange-800 border-orange-200' : 
                        'bg-red-100 text-red-800 border-red-200'
                      }>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={(event) => { event.stopPropagation(); handleStatusUpdate(booking.id, "confirmed"); }}>
                            Confirm
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={(event) => { event.stopPropagation(); handleStatusUpdate(booking.id, "cancelled"); }}>
                            Cancel
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" onClick={(event) => { event.stopPropagation(); openBooking(booking); }}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        {selectedBooking && (
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-secondary">Booking details</DialogTitle>
              <DialogDescription>
                Review the client request before confirming or cancelling it.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 rounded-md bg-gray-50 p-5 text-sm">
              <div className="flex items-start gap-3">
                <UserRound className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="font-semibold text-gray-900">{selectedBooking.firstName} {selectedBooking.lastName}</p>
                  <p className="text-gray-500">Client</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900 break-all">{selectedBooking.email}</p>
                    <p className="text-gray-500">Email</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedBooking.phone}</p>
                    <p className="text-gray-500">Phone</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900">{getServiceLabel(selectedBooking.serviceType)}</p>
                    <p className="text-gray-500">Service</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900">{format(new Date(selectedBooking.bookingDate), 'MMMM d, yyyy')}</p>
                    <p className="text-gray-500">{selectedBooking.bookingTime || 'No specific time'}</p>
                  </div>
                </div>
              </div>
              {selectedBooking.numberOfGuests && (
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedBooking.numberOfGuests}</p>
                    <p className="text-gray-500">Number of guests</p>
                  </div>
                </div>
              )}
              {selectedBooking.specialRequests && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="mb-1 font-semibold text-gray-900">Special requests</p>
                  <p className="whitespace-pre-wrap leading-6 text-gray-600">{selectedBooking.specialRequests}</p>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div>
                  <p className="font-semibold text-gray-900">Payment</p>
                  <p className="text-sm text-gray-500">{selectedBooking.paymentStatus === "receipt_submitted" ? "Receipt submitted for review" : selectedBooking.paymentStatus || "unpaid"}</p>
                </div>
                {selectedBooking.receiptObjectPath && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/api/storage${selectedBooking.receiptObjectPath}`} target="_blank" rel="noreferrer"><Copy size={14} /> Receipt</a>
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 border-t border-gray-200 pt-4">
                <span className="font-semibold text-gray-900">Status</span>
                <Badge variant="outline">{selectedBooking.status}</Badge>
              </div>
            </div>

            {selectedBooking.status === "pending" && (
              <DialogFooter>
                <Button variant="outline" className="text-red-600" onClick={() => reviewStatusUpdate("cancelled")} disabled={updateStatus.isPending}>
                  Cancel booking
                </Button>
                <Button onClick={() => reviewStatusUpdate("confirmed")} disabled={updateStatus.isPending}>
                  <CheckCircle2 />
                  {updateStatus.isPending ? "Confirming..." : "Confirm booking"}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={!!confirmationBooking} onOpenChange={(open) => !open && setConfirmationBooking(null)}>
        {confirmationBooking && (
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-secondary">Booking confirmed</DialogTitle>
              <DialogDescription>
                Automatic delivery is not connected. Use one of the options below to send this confirmation to the client.
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {getConfirmationMessage(confirmationBooking)}
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="outline" onClick={copyConfirmationMessage}>
                <Copy /> Copy message
              </Button>
              <Button variant="outline" asChild>
                <a
                  href={`mailto:${confirmationBooking.email}?subject=${encodeURIComponent("Your Ivory Health Club booking is confirmed")}&body=${encodeURIComponent(getConfirmationMessage(confirmationBooking))}`}
                >
                  <Mail /> Open email
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href={`sms:${confirmationBooking.phone}?body=${encodeURIComponent(getConfirmationMessage(confirmationBooking))}`}
                >
                  <Phone /> Open SMS
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
