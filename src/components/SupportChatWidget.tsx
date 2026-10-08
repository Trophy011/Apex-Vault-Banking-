import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  ShieldCheck,
  Paperclip,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  FolderOpen,
  ArrowDown,
  ArrowLeft,
  Sparkles,
  Zap,
  Clock,
  ChevronDown
} from 'lucide-react';
import { bankStore } from '../lib/bankStore.ts';
import { navHistory } from '../lib/navHistory.ts';
import { SupportChat, SupportMessage, ChatAttachment } from '../lib/types.ts';
import { processFileForChat } from '../lib/fileUtils.ts';
import { ChatAttachmentView, SharedMediaGallery } from './ChatAttachmentView.tsx';

interface SupportChatWidgetProps {
  currentUserId?: string;
  currentUserEmail?: string;
  currentUserName?: string;
  isOpenControlled?: boolean;
  onOpenControlled?: () => void;
  onCloseControlled?: () => void;
}

const QUICK_TOPICS = [
  '⚡ Check Direct Deposit Status',
  '💳 Platinum Card & Limit Inquiry',
  '🌐 Wire Transfer Confirmation',
  '🛡️ Account Security & Lock'
];

export const SupportChatWidget: React.FC<SupportChatWidgetProps> = ({
  currentUserId = 'guest-visitor',
  currentUserEmail = 'visitor@apexbank.com',
  currentUserName = 'Guest Visitor',
  isOpenControlled,
  onOpenControlled,
  onCloseControlled,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [inputMessage, setInputMessage] = useState('');
  const [chat, setChat] = useState<SupportChat | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const chatIdRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current !== null) {
      const diff = e.touches[0].clientY - touchStartY.current;
      // If pulled down by > 85px from near top of messages container, smoothly dismiss
      if (diff > 85 && (!messagesContainerRef.current || messagesContainerRef.current.scrollTop <= 5)) {
        touchStartY.current = null;
        handleSmoothClose();
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  // Sync internal state when external controlled prop changes with smooth animation
  useEffect(() => {
    if (isOpenControlled !== undefined) {
      if (isOpenControlled && !isRendered) {
        setIsRendered(true);
        setIsClosing(false);
        setInternalOpen(true);
        setUnreadCount(0);
      } else if (!isOpenControlled && isRendered && !isClosing) {
        handleSmoothClose();
      }
    }
  }, [isOpenControlled]);

  const handleOpen = () => {
    setIsRendered(true);
    setIsClosing(false);
    setInternalOpen(true);
    setUnreadCount(0);
    if (onOpenControlled) onOpenControlled();
  };

  const handleSmoothClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsRendered(false);
      setIsClosing(false);
      setInternalOpen(false);
      if (onCloseControlled) onCloseControlled();
    }, 320);
  };

  // Browser History Navigation (Allows browser Back button, mouse back, and mobile gestures to smoothly exit without getting stuck)
  useEffect(() => {
    if (isRendered && !isClosing) {
      navHistory.pushModal('support_chat', () => handleSmoothClose());
    } else {
      navHistory.closeModal('support_chat');
    }
  }, [isRendered, isClosing]);

  useEffect(() => {
    if (showMediaGallery) {
      navHistory.pushModal('support_gallery', () => setShowMediaGallery(false));
    } else {
      navHistory.closeModal('support_gallery');
    }
  }, [showMediaGallery]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRendered && !showMediaGallery) {
        handleSmoothClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRendered, showMediaGallery]);

  // Global event listener for any button across the app to open support unfailingly
  useEffect(() => {
    const handleGlobalTrigger = () => {
      handleOpen();
    };
    window.addEventListener('apex:open-support', handleGlobalTrigger);
    return () => window.removeEventListener('apex:open-support', handleGlobalTrigger);
  }, [onOpenControlled]);

  // Establish or retrieve active support chat session
  useEffect(() => {
    const activeChat = bankStore.getOrCreateChat(currentUserId, currentUserEmail, currentUserName);
    setChat(activeChat);
    chatIdRef.current = activeChat.id;
    setMessages(bankStore.getMessages(activeChat.id));
  }, [currentUserId, currentUserEmail, currentUserName]);

  // Subscribe to real-time updates from BankStore & Firestore
  useEffect(() => {
    const syncMsgs = () => {
      const activeId = chatIdRef.current;
      if (activeId) {
        const fresh = bankStore.getMessages(activeId);
        setMessages(fresh);

        // If widget is closed, check for new messages from admin
        if (!internalOpen) {
          const adminMsgs = fresh.filter(m => m.senderRole === 'admin');
          if (adminMsgs.length > 0) {
            setUnreadCount(prev => Math.min(prev + 1, 9));
          }
        }
      }
    };

    const unsubscribe = bankStore.subscribe(syncMsgs);
    return () => unsubscribe();
  }, [internalOpen]);

  // 180FPS Smooth Scroll to bottom handler
  const scrollToBottom = (smooth = true) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBottom(distanceFromBottom > 180);
  };

  useEffect(() => {
    if (isRendered && !isClosing) {
      const timer = setTimeout(() => {
        scrollToBottom(true);
      }, 70);
      return () => clearTimeout(timer);
    }
  }, [isRendered, isClosing, messages, pendingAttachments]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isRendered && !isClosing) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isRendered, isClosing]);

  // Handle file selection (Pictures or Documents)
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingFile(true);
    try {
      const newAttachments: ChatAttachment[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 15 * 1024 * 1024) {
          continue;
        }
        const processed = await processFileForChat(file);
        newAttachments.push(processed);
      }
      setPendingAttachments(prev => [...prev, ...newAttachments]);
    } catch {
      // safe fallback
    } finally {
      setIsProcessingFile(false);
      if (e.target) e.target.value = '';
    }
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputMessage.trim() && pendingAttachments.length === 0) || !chat) return;

    const userText = inputMessage.trim();
    const sentAttachments = pendingAttachments.slice();

    // Send directly to bankStore & Firestore
    bankStore.sendMessage(
      chat.id,
      currentUserId,
      'customer',
      currentUserName,
      userText,
      sentAttachments.length > 0 ? sentAttachments : undefined
    );

    setInputMessage('');
    setPendingAttachments([]);

    // Immediately refresh local state and smoothly scroll to newest message
    setMessages(bankStore.getMessages(chat.id));
    setTimeout(() => scrollToBottom(true), 40);
  };

  const handleSelectQuickTopic = (topic: string) => {
    setInputMessage(topic);
    inputRef.current?.focus();
  };

  const totalAttachments = messages.reduce((acc, m) => acc + (m.attachments?.length || 0), 0);

  return (
    <>
      {/* Hidden File Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      {/* Floating Trigger Button (Visible when closed) */}
      {!isRendered && (
        <div className="fixed bottom-20 right-3 sm:bottom-24 sm:right-6 z-[9998] pointer-events-auto gpu-accelerated">
          <button
            onClick={handleOpen}
            className="relative group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 hover:from-blue-600 hover:to-indigo-800 text-white rounded-full shadow-2xl hover:shadow-blue-900/50 border border-blue-400/40 transition-all transform hover:-translate-y-1 active:scale-95 cursor-pointer backdrop-blur-md"
            title="24/7 Client Concierge & Support Desk"
            aria-label="Open 24/7 Client Concierge Support"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
            </div>
            <div className="text-left pr-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200 leading-none">Apex Concierge</p>
              <p className="text-xs font-bold leading-tight">Live Support</p>
            </div>

            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-lg animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* COMPLETELY FULL SCREEN LIVE SUPPORT CONCIERGE TERMINAL        */}
      {/* 180FPS Smooth Slide-In / Slide-Out and Silky Scrolling         */}
      {/* ============================================================== */}
      {isRendered && (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`fixed inset-0 w-screen h-screen h-[100dvh] z-[9999] bg-slate-950 text-slate-100 flex flex-col overflow-hidden gpu-accelerated ${
            isClosing ? 'animate-slide-down-full' : 'animate-slide-up-full'
          }`}
          style={{
            willChange: 'transform, opacity',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Mobile Drag Indicator / Pull-to-Dismiss Bar */}
          <div
            onClick={handleSmoothClose}
            className="w-full flex justify-center py-1 sm:hidden cursor-pointer bg-slate-950 hover:bg-slate-900 transition-colors select-none shrink-0"
            title="Swipe or tap down to close"
          >
            <div className="w-10 h-1 rounded-full bg-slate-700 active:bg-blue-400" />
          </div>

          {/* Top Global Executive Header */}
          <header className="p-3 sm:p-4.5 bg-gradient-to-r from-slate-950 via-blue-950/90 to-slate-950 border-b border-slate-800/90 flex items-center justify-between shrink-0 shadow-lg select-none gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              {/* Prominent Back Button */}
              <button
                type="button"
                onClick={handleSmoothClose}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-700/90 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 shrink-0 group"
                title="Back to Banking (Esc or Browser Back)"
                aria-label="Back to Banking"
              >
                <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back</span>
              </button>

              <div className="relative shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-blue-600 to-indigo-600 flex items-center justify-center font-black text-sm text-white shadow-md shadow-blue-950">
                  A
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-sm sm:text-base text-white tracking-tight truncate">
                    Apex Executive Concierge
                  </h2>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-black rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live 24/7 Desk</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate mt-0.5">
                  <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">256-Bit Quantum-Encrypted Dedicated Operator Channel</span>
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Files & Docs Button */}
              <button
                type="button"
                onClick={() => setShowMediaGallery(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-blue-300 hover:text-white border border-slate-700/80 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                title="View all shared photos and documents in this chat"
              >
                <FolderOpen className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline">Pictures & Docs</span>
                <span className="px-1.5 py-0.2 bg-blue-500 text-white rounded-full text-[10px] font-extrabold">
                  {totalAttachments}
                </span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleSmoothClose}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 hover:bg-rose-950/80 text-slate-300 hover:text-rose-200 border border-slate-700/80 hover:border-rose-800/80 transition-all cursor-pointer shadow-sm active:scale-95"
                title="Close Support Desk (Esc)"
                aria-label="Close Support Desk"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Sub-Header Node Bar */}
          <div className="px-4 sm:px-6 py-2 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0 backdrop-blur-sm">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Apex Sandbox Clearing Node: <strong className="text-white font-mono">#021000089</strong></span>
            </span>
            <span className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>Response SLA: &lt; 15 seconds</span>
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Operator Online</span>
            </span>
          </div>

          {/* Centered Messages Stream (180FPS Silky Smooth Scrolling) */}
          <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col min-h-0 relative">
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto overscroll-contain touch-scroll scroll-smooth px-4 sm:px-6 py-5 space-y-4"
              style={{
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {/* Official Welcoming Banner Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-blue-950/60 border border-blue-900/40 text-center max-w-xl mx-auto shadow-inner space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-white">Apex Priority Banking Client Desk</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You are connected with verified Apex Bank central operators. You can inquire about account details, wire transfers, cards, or upload verification documents directly.
                </p>
                <div className="pt-1 flex items-center justify-center gap-2 text-[10px] text-blue-300 font-mono">
                  <span>TLS 1.3</span>
                  <span>•</span>
                  <span>AES-256-GCM</span>
                  <span>•</span>
                  <span>Direct Node Sync</span>
                </div>
              </div>

              {/* Message Bubbles */}
              {messages.map(msg => {
                const isMe = msg.senderId === currentUserId;
                const isAdmin = msg.senderRole === 'admin';

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div
                      className={`max-w-[88%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-xs sm:text-sm shadow-md transition-all ${
                        isMe
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none shadow-blue-950/50'
                          : isAdmin
                          ? 'bg-slate-900 text-slate-100 border border-slate-700/80 rounded-bl-none shadow-slate-950'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                      }`}
                    >
                      {!isMe && (
                        <div className="text-[10px] font-extrabold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-white font-bold">{msg.senderName || 'Apex Central Desk'}</span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[8px] font-black border border-blue-500/30">
                            OPERATOR
                          </span>
                        </div>
                      )}

                      {msg.content && (
                        <p className="whitespace-pre-wrap leading-relaxed select-text">{msg.content}</p>
                      )}

                      {/* Pictures and Documents Preview with High-Res Lightbox & PDF Viewer */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <ChatAttachmentView
                          attachments={msg.attachments}
                          isSenderMe={isMe}
                          theme={isMe ? 'light' : 'dark'}
                        />
                      )}

                      <div className={`flex items-center justify-end gap-1.5 text-[9px] mt-2 ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && (
                          <span className="flex items-center gap-0.5 text-emerald-300 font-bold">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Delivered</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Smooth Floating Scroll-to-Bottom Button */}
            {showScrollBottom && (
              <button
                type="button"
                onClick={() => scrollToBottom(true)}
                className="absolute bottom-4 right-4 sm:right-6 z-20 flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer border border-blue-400/40 text-xs font-bold animate-in fade-in slide-in-from-bottom-2"
                title="Scroll down to newest message"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                <span>Latest</span>
              </button>
            )}
          </div>

          {/* Bottom Message Composer Area */}
          <footer className="w-full max-w-4xl mx-auto p-3 sm:p-4 shrink-0 bg-slate-900/95 border-t border-slate-800/90 sm:rounded-t-3xl shadow-2xl space-y-2.5">
            {/* Quick Topic Inquiry Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Quick:</span>
              </span>
              {QUICK_TOPICS.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectQuickTopic(topic)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium whitespace-nowrap transition-colors border border-slate-700/60 cursor-pointer active:scale-95 shrink-0"
                >
                  {topic}
                </button>
              ))}
            </div>

            {/* Staging Area for Pending Attachments */}
            {pendingAttachments.length > 0 && (
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    Ready to send ({pendingAttachments.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setPendingAttachments([])}
                    className="text-[10px] font-bold text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {pendingAttachments.map(att => (
                    <div
                      key={att.id}
                      className="bg-slate-900 border border-slate-700 rounded-xl p-1.5 pr-2.5 flex items-center gap-2 shadow-sm text-xs"
                    >
                      {att.isImage ? (
                        <img
                          src={att.dataUrl}
                          alt={att.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-blue-900/40 text-blue-400 flex items-center justify-center font-bold">
                          <Paperclip className="w-4 h-4" />
                        </div>
                      )}
                      <div className="max-w-[130px]">
                        <p className="font-medium text-[11px] text-white truncate" title={att.name}>
                          {att.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePendingAttachment(att.id)}
                        className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input & Action Bar */}
            <div className="flex items-center gap-2">
              {/* Quick Attach Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isProcessingFile}
                  className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-xs transition-all cursor-pointer border border-slate-700 active:scale-95 disabled:opacity-50"
                  title="Send picture (Photo / ID / Check)"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingFile}
                  className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer border border-slate-700 active:scale-95 disabled:opacity-50"
                  title="Send document (PDF / Word / Statement)"
                >
                  <Paperclip className="w-4 h-4" />
                  <span className="hidden sm:inline">Doc</span>
                </button>
              </div>

              {/* Message input */}
              <form onSubmit={handleSend} className="flex-1 flex items-center gap-2 min-w-0">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={pendingAttachments.length > 0 ? "Add note or press Send..." : "Type your message to Apex Management Desk..."}
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  className="flex-1 min-w-0 px-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all font-medium"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() && pendingAttachments.length === 0}
                  className="p-2.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl shadow-lg shadow-blue-900/40 transition-all cursor-pointer shrink-0 active:scale-95 font-bold"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </footer>
        </div>
      )}

      {/* Shared Media & Documents Gallery Drawer */}
      <SharedMediaGallery
        messages={messages}
        isOpen={showMediaGallery}
        onClose={() => setShowMediaGallery(false)}
        title="My Support Files & Documents"
      />
    </>
  );
};
