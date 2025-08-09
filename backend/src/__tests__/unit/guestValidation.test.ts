import { guestNameSearchSchema } from '../../validation/schemas/guest.schema';

describe('Guest Validation Schemas', () => {
  describe('Guest Schema', () => {
    it('should pass validation with valid data', () => {
      const validData = {
        name: 'Test Guest',
      };
      
      const result = guestNameSearchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
    
    it('should fail validation with short name', () => {
      const invalidData = {
        name: 'T',
      };
      
      const result = guestNameSearchSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Name must be at least 2 characters');
      }
    });
  });
});