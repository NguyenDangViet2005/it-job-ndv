// Export tất cả APIs
export { companyApi } from "./company.api";
export { authApi } from "./auth.api";
export { jobApi } from "./job.api";
export { blogApi } from "./blog.api";
export { postApi } from "./post.api";
export { reviewApi } from "./review.api";
export { skillApi } from "./skill.api";
export { applicationApi } from "./application.api";
export { userApi } from "./user.api";
export { followApi } from "./follow.api";

// Export các hàm API chung nếu cần custom
export {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPatch,
  apiGetPaginated,
  apiGetById,
} from "./api";
