import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Building,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex flex-col border-r bg-sidebar-background text-sidebar-foreground h-screen transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex items-center h-16 px-4 border-b">
        {!collapsed && (
          <h1 className="text-xl font-bold">PGROOM</h1>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "ml-auto flex h-8 w-8 items-center justify-center rounded-full hover:bg-sidebar-accent",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex flex-col flex-1 py-6">
        <nav className="flex flex-col gap-2 px-2">
          <Link to="/properties" className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
            collapsed && "justify-center"
          )}>
            <Building size={20} />
            {!collapsed && <span>Properties</span>}
          </Link>

          <Link to="/tenants" className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
            collapsed && "justify-center"
          )}>
            <Users size={20} />
            {!collapsed && <span>Tenants</span>}
          </Link>
        </nav>
      </div>

      <div className="flex flex-col p-4 border-t mt-auto">
        <div className={cn(
          "flex items-center gap-3 rounded-lg",
          collapsed ? "justify-center" : ""
        )}>
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-white">
            S
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">Sofia Davis</span>
              <span className="text-xs text-sidebar-foreground/70">m@example.com</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
