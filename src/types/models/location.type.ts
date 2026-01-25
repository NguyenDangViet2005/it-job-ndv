// Location Model Types

export interface Province {
  id: number;
  name: string;
}

export interface Ward {
  id: number;
  provinceId: number;
  name: string;
}
