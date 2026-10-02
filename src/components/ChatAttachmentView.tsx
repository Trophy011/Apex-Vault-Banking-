import React, { useState, useEffect } from 'react';
import {
  Download,
  FileText,
  Image as ImageIcon,
  Eye,
  X,
  Check,
  FileSpreadsheet,
  FileCode,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Copy,
  CheckCheck,
  Table,
  FolderOpen,
  Filter,
  User,
  ShieldCheck
} from 'lucide-react';
import { ChatAttachment, SupportMessage } from '../lib/types.ts';
import { formatFileSize, saveFileToDevice, createBlobUrlFromDataUrl } from '../lib/fileUtils.ts';

interface ChatAttachmentViewProps {
  attachments: ChatAttachment[];
  isSenderMe?: boolean;
  theme?: 'light' | 'dark';
}

// Helper to determine document icon
export const getDocIcon = (type: string, name: string) => {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (type.includes('spreadsheet') || ['csv', 'xlsx', 'xls'].includes(ext)) {
    return <FileSpreadsheet className="w-5 h-5 text-emerald-500 shrink-0" />;
  }
  if (['json', 'xml', 'html', 'js', 'ts', 'sql', 'css', 'env'].includes(ext)) {
    return <FileCode className="w-5 h-5 text-amber-500 shrink-0" />;
  }
  if (type.includes('pdf') || ext === 'pdf') {
    return <FileText className="w-5 h-5 text-rose-500 shrink-0" />;
  }
  return <FileText className="w-5 h-5 text-blue-500 shrink-0" />;
};

// Helper to decode text content if base64 text/plain, json, csv, etc.
export const getTextContent = (dataUrl: string, name = ''): string | null => {
  try {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    const isTextFile =
      dataUrl.includes('text/') ||
      dataUrl.includes('json') ||
      dataUrl.includes('csv') ||
      dataUrl.includes('xml') ||
      ['txt', 'csv', 'json', 'log', 'md', 'xml', 'html', 'sql', 'env'].includes(ext);

    if (isTextFile && dataUrl.includes(',')) {
      const base64Part = dataUrl.split(',')[1];
      if (base64Part) {
        return decodeURIComponent(escape(atob(base64Part)));
      }
    }
  } catch {
    try {
      const base64Part = dataUrl.split(',')[1];
      if (base64Part) return atob(base64Part);
    } catch {
      return null;
    }
  }
  return null;
};

// Parse CSV text into 2D array for interactive spreadsheet table view
function parseCsv(text: string): string[][] {
  const lines = text.trim().split(/\r?\n/);
  return lines.map(line => {
    // Basic comma separated parsing handling quotes
    const row: string[] = [];
    let insideQuotes = false;
    let currentCell = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        row.push(currentCell.trim());
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    row.push(currentCell.trim());
    return row;
  });
}

