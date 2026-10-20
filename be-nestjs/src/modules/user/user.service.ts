import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { withTransaction } from '~/prisma/db.js';
import { CloudinaryService } from '~/modules/cloudinary/cloudinary.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { UserMapper } from './user.mapper.js';
import { UserRepository } from './user.repository.js';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getAllUsers(page: number = 1, pageSize: number = 10) {
    const totalItems = await this.userRepo.countAll();
    const rows = await this.userRepo.findAll((page - 1) * pageSize, pageSize);

    const sanitized = rows.map((u) => UserMapper.toSafeUser(u));
    return {
      users: sanitized,
      data: sanitized,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    return UserMapper.toUserProfileResponse(user);
  }

  async updateUser(
    id: number,
    currentUserId: number,
    currentUserRole: string,
    dto: UpdateUserDto,
  ) {
    if (currentUserId !== id && currentUserRole !== 'admin') {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa thông tin này',
      );
    }

    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const updateData = UserMapper.toUpdateUserEntity(dto);
    const updated = await this.userRepo.update(id, updateData);

    return UserMapper.toSafeUser(updated);
  }

  async updateAvatar(
    id: number,
    currentUserId: number,
    currentUserRole: string,
    file: Express.Multer.File,
  ) {
    if (currentUserId !== id && currentUserRole !== 'admin') {
      throw new ForbiddenException(
        'Bạn chỉ có thể cập nhật avatar của chính mình',
      );
    }

    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // 1. Upload file mới lên Cloudinary trước để đảm bảo an toàn
    const result = await this.cloudinaryService.uploadFile(
      file,
      'IT-JOB/avatars',
    );

    // 2. Cập nhật database với URL mới
    const updated = await this.userRepo.update(id, {
      avatar: result.secure_url as any,
    });

    // 3. Sau khi upload & update thành công, dọn dẹp file cũ trên Cloudinary
    if (user.avatar) {
      this.cloudinaryService.deleteFile(user.avatar).catch((err) => {
        console.warn(
          'Lỗi khi xóa avatar cũ trên Cloudinary:',
          err?.message || err,
        );
      });
    }

    return UserMapper.toSafeUser(updated);
  }

  async updateCoverImage(
    id: number,
    currentUserId: number,
    currentUserRole: string,
    file: Express.Multer.File,
  ) {
    if (currentUserId !== id && currentUserRole !== 'admin') {
      throw new ForbiddenException(
        'Bạn chỉ có thể cập nhật ảnh bìa của chính mình',
      );
    }

    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // 1. Upload file mới lên Cloudinary trước
    const result = await this.cloudinaryService.uploadFile(
      file,
      'IT-JOB/covers',
    );

    // 2. Cập nhật database
    const updated = await this.userRepo.update(id, {
      coverimage: result.secure_url as any,
    });

    // 3. Dọn dẹp ảnh cũ
    if (user.coverimage) {
      this.cloudinaryService.deleteFile(user.coverimage).catch((err) => {
        console.warn(
          'Lỗi khi xóa ảnh bìa cũ trên Cloudinary:',
          err?.message || err,
        );
      });
    }

    return UserMapper.toSafeUser(updated);
  }

  async updateCV(
    id: number,
    currentUserId: number,
    currentUserRole: string,
    file: Express.Multer.File,
  ) {
    if (currentUserId !== id && currentUserRole !== 'admin') {
      throw new ForbiddenException('Bạn chỉ có thể cập nhật CV của chính mình');
    }

    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // 1. Upload CV mới lên Cloudinary trước
    const result = await this.cloudinaryService.uploadFile(file, 'IT-JOB/cvs');

    // 2. Cập nhật database
    const updated = await this.userRepo.update(id, {
      cvurl: result.secure_url as any,
    });

    // 3. Dọn dẹp CV cũ
    if (user.cvurl) {
      this.cloudinaryService.deleteFile(user.cvurl).catch((err) => {
        console.warn('Lỗi khi xóa CV cũ trên Cloudinary:', err?.message || err);
      });
    }

    return UserMapper.toSafeUser(updated);
  }

  async changePassword(
    id: number,
    currentUserId: number,
    dto: ChangePasswordDto,
  ) {
    if (currentUserId !== id) {
      throw new ForbiddenException(
        'Bạn chỉ có thể đổi mật khẩu của chính mình',
      );
    }

    const user = await this.userRepo.findById(id);
    if (!user || !user.password) {
      throw new NotFoundException(
        'Người dùng không tồn tại hoặc sử dụng đăng nhập mạng xã hội',
      );
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await withTransaction(async () => {
      await this.userRepo.update(id, { password: hashedPassword as any });
      await this.userRepo.deleteSessionsByUserId(id);
    });

    return true;
  }

  async getUserSkills(userId: number) {
    const skillUsers = await this.userRepo.findUserSkills(userId);
    return skillUsers.map((su: any) => su.skill).filter(Boolean);
  }

  async addUserSkill(
    userId: number,
    currentUserId: number,
    currentUserRole: string,
    skillId: number,
  ) {
    if (currentUserId !== userId && currentUserRole !== 'admin') {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa kỹ năng người dùng',
      );
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const skill = await this.userRepo.findSkillById(skillId);
    if (!skill) {
      throw new NotFoundException('Kỹ năng không tồn tại');
    }

    const existing = await this.userRepo.findSkillUser(userId, skillId);

    if (existing) {
      return skill;
    }

    await this.userRepo.addSkillUser(userId, skillId);

    return skill;
  }

  async removeUserSkill(
    userId: number,
    currentUserId: number,
    currentUserRole: string,
    skillId: number,
  ) {
    if (currentUserId !== userId && currentUserRole !== 'admin') {
      throw new ForbiddenException('Bạn không có quyền xóa kỹ năng này');
    }

    await this.userRepo.removeSkillUser(userId, skillId);

    return true;
  }

  /**
   * Lấy danh sách đơn ứng tuyển của người dùng
   */
  async getUserApplications(
    userId: number,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const totalItems = await this.userRepo.countUserApplications(userId);
    const applications = await this.userRepo.findUserApplications(
      userId,
      (page - 1) * pageSize,
      pageSize,
    );

    // Lấy thông tin công ty liên quan đến các job (tối ưu gộp 1 query)
    const companyIds = [
      ...new Set(
        applications.map((app: any) => app.job?.companyid).filter(Boolean),
      ),
    ] as number[];

    let companiesMap = new Map<number, any>();
    if (companyIds.length > 0) {
      const companies = await this.userRepo.findCompaniesByIds(companyIds);
      companiesMap = new Map(companies.map((c: any) => [c.id, c]));
    }

    const formatted = applications.map((app: any) => ({
      ...app,
      job: app.job
        ? {
            ...app.job,
            company: companiesMap.get(app.job.companyid) || null,
          }
        : null,
    }));

    return {
      applications: formatted,
      data: formatted,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  /**
   * Lấy danh sách bài viết của người dùng
   */
  async getUserPosts(userId: number, page: number = 1, pageSize: number = 10) {
    const totalItems = await this.userRepo.countUserPosts(userId);
    const posts = await this.userRepo.findUserPosts(
      userId,
      (page - 1) * pageSize,
      pageSize,
    );

    return {
      posts,
      data: posts,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  /**
   * Lấy danh sách ảnh/video bài viết của người dùng (phân trang trực tiếp tại database)
   */
  async getUserMedia(userId: number, page: number = 1, pageSize: number = 6) {
    const postIds = await this.userRepo.findUserPostIds(userId);

    if (postIds.length === 0) {
      return {
        data: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: page,
      };
    }

    const totalItems = await this.userRepo.countUserMedia(postIds);
    const paginated = await this.userRepo.findUserMedia(
      postIds,
      (page - 1) * pageSize,
      pageSize,
    );

    return {
      data: paginated,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      currentPage: page,
    };
  }

  async deleteUser(id: number, currentUserRole: string) {
    if (currentUserRole !== 'admin') {
      throw new ForbiddenException(
        'Chỉ quản trị viên mới có quyền xóa người dùng',
      );
    }

    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    await this.userRepo.delete(id);
    for (const url of [user.avatar, user.coverimage, user.cvurl]) {
      if (url)
        await this.cloudinaryService.deleteFile(url).catch((error) => {
          console.warn(
            'Cloudinary cleanup failed; retry deletion for:',
            url,
            error?.message,
          );
        });
    }

    return true;
  }
}
