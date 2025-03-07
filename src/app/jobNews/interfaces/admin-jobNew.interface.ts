import { JobNewCategory } from "../enums/jobNew-category.enum";
import { JobNewStatus } from "../enums/jobNew-status.enum";
import { JobNewType } from "../enums/jobNew-type.enum";

export interface AdminJobNew {
  _id: string;
  title: string;
  author: string;
  category: JobNewCategory;
  jobNewType: JobNewType;
  status: JobNewStatus;
  date: Date;
  views: number;
}
