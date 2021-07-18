export interface SingleUserType {
  id: number;
  name: string;
  email: string;
  create_time: string;
  update_time: string;
  status: string;
}

export interface FormDatas {
  [name: string]: any;
}
