"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageCircle, Settings, Loader2, AlertCircle, Check, Phone, Link } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [inputFormat, setInputFormat] = useState<'phone' | 'link'>('phone');

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE}/admin/config`);
      const result = await response.json();
      
      if (result.success && result.data.whatsapp) {
        setConfig(result.data.whatsapp);
        // Detectar formato automaticamente
        if (result.data.whatsapp.number.startsWith('https://wa.me/')) {
          setInputFormat('link');
        } else {
          setInputFormat('phone');
        }
      }
    } catch (err) {
      setError('Erro ao carregar configurações');
      console.error('Erro ao carregar config:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      if (!isValidInput) {
        setError('Por favor, insira um número ou link válido');
        return;
      }

      const response = await fetch(`${API_BASE}/admin/config/whatsapp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: config.number,
          enabled: config.enabled,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Configurações salvas com sucesso!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Erro ao salvar configurações');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao salvar config:', err);
    } finally {
      setSaving(false);
    }
  };

  // Validar formato do número tradicional (aceita celular e fixo)
  const validatePhoneNumber = (number: string): boolean => {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(number);
  };

  // Validar formato do link WhatsApp
  const validateWhatsAppLink = (link: string): boolean => {
    const linkRegex = /^https:\/\/wa\.me\/\d{10,15}$/;
    return linkRegex.test(link);
  };

  // Validação geral baseada no formato selecionado
  const isValidInput = inputFormat === 'phone' 
    ? validatePhoneNumber(config.number)
    : validateWhatsAppLink(config.number);

  // Formatar número enquanto digita (apenas para formato phone)
  const formatNumber = (value: string): string => {
    if (inputFormat === 'link') return value;
    
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
    const value = e.target.value;
    if (inputFormat === 'phone') {
      const formatted = formatNumber(value);
      setConfig(prev => ({ ...prev, number: formatted }));
    } else {
      setConfig(prev => ({ ...prev, number: value }));
    }
  };

  const handleFormatChange = (format: 'phone' | 'link') => {
    setInputFormat(format);
    setConfig(prev => ({ ...prev, number: '' }));
  };

  const getPlaceholder = () => {
    return inputFormat === 'phone' 
      ? "(98) 99999-9999 ou (98) 3216-4000"
      : "https://wa.me/559831981530";
  };

  const getValidationMessage = () => {
    if (!config.number) return '';
    
    if (inputFormat === 'phone') {
      return !validatePhoneNumber(config.number) 
        ? "Formato inválido. Use: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX"
        : '';
    } else {
      return !validateWhatsAppLink(config.number)
        ? "Formato inválido. Use: https://wa.me/559831981530"
        : '';
    }
  };

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
                  Número que receberá e enviará as mensagens com os resultados dos testes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="format-select">Formato de Entrada</Label>
                  <Select value={inputFormat} onValueChange={handleFormatChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Número Tradicional
                        </div>
                      </SelectItem>
                      <SelectItem value="link">
                        <div className="flex items-center gap-2">
                          <Link className="w-4 h-4" />
                          Link WhatsApp
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp-number">
                    {inputFormat === 'phone' ? 'Número (com DDD)' : 'Link do WhatsApp'}
                  </Label>
                  <Input
                    id="whatsapp-number"
                    type={inputFormat === 'phone' ? 'tel' : 'url'}
                    placeholder={getPlaceholder()}
                    value={config.number}
                    onChange={handleNumberChange}
                    className={!isValidInput && config.number ? 'border-red-300' : ''}
                  />
                  {getValidationMessage() && (
                    <p className="text-sm text-red-600">
                      {getValidationMessage()}
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
                <li>• <strong>Formato Tradicional:</strong> Use (XX) XXXXX-XXXX para celular ou (XX) XXXX-XXXX para fixo</li>
                <li>• <strong>Link WhatsApp:</strong> Use https://wa.me/559831981530 (com código do país)</li>
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
                disabled={saving || !isValidInput}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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