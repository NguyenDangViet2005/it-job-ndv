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
    this.cvUrl = user.cvUrl; // Assuming this exists on User model or is derived
    this.role = user.role || "user";
  }
}

module.exports = UserResponse;
