"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Sprout,
  FlaskConical,
  Bug,
  Droplets,
  Landmark,
  CloudSun
} from "lucide-react";
import { CustomInputPanel } from "@/components/forms/custom-input-modal";
import { useUserInput } from "@/components/providers/user-input-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  followUps?: string[];
}

export default function CopilotPage() {
  const { farm, activeCropCycle, cropRisk, inputs } = useUserInput();
  const { language, t, getCropName } = useTranslation();
  const toast = useToast();

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial welcoming AI message on mount or when context changes
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "msg-welcome",
          sender: "ai",
          text: `🌱 **Welcome to AgriRisk AI Copilot!**\n\nI am your real-time agricultural AI assistant connected to your farm in **${inputs.distName}, ${inputs.stateName}**.\n\n• **Active Target Crop:** ${getCropName(inputs.selectedCrop)}\n• **Soil Health:** pH ${inputs.soilPh} · N-P-K ${inputs.nitrogen}-${inputs.phosphorus}-${inputs.potassium} kg/ha\n• **Weather:** ${inputs.temperatureC}°C · ${inputs.rainfallMm}mm rain\n\nAsk me **ANY agricultural question** — from N-P-K fertilizer schedules, pest/disease identification, organic sprays, irrigation, market prices, to PM-KISAN government schemes!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          followUps: [
            `What is the best fertilizer dose for ${getCropName(inputs.selectedCrop)}?`,
            `How to prevent pest attacks in ${inputs.distName}?`,
            `What government subsidies apply in ${inputs.stateName}?`
          ]
        }
      ]);
    }
  }, [inputs.distName, inputs.stateName, inputs.selectedCrop]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Topic Shortcuts
  const topicCategoryChips = [
    { label: "Soil & Fertilizers", icon: FlaskConical, query: `What is the optimal N-P-K fertilizer and compost schedule for soil pH ${inputs.soilPh}?` },
    { label: "Pest & Disease Control", icon: Bug, query: `How to identify and cure common fungal & pest attacks on ${getCropName(inputs.selectedCrop)}?` },
    { label: "Irrigation & Water", icon: Droplets, query: `What is the ideal drip irrigation and watering schedule for ${inputs.rainfallMm}mm rainfall?` },
    { label: "Govt Schemes & MSP", icon: Landmark, query: `What government subsidies (PM-KISAN, PMFBY, Soil Health Card) are active in ${inputs.stateName}?` },
    { label: "Weather Impact", icon: CloudSun, query: `How does ${inputs.temperatureC}°C temperature affect ${getCropName(inputs.selectedCrop)} yield in ${inputs.distName}?` }
  ];

  const handleSend = async (customQuery?: string) => {
    const query = (customQuery || question).trim();
    if (!query || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, newMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          language,
          farmContext: {
            distName: inputs.distName,
            stateName: inputs.stateName,
            selectedCrop: inputs.selectedCrop,
            soilType: inputs.soilType,
            soilPh: inputs.soilPh,
            nitrogen: inputs.nitrogen,
            phosphorus: inputs.phosphorus,
            potassium: inputs.potassium,
            temperatureC: inputs.temperatureC,
            rainfallMm: inputs.rainfallMm,
            waterAvailability: inputs.waterAvailability
          }
        })
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.answer || "AgriRisk AI has processed your query.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        followUps: data.followUps || []
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Copilot API query failed:", err);
      toast.error("Query Failed", "Could not reach AgriRisk AI server.");
    } finally {
      setLoading(false);
    }
  };

  // Voice Speech Recognition (Dictation)
  const toggleVoiceInput = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.warning("Voice Not Supported", "Your browser does not support voice dictation.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === "ta" ? "ta-IN" : language === "te" ? "te-IN" : language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-IN";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setQuestion(transcript);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Text To Speech Audio Reader
  const toggleSpeakText = (msgId: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#•]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === "ta" ? "ta-IN" : language === "te" ? "te-IN" : language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-IN";

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Copy to clipboard
  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    toast.success("Copied!", "Advice copied to clipboard.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Reset conversation
  const handleClearChat = () => {
    setMessages([]);
    toast.info("Chat Reset", "Conversation history cleared.");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-crop">
            <Bot size={16} /> AgriRisk AI Copilot
          </div>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-950">AI Agricultural Assistant</h1>
          <p className="mt-1 text-sm text-slate-600">
            Ask any question on soil health, fertilizer N-P-K, pests, irrigation, or government schemes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleClearChat}>
            <RotateCcw size={14} /> Clear Chat
          </Button>
          <div className="flex items-center gap-1.5 rounded-full border bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-800">
            <Sparkles size={14} className="text-emerald-600 animate-spin" />
            Gemini 2.5 Flash Live
          </div>
        </div>
      </header>

      {/* Farm Context Inputs Modal Panel */}
      <CustomInputPanel />

      {/* Quick Topic Prompts Carousel */}
      <div className="my-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 shrink-0">Quick Topics:</span>
        {topicCategoryChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.query)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-crop hover:bg-crop/10 hover:text-crop active:scale-95 cursor-pointer shrink-0"
          >
            <chip.icon size={14} className="text-crop" />
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Main Chat Interface */}
      <Card className="flex flex-col h-[650px] overflow-hidden border-2 border-crop/30 bg-slate-50/50 shadow-xl p-0">
        {/* Active Farm Context Ribbon */}
        <div className="flex items-center justify-between border-b bg-white px-5 py-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider">Active Context:</span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-800 border">
              📍 {inputs.distName}, {inputs.stateName}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-800 border capitalize">
              🌱 {getCropName(inputs.selectedCrop)}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-800 border">
              🧪 pH {inputs.soilPh} (N-P-K: {inputs.nitrogen}-{inputs.phosphorus}-{inputs.potassium})
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-800 border">
              🌦 {inputs.temperatureC}°C · {inputs.rainfallMm}mm rain
            </span>
          </div>
          <span className="hidden sm:inline text-slate-400 font-medium">{messages.length} Messages</span>
        </div>

        {/* Conversation Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <span className="grid size-9 place-items-center rounded-2xl bg-crop text-white shadow-md shrink-0 mt-1">
                  <Bot size={20} />
                </span>
              )}

              <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm transition-all ${
                msg.sender === "user"
                  ? "bg-crop text-white rounded-tr-none"
                  : "bg-white border border-slate-200 text-slate-900 rounded-tl-none"
              }`}>
                {/* Header info */}
                <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-2 mb-2.5 text-[11px] font-bold">
                  <span className={msg.sender === "user" ? "text-white/80" : "text-slate-500"}>
                    {msg.sender === "user" ? "You (Farmer)" : "AgriRisk AI Copilot"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={msg.sender === "user" ? "text-white/70" : "text-slate-400"}>
                      {msg.timestamp}
                    </span>

                    {msg.sender === "ai" && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleSpeakText(msg.id, msg.text)}
                          className="rounded p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-950 transition-all"
                          title={speakingId === msg.id ? "Stop Reading" : "Read Aloud"}
                        >
                          {speakingId === msg.id ? <VolumeX size={14} className="text-crop" /> : <Volume2 size={14} />}
                        </button>
                        <button
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="rounded p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-950 transition-all"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Body with clean paragraph formatting */}
                <div className={`text-sm leading-relaxed whitespace-pre-line font-normal ${
                  msg.sender === "user" ? "text-white font-medium" : "text-slate-800"
                }`}>
                  {msg.text}
                </div>

                {/* Follow-up Question Chips */}
                {msg.sender === "ai" && msg.followUps && msg.followUps.length > 0 && (
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Suggested Follow-up Questions:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.followUps.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(q)}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-crop hover:bg-crop/10 hover:text-crop transition-all cursor-pointer text-left"
                        >
                          💡 {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <span className="grid size-9 place-items-center rounded-2xl bg-slate-800 text-white shadow-md shrink-0 mt-1">
                  <User size={18} />
                </span>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-2xl bg-crop text-white shadow-md animate-pulse">
                <Bot size={20} />
              </span>
              <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white p-4 text-xs font-semibold text-slate-600 shadow-sm flex items-center gap-2">
                <span className="size-2 rounded-full bg-crop animate-ping" />
                AgriRisk AI is analyzing soil pH, N-P-K, and weather context...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t bg-white p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Microphone Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`grid size-10 shrink-0 place-items-center rounded-xl border transition-all cursor-pointer ${
                isListening
                  ? "border-red-500 bg-red-50 text-red-600 animate-pulse"
                  : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
              title={isListening ? "Listening... Speak your question" : "Speak Question (Voice Input)"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={isListening ? "Listening... Speak now..." : t("copilot.placeholder")}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
            />

            <Button type="submit" loading={loading} disabled={!question.trim() || loading}>
              <Send size={16} /> <span className="hidden sm:inline">{t("copilot.send")}</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
