import { useState, useEffect, useCallback } from 'react';

interface UseSidebarOptions {
  defaultCollapsed?: boolean;
  mobileBreakpoint?: number;
}

/**
 * Custom hook for managing sidebar state
 * 
 * This hook handles the responsive behavior of the sidebar,
 * including open/closed state and collapsed/expanded state.
 * 
 * @param options - Configuration options
 * @returns Sidebar state and control functions
 */
export function useSidebar({
  defaultCollapsed = false,
  mobileBreakpoint = 1024
}: UseSidebarOptions = {}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < mobileBreakpoint;
      setIsMobile(isMobileView);
      
      // Auto-close sidebar on mobile, maintain state on desktop
      if (isMobileView) {
        setSidebarOpen(false);
        setSidebarCollapsed(false);
      } else {
        setSidebarOpen(true);
        // Keep the current collapsed state on desktop resize
      }
    };

    // Initial check
    checkMobile();

    // Add event listener with debounce for better performance
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 100);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [mobileBreakpoint]);

  // Toggle sidebar function
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      // On mobile: toggle between fully open and fully closed
      setSidebarOpen(!sidebarOpen);
      setSidebarCollapsed(false);
    } else {
      // On desktop: toggle between expanded and collapsed (icons only)
      setSidebarCollapsed(!sidebarCollapsed);
      setSidebarOpen(true);
    }
  }, [isMobile, sidebarOpen, sidebarCollapsed]);

  return {
    sidebarOpen,
    sidebarCollapsed,
    isMobile,
    toggleSidebar,
    setSidebarOpen,
    setSidebarCollapsed
  };
}

export default useSidebar;
