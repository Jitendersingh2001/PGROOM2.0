
import { Plus, Send } from "lucide-react";

interface Message {
  sender: string;
  content: string;
  time: string;
  isMe?: boolean;
}

interface ChatCardProps {
  messages: Message[];
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function ChatCard({ messages, user }: ChatCardProps) {
  return (
    <div className="rounded-lg border bg-card flex flex-col h-full">
      <div className="border-b p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
          {user.avatar || user.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <button className="ml-auto rounded-full p-1 hover:bg-accent">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <p className="text-center text-xs text-muted-foreground">Hi, how can I help you today?</p>
        
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-4 py-2 max-w-[80%] ${message.isMe ? 'bg-sidebar-primary text-white' : 'bg-accent'}`}>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-1 rounded-md border border-border bg-background p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button className="rounded-md bg-sidebar-primary text-white p-2">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
