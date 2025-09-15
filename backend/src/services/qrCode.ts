import QRCode from 'qrcode';
import QRCodeModel, { iQRCode } from '../models/QRCode';
import { logger } from '../utils/logger';

export interface QRCodeOptions {
    url: string;
    size?: number;
    format?: 'png' | 'svg';
}

export class QRCodeService {
    /**
     * Generate and store QR code for a URL
     * Returns existing QR code if already generated for this URL
     */
    static async generateQRCode(options: QRCodeOptions): Promise<iQRCode> {
        const { url, size = 300, format = 'png' } = options;

        try {
            // Check if QR code already exists for this URL
            const existingQRCode = await QRCodeModel.findOne({ url });
            if (existingQRCode) {
                logger.info(`QR code already exists for URL: ${url}`);
                return existingQRCode;
            }

            // Generate QR code as base64 data URL
            const qrCodeData = await QRCode.toDataURL(url, {
                width: size,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            // Store in database
            const newQRCode = new QRCodeModel({
                url,
                qrCodeData,
                format,
                size
            });

            await newQRCode.save();
            logger.info(`QR code generated and stored for URL: ${url}`);
            
            return newQRCode;
        } catch (error) {
            logger.error('Error generating QR code:', error);
            throw new Error('Failed to generate QR code');
        }
    }

    /**
     * Get existing QR code by URL
     */
    static async getQRCodeByUrl(url: string): Promise<iQRCode | null> {
        try {
            return await QRCodeModel.findOne({ url });
        } catch (error) {
            logger.error('Error fetching QR code:', error);
            throw new Error('Failed to fetch QR code');
        }
    }

    /**
     * Get all QR codes
     */
    static async getAllQRCodes(): Promise<iQRCode[]> {
        try {
            return await QRCodeModel.find().sort({ createdAt: -1 });
        } catch (error) {
            logger.error('Error fetching QR codes:', error);
            throw new Error('Failed to fetch QR codes');
        }
    }
}
