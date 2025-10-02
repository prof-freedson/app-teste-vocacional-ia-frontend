'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { MessageCircle, Settings, Loader2, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WhatsAppConfig {
  number: string;
  enabled: boolean;
  lastUpdated?: string;
}

interface WhatsAppConfigModalProps {
  trigger?: React.ReactNode;
}

export function WhatsAppConfigModal({ trigger }: WhatsAppConfigModalProps) {
  const [config, setConfig] = useState<WhatsAppConfig>({ number: '', enabled: true });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  // Carregar configurações atuais
  const loadConfig = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/admin/config');
      const data = await response.json();
      
      if (data.success) {
        setConfig(data.data.whatsapp);
      } else {
        setError(data.error || 'Erro ao carregar configurações');
      }
    } catch (err) {
      setError('Erro de conexão ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  // Salvar configurações
  const saveConfig = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const response = await fetch('/api/admin/config/whatsapp', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: config.number,
          enabled: config.enabled,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Configurações salvas com sucesso!');
        setConfig(data.data);
        setTimeout(() => {
          setSuccess('');
          setIsOpen(false);
        }, 2000);
      } else {
        setError(data.error || 'Erro ao salvar configurações');
      }
    } catch (err) {
      setError('Erro de conexão ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  // Validar formato do número (aceita celular e fixo)
  const validateNumber = (number: string): boolean => {
    // Aceita tanto celular (9 dígitos) quanto fixo (8 dígitos) após o DDD
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(number);
  };

  // Formatar número enquanto digita
  const formatNumber = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setConfig(prev => ({ ...prev, number: formatted }));
  };

  const isValidNumber = validateNumber(config.number);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Settings className="w-4 h-4 mr-2" />
      Configurar WhatsApp
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            Configurações do WhatsApp
          </DialogTitle>
          <DialogDescription>
            Configure o número do WhatsApp que será usado para enviar os resultados dos testes vocacionais.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Carregando configurações...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Número do WhatsApp</CardTitle>
                <CardDescription>
                  Número que receberá e enviará as mensagens com os resultados dos testes (aceita celular e fixo)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-number">Número (com DDD) - Celular ou Fixo</Label>
                  <Input
                    id="whatsapp-number"
                    type="tel"
                    placeholder="(98) 99999-9999 ou (98) 3216-4000"
                    value={config.number}
                    onChange={handleNumberChange}
                    className={!isValidNumber && config.number ? 'border-red-300' : ''}
                  />
                  {!isValidNumber && config.number && (
                    <p className="text-sm text-red-600">
                      Formato inválido. Use: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="whatsapp-enabled"
                    checked={config.enabled}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, enabled: checked }))
                    }
                  />
                  <Label htmlFor="whatsapp-enabled">
                    Habilitar envio via WhatsApp
                  </Label>
                </div>

                {config.lastUpdated && (
                  <p className="text-sm text-gray-500">
                    Última atualização: {new Date(config.lastUpdated).toLocaleString('pt-BR')}
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Dicas importantes:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use um número válido e ativo do WhatsApp (celular ou fixo)</li>
                <li>• Inclua o DDD da sua região</li>
                <li>• Números fixos também podem ter WhatsApp Business</li>
                <li>• Teste o envio após configurar</li>
                <li>• Mantenha o WhatsApp sempre conectado</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                onClick={saveConfig}
                disabled={saving || !isValidNumber || !config.number}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}