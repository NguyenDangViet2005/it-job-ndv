class UserResponse {
  constructor(user) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.email = user.email;
    this.phone = user.phone;
    this.gender = user.gender;
    this.dateOfBirth = user.dateOfBirth;
    this.avatar = user.avatar;
    this.coverImage = user.coverImage;
    this.address = user.address;
    this.cvUrl = user.cvUrl;
    this.role = user.role || "user";
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

module.exports = UserResponse;
