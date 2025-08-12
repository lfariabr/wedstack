import { Users, Heart } from "lucide-react";

interface FamilyWelcomeCardProps {
  guestName: string;
  groupNumber: string;
  memberCount: number;
}

export const FamilyWelcomeCard = ({ guestName, groupNumber, memberCount }: FamilyWelcomeCardProps) => {
  return (
    <div className="bg-gradient-to-br from-white to-[var(--primary)]/5 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-xl border border-[var(--primary)]/10">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-[var(--primary)]/10 p-4 rounded-full">
            <Heart className="h-8 w-8 text-[var(--primary)]" />
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-serif font-bold text-[var(--primary)] mb-2">
            Olá, {guestName}!
          </h2>
        </div>
        
        <div className="bg-[var(--primary)]/5 p-4 rounded-xl">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Encontramos <strong className="text-[var(--primary)]">{memberCount} pessoa{memberCount !== 1 ? 's' : ''}</strong> no seu convite.
            <br />
            Por favor, confirme a presença de cada um abaixo.
          </p>
        </div>
      </div>
    </div>
  );
};
