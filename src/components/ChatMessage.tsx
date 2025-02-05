import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';
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
    <div
      className={cn(
        "flex w-full animate-fade-in transform transition-all duration-300 group",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 transition-all duration-200 backdrop-blur-sm hover:-translate-y-1 relative",
          isAssistant
            ? "bg-[#1A1F2C] text-white border border-slate-700/30"
            : "bg-[#7E69AB] text-white border border-violet-400/20"
        )}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          boxShadow: isAssistant 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
            : '0 4px 6px -1px rgba(126, 105, 171, 0.2), 0 2px 4px -1px rgba(126, 105, 171, 0.1)'
        }}
      >
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {message.imageData && (
            <div className="mb-2">
              <Dialog>
                <DialogTrigger asChild>
                  <img
                    src={`data:${message.imageData.mimeType};base64,${message.imageData.data}`}
                    alt={message.imageData.fileName}
                    className="max-w-[200px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-auto">
                  <img
                    src={`data:${message.imageData.mimeType};base64,${message.imageData.data}`}
                    alt={message.imageData.fileName}
                    className="w-full h-full object-contain"
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
          <div className="overflow-x-auto">
            <div className="markdown-content break-words">
              <MarkdownRenderer content={message.content} />
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {formattedTime}
          </span>
          {isAssistant && (
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-700/50"
              onClick={handleCopy}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy response
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};