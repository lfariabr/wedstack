import mongoose, { Document, Schema } from "mongoose";

export interface iPhoto extends Document {
    key: string // obj key in spaces
    url: string // obj url in spaces
    contentType: string
    width?: number
    height?: number
    uploaderName?: string
    createdAt: Date
    updatedAt: Date
}

const PhotoSchema: Schema = new Schema(
    {
        key: { type: String, required: true, index: true, unique: true},
        url: { type: String, required: true},
        contentType: { type: String, required: true},
        width: { type: Number},
        height: { type: Number},
        uploaderName: { type: String},
    },
    {
        timestamps: true
    }
);

PhotoSchema.index({ createdAt: -1 });

export default mongoose.model<iPhoto>("Photo", PhotoSchema);