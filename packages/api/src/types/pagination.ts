export interface PaginationMeta {
  count: number;
}

export interface PageableResponse<T> {
  records: T[];
  _meta: PaginationMeta;
}
