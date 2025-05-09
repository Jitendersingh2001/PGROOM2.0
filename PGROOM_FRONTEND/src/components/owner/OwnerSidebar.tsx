import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Users,
  CreditCard,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NavItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
  isNew?: boolean;
}

interface OwnerSidebarProps {
  collapsed?: boolean;
}

/**
 * OwnerSidebar - Navigation sidebar for the owner dashboard
 * @param collapsed - Whether the sidebar is in collapsed state (icons only)
 */
const OwnerSidebar: React.FC<OwnerSidebarProps> = ({ collapsed = false }) => {
  // Main navigation items
  const mainNavItems: NavItemProps[] = [
    {
      name: 'Dashboard',
      path: '/owner/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Properties',
      path: '/owner/properties',
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: 'Tenants',
      path: '/owner/tenants',
      icon: <Users className="w-5 h-5" />,
    },
  ];

  // Secondary navigation items
  const secondaryNavItems: NavItemProps[] = [
    {
      name: 'Payments',
      path: '/owner/payments',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      name: 'Help & Support',
      path: '/owner/support',
      icon: <HelpCircle className="w-5 h-5" />,
    },
  ];

  // Render a navigation item
  const renderNavItem = (item: NavItemProps) => (
    <NavLink
      key={item.path}
      to={item.path}
      title={item.name}
      className={({ isActive }) =>
        cn(
          'flex items-center text-sm font-medium rounded-md transition-colors',
          'group hover:bg-gray-100 dark:hover:bg-gray-800',
          collapsed ? 'justify-center h-10 w-10 mx-auto my-1' : 'justify-between px-3 py-2',
          isActive
            ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
            : 'text-gray-700 dark:text-gray-300'
        )
      }
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
            Management
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

export default OwnerSidebar;
