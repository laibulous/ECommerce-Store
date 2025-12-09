// ============================================
// src/components/common/SuccessMessage.jsx
// ============================================
import { CheckCircle } from 'lucide-react';

const SuccessMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      <div className="text-green-800">{message}</div>
    </div>
  );
};

export default SuccessMessage;
