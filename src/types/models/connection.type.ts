// Connection Model Types

export interface Connection {
  id: number;
  userid: number;
  connecteduserid: number;
  status: "pending" | "accepted" | "rejected";
  createdat: string;
  updatedat: string;
  user?: {
    id: number;
    fullname: string;
    avatar?: string;
    email: string;
  };
  connectedUser?: {
    id: number;
    fullname: string;
    avatar?: string;
    email: string;
  };
}
