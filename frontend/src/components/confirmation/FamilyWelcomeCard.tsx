import { Users, Heart } from "lucide-react";
import { useI18n } from '@/lib/i18n/I18nProvider';

interface FamilyWelcomeCardProps {
  guestName: string;
  groupNumber: string;
  memberCount: number;
}

export const FamilyWelcomeCard = ({ guestName, groupNumber, memberCount }: FamilyWelcomeCardProps) => {
  const { t } = useI18n();
  return (
    <div className="bg-gradient-to-br from-white to-[var(--primary)]/5 p-8 rounded-2xl shadow-xl border border-[var(--primary)]/10">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-[var(--primary)]/10 p-4 rounded-full">
            <Heart className="h-8 w-8 text-[var(--primary)]" />
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-serif font-bold text-[var(--primary)] mb-2">
            {t('confirmation.helloName', { name: guestName })}
          </h2>
        </div>
        
        <div className="bg-[var(--primary)]/5 p-4 rounded-xl">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span>
              {t('confirmation.foundInInvite', { count: memberCount })}
            </span>
            <br />
            <span>{t('confirmation.confirmEachBelow')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
