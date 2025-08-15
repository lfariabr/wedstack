import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from '@/lib/i18n/I18nProvider';

interface LoadingStateProps {
  message?: string;
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const LoadingState = ({ message }: LoadingStateProps) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="bg-[var(--primary)]/10 p-4 rounded-full">
        <Loader2 className="h-8 w-8 text-[var(--primary)] animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">{message || t('confirmation.loadingGuests')}</p>
        <p className="text-sm text-gray-500 mt-1">
          {t('confirmation.loadingGuestsTip')}
        </p>
      </div>
    </div>
  );
};

export const ErrorState = ({ 
  message, 
  onRetry 
}: ErrorStateProps) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="bg-red-100 p-4 rounded-full">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-red-800">
          {t('confirmation.errorLoadingGuestsTitle')}
        </h3>
        <p className="text-red-600 max-w-md">
          {message || t('confirmation.errorLoadingGuestsDesc')}
        </p>
      </div>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('confirmation.retry')}
        </Button>
      )}
    </div>
  );
};

export const EmptyState = () => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="bg-gray-100 p-4 rounded-full">
        <AlertCircle className="h-8 w-8 text-gray-500" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">
          {t('confirmation.noneFoundTitle')}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {t('confirmation.searchAgainTip')}
        </p>
      </div>
    </div>
  );
};
