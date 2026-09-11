import { useListContactMessages, useMarkContactRead } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListContactMessagesQueryKey } from "@workspace/api-client-react";
import { RefreshCw } from "lucide-react";

export default function AdminMessages() {
  const { data: messages, isLoading, isError, isFetching, refetch } = useListContactMessages();
  const markRead = useMarkContactRead();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleMarkRead = (id: number, currentStatus: boolean) => {
    markRead.mutate({ id, data: { isRead: !currentStatus } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListContactMessagesQueryKey() });
        toast({
          title: currentStatus ? "Message marked unread" : "Message marked read",
        });
      },
      onError: () => {
        toast({ title: "Error updating message status", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary">Contact Messages</h1>
          <p className="mt-1 text-sm text-gray-500">
            {messages?.length ?? 0} {messages?.length === 1 ? "message" : "messages"} ·{" "}
            {messages?.filter((message) => !message.isRead).length ?? 0} unread
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="gap-2 border-secondary text-secondary"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          {isFetching ? "Refreshing…" : "Refresh messages"}
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading messages...</div>
        ) : isError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="font-bold text-red-800">Messages could not be loaded</h2>
            <p className="mt-2 text-sm text-red-700">
              Your admin session may have expired, or the server may be temporarily unavailable.
            </p>
            <Button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 bg-secondary text-white hover:bg-primary hover:text-secondary"
            >
              Try again
            </Button>
          </div>
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
                     disabled={markRead.isPending}
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
