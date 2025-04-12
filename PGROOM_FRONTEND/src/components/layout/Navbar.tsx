
import { Bell, Moon, Search, Sun } from "lucide-react";
import { useState, useEffect } from "react";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has a theme preference stored or prefers dark mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      // Switch to light mode
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      // Switch to dark mode
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <div className="flex h-16 items-center border-b bg-background px-6 gap-4">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      
      <div className="ml-auto flex items-center gap-4">
        <button 
          className="rounded-full w-9 h-9 flex items-center justify-center hover:bg-accent transition-colors" 
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        
        <button className="rounded-full w-9 h-9 flex items-center justify-center hover:bg-accent transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        
        <button className="rounded-full w-9 h-9 flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground">
          SD
        </button>
      </div>
    </div>
  );
}
