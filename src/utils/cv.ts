/**
 * Opens a CV URL in a new tab by fetching it as a blob and creating a local URL.
 * This prevents the browser from downloading extension-less raw files or files with strange names.
 */
export const openCV = async (url: string, defaultName: string = "CV.pdf") => {
  if (!url) return;
  
  // Quick check: if it's already a blob URL, just open it
  if (url.startsWith("blob:")) {
    window.open(url, "_blank");
    return;
  }

  try {
    const response = await fetch(url);
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
    
    // Create a temporary link to click and open in a new tab
    const link = document.createElement("a");
    link.href = blobUrl;
    link.target = "_blank";
    // For pdfs, we want to open inline. For documents, we might set download attribute
    if (mimeType !== "application/pdf") {
      link.download = defaultName;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up blob URL after a short delay
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  } catch (error) {
    console.error("Error opening CV:", error);
    // Fallback: open URL directly in a new tab
    window.open(url, "_blank");
  }
};
