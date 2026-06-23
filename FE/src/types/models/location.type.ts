export interface Province {
  id: number;
  name: string;
}

export interface Ward {
  id: number;
  provinceid: number;
  name: string;
}
