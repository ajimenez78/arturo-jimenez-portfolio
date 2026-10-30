'use client';

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import type { Locale } from '@/lib/content';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const copy = {
  en: {
    trigger: 'Ask my Digital Twin',
    title: 'Arturo’s Digital Twin',
    subtitle: 'Career questions, answered by AI',
    close: 'Close Digital Twin',
    reset: 'Start a new conversation',
    greeting: 'Hello — I’m Arturo’s AI Digital Twin. Ask me about his career, architecture work, leadership, or experience with AI.',
    placeholder: 'Ask about Arturo’s career…',
    send: 'Send message',
    thinking: 'Thinking',
    disclosure: 'AI-generated answers grounded in Arturo’s verified career record.',
    suggestions: [
      'What kind of systems has Arturo designed?',
      'How does he work with AI?',
      'Tell me about his leadership experience.',
    ],
    networkError: 'I could not connect to the Digital Twin. Please try again.',
  },
  es: {
    trigger: 'Pregunta a mi Digital Twin',
    title: 'Digital Twin de Arturo',
    subtitle: 'Preguntas profesionales, respondidas por IA',
    close: 'Cerrar Digital Twin',
    reset: 'Iniciar una conversación nueva',
    greeting: 'Hola, soy el Digital Twin de Arturo basado en IA. Pregúntame sobre su trayectoria, arquitectura, liderazgo o experiencia con IA.',
    placeholder: 'Pregunta sobre la carrera de Arturo…',
    send: 'Enviar mensaje',
    thinking: 'Pensando',
    disclosure: 'Respuestas generadas por IA basadas en la trayectoria verificada de Arturo.',
    suggestions: [
      '¿Qué tipo de sistemas ha diseñado Arturo?',
      '¿Cómo trabaja con inteligencia artificial?',
      'Háblame de su experiencia liderando equipos.',
    ],
    networkError: 'No he podido conectar con el Digital Twin. Inténtalo de nuevo.',
  },
} as const;

export function DigitalTwinChat({ lang }: { lang: Locale }) {
  const c = copy[lang];
  const initialMessage: Message = { role: 'assistant', content: c.greeting };
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, pending]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([{ role: 'assistant', content: c.greeting }]);
    setInput('');
    setError('');
    setPending(false);
    inputRef.current?.focus();
  };

  const ask = async (question: string) => {
    const content = question.trim();
    if (!content || pending) return;

    const nextMessages = [...messages, { role: 'user' as const, content }].slice(-10);
    setMessages(nextMessages);
    setInput('');
    setError('');
    setPending(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch('/api/digital-twin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: lang, messages: nextMessages }),
        signal: controller.signal,
      });
      const data = await response.json() as { answer?: string; error?: string };
      if (!response.ok || !data.answer) throw new Error(data.error || c.networkError);
      setMessages(current => [...current, { role: 'assistant', content: data.answer! }]);
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      setError(requestError instanceof Error ? requestError.message : c.networkError);
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setPending(false);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void ask(input);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="digital-twin-root">
      {open && (
        <section className="twin-panel" id="digital-twin-panel" role="dialog" aria-label={c.title} aria-modal="false">
          <header className="twin-header">
            <span className="twin-avatar" aria-hidden="true"><Bot size={20}/><i/></span>
            <div><h2>{c.title}</h2><p>{c.subtitle}</p></div>
            <button className="twin-icon-button" type="button" onClick={reset} aria-label={c.reset}><RotateCcw size={16}/></button>
            <button className="twin-icon-button" type="button" onClick={close} aria-label={c.close}><X size={18}/></button>
          </header>

          <div className="twin-messages" ref={messagesRef} aria-live="polite" aria-busy={pending}>
            {messages.map((message, index) => (
              <div className={`twin-message ${message.role}`} key={`${message.role}-${index}`}>
                {message.role === 'assistant' && <Sparkles size={13} aria-hidden="true"/>}
                <p>{message.content}</p>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="twin-suggestions" aria-label={lang === 'es' ? 'Preguntas sugeridas' : 'Suggested questions'}>
                {c.suggestions.map(suggestion => <button type="button" key={suggestion} onClick={() => void ask(suggestion)}>{suggestion}</button>)}
              </div>
            )}
            {pending && <div className="twin-thinking"><span/><span/><span/><b className="sr-only">{c.thinking}</b></div>}
            {error && <p className="twin-error" role="alert">{error}</p>}
          </div>

          <form className="twin-form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="digital-twin-input">{c.placeholder}</label>
            <textarea id="digital-twin-input" ref={inputRef} value={input} onChange={event => setInput(event.target.value)} onKeyDown={onInputKeyDown} placeholder={c.placeholder} maxLength={1500} rows={1} disabled={pending}/>
            <button type="submit" disabled={pending || !input.trim()} aria-label={c.send}><Send size={17}/></button>
          </form>
          <p className="twin-disclosure">{c.disclosure}<span>OpenAI · GPT-4o mini</span></p>
        </section>
      )}

      <button ref={triggerRef} className={`twin-trigger ${open ? 'is-open' : ''}`} type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="digital-twin-panel">
        {open ? <X size={18}/> : <MessageCircle size={18}/>}<span>{open ? c.close : c.trigger}</span><i aria-hidden="true"/>
      </button>
    </div>
  );
}
