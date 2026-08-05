import { useListContactMessages, useMarkContactRead } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListContactMessagesQueryKey } from "@workspace/api-client-react";

export default function AdminMessages() {
  const { data: messages, isLoading } = useListContactMessages();
  const markRead = useMarkContactRead();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleMarkRead = (id: number, currentStatus: boolean) => {
    markRead.mutate({ id, data: { isRead: !currentStatus } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListContactMessagesQueryKey() });
      },
      onError: () => {
        toast({ title: "Error updating message status", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-secondary">Contact Messages</h1>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading messages...</div>
        ) : messages?.length === 0 ? (
          <div className="bg-white p-8 text-center text-gray-500 rounded-md shadow-sm border border-gray-100">
            No messages found.
          </div>
        ) : (
          messages?.map(msg => (
            <div key={msg.id} className={`bg-white p-6 rounded-md shadow-sm border ${!msg.isRead ? 'border-l-4 border-l-primary' : 'border-gray-100'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg text-secondary">{msg.subject}</h3>
                    {!msg.isRead && <Badge className="bg-primary text-secondary">New</Badge>}
                  </div>
                  <p className="text-sm font-medium text-gray-900">{msg.name} <span className="text-gray-400 font-normal">({msg.email}) {msg.phone && `• ${msg.phone}`}</span></p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-2">{format(new Date(msg.createdAt), 'MMM d, yyyy h:mm a')}</div>
                  <Button 
                    size="sm" 
                    variant={msg.isRead ? "outline" : "default"} 
                    className={!msg.isRead ? "bg-secondary text-white" : ""}
                    onClick={() => handleMarkRead(msg.id, msg.isRead)}
                  >
                    {msg.isRead ? "Mark Unread" : "Mark Read"}
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-sm text-gray-700 whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
