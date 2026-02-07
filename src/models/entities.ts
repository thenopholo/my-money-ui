import type {
  AccountType,
  CategoryType,
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
