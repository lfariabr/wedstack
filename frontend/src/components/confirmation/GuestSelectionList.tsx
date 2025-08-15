import { Phone, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from '@/lib/i18n/I18nProvider';

interface Guest {
  id: string;
  name: string;
  phone: string;
  group: string;
  status: string;
  plusOnes: number;
}

interface GuestSelectionListProps {
  guests: Guest[];
  onSelectGuest: (guest: Guest) => void;
  searchTerm: string;
}

export const GuestSelectionList = ({ guests, onSelectGuest, searchTerm }: GuestSelectionListProps) => {
  const { t } = useI18n();
  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-[var(--primary)]/20 text-[var(--primary)] font-semibold rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[var(--primary)]/10 overflow-hidden">
      <div className="bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary)]/10 px-6 py-4 border-b border-[var(--primary)]/10">
        <h3 className="text-xl font-semibold text-[var(--primary)] flex items-center gap-2">
          <div className="bg-[var(--primary)]/10 p-2 rounded-lg">
            <Users className="h-5 w-5" />
          </div>
          {t('confirmation.foundPrefix')} {guests.length} {t('confirmation.foundGuests')} "{searchTerm}"
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {t('confirmation.selectGuestPrompt')}
        </p>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {guests.map((guest) => (
          <Button
            key={guest.id}
            onClick={() => onSelectGuest(guest)}
            variant="ghost"
            className="w-full h-auto p-6 justify-start hover:bg-[var(--primary)]/5 transition-colors duration-200"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <div className="bg-[var(--primary)]/10 p-3 rounded-full">
                  <Users className="h-5 w-5 text-[var(--primary)]" />
                </div>
                
                <div className="text-left">
                  <div className="font-semibold text-lg text-gray-900">
                    {highlightMatch(guest.name, searchTerm)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{highlightMatch(guest.phone, searchTerm)}</span>
                    </div>                    
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      guest.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : guest.status === 'declined'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {t(`confirmation.status.${guest.status}`)}
                    </span>
                  </div>
                </div>
              </div>
              
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Button>
        ))}
      </div>
      
      <div className="bg-gray-50 px-6 py-3">
        <p className="text-xs text-gray-500 text-center">
          💡 {t('confirmation.tipSearch')}
        </p>
      </div>
    </div>
  );
};
