import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  ShieldCheck,
  User,
  Paperclip,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  Maximize2,
  Minimize2,
  FolderOpen
} from 'lucide-react';
import { bankStore } from '../lib/bankStore.ts';
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

export const SupportChatWidget: React.FC<SupportChatWidgetProps> = ({
  currentUserId = 'guest-visitor',
  currentUserEmail = 'visitor@apexbank.com',
  currentUserName = 'Guest Visitor',
  isOpenControlled,
  onOpenControlled,
  onCloseControlled,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  // Sync internal state when external controlled prop changes
  useEffect(() => {
    if (isOpenControlled !== undefined) {
      setInternalOpen(isOpenControlled);
    }
  }, [isOpenControlled]);

  const isOpen = internalOpen;

  const [inputMessage, setInputMessage] = useState('');
  const [chat, setChat] = useState<SupportChat | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [showMediaGallery, setShowMediaGallery] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const chatIdRef = useRef<string | null>(null);

  const handleOpen = () => {
    setInternalOpen(true);
    setUnreadCount(0);
    if (onOpenControlled) onOpenControlled();
  };

  const handleClose = () => {
    setInternalOpen(false);
    if (onCloseControlled) onCloseControlled();
  };

  // Global event listener for any button across the app to open support unfailingly
  useEffect(() => {
    const handleGlobalTrigger = () => {
      setInternalOpen(true);
      setUnreadCount(0);
      if (onOpenControlled) onOpenControlled();
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
        if (!isOpen) {
          const adminMsgs = fresh.filter(m => m.senderRole === 'admin');
          if (adminMsgs.length > 0) {
            setUnreadCount(prev => Math.min(prev + 1, 9));
          }
        }
      }
    };

    const unsubscribe = bankStore.subscribe(syncMsgs);
    return () => unsubscribe();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, pendingAttachments]);

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
          alert(`File "${file.name}" is larger than 15MB. Please choose a smaller file.`);
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

    // Immediately refresh local state
    setMessages(bankStore.getMessages(chat.id));
  };

  return (
    <div className={`fixed z-[9999] pointer-events-auto transition-all duration-300 ${
      !isOpen
        ? 'bottom-20 right-3 sm:bottom-24 sm:right-6 max-w-[calc(100vw-1.5rem)]'
        : isFullScreen
        ? 'inset-0 w-full h-full'
        : 'bottom-3 right-3 sm:bottom-6 sm:right-6 max-w-[calc(100vw-1.5rem)]'
    }`}>
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

      {/* Floating Trigger Button (when closed) */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="relative group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 hover:from-blue-600 hover:to-indigo-800 text-white rounded-full shadow-2xl hover:shadow-blue-900/40 border border-blue-400/30 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer backdrop-blur-md"
          title="24/7 Client Concierge & Support Desk"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse" />
          </div>
          <div className="text-left pr-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200 leading-none">Apex Concierge</p>
            <p className="text-xs font-bold leading-tight">Live Support</p>
          </div>

          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-md animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window Panel (when open) */}
      {isOpen && (
        <div className={`bg-white shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in duration-300 ${
          isFullScreen
            ? 'w-full h-full rounded-none'
            : 'w-[360px] sm:w-[440px] h-[560px] sm:h-[620px] rounded-3xl slide-in-from-bottom-4'
        }`}>
          
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-blue-600 flex items-center justify-center font-black text-sm text-white shadow-md">
                  A
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white tracking-tight">Apex Support Desk</h3>
                  <span className="px-1.5 py-0.5 bg-blue-500/30 text-blue-300 border border-blue-400/40 text-[9px] font-extrabold rounded uppercase">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-emerald-400" />
                  <span>256-Bit Encrypted Operator Channel</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* View Shared Files & Docs Button */}
              <button
                type="button"
                onClick={() => setShowMediaGallery(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer mr-1"
                title="View all shared photos and documents in this chat"
              >
                <FolderOpen className="w-4 h-4 text-blue-300" />
                <span className="hidden sm:inline">Files</span>
                {messages.some(m => m.attachments && m.attachments.length > 0) && (
                  <span className="px-1.5 py-0.2 bg-blue-500/40 text-blue-200 rounded-full text-[10px] font-bold">
                    {messages.reduce((acc, m) => acc + (m.attachments?.length || 0), 0)}
                  </span>
                )}
              </button>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={isFullScreen ? "Exit Full Screen" : "Full Screen Support"}
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Minimize chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub-Header Notice */}
          <div className="px-4 py-1.5 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between text-[11px] text-blue-900">
            <span className="flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Direct Bank Management Terminal</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Node #021000089</span>
          </div>

          {/* Messages stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70">
            {messages.map(msg => {
              const isMe = msg.senderId === currentUserId;
              const isAdmin = msg.senderRole === 'admin';

              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-sm ${
                      isMe
                        ? 'bg-blue-700 text-white rounded-br-none'
                        : isAdmin
                        ? 'bg-white border-2 border-blue-200/90 text-slate-900 rounded-bl-none shadow-md'
                        : 'bg-indigo-50 border border-indigo-100 text-indigo-950 rounded-bl-none'
                    }`}
                  >
                    {!isMe && (
                      <div className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-slate-900">{msg.senderName || 'Apex Central Desk'}</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[8px] font-black">
                          OPERATOR
                        </span>
                      </div>
                    )}

                    {msg.content && (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    )}

                    {/* Pictures and Documents View with Save to Device */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <ChatAttachmentView
                        attachments={msg.attachments}
                        isSenderMe={isMe}
                        theme="light"
                      />
                    )}

                    <div className={`flex items-center justify-end gap-1 text-[9px] mt-1.5 ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
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

            <div ref={messagesEndRef} />
          </div>

          {/* Staging Area for Pending Attachments */}
          {pendingAttachments.length > 0 && (
            <div className="p-3 bg-slate-100 border-t border-slate-200 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  Ready to send ({pendingAttachments.length})
                </span>
                <button
                  type="button"
                  onClick={() => setPendingAttachments([])}
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
                {pendingAttachments.map(att => (
                  <div
                    key={att.id}
                    className="relative group bg-white border border-slate-200 rounded-xl p-1.5 pr-2.5 flex items-center gap-2 shadow-sm text-xs"
                  >
                    {att.isImage ? (
                      <img
                        src={att.dataUrl}
                        alt={att.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                        <Paperclip className="w-4 h-4" />
                      </div>
                    )}
                    <div className="max-w-[130px]">
                      <p className="font-medium text-[11px] text-slate-800 truncate" title={att.name}>
                        {att.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePendingAttachment(att.id)}
                      className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input & Action Footer */}
          <div className="p-3 bg-white border-t border-slate-200/90 shrink-0 space-y-2">
            
            {/* Quick Upload Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={isProcessingFile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition-colors cursor-pointer"
                title="Send picture"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photo</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingFile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                title="Send document"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Document</span>
              </button>
            </div>

            {/* Message input */}
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={pendingAttachments.length > 0 ? "Add a message or press Send..." : "Type your message to Apex Management Desk..."}
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-100/90 focus:bg-white border border-slate-200 focus:border-blue-600 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all font-medium"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() && pendingAttachments.length === 0}
                className="p-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl shadow-md transition-all cursor-pointer shrink-0 active:scale-95"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Shared Media & Documents Gallery Drawer */}
      <SharedMediaGallery
        messages={messages}
        isOpen={showMediaGallery}
        onClose={() => setShowMediaGallery(false)}
        title="My Support Files & Documents"
      />
    </div>
  );
};
