export interface House {
  id?: number;
  name?: string;
  address?: string;
  description?: string;
  numberRoom?: number;
  price?: number;
  discount?: number;
  status?: boolean;
  createdDate?: number;
  modifiedDate?: number;
  checked?: boolean;
  numberHires?: number;
  images?: any[];
  bill?: any[];
  houseDays?: any[];
  repComments?: any[];
  category?: any;
  user?: any;
  utilitie?: any[];
}
