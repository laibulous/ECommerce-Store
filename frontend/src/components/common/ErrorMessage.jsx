// ============================================
// src/components/common/ErrorMessage.jsx
// ============================================
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="text-red-800">{message}</div>
    </div>
  );
};

export default ErrorMessage;