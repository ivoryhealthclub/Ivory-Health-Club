import { useState } from "react";
import { useListBookings, useUpdateBookingStatus, BookingStatusUpdateStatus } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListBookingsQueryKey } from "@workspace/api-client-react";

export default function AdminBookings() {
  const [filter, setFilter] = useState<string>("all");
  const { data: bookings, isLoading } = useListBookings();
  const updateStatus = useUpdateBookingStatus();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const filtered = bookings?.filter(b => filter === "all" || b.status === filter) || [];

  const handleStatusUpdate = (id: number, status: BookingStatusUpdateStatus) => {
    updateStatus.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast({ title: `Booking marked as ${status}` });
        queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
      },
      onError: () => {
        toast({ title: "Error updating status", variant: "destructive" });
      }
    });
  };

  const getServiceLabel = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No bookings found.</td>
                </tr>
              ) : (
                filtered.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50">
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
                          <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleStatusUpdate(booking.id, "confirmed")}>
                            Confirm
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleStatusUpdate(booking.id, "cancelled")}>
                            Cancel
                          </Button>
                        </>
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
