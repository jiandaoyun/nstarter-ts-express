import { Schema } from 'mongoose';
import { mongodb } from '../components';

const db = mongodb.connection;

export type User = {
    username: string,
    nickname: string,
    email?: string,
    phone?: string,
    password: string,
    salt: string
};

const userSchema = new Schema({
    username: String,
    nickname: String,
    email: String,
    phone: String,
    password: String,
    salt: String
});

userSchema.index({ username: 1 });
userSchema.index({ email: 1 }, { sparse: true });
userSchema.index({ phone: 1 }, { sparse: true });

export const userModel = db.model('user', userSchema);
