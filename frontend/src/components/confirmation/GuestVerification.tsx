'use client';

import { useState } from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Guest {
  id: string;
  name: string;
  phone?: string;
  status: 'pending' | 'confirmed' | 'absent';
}

interface GuestVerificationProps {
  guest: Guest;
  onVerificationSuccess: () => void;
  onCancel: () => void;
  action: 'confirm' | 'absent' | 'change';
}

export function GuestVerification({ 
  guest, 
  onVerificationSuccess, 
  onCancel, 
  action 
}: GuestVerificationProps) {
  const [verificationMethod, setVerificationMethod] = useState<'name' | 'phone'>('name');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Check if guest status change should be blocked
  const isStatusChangeBlocked = guest.status !== 'pending';
  
  const handleVerification = async () => {
    setIsVerifying(true);
    setError('');

    // Normalize input for comparison
    const normalizedInput = inputValue.trim().toLowerCase();
    const normalizedTarget = verificationMethod === 'name' 
      ? guest.name.toLowerCase()
      : guest.phone?.toLowerCase() || '';

    // Verify the input matches
    if (normalizedInput !== normalizedTarget) {
      setError(verificationMethod === 'name' 
        ? 'Nome não confere. Verifique a digitação.'
        : 'Telefone não confere. Verifique a digitação.'
      );
      setIsVerifying(false);
      return;
    }

    // Check if status change is blocked
    if (isStatusChangeBlocked && action !== 'change') {
      setError(`Não é possível alterar o status. Convidado já está ${
        guest.status === 'confirmed' ? 'confirmado' : 'ausente'
      }.`);
      setIsVerifying(false);
      return;
    }

    // Simulate verification delay for better UX
    setTimeout(() => {
      setIsVerifying(false);
      onVerificationSuccess();
    }, 1000);
  };

  const getActionText = () => {
    switch (action) {
      case 'confirm': return 'confirmar presença';
      case 'absent': return 'marcar como ausente';
      case 'change': return 'alterar status';
      default: return 'continuar';
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      pending: { text: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      confirmed: { text: 'Confirmado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      absent: { text: 'Ausente', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };

    const config = statusConfig[guest.status];
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.text}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-full">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Verificação de Segurança
            </h3>
            <p className="text-sm text-gray-600">
              Confirme sua identidade para {getActionText()}
            </p>
          </div>
        </div>

        {/* Guest Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">{guest.name}</span>
            {getStatusBadge()}
          </div>
          {guest.phone && (
            <p className="text-sm text-gray-600">{guest.phone}</p>
          )}
        </div>

        {/* Status Change Warning */}
        {isStatusChangeBlocked && action !== 'change' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Status Protegido
                </p>
                <p className="text-sm text-amber-700">
                  Este convidado já tem status definido. Não é possível alterar.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Verification Method Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Método de verificação:
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setVerificationMethod('name')}
              className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                verificationMethod === 'name'
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Nome completo
            </button>
            {guest.phone && (
              <button
                type="button"
                onClick={() => setVerificationMethod('phone')}
                className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                  verificationMethod === 'phone'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Telefone
              </button>
            )}
          </div>
        </div>

        {/* Verification Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {verificationMethod === 'name' ? 'Digite seu nome completo:' : 'Digite seu telefone:'}
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError('');
            }}
            placeholder={verificationMethod === 'name' ? guest.name : guest.phone || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isVerifying}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isVerifying}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleVerification}
            disabled={isVerifying || !inputValue.trim() || (isStatusChangeBlocked && action !== 'change')}
            className="flex-1"
          >
            {isVerifying ? 'Verificando...' : 'Verificar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
