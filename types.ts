export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  FILES = 'FILES',
  CONTENT = 'CONTENT',
  CATEGORIES = 'CATEGORIES',
  PRODUCTS = 'PRODUCTS',
  REPORTS = 'REPORTS'
}

export interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'document';
  url: string; // Object URL for preview
  size: number;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  level: number;
  children?: Category[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageId: string | null; // References FileItem.id
  categoryId: string;
}

export interface ContentDraft {
  id: string;
  title: string;
  body: string;
  status: 'draft' | 'published';
  author: string;
  date: string;
}

export interface ReportData {
  name: string;
  value: number;
}
