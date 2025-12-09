export interface TagResponse {
  externalId: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TagItemDTO {
  externalId?: string | null;
  name: string;
  backgroundColor: string;
  textColor: string;
}
