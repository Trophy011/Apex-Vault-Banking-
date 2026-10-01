import React, { useState } from 'react';
import { BankTransaction } from '../lib/types.ts';
import {
  X,
  Printer,
  Copy,
  Check,
  ArrowRight,
  Info,
  Landmark,
  Download
} from 'lucide-react';

interface ReceiptModalProps {
  transaction: BankTransaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const handleCopyReference = () => {
    navigator.clipboard.writeText(transaction.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isReversed = transaction.status === 'reversed';
  const txDate = new Date(transaction.createdAt);

  // Format date like picture: "15 Aug, 2026"
  const formattedDate = txDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Direct PDF/Document Downloader
  const handleDownloadDocument = () => {
    const receiptHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Apex Bank Payment Advice Receipt - ${transaction.reference}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fff; color: #000; padding: 40px; margin: 0 auto; max-width: 580px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .logo-badge { border: 2px solid #000; border-radius: 10px; padding: 6px 10px; font-weight: 900; font-size: 11px; text-transform: uppercase; text-align: center; line-height: 1.1; }
    .title { font-size: 26px; font-weight: 800; margin-left: 12px; }
    .status-capsule { border: 1.5px solid #059669; color: #059669; padding: 4px 14px; border-radius: 999px; font-weight: 600; font-size: 13px; }
    .amount { font-size: 44px; font-weight: 900; margin: 24px 0 16px; }
    .diagram-box { display: flex; justify-content: space-between; align-items: center; margin: 20px 0 24px; font-size: 13px; color: #333; }
    .bank-flow { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 10px; }
    .row { display: flex; justify-content: space-between; padding: 13px 0; border-top: 1px solid #eee; font-size: 14px; }
    .row-label { font-weight: 700; color: #000; }
    .row-value { font-weight: 700; color: #000; text-align: right; }
    .status-success { color: #059669; font-weight: 800; }
    .note-box { border: 1px solid #ddd; border-radius: 14px; padding: 14px; margin-top: 24px; font-size: 12px; color: #444; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body onload="window.print()">
  <div class="header">
    <div style="display:flex; align-items:center;">
      <div class="logo-badge">APEX<br>BANK</div>
      <div class="title">Payment</div>
    </div>
    <div class="status-capsule">Successful &#10003;</div>
  </div>
  <div class="amount">$${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
  <div class="diagram-box">
    <div style="max-width: 280px; line-height: 1.4;">
      Your payment has been sent successfully and confirmed by the receiving bank. Funds have settled in the recipient's account.
    </div>
    <div class="bank-flow">
      <div style="color:#1e3a8a; text-align:center;">&#127963;<br>YOUR BANK</div>
      <div style="border:1px solid #999; border-radius:50%; width:20px; height:20px; text-align:center; line-height:18px;">&rarr;</div>
      <div style="color:#991b1b; text-align:center;">&#127963;<br>RECEIVER'S BANK</div>
    </div>
  </div>
  <div class="row"><span class="row-label">Status</span><span class="row-value status-success">${isReversed ? 'Reversed' : 'Successful'}</span></div>
  <div class="row"><span class="row-label">From</span><span class="row-value">${transaction.senderName || 'Sandra williams'}</span></div>
  <div class="row"><span class="row-label">To</span><span class="row-value">${transaction.recipientBank || 'Banco primerica'}</span></div>
  <div class="row"><span class="row-label">Receiver Name</span><span class="row-value">${transaction.recipientName || 'Falando meront'}</span></div>
  <div class="row"><span class="row-label">Amount</span><span class="row-value">$${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
  <div class="row"><span class="row-label">Charges Fee</span><span class="row-value">$${transaction.type === 'international_wire' ? '200.00' : '0.00'}</span></div>
  <div class="row"><span class="row-label">Reference ID</span><span class="row-value">${transaction.reference}</span></div>
  <div class="row"><span class="row-label">Date &amp; Time</span><span class="row-value">${formattedDate}</span></div>
  <div class="note-box">&#9432; The money has been sent to the receiver's account and confirmed settled by their bank.</div>
</body>
</html>`;

    const blob = new Blob([receiptHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Apex_Payment_Receipt_${transaction.reference}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* High-Fidelity Print CSS Rules for Pixel-Perfect PDF Export */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body > * {
            visibility: hidden !important;
          }
          .receipt-print-wrapper,
          .receipt-print-wrapper * {
            visibility: visible !important;
          }
          .receipt-print-wrapper {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .print-hide {
            display: none !important;
          }
        }
      `}</style>

      <div className="receipt-print-wrapper fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-900 my-auto">
          
          {/* Floating Close Button */}
          <div className="absolute top-4 right-4 z-10 print-hide">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Receipt Canvas */}
          <div className="p-6 sm:p-8 space-y-6">

            {/* 1. HEADER (Matches picture: Square Logo Badge, "Payment", "Successful" capsule, Check circle) */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-3">
                {/* Rounded square badge matching "MINI SOO" badge from picture */}
                <div className="w-12 h-12 rounded-xl border-2 border-black flex flex-col items-center justify-center leading-none text-center font-black text-[9px] tracking-tight uppercase p-1">
                  <span>APEX</span>
                  <span>BANK</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight font-sans">
                  Payment
                </h2>
              </div>

              {/* Right Status Pill & Check Circle matching picture */}
              <div className="flex items-center gap-2 pr-6 sm:pr-8">
                <span className={`px-3 py-1 rounded-full border text-xs sm:text-sm font-semibold ${
                  isReversed
                    ? 'border-rose-700 text-rose-700 bg-rose-50/50'
                    : 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                }`}>
                  {isReversed ? 'Reversed' : 'Successful'}
                </span>

                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center shrink-0 ${
                  isReversed
                    ? 'border-rose-700 text-rose-700 bg-rose-50'
                    : 'border-emerald-600 text-emerald-700 bg-emerald-50'
                }`}>
                  {isReversed ? (
                    <X className="w-4 h-4 text-rose-700 stroke-[2.2]" />
                  ) : (
                    <Check className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                  )}
                </div>
              </div>
            </div>

            {/* 2. BIG AMOUNT (Matches picture: $5,000.00) */}
            <div className="pt-2">
              <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tight font-sans">
                ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h1>
            </div>

            {/* 3. EXPLANATION & TWO-BANK FLOW GRAPHIC (Matches picture) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1 pb-3">
              <p className="text-xs text-slate-700 leading-relaxed max-w-[240px] font-normal">
                Your payment has been sent successfully and confirmed by the receiving bank. Funds have settled in the recipient's account.
              </p>

              {/* Graphic: YOUR BANK -> RECEIVER'S BANK */}
              <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                {/* YOUR BANK (Blue) */}
                <div className="text-center">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto text-blue-900">
                    <Landmark className="w-6 h-6 text-blue-900 stroke-[1.8]" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-blue-900 uppercase tracking-wider block mt-0.5">
                    YOUR BANK
                  </span>
                </div>

                {/* Arrow Circle */}
                <div className="w-6 h-6 rounded-full border border-black flex items-center justify-center mx-1 shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 text-black stroke-[2]" />
                </div>

                {/* RECEIVER'S BANK (Red) */}
                <div className="text-center">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto text-red-800">
                    <Landmark className="w-6 h-6 text-red-800 stroke-[1.8]" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-red-800 uppercase tracking-wider block mt-0.5">
                    RECEIVER'S BANK
                  </span>
                </div>
              </div>
            </div>

            {/* 4. DETAIL ROWS (Matches exact layout, rows and typography from picture) */}
            <div className="border-t border-slate-100 divide-y divide-slate-100 text-xs sm:text-sm">
              
              {/* Status */}
              <div className="py-3.5 flex items-center justify-between">
                <span className="font-bold text-black">Status</span>
                <span className="font-bold text-emerald-700">
                  {isReversed ? 'Reversed' : 'Successful'}
                </span>
              </div>

              {/* From */}
              <div className="py-3.5 flex items-center justify-between">
                <span className="font-bold text-black">From</span>
                <span className="font-bold text-black capitalize">
                  {transaction.senderName || 'Sandra williams'}
                </span>
              </div>

              {/* To */}
              <div className="py-3.5 flex items-center justify-between">
                <span className="font-bold text-black">To</span>
                <span className="font-bold text-black capitalize">
                  {transaction.recipientBank || 'Banco primerica'}
                </span>
              </div>

              {/* Receiver Name */}
              <div className="py-3.5 flex items-center justify-between">
                <span className="font-bold text-black">Receiver Name</span>
                <span className="font-bold text-black capitalize">
                  {transaction.recipientName || 'Falando meront'}
                </span>
              </div>

              {/* Amount */}
              <div className="py-3.5 flex items-center justify-between">
                <span className="font-bold text-black">Amount</span>
                <span className="font-bold text-black font-sans">
                  ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Charges Fee */}
              <div className="py-3.5 flex items-center justify-between">
                <span className="font-bold text-black">Charges Fee</span>
                <span className="font-bold text-black font-sans">
                  ${transaction.type === 'international_wire' ? '200.00' : '0.00'}
                </span>
              </div>

              {/* Reference ID */}
              <div className="py-3.5 flex items-center justify-between">
                <span className="font-bold text-black">Reference ID</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-black font-mono tracking-wide">
                    {transaction.reference}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyReference}
                    className="p-1 rounded text-slate-400 hover:text-black transition-colors print-hide cursor-pointer"
                    title="Copy Reference"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="py-3.5 flex items-center justify-between">
                <span className="font-bold text-black">Date & Time</span>
                <span className="font-bold text-black">
                  {formattedDate}
                </span>
              </div>

            </div>

            {/* 5. BOTTOM NOTE BOX (Matches picture: Rounded box with (i) icon) */}
            <div className="rounded-2xl border border-slate-200 p-4 flex items-center gap-3 bg-white text-xs text-slate-700 leading-snug">
              <div className="w-5 h-5 rounded-full border border-slate-400 text-slate-500 flex items-center justify-center shrink-0">
                <Info className="w-3 h-3 text-slate-600" />
              </div>
              <p className="font-normal text-[11px] sm:text-xs">
                The money has been sent to the receiver's account and confirmed settled by their bank.
              </p>
            </div>

            {/* Action Buttons for Web App */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5 print-hide">
              <button
                onClick={handleDownloadDocument}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Download Standalone PDF Document"
              >
                <Download className="w-4 h-4" />
                <span>Save HTML / PDF</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 bg-black hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                title="Print or Save as PDF in Browser"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};
