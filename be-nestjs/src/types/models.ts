import { orm } from '~/prisma/db.js';

// Helper utility để trích xuất kiểu dữ liệu của một Model bản ghi từ Prisma ORM 8
type ModelRecord<T extends { first: (...args: any[]) => Promise<any> }> = NonNullable<
  Awaited<ReturnType<T['first']>>
>;

export type User = ModelRecord<typeof orm.User>;
export type Provinces = ModelRecord<typeof orm.Provinces>;
export type Wards = ModelRecord<typeof orm.Wards>;
export type Company = ModelRecord<typeof orm.Company>;
export type Job = ModelRecord<typeof orm.Job>;
export type Application = ModelRecord<typeof orm.Application>;
export type Post = ModelRecord<typeof orm.Post>;
export type Interaction = ModelRecord<typeof orm.Interaction>;
export type Attachment = ModelRecord<typeof orm.Attachment>;
export type BlogCategory = ModelRecord<typeof orm.BlogCategory>;
export type Blog = ModelRecord<typeof orm.Blog>;
export type CompanyMembers = ModelRecord<typeof orm.CompanyMembers>;
export type Connection = ModelRecord<typeof orm.Connection>;
export type Follow = ModelRecord<typeof orm.Follow>;
export type Review = ModelRecord<typeof orm.Review>;
export type SessionLogins = ModelRecord<typeof orm.SessionLogins>;
export type Skill = ModelRecord<typeof orm.Skill>;
export type SkillJob = ModelRecord<typeof orm.SkillJob>;
export type SkillUser = ModelRecord<typeof orm.SkillUser>;