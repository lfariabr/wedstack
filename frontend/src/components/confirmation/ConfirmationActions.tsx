import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Users, CheckCircle, Loader2 } from "lucide-react";
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

interface ConfirmationActionsProps {
  members: GuestConfirmation[];
  onConfirm: () => void | Promise<void>;
  onReset: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ConfirmationActions = ({ 
  members, 
  onConfirm, 
  onReset, 
  isLoading = false, 
  disabled = false 
}: ConfirmationActionsProps) => {
  const { t } = useI18n();
  const confirmedCount = members.filter(m => m.isConfirmed).length;
  const totalCount = members.length;
  const hasChanges = members.some(m => 
    (m.isConfirmed && m.status !== 'confirmed') || 
    (!m.isConfirmed && m.status === 'confirmed')
  );

  // New: control when to show the success message
  const [showSuccess, setShowSuccess] = useState(false);

  // Hide success as soon as there are new unsaved changes again
  useEffect(() => {
    if (hasChanges) setShowSuccess(false);
  }, [hasChanges]);

  // Local handler to await the confirm action and then show success
  const handleConfirm = async () => {
    try {
      await Promise.resolve(onConfirm());
      // Only show success if there are no pending changes and not loading
      setShowSuccess(true);
      // Auto-hide after a short delay (optional)
      setTimeout(() => setShowSuccess(false), 3500);
    } catch (e) {
      // On error, do not show success
      setShowSuccess(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="rounded-2xl border border-[var(--primary)]/15 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary)]/10 p-6">
        <div className="flex items-center justify-center gap-4">
          <div className="bg-[var(--primary)]/15 p-3 rounded-full">
            <Users className="h-6 w-6 text-[var(--primary)]" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-[var(--primary)]">
              {t('confirmation.ofTotal', { confirmed: confirmedCount, total: totalCount })}
            </p>
            <p className="text-sm text-gray-600 mt-0.5">
              {t('confirmation.peopleConfirmed')}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={handleConfirm}
          disabled={isLoading || disabled || !hasChanges}
          size="lg"
          className="flex-1 sm:flex-none h-12 px-6 rounded-xl bg-[#FF7D59] hover:bg-[#e86f4f] text-white shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t('confirmation.updating')}
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              {t('confirmation.save')}
            </>
          )}
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          disabled={isLoading || disabled}
          size="lg"
          className="flex-1 sm:flex-none h-12 px-6 rounded-xl border-2"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          {t('confirmation.newSearch')}
        </Button>
      </div>

      {/* Status Messages */}
      {isLoading && (
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />
            <p className="text-yellow-800 font-medium">
              {t('confirmation.updatingConfirmations')}
            </p>
          </div>
        </div>
      )}

      {/* Success only AFTER processing: no loading, no pending changes, and explicitly set */}
      {showSuccess && !isLoading && !hasChanges && totalCount > 0 && (
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">
              {t('confirmation.updatedConfirmations')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
