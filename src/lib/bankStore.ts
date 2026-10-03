import { BankUser, BankTransaction, BankReserve, SupportChat, SupportMessage, ChatAttachment } from './types.ts';
import { db, auth, ensureFirebaseAuth } from './firebase.ts';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';

const LOCAL_STORAGE_KEY_USERS = 'apex_bank_users_v3';
const LOCAL_STORAGE_KEY_TXS = 'apex_bank_txs_v3';
const LOCAL_STORAGE_KEY_RESERVE = 'apex_bank_reserve_v3';
const LOCAL_STORAGE_KEY_CHATS = 'apex_bank_chats_v3';
const LOCAL_STORAGE_KEY_MESSAGES = 'apex_bank_messages_v3';

export const ADMIN_EMAIL = 'managementofficails001@gmail.com';
export const ADMIN_PASSWORD = 'smart446688';
export const INITIAL_VAULT_BALANCE = 10000000000.00; // 10 Billion USD

// Strip undefined fields to prevent Firestore serialization errors
export function cleanFirestoreData<T>(data: T): any {
  if (data === null || data === undefined) return null;
  if (Array.isArray(data)) {
    return data.map(cleanFirestoreData).filter(item => item !== undefined);
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const res: Record<string, any> = {};
    for (const [key, val] of Object.entries(data as Record<string, any>)) {
      if (val !== undefined) {
        res[key] = cleanFirestoreData(val);
      }
    }
    return res;
  }
  return data;
}

// Default mock admin account
const defaultAdminUser: BankUser = {
  uid: 'admin-apex-operator-001',
  email: ADMIN_EMAIL,
  displayName: 'Apex Central Bank Operator',
  accountNumber: 'APEX-0000000001',
  routingNumber: '021000089',
  balance: INITIAL_VAULT_BALANCE,
  savingsBalance: 0,
  status: 'active',
  transfersRestricted: false,
  role: 'admin',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
};

// Seed demo customer for verified Elon Musk account
const seedCustomer: BankUser = {
  uid: 'cust-demo-el0n',
  email: 'realofficailel0nmusk@gmail.com',
  displayName: 'Elon Musk (Verified Client)',
  accountNumber: 'APEX-8849201948',
  routingNumber: '021000089',
  balance: 0.00, // Explicit requirement: new users start with 0 balance
  savingsBalance: 0.00,
  status: 'active',
  transfersRestricted: false,
  warningMessage: '',
  transactionPin: '1234',
  phoneNumber: '+1 (555) 234-8921',
  address: '3500 Deer Creek Rd, Palo Alto, CA 94304',
  occupation: 'Chief Executive & Technology Investor',
  role: 'customer',
  createdAt: '2026-01-15T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
};

class BankStore {
  private users: Map<string, BankUser> = new Map();
  private transactions: BankTransaction[] = [];
  private reserve: BankReserve = {
    vaultBalance: INITIAL_VAULT_BALANCE,
    totalFunded: 0,
    totalReversed: 0,
    lastUpdated: new Date().toISOString(),
  };
  private chats: Map<string, SupportChat> = new Map();
  private messages: SupportMessage[] = [];
  private listeners: Set<() => void> = new Set();
  private isFirestoreInitialized = false;

  constructor() {
    this.loadLocalCache();
    this.initFirestoreSync().catch(() => {});
  }

  // --- Local Cache for instant 144fps boot ---
  private loadLocalCache() {
    try {
      const storedUsers = localStorage.getItem(LOCAL_STORAGE_KEY_USERS);
      if (storedUsers) {
        const parsed: BankUser[] = JSON.parse(storedUsers);
        parsed.forEach(u => this.users.set(u.uid, u));
      } else {
        this.users.set(defaultAdminUser.uid, defaultAdminUser);
        this.users.set(seedCustomer.uid, seedCustomer);
        this.saveUsersLocal();
      }

      // Ensure admin user always exists locally
      if (!Array.from(this.users.values()).some(u => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase())) {
        this.users.set(defaultAdminUser.uid, defaultAdminUser);
      }

      const storedTxs = localStorage.getItem(LOCAL_STORAGE_KEY_TXS);
      if (storedTxs) {
        this.transactions = JSON.parse(storedTxs);
      }

      const storedReserve = localStorage.getItem(LOCAL_STORAGE_KEY_RESERVE);
      if (storedReserve) {
        this.reserve = JSON.parse(storedReserve);
      }

      const storedChats = localStorage.getItem(LOCAL_STORAGE_KEY_CHATS);
      if (storedChats) {
        const parsedChats: SupportChat[] = JSON.parse(storedChats);
        parsedChats.forEach(c => this.chats.set(c.id, c));
      }

      const storedMsgs = localStorage.getItem(LOCAL_STORAGE_KEY_MESSAGES);
      if (storedMsgs) {
        this.messages = JSON.parse(storedMsgs);
      }
    } catch {}
  }

