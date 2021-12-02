export interface IUserModel {
    username: string;
    nickname: string;
    email?: string;
    phone?: string;
    password: string;
    salt: string;
}
