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

  // Multi-lingual welcome message generator
  const getWelcomeText = (lang: string) => {
    const crop = getCropName(inputs.selectedCrop);
    if (lang === "ta") {
      return `🌱 **அக்ரிரிலாஜிக் AI உதவியாளருக்கு நல்வரவு!**\n\nநான் உங்கள் **${inputs.distName}, ${inputs.stateName}** பண்ணையுடன் இணைக்கப்பட்டுள்ள AI வேளாண் உதவியாளர்.\n\n• **பயிர்:** ${crop}\n• **மண் pH:** ${inputs.soilPh} · **பயிர் வயது:** ${inputs.cropAge || 45} நாட்கள்\n• **வானிலை:** ${inputs.temperatureC}°C · ${inputs.rainfallMm}மிமீ மழை\n\nஉர அளவு, பூச்சி மேலாண்மை, பாசனம் அல்லது அரசு திட்டங்கள் பற்றி எந்த கேள்வியும் கேட்கலாம்!`;
    } else if (lang === "te") {
      return `🌱 **అగ్రిరిస్క్ AI అసిస్టెంట్‌కి స్వాగతం!**\n\nనేను మీ **${inputs.distName}, ${inputs.stateName}** పొలంతో అనుసంధానించబడిన AI వ్యవసాయ సహాయకుడిని.\n\n• **పంట:** ${crop}\n• **నేల pH:** ${inputs.soilPh} · **పంట వయస్సు:** ${inputs.cropAge || 45} రోజులు\n• **వాతావరణం:** ${inputs.temperatureC}°C · ${inputs.rainfallMm}మి.మీ వర్షపాతం\n\nఎరువుల మోతాదు, పురుగుల నివారణ, నీటి పారుదల లేదా ప్రభుత్వ పథకాల గురించి ఏ ప్రశ్లనైనా అడగండి!`;
    } else if (lang === "kn") {
      return `🌱 **ಅಗ್ರಿರಿಸ್ಕ್ AI ಸಹಾಯಕರಾಗಿ ಸುಸ್ವಾಗತ!**\n\nನಾನು ನಿಮ್ಮ **${inputs.distName}, ${inputs.stateName}** ಹೊಲಕ್ಕೆ ಸಂಪರ್ಕಗೊಂಡಿರುವ AI ಕೃಷಿ ಸಹಾಯಕರಾಗಿದ್ದೇನೆ.\n\n• **ಬೆಳೆ:** ${crop}\n• **ಮಣ್ಣಿನ pH:** ${inputs.soilPh} · **ಬೆಳೆಯ ವಯಸ್ಸು:** ${inputs.cropAge || 45} ದಿನಗಳು\n• **ಹವಾಮಾನ:** ${inputs.temperatureC}°C · ${inputs.rainfallMm}ಮಿಮೀ ಮಳೆ\n\nಗೊಬ್ಬರದ ಪ್ರಮಾಣ, ಕೀಟ ನಿಯಂತ್ರಣ ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ!`;
    } else if (lang === "hi") {
      return `🌱 **एग्रीरिस्क AI सहायक में आपका स्वागत है!**\n\nमैं **${inputs.distName}, ${inputs.stateName}** के आपके खेत से जुड़ा कृषि AI सहायक हूँ।\n\n• **फसल:** ${crop}\n• **मिट्टी pH:** ${inputs.soilPh} · **फसल की उम्र:** ${inputs.cropAge || 45} दिन\n• **मौसम:** ${inputs.temperatureC}°C · ${inputs.rainfallMm}मीमी बारिश\n\nउर्वरक मात्रा, कीट नियंत्रण, सिंचाई या सरकारी योजनाओं के बारे में कोई भी प्रश्न पूछें!`;
    }
    return `🌱 **Welcome to AgriRisk AI Copilot!**\n\nI am your real-time agricultural AI assistant connected to your farm in **${inputs.distName}, ${inputs.stateName}**.\n\n• **Active Target Crop:** ${crop}\n• **Soil & Crop Status:** pH ${inputs.soilPh} · Crop Age ${inputs.cropAge || 45} Days\n• **Weather:** ${inputs.temperatureC}°C · ${inputs.rainfallMm}mm rain\n\nAsk me **ANY agricultural question** — from fertilizer schedules, pest/disease identification, organic sprays, irrigation, market prices, to PM-KISAN government schemes!`;
  };

  const getWelcomeFollowUps = (lang: string) => {
    const crop = getCropName(inputs.selectedCrop);
    if (lang === "ta") return [`${crop} பயிருக்கு உகந்த உரம் எது?`, `${inputs.distName} பகுதியில் பூச்சி தாக்குதலை தடுப்பது எப்படி?`, `அரசு பயிர் காப்பீடு பெறுவது எப்படி?`];
    if (lang === "te") return [`${crop} పంటకు అనుకూలమైన ఎరువులు ఏమిటి?`, `${inputs.distName} లో తెగుళ్లను ఎలా అరికట్టాలి?`, `ప్రభుత్వ పంటల భీమా పథకం వివరాలు?`];
    if (lang === "kn") return [`${crop} ಬೆಳೆಗೆ ಉತ್ತಮ ಗೊಬ್ಬರ ಯಾವುದು?`, `${inputs.distName} ನಲ್ಲಿ ಕೀಟ ನಿಯಂತ್ರಣ ಹೇಗೆ?`, `ಸರ್ಕಾರಿ ಬೆಳೆ ವಿಮೆ ವಿವರಗಳು?`];
    if (lang === "hi") return [`${crop} के लिए सबसे अच्छी खाद कौन सी है?`, `${inputs.distName} में कीटों से बचाव कैसे करें?`, `सरकारी फसल बीमा योजना की जानकारी?`];
    return [`What is the best fertilizer dose for ${crop}?`, `How to prevent pest attacks in ${inputs.distName}?`, `What government subsidies apply in ${inputs.stateName}?`];
  };

  // Re-generate welcome message whenever language or context updates
  useEffect(() => {
    setMessages([
      {
        id: "msg-welcome",
        sender: "ai",
        text: getWelcomeText(language),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        followUps: getWelcomeFollowUps(language)
      }
    ]);
  }, [language, inputs.distName, inputs.stateName, inputs.selectedCrop]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Topic Shortcuts per language
  const getTopicCategoryChips = (lang: string) => {
    const crop = getCropName(inputs.selectedCrop);
    if (lang === "ta") {
      return [
        { label: "மண் & உரம்", icon: FlaskConical, query: `${crop} பயிருக்கு pH ${inputs.soilPh} மண்ணிற்கு உகந்த N-P-K உரம் அளவு என்ன?` },
        { label: "பூச்சி மேலாண்மை", icon: Bug, query: `${crop} பயிரில் இலை மஞ்சள் நிறமாவதை தடுப்பது எப்படி?` },
        { label: "நீர்ப்பாசனம்", icon: Droplets, query: `${inputs.rainfallMm}மிமீ மழையளவுக்கு ஏற்ற பாசன முறை என்ன?` },
        { label: "அரசு திட்டங்கள்", icon: Landmark, query: `${inputs.stateName} மாநிலத்தில் உள்ள விவசாய அரசு திட்டங்கள் யாவை?` },
        { label: "வானிலை தாக்கம்", icon: CloudSun, query: `${inputs.temperatureC}°C வெப்பநிலை ${crop} பயிரை எவ்வாறு பாதிக்கும்?` }
      ];
    } else if (lang === "te") {
      return [
        { label: "నేల & ఎరువులు", icon: FlaskConical, query: `${crop} పంటకు నేల pH ${inputs.soilPh} వద్ద ఎరువుల మోతాదు ఎంత?` },
        { label: "తెగుళ్ల నివారణ", icon: Bug, query: `${crop} పంటలో ఆకులు పసుపు రంగులోకి మారితే ఏం చేయాలి?` },
        { label: "నీటి యాజమాన్యం", icon: Droplets, query: `${inputs.rainfallMm}మి.మీ వర్షపాతానికి అనుకూలమైన నీటి పారుదల?` },
        { label: "ప్రభుత్వ పథకాలు", icon: Landmark, query: `${inputs.stateName} లో రైతులకు అందుబాటులో ఉన్న పథకాలు?` },
        { label: "వాతావరణ ముప్పు", icon: CloudSun, query: `${inputs.temperatureC}°C ఉష్ణోగ్రత ${crop} పంటపై చూపించే ప్రభావం?` }
      ];
    } else if (lang === "hi") {
      return [
        { label: "मिट्टी और उर्वरक", icon: FlaskConical, query: `${crop} के लिए मिट्टी pH ${inputs.soilPh} पर सही N-P-K मात्रा क्या है?` },
        { label: "कीट नियंत्रण", icon: Bug, query: `${crop} में पीली पत्तियों का इलाज और कीट नियंत्रण कैसे करें?` },
        { label: "सिंचाई प्रबंधन", icon: Droplets, query: `${inputs.rainfallMm}मीमी बारिश के लिए आदर्श सिंचाई अनुसूची क्या है?` },
        { label: "सरकारी योजनाएं", icon: Landmark, query: `${inputs.stateName} में किसानों के लिए प्रमुख योजनाएं कौन सी हैं?` },
        { label: "मौसम प्रभाव", icon: CloudSun, query: `${inputs.temperatureC}°C तापमान का ${crop} पैदावार पर क्या प्रभाव पड़ेगा?` }
      ];
    }
    return [
      { label: "Soil & Fertilizers", icon: FlaskConical, query: `What is the optimal N-P-K fertilizer schedule for soil pH ${inputs.soilPh}?` },
      { label: "Pest & Disease Control", icon: Bug, query: `How to identify and cure common fungal & pest attacks on ${crop}?` },
      { label: "Irrigation & Water", icon: Droplets, query: `What is the ideal drip irrigation and watering schedule for ${inputs.rainfallMm}mm rainfall?` },
      { label: "Govt Schemes & MSP", icon: Landmark, query: `What government subsidies (PM-KISAN, PMFBY) are active in ${inputs.stateName}?` },
      { label: "Weather Impact", icon: CloudSun, query: `How does ${inputs.temperatureC}°C temperature affect ${crop} yield in ${inputs.distName}?` }
    ];
  };

  const topicCategoryChips = getTopicCategoryChips(language);

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
            cropAge: inputs.cropAge || 45,
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
            <Bot size={16} /> AgriRisk AI Copilot ({language.toUpperCase()})
          </div>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-950">{t("copilot.title")}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {t("copilot.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleClearChat}>
            <RotateCcw size={14} /> Clear Chat
          </Button>
          <div className="flex items-center gap-1.5 rounded-full border bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-800">
            <Sparkles size={14} className="text-emerald-600 animate-spin" />
            Gemini 2.5 Flash Live ({language.toUpperCase()})
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
              🧪 pH {inputs.soilPh} · Crop Age: {inputs.cropAge || 45} Days
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
                AgriRisk AI is analyzing soil pH, N-P-K, and weather context in {language.toUpperCase()}...
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
