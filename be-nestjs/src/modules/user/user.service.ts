import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { db } from '~/prisma/db.js';
import { CloudinaryService } from '~/modules/cloudinary/cloudinary.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { UserMapper } from './user.mapper.js';

@Injectable()
export class UserService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async getAllUsers(page: number = 1, pageSize: number = 10) {
    const { count } = await db.orm.public.User.aggregate((a) => ({
      count: a.count(),
    }));

    const rows = await db.orm.public.User
      .orderBy((u: any) => u.id.desc())
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .all();

    const sanitized = rows.map((u) => UserMapper.toSafeUser(u));
    return {
      users: sanitized,
      data: sanitized,
      totalItems: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  async getUserById(id: number) {
    const user = await db.orm.public.User.where({ id }).first();
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
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa thông tin này');
    }

    const user = await db.orm.public.User.where({ id }).first();
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const updateData = UserMapper.toUpdateUserEntity(dto);
    await db.orm.public.User.where({ id }).update(updateData);

    const updated = await db.orm.public.User.where({ id }).first();
    return UserMapper.toSafeUser(updated);
  }

  async updateAvatar(
    id: number,
    currentUserId: number,
    currentUserRole: string,
    file: Express.Multer.File,
  ) {
    if (currentUserId !== id && currentUserRole !== 'admin') {
      throw new ForbiddenException('Bạn chỉ có thể cập nhật avatar của chính mình');
    }

    const user = await db.orm.public.User.where({ id }).first();
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // 1. Upload file mới lên Cloudinary trước để đảm bảo an toàn
    const result = await this.cloudinaryService.uploadFile(file, 'IT-JOB/avatars');

    // 2. Cập nhật database với URL mới
    await db.orm.public.User.where({ id }).update({ avatar: result.secure_url as any });

    // 3. Sau khi upload & update thành công, dọn dẹp file cũ trên Cloudinary
    if (user.avatar) {
      this.cloudinaryService.deleteFile(user.avatar).catch((err) => {
        console.warn('Lỗi khi xóa avatar cũ trên Cloudinary:', err?.message || err);
      });
    }

    const updated = await db.orm.public.User.where({ id }).first();
    return UserMapper.toSafeUser(updated);
  }

  async updateCoverImage(
    id: number,
    currentUserId: number,
    currentUserRole: string,
    file: Express.Multer.File,
  ) {
    if (currentUserId !== id && currentUserRole !== 'admin') {
      throw new ForbiddenException('Bạn chỉ có thể cập nhật ảnh bìa của chính mình');
    }

    const user = await db.orm.public.User.where({ id }).first();
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // 1. Upload file mới lên Cloudinary trước
    const result = await this.cloudinaryService.uploadFile(file, 'IT-JOB/covers');

    // 2. Cập nhật database
    await db.orm.public.User.where({ id }).update({ coverimage: result.secure_url as any });

    // 3. Dọn dẹp ảnh cũ
    if (user.coverimage) {
      this.cloudinaryService.deleteFile(user.coverimage).catch((err) => {
        console.warn('Lỗi khi xóa ảnh bìa cũ trên Cloudinary:', err?.message || err);
      });
    }

    const updated = await db.orm.public.User.where({ id }).first();
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

    const user = await db.orm.public.User.where({ id }).first();
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // 1. Upload CV mới lên Cloudinary trước
    const result = await this.cloudinaryService.uploadFile(file, 'IT-JOB/cvs');

    // 2. Cập nhật database
    await db.orm.public.User.where({ id }).update({ cvurl: result.secure_url as any });

    // 3. Dọn dẹp CV cũ
    if (user.cvurl) {
      this.cloudinaryService.deleteFile(user.cvurl).catch((err) => {
        console.warn('Lỗi khi xóa CV cũ trên Cloudinary:', err?.message || err);
      });
    }

    const updated = await db.orm.public.User.where({ id }).first();
    return UserMapper.toSafeUser(updated);
  }

  async changePassword(
    id: number,
    currentUserId: number,
    dto: ChangePasswordDto,
  ) {
    if (currentUserId !== id) {
      throw new ForbiddenException('Bạn chỉ có thể đổi mật khẩu của chính mình');
    }

    const user = await db.orm.public.User.where({ id }).first();
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
    await db.orm.public.User.where({ id }).update({ password: hashedPassword as any });

    // Hủy toàn bộ phiên đăng nhập cũ trên các thiết bị để đảm bảo an toàn tài khoản
    await db.orm.public.SessionLogins.where({ userid: id }).delete();

    return true;
  }

