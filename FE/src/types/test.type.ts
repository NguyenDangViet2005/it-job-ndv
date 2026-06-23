export interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
  href?: string;
  badge?: number | string;
  subItems?: NavigationItem[];
  isActive?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
  href?: string;
  onClick?: () => void;
  badge?: number | string;
  disabled?: boolean;
}