// ==============================================================
// 1. HIGH-RESOLUTION PICTURE VIEWER LIGHTBOX MODAL
// ==============================================================
export const ImagePreviewModal: React.FC<{
  attachment: ChatAttachment | null;
  onClose: () => void;
}> = ({ attachment, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setIsSaved(false);
  }, [attachment]);

  if (!attachment) return null;

  const handleDownload = () => {
    saveFileToDevice(attachment);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleRotate = () => {
    setRotation(r => (r + 90) % 360);
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Action Bar */}
      <div
        className="w-full flex items-center justify-between text-white px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/90 shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md md:max-w-lg" title={attachment.name}>
              {attachment.name}
            </h4>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>Picture</span>
              <span>•</span>
              <span>{formatFileSize(attachment.size)}</span>
              {rotation > 0 && <span className="text-blue-400 font-mono">({rotation}°)</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-800/90 rounded-xl p-1 border border-slate-700">
            <button
              type="button"
              onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold px-1.5 text-blue-300 min-w-[42px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom(z => Math.min(3, z + 0.25))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Rotate Button (Super helpful for photos of ID cards and documents taken sideways) */}
          <button
            type="button"
            onClick={handleRotate}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
            title="Rotate 90 degrees"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Reset Zoom */}
          {zoom !== 1 && (
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="hidden sm:inline-block px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700 cursor-pointer"
            >
              Reset
            </button>
          )}

          {/* Save / Download */}
          <button
            type="button"
            onClick={handleDownload}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/20'
            }`}
            title="Save picture to device"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save to Device'}</span>
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-400 hover:border-rose-700 transition-colors border border-slate-700 cursor-pointer ml-1"
            title="Close image viewer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Picture Canvas Area */}
      <div
        className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto select-none"
        onClick={e => e.stopPropagation()}
      >
        <div
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center center'
          }}
        >
          <img
            src={attachment.dataUrl}
            alt={attachment.name}
            className="max-w-[90vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-slate-800/80 bg-slate-900"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

// ==============================================================
// 2. COMPREHENSIVE DOCUMENT VIEWER MODAL (PDF, CSV, TXT, JSON, DOCS)
// ==============================================================
export const DocumentPreviewModal: React.FC<{
  attachment: ChatAttachment | null;
  onClose: () => void;
}> = ({ attachment, onClose }) => {
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (attachment) {
      const url = createBlobUrlFromDataUrl(attachment.dataUrl);
      setBlobUrl(url);
      setIsSaved(false);
      setCopiedText(false);
    }
  }, [attachment]);

  if (!attachment) return null;

  const isPdf =
    attachment.type.includes('pdf') ||
    attachment.name.toLowerCase().endsWith('.pdf');

  const textContent = getTextContent(attachment.dataUrl, attachment.name);
  const isCsv =
    attachment.name.toLowerCase().endsWith('.csv') ||
    attachment.type.includes('csv');

  const csvRows = isCsv && textContent ? parseCsv(textContent) : null;

  const handleDownload = () => {
    saveFileToDevice(attachment);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleCopyText = () => {
    if (textContent) {
      navigator.clipboard.writeText(textContent);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Document Top Bar */}
      <div
        className="w-full flex items-center justify-between text-white px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/90 shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
            {getDocIcon(attachment.type, attachment.name)}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md md:max-w-lg" title={attachment.name}>
              {attachment.name}
            </h4>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span className="uppercase font-semibold text-blue-400">
                {attachment.name.split('.').pop() || 'Document'}
              </span>
              <span>•</span>
              <span>{formatFileSize(attachment.size)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Copy Text Button (if text document) */}
          {textContent && (
            <button
              type="button"
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
              title="Copy text contents to clipboard"
            >
              {copiedText ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedText ? 'Copied' : 'Copy Text'}</span>
            </button>
          )}

          {/* Download / Save */}
          <button
            type="button"
            onClick={handleDownload}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/20'
            }`}
            title="Download document to device"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save to Device'}</span>
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-400 hover:border-rose-700 transition-colors border border-slate-700 cursor-pointer ml-1"
            title="Close document viewer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Document View Canvas */}
      <div
        className="flex-1 w-full p-3 sm:p-6 overflow-hidden flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        {isPdf ? (
          <div className="w-full h-full max-w-6xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            <object
              data={blobUrl}
              type="application/pdf"
              className="w-full h-full rounded-2xl"
            >
              {/* Fallback if object is blocked by browser */}
              <iframe
                src={blobUrl}
                title={attachment.name}
                className="w-full h-full border-none"
              />
            </object>
          </div>
        ) : csvRows && csvRows.length > 0 ? (
          /* CSV Spreadsheet Table View */
          <div className="w-full h-full max-w-6xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
            <div className="p-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Table className="w-4 h-4" />
                <span>Spreadsheet Table Preview ({csvRows.length} rows)</span>
              </span>
              <span className="text-[11px] text-slate-400">Comma Separated Values</span>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/80 text-white font-bold">
                    {csvRows[0].map((cell, idx) => (
                      <th key={idx} className="p-2.5 border-r border-slate-700/60 font-semibold truncate">
                        {cell || `Col ${idx + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {csvRows.slice(1).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/50 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-2.5 border-r border-slate-800/60 text-slate-300 font-mono text-[11px]">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : textContent ? (
          /* Text, Code, JSON, Log, HTML File View */
          <div className="w-full h-full max-w-5xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
            <div className="p-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-mono text-blue-400">
                <FileCode className="w-4 h-4" />
                <span>Document Contents ({textContent.length} characters)</span>
              </span>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
              >
                {copiedText ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 sm:p-6 font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed select-text bg-slate-950">
              {textContent}
            </div>
          </div>
        ) : (
          /* Other formats (Word, Excel, Zip, Binary) */
          <div className="max-w-md w-full bg-slate-900 rounded-2xl p-8 text-center space-y-4 shadow-2xl border border-slate-800 text-white">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
              {getDocIcon(attachment.type, attachment.name)}
            </div>
            <div>
              <h3 className="text-base font-bold">{attachment.name}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {formatFileSize(attachment.size)} • {attachment.type || 'Document'}
              </p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This document has been verified by the bank encryption engine and is ready for download to your device.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save to Device</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==============================================================
// 3. INLINE ATTACHMENT VIEW (Rendered inside chat bubbles)
// ==============================================================
export const ChatAttachmentView: React.FC<ChatAttachmentViewProps> = ({
  attachments,
  isSenderMe = false,
  theme = 'light',
}) => {
  const [activeImage, setActiveImage] = useState<ChatAttachment | null>(null);
  const [activeDoc, setActiveDoc] = useState<ChatAttachment | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());

  const isDark = theme === 'dark';

  const handleDownload = (att: ChatAttachment, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    saveFileToDevice(att);
    setDownloadedIds(prev => new Set(prev).add(att.id));
    setTimeout(() => {
      setDownloadedIds(prev => {
        const next = new Set(prev);
        next.delete(att.id);
        return next;
      });
    }, 2500);
  };

  if (!attachments || attachments.length === 0) return null;

  return (
    <>
      <div className="mt-2 space-y-2">
        {attachments.map(att => {
          const isDownloaded = downloadedIds.has(att.id);

          if (att.isImage) {
            return (
              <div
                key={att.id}
                className={`relative group rounded-xl overflow-hidden border transition-all ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/90 hover:border-slate-500'
                    : isSenderMe
                    ? 'border-blue-400/40 bg-blue-700/40 hover:border-blue-300/60'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Image thumbnail clickable */}
                <div
                  className="cursor-pointer relative overflow-hidden max-h-56 bg-slate-950/20 flex items-center justify-center group"
                  onClick={() => setActiveImage(att)}
                  title="Click to view picture in full resolution"
                >
                  <img
                    src={att.dataUrl}
                    alt={att.name}
                    className="w-full h-auto max-h-56 object-cover group-hover:scale-[1.02] transition-transform duration-200"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-black/80 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg border border-white/20">
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>View Full Picture</span>
                    </span>
                  </div>
                </div>

                {/* Info Bar */}
                <div
                  className={`p-2 sm:p-2.5 flex items-center justify-between gap-2 text-xs ${
                    isDark
                      ? 'bg-slate-900 text-slate-300 border-t border-slate-800'
                      : isSenderMe
                      ? 'bg-blue-800/80 text-blue-100 border-t border-blue-500/30'
                      : 'bg-slate-50 text-slate-700 border-t border-slate-100'
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-1.5 flex-1">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate font-semibold text-[11px]" title={att.name}>
                      {att.name}
                    </span>
                    <span className="text-[10px] opacity-70 shrink-0">({formatFileSize(att.size)})</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveImage(att)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700'
                          : 'bg-white hover:bg-slate-100 text-blue-600 border border-slate-200'
                      }`}
                      title="View picture in high-resolution viewer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={e => handleDownload(att, e)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm ${
                        isDownloaded
                          ? 'bg-emerald-600 text-white'
                          : isDark
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : isSenderMe
                          ? 'bg-white text-blue-700 hover:bg-blue-50'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      title="Save picture to device"
                    >
                      {isDownloaded ? <Check className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                      <span>{isDownloaded ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          // Document Card (PDF, Docs, Sheets, Text, etc.)
          return (
            <div
              key={att.id}
              className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                isDark
                  ? 'border-slate-700/80 bg-slate-900/90 hover:bg-slate-850 hover:border-slate-600 text-slate-200'
                  : isSenderMe
                  ? 'border-blue-400/40 bg-blue-700/60 text-white'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-sm'
              }`}
            >
              <div
                className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                onClick={() => setActiveDoc(att)}
                title="Click to view document"
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isDark ? 'bg-slate-800 border border-slate-700' : isSenderMe ? 'bg-blue-800/80' : 'bg-slate-100'
                  }`}
                >
                  {getDocIcon(att.type, att.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate leading-snug hover:underline" title={att.name}>
                    {att.name}
                  </p>
                  <p
                    className={`text-[10px] ${
                      isDark ? 'text-slate-400' : isSenderMe ? 'text-blue-200' : 'text-slate-500'
                    }`}
                  >
                    Document • {formatFileSize(att.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveDoc(att)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700'
                      : isSenderMe
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-blue-700'
                  }`}
                  title="View document"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  type="button"
                  onClick={e => handleDownload(att, e)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm ${
                    isDownloaded
                      ? 'bg-emerald-600 text-white'
                      : isDark
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : isSenderMe
                      ? 'bg-white text-blue-700 hover:bg-blue-50'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  title="Save document to device"
                >
                  {isDownloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{isDownloaded ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox / Modals */}
      <ImagePreviewModal attachment={activeImage} onClose={() => setActiveImage(null)} />
      <DocumentPreviewModal attachment={activeDoc} onClose={() => setActiveDoc(null)} />
    </>
  );
};

// ==============================================================
// 4. SHARED MEDIA & DOCUMENTS GALLERY DRAWER / PANEL
// ==============================================================
export interface SharedAttachmentItem extends ChatAttachment {
  senderName: string;
  senderRole: 'customer' | 'admin' | 'system';
  createdAt: string;
}

export const SharedMediaGallery: React.FC<{
  messages: SupportMessage[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}> = ({ messages, isOpen, onClose, title = 'Shared Pictures & Documents' }) => {
  const [filter, setFilter] = useState<'all' | 'images' | 'docs'>('all');
  const [selectedImage, setSelectedImage] = useState<ChatAttachment | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<ChatAttachment | null>(null);

  if (!isOpen) return null;

  // Extract all attachments from the conversation messages
  const allItems: SharedAttachmentItem[] = [];
  messages.forEach(msg => {
    if (msg.attachments && msg.attachments.length > 0) {
      msg.attachments.forEach(att => {
        allItems.push({
          ...att,
          senderName: msg.senderName || (msg.senderRole === 'admin' ? 'Bank Management' : 'Customer'),
          senderRole: msg.senderRole,
          createdAt: msg.createdAt,
        });
      });
    }
  });

  // Reverse so newest appears first
  allItems.reverse();

  const filteredItems = allItems.filter(item => {
    if (filter === 'images') return item.isImage;
    if (filter === 'docs') return !item.isImage;
    return true;
  });

  const photoCount = allItems.filter(i => i.isImage).length;
  const docCount = allItems.filter(i => !i.isImage).length;

  return (
    <>
      <div className="fixed inset-0 z-[50000] bg-black/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
        <div className="w-full sm:w-[480px] h-full bg-slate-900 border-l border-slate-800 text-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">{title}</h3>
                <p className="text-xs text-slate-400">Total {allItems.length} files in this conversation</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close gallery"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-2.5 bg-slate-850 border-b border-slate-800 flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All ({allItems.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('images')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filter === 'images'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photos ({photoCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('docs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filter === 'docs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Documents ({docCount})</span>
            </button>
          </div>

          {/* File Items List / Grid */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 px-4 text-slate-500">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
                <p className="text-sm font-semibold text-slate-400">No {filter === 'all' ? 'files' : filter} uploaded yet</p>
                <p className="text-xs text-slate-500 mt-1">Shared pictures and documents will appear here for instant inspection.</p>
              </div>
            ) : (
              filteredItems.map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-between gap-3 group"
                >
                  <div
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    onClick={() => (item.isImage ? setSelectedImage(item) : setSelectedDoc(item))}
                  >
                    {item.isImage ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                        <img src={item.dataUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                        {getDocIcon(item.type, item.name)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors" title={item.name}>
                        {item.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                        <span>{formatFileSize(item.size)}</span>
                        <span>•</span>
                        <span className={`font-semibold ${item.senderRole === 'admin' ? 'text-blue-400' : 'text-emerald-400'}`}>
                          {item.senderName}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 mt-0.5">
                        {new Date(item.createdAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => (item.isImage ? setSelectedImage(item) : setSelectedDoc(item))}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-blue-400 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                      title="Inspect / View full file"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => saveFileToDevice(item)}
                      className="p-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-sm"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Global Modals for Gallery clicks */}
      <ImagePreviewModal attachment={selectedImage} onClose={() => setSelectedImage(null)} />
      <DocumentPreviewModal attachment={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </>
  );
};
