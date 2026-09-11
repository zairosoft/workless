export type CompanyRecord = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  texts: CompanyTextRecord[];
  logo?: string | null;
  isActive: boolean;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
};

export type CompanyTextRecord = {
  locale: string;
  name: string;
  description: string | null;
};

export type CompanyTextInput = {
  locale: string;
  name: string;
  description?: string | null;
};

export type CreateCompanyInput = {
  name: string;
  code: string;
  description?: string;
  texts?: CompanyTextInput[];
  logo?: string;
  isActive?: boolean;
};

export type UpdateCompanyInput = Partial<CreateCompanyInput>;
