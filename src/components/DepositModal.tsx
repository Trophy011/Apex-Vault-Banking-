import React, { useState } from 'react';
import {
  ArrowLeft,
  X,
  Camera,
  CheckCircle2,
  Copy,
  Check,
  Building,
  Upload,
  AlertCircle,
  ShieldCheck,
  Zap,
  FileCheck
} from 'lucide-react';
import { BankUser, BankTransaction } from '../lib/types.ts';
import { bankStore } from '../lib/bankStore.ts';

interface DepositModalProps {
  user: BankUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccessTx: (tx: BankTransaction) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccessTx,
}) => {
  const [activeTab, setActiveTab] = useState<'check' | 'wire'>('check');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [targetAccount, setTargetAccount] = useState<'checking' | 'savings'>('checking');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedRouting, setCopiedRouting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTx, setSuccessTx] = useState<BankTransaction | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: 'acc' | 'routing') => {
    navigator.clipboard.writeText(text);
    if (type === 'acc') {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    } else {
      setCopiedRouting(true);
      setTimeout(() => setCopiedRouting(false), 2000);
    }
  };

  const handleSimulateFrontCheck = () => {
    // Generate a sleek check front mock image data URL
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 280;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 600, 280);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, 580, 260);

      // Check Header
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('UNITED STATES TREASURY & PAYROLL CLEARING', 30, 45);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('Date: ' + new Date().toLocaleDateString(), 440, 45);
      ctx.fillText('PAY TO THE ORDER OF: ' + user.displayName.toUpperCase(), 30, 95);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('$' + (amount ? parseFloat(amount).toFixed(2) : '1,500.00'), 460, 110);

      ctx.fillStyle = '#475569';
      ctx.font = '14px sans-serif';
      ctx.fillText('MEMO: ' + (memo || 'Payroll Reimbursement / Mobile Capture'), 30, 180);

      // MICR routing numbers at bottom
      ctx.fillStyle = '#1e293b';
      ctx.font = '18px monospace';
      ctx.fillText('⑆ 021000089 ⑆ 9920192831 ⑈ 1042', 30, 250);

      setFrontImage(canvas.toDataURL('image/png'));
    }
  };

  const handleSimulateBackCheck = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 280;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, 600, 280);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 580, 260);

      // Endorsement lines
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(350, 40); ctx.lineTo(560, 40);
      ctx.moveTo(350, 80); ctx.lineTo(560, 80);
      ctx.moveTo(350, 120); ctx.lineTo(560, 120);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'italic 16px cursive, sans-serif';
      ctx.fillText(user.displayName, 370, 75);

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('FOR APEX MOBILE DEPOSIT ONLY', 360, 110);

      setBackImage(canvas.toDataURL('image/png'));
    }
  };

  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Please specify a valid deposit amount.');
      return;
    }

    if (val > 50000) {
      setError('Mobile deposit limit is $50,000.00 per deposit.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const tx = bankStore.depositCustomerCheck(
          user.uid,
          val,
          memo ? `Mobile Check: ${memo}` : 'Mobile Remote Check Deposit'
        );
        setIsSubmitting(false);
        setSuccessTx(tx);
        onSuccessTx(tx);
      } catch (err: any) {
        setIsSubmitting(false);
        setError(err.message || 'Deposit capture failed.');
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] gpu-accelerated">
        
        {/* Header with Prominent Back Button */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer active:scale-95 group"
              title="Back to Accounts (Esc)"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-blue-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">Deposit Funds</h3>
              <p className="text-[10px] text-blue-300">Apex Remote Capture & Treasury Clearance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-2 bg-slate-100 flex gap-1 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('check')}
            className={`flex-1 py-2 rounded-xl text-center transition-all cursor-pointer ${
              activeTab === 'check'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mobile Check Capture
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('wire')}
            className={`flex-1 py-2 rounded-xl text-center transition-all cursor-pointer ${
              activeTab === 'wire'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Direct Deposit & Wire Info
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-4 text-xs">
          {successTx ? (
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900">Deposit Approved & Cleared!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  ${successTx.amount.toFixed(2)} has been credited to your Everyday Checking account.
                </p>
                <p className="text-[11px] font-mono text-blue-700 mt-2 bg-blue-50 py-1 px-3 rounded-lg inline-block">
                  Ref: {successTx.reference}
                </p>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSuccessTx(null);
                    setAmount('');
                    setMemo('');
                    setFrontImage(null);
                    setBackImage(null);
                    onClose();
                  }}
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold cursor-pointer transition-all shadow-md active:scale-95"
                >
                  Done (Back to Accounts)
                </button>
              </div>
            </div>
          ) : activeTab === 'check' ? (
            <form onSubmit={handleSubmitDeposit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Target Account */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Deposit Into Account
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-xs">Everyday Checking ...{user.accountNumber.slice(-4)}</p>
                    <p className="text-[11px] text-slate-500">Available: ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    Active
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Check Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-base font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-base focus:bg-white focus:border-blue-600 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Memo */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Memo / Payer (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Payroll Check, Client Invoice #402"
                  value={memo}
                  onChange={e => setMemo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 outline-none transition-all"
                />
              </div>

              {/* Check Images Capture */}
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Check Photos (Front & Back)
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {/* Front Check */}
                  <div
                    onClick={handleSimulateFrontCheck}
                    className="p-3 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/50 min-h-[90px]"
                  >
                    {frontImage ? (
                      <div className="w-full">
                        <img src={frontImage} alt="Front" className="h-16 w-full object-cover rounded-lg border border-slate-200" />
                        <span className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center justify-center gap-1">
                          <Check className="w-3 h-3" /> Front Attached
                        </span>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 text-slate-500 mb-1" />
                        <span className="text-[11px] font-bold text-slate-700">Capture Front</span>
                        <span className="text-[9px] text-slate-400">Tap to auto-capture</span>
                      </>
                    )}
                  </div>

                  {/* Back Check */}
                  <div
                    onClick={handleSimulateBackCheck}
                    className="p-3 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/50 min-h-[90px]"
                  >
                    {backImage ? (
                      <div className="w-full">
                        <img src={backImage} alt="Back" className="h-16 w-full object-cover rounded-lg border border-slate-200" />
                        <span className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center justify-center gap-1">
                          <Check className="w-3 h-3" /> Back Endorsed
                        </span>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 text-slate-500 mb-1" />
                        <span className="text-[11px] font-bold text-slate-700">Capture Back</span>
                        <span className="text-[9px] text-slate-400">Tap to auto-capture</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Fast Fill Demo Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setAmount('1500.00');
                    setMemo('Monthly Payroll Allocation');
                    handleSimulateFrontCheck();
                    handleSimulateBackCheck();
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  ⚡ Auto-fill Sample Check ($1,500.00)
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !amount}
                className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold cursor-pointer transition-all shadow-md active:scale-95 text-xs flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing Security Clearing...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Deposit Check Now</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                  <Building className="w-4 h-4 text-blue-700" />
                  <span>Apex Bank Routing & Wire Clearing Details</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Provide these coordinates to your employer for direct deposit or to initiating institutions for domestic wire transfers.
                </p>
              </div>

              {/* Routing Number */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Routing (ABA / FedWire)</p>
                  <p className="text-sm font-mono font-bold text-slate-900">{user.routingNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(user.routingNumber, 'routing')}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedRouting ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRouting ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Account Number */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Account Number</p>
                  <p className="text-sm font-mono font-bold text-slate-900">{user.accountNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(user.accountNumber, 'acc')}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedAcc ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAcc ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Bank Name & Address */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-500">Receiving Bank</p>
                <p className="text-xs font-bold text-slate-900">Apex Online Banking (Simulated Depository)</p>
                <p className="text-[11px] text-slate-600">Simulated Financial Showcase • New York, NY</p>
                <p className="text-[10px] font-mono text-emerald-700 pt-0.5">Sandbox Virtual Ledger • Clearing Simulator Node #021000089</p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold cursor-pointer transition-colors text-xs"
                >
                  Close & Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
