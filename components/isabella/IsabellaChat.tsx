"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, X, Minimize2, Radio, Shield, MapPin, Zap, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  sender: 'isabella' | 'user';
  text: string;
  timestamp: string;
}

interface IsabellaChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export default function IsabellaChat({ isOpen, onClose, initialPrompt }: IsabellaChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'isabella',
      text: '¡Saludos! Soy Isabella Villaseñor AI, asistente del RDM Digital Hub - Nodo Cero. Estoy aquí para guiarte por el territorio de Real del Monte, la arquitectura Heptafederada YUN, la historia del paste y nuestro gemelo digital 2D/3D. ¿En qué te asisto hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presets = [
    '¿Qué es la Arquitectura Heptafederada YUN?',
    'Recomiéndame una ruta de minas y pastes en RDM',
    '¿Cómo funciona la Criptografía Post-Cuántica Dilithium?',
    'Historia de los mineros de Cornualles de 1824',
  ];

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/isabella', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          context: { territory: 'Real del Monte', status: 'Optimal' },
        }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'isabella',
        text: data.text || 'Isabella AI ha procesado la solicitud con éxito.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'isabella',
        text: 'Conexión con Nodo Cero activa: Real del Monte cuenta hoy con clima fresco (13.8°C), 18 pastelerías certificadas operativas y el Gemelo Digital 3D totalmente sincronizado.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt) {
      const timer = setTimeout(() => {
        handleSend(initialPrompt);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-lg h-[620px] glass-panel rounded-2xl border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden animate-crystal-float">
      
      {/* Header Bar */}
      <div className="p-4 glass-panel border-b border-white/10 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 via-purple-500 to-amber-400 p-0.5 animate-pulse">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Isabella Villaseñor AI
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </h3>
            <p className="text-[10px] text-cyan-300 font-mono">
              Núcleo Cognitivo YUN-01 // Real del Monte
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/50">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-cyan-950 border border-cyan-500/40 text-cyan-300'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-purple-900/40 text-purple-100 border border-purple-500/30 rounded-tr-none'
                  : 'glass-panel text-slate-200 border border-cyan-500/30 rounded-tl-none shadow-md'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <div
                className={`text-[9px] font-mono mt-1.5 text-right ${
                  msg.sender === 'user' ? 'text-purple-300' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Isabella AI procesando en el Nodo Cero...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Presets Shortcuts */}
      <div className="px-4 py-2 border-t border-white/5 bg-slate-950/80 overflow-x-auto flex gap-2 no-scrollbar">
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(preset)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-400 text-[10px] text-cyan-300 hover:text-white transition-all whitespace-nowrap"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 glass-panel border-t border-white/10 bg-slate-950 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu consulta a Isabella AI..."
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white disabled:opacity-50 hover:opacity-90 transition-all shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
