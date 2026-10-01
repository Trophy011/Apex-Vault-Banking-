import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  ShieldCheck,
  User,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Loader2
} from 'lucide-react';
import { bankStore } from '../lib/bankStore.ts';
import { SupportChat, SupportMessage, ChatAttachment } from '../lib/types.ts';
import { processFileForChat, formatFileSize } from '../lib/fileUtils.ts';
import { ChatAttachmentView } from './ChatAttachmentView.tsx';

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
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setInternalOpen(true);
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
      if (onOpenControlled) onOpenControlled();
    };
    window.addEventListener('apex:open-support', handleGlobalTrigger);
    return () => window.removeEventListener('apex:open-support', handleGlobalTrigger);
  }, [onOpenControlled]);

  useEffect(() => {
    if (isOpen) {
      const activeChat = bankStore.getOrCreateChat(currentUserId, currentUserEmail, currentUserName);
      setChat(activeChat);
      setMessages(bankStore.getMessages(activeChat.id));
    }
  }, [isOpen, currentUserId, currentUserEmail, currentUserName]);

  useEffect(() => {
    const unsubscribe = bankStore.subscribe(() => {
      if (chat) {
        setMessages(bankStore.getMessages(chat.id));
      }
    });
    return () => unsubscribe();
  }, [chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingAttachments, isTyping]);

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

    // Trigger typing indicator for responsive feel
    setTimeout(() => {
      setIsTyping(true);
    }, 400);

    // Contextual automated concierge reply
    setTimeout(() => {
      setIsTyping(false);

      let replyContent = '';
      const lower = userText.toLowerCase();

      if (sentAttachments.length > 0) {
        const hasImg = sentAttachments.some(a => a.isImage);
        const refId = `DOC-${Math.floor(100000 + Math.random() * 900000)}`;
        replyContent = `Thank you. We have securely archived your ${hasImg ? 'picture' : 'document'} into our encrypted verification vault under Ticket #${refId}. A senior compliance officer is reviewing it for your account records.`;
      } else if (lower.includes('wire') || lower.includes('transfer') || lower.includes('send') || lower.includes('swift')) {
        replyContent = `Apex supports real-time domestic Fedwire and global international SWIFT wire transfers under Federal Reserve Node #021000089. An official electronic funds settlement advice receipt is generated upon confirmation.`;
      } else if (lower.includes('balance') || lower.includes('limit') || lower.includes('funds') || lower.includes('vault')) {
        replyContent = `All Apex client balances and transaction liquidity are backed 1:1 by our Central Vault Reserve ($10,000,000,000.00 USD). Transactions settle without third-party delay.`;
      } else if (lower.includes('lock') || lower.includes('restrict') || lower.includes('pin') || lower.includes('password')) {
        replyContent = `Your security is our priority. If you need transaction PIN assistance or account status review, our executive operator desk can authorize compliance adjustments directly.`;
      } else {
        replyContent = `Hello ${currentUserName}. Your request has been acknowledged by Apex Client Concierge. An executive officer on the management desk is monitoring this encrypted channel.`;
      }

      bankStore.sendMessage(
        chat.id,
        'apex-support-desk',
        'admin',
        'Apex Client Concierge',
        replyContent
      );
    }, 1500);
  };

  return (
    <div className={`fixed z-[9999] pointer-events-auto transition-all duration-300 ${
      isOpen
        ? 'bottom-3 right-3 sm:bottom-6 sm:right-6 max-w-[calc(100vw-1.5rem)]'
        : 'bottom-20 right-3 sm:bottom-24 sm:right-6 max-w-[calc(100vw-1.5rem)]'
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

      {/* Floating launcher button */}
      {!isOpen && (
        <button
          type="button"
          id="apex-support-launcher"
          aria-label="Open 24/7 Priority Support Chat"
          onClick={handleOpen}
          className="group flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-full shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer border-2 border-white/20"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-900 animate-pulse" />
          </div>
          <div className="text-left hidden xs:block sm:block">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-blue-200">24/7 Priority Support</p>
            <p className="text-xs sm:text-sm font-extrabold">Chat with Concierge</p>
          </div>
          <span className="sm:hidden font-extrabold text-xs">Support</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-1.5rem)] sm:w-[420px] max-h-[85vh] h-[520px] sm:h-[580px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-4 text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-700/50 border border-blue-400/30 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
                  Apex Client Concierge
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-xs text-blue-200">Encrypted Management Channel</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Privacy badge */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 text-[11px] text-slate-500 flex items-center justify-between gap-1.5 shrink-0">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Bank-grade 256-bit encryption. Safe document sharing active.</span>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60">
            {messages.map(msg => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : msg.senderRole === 'admin'
                        ? 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                        : 'bg-indigo-50 border border-indigo-100 text-indigo-950 rounded-bl-none'
                    }`}
                  >
                    {!isMe && (
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                        {msg.senderRole === 'admin' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {msg.senderName}
                      </p>
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

                    <p className={`text-[10px] mt-1.5 text-right ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Concierge Typing Animation Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="bg-white border border-slate-200/90 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-xs flex items-center gap-2.5 text-xs text-slate-600">
                  <Bot className="w-4 h-4 text-blue-600 animate-pulse shrink-0" />
                  <span className="font-semibold text-slate-700">Apex Concierge is typing</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Staging Area for Pending Pictures / Documents before sending */}
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
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                    <div className="max-w-[120px]">
                      <p className="font-medium text-[11px] text-slate-800 truncate" title={att.name}>
                        {att.name}
                      </p>
                      <p className="text-[9px] text-slate-400">{formatFileSize(att.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePendingAttachment(att.id)}
                      className="p-1 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading indicator during image/doc processing */}
          {isProcessingFile && (
            <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 flex items-center gap-2 text-xs text-blue-700">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Processing picture/document attachment...</span>
            </div>
          )}

          {/* Input & Upload Controls - Boldly Visible */}
          <div className="p-3 bg-white border-t border-slate-200 flex flex-col gap-2 shrink-0">
            {/* Bold Attachment Action Bar */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Bold Photo / Picture Button */}
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-400/80 text-blue-900 font-bold text-xs transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
                  title="Attach picture (PNG, JPG, WEBP)"
                >
                  <div className="w-5 h-5 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="font-extrabold tracking-wide">Attach Picture</span>
                </button>

                {/* Bold Document Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-400/80 text-indigo-900 font-bold text-xs transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
                  title="Attach document (PDF, Word, TXT, Excel)"
                >
                  <div className="w-5 h-5 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <Paperclip className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="font-extrabold tracking-wide">Attach Document</span>
                </button>
              </div>

              {pendingAttachments.length > 0 && (
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {pendingAttachments.length} ready
                </span>
              )}
            </div>

            {/* Input & Bold Send Button */}
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder={pendingAttachments.length > 0 ? "Add a message or click Send..." : "Type your message to concierge..."}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white rounded-xl text-sm border-2 border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 font-medium"
              />

              {/* Bold Send Button */}
              <button
                type="submit"
                disabled={!inputMessage.trim() && pendingAttachments.length === 0}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-40 disabled:pointer-events-none text-white font-extrabold rounded-xl transition-all shadow-lg shadow-blue-600/30 cursor-pointer active:scale-95 shrink-0"
                title="Send message"
              >
                <span className="text-xs uppercase tracking-wider font-extrabold">Send</span>
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
