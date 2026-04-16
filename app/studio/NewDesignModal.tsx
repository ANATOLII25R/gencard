"use client";
import React, { useState } from "react";
import { X, Search } from "lucide-react";

interface NewDesignModalProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate?: (template: DesignTemplate) => void;
}

interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  image: string;
}

const DS = {
  bg: "#080B12",
  card: "#111827",
  border: "#1E293B",
  accent: "#6366F1",
  accentGl: "rgba(99,102,241,0.15)",
  textPri: "#F8FAFC",
  textSec: "#94A3B8",
  textMut: "#475569",
  green: "#10B981",
};

const CATEGORIES = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "presentations", label: "Presentazioni", icon: "📑" },
  { id: "social", label: "Social Media", icon: "📱" },
  { id: "photo", label: "Photo Editor", icon: "🖼️" },
  { id: "video", label: "Video", icon: "🎬" },
  { id: "print", label: "Stampa", icon: "🖨️" },
  { id: "docs", label: "Documenti", icon: "📄" },
  { id: "boards", label: "Lavagne Online", icon: "📋" },
  { id: "sheets", label: "Fogli", icon: "📈" },
  { id: "websites", label: "Siti Web", icon: "🌐" },
  { id: "email", label: "Email", icon: "💌" },
];

const QUICK_ACTIONS = [
  { id: 1, name: "Registrazione schermo", icon: "📸", color: "from-orange-500 to-red-500", circleBg: ["#F97316", "#DC2626"] },
  { id: 2, name: "Canva Code", icon: "💻", color: "from-blue-500 to-cyan-500", circleBg: ["#0EA5E9", "#0D9488"] },
  { id: 3, name: "Testo magico", icon: "✍️", color: "from-cyan-500 to-blue-500", circleBg: ["#6366F1", "#8B5CF6"] },
  { id: 4, name: "Rimozione sfondo video", icon: "🎥", color: "from-yellow-500 to-orange-500", circleBg: ["#EAB308", "#F97316"] },
];

const FREQUENTLY_USED = [
  { id: "freq1", name: "Presentazione", image: "📊", color: "from-orange-400 to-orange-600" },
  { id: "freq2", name: "Brochure (Trifold)", image: "📰", color: "from-purple-400 to-purple-600" },
];

const POPULAR = [
  { id: "pop1", name: "Storia Instagram", image: "📱", color: "from-pink-400 to-red-600" },
  { id: "pop2", name: "Post Instagram", image: "🖼️", color: "from-pink-500 to-pink-600" },
  { id: "pop3", name: "Video TikTok", image: "🎬", color: "from-blue-600 to-teal-600" },
  { id: "pop4", name: "Pin Pinterest", image: "📌", color: "from-purple-500 to-purple-600" },
];

