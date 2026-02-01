class AttachmentResponse {
  constructor(attachment) {
    this.id = attachment.id;
    this.fileurl = attachment.fileurl;
    this.filetype = attachment.filetype; // "image" or "video"
  }
}

module.exports = AttachmentResponse;
