export const TicketStatusNames = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  CLOSED: "closed",
} as const;

export type TicketStatusName =
  (typeof TicketStatusNames)[keyof typeof TicketStatusNames];

export interface AssignTicketDTO {
  employeeId: string;
}

export interface UpdateTicketStatusDTO {
  statusId: string;
}

export interface TicketStatusResponse {
  externalId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketResponse {
  externalId: string;
  status: {
    externalId: string;
    name: string;
  } | null;
  customer: {
    externalId: string;
    fullName: string;
    email: string;
  } | null;
  startedEmployee: {
    externalId: string;
    fullName: string;
    email: string;
  } | null;
  assignedEmployee: {
    externalId: string;
    fullName: string;
    email: string;
  } | null;
  tags: {
    externalId: string;
    name: string;
    backgroundColor: string;
    textColor: string;
  }[];
  lastCustomerMessage: {
    externalId: string;
    content: string;
    createdAt: Date;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketListResponse {
  tickets: TicketResponse[];
  total: number;
  limit: number;
  offset: number;
}
