export interface EmailSignatureResponse {
  externalId: string;
  htmlContent: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateEmailSignatureDTO {
  htmlContent: string;
}
