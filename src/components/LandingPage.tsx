import React, { useState } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Globe2,
  Zap,
  Lock,
  CreditCard,
  Building2,
  Headphones,
  CheckCircle2,
  ChevronRight,
  Calculator,
  Award,
  Layers,
  PhoneCall,
  ExternalLink,
  Search,
  Menu,
  X,
  Landmark,
  PiggyBank,
  Home,
  Briefcase,
  Smartphone,
  Gauge,
  Sparkles,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { COUNTRIES_AND_BANKS } from '../lib/countriesAndBanks.ts';

interface LandingPageProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const [activeSegment, setActiveSegment] = useState<'personal' | 'business' | 'commercial' | 'wealth'>('personal');
  const [selectedCountryCode, setSelectedCountryCode] = useState('GB');
  const [transferAmount, setTransferAmount] = useState<number>(5000);
  const [landingCountrySearch, setLandingCountrySearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredLandingCountries = COUNTRIES_AND_BANKS.filter(
    c =>
      c.country.toLowerCase().includes(landingCountrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(landingCountrySearch.toLowerCase()) ||
      c.currency.toLowerCase().includes(landingCountrySearch.toLowerCase())
  );

  const selectedCountry =
    COUNTRIES_AND_BANKS.find(c => c.code === selectedCountryCode) || COUNTRIES_AND_BANKS[0];

  const convertedAmount = (transferAmount * selectedCountry.exchangeRateToUSD).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white w-full overflow-x-hidden">
      
      {/* 1. TOP UTILITY & SEGMENT BAR (Like Wells Fargo / Chase) */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Banking Segment Tabs */}
          <div className="flex items-center gap-1 sm:gap-2">
            {(['personal', 'business', 'commercial', 'wealth'] as const).map(segment => (
              <button
                key={segment}
                onClick={() => setActiveSegment(segment)}
                className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold capitalize transition-colors ${
                  activeSegment === segment
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {segment === 'wealth' ? 'Wealth Management' : segment === 'business' ? 'Small Business' : segment}
              </button>
            ))}
          </div>

          {/* Quick Regulatory & Support Links */}
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Member FDIC • Fed Clearing #021000089
            </span>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('apex:open-support'))}
              className="hover:text-blue-300 text-slate-300 flex items-center gap-1 transition-colors font-medium"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>24/7 Support</span>
            </button>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">Español</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN BANK NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Bank Wordmark & Insignia */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center shadow-md text-white font-black text-xl tracking-wider shrink-0">
              A
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 flex items-center gap-1">
                APEX <span className="text-blue-700">BANK</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block -mt-1">
                National Association • Est. 1928
              </span>
            </div>
          </div>

          {/* Desktop Product Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-slate-700">
            <a href="#checking" className="hover:text-blue-700 transition-colors">Checking</a>
            <a href="#savings" className="hover:text-blue-700 transition-colors">Savings & CDs</a>
            <a href="#cards" className="hover:text-blue-700 transition-colors">Credit Cards</a>
            <a href="#transfers" className="hover:text-blue-700 transition-colors">Global Transfers</a>
            <a href="#loans" className="hover:text-blue-700 transition-colors">Lending</a>
            <a href="#rates" className="hover:text-blue-700 transition-colors">Rates</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-blue-700 hover:bg-blue-50/80 border border-blue-200/80 transition-all cursor-pointer whitespace-nowrap"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white shadow-md shadow-red-700/20 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Open an Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col text-sm font-semibold text-slate-700">
              <a href="#checking" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-700">
                Checking Accounts
              </a>
              <a href="#savings" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-700">
                Way2Save® & High-Yield CDs
              </a>
              <a href="#cards" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-700">
                Platinum Rewards Cards
              </a>
              <a href="#transfers" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-700">
                Global SWIFT & Fedwire Remittances
              </a>
              <a href="#rates" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-700">
                Live FX Exchange Rates
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.dispatchEvent(new CustomEvent('apex:open-support'));
                }}
                className="py-2.5 px-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold transition-colors text-left flex items-center justify-between cursor-pointer"
              >
                <span>24/7 Live Support Concierge</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* 3. CINEMATIC BANK HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Core Value Proposition & Welcome Offer */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                <span>Premier National Banking</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
                Banking designed for what matters most.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Enjoy everyday checking with zero monthly service fees on eligible direct deposits, high-yield <strong>4.85% APY</strong> savings, and real-time domestic Fedwire & international SWIFT transfers.
              </p>

              {/* Major Bank Welcome Offer Box (Like Chase / Wells Fargo) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-blue-200/90 shadow-md flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-black text-xl shrink-0">
                  $300
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">New Customer Bonus</span>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Earn up to a $300 welcome cash bonus
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Open an Everyday Checking account and receive qualifying direct deposits within 90 days.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-7 py-3.5 bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-800 hover:to-red-950 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-700/25 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>Open an Account in Minutes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Access Online Banking
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Member FDIC Insured to $250,000</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Federal Reserve Node #021000089</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>256-Bit TLS Bank-Grade Encryption</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Banking Architectural Imagery */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <img
                  src="/src/assets/images/hero_premier_banking_1790831861254.jpg"
                  alt="Apex Bank Premier Headquarters"
                  className="w-full h-80 sm:h-96 lg:h-[440px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Floating Institutional Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-xl text-slate-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Central Liquidity Vault</p>
                      <p className="text-sm font-black text-slate-950 font-mono mt-0.5">$10,000,000,000.00 USD</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      100% Backed
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Central clearing operations active for domestic Fedwire & global SWIFT.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. THE 6 PRIMARY BANKING PORTALS (Like Wells Fargo / Chase Quick Nav) */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">
              Explore Our Core Banking Solutions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select an account to view rates, features, and online application options.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            
            {/* 1. Checking */}
            <div
              onClick={() => onOpenAuth('register')}
              className="p-5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-400 transition-all text-center cursor-pointer group shadow-xs hover:shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Landmark className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Everyday Checking</h4>
              <p className="text-[10px] text-slate-500 mt-1">Zero fee with direct deposit</p>
            </div>

            {/* 2. Savings */}
            <div
              onClick={() => onOpenAuth('register')}
              className="p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-400 transition-all text-center cursor-pointer group shadow-xs hover:shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <PiggyBank className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Way2Save® Savings</h4>
              <p className="text-[10px] text-slate-500 mt-1">4.85% APY Daily Compound</p>
            </div>

            {/* 3. Cards */}
            <div
              onClick={() => onOpenAuth('register')}
              className="p-5 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-400 transition-all text-center cursor-pointer group shadow-xs hover:shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Platinum Cards</h4>
              <p className="text-[10px] text-slate-500 mt-1">Unlimited 2% Cash Rewards</p>
            </div>

            {/* 4. Global Wires */}
            <div
              onClick={() => onOpenAuth('register')}
              className="p-5 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200/80 hover:border-amber-400 transition-all text-center cursor-pointer group shadow-xs hover:shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Globe2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Global Wires</h4>
              <p className="text-[10px] text-slate-500 mt-1">SWIFT & Fedwire in 180+ nations</p>
            </div>

            {/* 5. Loans */}
            <div
              onClick={() => onOpenAuth('register')}
              className="p-5 rounded-2xl bg-slate-50 hover:bg-cyan-50/60 border border-slate-200/80 hover:border-cyan-400 transition-all text-center cursor-pointer group shadow-xs hover:shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Home Loans</h4>
              <p className="text-[10px] text-slate-500 mt-1">Competitive 30-year fixed</p>
            </div>

            {/* 6. Wealth */}
            <div
              onClick={() => onOpenAuth('register')}
              className="p-5 rounded-2xl bg-slate-50 hover:bg-purple-50/60 border border-slate-200/80 hover:border-purple-400 transition-all text-center cursor-pointer group shadow-xs hover:shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Private Wealth</h4>
              <p className="text-[10px] text-slate-500 mt-1">Dedicated executive advisory</p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FEATURED SPOTLIGHT: EVERYDAY CHECKING, WAY2SAVE & PLATINUM REWARDS */}
      <section id="checking" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Card Showcase Row with Realistic Luxury Card */}
          <div className="grid lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Platinum Rewards Advantage
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Apex Platinum Card: Unlimited 2% cash back everywhere.
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                No categories to track. No foreign transaction fees. Plus 0% intro APR on purchases and balance transfers for 15 billing cycles.
              </p>
              
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Unlimited 2% cash rewards automatically deposited to Everyday Checking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero annual fee and zero international exchange surcharges</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Liability Protection for 100% unauthorized transaction peace of mind</span>
                </li>
              </ul>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Apply for Platinum Card
                </button>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-5 py-3 text-slate-700 hover:text-slate-950 font-bold text-xs"
                >
                  View Rates & Fees
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-slate-100">
                <img
                  src="/src/assets/images/mobile_banking_card_1790831874747.jpg"
                  alt="Apex Platinum Rewards Card"
                  className="w-full h-72 sm:h-80 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Three Tier Feature Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Checking Tier */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-950">Everyday Checking</h4>
                <p className="text-xs text-slate-500 mt-1">Designed for daily financial flexibility</p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>• No monthly fee with qualifying direct deposit</li>
                <li>• Instant contactless debit card with Apple Pay / Google Pay</li>
                <li>• Overdraft fee grace period for accidental balances</li>
                <li>• Free access to 16,000+ nationwide ATMs</li>
              </ul>
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold text-xs"
              >
                Learn More
              </button>
            </div>

            {/* Savings Tier */}
            <div id="savings" className="p-6 rounded-3xl bg-white border-2 border-emerald-300 shadow-sm space-y-4 relative">
              <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <PiggyBank className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-950">Way2Save® High-Yield</h4>
                <p className="text-xs text-slate-500 mt-1">4.85% APY Daily Compound Interest</p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>• 12x the national savings rate average</li>
                <li>• Automatic Save As You Go® purchase roundups</li>
                <li>• Zero minimum balance maintenance fees</li>
                <li>• Full FDIC coverage up to $250,000 per depositor</li>
              </ul>
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                Open Savings Account
              </button>
            </div>

            {/* Global SWIFT Wire Tier */}
            <div id="transfers" className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-950">Global SWIFT Remittance</h4>
                <p className="text-xs text-slate-500 mt-1">Direct interbank wire settlement</p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>• Same-day execution for wires submitted by 5 PM ET</li>
                <li>• Direct routing to 180+ countries and 50+ currencies</li>
                <li>• Official electronic settlement advice receipt generated</li>
                <li>• Waived transfer fees on eligible relationship balances</li>
              </ul>
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold text-xs"
              >
                Explore International Wires
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 6. LIVE FX INTERBANK EXCHANGE RATE CALCULATOR */}
      <section id="rates" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-3 py-1 rounded-full">
                Real-Time Interbank Clearing
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mt-2">
                Live Global Wire Rate Calculator
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Calculate real-time currency conversion rates powered by Apex Central Fedwire Clearing.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Send Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min="10"
                    value={transferAmount}
                    onChange={e => setTransferAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Destination Currency</label>
                <select
                  value={selectedCountryCode}
                  onChange={e => setSelectedCountryCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                >
                  {COUNTRIES_AND_BANKS.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.country} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
              <div>
                <p className="text-slate-500">Beneficiary Receives (Estimated):</p>
                <p className="text-xl sm:text-2xl font-black text-slate-950 font-mono mt-0.5">
                  {convertedAmount} {selectedCountry.currency}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">
                  1 USD = {selectedCountry.exchangeRateToUSD} {selectedCountry.currency}
                </span>
                <span className="text-emerald-700 font-bold text-xs">Wire Fee: $0.00 (Waived)</span>
              </div>
            </div>

            <button
              onClick={() => onOpenAuth('register')}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all"
            >
              Get Started with Global Remittances
            </button>
          </div>
        </div>
      </section>

      {/* 7. INSTITUTIONAL SECURITY & ZERO LIABILITY GUARANTEE */}
      <section className="py-16 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <ShieldCheck className="w-8 h-8 text-blue-400 mx-auto" />
              <h4 className="font-bold text-sm">FDIC Insurance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct deposits backed up to $250,000 per insured category.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <Lock className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-sm">256-Bit TLS Security</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Military-grade cryptographic encryption across all transactions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <Gauge className="w-8 h-8 text-indigo-400 mx-auto" />
              <h4 className="font-bold text-sm">Real-Time Fraud Alerts</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant SMS and biometric monitoring with card freeze toggles.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <Headphones className="w-8 h-8 text-amber-400 mx-auto" />
              <h4 className="font-bold text-sm">24/7 Client Concierge</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Live dedicated banking officers available around the clock.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 8. OFFICIAL BANKING FOOTER & REGULATORY DISCLOSURES */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pb-8 border-b border-slate-800">
            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">Personal Banking</h5>
              <p className="hover:text-white cursor-pointer">Everyday Checking</p>
              <p className="hover:text-white cursor-pointer">Way2Save® Savings</p>
              <p className="hover:text-white cursor-pointer">High-Yield CDs</p>
              <p className="hover:text-white cursor-pointer">Platinum Credit Cards</p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">Lending & Mortgages</h5>
              <p className="hover:text-white cursor-pointer">Mortgage Rates</p>
              <p className="hover:text-white cursor-pointer">Home Equity Line of Credit</p>
              <p className="hover:text-white cursor-pointer">Auto Financing</p>
              <p className="hover:text-white cursor-pointer">Personal Loans</p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">Commercial & Treasury</h5>
              <p className="hover:text-white cursor-pointer">Commercial Checking</p>
              <p className="hover:text-white cursor-pointer">Fedwire Node #021000089</p>
              <p className="hover:text-white cursor-pointer">SWIFT Remittance</p>
              <p className="hover:text-white cursor-pointer">Treasury Management</p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">Security & Legal</h5>
              <p className="hover:text-white cursor-pointer">Privacy & Data Policy</p>
              <p className="hover:text-white cursor-pointer">Zero Liability Policy</p>
              <p className="hover:text-white cursor-pointer">Regulation E Disclosures</p>
              <p className="hover:text-white cursor-pointer">Security Center</p>
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">Apex Online Banking</h5>
              <p className="text-[11px] text-slate-500">
                Official depository institution. FDIC Certificate #38291.
              </p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('apex:open-support'))}
                className="mt-2 px-3 py-1.5 bg-blue-900/60 hover:bg-blue-800 text-blue-200 rounded-lg text-[10px] font-bold border border-blue-700/60 cursor-pointer"
              >
                Contact 24/7 Concierge
              </button>
            </div>
          </div>

          {/* Official Disclosures */}
          <div className="space-y-3 text-[10px] text-slate-500 leading-relaxed">
            <p>
              Deposit products offered by Apex Bank, N.A. Member FDIC. Equal Housing Lender. FICO is a registered trademark of Fair Isaac Corporation in the United States and other countries.
            </p>
            <p>
              Annual Percentage Yield (APY) of 4.85% for Way2Save® Savings is accurate as of current date and subject to change without notice. Terms and conditions apply to $300 checking welcome bonus.
            </p>
            <p className="text-slate-400">
              © {new Date().getFullYear()} Apex Bank, National Association. All rights reserved. Member Federal Reserve System.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
};
