
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Copy, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { MarkdownRenderer } from './chat/MarkdownRenderer';
import { useTheme } from '@/hooks/useTheme';
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
  const { currentTheme, mode } = useTheme();
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

  const getMessageStyles = () => {
    const colors = mode === 'light' ? currentTheme.light : currentTheme.dark;
    const primaryColor = `hsl(${colors.primary})`;
    const primaryAlpha = (opacity: number) => `hsla(${colors.primary}, ${opacity})`;
    
    if (isAssistant) {
      return {
        background: `linear-gradient(to bottom right, hsl(${colors.background}), hsl(${colors.muted}))`,
        border: `1px solid hsla(${colors.border}, 0.2)`,
        color: `hsl(${colors.foreground})`,
        boxShadow: `0 4px 6px -1px rgba(148, 163, 184, 0.2), 0 2px 4px -1px rgba(148, 163, 184, 0.1), 0 8px 24px -4px rgba(148, 163, 184, 0.15)`
      };
    } else {
      return {
        background: `linear-gradient(to bottom right, ${primaryColor}, ${primaryAlpha(0.8)})`,
        border: `1px solid ${primaryAlpha(0.2)}`,
        color: `hsl(${colors.primaryForeground})`,
        boxShadow: `0 4px 6px -1px ${primaryAlpha(0.15)}, 0 2px 4px -1px ${primaryAlpha(0.1)}, 0 8px 24px -4px ${primaryAlpha(0.15)}`
      };
    }
  };

  const messageStyles = getMessageStyles();

  return (
    <div
      className={cn(
        "flex w-full animate-fade-in transform transition-all duration-300 group",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div
        className="max-w-[85%] rounded-2xl px-4 py-3 transition-all duration-200 backdrop-blur-sm hover:-translate-y-1 relative"
        style={{
          ...messageStyles,
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {isAssistant && (
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="flex items-center justify-center w-6 h-6 rounded-full"
              style={{
                background: `linear-gradient(to bottom right, ${messageStyles.background.split(',')[1]}, ${messageStyles.background.split(',')[2].replace(')','')})`,
              }}
            >
              <Bot className="w-4 h-4" style={{ color: messageStyles.color }} />
            </div>
            <span className="text-sm font-medium" style={{ color: messageStyles.color }}>
              {assistantName}
            </span>
          </div>
        )}
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
          <span 
            className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: `${messageStyles.color.replace(')', ', 0.6)')}` }}
          >
            {formattedTime}
          </span>
          {isAssistant && (
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-transparent"
              onClick={handleCopy}
              style={{ color: `${messageStyles.color.replace(')', ', 0.6)')}` }}
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
