/**
 * 共通の型定義
 */

// Blog関連
export interface BlogItem {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  imagePosition: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Next.js App Router パラメータ型
export interface RouteParams<T> {
  params: Promise<T>;
}

export interface IdParams {
  id: string;
}
