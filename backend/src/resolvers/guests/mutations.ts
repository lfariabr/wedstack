import Guest from '../../models/Guest';
import { logger } from '../../utils/logger';

export const guestMutations = {
    // Add a new guest
    // ignore, we already did it.

    // Update guest status (confirmed, pending, absent)
    updateGuestStatus: async (_: any, { id, status }: { id: string; status: string }) => {
        try {
            logger.info(`Updating guest status for ID: ${id}`);
            const guest = await Guest.findById(id);
            
            if (!guest) {
                logger.warn(`Guest not found with ID: ${id}`);
                throw new Error('Guest not found');
            }
            
            guest.status = status;
            await guest.save();
            
            // Map MongoDB _id to GraphQL id
            const mappedGuest = {
                ...guest.toObject(),
                id: (guest._id as any).toString(),
            };
            
            logger.info(`Successfully updated guest status for ID: ${id}`);
            return mappedGuest;
        } catch (error) {
            logger.error(`Error updating guest status for ID ${id}:`, error);
            throw new Error('Failed to update guest status');
        }
    },

    // Update guest group
    updateGuestGroup: async (_: any, { id, group }: { id: string; group: string }) => {
        try {
            logger.info(`Updating guest group for ID: ${id}`);
            const guest = await Guest.findById(id);
            
            if (!guest) {
                logger.warn(`Guest not found with ID: ${id}`);
                throw new Error('Guest not found');
            }
            
            guest.group = group;
            await guest.save();
            
            // Map MongoDB _id to GraphQL id
            const mappedGuest = {
                ...guest.toObject(),
                id: (guest._id as any).toString(),
            };
            
            logger.info(`Successfully updated guest group for ID: ${id}`);
            return mappedGuest;
        } catch (error) {
            logger.error(`Error updating guest group for ID ${id}:`, error);
            throw new Error('Failed to update guest group');
        }
    },

    // Update guest plusOnes
    updateGuestPlusOnes: async (_: any, { id, plusOnes }: { id: string; plusOnes: number }) => {
        try {
            logger.info(`Updating guest plusOnes for ID: ${id}`);
            const guest = await Guest.findById(id);
            
            if (!guest) {
                logger.warn(`Guest not found with ID: ${id}`);
                throw new Error('Guest not found');
            }
            
            guest.plusOnes = plusOnes;
            await guest.save();
            
            // Map MongoDB _id to GraphQL id
            const mappedGuest = {
                ...guest.toObject(),
                id: (guest._id as any).toString(),
            };
            
            logger.info(`Successfully updated guest plusOnes for ID: ${id}`);
            return mappedGuest;
        } catch (error) {
            logger.error(`Error updating guest plusOnes for ID ${id}:`, error);
            throw new Error('Failed to update guest plusOnes');
        }
    },
}
