
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { Loader2, Send, Mic, X } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { ImageUpload } from "./ImageUpload";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent, file?: File) => Promise<boolean>;
  onImageSelect?: (file: File) => void;
}

export const ChatInput = ({
  input,
  isLoading,
  onInputChange,
  onSend,
  onImageSelect,
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState<{ file: File; url: string } | null>(null);
  const { isListening, startListening } = useSpeechRecognition({
    onTranscript: (transcript) => onInputChange(input + transcript)
  });

  // Cleanup image URL when component unmounts or when previewImage changes
  useEffect(() => {
    return () => {
      if (previewImage?.url) {
        URL.revokeObjectURL(previewImage.url);
      }
    };
  }, [previewImage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;

    try {
      const result = await onSend(e, previewImage?.file);
      
      if (result !== false) {
        // Clean up the old image URL before removing the preview
        if (previewImage?.url) {
          URL.revokeObjectURL(previewImage.url);
        }
        setPreviewImage(null);
        
        // Refocus the textarea after successful send
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 0);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      toast({
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    if (!onImageSelect) return;

    const items = e.clipboardData?.items;
    const imageItem = Array.from(items).find(item => item.type.indexOf('image') !== -1);

    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast({
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Clean up old image URL if it exists
      if (previewImage?.url) {
        URL.revokeObjectURL(previewImage.url);
      }
      handleImageSelection(file);
    }
  };

  const handleImageSelection = (file: File) => {
    // Clean up old image URL if it exists
    if (previewImage?.url) {
      URL.revokeObjectURL(previewImage.url);
    }
    
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage({ file, url: imageUrl });
    
    if (onImageSelect) {
      onImageSelect(file);
    }
    // Refocus textarea after image selection
    textareaRef.current?.focus();
  };

  const clearPreviewImage = () => {
    if (previewImage?.url) {
      URL.revokeObjectURL(previewImage.url);
      setPreviewImage(null);
    }
    // Refocus textarea after clearing image
    textareaRef.current?.focus();
  };

  const isInputEmpty = !input.trim() && !previewImage?.file;

  return (
    <form onSubmit={handleSubmit} className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full px-4 py-2">
      <div className="max-w-[900px] mx-auto">
        {previewImage && (
          <div className="relative inline-block mb-2">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <img
                src={previewImage.url}
                alt="Preview"
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={clearPreviewImage}
                className="absolute top-0 right-0 p-1 bg-black/50 rounded-bl hover:bg-black/70"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        )}
        <div className="relative">
          <Textarea
            placeholder="Type a message or paste an image..."
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            ref={textareaRef}
            rows={2}
            className="min-h-[24px] w-full resize-none bg-muted/50 dark:bg-muted/20 text-foreground rounded-xl pr-24 pl-12 py-4 focus-visible:ring-1 border-none overflow-y-hidden"
            disabled={isLoading}
            style={{
              height: input ? 'auto' : '80px',
              minHeight: '80px',
              maxHeight: '200px',
              overflowY: input ? 'auto' : 'hidden'
            }}
          />
          <div className="absolute left-3 bottom-4">
            {onImageSelect && (
              <ImageUpload 
                onImageSelect={handleImageSelection}
                disabled={isLoading}
              />
            )}
          </div>
          <div className="absolute right-3 bottom-4 flex items-center gap-2">
            <Button 
              type="button" 
              size="icon" 
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={startListening}
              disabled={isLoading}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button 
              type="submit" 
              size="icon"
              className="h-8 w-8"
              disabled={isLoading || isInputEmpty}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
