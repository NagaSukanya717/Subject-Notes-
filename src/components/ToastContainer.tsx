import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderColor = 'border-blue-500/30';
        let iconColor = 'text-blue-500';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderColor = 'border-emerald-500/30';
          iconColor = 'text-emerald-500';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          borderColor = 'border-amber-500/30';
          iconColor = 'text-amber-500';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderColor = 'border-rose-500/30';
          iconColor = 'text-rose-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-neutral-900 border ${borderColor} shadow-lg shadow-black/5 dark:shadow-black/20 text-neutral-900 dark:text-neutral-100 transition-all transform translate-y-0`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold">{toast.title}</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-1"
              aria-label="Close alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
