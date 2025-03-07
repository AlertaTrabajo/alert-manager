export interface User {
  _id:      string;
  surname: string;
  email:    string;
  name:     string;
  isActive: boolean;
  roles:    string[];
}
