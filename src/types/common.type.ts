// Common Types - Shared UI component types only
// Note: Model types are in /models folder

// ============ UI Component Types ============
export type LogoItem =
  | {
      node: React.ReactNode;
      key?: string | number;
    }
  | {
      src: string;
      alt: string;
      key?: string | number;
    };

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
}

export interface AnimatedItemProps {
  children: React.ReactNode;
  delay?: number;
}

export interface AnimatedListProps {
  title?: string;
  items?: string[];
  children?: React.ReactNode;
}

// ============ Sheet Component ============
export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<any> {
  side?: "top" | "right" | "bottom" | "left";
}

// ============ Pagination ============
export type PaginationLinkProps = {
  isActive?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
} & React.ComponentProps<any>;

// ============ Form ============
export type FormFieldContextValue<
  TName = any,
> = {
  name: TName;
};

export type FormItemContextValue = {
  id: string;
};

