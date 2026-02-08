import type { AccountType, CategoryType, ImportType, Recurrence, TransactionType } from "./enums.ts";

// --- Error ---

export interface ApiError {
  error: string;
}

// --- Auth ---

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}

// --- Password ---

export interface UpdatePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface UpdatePasswordResponse {
  message: string;
}

// --- Bank Accounts ---

export interface CreateAccountRequest {
  account_type: AccountType;
  name: string;
  bank_name: string;
  balance: string;
}

export interface UpdateAccountRequest {
  name: string;
  bank_name: string;
  balance: string;
  is_active: boolean;
}

// --- Categories ---

export interface CreateCategoryRequest {
  name: string;
  category_type: CategoryType;
  color?: string | null;
  icon?: string | null;
}

export interface UpdateCategoryRequest {
  name: string;
  category_type: CategoryType;
  color?: string | null;
  icon?: string | null;
}

// --- Credit Cards ---

export interface CreateCreditCardRequest {
  name: string;
  credit_limit: string;
  close_day: number;
  due_day: number;
}

export interface UpdateCreditCardRequest {
  name: string;
  credit_limit: string;
  close_day: number;
  due_day: number;
  is_active: boolean;
}

// --- Transactions ---

export interface CreateTransactionRequest {
  account_id: string;
  category_id: string;
  amount: string;
  transaction_type: TransactionType;
  description: string;
  transaction_date: string;
}

export interface UpdateTransactionRequest {
  amount: string;
  description: string;
  transaction_date: string;
}

export interface CreatePlannedTransactionRequest {
  transaction_date: string;
}

export interface PayInvoiceRequest {
  invoice_id: string;
  account_id: string;
  category_id: string;
  payment_date: string;
  description: string;
}

// --- Credit Card Transactions ---

export interface CreateCreditCardTransactionRequest {
  category_id: string;
  amount: string;
  description: string;
  installments: number;
  transaction_date: string;
}

export interface UpdateCreditCardTransactionRequest {
  amount: string;
  description: string;
  installments: number;
  transaction_date: string;
}

export interface AssignInvoiceRequest {
  invoice_id: string;
}

export interface AssignInvoiceResponse {
  message: string;
}

// --- Invoices ---

export interface CloseMonthRequest {
  reference_date: string;
}

// --- Planned Incomes ---

export interface CreatePlannedIncomeRequest {
  account_id: string;
  category_id: string;
  amount: string;
  due_day: number;
  start_date: string | null;
  end_date: string | null;
  description: string;
  frequency: Recurrence;
  is_active: boolean;
}

export interface UpdatePlannedIncomeRequest {
  amount: string;
  due_day: number;
  start_date: string | null;
  end_date: string | null;
  description: string;
  frequency: Recurrence;
  is_active: boolean;
}

// --- Planned Expenses ---

export interface CreatePlannedExpenseRequest {
  account_id: string;
  category_id: string;
  amount: string;
  due_day: number;
  start_date: string | null;
  end_date: string | null;
  description: string;
  frequency: Recurrence;
  is_active: boolean;
}

export interface UpdatePlannedExpenseRequest {
  amount: string;
  due_day: number;
  start_date: string | null;
  end_date: string | null;
  description: string;
  frequency: Recurrence;
  is_active: boolean;
}

// --- Import CSV ---

export interface ImportConfirmRequest {
  import_type: ImportType;
  target_id: string;
  transactions: ImportConfirmTransaction[];
}

export interface ImportConfirmTransaction {
  description: string;
  amount: number;
  transaction_date: string;
  transaction_type: TransactionType;
  category_id: string | null;
  new_category_name: string | null;
  new_category_type: CategoryType | null;
  installments?: number | null;
  current_installment?: number | null;
}
