import { JobNewCategory } from "../enums/jobNew-category.enum";

export interface SimpleJobNew {
  id: string;
  title: string;
  subtitle: string;
  img: string;
  tags: string[];
  slug: string;
  category: JobNewCategory;
}
