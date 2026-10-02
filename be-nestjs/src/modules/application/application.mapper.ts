import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto.js';
import { nowPlainDateTime } from '~/common/utils/temporal.util.js';

export interface ApplicationResponseData {
  jobid: number;
  userid: number;
  cvurl: string | null;
  coverletter: string | null;
  status: string;
  createdat: Date | null;
  updatedat: Date | null;
  jobTitle: string | null;
  companyName: string | null;
  companyLogo: string | null;
  userfullname: string | null;
  userEmail: string | null;
  userAvatar: string | null;
}

export class ApplicationMapper {
  /**
   * Định dạng dữ liệu đơn ứng tuyển kèm thông tin công việc, công ty và ứng viên
   */
  static toApplicationResponse(
    app: any,
    job: any = null,
    user: any = null,
    company: any = null,
  ): ApplicationResponseData {
    const j = job || app.job;
    const u = user || app.user;
    const c = company || j?.company;

    return {
      jobid: app.jobid,
      userid: app.userid,
      cvurl: app.cvurl || null,
      coverletter: app.coverletter || null,
      status: app.status || 'pending',
      createdat: app.createdat || null,
      updatedat: app.updatedat || null,
      jobTitle: j?.title || null,
      companyName: c?.name || null,
      companyLogo: c?.avatar || null,
      userfullname: u?.fullname || null,
      userEmail: u?.email || null,
      userAvatar: u?.avatar || null,
    };
  }

  /**
   * Map từ CreateApplicationDto sang payload lưu Application trong DB
   */
  static toCreateApplicationEntity(
    dto: CreateApplicationDto,
    userId: number,
    finalCvUrl: string | null,
  ) {
    return {
      jobid: dto.jobid as any,
      userid: userId as any,
      cvurl: (finalCvUrl || dto.cvurl || null) as any,
      coverletter: (dto.coverletter || null) as any,
      status: 'pending' as any,
    };
  }

  /**
   * Map từ UpdateApplicationStatusDto sang payload cập nhật Application trong DB
   */
  static toUpdateApplicationEntity(dto: UpdateApplicationStatusDto) {
    const updateData: Record<string, any> = {};

    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.cvurl !== undefined) updateData.cvurl = dto.cvurl;
    if (dto.coverletter !== undefined) updateData.coverletter = dto.coverletter;

    updateData.updatedat = nowPlainDateTime();
    return updateData;
  }
}
