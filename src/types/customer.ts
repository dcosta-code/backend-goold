export interface CreateCustomerDTO {
  cpf: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface CustomerResponse {
  externalId: string;
  cpf: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateCustomerDTO {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
}
