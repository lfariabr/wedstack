import { QRCodeService } from '../../services/qrCode';

export const qrCodeQueries = {
    qrCode: async (_: any, { url }: { url: string }) => {
        return await QRCodeService.getQRCodeByUrl(url);
    },

    qrCodes: async () => {
        return await QRCodeService.getAllQRCodes();
    }
};
