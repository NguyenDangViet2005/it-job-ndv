import { Injectable } from '@nestjs/common';
import { db } from '~/prisma/db.js';


@Injectable()
export class AppService {
  async getHello() {
    // Trong Prisma 8, cú pháp là: db.orm.<namespace>.<Model>
    const users = await db.orm.public.User.select('id', 'fullname', 'email').all();
    return {
      message: 'Kết nối Prisma 8 thành công!',
      users,
    };
  }
}
