
import { Message } from '@/types/chat';
import { Copy, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { MarkdownRenderer } from './chat/MarkdownRenderer';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === 'assistant';
  const { toast } = useToast();
  const formattedTime = format(new Date(message.timestamp), 'MMM d, yyyy h:mm a');
  const assistantName = window.env?.VITE_ASSISTANT_NAME || import.meta.env.VITE_ASSISTANT_NAME || "Lovable";

  const handleCopy = async () => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = message.content;
      
      const cleanText = tempDiv.innerText
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      await navigator.clipboard.writeText(cleanText);
      
      toast({
        description: "Message copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy text:', err);
      toast({
        description: "Failed to copy text",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <div className={`chat-message-wrapper animate-fade-in ${isAssistant ? 'assistant' : 'user'}`}>
      <div className={`chat-message ${isAssistant ? 'assistant' : 'user'}`}>
        {isAssistant && (
          <div className="assistant-header">
            <div className="assistant-avatar">
              <Bot className="avatar-icon" />
            </div>
            <span className="assistant-name">
              {assistantName}
            </span>
          </div>
        )}
        <div className="message-content">
          {message.imageData && (
            <div className="message-image">
              <Dialog>
                <DialogTrigger asChild>
                  <img
                    src={`data:${message.imageData.mimeType};base64,${message.imageData.data}`}
                    alt={message.imageData.fileName}
                    className="preview-image"
                  />
                </DialogTrigger>
                <DialogContent className="image-dialog">
                  <img
                    src={`data:${message.imageData.mimeType};base64,${message.imageData.data}`}
                    alt={message.imageData.fileName}
                    className="full-image"
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
          <div className="markdown-wrapper">
            <MarkdownRenderer content={message.content} />
          </div>
        </div>
        <div className="message-footer">
          <span className="timestamp">
            {formattedTime}
          </span>
          {isAssistant && (
            <Button
              variant="ghost"
              size="sm"
              className="copy-button"
              onClick={handleCopy}
            >
              <Copy className="copy-icon" />
              Copy response
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
