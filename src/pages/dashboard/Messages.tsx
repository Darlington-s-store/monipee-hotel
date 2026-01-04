import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send, Plus } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Messages = () => {
  const { user, getMessages, addMessage } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({ subject: '', content: '' });
  const messages = getMessages();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    addMessage({
      userId: user.id,
      subject: newMessage.subject,
      content: newMessage.content,
    });

    toast({ title: 'Message Sent', description: 'Our team will respond shortly.' });
    setNewMessage({ subject: '', content: '' });
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">New</Badge>;
      case 'read':
        return <Badge variant="outline">Read</Badge>;
      case 'replied':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Replied</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">Contact our support team</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send a Message</DialogTitle>
              <DialogDescription>
                Our team typically responds within 24 hours
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Booking inquiry"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  placeholder="How can we help you?"
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No messages yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>Start a Conversation</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{message.subject}</CardTitle>
                    <CardDescription>
                      {format(new Date(message.createdAt), 'PPP')} at {format(new Date(message.createdAt), 'p')}
                    </CardDescription>
                  </div>
                  {getStatusBadge(message.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{message.content}</p>
                
                {message.replies && message.replies.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <hr />
                    <p className="text-sm font-medium">Replies:</p>
                    {message.replies.map((reply, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg ${
                          reply.isAdmin 
                            ? 'bg-primary/10 border-l-2 border-primary' 
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{reply.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {reply.isAdmin ? 'Monipee Team' : 'You'} • {format(new Date(reply.createdAt), 'PPP')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
