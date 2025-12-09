export const SenderTypes = {
  CUSTOMER: "customer",
  EMPLOYEE: "employee",
} as const;

export type SenderType = (typeof SenderTypes)[keyof typeof SenderTypes];

export interface CreateMessageDTO {
  ticketId: string;
  content: string;
}

export interface MessageResponse {
  externalId: string;
  ticketExternalId: string;
  senderType: SenderType;
  senderId: number;
  content: string;
  createdAt: Date;
}

export interface MessageListResponse {
  messages: MessageResponse[];
  total: number;
  limit: number;
  offset: number;
}
