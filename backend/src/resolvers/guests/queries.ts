import Guest from '../../models/Guest';
import { logger } from '../../utils/logger';

export const guestQueries = {
    // Get all guests
    guests: async () => {
        try {
            logger.info('Fetching all guests from database');
            const guests = await Guest.find({})
                .sort({ createdAt: -1 }) // Most recent first
                .lean(); // Return plain objects for better performance
            
            // Map MongoDB _id to GraphQL id
            const mappedGuests = guests.map(guest => ({
                ...guest,
                id: guest._id.toString(),
            }));
            
            logger.info(`Successfully fetched ${guests.length} guests`);
            return mappedGuests;
        } catch (error) {
            logger.error('Error fetching guests:', error);
            throw new Error('Failed to fetch guests');
        }
    },
    // Get guest by ID
    guest: async (_: any, { id }: { id: string }) => {
        try {
            logger.info(`Fetching guest with ID: ${id}`);
            const guest = await Guest.findById(id).lean();
            
            if (!guest) {
                logger.warn(`Guest not found with ID: ${id}`);
                throw new Error('Guest not found');
            }
            
            // Map MongoDB _id to GraphQL id
            const mappedGuest = {
                ...guest,
                id: guest._id.toString(),
            };
            
            logger.info(`Successfully fetched guest with ID: ${id}`);
            return mappedGuest;
        } catch (error) {
            logger.error('Error fetching guest:', error);
            throw new Error('Failed to fetch guest');
        }
    },
    // Get guests by name
    guestsByName: async (_: any, { name }: { name: string }) => {
        try {
            logger.info(`Fetching guests with name: ${name}`);
            const guests = await Guest.find({ name })
                .sort({ createdAt: -1 }) // Most recent first
                .lean(); // Return plain objects for better performance
            
            // Map MongoDB _id to GraphQL id
            const mappedGuests = guests.map(guest => ({
                ...guest,
                id: guest._id.toString(),
            }));
            
            logger.info(`Successfully fetched ${guests.length} guests with name: ${name}`);
            return mappedGuests;
        } catch (error) {
            logger.error('Error fetching guests by name:', error);
            throw new Error('Failed to fetch guests by name');
        }
    },
    // Get guests by phone
    guestsByPhone: async (_: any, { phone }: { phone: string }) => {
        try {
            logger.info(`Fetching guests with phone: ${phone}`);
            const guests = await Guest.find({ phone })
                .sort({ createdAt: -1 }) // Most recent first
                .lean(); // Return plain objects for better performance
            
            // Map MongoDB _id to GraphQL id
            const mappedGuests = guests.map(guest => ({
                ...guest,
                id: guest._id.toString(),
            }));
            
            logger.info(`Successfully fetched ${guests.length} guests with phone: ${phone}`);
            return mappedGuests;
        } catch (error) {
            logger.error('Error fetching guests by phone:', error);
            throw new Error('Failed to fetch guests by phone');
        }
    },
    // Get guests by group
    guestsByGroup: async (_: any, { group }: { group: string }) => {
        try {
            logger.info(`Fetching guests with group: ${group}`);
            const guests = await Guest.find({ group })
                .sort({ createdAt: -1 }) // Most recent first
                .lean(); // Return plain objects for better performance
            
            // Map MongoDB _id to GraphQL id
            const mappedGuests = guests.map(guest => ({
                ...guest,
                id: guest._id.toString(),
            }));
            
            logger.info(`Successfully fetched ${guests.length} guests with group: ${group}`);
            return mappedGuests;
        } catch (error) {
            logger.error('Error fetching guests by group:', error);
            throw new Error('Failed to fetch guests by group');
        }
    },
    // Get guests by status
    guestsByStatus: async (_: any, { status }: { status: string }) => {
        try {
            logger.info(`Fetching guests with status: ${status}`);
            const guests = await Guest.find({ status })
                .sort({ createdAt: -1 }) // Most recent first
                .lean(); // Return plain objects for better performance
            
            // Map MongoDB _id to GraphQL id
            const mappedGuests = guests.map(guest => ({
                ...guest,
                id: guest._id.toString(),
            }));
            
            logger.info(`Successfully fetched ${guests.length} guests with status: ${status}`);
            return mappedGuests;
        } catch (error) {
            logger.error('Error fetching guests by status:', error);
            throw new Error('Failed to fetch guests by status');
        }
    },
};
    
        