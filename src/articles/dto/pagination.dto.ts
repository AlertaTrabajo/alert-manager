import { ArticleCategory } from "../enums/article-category.entum";

export class PaginationDto {

    limit?: number;

    offset?: number;

    category?: ArticleCategory;

}