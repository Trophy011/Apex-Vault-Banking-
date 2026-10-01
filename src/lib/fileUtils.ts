import { ChatAttachment } from './types.ts';

// Formats byte count to human-readable size
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Resizes image if necessary to prevent oversized Firestore documents
function compressImage(file: File, maxDim = 1280, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Convert to webp/jpeg for optimal size
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime, quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Read arbitrary file (pictures or documents) as Base64 data URL
export async function processFileForChat(file: File): Promise<ChatAttachment> {
  const isImage = file.type.startsWith('image/');
  let dataUrl: string;

  if (isImage) {
    try {
      dataUrl = await compressImage(file);
    } catch {
      dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  } else {
    dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Calculate actual size in bytes from base64
  const approxSize = Math.round((dataUrl.length * 3) / 4);

  return {
    id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: file.name,
    type: file.type || (isImage ? 'image/jpeg' : 'application/octet-stream'),
    size: approxSize || file.size,
    dataUrl,
    isImage,
  };
}

// Save picture or document directly to device storage
export function saveFileToDevice(attachment: ChatAttachment): boolean {
  try {
    const { name, dataUrl } = attachment;

    // Convert dataUrl to blob for reliable cross-browser and mobile downloading
    if (dataUrl.startsWith('data:')) {
      const parts = dataUrl.split(',');
      const byteString = atob(parts[1]);
      const mimeString = parts[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = name || `document_${Date.now()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
      return true;
    } else {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = name || `file_${Date.now()}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    }
  } catch {
    // Fallback: open in new tab
    const w = window.open(attachment.dataUrl, '_blank');
    return !!w;
  }
}
