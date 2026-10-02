import { toast } from "sonner";

/**
 * Opens a CV URL in a new tab by fetching it as a blob and creating a local URL.
 * This prevents the browser from downloading extension-less raw files or files with strange names.
 */
export const openCV = async (url: string, defaultName: string = "CV.pdf") => {
  if (!url) {
    toast.error("Không tìm thấy đường dẫn tệp CV");
    return;
  }
  
  // Quick check: if it's already a blob URL, just open it
  if (url.startsWith("blob:")) {
    window.open(url, "_blank");
    return;
  }

  // Pre-open a blank tab synchronously to prevent browser popup blockers from blocking async window.open
  let newTab: Window | null = null;
  try {
    newTab = window.open("", "_blank");
    if (newTab) {
      newTab.document.write(
        `<!DOCTYPE html><html><head><title>Đang tải CV...</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f8fafc;color:#334155;}</style></head><body><div style="text-align:center;"><div style="display:inline-block;width:32px;height:32px;border:3px solid #cbd5e1;border-top-color:#3b82f6;border-radius:50%;animation:spin 1s linear infinite;"></div><p style="margin-top:16px;font-size:14px;">Đang tải tệp CV, vui lòng chờ trong giây lát...</p><style>@keyframes spin{to{transform:rotate(360deg)}}</style></div></body></html>`
      );
    }
  } catch {
    // Popup might be blocked
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Cloudinary từ chối quyền truy cập file CV (Lỗi 401: deny or ACL failure). Cần bật 'Allow delivery of PDF and ZIP files' trong Cloudinary Settings -> Security."
        );
      }
      throw new Error(`Không thể tải file CV (mã lỗi HTTP: ${response.status})`);
    }

    const blob = await response.blob();
    
    // Determine mime-type based on url extension or default name
    let mimeType = blob.type;
    const lowerUrl = url.toLowerCase();
    const lowerName = defaultName.toLowerCase();
    
    if (lowerUrl.endsWith(".docx") || lowerName.endsWith(".docx")) {
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (lowerUrl.endsWith(".doc") || lowerName.endsWith(".doc")) {
      mimeType = "application/msword";
    } else if (lowerUrl.endsWith(".pdf") || lowerName.endsWith(".pdf") || !mimeType || mimeType === "application/octet-stream") {
      mimeType = "application/pdf";
    }
    
    const typedBlob = new Blob([blob], { type: mimeType });
    const blobUrl = URL.createObjectURL(typedBlob);
    
    if (newTab && !newTab.closed) {
      newTab.location.href = blobUrl;
    } else {
      // Create a temporary link to click and open in a new tab if popup was blocked
      const link = document.createElement("a");
      link.href = blobUrl;
      link.target = "_blank";
      if (mimeType !== "application/pdf") {
        link.download = defaultName;
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    // Clean up blob URL after delay
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  } catch (error: any) {
    console.error("Error opening CV:", error);
    if (newTab && !newTab.closed) {
      newTab.close();
    }
    toast.error(error?.message || "Không thể mở file CV");
  }
};
