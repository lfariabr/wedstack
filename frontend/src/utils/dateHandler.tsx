import { format } from "date-fns";

// Format date safely with fallback
export const formatDateSafe = (dateString: string) => {
    try {
      let date: Date;
  
      if (!isNaN(Number(dateString))) {
        date = new Date(Number(dateString));
      } else {
        date = new Date(dateString);
      }
  
      return format(date, 'dd/MM/yyyy');
    } catch {
      return 'recently';
    }
  };