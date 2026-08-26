"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  RefreshCw, 
  User, 
  MessageSquare, 
  ChevronDown,
  Minimize2
} from "lucide-react";
import { useUserInput } from "@/components/providers/user-input-provider";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export function FloatingCopilot() {
  const { inputs } = useUserInput();
  const { language, getCropName } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting = language === "te"
    ? `నమస్కారం! నేను మీ AgriRisk AI అసిస్టెంట్‌ని. మీ పొలం (${inputs.farmName}), పంట (${getCropName(inputs.selectedCrop)}), నేల pH (${inputs.soilPh}), మరియు పంట వయస్సు (${inputs.cropAge || 45} రోజులు) ఆధారంగా ఎలాంటి వ్యవసాయ ప్రశ్నలకైనా సమాధానం ఇస్తాను.`
    : language === "ta"
    ? `வணக்கம்! நான் உங்கள் AgriRisk AI உதவியாளர். உங்கள் பண்ணை (${inputs.farmName}), பயிர் (${getCropName(inputs.selectedCrop)}), மண் pH (${inputs.soilPh}), மற்றும் பயிர் வயது (${inputs.cropAge || 45} நாட்கள்) அடிப்படையில் எந்த விவசாய கேள்விக்கம் பதிலளிக்க தயாராக உள்ளேன்.`
    : language === "hi"
    ? `नमस्ते! मैं आपका AgriRisk AI सहायक हूँ। आपके खेत (${inputs.farmName}), फसल (${getCropName(inputs.selectedCrop)}), और मिट्टी pH (${inputs.soilPh}) के अनुसार कृषि संबंधी प्रश्नों के उत्तर देने के लिए तैयार हूँ।`
    : language === "kn"
    ? `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AgriRisk AI ಸಹಾಯಕ. ನಿಮ್ಮ ಹೊಲ (${inputs.farmName}), ಬೆಳೆ (${getCropName(inputs.selectedCrop)}), ಮಣ್ಣಿನ pH (${inputs.soilPh}) ಆಧಾರದ ಮೇಲೆ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಲು ಸಿದ್ಧನಿದ್ದೇನೆ.`
    : `Hello! I'm your AgriRisk AI Assistant powered by Gemini 2.5 Flash. I am synced with your farm profile (${inputs.farmName} in ${inputs.distName}, ${inputs.stateName}) growing ${getCropName(inputs.selectedCrop)} (Soil pH: ${inputs.soilPh}, Crop Age: ${inputs.cropAge || 45} Days). Ask me any agricultural or risk question!`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customQuery?: string) => {
    const query = customQuery || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          context: {
            farmName: inputs.farmName,
            selectedCrop: inputs.selectedCrop,
            soilPh: inputs.soilPh,
            cropAge: inputs.cropAge || 45,
            district: inputs.distName,
            state: inputs.stateName,
            waterAvailability: inputs.waterAvailability,
            temperatureC: inputs.temperatureC,
            rainfallMm: inputs.rainfallMm,
            language
          }
        })
      });

      const data = await response.json();
      const aiReply = data?.reply || "I apologize, I could not complete the analysis. Please verify your connection.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "I encountered a network timeout while contacting Gemini 2.5 Flash. Please retry.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    language === "te" ? `నా పంటకు ఈ వయస్సులో ఏ ఎరువులు వాడాలి?` : `Best fertilizer for ${getCropName(inputs.selectedCrop)} at age ${inputs.cropAge || 45} days?`,
    language === "te" ? `చీడపీడల నివారణ సూచనలు తెలపండి` : `How to reduce pest & disease risk in ${inputs.distName}?`,
    language === "te" ? `ఈ నేల pH (${inputs.soilPh}) కి ఇంకా ఏ మంచి పంటలు వేయవచ్చు?` : `Alternative crop for soil pH ${inputs.soilPh}?`
  ];

  return (
    <>
      {/* Floating Action Button at Bottom Right */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-4 sm:right-6 z-50 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-crop to-teal-700 px-4 py-3 text-white shadow-2xl shadow-crop/40 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-emerald-500/20"
          aria-label="Open AI Assistant"
        >
          <div className="relative grid size-7 place-items-center rounded-full bg-white/20">
            <Bot size={18} className="animate-bounce" />
            <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-amber-400 ring-2 ring-emerald-700" />
          </div>
          <span className="text-xs font-extrabold tracking-tight pr-1 hidden sm:inline">AI Copilot</span>
        </button>
      )}

      {/* Floating Chat Modal Box */}
      {isOpen && (
        <div className="fixed bottom-4 right-3 sm:right-6 z-50 flex flex-col w-[94vw] sm:w-[420px] max-h-[580px] h-[82vh] sm:h-[540px] rounded-2xl border border-slate-700/80 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-xl bg-crop text-white shadow-md">
                <Sparkles size={16} />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-white leading-none">AgriRisk AI Assistant</h3>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-tight block">Gemini 2.5 Flash · Live Farm Context</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([
                  {
                    id: `reset-${Date.now()}`,
                    sender: "ai",
                    text: initialGreeting,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  }
                ])}
                className="grid size-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                title="Reset Chat"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="grid size-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                title="Minimize"
              >
                <Minimize2 size={16} />
              </button>
            </div>
          </div>

          {/* Quick Context Summary Pill */}
          <div className="bg-slate-800/80 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-slate-300">
            <span className="truncate">🌾 {getCropName(inputs.selectedCrop)} ({inputs.cropAge || 45}d) · pH {inputs.soilPh}</span>
            <span className="text-emerald-400 shrink-0">📍 {inputs.distName}</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 no-scrollbar bg-slate-900/95">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <span className="grid size-7 place-items-center rounded-lg bg-crop text-white text-xs shrink-0 mt-0.5 shadow-sm">
                    <Bot size={15} />
                  </span>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs font-medium leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-crop text-white rounded-br-none shadow-md"
                      : "bg-slate-800 border border-slate-700/80 text-slate-100 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className={`block text-[9px] mt-1 font-semibold ${msg.sender === "user" ? "text-emerald-100 text-right" : "text-slate-400"}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <span className="grid size-7 place-items-center rounded-lg bg-slate-700 text-white text-xs shrink-0 mt-0.5">
                    <User size={15} />
                  </span>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 max-w-[220px]">
                <Sparkles size={14} className="animate-spin text-crop" />
                <span>Analysing with Gemini 2.5...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Prompts */}
          <div className="px-3 py-1.5 bg-slate-950/80 border-t border-slate-800 flex overflow-x-auto gap-1.5 no-scrollbar">
            {quickPrompts.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(promptText)}
                disabled={loading}
                className="whitespace-nowrap text-[10px] font-extrabold text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 hover:bg-emerald-900/60 px-2.5 py-1 rounded-full cursor-pointer shrink-0 transition-colors"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your crop..."
              className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-medium text-white placeholder-slate-400 focus:border-crop focus:outline-none focus:ring-1 focus:ring-crop"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="grid size-8 place-items-center rounded-xl bg-crop text-white hover:bg-crop-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer shrink-0"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
