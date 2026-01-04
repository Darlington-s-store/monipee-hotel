import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/types/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Search, MessageSquare, Send, CheckCheck } from 'lucide-react';

const AdminMessages = () => {
  const { getAllMessages, getAllUsers, updateMessage } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const messages = getAllMessages();
  const users = getAllUsers();

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.email || '';
  };

  const filteredMessages = messages.filter(message => {
    const userName = getUserName(message.userId).toLowerCase();
    return userName.includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleMarkAsRead = (messageId: string) => {
    updateMessage(messageId, { status: 'read' });
  };

  const handleReply = () => {
    if (!selectedMessage || !replyContent.trim()) return;

    const currentReplies = selectedMessage.replies || [];
    updateMessage(selectedMessage.id, {
      status: 'replied',
      replies: [
        ...currentReplies,
        {
          content: replyContent,
          createdAt: new Date().toISOString(),
          isAdmin: true,
        }
      ]
    });

    toast({
      title: 'Reply Sent',
      description: 'Your reply has been sent to the customer.',
    });

    setReplyContent('');
    setIsDialogOpen(false);
    setSelectedMessage(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Unread</Badge>;
      case 'read':
        return <Badge variant="outline" className="border-[#e6dccb] text-[#6b7280]">Read</Badge>;
      case 'replied':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Replied</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#0b1f3a]">Messages</h1>
        <p className="text-[#6b7280] mt-1">Customer inquiries and support requests</p>
      </div>

      {/* Search */}
      <Card className="bg-white border-[#e6dccb] shadow-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <Input
              placeholder="Search by customer name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#fbf8f2] border-[#efe6d7] text-[#111827] placeholder:text-[#6b7280]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <Card className="bg-white border-[#e6dccb] shadow-sm">
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-[#c8b79f] mb-4" />
            <p className="text-[#6b7280]">No messages found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              className={`bg-white border-[#e6dccb] shadow-sm cursor-pointer hover:bg-[#fbf8f2] transition-colors ${message.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''
                }`}
              onClick={() => {
                setSelectedMessage(message);
                setIsDialogOpen(true);
                if (message.status === 'unread') {
                  handleMarkAsRead(message.id);
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium text-[#111827]">{getUserName(message.userId)}</p>
                      {getStatusBadge(message.status)}
                    </div>
                    <p className="font-medium text-[#0b1f3a]">{message.subject}</p>
                    <p className="text-sm text-[#6b7280] line-clamp-2 mt-1">{message.content}</p>
                  </div>
                  <div className="text-right text-sm text-[#6b7280]">
                    <p>{format(new Date(message.createdAt), 'MMM d')}</p>
                    <p>{format(new Date(message.createdAt), 'p')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Message Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white border-[#e6dccb] text-[#111827] max-w-lg max-h-[80vh] overflow-y-auto">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
                <DialogDescription className="text-[#6b7280]">
                  From: {getUserName(selectedMessage.userId)} ({getUserEmail(selectedMessage.userId)})
                  <br />
                  {format(new Date(selectedMessage.createdAt), 'PPP')} at {format(new Date(selectedMessage.createdAt), 'p')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-[#fbf8f2] border border-[#efe6d7] rounded-lg">
                  <p className="text-[#111827]">{selectedMessage.content}</p>
                </div>

                {/* Replies */}
                {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-[#0b1f3a]">Conversation:</p>
                    {selectedMessage.replies.map((reply, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${reply.isAdmin
                            ? 'bg-primary/20 border-l-2 border-primary ml-4'
                            : 'bg-[#fbf8f2] border border-[#efe6d7] mr-4'
                          }`}
                      >
                        <p className="text-sm text-[#111827]">{reply.content}</p>
                        <p className="text-xs text-[#6b7280] mt-1">
                          {reply.isAdmin ? 'Monipee Team' : getUserName(selectedMessage.userId)} • {format(new Date(reply.createdAt), 'PPp')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <div className="space-y-2 pt-4 border-t border-[#efe6d7]">
                  <Label className="text-[#111827]">Reply</Label>
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="bg-[#fbf8f2] border-[#efe6d7] text-[#111827]"
                    rows={3}
                  />
                  <Button
                    onClick={handleReply}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!replyContent.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessages;
