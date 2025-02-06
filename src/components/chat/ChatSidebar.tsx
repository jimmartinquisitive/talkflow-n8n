import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatSession } from "@/types/chat";
import { MessageSquare, PlusCircle, Trash2, Pencil, Check, X, Star, Code } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  isSidebarOpen: boolean;
  onNewChat: () => void;
  onSessionSelect: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newName: string) => void;
  onToggleFavorite: (sessionId: string) => void;
}

export const ChatSidebar = ({
  sessions,
  currentSessionId,
  isSidebarOpen,
  onNewChat,
  onSessionSelect,
  onDeleteSession,
  onRenameSession,
  onToggleFavorite,
}: ChatSidebarProps) => {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const navigate = useNavigate();

  const getFirstMessage = (messages: ChatSession["messages"]) => {
    const userMessage = messages.find(m => m.role === "user");
    return userMessage ? userMessage.content : "New Chat";
  };

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const session = sessions.find(s => s.id === sessionId);
    
    if (session?.favorite) {
      toast.error("Cannot delete a favorite chat");
      return;
    }
    
    if (sessions.length === 1) {
      toast.error("Cannot delete the last chat session");
      return;
    }
    onDeleteSession(sessionId);
    toast.success("Chat deleted successfully");
  };

  const handleToggleFavorite = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    onToggleFavorite(sessionId);
    const session = sessions.find(s => s.id === sessionId);
    toast.success(session?.favorite ? "Chat removed from favorites" : "Chat added to favorites");
  };

  const startEditing = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingName(session.name || getFirstMessage(session.messages));
  };

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSessionId && editingName.trim()) {
      onRenameSession(editingSessionId, editingName.trim());
      setEditingSessionId(null);
      toast.success("Chat renamed successfully");
    }
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(null);
  };

  return (
    <div
      className={cn(
        "w-64 border-r border-surface-a20 bg-surface-a10 flex flex-col absolute md:relative z-40 h-full transition-transform duration-200 ease-in-out",
        !isSidebarOpen && "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="p-4 border-b border-surface-a20 flex flex-col gap-4">
        <Button 
          onClick={() => navigate('/playground')} 
          className="w-full flex items-center gap-2 bg-surface-a20 hover:bg-surface-a30 text-light-a0"
          variant="outline"
        >
          <Code className="w-4 h-4" />
          Code Playground
        </Button>
        <Button 
          onClick={onNewChat} 
          className="w-full flex items-center gap-2 bg-primary-a0 hover:bg-primary-a10 text-surface-a0"
        >
          <PlusCircle className="w-4 h-4" />
          New Chat
        </Button>
        <ThemeToggle />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSessionSelect(session.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg transition-colors group cursor-pointer",
                "flex items-center gap-2 text-sm relative text-light-a0",
                session.id === currentSessionId ? "bg-surface-a20" : "hover:bg-surface-a20"
              )}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <div className="truncate flex-1">
                {editingSessionId === session.id ? (
                  <form onSubmit={handleRename} onClick={e => e.stopPropagation()} className="flex items-center gap-2">
                    <Input
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      className="h-6 text-sm bg-surface-a30 border-surface-a40"
                      autoFocus
                    />
                    <Button type="submit" size="icon" variant="ghost" className="h-6 w-6 hover:bg-surface-a30">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="icon" variant="ghost" className="h-6 w-6 hover:bg-surface-a30" onClick={cancelEditing}>
                      <X className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <>
                    <div className="font-medium truncate">
                      {session.name || getFirstMessage(session.messages)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(session.lastUpdated, 'MMM d, h:mm a')}
                    </div>
                  </>
                )}
              </div>
              {editingSessionId !== session.id && (
                <div className="opacity-0 group-hover:opacity-100 absolute right-2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-6 w-6 hover:bg-surface-a30",
                      session.favorite && "text-primary-a0 opacity-100"
                    )}
                    onClick={(e) => handleToggleFavorite(e, session.id)}
                  >
                    <Star className="h-3 w-3" fill={session.favorite ? "currentColor" : "none"} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-surface-a30"
                    onClick={(e) => startEditing(e, session)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => handleDelete(e, session.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
