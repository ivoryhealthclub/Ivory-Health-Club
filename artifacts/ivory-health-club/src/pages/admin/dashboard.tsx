import { useEffect, useState } from "react";
import { useGetAdminStats, useGetRecentActivity, useGetPaymentSettings, useUpdatePaymentSettings } from "@workspace/api-client-react";
import { Users, FileText, CheckCircle, Clock, CreditCard, Mail } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity({ limit: 10 });
  const { data: paymentSettings } = useGetPaymentSettings();
  const updatePaymentSettings = useUpdatePaymentSettings();
  const { toast } = useToast();
  const [paymentForm, setPaymentForm] = useState({ bankName: "", accountName: "", accountNumber: "", instructions: "" });

  useEffect(() => {
    if (paymentSettings) {
      setPaymentForm({
        bankName: paymentSettings.bankName,
        accountName: paymentSettings.accountName,
        accountNumber: paymentSettings.accountNumber,
        instructions: paymentSettings.instructions,
      });
    }
  }, [paymentSettings]);

  const savePaymentSettings = () => {
    updatePaymentSettings.mutate({ data: paymentForm }, {
      onSuccess: () => toast({ title: "Payment details updated" }),
      onError: () => toast({ title: "Could not update payment details", variant: "destructive" }),
    });
  };

  if (statsLoading || activityLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-secondary">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-32 bg-white rounded-md shadow-sm animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Members", value: stats?.totalMembers, icon: Users, color: "text-blue-600" },
    { label: "Active Members", value: stats?.activeMembers, icon: CheckCircle, color: "text-green-600" },
    { label: "Pending Enrollments", value: stats?.pendingEnrollments, icon: Clock, color: "text-orange-600" },
    { label: "Total Revenue", value: `₦${stats?.totalRevenue.toLocaleString()}`, icon: CreditCard, color: "text-purple-600" },
    { label: "Total Bookings", value: stats?.totalBookings, icon: FileText, color: "text-indigo-600" },
    { label: "Confirmed Bookings", value: stats?.confirmedBookings, icon: CheckCircle, color: "text-emerald-600" },
    { label: "Pending Bookings", value: stats?.pendingBookings, icon: Clock, color: "text-amber-600" },
    { label: "Unread Messages", value: stats?.unreadMessages, icon: Mail, color: "text-red-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary mb-2">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome to the Ivory Health Club admin portal.</p>
        </div>
        <div className="text-sm font-medium text-gray-400">
          {format(new Date(), 'EEEE, MMMM do yyyy')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-md shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-secondary">{stat.value || 0}</h3>
            </div>
            <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6">
        <div className="mb-5">
          <h2 className="font-bold text-lg text-secondary">Payment Management</h2>
          <p className="text-sm text-gray-500">These bank details are shown on booking and enrollment forms. Bank transfer is the only accepted payment method.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Input value={paymentForm.bankName} onChange={(event) => setPaymentForm({ ...paymentForm, bankName: event.target.value })} placeholder="Bank name" />
          <Input value={paymentForm.accountName} onChange={(event) => setPaymentForm({ ...paymentForm, accountName: event.target.value })} placeholder="Account name" />
          <Input value={paymentForm.accountNumber} onChange={(event) => setPaymentForm({ ...paymentForm, accountNumber: event.target.value })} placeholder="Account number" />
        </div>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <Textarea value={paymentForm.instructions} onChange={(event) => setPaymentForm({ ...paymentForm, instructions: event.target.value })} placeholder="Payment instructions" className="min-h-[90px]" />
          <Button onClick={savePaymentSettings} disabled={updatePaymentSettings.isPending} className="shrink-0 bg-secondary text-white hover:bg-primary hover:text-secondary sm:self-end">
            {updatePaymentSettings.isPending ? "Saving…" : "Save payment details"}
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-bold text-lg text-secondary">Recent Activity</h2>
        </div>
        <div className="p-0">
          {activity?.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No recent activity.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {activity?.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                  <div className={`p-2 rounded-full shrink-0 ${
                    item.type === 'enrollment' ? 'bg-blue-100 text-blue-600' :
                    item.type === 'booking' ? 'bg-purple-100 text-purple-600' :
                    item.type === 'payment' ? 'bg-green-100 text-green-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {item.type === 'enrollment' ? <Users size={16} /> :
                     item.type === 'booking' ? <FileText size={16} /> :
                     item.type === 'payment' ? <CreditCard size={16} /> :
                     <Mail size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.title}</p>
                    <p className="text-sm text-gray-500 truncate">{item.description}</p>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {format(new Date(item.timestamp), 'MMM d, h:mm a')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
