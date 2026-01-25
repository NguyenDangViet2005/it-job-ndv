// Connection Model Types

export interface Connection {
  id: number;
  userId: number;
  connectedUserId: number;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    fullName: string;
    avatar?: string;
    email: string;
  };
  connectedUser?: {
    id: number;
    fullName: string;
    avatar?: string;
    email: string;
  };
}
