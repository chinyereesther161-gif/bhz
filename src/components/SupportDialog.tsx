import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SupportDialog = ({ open, onOpenChange }: SupportDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({ title: "Error", description: "Subject and message are required", variant: "destructive" });
      return;
    }
    if (!user) return;

    setLoading(true);
    const { error } = await supabase.from("support_messages").insert({
      user_id: user.id,
      subject: subject.trim(),
      message: message.trim(),
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "Our support team will get back to you soon." });
      setSubject("");
      setMessage("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Contact Support
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="What do you need help with?" />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your issue..." rows={4} />
          </div>
          <Button className="w-full gap-2" onClick={handleSend} disabled={loading}>
            <Send className="h-4 w-4" />
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportDialog;
