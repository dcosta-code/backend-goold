export interface MessageTemplateResponse {
  externalId: string;
  name: string;
  htmlContent: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageTemplateItemDTO {
  externalId?: string | null;
  name: string;
  htmlContent: string;
}
