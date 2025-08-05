'use client';

import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMessages, useAddMessage } from "@/lib/hooks/useMessages";
import { useToast } from "@/components/ui/use-toast";

export default function MessagePage() {
  const { messages, loading, error } = useMessages();
  const { addMessage, loading: addingMessage, error: addError } = useAddMessage();
  const { toast } = useToast();
  
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
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome e mensagem.",
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
        title: "Mensagem enviada! 💌",
        description: "Obrigado por compartilhar suas palavras carinhosas!",
      });
    } catch (err) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg text-muted-foreground">Carregando mensagens...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-2">
            <p className="text-lg text-red-600">Erro ao carregar mensagens</p>
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

          {/* Cabeçalho */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-[var(--primary)] drop-shadow-sm">
              Recadinhos
            </h1>
            <p className="text-lg sm:text-xl text-[var(--primary)]/80 italic">
              Escreva um recado especial para os noivos 💌
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="w-full max-w-[640px] p-8 rounded-2xl bg-[#CBCADC]/20 shadow-sm border border-[var(--border)] space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Seu nome
              </label>
              <Input 
                placeholder="Ex: Maria" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                maxLength={100}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Escreva um recado para os noivos
              </label>
              <Textarea 
                placeholder="Ex: Que alegria participar desse momento tão especial..." 
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                maxLength={1000}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.message.length}/1000 caracteres
              </p>
            </div>

            <Button 
              className="flex items-center gap-2" 
              type="submit"
              disabled={addingMessage || !formData.name.trim() || !formData.message.trim()}
            >
              <Send className="w-4 h-4" />
              {addingMessage ? 'Enviando...' : 'Enviar recado'}
            </Button>
          </form>

          {/* Mensagens já enviadas */}
          <div className="w-full max-w-[640px] space-y-4 mt-8">
            <h2 className="text-2xl font-semibold text-[var(--primary)]">
              Mensagens recebidas 💬 
              {/* Adding +1 to the count */}
              {messages.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({messages.length + 1} {messages.length === 1 ? 'mensagem' : 'mensagens'})
                </span>
              )}
            </h2>

            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Ainda não há mensagens.</p>
                <p className="text-sm">Seja o primeiro a enviar um recado!</p>
              </div>
            ) : (
              <>
                {/* Static example messages */}
                <div className="bg-white border border-[var(--border)] rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-muted-foreground italic">"Parabéns Naná e Guizo! Que Deus abençoe essa união."</p>
                  <p className="text-xs text-right text-muted-foreground mt-2">— Tia Marli</p>
                </div>

                {/* Dynamic messages from database */}
                {messages.map((message) => (
                  <div key={message.id} className="bg-white border border-[var(--border)] rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground italic">"{message.content}"</p>
                    <p className="text-xs text-right text-muted-foreground mt-2">— {message.name}</p>
                  </div>
                ))}
              </>
            )}
          </div>

        </main>
      </div>
    </MainLayout>
  );
}
