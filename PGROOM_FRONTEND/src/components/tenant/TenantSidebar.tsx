import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Building2,
  CreditCard,
  HelpCircle,
  ChevronRight,
  Wrench,
  User,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useTenantRoomStatus } from '@/hooks/useTenantRoomStatus';

interface NavItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
  isNew?: boolean;
}

interface TenantSidebarProps {
  collapsed?: boolean;
}

/**
 * TenantSidebar - Navigation sidebar for the tenant dashboard
 * @param collapsed - Whether the sidebar is in collapsed state (icons only)
 */
const TenantSidebar: React.FC<TenantSidebarProps> = ({ collapsed = false }) => {
  // Get tenant room status for conditional navigation
  const { hasRoom, isLoading } = useTenantRoomStatus();

  // Base navigation items (always shown)
  const baseNavItems: NavItemProps[] = [
    {
      name: 'Dashboard',
      path: '/tenant/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
  ];

  // Conditional navigation items based on room assignment
  const conditionalNavItems: NavItemProps[] = [];
  
  if (isLoading) {
    // Show loading state
    conditionalNavItems.push({
      name: 'Loading...',
      path: '#',
      icon: <Loader2 className="w-5 h-5 animate-spin" />,
    });
  } else if (hasRoom) {
    // Tenant has room assigned - show Room option
    conditionalNavItems.push({
      name: 'My Room',
      path: '/tenant/room',
      icon: <Home className="w-5 h-5" />,
    });
  } else {
    // Tenant has no room assigned - show Properties option
    conditionalNavItems.push({
      name: 'Properties',
      path: '/tenant/properties',
      icon: <Building2 className="w-5 h-5" />,
    });
  }

  // Other main navigation items
  const otherMainNavItems: NavItemProps[] = [
    {
      name: 'Payments',
      path: '/tenant/payments',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      name: 'Maintenance',
      path: '/tenant/maintenance',
      icon: <Wrench className="w-5 h-5" />,
    }
  ];

  // Combine all main navigation items
  const mainNavItems = [...baseNavItems, ...conditionalNavItems, ...otherMainNavItems];

  // Secondary navigation items
  const secondaryNavItems: NavItemProps[] = [
    {
      name: 'Profile',
      path: '/tenant/profile',
      icon: <User className="w-5 h-5" />,
    },
    {
      name: 'Support',
      path: '/tenant/support',
      icon: <HelpCircle className="w-5 h-5" />,
    }
  ];

  // Render individual nav item
  const renderNavItem = (item: NavItemProps) => {
    // Disable loading item
    const isDisabled = item.path === '#';
    
    return (
      <NavLink
        key={item.path}
        to={item.path}
        title={item.name}
        className={({ isActive }) =>
          cn(
            'flex items-center text-sm font-medium rounded-md transition-colors',
            'group hover:bg-gray-100 dark:hover:bg-gray-800',
            collapsed ? 'justify-center h-10 w-10 mx-auto my-1' : 'justify-between px-3 py-2',
            isDisabled && 'pointer-events-none cursor-not-allowed opacity-50',
            isActive && !isDisabled
              ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
              : 'text-gray-700 dark:text-gray-300'
          )
        }
        onClick={isDisabled ? (e) => e.preventDefault() : undefined}
      >
        <div className={cn("flex items-center", collapsed ? "justify-center" : "")}>
          <span className={cn(
            "text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary",
            collapsed ? "" : "mr-3"
          )}>
            {item.icon}
          </span>
          {!collapsed && (
            <span>{item.name}</span>
          )}
          {!collapsed && item.isNew && (
            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20 text-xs">
              New
            </Badge>
          )}
        </div>
        {!collapsed && item.badge && (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
            {item.badge}
          </Badge>
        )}
      </NavLink>
    );
  };

  return (
    <div className={cn(
      "h-full flex flex-col overflow-y-auto",
      collapsed ? "py-4" : "py-6"
    )}>
      {/* Main Navigation */}
      {!collapsed && (
        <div className="px-3 mb-2">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Main
          </h3>
        </div>
      )}
      <nav className={cn(
        "flex-none",
        collapsed ? "flex flex-col items-center px-0" : "space-y-1 px-3",
        "mb-8"
      )}>
        {mainNavItems.map(renderNavItem)}
      </nav>

      {/* Secondary Navigation */}
      {!collapsed && (
        <div className="px-3 mb-2">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Settings & Support
          </h3>
        </div>
      )}
      <nav className={cn(
        "flex-none",
        collapsed ? "flex flex-col items-center px-0" : "space-y-1 px-3"
      )}>
        {secondaryNavItems.map(renderNavItem)}
      </nav>
    </div>
  );
};

export default TenantSidebar;
