import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    nom: string;
    email: string;
    motDePasse: string;
}

const UserSchema: Schema = new Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', UserSchema);
