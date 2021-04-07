export default interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
  level: number;
  status: boolean;
  canceled_at?: Date;
}
