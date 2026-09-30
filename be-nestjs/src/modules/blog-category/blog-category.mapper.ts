export interface BlogCategoryResponseData {
  id: number;
  name: string;
  createdat: string | Date | null;
  updatedat: string | Date | null;
}

export class BlogCategoryMapper {
  static toCategoryResponse(category: any): BlogCategoryResponseData {
    return {
      id: category.id,
      name: category.name,
      createdat: category.createdat,
      updatedat: category.updatedat,
    };
  }
}
