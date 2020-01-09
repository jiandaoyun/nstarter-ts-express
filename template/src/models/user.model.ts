import { Schema } from 'mongoose';
import { mongodb } from '../components';

const db = mongodb;

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
