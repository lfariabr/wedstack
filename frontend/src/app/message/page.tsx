'use client';

import { useState } from "react";
import { Send, MessageSquare, Heart } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMessages, useAddMessage } from "@/lib/hooks/useMessages";
import { useToast } from "@/components/ui/use-toast";
import { useI18n } from '@/lib/i18n/I18nProvider';


export default function MessagePage() {
  const { messages, loading, error } = useMessages();
  const { addMessage, loading: addingMessage, error: addError } = useAddMessage();
  const { toast } = useToast();
  const { t, locale } = useI18n();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.message.trim()) {
      toast({
        title: t('message.validationTitle'),
        description: t('message.validationDesc'),
        variant: "destructive"
      });
      return;
    }

    try {
      await addMessage({
        name: formData.name.trim(),
        message: formData.message.trim()
      });
      
      // Reset form
      setFormData({ name: '', message: '' });
      
      toast({
        title: t('message.sentTitle'),
        description: t('message.sentDesc'),
      });
    } catch (err) {
      toast({
        title: t('message.sendErrorTitle'),
        description: t('message.sendErrorDesc'),
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg text-muted-foreground">{t('message.loading')}</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-2">
            <p className="text-lg text-red-600">{t('message.loadErrorTitle')}</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#FCF9F4] dark:from-[#2D2A26] dark:to-[#1C1A18] px-4 py-16">
        <main className="w-full max-w-3xl mx-auto flex flex-col items-center gap-12">

          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="w-script text-6xl sm:text-6xl font-serif font-bold text-[#F47EAB]/50 drop-shadow-sm">
              {t('message.pageTitle')}
            </h1>
            <p className="text-lg sm:text-xl text-[var(--primary)]/80 italic">
              {t('message.subtitle')}
            </p>
          </div>

          {/* Message Form */}
          <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[var(--accent)]/20 shadow-md border border-[var(--border)] w-full">
            <div className="flex items-start gap-4">
              <MessageSquare className="w-6 h-6 mt-1 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold text-xl mb-4">{t('message.formTitle')}</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('message.nameLabel')}
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t('message.namePlaceholder')}
                      className="w-full"
                      disabled={addingMessage}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('message.messageLabel')}
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder={t('message.messagePlaceholder')}
                      className="w-full min-h-[120px]"
                      disabled={addingMessage}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-cta w-full"
                    disabled={addingMessage || !formData.name.trim() || !formData.message.trim()}
                  >
                    <Send className="w-cta-icon" />
                    {addingMessage ? t('message.submitting') : t('message.submit')}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Messages Display */}
          {messages && messages.length > 0 && (
            <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[#F47EAB]/50 shadow-md border border-[var(--border)] w-full">
              <div className="flex items-start gap-4">
                <Heart className="w-6 h-6 mt-1 text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-4">{t('message.guestMessagesTitle')}</h3>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {messages.map((msg) => (
                      <div key={msg.id} className="bg-white/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{msg.name}</span>
                          <span className="text-sm text-gray-500">
                            {msg.createdAt ? 
                              (() => {
                                // Convert timestamp string to number, then to Date
                                const timestamp = Number(msg.createdAt);
                                const date = new Date(timestamp);
                                const dateLocale = locale === 'pt' ? 'pt-BR' : 'en-AU';
                                return isNaN(date.getTime()) ? 
                                  t('message.dateInvalid') : 
                                  date.toLocaleDateString(dateLocale, {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  });
                              })() : 
                              t('message.dateUnavailable')
                            }
                          </span>
                        </div>
                        <p className="text-gray-700 italic">"{msg.content}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </MainLayout>
  );
}
