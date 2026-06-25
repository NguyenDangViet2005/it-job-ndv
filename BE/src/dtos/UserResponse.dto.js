class UserResponse {
  constructor(user) {
    this.id = user.id;
    this.fullname = user.fullname;
    this.email = user.email;
    this.phone = user.phone;
    this.gender = user.gender;
    this.dateofbirth = user.dateofbirth;
    this.avatar = user.avatar;
    this.coverimage = user.coverimage;
    this.address = user.address;
    this.cvurl = user.cvurl;
    this.role = user.role || "user";
    this.provider = user.provider;
    this.providerId = user.providerId;
    this.createdat = user.createdat;
    this.updatedat = user.updatedat;
  }
}

module.exports = UserResponse;
