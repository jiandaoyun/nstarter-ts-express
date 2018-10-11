import { Schema } from 'mongoose';
import { Database } from '../database';

const db = Database.mongodb.connection;

const userSchema = new Schema({
    username: String,
    nickname: String,
    email: String,
    phone: String
});

userSchema.index({ username: 1 });
userSchema.index({ email: 1 }, { sparse: true });
userSchema.index({ phone: 1 }, { sparse: true });

export const userModel = db.model('user', userSchema);