  private saveUsersLocal() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(Array.from(this.users.values())));
    } catch {}
    this.notify();
  }

  private saveTxsLocal() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TXS, JSON.stringify(this.transactions));
    } catch {}
    this.notify();
  }

  private saveReserveLocal() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_RESERVE, JSON.stringify(this.reserve));
    } catch {}
    this.notify();
  }

  private saveChatsLocal() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, JSON.stringify(Array.from(this.chats.values())));
      localStorage.setItem(LOCAL_STORAGE_KEY_MESSAGES, JSON.stringify(this.messages));
    } catch {}
    this.notify();
  }

  // --- Real-time Firestore Cloud Synchronization ---
  private async initFirestoreSync() {
    if (this.isFirestoreInitialized) return;
    this.isFirestoreInitialized = true;

    try {
      // 1. Central Reserve Vault Listener
      const reserveRef = doc(db, 'bank_reserves', 'central');
      onSnapshot(reserveRef, snap => {
        if (snap.exists()) {
          const cloudData = snap.data() as BankReserve;
          this.reserve = cloudData;
          this.saveReserveLocal();
        } else {
          // Initialize in Firestore if first boot
          setDoc(reserveRef, this.reserve).catch(() => {});
        }
      }, () => {});

      // 2. Users Collection Listener (Live sync across all devices)
      const usersCol = collection(db, 'users');
      onSnapshot(usersCol, snap => {
        if (!snap.empty) {
          snap.docChanges().forEach(change => {
            const userData = change.doc.data() as BankUser;
            if (change.type === 'removed') {
              this.users.delete(userData.uid);
            } else {
              this.users.set(userData.uid, userData);
            }
          });
          this.saveUsersLocal();
        } else {
          // Seed initial baseline to Firestore
          setDoc(doc(db, 'users', defaultAdminUser.uid), defaultAdminUser).catch(() => {});
          setDoc(doc(db, 'users', seedCustomer.uid), seedCustomer).catch(() => {});
        }
      }, () => {});

      // 3. Transactions Collection Listener
      const txsCol = collection(db, 'transactions');
      onSnapshot(txsCol, snap => {
        if (!snap.empty) {
          const list: BankTransaction[] = [];
          snap.forEach(docSnap => {
            list.push(docSnap.data() as BankTransaction);
          });
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          this.transactions = list;
          this.saveTxsLocal();
        }
      }, () => {});

      // 4. Support Chats Collection Listener
      const chatsCol = collection(db, 'support_chats');
      onSnapshot(chatsCol, snap => {
        if (!snap.empty) {
          snap.forEach(docSnap => {
            const chatData = docSnap.data() as SupportChat;
            this.chats.set(chatData.id, chatData);
          });
          this.saveChatsLocal();
        }
      }, () => {});

      // 5. Support Messages Collection Listener
      const msgsCol = collection(db, 'support_messages');
      onSnapshot(msgsCol, snap => {
        if (!snap.empty) {
          const msgMap = new Map<string, SupportMessage>();
          this.messages.forEach(m => msgMap.set(m.id, m));
          snap.forEach(docSnap => {
            const m = docSnap.data() as SupportMessage;
            msgMap.set(m.id, m);
          });
          this.messages = Array.from(msgMap.values()).sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          this.saveChatsLocal();
        }
      }, () => {});

    } catch {}
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- Users Operations (Synchronized to Cloud) ---
  public getUsers(): BankUser[] {
    return Array.from(this.users.values());
  }

  public getUser(uid: string): BankUser | undefined {
    return this.users.get(uid);
  }

  public getUserByEmail(email: string): BankUser | undefined {
    const clean = email.trim().toLowerCase();
    return Array.from(this.users.values()).find(u => u.email.toLowerCase() === clean);
  }

  public async fetchUserByEmailAsync(email: string): Promise<BankUser | undefined> {
    const local = this.getUserByEmail(email);
    if (local) return local;

    try {
      await ensureFirebaseAuth();
      const clean = email.trim().toLowerCase();
      const q = query(collection(db, 'users'), where('email', '==', clean), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const u = snap.docs[0].data() as BankUser;
        this.users.set(u.uid, u);
        this.saveUsersLocal();
        return u;
      }
    } catch {}
    return undefined;
  }

  public getUserByAccountNumber(accountNumber: string): BankUser | undefined {
    const clean = accountNumber.trim().toUpperCase();
    return Array.from(this.users.values()).find(u => u.accountNumber.toUpperCase() === clean);
  }

  public async fetchUserByAccountNumberAsync(accountNumber: string): Promise<BankUser | undefined> {
    const local = this.getUserByAccountNumber(accountNumber);
    if (local) return local;

    try {
      await ensureFirebaseAuth();
      const clean = accountNumber.trim().toUpperCase();
      const q = query(collection(db, 'users'), where('accountNumber', '==', clean), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const u = snap.docs[0].data() as BankUser;
        this.users.set(u.uid, u);
        this.saveUsersLocal();
        return u;
      }
    } catch {}
    return undefined;
  }

  public registerUser(email: string, displayName: string, uid?: string): BankUser {
    const cleanEmail = email.trim().toLowerCase();
    const existing = this.getUserByEmail(cleanEmail);
    if (existing) return existing;

    const newUid = uid || `cust_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const randomAccNum = 'APEX-' + Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const newUser: BankUser = {
      uid: newUid,
      email: cleanEmail,
      displayName: displayName || cleanEmail.split('@')[0],
      accountNumber: randomAccNum,
      routingNumber: '021000089',
      balance: 0.00, // Explicit requirement: new users has 0 balance
      savingsBalance: 0.00,
      status: 'active',
      transfersRestricted: false,
      warningMessage: '',
      transactionPin: '0000',
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.set(newUid, newUser);
    this.saveUsersLocal();

    // Persist to Cloud Firestore immediately for multi-device login
    setDoc(doc(db, 'users', newUid), newUser).catch(() => {});

    return newUser;
  }

  public updateUserProfile(uid: string, updates: Partial<BankUser>): BankUser {
    const user = this.users.get(uid);
    if (!user) throw new Error('User not found');

    const updated: BankUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(uid, updated);
    this.saveUsersLocal();

    // Sync to Cloud Firestore
    updateDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: updated.updatedAt,
    }).catch(() => {
      setDoc(doc(db, 'users', uid), updated, { merge: true }).catch(() => {});
    });

    return updated;
  }

  public setTransactionPin(uid: string, pin: string): void {
    if (!/^\d{4}$/.test(pin)) {
      throw new Error('Transaction PIN must be exactly 4 digits');
    }
    this.updateUserProfile(uid, { transactionPin: pin });
  }

  // --- Administrative Controls (Synchronized to Cloud) ---
  public adminFundCustomer(customerUid: string, amount: number, memo?: string): BankTransaction {
    if (amount <= 0) throw new Error('Funding amount must be greater than $0.00');
    const customer = this.users.get(customerUid);
    if (!customer) throw new Error('Customer account not found');

    // Credit customer
    customer.balance += amount;
    customer.updatedAt = new Date().toISOString();
    this.users.set(customerUid, customer);
    this.saveUsersLocal();

    // Deduct from central vault
    this.reserve.vaultBalance = Math.max(0, this.reserve.vaultBalance - amount);
    this.reserve.totalFunded += amount;
    this.reserve.lastUpdated = new Date().toISOString();
    this.saveReserveLocal();

    // Record Transaction
    const tx: BankTransaction = {
      id: `TX-FND-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      senderId: 'CENTRAL_VAULT',
      senderName: 'Apex Central Treasury Reserve',
      senderAccountNumber: 'APEX-0000000001',
      senderRoutingNumber: '021000089',
      senderBank: 'Apex Central Reserve (Federal Reserve Node #021000089)',
      senderEmail: ADMIN_EMAIL,
      recipientId: customer.uid,
      recipientName: customer.displayName,
      recipientAccountNumber: customer.accountNumber,
      recipientRoutingNumber: customer.routingNumber,
      recipientBank: 'Apex Online Banking',
      recipientCountry: 'United States',
      recipientEmail: customer.email,
      amount,
      currency: 'USD',
      fee: 0.0,
      type: 'admin_funding',
      status: 'completed',
      description: memo || 'Central Management Capital Liquidity Credit',
      reference: `APX-LIQ-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date().toISOString(),
    };

    this.transactions.unshift(tx);
    this.saveTxsLocal();

    // Sync to Cloud Firestore (Atomic across devices)
    setDoc(doc(db, 'users', customerUid), cleanFirestoreData(customer), { merge: true }).catch(() => {});
    setDoc(doc(db, 'bank_reserves', 'central'), cleanFirestoreData(this.reserve), { merge: true }).catch(() => {});
    setDoc(doc(db, 'transactions', tx.id), cleanFirestoreData(tx)).catch(() => {});

    return tx;
  }

  // --- Customer Mobile Deposit & Treasury Funding ---
  public depositCustomerCheck(customerUid: string, amount: number, memo?: string): BankTransaction {
    if (amount <= 0) throw new Error('Deposit amount must be greater than $0.00');
    if (amount > 50000) throw new Error('Single mobile deposit limit is $50,000.00 per transaction');
    const customer = this.users.get(customerUid);
    if (!customer) throw new Error('Customer account not found');
    if (customer.status === 'locked') throw new Error('Account is suspended. Contact Concierge.');

    // Credit customer balance
    customer.balance += amount;
    customer.updatedAt = new Date().toISOString();
    this.users.set(customerUid, customer);
    this.saveUsersLocal();

    // Record Transaction
    const tx: BankTransaction = {
      id: `TX-DEP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      senderId: 'CHECK_CLEARING',
      senderName: 'U.S. Check Clearing / Mobile Capture',
      senderAccountNumber: 'CHK-9920192831',
      senderRoutingNumber: '021000089',
      senderBank: 'Federal Reserve Automated Clearing House',
      recipientId: customer.uid,
      recipientName: customer.displayName,
      recipientAccountNumber: customer.accountNumber,
      recipientRoutingNumber: customer.routingNumber,
      recipientBank: 'Apex Online Banking',
      recipientCountry: 'United States',
      recipientEmail: customer.email,
      amount,
      currency: 'USD',
      fee: 0.0,
      type: 'internal_transfer',
      status: 'completed',
      description: memo || 'Mobile Remote Check Deposit',
      reference: `CHK-DEP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date().toISOString(),
    };

    this.transactions.unshift(tx);
    this.saveTxsLocal();

    // Sync to Cloud Firestore
    setDoc(doc(db, 'users', customerUid), cleanFirestoreData(customer), { merge: true }).catch(() => {});
    setDoc(doc(db, 'transactions', tx.id), cleanFirestoreData(tx)).catch(() => {});

    return tx;
  }

  public adminLockAccount(uid: string, lock: boolean): void {
    const user = this.users.get(uid);
    if (!user) throw new Error('User not found');
    user.status = lock ? 'locked' : 'active';
    user.updatedAt = new Date().toISOString();
    this.users.set(uid, user);
    this.saveUsersLocal();

    // Sync to Firestore
    setDoc(doc(db, 'users', uid), { status: user.status, updatedAt: user.updatedAt }, { merge: true }).catch(() => {});
  }

  public adminRestrictTransfers(uid: string, restrict: boolean): void {
    const user = this.users.get(uid);
    if (!user) throw new Error('User not found');
    user.transfersRestricted = restrict;
    user.updatedAt = new Date().toISOString();
    this.users.set(uid, user);
    this.saveUsersLocal();

    // Sync to Firestore
    setDoc(doc(db, 'users', uid), { transfersRestricted: restrict, updatedAt: user.updatedAt }, { merge: true }).catch(() => {});
  }

  public adminToggleRestrictTransfers(uid: string, restrict: boolean): void {
    this.adminRestrictTransfers(uid, restrict);
  }

  public adminSetWarningMessage(uid: string, warning: string): void {
    const user = this.users.get(uid);
    if (!user) throw new Error('User not found');
    user.warningMessage = warning.trim();
    user.updatedAt = new Date().toISOString();
    this.users.set(uid, user);
    this.saveUsersLocal();

    // Sync to Firestore
    setDoc(doc(db, 'users', uid), { warningMessage: user.warningMessage, updatedAt: user.updatedAt }, { merge: true }).catch(() => {});
  }

  public adminReverseTransaction(transactionId: string, adminEmail: string, reason?: string): BankTransaction {
    const tx = this.transactions.find(t => t.id === transactionId);
    if (!tx) throw new Error('Transaction record not found');
    if (tx.status === 'reversed') throw new Error('Transaction has already been reversed');

    // Process balance reversal based on transaction type
    if (tx.type === 'internal_transfer') {
      const sender = this.users.get(tx.senderId);
      const recipient = this.users.get(tx.recipientId);

      if (recipient) {
        recipient.balance = Math.max(0, recipient.balance - tx.amount);
        recipient.updatedAt = new Date().toISOString();
        this.users.set(recipient.uid, recipient);
        setDoc(doc(db, 'users', recipient.uid), recipient, { merge: true }).catch(() => {});
      }
      if (sender) {
        sender.balance += tx.amount;
        sender.updatedAt = new Date().toISOString();
        this.users.set(sender.uid, sender);
        setDoc(doc(db, 'users', sender.uid), sender, { merge: true }).catch(() => {});
      }
      this.saveUsersLocal();
    } else if (tx.type === 'international_wire') {
      const sender = this.users.get(tx.senderId);
      if (sender) {
        sender.balance += tx.amount;
        sender.updatedAt = new Date().toISOString();
        this.users.set(sender.uid, sender);
        setDoc(doc(db, 'users', sender.uid), sender, { merge: true }).catch(() => {});
        this.saveUsersLocal();
      }
    } else if (tx.type === 'admin_funding') {
      const customer = this.users.get(tx.recipientId);
      if (customer) {
        customer.balance = Math.max(0, customer.balance - tx.amount);
        customer.updatedAt = new Date().toISOString();
        this.users.set(customer.uid, customer);
        setDoc(doc(db, 'users', customer.uid), customer, { merge: true }).catch(() => {});
        this.saveUsersLocal();
      }
      this.reserve.vaultBalance += tx.amount;
      this.reserve.totalReversed += tx.amount;
      this.reserve.lastUpdated = new Date().toISOString();
      this.saveReserveLocal();
      setDoc(doc(db, 'bank_reserves', 'central'), this.reserve, { merge: true }).catch(() => {});
    }

    tx.status = 'reversed';
    tx.reversedAt = new Date().toISOString();
    tx.reversedBy = adminEmail;
    tx.reversalReason = reason || 'Reversed by Apex Bank Management Compliance Operator';
    this.saveTxsLocal();

    // Sync reversed transaction to Cloud Firestore
    setDoc(doc(db, 'transactions', tx.id), cleanFirestoreData(tx), { merge: true }).catch(() => {});

    return tx;
  }

  // --- Customer Transfers (Synchronized to Cloud) ---
  public sendInternalTransfer(
    senderUid: string,
    recipientIdentifier: string, // account number or email
    amount: number,
    description: string,
    pin: string
  ): BankTransaction {
    const sender = this.users.get(senderUid);
    if (!sender) throw new Error('Sender account not found');
    if (sender.status === 'locked') throw new Error('Your account is currently locked by bank management. Please contact support.');
    if (sender.transfersRestricted) throw new Error('Transfers on your account have been restricted by bank compliance.');
    if (sender.transactionPin && sender.transactionPin !== pin) throw new Error('Invalid 4-digit transaction PIN');
    if (amount <= 0) throw new Error('Transfer amount must be greater than $0.00');
    if (sender.balance < amount) throw new Error(`Insufficient funds. Your available balance is $${sender.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);

    const recipient = this.getUserByAccountNumber(recipientIdentifier) || this.getUserByEmail(recipientIdentifier);
    if (!recipient) throw new Error(`Recipient "${recipientIdentifier}" not found within Apex Online Banking`);
    if (recipient.uid === sender.uid) throw new Error('Cannot transfer funds to the same account');

    // Deduct sender, credit recipient
    sender.balance -= amount;
    recipient.balance += amount;
    sender.updatedAt = new Date().toISOString();
    recipient.updatedAt = new Date().toISOString();

    this.users.set(sender.uid, sender);
    this.users.set(recipient.uid, recipient);
    this.saveUsersLocal();

    const tx: BankTransaction = {
      id: `TX-INT-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      senderId: sender.uid,
      senderName: sender.displayName,
      senderAccountNumber: sender.accountNumber,
      senderRoutingNumber: sender.routingNumber,
      senderBank: 'Apex Online Banking',
      senderEmail: sender.email,
      recipientId: recipient.uid,
      recipientName: recipient.displayName,
      recipientAccountNumber: recipient.accountNumber,
      recipientRoutingNumber: recipient.routingNumber,
      recipientBank: 'Apex Online Banking',
      recipientCountry: 'United States',
      recipientEmail: recipient.email,
      amount,
      currency: 'USD',
      fee: 0.0,
      type: 'internal_transfer',
      status: 'completed',
      description: description || 'Instant Apex Internal Transfer',
      reference: `APX-INT-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date().toISOString(),
    };

    this.transactions.unshift(tx);
    this.saveTxsLocal();

    // Write all mutations to Firestore for multi-device sync
    setDoc(doc(db, 'users', sender.uid), cleanFirestoreData(sender), { merge: true }).catch(() => {});
    setDoc(doc(db, 'users', recipient.uid), cleanFirestoreData(recipient), { merge: true }).catch(() => {});
    setDoc(doc(db, 'transactions', tx.id), cleanFirestoreData(tx)).catch(() => {});

    return tx;
  }

  public sendInternationalWire(
    senderUid: string,
    country: string,
    bankName: string,
    swiftCode: string,
    recipientName: string,
    recipientAccountNumber: string,
    amount: number,
    description: string,
    pin: string,
    exchangeRate?: number,
    foreignCurrency?: string
  ): BankTransaction {
    const sender = this.users.get(senderUid);
    if (!sender) throw new Error('Sender account not found');
    if (sender.status === 'locked') throw new Error('Your account is currently locked by bank management. Please contact support.');
    if (sender.transfersRestricted) throw new Error('Transfers on your account have been restricted by bank compliance.');
    if (sender.transactionPin && sender.transactionPin !== pin) throw new Error('Invalid 4-digit transaction PIN');
    if (amount <= 0) throw new Error('Wire amount must be greater than $0.00');
    if (sender.balance < amount) throw new Error(`Insufficient funds. Your available balance is $${sender.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);

    sender.balance -= amount;
    sender.updatedAt = new Date().toISOString();
    this.users.set(sender.uid, sender);
    this.saveUsersLocal();

    const rate = exchangeRate || 1.0;
    const fAmt = parseFloat((amount * rate).toFixed(2));

    const tx: BankTransaction = {
      id: `TX-WIR-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      senderId: sender.uid,
      senderName: sender.displayName,
      senderAccountNumber: sender.accountNumber,
      senderRoutingNumber: sender.routingNumber,
      senderBank: 'Apex Online Banking (Federal Reserve Node #021000089)',
      senderEmail: sender.email,
      recipientId: `EXT_${swiftCode}_${recipientAccountNumber}`,
      recipientName,
      recipientAccountNumber,
      recipientBank: bankName,
      recipientCountry: country,
      swiftCode,
      amount,
      currency: 'USD',
      exchangeRate: rate,
      foreignAmount: fAmt,
      foreignCurrency: foreignCurrency || 'USD',
      fee: 0.0,
      type: 'international_wire',
      status: 'completed',
      description: description || `SWIFT Wire Transfer to ${bankName} (${country})`,
      reference: `SWIFT-${swiftCode.slice(0, 4)}-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date().toISOString(),
    };

    this.transactions.unshift(tx);
    this.saveTxsLocal();

    // Write to Cloud Firestore
    setDoc(doc(db, 'users', sender.uid), cleanFirestoreData(sender), { merge: true }).catch(() => {});
    setDoc(doc(db, 'transactions', tx.id), cleanFirestoreData(tx)).catch(() => {});

    return tx;
  }

  // --- Transactions Query ---
  public getTransactions(userUid?: string): BankTransaction[] {
    if (!userUid) return this.transactions;
    return this.transactions.filter(t => t.senderId === userUid || t.recipientId === userUid);
  }

  public getReserve(): BankReserve {
    return this.reserve;
  }

  // --- Live Support Chat (Synchronized to Cloud) ---
  public getOrCreateChat(customerId: string, customerEmail: string, customerName: string): SupportChat {
    const cleanEmail = customerEmail ? customerEmail.trim().toLowerCase() : '';
    let chat = Array.from(this.chats.values()).find(
      c => c.customerId === customerId || (cleanEmail && c.customerEmail.toLowerCase() === cleanEmail)
    );
    if (!chat) {
      chat = {
        id: `chat_${customerId}`,
        customerId,
        customerEmail: customerEmail || 'visitor@apexbank.com',
        customerName: customerName || 'Valued Client',
        status: 'open',
        lastMessage: 'Chat session started with Apex Client Concierge',
        updatedAt: new Date().toISOString(),
      };
      this.chats.set(chat.id, chat);

      // Auto-welcome from bank desk
      const welcomeMsg: SupportMessage = {
        id: `msg_welcome_${Date.now()}`,
        chatId: chat.id,
        senderId: 'apex-support-desk',
        senderRole: 'admin',
        senderName: 'Apex Premier Support Desk',
        content: `Hello ${customerName || 'Valued Client'}. Welcome to Apex 24/7 Priority Banking Support. An operator on the management desk is connected to assist you.`,
        createdAt: new Date().toISOString(),
      };
      this.messages.push(welcomeMsg);
      this.saveChatsLocal();

      // Sync chat & welcome message to Firestore (sanitized)
      setDoc(doc(db, 'support_chats', chat.id), cleanFirestoreData(chat)).catch(err => {
        console.error('Error syncing support_chats to Firestore:', err);
      });
      setDoc(doc(db, 'support_messages', welcomeMsg.id), cleanFirestoreData(welcomeMsg)).catch(err => {
        console.error('Error syncing welcome message to Firestore:', err);
      });
    } else {
      let needsSave = false;
      if (customerName && customerName !== 'Guest Visitor' && chat.customerName !== customerName) {
        chat.customerName = customerName;
        needsSave = true;
      }
      if (cleanEmail && cleanEmail !== 'visitor@apexbank.com' && chat.customerEmail !== cleanEmail) {
        chat.customerEmail = cleanEmail;
        needsSave = true;
      }
      if (needsSave) {
        this.saveChatsLocal();
        setDoc(doc(db, 'support_chats', chat.id), cleanFirestoreData(chat), { merge: true }).catch(() => {});
      }
    }
    return chat;
  }

  public getAllChats(): SupportChat[] {
    return Array.from(this.chats.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public getMessages(chatId: string): SupportMessage[] {
    return this.messages
      .filter(m => m.chatId === chatId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public sendMessage(
    chatId: string,
    senderId: string,
    senderRole: 'customer' | 'admin',
    senderName: string,
    content: string,
    attachments?: ChatAttachment[]
  ): SupportMessage {
    const chat = this.chats.get(chatId);
    if (!chat) throw new Error('Chat session not found');

    const msg: SupportMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      chatId,
      senderId,
      senderRole,
      senderName,
      content: content.trim(),
      attachments: attachments && attachments.length > 0 ? attachments : undefined,
      createdAt: new Date().toISOString(),
    };

    this.messages.push(msg);

    let summary = content.trim();
    if (!summary && attachments && attachments.length > 0) {
      summary = `📎 ${attachments[0].isImage ? 'Picture' : 'Document'}: ${attachments[0].name}`;
      if (attachments.length > 1) {
        summary += ` (+${attachments.length - 1} more)`;
      }
    }

    chat.lastMessage = summary || 'Attachment sent';
    chat.updatedAt = new Date().toISOString();
    this.chats.set(chatId, chat);
    this.saveChatsLocal();

    // Sync message & chat update to Firestore with sanitized payload (CRITICAL: removes undefined)
    const cleanMsg = cleanFirestoreData(msg);
    const cleanChat = cleanFirestoreData(chat);
    setDoc(doc(db, 'support_messages', msg.id), cleanMsg).catch(err => {
      console.error('Failed to sync support message to Firestore:', err);
    });
    setDoc(doc(db, 'support_chats', chatId), cleanChat, { merge: true }).catch(err => {
      console.error('Failed to sync support chat to Firestore:', err);
    });

    return msg;
  }
}

export const bankStore = new BankStore();
