// リスト形式のレスポンス用
export type ListContentsResponse<T> = {
    contents: T[];
    totalCount: number;
    offset: number;
    limit: number;
  };
  
  // オブジェクト形式のレスポンス用
  export type ContentResponse<T> = {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
  } & T;