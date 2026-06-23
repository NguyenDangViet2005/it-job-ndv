import { Company, User } from "@/types";
import { createContext } from "react";

export interface AuthContextType {
  user: User | null;
  company: Company | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  // State setters (Actions)
  setAuth: (user: User, token: string) => void;
  setCompany: (company: Company) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
