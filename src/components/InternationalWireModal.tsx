import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  X,
  Globe2,
  Search,
  Building,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Clock,
  Landmark,
  ChevronDown
} from 'lucide-react';
import { BankUser, BankTransaction } from '../lib/types.ts';
import { bankStore } from '../lib/bankStore.ts';
import { COUNTRIES_AND_BANKS, CountryInfo, BankInfo } from '../lib/countriesAndBanks.ts';

interface InternationalWireModalProps {
  user: BankUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tx: BankTransaction) => void;
}

export const InternationalWireModal: React.FC<InternationalWireModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Country Selection
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('GB');
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState<boolean>(false);

  // Bank Selection inside Country
  const [selectedBankName, setSelectedBankName] = useState<string>('');
  const [swiftCode, setSwiftCode] = useState<string>('');
  const [isCustomBank, setIsCustomBank] = useState<boolean>(false);
  const [bankSearch, setBankSearch] = useState<string>('');
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState<boolean>(false);

  // Beneficiary Info
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientAccount, setRecipientAccount] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');

  // Transfer Amount & PIN
  const [amountUSD, setAmountUSD] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [pin, setPin] = useState<string>('');

  // Status & Confirmation
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [dispatchedTx, setDispatchedTx] = useState<BankTransaction | null>(null);

  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const bankDropdownRef = useRef<HTMLDivElement>(null);

  // Active selected country
  const selectedCountry: CountryInfo = useMemo(() => {
    return (
      COUNTRIES_AND_BANKS.find(c => c.code === selectedCountryCode) ||
      COUNTRIES_AND_BANKS[0]
    );
  }, [selectedCountryCode]);

  // When selected country changes, default to first bank in that country
  useEffect(() => {
    if (selectedCountry && selectedCountry.banks && selectedCountry.banks.length > 0) {
      setSelectedBankName(selectedCountry.banks[0].name);
      setSwiftCode(selectedCountry.banks[0].swiftCode);
      setIsCustomBank(false);
      setBankSearch('');
    } else {
      setSelectedBankName('');
      setSwiftCode('');
      setIsCustomBank(true);
    }
  }, [selectedCountryCode]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(e.target as Node)) {
        setIsBankDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filtered countries for instant search
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRIES_AND_BANKS;
    const q = countrySearch.toLowerCase().trim();
    return COUNTRIES_AND_BANKS.filter(
      c =>
        c.country.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.currency.toLowerCase().includes(q)
    );
  }, [countrySearch]);

  // Filtered banks for selected country
  const filteredBanks = useMemo(() => {
    if (!selectedCountry || !selectedCountry.banks) return [];
    if (!bankSearch.trim()) return selectedCountry.banks;
    const q = bankSearch.toLowerCase().trim();
    return selectedCountry.banks.filter(
      b =>
        b.name.toLowerCase().includes(q) ||
        b.swiftCode.toLowerCase().includes(q)
    );
  }, [selectedCountry, bankSearch]);

  // Converted amount calculation
  const numericAmount = parseFloat(amountUSD) || 0;
  const convertedAmount = numericAmount * selectedCountry.exchangeRateToUSD;

  const handleSelectCountry = (c: CountryInfo) => {
    setSelectedCountryCode(c.code);
    setIsCountryDropdownOpen(false);
    setCountrySearch('');
  };

  const handleSelectBank = (b: BankInfo) => {
    setSelectedBankName(b.name);
    setSwiftCode(b.swiftCode);
    setIsCustomBank(false);
    setIsBankDropdownOpen(false);
    setBankSearch('');
  };

  const handleEnableCustomBank = () => {
    setIsCustomBank(true);
    setSelectedBankName('');
    setSwiftCode('');
    setIsBankDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const val = parseFloat(amountUSD);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid transfer amount.');
      return;
    }

    if (val > user.balance) {
      setError(`Insufficient available funds ($${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} available).`);
      return;
    }

    if (!recipientName.trim()) {
      setError('Please provide the beneficiary full legal name.');
      return;
    }

    if (!recipientAccount.trim()) {
      setError('Please enter the recipient account number or IBAN.');
      return;
    }

    if (!selectedBankName.trim()) {
      setError('Please select or specify a destination bank.');
      return;
    }

    if (!swiftCode.trim()) {
      setError('Please enter the valid SWIFT / BIC code for the receiving bank.');
      return;
    }

    if (user.transactionPin && pin.trim() !== user.transactionPin) {
      setError('Invalid 4-digit security transaction PIN.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const fullDesc = memo.trim()
          ? `${memo.trim()} (SWIFT to ${selectedBankName}, ${selectedCountry.country})`
          : `International SWIFT Wire to ${selectedBankName} (${selectedCountry.country})`;

        const tx = bankStore.sendInternationalWire(
          user.uid,
          selectedCountry.country,
          selectedBankName.trim(),
          swiftCode.trim().toUpperCase(),
          recipientName.trim(),
          recipientAccount.trim(),
          val,
          fullDesc,
          pin.trim(),
          selectedCountry.exchangeRateToUSD,
          selectedCountry.currency
        );

        setIsSubmitting(false);
        setDispatchedTx(tx);
        onSuccess(tx);
      } catch (err: any) {
        setIsSubmitting(false);
        setError(err.message || 'International wire transmission failed.');
      }
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] my-auto gpu-accelerated">
        
        {/* Top Executive Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-bold transition-all cursor-pointer active:scale-95 group shrink-0"
              title="Back to Dashboard (Esc)"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight truncate">
                  Global SWIFT Wire Transfer
                </h3>
              </div>
              <p className="text-[10px] text-indigo-300 truncate">
                Direct SWIFT GPI Clearing to Any Country & Any Bank Worldwide
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-header Node Status Bar */}
        <div className="px-5 py-2 bg-indigo-950/20 border-b border-indigo-100 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Clearing Node: <strong className="font-mono text-slate-900">#021000089 (FedWire / SWIFT)</strong></span>
          </span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>194 Nations Connected</span>
          </span>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-4 text-xs">
          {dispatchedTx ? (
            /* ============================================================== */
            /* SUCCESS CONFIRMATION DISPATCH SLIP                            */
            /* ============================================================== */
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-wider">
                  MT103 SWIFT Message Dispatched
                </span>
                <h4 className="font-extrabold text-xl text-slate-950 mt-2">
                  Wire Transfer Successfully Sent!
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  ${dispatchedTx.amount.toFixed(2)} USD (approx.{' '}
                  <strong>
                    {selectedCountry.currencySymbol}
                    {dispatchedTx.foreignAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })} {dispatchedTx.foreignCurrency}
                  </strong>
                  ) is on its way to <strong>{dispatchedTx.recipientName}</strong> at <strong>{dispatchedTx.recipientBank}</strong> ({dispatchedTx.recipientCountry}).
                </p>
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto text-left space-y-1 font-mono text-[11px]">
                  <p className="text-slate-500 text-[10px] uppercase font-bold">SWIFT UETR Reference</p>
                  <p className="font-bold text-indigo-700">{dispatchedTx.reference}</p>
                  <p className="text-slate-500 text-[10px] uppercase font-bold pt-1">BIC / SWIFT Code</p>
                  <p className="text-slate-800">{dispatchedTx.swiftCode}</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setDispatchedTx(null);
                    onClose();
                  }}
                  className="flex-1 py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold cursor-pointer transition-all shadow-md active:scale-95"
                >
                  Done (Back to Accounts)
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* WIRE SUBMISSION FORM WITH ANY COUNTRY & ANY BANK PICKER       */
            /* ============================================================== */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: DESTINATION COUNTRY SELECTOR (SEARCH ANY OF 194 COUNTRIES) */}
              <div className="space-y-1.5" ref={countryDropdownRef}>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <span>1. Destination Country</span>
                    <span className="text-[10px] text-indigo-600 font-normal">({COUNTRIES_AND_BANKS.length} countries available)</span>
                  </label>
                  <span className="text-[10px] font-bold text-slate-500">
                    Currency: <strong className="text-indigo-700">{selectedCountry.currency} ({selectedCountry.currencySymbol})</strong>
                  </span>
                </div>

                {/* Country Trigger Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="w-full px-3.5 py-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-between transition-colors cursor-pointer text-left shadow-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{selectedCountry.flag || '🌐'}</span>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {selectedCountry.country}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Code: {selectedCountry.code} • 1 USD = {selectedCountry.exchangeRateToUSD} {selectedCountry.currency}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Searchable Country Dropdown Menu */}
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-64 animate-in fade-in">
                      {/* Search Bar */}
                      <div className="p-2.5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                        <Search className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Search any country (e.g. France, Japan, Kenya, Brazil)..."
                          value={countrySearch}
                          onChange={e => setCountrySearch(e.target.value)}
                          autoFocus
                          className="w-full bg-transparent text-xs text-slate-900 outline-none font-medium placeholder-slate-400"
                        />
                        {countrySearch && (
                          <button
                            type="button"
                            onClick={() => setCountrySearch('')}
                            className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Country List */}
                      <div className="overflow-y-auto divide-y divide-slate-100 p-1 flex-1">
                        {filteredCountries.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">
                            No countries found matching "{countrySearch}"
                          </div>
                        ) : (
                          filteredCountries.map(c => {
                            const isSelected = c.code === selectedCountryCode;
                            return (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => handleSelectCountry(c)}
                                className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-50 text-indigo-900 font-bold'
                                    : 'hover:bg-slate-50 text-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="text-lg shrink-0">{c.flag || '🌐'}</span>
                                  <span className="text-xs truncate">{c.country}</span>
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono shrink-0 pl-2">
                                  {c.currency} ({c.exchangeRateToUSD})
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* STEP 2: BANK SELECTION INSIDE THE SELECTED COUNTRY */}
              <div className="space-y-1.5" ref={bankDropdownRef}>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <span>2. Destination Bank in {selectedCountry.country}</span>
                  </label>
                  {!isCustomBank ? (
                    <button
                      type="button"
                      onClick={handleEnableCustomBank}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                    >
                      + Enter other bank manually
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedCountry.banks && selectedCountry.banks.length > 0) {
                          handleSelectBank(selectedCountry.banks[0]);
                        }
                      }}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                    >
                      ← Choose from {selectedCountry.country} banks list
                    </button>
                  )}
                </div>

                {!isCustomBank ? (
                  /* Bank Dropdown Selector */
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                      className="w-full px-3.5 py-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-between transition-colors cursor-pointer text-left shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                          <Building className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                            {selectedBankName || 'Select a bank...'}
                          </p>
                          <p className="text-[10px] text-indigo-700 font-mono">
                            SWIFT / BIC: <strong>{swiftCode}</strong>
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isBankDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Bank Selection List Dropdown */}
                    {isBankDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 z-30 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-60 animate-in fade-in">
                        {/* Search Banks */}
                        <div className="p-2.5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                          <Search className="w-4 h-4 text-slate-400 shrink-0" />
                          <input
                            type="text"
                            placeholder={`Search banks in ${selectedCountry.country}...`}
                            value={bankSearch}
                            onChange={e => setBankSearch(e.target.value)}
                            autoFocus
                            className="w-full bg-transparent text-xs text-slate-900 outline-none font-medium placeholder-slate-400"
                          />
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto divide-y divide-slate-100 p-1 flex-1">
                          {filteredBanks.map((b, idx) => {
                            const isSelected = b.name === selectedBankName;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectBank(b)}
                                className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-50 text-indigo-900 font-bold'
                                    : 'hover:bg-slate-50 text-slate-800'
                                }`}
                              >
                                <div className="min-w-0 pr-2">
                                  <p className="text-xs truncate">{b.name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">SWIFT: {b.swiftCode}</p>
                                </div>
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[9px] font-bold shrink-0">
                                  {b.swiftCode}
                                </span>
                              </button>
                            );
                          })}

                          {/* Manual Option in Dropdown */}
                          <button
                            type="button"
                            onClick={handleEnableCustomBank}
                            className="w-full p-2.5 rounded-xl text-center text-indigo-600 hover:bg-indigo-50 font-bold text-xs cursor-pointer transition-colors border-t border-slate-100"
                          >
                            + Enter Another Bank Manually
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Custom Bank Entry Inputs */
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">
                        Bank Name in {selectedCountry.country}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Credit Mutuel / Local Savings Bank"
                        value={selectedBankName}
                        onChange={e => setSelectedBankName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-indigo-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">
                        SWIFT / BIC Code (8 or 11 Characters)
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={11}
                        placeholder="e.g. BARCGB22XXX"
                        value={swiftCode}
                        onChange={e => setSwiftCode(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900 focus:border-indigo-600 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 3: BENEFICIARY DETAILS */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                  3. Beneficiary Account Information
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">
                      Beneficiary Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Vance / Global Trading Ltd"
                      value={recipientName}
                      onChange={e => setRecipientName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">
                      Account Number or IBAN
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GB29NWBK60161331926819"
                      value={recipientAccount}
                      onChange={e => setRecipientAccount(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">
                    Beneficiary Address / City (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10 Finsbury Square, London, United Kingdom"
                    value={recipientAddress}
                    onChange={e => setRecipientAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* STEP 4: TRANSFER AMOUNT & LIVE CURRENCY CONVERSION */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                  4. Amount & Currency Conversion
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">
                      Debit Amount from Everyday Checking (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-base font-bold text-slate-400">$</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="0.00"
                        value={amountUSD}
                        onChange={e => setAmountUSD(e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-base focus:bg-white focus:border-indigo-600 outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Recipient Receives Display */}
                  <div className="p-3 bg-gradient-to-br from-indigo-50/80 to-blue-50/80 border border-indigo-200/80 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-900">
                      Beneficiary Receives (Estimated)
                    </p>
                    <p className="text-lg font-mono font-bold text-indigo-950 mt-0.5">
                      {selectedCountry.currencySymbol}
                      {convertedAmount > 0
                        ? convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : '0.00'}{' '}
                      <span className="text-xs font-sans text-indigo-700">{selectedCountry.currency}</span>
                    </p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                      Mid-Market Rate: 1 USD = {selectedCountry.exchangeRateToUSD} {selectedCountry.currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* STEP 5: MEMO & PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">
                    Wire Transfer Memo / Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Invoice #204, Family Living Expenses"
                    value={memo}
                    onChange={e => setMemo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                  />
                </div>

                {user.transactionPin ? (
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">
                      4-Digit Security PIN
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      placeholder="••••"
                      value={pin}
                      onChange={e => setPin(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-base tracking-widest text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center text-[11px] text-slate-500 p-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Standard Biometric / Session Security Authorized</span>
                  </div>
                )}
              </div>

              {/* Submission Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !amountUSD || !recipientName || !recipientAccount}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-800 hover:from-indigo-600 hover:to-blue-600 disabled:opacity-50 text-white rounded-xl font-bold cursor-pointer transition-all shadow-md active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Transmitting into SWIFT Clearing Network...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>
                        Authorize & Dispatch Wire ({selectedCountry.flag} {selectedCountry.country})
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
