import { createContext } from "react";
import type { UserResponse, CompanyResponse } from "@/types/api.type";

export interface AuthContextType {
  user: UserResponse | null;
  company: CompanyResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  // State setters (Actions)
  setAuth: (user: UserResponse, token: string) => void;
  setCompany: (company: CompanyResponse) => void;
  updateUser: (userData: Partial<UserResponse>) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