  async getUserSkills(userId: number) {
    const skillUsers = await db.orm.public.SkillUser.where({ userid: userId })
      .include('skill')
      .all();

    return skillUsers.map((su: any) => su.skill).filter(Boolean);
  }

  async addUserSkill(
    userId: number,
    currentUserId: number,
    currentUserRole: string,
    skillId: number,
  ) {
    if (currentUserId !== userId && currentUserRole !== 'admin') {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa kỹ năng người dùng');
    }

    const user = await db.orm.public.User.where({ id: userId }).first();
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const skill = await db.orm.public.Skill.where({ id: skillId }).first();
    if (!skill) {
      throw new NotFoundException('Kỹ năng không tồn tại');
    }

    const existing = await db.orm.public.SkillUser.where({
      userid: userId,
      skillid: skillId,
    }).first();

    if (existing) {
      return skill;
    }

    await db.orm.public.SkillUser.create({
      userid: userId,
      skillid: skillId,
    });

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

    await db.orm.public.SkillUser.where({
      userid: userId,
      skillid: skillId,
    }).delete();

    return true;
  }

  /**
   * Lấy danh sách đơn ứng tuyển của người dùng
   */
  async getUserApplications(userId: number, page: number = 1, pageSize: number = 10) {
    const { count } = await db.orm.public.Application.where({
      userid: userId,
    }).aggregate((a) => ({ count: a.count() }));

    const applications = await db.orm.public.Application.where({ userid: userId })
      .include('job')
      .orderBy((a: any) => a.createdat.desc())
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .all();

    // Lấy thông tin công ty liên quan đến các job (tối ưu gộp 1 query)
    const companyIds = [
      ...new Set(applications.map((app: any) => app.job?.companyid).filter(Boolean)),
    ];

    let companiesMap = new Map<number, any>();
    if (companyIds.length > 0) {
      const companies = await db.orm.public.Company
        .where((c: any) => c.id.in(companyIds))
        .all();
      companiesMap = new Map(
        companies.map((c: any) => [c.id, c]),
      );
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
      totalItems: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  /**
   * Lấy danh sách bài viết của người dùng
   */
  async getUserPosts(userId: number, page: number = 1, pageSize: number = 10) {
    const { count } = await db.orm.public.Post.where({
      userid: userId,
    }).aggregate((a) => ({ count: a.count() }));

    const posts = await db.orm.public.Post.where({ userid: userId })
      .include('attachments')
      .include('company')
      .orderBy((p: any) => p.id.desc())
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .all();

    return {
      posts,
      data: posts,
      totalItems: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  /**
   * Lấy danh sách ảnh/video bài viết của người dùng (phân trang trực tiếp tại database)
   */
  async getUserMedia(userId: number, page: number = 1, pageSize: number = 6) {
    const userPosts = await db.orm.public.Post.where({ userid: userId }).all();
    const postIds = userPosts.map((p) => p.id);

    if (postIds.length === 0) {
      return {
        data: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: page,
      };
    }

    const { count } = await db.orm.public.Attachment
      .where((att: any) => att.postid.in(postIds))
      .where((att: any) => att.filetype.in(['image', 'video']))
      .aggregate((a) => ({ count: a.count() }));

    const paginated = await db.orm.public.Attachment
      .where((att: any) => att.postid.in(postIds))
      .where((att: any) => att.filetype.in(['image', 'video']))
      .orderBy((att: any) => att.id.desc())
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .all();

    return {
      data: paginated,
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
    };
  }


  async deleteUser(id: number, currentUserRole: string) {
    if (currentUserRole !== 'admin') {
      throw new ForbiddenException('Chỉ quản trị viên mới có quyền xóa người dùng');
    }

    const user = await db.orm.public.User.where({ id }).first();
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    if (user.avatar) {
      await this.cloudinaryService.deleteFile(user.avatar);
    }
    if (user.coverimage) {
      await this.cloudinaryService.deleteFile(user.coverimage);
    }
    if (user.cvurl) {
      await this.cloudinaryService.deleteFile(user.cvurl);
    }

    await db.orm.public.User.where({ id }).delete();
    return true;
  }
}
