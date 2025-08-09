import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadingStateProps {
  message?: string;
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const LoadingState = ({ message = "Loading guests..." }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="bg-[var(--primary)]/10 p-4 rounded-full">
        <Loader2 className="h-8 w-8 text-[var(--primary)] animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{message}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Please wait while we fetch your guest information
        </p>
      </div>
    </div>
  );
};

export const ErrorState = ({ 
  message = "Error loading guests. Please refresh the page.", 
  onRetry 
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full">
        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
          Oops! Something went wrong
        </h3>
        <p className="text-red-600 dark:text-red-400 max-w-md">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full">
        <AlertCircle className="h-8 w-8 text-gray-500" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          No guests found
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Please check your search criteria and try again
        </p>
      </div>
    </div>
  );
};
