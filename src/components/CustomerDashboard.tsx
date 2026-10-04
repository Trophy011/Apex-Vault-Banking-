import React, { useState, useEffect } from 'react';
import {
  BankUser,
  BankTransaction
} from '../lib/types.ts';
import { bankStore } from '../lib/bankStore.ts';
import { ReceiptModal } from './ReceiptModal.tsx';
import { DepositModal } from './DepositModal.tsx';
import { InternationalWireModal } from './InternationalWireModal.tsx';
import { navHistory } from '../lib/navHistory.ts';
import {
  Bell,
  Share2,
  LogOut,
  MessageSquare,
  ChevronRight,
  Gauge,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeft,
  Globe2,
  Zap,
  KeyRound,
  User,
  Copy,
  Check,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  FileText,
  X,
  CreditCard,
  Wallet,
  Send,
  Compass,
  Menu as MenuIcon,
  ArrowRight,
  Landmark,
  Building,
  CheckCircle2,
  Search,
  Sparkles,
  QrCode,
  ShieldCheck,
  Lock,
  Unlock,
  PiggyBank,
  Eye,
  EyeOff,
  Wifi,
  Download,
  Smartphone,
  CheckCheck
} from 'lucide-react';

interface CustomerDashboardProps {
  currentUser: BankUser;
  onLogout: () => void;
  onOpenSupport: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  onLogout,
  onOpenSupport,
}) => {
  const [user, setUser] = useState<BankUser>(currentUser);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [activeBottomTab, setActiveBottomTab] = useState<'accounts' | 'deposit' | 'transfer' | 'explore' | 'menu'>('accounts');

  // Copied states
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedRouting, setCopiedRouting] = useState(false);

  // Modals state
  const [showInternalTransfer, setShowInternalTransfer] = useState(false);
  const [showInternationalWire, setShowInternationalWire] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showOpenAccountModal, setShowOpenAccountModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showFicoModal, setShowFicoModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState<'checking' | 'savings' | 'card' | null>(null);
  const [selectedTxReceipt, setSelectedTxReceipt] = useState<BankTransaction | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Platinum Card Generator & Management for Every User
  const [showCardSecurity, setShowCardSecurity] = useState(false);
  const [cardCopied, setCardCopied] = useState(false);
  const [cardSeed, setCardSeed] = useState(() => {
    return localStorage.getItem(`apex_card_seed_${user.uid}`) || 'prime';
  });

  const generateCardDigits = (seedVal: string) => {
    const raw = `${user.uid}_${user.accountNumber}_${seedVal}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash * 31 + raw.charCodeAt(i)) % 100000000;
    }
    const part2 = String(Math.abs(hash % 9000) + 1000);
    const part3 = String(Math.abs((hash * 7) % 9000) + 1000);
    return `4532 ${part2} ${part3} 0739`;
  };

  const cardNumber = generateCardDigits(cardSeed);

  const handleGenerateNewCard = () => {
    const newSeed = Math.random().toString(36).substring(2, 9);
    setCardSeed(newSeed);
    localStorage.setItem(`apex_card_seed_${user.uid}`, newSeed);
  };

  // Internal Transfer Form
  const [internalRecipient, setInternalRecipient] = useState('');
  const [internalAmount, setInternalAmount] = useState('');
  const [internalMemo, setInternalMemo] = useState('');
  const [internalPin, setInternalPin] = useState('');
  const [internalError, setInternalError] = useState<string | null>(null);
  const [internalSuccess, setInternalSuccess] = useState<string | null>(null);
  const [internalSuccessTx, setInternalSuccessTx] = useState<BankTransaction | null>(null);

  // Profile Edit Form
  const [profileName, setProfileName] = useState(user.displayName);
  const [profilePhone, setProfilePhone] = useState(user.phoneNumber || '');
  const [profileAddress, setProfileAddress] = useState(user.address || '');
  const [profileOccupation, setProfileOccupation] = useState(user.occupation || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // PIN Form
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccess, setPinSuccess] = useState(false);

  // Card Controls
  const [cardFrozen, setCardFrozen] = useState(false);

  // Sync state with BankStore
  const refreshData = () => {
    const updated = bankStore.getUser(user.uid);
    if (updated) setUser(updated);
    setTransactions(bankStore.getTransactions(user.uid));
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = bankStore.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, [user.uid]);

  // Browser Back/Forward & Navigation History Integration
  useEffect(() => {
    if (showAccountDetails) {
      navHistory.pushModal(`account_${showAccountDetails}`, () => setShowAccountDetails(null));
      return () => navHistory.closeModal(`account_${showAccountDetails}`);
    }
  }, [showAccountDetails]);

  useEffect(() => {
    if (showDepositModal) {
      navHistory.pushModal('deposit_modal', () => {
        setShowDepositModal(false);
        setActiveBottomTab('accounts');
      });
      return () => navHistory.closeModal('deposit_modal');
    }
  }, [showDepositModal]);

  useEffect(() => {
    if (showInternalTransfer) {
      navHistory.pushModal('internal_transfer', () => {
        setShowInternalTransfer(false);
        setActiveBottomTab('accounts');
      });
      return () => navHistory.closeModal('internal_transfer');
    }
  }, [showInternalTransfer]);

  useEffect(() => {
    if (showInternationalWire) {
      navHistory.pushModal('international_wire', () => setShowInternationalWire(false));
      return () => navHistory.closeModal('international_wire');
    }
  }, [showInternationalWire]);

  useEffect(() => {
    if (showNotifications) {
      navHistory.pushModal('notifications', () => setShowNotifications(false));
      return () => navHistory.closeModal('notifications');
    }
  }, [showNotifications]);

  useEffect(() => {
    if (showRewardsModal) {
      navHistory.pushModal('rewards', () => setShowRewardsModal(false));
      return () => navHistory.closeModal('rewards');
    }
  }, [showRewardsModal]);

  useEffect(() => {
    if (showFicoModal) {
      navHistory.pushModal('fico', () => setShowFicoModal(false));
      return () => navHistory.closeModal('fico');
    }
  }, [showFicoModal]);

  useEffect(() => {
    if (showOpenAccountModal) {
      navHistory.pushModal('open_account', () => {
        setShowOpenAccountModal(false);
        setActiveBottomTab('accounts');
      });
      return () => navHistory.closeModal('open_account');
    }
  }, [showOpenAccountModal]);

  useEffect(() => {
    if (showProfileEdit) {
      navHistory.pushModal('profile_edit', () => {
        setShowProfileEdit(false);
        setActiveBottomTab('accounts');
      });
      return () => navHistory.closeModal('profile_edit');
    }
  }, [showProfileEdit]);

  useEffect(() => {
    if (showPinSetup) {
      navHistory.pushModal('pin_setup', () => setShowPinSetup(false));
      return () => navHistory.closeModal('pin_setup');
    }
  }, [showPinSetup]);

  useEffect(() => {
    if (selectedTxReceipt) {
      navHistory.pushModal('receipt_modal', () => setSelectedTxReceipt(null));
      return () => navHistory.closeModal('receipt_modal');
    }
  }, [selectedTxReceipt]);

  useEffect(() => {
    if (showCardSecurity) {
      navHistory.pushModal('card_security', () => setShowCardSecurity(false));
      return () => navHistory.closeModal('card_security');
    }
  }, [showCardSecurity]);

  // Tab & Browser History Synchronization (Enables smooth back/forward without getting stuck)
  useEffect(() => {
    const handleTabChange = (tab: string) => {
      if (['accounts', 'deposit', 'transfer', 'explore', 'menu'].includes(tab)) {
        setActiveBottomTab(tab as any);
        if (tab === 'deposit') setShowDepositModal(true);
        else if (tab === 'transfer') setShowInternalTransfer(true);
        else if (tab === 'explore') setShowOpenAccountModal(true);
        else if (tab === 'menu') setShowProfileEdit(true);
        else if (tab === 'accounts') {
          setShowDepositModal(false);
          setShowInternalTransfer(false);
          setShowOpenAccountModal(false);
          setShowProfileEdit(false);
          setShowAccountDetails(null);
        }
      }
    };
    const unsub = navHistory.onTabChange(handleTabChange);
    return () => unsub();
  }, []);

  const copyToClipboard = (text: string, type: 'acc' | 'routing') => {
    navigator.clipboard.writeText(text);
    if (type === 'acc') {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    } else {
      setCopiedRouting(true);
      setTimeout(() => setCopiedRouting(false), 2000);
    }
  };

  // Submit Internal Transfer
  const handleInternalTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInternalError(null);
    setInternalSuccess(null);
    setInternalSuccessTx(null);

    const amt = parseFloat(internalAmount);
    if (isNaN(amt) || amt <= 0) {
      setInternalError('Please specify a valid transfer amount.');
      return;
    }

    try {
      const trimmedTarget = internalRecipient.trim();
      let recipient = bankStore.getUserByAccountNumber(trimmedTarget) || bankStore.getUserByEmail(trimmedTarget);
      if (!recipient) {
        recipient = (await bankStore.fetchUserByAccountNumberAsync(trimmedTarget)) || (await bankStore.fetchUserByEmailAsync(trimmedTarget));
      }

      const tx = bankStore.sendInternalTransfer(
        user.uid,
        trimmedTarget,
        amt,
        internalMemo,
        internalPin.trim()
      );
      setInternalSuccess(`Successfully transferred $${amt.toFixed(2)} to ${tx.recipientName}!`);
      setInternalSuccessTx(tx);
      setInternalAmount('');
      setInternalRecipient('');
      setInternalMemo('');
      setInternalPin('');
      refreshData();
    } catch (err: any) {
      setInternalError(err.message || 'Transfer failed.');
    }
  };

  // Save Profile
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = bankStore.updateUserProfile(user.uid, {
        displayName: profileName.trim(),
        phoneNumber: profilePhone.trim(),
        address: profileAddress.trim(),
        occupation: profileOccupation.trim(),
      });
      setUser(updated);
      setProfileSuccess(true);
      setTimeout(() => {
        setProfileSuccess(false);
        setShowProfileEdit(false);
      }, 1200);
    } catch {
      // ignore
    }
  };

  // Setup PIN
  const handlePinSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    if (!/^\d{4}$/.test(newPin)) {
      setPinError('Security PIN must consist of exactly 4 digits (0-9).');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('PIN confirmation does not match.');
      return;
    }

    try {
      bankStore.setTransactionPin(user.uid, newPin);
      const updated = bankStore.getUser(user.uid);
      if (updated) setUser(updated);
      setPinSuccess(true);
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => {
        setPinSuccess(false);
        setShowPinSetup(false);
      }, 1500);
    } catch (err: any) {
      setPinError(err.message || 'Failed to save transaction PIN.');
    }
  };

  // Time-based greeting matching picture style
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  };

  // User first name for large header in picture
  const firstName = user.displayName.split(' ')[0] || user.displayName;
  const last4 = user.accountNumber.slice(-4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6dde8] via-[#f0eaf2] to-[#f8f6f9] text-slate-900 pb-28 pt-4 px-4 sm:px-6 relative selection:bg-blue-600 selection:text-white">
      
      {/* Max Width Container for Centered App Experience */}
      <div className="max-w-md sm:max-w-xl mx-auto space-y-4 sm:space-y-5">

        {/* TOP STATUS & UTILITY BAR (Matches picture top right actions) */}
        <div className="flex items-center justify-between pt-1 pb-2">
          {/* Subtle Bank Brand Watermark */}
          <div className="flex items-center gap-1.5 text-slate-700/80">
            <div className="w-6 h-6 rounded-lg bg-blue-900 text-white flex items-center justify-center font-black text-xs shadow-xs">
              A
            </div>
            <span className="text-xs font-extrabold tracking-wider text-slate-800">APEX BANK</span>
          </div>

          {/* Action Icons matching picture */}
          <div className="flex items-center gap-3">
            {/* Notification Bell with red counter badge (1) */}
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 rounded-full hover:bg-black/5 text-slate-700 transition-colors cursor-pointer"
              title="Recent Account Activity & Notifications"
            >
              <Bell className="w-5 h-5 text-slate-800" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {transactions.length > 0 ? transactions.length : 1}
              </span>
            </button>

            {/* Share / Details */}
            <button
              onClick={() => copyToClipboard(`Apex Bank Routing: ${user.routingNumber} | Account: ${user.accountNumber}`, 'routing')}
              className="p-2 rounded-full hover:bg-black/5 text-slate-700 transition-colors cursor-pointer"
              title="Share Account Details"
            >
              <Share2 className="w-5 h-5 text-slate-800" />
            </button>

            {/* Sign off */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-rose-600 transition-colors cursor-pointer pl-1"
              title="Sign off"
            >
              <span>Sign off</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* GREETING HEADER (Matches exact typography and style from picture) */}
        <div className="pt-2 pb-1">
          <p className="text-3xl sm:text-4xl font-light text-slate-800 tracking-tight leading-tight">
            {getGreeting()}
          </p>
          <h1 className="text-3xl sm:text-4xl font-normal text-slate-950 tracking-tight -mt-0.5">
            {firstName}
          </h1>

          {/* Rewards Line with arrow (matches picture: "Wells Fargo Rewards® $1.00 cash rewards >") */}
          <button
            onClick={() => setShowRewardsModal(true)}
            className="mt-2.5 flex items-center gap-1.5 text-xs sm:text-sm font-normal text-slate-800 hover:text-blue-900 transition-colors cursor-pointer group"
          >
            <span>Apex Rewards® <strong className="font-semibold">$1.00</strong> cash rewards</span>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* COMPLIANCE / ACCOUNT SUSPENSION BANNER (If locked) */}
        {user.status === 'locked' && (
          <div className="p-4 bg-rose-600 text-white rounded-2xl shadow-lg flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-white shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm tracking-wide">ACCOUNT TEMPORARILY SUSPENDED</h4>
              <p className="text-xs text-rose-100 mt-0.5 leading-relaxed">
                Account operations have been paused by Bank Compliance. Please contact 24/7 Priority Concierge for identity verification.
              </p>
              <button
                onClick={onOpenSupport}
                className="mt-2 px-3 py-1.5 bg-white text-rose-700 font-bold text-xs rounded-xl shadow-xs"
              >
                Chat with Concierge Now
              </button>
            </div>
          </div>
        )}

        {/* WARNING MESSAGE FROM ADMIN (If present) */}
        {user.warningMessage && (
          <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl shadow-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">Compliance Advisory</p>
              <p className="text-xs text-amber-800 mt-0.5 font-medium">{user.warningMessage}</p>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STACKED ACCOUNT CARDS (MATCHES EXACT ARRANGEMENT FROM PICTURE) */}
        {/* ============================================================== */}

        {/* 1. EVERYDAY CHECKING CARD */}
        <div
          onClick={() => setShowAccountDetails('checking')}
          className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100/80 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-xs sm:text-sm uppercase tracking-wide text-slate-900">
                EVERYDAY CHECKING ...{last4}
              </p>
              <h2 className="text-3xl sm:text-4xl font-normal text-slate-950 mt-1 font-sans tracking-tight">
                ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Available balance</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* Quick Routing / Account numbers disclosure */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1 font-mono">
              <span>Routing: {user.routingNumber}</span>
              <span className="text-slate-300">•</span>
              <span>Account: {user.accountNumber}</span>
            </div>
            <span className="text-blue-700 font-semibold group-hover:underline">View activity</span>
          </div>
        </div>

        {/* 2. WAY2SAVE® SAVINGS CARD */}
        <div
          onClick={() => setShowAccountDetails('savings')}
          className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100/80 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-xs sm:text-sm uppercase tracking-wide text-slate-900">
                WAY2SAVE® SAVINGS ...9019
              </p>
              <h2 className="text-3xl sm:text-4xl font-normal text-slate-950 mt-1 font-sans tracking-tight">
                $0.00
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Available balance</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-emerald-700 font-semibold">Interest Rate: 4.85% APY Daily Compounded</span>
            <span className="text-blue-700 font-semibold group-hover:underline">Transfer to savings</span>
          </div>
        </div>

        {/* 3. PLATINUM CARD */}
        <div
          onClick={() => setShowAccountDetails('card')}
          className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100/80 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-xs sm:text-sm uppercase tracking-wide text-slate-900">
                PLATINUM CARD ...0739
              </p>
              <h2 className="text-3xl sm:text-4xl font-normal text-slate-950 mt-1 font-sans tracking-tight">
                $0.00
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Outstanding balance</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-slate-600">Available Credit: $25,000.00 of $25,000.00</span>
            <span className="text-blue-700 font-semibold group-hover:underline">Make payment</span>
          </div>
        </div>

        {/* 4. OPEN A NEW ACCOUNT CTA (Exact Pill Button from Picture) */}
        <div className="text-center py-2">
          <button
            onClick={() => setShowOpenAccountModal(true)}
            className="px-8 py-3 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-400 text-slate-900 font-bold text-sm rounded-full shadow-xs transition-all cursor-pointer active:scale-95"
          >
            Open a new account
          </button>
        </div>

        {/* 5. MONITOR FICO® SCORE CARD (Matches bottom card in picture) */}
        <div
          onClick={() => setShowFicoModal(true)}
          className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100/80 flex items-center gap-3.5 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Gauge className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
              Monitor your FICO® Score and credit report with Credit Close-Up℠
            </p>
            <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
              Score: 785 • Excellent
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </div>

        {/* QUICK TRANSFERS & WIRES SHORTCUT BAR */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => {
              setShowInternalTransfer(true);
              setInternalError(null);
              setInternalSuccess(null);
            }}
            disabled={user.status === 'locked' || user.transfersRestricted}
            className="p-3.5 bg-white hover:bg-blue-50/70 border border-slate-200/80 rounded-2xl text-left shadow-xs transition-all flex items-center gap-3 cursor-pointer disabled:opacity-40"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900">Apex Transfer</p>
              <p className="text-[10px] text-slate-500">Instant internal pay</p>
            </div>
          </button>

          <button
            onClick={() => {
              setShowInternationalWire(true);
            }}
            disabled={user.status === 'locked' || user.transfersRestricted}
            className="p-3.5 bg-white hover:bg-indigo-50/70 border border-slate-200/80 rounded-2xl text-left shadow-xs transition-all flex items-center gap-3 cursor-pointer disabled:opacity-40"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900">SWIFT Wire</p>
              <p className="text-[10px] text-slate-500">194 countries & banks</p>
            </div>
          </button>
        </div>

        {/* ACCOUNT ACTIVITY & RECENT TRANSACTIONS LEDGER */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden mt-4">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Account Activity</h3>
              <p className="text-[10px] text-slate-500">Electronic Funds Transfer History</p>
            </div>
            <button
              onClick={refreshData}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
              title="Refresh Activity"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No recent transactions on this account.
              </div>
            ) : (
              transactions.slice(0, 5).map(tx => {
                const isDebit = tx.senderId === user.uid;
                const isReversed = tx.status === 'reversed';

                return (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTxReceipt(tx)}
                    className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isReversed
                            ? 'bg-rose-100 text-rose-700'
                            : isDebit
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {isReversed ? (
                          <X className="w-4 h-4" />
                        ) : isDebit ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-slate-900 truncate">
                          {isDebit ? tx.recipientName : tx.senderName}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {tx.type === 'international_wire' ? 'SWIFT Wire' : 'Apex Transfer'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p
                        className={`font-mono font-bold text-xs sm:text-sm ${
                          isReversed
                            ? 'text-rose-600 line-through'
                            : isDebit
                            ? 'text-slate-900'
                            : 'text-emerald-700'
                        }`}
                      >
                        {isDebit ? '-' : '+'}${tx.amount.toFixed(2)}
                      </p>
                      <span className="text-[9px] uppercase tracking-wider text-blue-700 font-semibold block">
                        Receipt &gt;
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* FIXED BOTTOM NAVIGATION BAR (MATCHES EXACT 5 TABS FROM PICTURE) */}
      {/* ============================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 sm:px-6">
        <div className="max-w-md sm:max-w-xl mx-auto grid grid-cols-5 h-16 items-center">
          
          {/* 1. ACCOUNTS (Active Red Tab matching Picture) */}
          <button
            onClick={() => {
              setActiveBottomTab('accounts');
              setShowDepositModal(false);
              setShowInternalTransfer(false);
              setShowOpenAccountModal(false);
              setShowProfileEdit(false);
              navHistory.pushTab('accounts');
            }}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <div className={`p-1 rounded-lg ${activeBottomTab === 'accounts' ? 'text-red-700' : 'text-slate-500'}`}>
              <Landmark className="w-5 h-5 fill-current" />
            </div>
            <span className={`text-[10px] font-bold tracking-tight ${activeBottomTab === 'accounts' ? 'text-red-700 font-extrabold' : 'text-slate-600'}`}>
              Accounts
            </span>
          </button>

          {/* 2. DEPOSIT */}
          <button
            onClick={() => {
              setActiveBottomTab('deposit');
              setShowDepositModal(true);
              navHistory.pushTab('deposit');
            }}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-slate-500 hover:text-slate-900"
          >
            <div className={`p-1 rounded-lg ${activeBottomTab === 'deposit' ? 'text-blue-700' : 'text-slate-500'}`}>
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-semibold tracking-tight ${activeBottomTab === 'deposit' ? 'text-blue-700 font-extrabold' : 'text-slate-600'}`}>
              Deposit
            </span>
          </button>

          {/* 3. PAY & TRANSFER */}
          <button
            onClick={() => {
              setActiveBottomTab('transfer');
              setShowInternalTransfer(true);
              navHistory.pushTab('transfer');
            }}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-slate-500 hover:text-blue-700"
          >
            <div className={`p-1 rounded-lg ${activeBottomTab === 'transfer' ? 'text-blue-700' : 'text-slate-500'}`}>
              <Zap className="w-5 h-5 text-blue-700" />
            </div>
            <span className={`text-[10px] font-semibold tracking-tight ${activeBottomTab === 'transfer' ? 'text-blue-700 font-extrabold' : 'text-slate-600'}`}>
              Pay & Transfer
            </span>
          </button>

          {/* 4. EXPLORE */}
          <button
            onClick={() => {
              setActiveBottomTab('explore');
              setShowOpenAccountModal(true);
              navHistory.pushTab('explore');
            }}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-slate-500 hover:text-slate-900"
          >
            <div className={`p-1 rounded-lg ${activeBottomTab === 'explore' ? 'text-blue-700' : 'text-slate-500'}`}>
              <Compass className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-semibold tracking-tight ${activeBottomTab === 'explore' ? 'text-blue-700 font-extrabold' : 'text-slate-600'}`}>
              Explore
            </span>
          </button>

          {/* 5. MENU */}
          <button
            onClick={() => {
              setActiveBottomTab('menu');
              setShowProfileEdit(true);
              navHistory.pushTab('menu');
            }}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-slate-500 hover:text-slate-900"
          >
            <div className={`p-1 rounded-lg ${activeBottomTab === 'menu' ? 'text-blue-700' : 'text-slate-500'}`}>
              <MenuIcon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-semibold tracking-tight ${activeBottomTab === 'menu' ? 'text-blue-700 font-extrabold' : 'text-slate-600'}`}>
              Menu
            </span>
          </button>

        </div>
      </nav>

      {/* LIFTED SUPPORT ICON ABOVE THE MENU SIDE (Matches user request) */}
      <div className="fixed bottom-20 right-4 sm:right-6 md:right-8 z-40">
        <button
          onClick={onOpenSupport}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900/95 hover:bg-black text-white rounded-full shadow-xl border border-slate-700/80 hover:scale-105 active:scale-95 transition-all cursor-pointer group backdrop-blur-sm"
          title="24/7 Client Concierge Support"
          aria-label="24/7 Live Support Concierge"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-tight pr-0.5">Support</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* MODALS & FORMS FOR ALL BANKING OPERATIONS                     */}
      {/* ============================================================== */}

      {/* REWARDS MODAL */}
      {showRewardsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowRewardsModal(false)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer group active:scale-95"
                  title="Back (Esc)"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back</span>
                </button>
                <h3 className="font-bold text-base text-slate-900">Apex Rewards®</h3>
              </div>
              <button onClick={() => setShowRewardsModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer" title="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center py-3 bg-blue-50/60 rounded-2xl border border-blue-100">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Available Cash Rewards</p>
              <h2 className="text-4xl font-extrabold text-blue-900 mt-1">$1.00</h2>
              <p className="text-xs text-emerald-700 font-semibold mt-1">Cash Back on Everyday Platinum Spending</p>
            </div>
            <button
              onClick={() => setShowRewardsModal(false)}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl cursor-pointer"
            >
              Close Rewards
            </button>
          </div>
        </div>
      )}

      {/* FICO SCORE MODAL */}
      {showFicoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFicoModal(false)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer group active:scale-95"
                  title="Back (Esc)"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back</span>
                </button>
                <h3 className="font-bold text-base text-slate-900">Credit Close-Up℠</h3>
              </div>
              <button onClick={() => setShowFicoModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer" title="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-500 shadow-inner">
              <span className="text-2xl font-black">785</span>
            </div>
            <p className="font-bold text-emerald-700 text-sm">Rating: Excellent</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your FICO® Score 8 based on Experian data was updated today. On-time payment history is 100%.
            </p>
            <button
              onClick={() => setShowFicoModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* RECENT ACTIVITY & NOTIFICATIONS MODAL (Matches user request) */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl my-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer group active:scale-95 mr-0.5"
                  title="Back to Dashboard (Esc)"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back</span>
                </button>
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">Recent Activity</h3>
                  <p className="text-[11px] text-slate-500">Live Account Updates & Alerts</p>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close activity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Stream */}
            <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
              
              {/* Account Transactions Activity */}
              {transactions.length > 0 ? (
                transactions.map(tx => {
                  const isDebit = tx.senderId === user.uid;
                  return (
                    <div
                      key={tx.id}
                      onClick={() => {
                        setSelectedTxReceipt(tx);
                        setShowNotifications(false);
                      }}
                      className="pt-3 first:pt-0 p-3 rounded-2xl hover:bg-slate-50 border border-slate-100/80 cursor-pointer transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                          {tx.type === 'international_wire' ? 'SWIFT Wire Payment' : 'Apex Transfer'}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {isDebit ? '-' : '+'}${tx.amount.toFixed(2)}
                        </span>
                      </div>
                      <p className="font-bold text-xs text-slate-900">
                        {isDebit ? `Payment sent to ${tx.recipientName}` : `Funds received from ${tx.senderName}`}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Ref: {tx.reference} • {new Date(tx.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                      <span className="text-[10px] font-bold text-blue-700 block">
                        Tap to view official payment receipt &gt;
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
                  No outgoing or incoming transfers recorded yet.
                </div>
              )}

              {/* Standard Account & Security Activity Notice */}
              <div className="pt-3 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1 text-xs">
                <div className="flex items-center justify-between text-emerald-800 font-bold text-[10px] uppercase tracking-wider">
                  <span>FDIC & Clearing Synchronization</span>
                  <span>Active</span>
                </div>
                <p className="text-slate-700 text-xs">
                  Your Everyday Checking (...{last4}) and Way2Save® accounts are active under Federal Reserve Node #021000089.
                </p>
                <p className="text-[10px] text-slate-400">
                  {new Date().toLocaleDateString([], { dateStyle: 'medium' })}
                </p>
              </div>

              {/* Security Alert Notice */}
              <div className="pt-3 p-3 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1 text-xs">
                <div className="flex items-center justify-between text-blue-800 font-bold text-[10px] uppercase tracking-wider">
                  <span>Security & Encryption</span>
                  <span>Verified</span>
                </div>
                <p className="text-slate-700 text-xs">
                  256-bit TLS encrypted session active. Transaction PIN protection enabled.
                </p>
              </div>

            </div>

            <button
              onClick={() => setShowNotifications(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 transition-colors"
            >
              Close Activity
            </button>
          </div>
        </div>
      )}

      {/* 1. EVERYDAY CHECKING ACCOUNT DETAILS MODAL */}
      {showAccountDetails === 'checking' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl my-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setShowAccountDetails(null)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer group active:scale-95 mr-0.5 shrink-0"
                  title="Back to Dashboard (Esc)"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back</span>
                </button>
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-slate-900 truncate">Everyday Checking</h3>
                  <p className="text-[11px] text-slate-500 truncate">Account #{user.accountNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAccountDetails(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Big Balance Header */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Available Balance</span>
              <h2 className="text-3xl font-extrabold text-slate-950 font-sans mt-0.5">
                ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>
              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                <span>Overdraft Protection: $500.00 Grace</span>
                <span className="text-emerald-700 font-bold">Status: Active</span>
              </div>
            </div>

            {/* Direct Deposit & Clearing Details */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Account Number</p>
                  <p className="font-mono font-bold text-sm text-slate-900 mt-0.5">{user.accountNumber}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(user.accountNumber, 'acc')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  {copiedAcc ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAcc ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Routing Number (ACH & Wire)</p>
                  <p className="font-mono font-bold text-sm text-slate-900 mt-0.5">{user.routingNumber}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(user.routingNumber, 'routing')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  {copiedRouting ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRouting ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
                <p className="font-bold text-blue-900 text-xs">Direct Deposit Setup Information</p>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Provide your Routing ({user.routingNumber}) and Account ({user.accountNumber}) to your employer or payroll provider to receive automatic paychecks up to 2 days early.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setShowAccountDetails(null);
                  setShowInternalTransfer(true);
                }}
                className="py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-xs transition-colors"
              >
                Transfer Funds
              </button>
              <button
                onClick={() => {
                  setShowAccountDetails(null);
                  setShowInternationalWire(true);
                }}
                className="py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs transition-colors"
              >
                Send SWIFT Wire
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. GENERATED PLATINUM CARD MODAL FOR EVERY USER */}
      {showAccountDetails === 'card' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl my-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setShowAccountDetails(null)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer group active:scale-95 mr-0.5 shrink-0"
                  title="Back to Dashboard (Esc)"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back</span>
                </button>
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-slate-900 truncate">Apex Platinum Card</h3>
                  <p className="text-[11px] text-slate-500 truncate">Digital Virtual Card</p>
                </div>
              </div>
              <button
                onClick={() => setShowAccountDetails(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* VISUAL PLATINUM CARD GENERATED FOR THIS USER */}
            <div className={`relative w-full aspect-[1.586] rounded-2xl p-6 text-white overflow-hidden shadow-2xl transition-all duration-300 ${
              cardFrozen
                ? 'bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-900 border-2 border-rose-400/80 opacity-90'
                : 'bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 border border-slate-700/80'
            }`}>
              {/* Subtle Metallic Holographic Sheen */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
              
              {/* Frozen Banner Overlay */}
              {cardFrozen && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-rose-600/90 text-white rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-md flex items-center gap-1 z-10">
                  <Lock className="w-3 h-3" />
                  <span>Card Locked</span>
                </div>
              )}

              {/* Card Header: Brand & Contactless Icon */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xs text-white border border-white/30">
                    A
                  </div>
                  <div>
                    <span className="font-black text-xs sm:text-sm tracking-wider uppercase block text-white drop-shadow">
                      Apex Bank
                    </span>
                    <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase block -mt-0.5">
                      Platinum Infinite
                    </span>
                  </div>
                </div>

                {!cardFrozen && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Wifi className="w-5 h-5 rotate-90" />
                  </div>
                )}
              </div>

              {/* EMV Gold Chip */}
              <div className="mt-4 relative z-10">
                <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-500 border border-amber-600/60 shadow-inner flex flex-col justify-around p-1">
                  <div className="h-[1px] bg-amber-700/40 w-full" />
                  <div className="h-[1px] bg-amber-700/40 w-full" />
                </div>
              </div>

              {/* 16-Digit Card Number */}
              <div className="mt-4 relative z-10">
                <p className="font-mono text-base sm:text-lg tracking-[0.18em] text-white font-bold drop-shadow">
                  {showCardSecurity
                    ? cardNumber
                    : cardNumber.replace(/(\d{4}\s)\d{4}\s\d{4}(\s\d{4})/, '$1•••• ••••$2')}
                </p>
              </div>

              {/* Cardholder Name & Expiry & CVV */}
              <div className="mt-3 flex items-end justify-between text-xs relative z-10">
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-slate-400 block">Cardholder</span>
                  <span className="font-bold tracking-wider text-slate-100 uppercase text-xs truncate max-w-[170px] block">
                    {user.displayName}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-slate-400 block">Expires</span>
                    <span className="font-mono font-bold text-slate-100 text-xs">08/29</span>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-slate-400 block">CVV</span>
                    <span className="font-mono font-bold text-slate-100 text-xs">
                      {showCardSecurity ? '784' : '•••'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Card Controls */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(cardNumber.replace(/\s+/g, ''));
                  setCardCopied(true);
                  setTimeout(() => setCardCopied(false), 2000);
                }}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {cardCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{cardCopied ? 'Card Copied!' : 'Copy Card #'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCardSecurity(!showCardSecurity)}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {showCardSecurity ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showCardSecurity ? 'Hide Details' : 'Show Details'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCardFrozen(!cardFrozen)}
                className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  cardFrozen
                    ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                {cardFrozen ? <Lock className="w-4 h-4 text-rose-700" /> : <Unlock className="w-4 h-4" />}
                <span>{cardFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateNewCard}
                className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Generate fresh replacement card"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Replace Card</span>
              </button>
            </div>

            {/* Credit Limit & Utilization */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Available Credit</span>
                <span className="font-extrabold text-slate-900 font-mono">$25,000.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Current Balance</span>
                <span className="font-extrabold text-slate-900 font-mono">$0.00</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 text-emerald-700 font-bold text-[11px]">
                <span>Rewards Rate</span>
                <span>Unlimited 2% Cash Back Everywhere</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. WAY2SAVE SAVINGS DETAILS MODAL */}
      {showAccountDetails === 'savings' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl my-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setShowAccountDetails(null)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer group active:scale-95 mr-0.5 shrink-0"
                  title="Back to Dashboard (Esc)"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back</span>
                </button>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <PiggyBank className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-slate-900 truncate">Way2Save® Savings</h3>
                  <p className="text-[11px] text-slate-500 truncate">Account #9019283019</p>
                </div>
              </div>
              <button
                onClick={() => setShowAccountDetails(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Available Balance</span>
              <h2 className="text-3xl font-extrabold text-slate-950 font-sans mt-0.5">$0.00</h2>
              <p className="text-xs text-emerald-700 font-bold mt-1">Interest Rate: 4.85% APY Daily Compound</p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p>• Save As You Go® automatic debit card purchase roundups enabled.</p>
              <p>• Interest compounded daily, credited on the last business day of each month.</p>
              <p>• 100% FDIC coverage up to $250,000.</p>
            </div>

            <button
              onClick={() => {
                setShowAccountDetails(null);
                setShowInternalTransfer(true);
              }}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition-colors"
            >
              Deposit Funds to Way2Save®
            </button>
          </div>
        </div>
      )}

      {/* OPEN A NEW ACCOUNT MODAL */}
      {showOpenAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowOpenAccountModal(false)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer group active:scale-95"
                  title="Back to Dashboard (Esc)"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back</span>
                </button>
                <h3 className="font-bold text-base text-slate-900">Open an Account</h3>
              </div>
              <button onClick={() => setShowOpenAccountModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer" title="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div
                onClick={() => setShowOpenAccountModal(false)}
                className="p-3.5 border border-slate-200 hover:border-blue-500 rounded-2xl cursor-pointer hover:bg-blue-50/40 transition-all"
              >
                <p className="font-bold text-sm text-slate-900">High-Yield CD (12 Months)</p>
                <p className="text-xs text-slate-500">Fixed 5.25% APY with guaranteed FDIC protection.</p>
              </div>

              <div
                onClick={() => setShowOpenAccountModal(false)}
                className="p-3.5 border border-slate-200 hover:border-blue-500 rounded-2xl cursor-pointer hover:bg-blue-50/40 transition-all"
              >
                <p className="font-bold text-sm text-slate-900">Commercial Treasury Checking</p>
                <p className="text-xs text-slate-500">Dedicated clearing sub-account for wire operations.</p>
              </div>

              <div
                onClick={() => setShowOpenAccountModal(false)}
                className="p-3.5 border border-slate-200 hover:border-blue-500 rounded-2xl cursor-pointer hover:bg-blue-50/40 transition-all"
              >
                <p className="font-bold text-sm text-slate-900">Apex Infinite Credit Card</p>
                <p className="text-xs text-slate-500">$50,000 credit line with airport lounge concierge access.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERNAL TRANSFER MODAL */}
      {showInternalTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-blue-900">
                <button
                  type="button"
                  onClick={() => setShowInternalTransfer(false)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer group active:scale-95 mr-1"
                  title="Back to Dashboard (Esc)"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back</span>
                </button>
                <Zap className="w-5 h-5 text-blue-700 shrink-0" />
                <h3 className="font-bold text-base text-slate-900">Apex Instant Internal Transfer</h3>
              </div>
              <button onClick={() => setShowInternalTransfer(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer" title="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Switcher between Internal & SWIFT International Wire */}
            <div className="p-1 bg-slate-100 rounded-xl flex gap-1 text-xs font-bold">
              <button
                type="button"
                className="flex-1 py-1.5 rounded-lg bg-white text-blue-900 shadow-xs cursor-default"
              >
                Instant Internal Pay
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInternalTransfer(false);
                  setShowInternationalWire(true);
                }}
                className="flex-1 py-1.5 rounded-lg text-slate-600 hover:text-indigo-900 transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>SWIFT Wire (194 Nations)</span>
              </button>
            </div>

            {internalError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {internalError}
              </div>
            )}
            {internalSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
                {internalSuccess}
              </div>
            )}

            <form onSubmit={handleInternalTransferSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Recipient Account Number or Email</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1092837465 or elon@apexbank.com"
                  value={internalRecipient}
                  onChange={e => setInternalRecipient(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Transfer Amount (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={internalAmount}
                  onChange={e => setInternalAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-bold outline-none focus:border-blue-600"
                />
                <p className="text-[10px] text-slate-500 mt-1">Available balance: ${user.balance.toFixed(2)}</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Memo / Purpose (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Invoice payment, Living expenses"
                  value={internalMemo}
                  onChange={e => setInternalMemo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600"
                />
              </div>

              {user.transactionPin && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">4-Digit Security PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="••••"
                    value={internalPin}
                    onChange={e => setInternalPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center tracking-widest text-base outline-none focus:border-blue-600"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-bold text-sm rounded-xl shadow-md hover:from-blue-800 hover:to-indigo-900 transition-all cursor-pointer mt-2"
              >
                Execute Real-Time Transfer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL SWIFT WIRE TRANSFER MODAL (194 COUNTRIES & THOUSANDS OF BANKS) */}
      <InternationalWireModal
        user={user}
        isOpen={showInternationalWire}
        onClose={() => setShowInternationalWire(false)}
        onSuccess={tx => {
          refreshData();
          setShowInternationalWire(false);
          setSelectedTxReceipt(tx);
        }}
      />

      {/* PROFILE KYC & SETTINGS MODAL */}
      {showProfileEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileEdit(false)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer group active:scale-95"
                  title="Back (Esc)"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back</span>
                </button>
                <h3 className="font-bold text-base text-slate-900">Profile & Security</h3>
              </div>
              <button onClick={() => setShowProfileEdit(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer" title="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold">
                Account profile updated successfully.
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Identifier</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={profilePhone}
                  onChange={e => setProfilePhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinSetup(true)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Manage PIN
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PIN SETUP MODAL */}
      {showPinSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinSetup(false)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer group active:scale-95"
                  title="Back (Esc)"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back</span>
                </button>
                <h3 className="font-bold text-base text-slate-900">4-Digit Security PIN</h3>
              </div>
              <button onClick={() => setShowPinSetup(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer" title="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {pinError && <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs">{pinError}</div>}
            {pinSuccess && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs">Security PIN saved!</div>}

            <form onSubmit={handlePinSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-lg tracking-widest"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Confirm 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={confirmPin}
                  onChange={e => setConfirmPin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-lg tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs"
              >
                Save Security PIN
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE REMOTE CHECK DEPOSIT & TREASURY CLEARANCE MODAL */}
      <DepositModal
        user={user}
        isOpen={showDepositModal}
        onClose={() => {
          setShowDepositModal(false);
          setActiveBottomTab('accounts');
        }}
        onSuccessTx={tx => {
          refreshData();
          setSelectedTxReceipt(tx);
        }}
      />

      {/* OFFICIAL TRANSACTION RECEIPT MODAL */}
      <ReceiptModal
        transaction={selectedTxReceipt}
        onClose={() => setSelectedTxReceipt(null)}
      />

    </div>
  );
};
