import type {
  AccountType,
  CategoryType,
  ImportType,
  InvoiceStatus,
  Recurrence,
  TransactionType,
} from "./enums.ts";

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface BankAccount {
  ID: string;
  UserID: string;
  Name: string;
  AccountType: AccountType;
  BankName: string;
  Balance: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Category {
  ID: string;
  UserID: string;
  Name: string;
  CategoryType: CategoryType;
  Color: string | null;
  Icon: string | null;
}

export interface CreditCard {
  ID: string;
  UserID: string;
  Name: string;
  CreditLimit: string;
  CloseDay: number;
  DueDay: number;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Transaction {
  ID: string;
  AccountID: string;
  CategoryID: string;
  InvoiceID: string | null;
  PlannedIncome: string | null;
  PlannedExpense: string | null;
  Amount: string;
  TransactionType: TransactionType;
  Description: string;
  TransactionDate: string;
  CreatedAt: string;
}

export interface CreditCardTransaction {
  ID: string;
  CardID: string;
  CategoryID: string;
  InvoiceID: string;
  Amount: string;
  Description: string;
  Installments: number;
  CurrentInstallments: number;
  InstallmentsValue: string | null;
  TransactionDate: string;
  CreatedAt: string;
}

export interface Invoice {
  ID: string;
  CardID: string;
  ReferenceDate: string;
  DueDate: string;
  TotalAmount: string;
  Status: InvoiceStatus;
  PaidAt: string | null;
}

export interface PlannedIncome {
  ID: string;
  AccountID: string;
  UserID: string;
  CategoryID: string;
  Amount: string;
  DueDay: number;
  StartDate: string | null;
  EndDate: string | null;
  Frequency: Recurrence;
  Description: string;
  IsActive: boolean;
  CreatedAt: string;
}

export interface PlannedExpense {
  ID: string;
  AccountID: string;
  UserID: string;
  CategoryID: string;
  Amount: string;
  DueDay: number;
  StartDate: string | null;
  EndDate: string | null;
  Frequency: Recurrence;
  Description: string;
  IsActive: boolean;
  CreatedAt: string;
}

export interface CategorizedTransaction {
  original_description: string;
  cleaned_description: string;
  amount: number;
  transaction_date: string;
  transaction_type: TransactionType;
  category_id: string | null;
  suggested_category_name: string | null;
  suggested_category_type: CategoryType | null;
  confidence: number;
  installments?: number | null;
  current_installment?: number | null;
}

export interface SuggestedCategory {
  name: string;
  category_type: CategoryType;
}

export interface ImportPreviewResponse {
  import_type: ImportType;
  target_id: string;
  transactions: CategorizedTransaction[] | null;
  new_categories_suggested: SuggestedCategory[] | null;
  summary: string;
  total_transactions: number;
  total_amount: number;
}

export interface ImportResult {
  created: number;
  duplicates_skipped: number;
  categories_created: number;
  errors: string[] | null;
}
