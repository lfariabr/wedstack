import { QRCodeService } from '../../services/qrCode';

export const qrCodeMutations = {
    generateQRCode: async (_: any, { input }: { input: { url: string; size?: number; format?: string } }) => {
        return await QRCodeService.generateQRCode({
            url: input.url,
            size: input.size,
            format: input.format as "png" | "svg"
        });
    }
};
