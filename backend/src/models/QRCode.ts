import mongoose, { Document, Schema } from "mongoose";

export interface iQRCode extends Document {
    url: string // the url the QR code points to!
    qrCodeData: string // base64 encoded qr code image
    format: string // image format (png, svg)
    size: number // QR code size in pixels
    createdAt: Date
    updatedAt: Date
}

const QRCodeSchema: Schema = new Schema(
    {
        url: { type: String, required: true, unique: true },
        qrCodeData: { type: String, required: true },
        format: { type: String, required: true, default: "png" },
        size: { type: Number, required: true, default: 300 },
    },
    {
        timestamps: true
    }
);

QRCodeSchema.index({ url: 1 });

export default mongoose.model<iQRCode>("QRCode", QRCodeSchema);