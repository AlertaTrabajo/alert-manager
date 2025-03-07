import { JobNewStatus } from "../enums/jobNew-status.enum";
import { JobNewCategory } from "../enums/jobNew-category.enum";
import { JobNewType } from "../enums/jobNew-type.enum";

export interface JobNewApiResponse {
  _id: string;
  title: string;
  subtitle: string;
  category: JobNewCategory;
  author: string;
  content: string;
  imgUrl: string;
  videoUrl: string;
  date: Date;
  status: JobNewStatus;
  jobNewType: JobNewType;
  tags: string[];
  views: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;

}

