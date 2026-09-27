import { db } from '~/prisma/db.js';

// Helper utility để trích xuất kiểu dữ liệu của một Model bản ghi từ Prisma ORM 8
type ModelRecord<T extends { first: (...args: any[]) => Promise<any> }> = NonNullable<
  Awaited<ReturnType<T['first']>>
>;


export type User = ModelRecord<typeof db.orm.public.User>;
export type Provinces = ModelRecord<typeof db.orm.public.Provinces>;
export type Wards = ModelRecord<typeof db.orm.public.Wards>;
export type Company = ModelRecord<typeof db.orm.public.Company>;
export type Job = ModelRecord<typeof db.orm.public.Job>;
export type Application = ModelRecord<typeof db.orm.public.Application>;
export type Post = ModelRecord<typeof db.orm.public.Post>;
export type Interaction = ModelRecord<typeof db.orm.public.Interaction>;
export type Attachment = ModelRecord<typeof db.orm.public.Attachment>;
export type BlogCategory = ModelRecord<typeof db.orm.public.BlogCategory>;
export type Blog = ModelRecord<typeof db.orm.public.Blog>;
export type CompanyMembers = ModelRecord<typeof db.orm.public.CompanyMembers>;
export type Connection = ModelRecord<typeof db.orm.public.Connection>;
export type Follow = ModelRecord<typeof db.orm.public.Follow>;
export type Review = ModelRecord<typeof db.orm.public.Review>;
export type SessionLogins = ModelRecord<typeof db.orm.public.SessionLogins>;
export type Skill = ModelRecord<typeof db.orm.public.Skill>;
export type SkillJob = ModelRecord<typeof db.orm.public.SkillJob>;
export type SkillUser = ModelRecord<typeof db.orm.public.SkillUser>;