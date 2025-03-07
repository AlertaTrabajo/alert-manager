import { ArticleCategory } from "../enums/article-category.entum";
import { ArticleStatus } from "../enums/article-status.enum";

export interface Article {
    _id:        string;
    title:      string;
    category:   ArticleCategory;
    content:    string;
    imgUrl:     string;
    videoUrl:   string;
    date:       Date;
    status:     ArticleStatus;
    importance: number;
    tags:       string[];
    views:      number;
    slug:       string;
}
