import React, { useState } from 'react';
import { Download, FileText, Image as ImageIcon, Eye, X, Check, FileSpreadsheet, FileCode } from 'lucide-react';
import { ChatAttachment } from '../lib/types.ts';
import { formatFileSize, saveFileToDevice } from '../lib/fileUtils.ts';

interface ChatAttachmentViewProps {
  attachments: ChatAttachment[];
  isSenderMe?: boolean;
  theme?: 'light' | 'dark';
}

export const ChatAttachmentView: React.FC<ChatAttachmentViewProps> = ({
  attachments,
  isSenderMe = false,
  theme = 'light',
}) => {
  const [activePreview, setActivePreview] = useState<ChatAttachment | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());

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

  const getDocIcon = (type: string, name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (type.includes('spreadsheet') || ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-500 shrink-0" />;
    }
    if (ext === 'json' || ext === 'xml' || ext === 'html' || ext === 'js' || ext === 'ts') {
      return <FileCode className="w-5 h-5 text-amber-500 shrink-0" />;
    }
    return <FileText className="w-5 h-5 text-blue-500 shrink-0" />;
  };

  if (!attachments || attachments.length === 0) return null;

  const isDark = theme === 'dark';

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
                    ? 'border-slate-700 bg-slate-900/80 hover:border-slate-600'
                    : isSenderMe
                    ? 'border-blue-400/40 bg-blue-700/40 hover:border-blue-300/60'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Image thumbnail */}
                <div
                  className="cursor-pointer relative overflow-hidden max-h-56 bg-slate-950/20 flex items-center justify-center"
                  onClick={() => setActivePreview(att)}
                >
                  <img
                    src={att.dataUrl}
                    alt={att.name}
                    className="w-full h-auto max-h-56 object-cover hover:scale-[1.02] transition-transform duration-200"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px] font-medium flex items-center gap-1 backdrop-blur-sm shadow-md">
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </span>
                  </div>
                </div>

                {/* Footer bar with Save to Device */}
                <div className={`p-2 flex items-center justify-between gap-2 text-xs ${
                  isDark
                    ? 'bg-slate-900 text-slate-300 border-t border-slate-800'
                    : isSenderMe
                    ? 'bg-blue-800/80 text-blue-100 border-t border-blue-500/30'
                    : 'bg-slate-50 text-slate-700 border-t border-slate-100'
                }`}>
                  <div className="min-w-0 flex items-center gap-1.5 flex-1">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate font-medium text-[11px]" title={att.name}>
                      {att.name}
                    </span>
                    <span className="text-[10px] opacity-70 shrink-0">({formatFileSize(att.size)})</span>
                  </div>

                  <button
                    onClick={(e) => handleDownload(att, e)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-sm ${
                      isDownloaded
                        ? 'bg-emerald-600 text-white'
                        : isDark
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : isSenderMe
                        ? 'bg-white text-blue-700 hover:bg-blue-50'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    title="Save picture to your device storage"
                  >
                    {isDownloaded ? (
                      <>
                        <Check className="w-3 h-3" /> Saved
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3" /> Save to Device
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          }

          // Document Card
          return (
            <div
              key={att.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                isDark
                  ? 'border-slate-700 bg-slate-900 hover:bg-slate-850 text-slate-200'
                  : isSenderMe
                  ? 'border-blue-400/40 bg-blue-700/60 text-white'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className={`p-2 rounded-lg shrink-0 ${
                  isDark ? 'bg-slate-800' : isSenderMe ? 'bg-blue-800/80' : 'bg-slate-100'
                }`}>
                  {getDocIcon(att.type, att.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate leading-snug" title={att.name}>
                    {att.name}
                  </p>
                  <p className={`text-[10px] ${
                    isDark ? 'text-slate-400' : isSenderMe ? 'text-blue-200' : 'text-slate-500'
                  }`}>
                    Document • {formatFileSize(att.size)}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => handleDownload(att, e)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm ${
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
                {isDownloaded ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Saved
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" /> Save
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* High-Resolution Picture Lightbox Modal */}
      {activePreview && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActivePreview(null)}
        >
          {/* Top toolbar */}
          <div
            className="w-full max-w-4xl flex items-center justify-between text-white pb-3 border-b border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 min-w-0">
              <ImageIcon className="w-5 h-5 text-blue-400 shrink-0" />
              <div className="min-w-0">
                <h4 className="text-sm font-bold truncate">{activePreview.name}</h4>
                <p className="text-xs text-slate-400">{formatFileSize(activePreview.size)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleDownload(activePreview, e)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" /> Save Picture to Device
              </button>
              <button
                onClick={() => setActivePreview(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Image */}
          <div
            className="flex-1 flex items-center justify-center p-4 max-w-4xl max-h-[82vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={activePreview.dataUrl}
              alt={activePreview.name}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};
