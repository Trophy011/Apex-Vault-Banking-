export type UserRole = "customer" | "admin";
export type AccountStatus = "active" | "locked";
export type TransactionType = "internal_transfer" | "international_wire" | "admin_funding" | "reversal";
export type TransactionStatus = "completed" | "reversed" | "pending";

export interface BankUser {
  uid: string;
  email: string;
  displayName: string;
  accountNumber: string;
  routingNumber: string;
  balance: number;
  savingsBalance: number;
  status: AccountStatus;
  transfersRestricted: boolean;
  warningMessage?: string;
  transactionPin?: string; // 4-digit PIN
  phoneNumber?: string;
  address?: string;
  occupation?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface BankTransaction {
  id: string;
  senderId: string;
  senderName: string;
  senderAccountNumber: string;
  senderRoutingNumber?: string;
  senderBank?: string;
  senderEmail?: string;
  recipientId: string;
  recipientName: string;
  recipientAccountNumber: string;
  recipientRoutingNumber?: string;
  recipientBank?: string;
  recipientCountry?: string;
  recipientEmail?: string;
  swiftCode?: string;
  amount: number;
  currency: string;
  exchangeRate?: number;
  foreignAmount?: number;
  foreignCurrency?: string;
  fee?: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  reference: string;
  createdAt: string;
  reversedAt?: string;
  reversedBy?: string;
  reversalReason?: string;
}

export interface BankReserve {
  vaultBalance: number; // $10,000,000,000.00
  totalFunded: number;
  totalReversed: number;
  lastUpdated: string;
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: string;
  size: number; // in bytes
  dataUrl: string; // Base64 data URL
  isImage: boolean;
}

export interface SupportMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderRole: "customer" | "admin" | "system";
  senderName: string;
  content: string;
  attachments?: ChatAttachment[];
  createdAt: string;
}

export interface SupportChat {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  status: "open" | "resolved";
  lastMessage: string;
  updatedAt: string;
}

export interface AICommandResponse {
  success: boolean;
  message: string;
  thoughtProcess?: string;
  proposedAction?: {
    actionType: "fund_customer" | "lock_account" | "unlock_account" | "restrict_transfers" | "unrestrict_transfers" | "warning_message" | "reverse_transaction" | "system_audit";
    targetIdentifier?: string; // email, account number, or transaction id
    amount?: number;
    message?: string;
    details?: string;
  };
}
