class AttachmentResponse {
  constructor(attachment) {
    this.id = attachment.id;
    this.fileUrl = attachment.fileUrl;
    this.fileType = attachment.fileType; // "image" or "video"
  }
}

module.exports = AttachmentResponse;
