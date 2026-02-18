
export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface SaleItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  code?: string;
  imageUrl?: string;
}

export interface Transaction {
  id: string;
  items: SaleItem[];
  total: number;
  timestamp: number;
}

export interface DailyGain {
  date: string;
  total: number;
}

export interface MonthlyGain {
  month: string;
  total: number;
}

export interface YearlyGain {
  year: string;
  total: number;
}
