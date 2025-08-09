import mongoose, { Document, Schema } from 'mongoose';

export interface iGuest extends Document {
    name: string;
    phone: string;
    group: string;
    status: string; // confirmed, pending or absent
    plusOnes: number;
}

const GuestSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        group: { type: String, required: true, trim: true },
        status: { type: String, required: true, trim: true }, // confirmed, pending or absent
        plusOnes: { type: Number, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<iGuest>('Guest', GuestSchema);
