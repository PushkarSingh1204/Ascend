// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\AICoach.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { getAnalyses } from '../services/db';
import { askCoach } from '../services/aiCoach';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  CornerDownLeft, 
  Clock 
} from 'lucide-react';

export default function AICoach() {
  const { level, streak } = useGame();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'm_init',
      sender: 'coach',
      text: "Hello! I am your Ascend AI Coach. I analyze your scans, sleep logs, and habit consistency to guide your self-improvement journey. Ask me anything about your progress!",
      date: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');

    // Append user message
    const userMsg = {
      id: 'm_' + Date.now(),
      sender: 'user',
      text: userText,
      date: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Fetch latest analysis context
    const analyses = getAnalyses() || [];
    const latestAnalysis = analyses.length > 0 ? analyses[0] : null;
    const currentData = { level, streak, latestAnalysis };

    try {
      const response = await askCoach(userText, currentData);
      
      // Append coach response
      const coachMsg = {
        id: 'm_reply_' + Date.now(),
        sender: 'coach',
        text: response,
        date: new Date().toISOString()
      };
      setMessages(prev => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* 1. FLOATING CHAT BUBBLE TRIGGER */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all duration-300 cursor-pointer"
        title="Ask AI Coach"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </button>

      {/* 2. CHAT DRAWER PANEL */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-40 w-90 h-112 glassmorphism rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col animate-scale-up">
          
          {/* Header */}
          <div className="p-4 border-b border-neutral-900 bg-neutral-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></div>
              <div>
                <span className="text-xs font-bold text-white block">Ascend AI Coach</span>
                <span className="text-[9px] text-neutral-550 block mt-0.5">Active habit guidance</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Message History viewport */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-none">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div 
                  className={`p-3 rounded-2xl text-[11px] leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-650 text-white rounded-tr-none' : 'bg-neutral-900 border border-neutral-850 text-neutral-300 rounded-tl-none'}`}
                >
                  {msg.text.split('\n').map((line, idx) => (
                    <span key={idx} className="block mt-0.5">{line}</span>
                  ))}
                </div>
                <span className="text-[9px] text-neutral-550 mt-1 flex items-center gap-1">
                  <Clock size={8} />
                  {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col max-w-[85%] mr-auto items-start">
                <div className="p-3 rounded-2xl rounded-tl-none bg-neutral-900 border border-neutral-850 text-neutral-400 text-[11px] flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Form message input */}
          <form 
            onSubmit={handleSendMessage}
            className="p-3 border-t border-neutral-900 bg-neutral-950/40 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your posture, skin, or streak..."
              className="flex-1 text-xs bg-neutral-900 border border-neutral-850 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 outline-none text-neutral-250 placeholder-neutral-550 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white disabled:bg-neutral-900 disabled:text-neutral-600 transition-colors shrink-0 cursor-pointer"
            >
              <Send size={12} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