export default function NewDesignModal({ open, onClose, onSelectTemplate }: NewDesignModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  if (!open) return null;

  const handleTemplateClick = (template: DesignTemplate) => {
    onSelectTemplate?.(template);
  };

  // Mini SVG previews for Quick Actions
  const QuickActionPreviews: Record<number, React.ReactElement> = {
    1: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="20" r="12" fill="rgba(255,255,255,0.3)" />
        <circle cx="28" cy="20" r="7" fill="rgba(255,255,255,0.6)" />
        <rect x="12" y="36" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />
        <rect x="16" y="42" width="24" height="3" rx="1.5" fill="rgba(255,255,255,0.3)" />
        <circle cx="44" cy="44" r="7" fill="rgba(255,80,50,0.9)" />
        <rect x="41" y="43" width="6" height="2" rx="1" fill="white" />
        <rect x="43" y="41" width="2" height="6" rx="1" fill="white" />
      </svg>
    ),
    2: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect x="10" y="14" width="36" height="28" rx="4" fill="rgba(255,255,255,0.15)" />
        <rect x="14" y="18" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.7)" />
        <rect x="14" y="24" width="20" height="2" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="14" y="29" width="24" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
        <rect x="14" y="34" width="16" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
        <circle cx="44" cy="12" r="8" fill="#10B981" />
        <path d="M41 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    3: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect x="8" y="18" width="40" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
        <rect x="8" y="28" width="32" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
        <rect x="8" y="35" width="24" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
        <path d="M42 32 Q46 28 50 32 Q46 36 42 32Z" fill="rgba(255,255,255,0.7)" />
      </svg>
    ),
    4: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect x="10" y="10" width="36" height="36" rx="4" fill="rgba(255,255,255,0.1)" />
        <ellipse cx="28" cy="22" rx="8" ry="9" fill="rgba(255,255,255,0.25)" />
        <path d="M14 40 Q28 28 42 40" fill="rgba(255,255,255,0.2)" />
        <path d="M20 28 L14 34 M22 30 L16 36" stroke="rgba(255,200,50,0.8)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="42" cy="14" r="7" fill="rgba(255,160,50,0.9)" />
        <path d="M39 14 L41 16 L45 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  // Mini SVG previews for Frequently Used
  const FreqPreviews: Record<string, React.ReactElement> = {
    freq1: (
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
        <rect x="4" y="4" width="112" height="72" rx="6" fill="white" />
        <rect x="10" y="10" width="100" height="8" rx="2" fill="#E2E8F0" />
        <rect x="10" y="22" width="60" height="4" rx="2" fill="#CBD5E1" />
        <path d="M10 65 Q30 40 50 50 Q70 60 90 35 L110 35 L110 65 Z" fill="url(#presGrad)" opacity="0.8" />
        <defs>
          <linearGradient id="presGrad" x1="10" y1="35" x2="10" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F97316" />
            <stop offset="1" stopColor="#EF4444" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <polyline points="10,65 30,45 50,52 70,38 90,35" stroke="#F97316" strokeWidth="2" fill="none" />
      </svg>
    ),
    freq2: (
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
        <rect x="4" y="4" width="35" height="72" rx="4" fill="white" />
        <rect x="43" y="4" width="35" height="72" rx="4" fill="white" />
        <rect x="82" y="4" width="35" height="72" rx="4" fill="white" />
        <rect x="8" y="10" width="27" height="18" rx="3" fill="#E9D5FF" />
        <rect x="8" y="32" width="27" height="4" rx="2" fill="#DDD6FE" />
        <rect x="8" y="39" width="20" height="3" rx="1.5" fill="#EDE9FE" />
        <rect x="47" y="10" width="27" height="10" rx="3" fill="#8B5CF6" />
        <rect x="47" y="24" width="27" height="22" rx="3" fill="#C4B5FD" />
        <rect x="47" y="50" width="27" height="4" rx="2" fill="#DDD6FE" />
        <rect x="86" y="10" width="27" height="26" rx="3" fill="#7C3AED" />
        <rect x="86" y="40" width="27" height="4" rx="2" fill="#DDD6FE" />
        <rect x="86" y="48" width="18" height="3" rx="1.5" fill="#EDE9FE" />
      </svg>
    ),
  };

  // Mini SVG previews for Popular — all uniform 80×120px portrait
  const PopPreviews: Record<string, React.ReactElement> = {
    pop1: (
      <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
        <rect x="2" y="2" width="76" height="116" rx="10" fill="url(#igStoryGrad)" />
        {/* Avatar */}
        <circle cx="40" cy="46" r="20" fill="rgba(255,255,255,0.15)" />
        <circle cx="40" cy="40" r="11" fill="rgba(255,255,255,0.4)" />
        <path d="M18 66 Q40 54 62 66" fill="rgba(255,255,255,0.2)" />
        {/* IG icon top-left */}
        <rect x="8" y="8" width="14" height="14" rx="4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" />
        <circle cx="15" cy="15" r="4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="10" r="1.5" fill="rgba(255,255,255,0.7)" />
        {/* Text lines */}
        <rect x="18" y="95" width="44" height="4" rx="2" fill="rgba(255,255,255,0.75)" />
        <rect x="24" y="103" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.5)" />
        <defs>
          <linearGradient id="igStoryGrad" x1="0" y1="0" x2="80" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F43F5E" />
            <stop offset="0.5" stopColor="#EC4899" />
            <stop offset="1" stopColor="#F97316" />
          </linearGradient>
        </defs>
      </svg>
    ),
    pop2: (
      <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
        <rect x="2" y="2" width="76" height="116" rx="10" fill="url(#igPostGrad)" />
        {/* Square post preview inside */}
        <rect x="10" y="20" width="60" height="60" rx="6" fill="rgba(255,255,255,0.15)" />
        <circle cx="40" cy="46" r="14" fill="rgba(255,255,255,0.3)" />
        <circle cx="40" cy="42" r="8" fill="rgba(255,255,255,0.45)" />
        <path d="M20 74 Q40 62 60 74" fill="rgba(255,255,255,0.2)" />
        {/* IG icon */}
        <rect x="8" y="8" width="12" height="12" rx="3" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" />
        <circle cx="14" cy="14" r="3.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" />
        <circle cx="18" cy="10" r="1.2" fill="rgba(255,255,255,0.7)" />
        {/* Text */}
        <rect x="20" y="95" width="40" height="4" rx="2" fill="rgba(255,255,255,0.75)" />
        <rect x="26" y="103" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.5)" />
        <defs>
          <linearGradient id="igPostGrad" x1="0" y1="0" x2="80" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EC4899" />
            <stop offset="1" stopColor="#BE185D" />
          </linearGradient>
        </defs>
      </svg>
    ),
    pop3: (
      <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
        <rect x="2" y="2" width="76" height="116" rx="10" fill="url(#ttGrad)" />
        {/* Person silhouette */}
        <circle cx="40" cy="44" r="20" fill="rgba(255,255,255,0.15)" />
        <circle cx="40" cy="38" r="11" fill="rgba(255,255,255,0.35)" />
        <path d="M18 65 Q40 53 62 65" fill="rgba(255,255,255,0.18)" />
        {/* TikTok note icon */}
        <path d="M52 10 C52 10 58 8 60 14 L56 14 C56 14 55 12 52 12 Z" fill="rgba(255,255,255,0.8)" />
        <rect x="48" y="12" width="4" height="12" rx="2" fill="rgba(255,255,255,0.8)" />
        <circle cx="46" cy="25" r="4" fill="rgba(255,255,255,0.8)" />
        {/* Text */}
        <rect x="18" y="95" width="44" height="4" rx="2" fill="rgba(255,255,255,0.75)" />
        <rect x="24" y="103" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.5)" />
        <defs>
          <linearGradient id="ttGrad" x1="0" y1="0" x2="80" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0D9488" />
            <stop offset="1" stopColor="#0F766E" />
          </linearGradient>
        </defs>
      </svg>
    ),
    pop4: (
      <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
        <rect x="2" y="2" width="76" height="116" rx="10" fill="url(#pinGrad)" />
        {/* Pinterest pin icon */}
        <circle cx="40" cy="38" r="18" fill="rgba(255,255,255,0.2)" />
        <circle cx="40" cy="34" r="10" fill="rgba(255,255,255,0.45)" />
        {/* Pin needle */}
        <line x1="40" y1="56" x2="40" y2="74" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Decorative images grid */}
        <rect x="10" y="80" width="26" height="18" rx="3" fill="rgba(255,255,255,0.15)" />
        <rect x="44" y="80" width="26" height="18" rx="3" fill="rgba(255,255,255,0.15)" />
        {/* Text */}
        <rect x="20" y="103" width="40" height="4" rx="2" fill="rgba(255,255,255,0.75)" />
        <rect x="27" y="110" width="26" height="3" rx="1.5" fill="rgba(255,255,255,0.5)" />
        <defs>
          <linearGradient id="pinGrad" x1="0" y1="0" x2="80" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9333EA" />
            <stop offset="1" stopColor="#6D28D9" />
          </linearGradient>
        </defs>
      </svg>
    ),
  };

  // Render dashboard content
  const renderDashboard = () => (
    <>
      {/* Quick Actions */}
      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: DS.textPri, margin: "0 0 20px 0" }}>
          Azioni rapide
        </h3>
        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() =>
                handleTemplateClick({
                  id: action.id.toString(),
                  name: action.name,
                  category: "quick",
                  image: action.icon,
                })
              }
              style={{
                padding: "0",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                position: "relative",
              }}
            >
              {/* Circle */}
              <div
                style={{
                  width: "88px",
                  height: "88px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${action.circleBg[0]}, ${action.circleBg[1]})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 24px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                }}
              >
                {QuickActionPreviews[action.id]}
              </div>
              {/* Badge */}
              {action.id === 2 && (
                <div
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    background: "linear-gradient(135deg, #10B981, #059669)",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "10px",
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 6px rgba(16,185,129,0.4)",
                  }}
                >
                  Novità
                </div>
              )}
              {/* Label */}
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: DS.textSec,
                  textAlign: "center",
                  maxWidth: "88px",
                  lineHeight: "1.3",
                }}
              >
                {action.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Frequently Used */}
      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: DS.textPri, margin: "0 0 16px 0" }}>
          Usati di frequente
        </h3>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {FREQUENTLY_USED.map((template) => (
            <button
              key={template.id}
              onClick={() =>
                handleTemplateClick({
                  id: template.id,
                  name: template.name,
                  category: "frequent",
                  image: template.image,
                })
              }
              style={{
                padding: "0",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              {/* Card Preview */}
              <div
                style={{
                  width: "160px",
                  height: "110px",
                  borderRadius: "10px",
                  background: "rgba(30, 41, 59, 0.6)",
                  border: `1px solid ${DS.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 10px 24px rgba(0,0,0,0.4)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = DS.accent;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.borderColor = DS.border;
                }}
              >
                {FreqPreviews[template.id]}
              </div>
              <span style={{ fontSize: "13px", fontWeight: 500, color: DS.textSec }}>
                {template.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular */}
      <div>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: DS.textPri, margin: "0 0 16px 0" }}>
          Popolari su GenCard
        </h3>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {POPULAR.map((template) => (
            <button
              key={template.id}
              onClick={() =>
                handleTemplateClick({
                  id: template.id,
                  name: template.name,
                  category: "popular",
                  image: template.image,
                })
              }
              style={{
                padding: "0",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              {/* Card Preview */}
              <div
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(15,23,42,0.5)",
                  border: `1px solid ${DS.border}`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 10px 24px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                {PopPreviews[template.id]}
              </div>
              <span style={{ fontSize: "13px", fontWeight: 500, color: DS.textSec }}>
                {template.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(4px)",
          zIndex: 200,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90vw",
          height: "90vh",
          maxWidth: "1400px",
          maxHeight: "800px",
          background: DS.bg,
          borderRadius: "16px",
          border: `1px solid ${DS.border}`,
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
          zIndex: 201,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: DS.card,
            border: `1px solid ${DS.border}`,
            color: DS.textSec,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = DS.accent;
            e.currentTarget.style.color = DS.textPri;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = DS.border;
            e.currentTarget.style.color = DS.textSec;
          }}
        >
          <X size={20} />
        </button>

        {/* Left Sidebar - Categories */}
        <div
          style={{
            width: "220px",
            background: "rgba(15, 23, 42, 0.8)",
            borderRight: `1px solid ${DS.border}`,
            overflowY: "auto",
            padding: "24px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                background:
                  selectedCategory === cat.id
                    ? `rgba(99, 102, 241, 0.2)`
                    : "transparent",
                border:
                  selectedCategory === cat.id
                    ? `1px solid ${DS.accent}`
                    : "none",
                color:
                  selectedCategory === cat.id ? DS.textPri : DS.textSec,
                fontSize: "13px",
                fontWeight: selectedCategory === cat.id ? 600 : 500,
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== cat.id) {
                  e.currentTarget.style.background = "rgba(99, 102, 241, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== cat.id) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header with Title and Search */}
          <div
            style={{
              padding: "24px",
              borderBottom: `1px solid ${DS.border}`,
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: DS.textPri, whiteSpace: "nowrap" }}>
              Crea un design
            </h2>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: DS.card,
                border: `1px solid ${DS.border}`,
                borderRadius: "10px",
                padding: "10px 16px",
              }}
            >
              <Search size={18} color={DS.accent} />
              <input
                placeholder="Cosa vuoi creare?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: DS.textPri,
                  fontSize: "14px",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Content Scroll */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            {selectedCategory === "dashboard" ? (
              renderDashboard()
            ) : (
              <>
                {/* Quick Actions */}
                <div style={{ marginBottom: "40px" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: DS.textPri,
                      margin: "0 0 16px 0",
                    }}
                  >
                    Azioni veloci
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {QUICK_ACTIONS.map((action) => (
                      <button
                        key={action.id}
                        onClick={() =>
                          handleTemplateClick({
                            id: action.id.toString(),
                            name: action.name,
                            category: "quick",
                            image: action.icon,
                          })
                        }
                        style={{
                          padding: "12px",
                          borderRadius: "10px",
                          background: action.color,
                          border: "none",
                          color: "white",
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.2s",
                          fontWeight: 600,
                          fontSize: "13px",
                          minHeight: "100px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <span style={{ fontSize: "24px" }}>{action.icon}</span>
                        <span>{action.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frequently Used */}
                <div style={{ marginBottom: "40px" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: DS.textPri,
                      margin: "0 0 16px 0",
                    }}
                  >
                    Utilizzati di frequente
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {FREQUENTLY_USED.map((template) => (
                      <button
                        key={template.id}
                        onClick={() =>
                          handleTemplateClick({
                            id: template.id,
                            name: template.name,
                            category: "frequent",
                            image: template.image,
                          })
                        }
                        style={{
                          padding: "0",
                          borderRadius: "10px",
                          background: template.color,
                          border: "none",
                          color: "white",
                          cursor: "pointer",
                          minHeight: "120px",
                          overflow: "hidden",
                          transition: "all 0.2s",
                          position: "relative",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <span style={{ fontSize: "32px" }}>{template.image}</span>
                          <span style={{ fontSize: "12px", fontWeight: 600 }}>{template.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular */}
                <div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: DS.textPri,
                      margin: "0 0 16px 0",
                    }}
                  >
                    Popolare su GenCard
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {POPULAR.map((template) => (
                      <button
                        key={template.id}
                        onClick={() =>
                          handleTemplateClick({
                            id: template.id,
                            name: template.name,
                            category: "popular",
                            image: template.image,
                          })
                        }
                        style={{
                          padding: "0",
                          borderRadius: "10px",
                          background: template.color,
                          border: "none",
                          color: "white",
                          cursor: "pointer",
                          minHeight: "120px",
                          overflow: "hidden",
                          transition: "all 0.2s",
                          position: "relative",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <span style={{ fontSize: "32px" }}>{template.image}</span>
                          <span style={{ fontSize: "12px", fontWeight: 600 }}>{template.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
