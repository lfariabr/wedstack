import { Phone, Plus, Check, X, Clock } from "lucide-react";
import { useI18n } from '@/lib/i18n/I18nProvider';

interface GuestConfirmation {
  id: string;
  name: string;
  phone: string;
  group: string;
  status: string;
  plusOnes: number;
  isConfirmed: boolean;
}

interface FamilyMembersTableProps {
  members: GuestConfirmation[];
  onMemberToggle: (memberId: string, isConfirmed: boolean) => void;
  disabled?: boolean;
}

export const FamilyMembersTable = ({ members, onMemberToggle, disabled = false }: FamilyMembersTableProps) => {
  const { t } = useI18n();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'declined':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'confirmed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'declined':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[var(--primary)]/10 overflow-hidden">
      <div className="bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary)]/10 px-6 py-4 border-b border-[var(--primary)]/10">
        <h3 className="text-xl font-semibold text-[var(--primary)] flex items-center gap-2">
          <div className="bg-[var(--primary)]/10 p-2 rounded-lg">
            <Phone className="h-5 w-5" />
          </div>
          {t('confirmation.guestListTitle', { count: members.length })}
        </h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {members.map((member, index) => (
          <div 
            key={member.id} 
            className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
              index === 0 ? 'bg-[var(--primary)]/5' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Confirmation Checkbox */}
                <div className="relative">
                  <input
                    type="checkbox"
                    id={`member-${member.id}`}
                    checked={member.isConfirmed}
                    onChange={(e) => onMemberToggle(member.id, e.target.checked)}
                    disabled={disabled}
                    className="w-6 h-6 text-[var(--primary)] bg-white border-2 border-gray-300 rounded-lg focus:ring-[var(--primary)] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  />
                  {member.isConfirmed && (
                    <Check className="absolute top-1 left-1 h-4 w-4 text-white pointer-events-none" />
                  )}
                </div>
                
                {/* Member Info */}
                <label htmlFor={`member-${member.id}`} className="flex-1 cursor-pointer">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg text-gray-900">
                        {member.name}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{member.phone}</span>
                      </div>
                      
                      {member.plusOnes > 0 && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Plus className="h-4 w-4" />
                          <span className="font-medium">{t('confirmation.plusOnes', { count: member.plusOnes })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>
              
              {/* Status Badge */}
              <div className="text-right">
                <span className={getStatusBadge(member.status)}>
                  {getStatusIcon(member.status)}
                  {t(`confirmation.status.${member.status}`)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Table Footer */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            {t('confirmation.totalFamily', { count: members.length })}
          </span>
          <span className="text-[var(--primary)] font-medium">
            {t('confirmation.presentCount', { count: members.filter(m => m.isConfirmed).length })}
          </span>
        </div>
      </div>
    </div>
  );
};
