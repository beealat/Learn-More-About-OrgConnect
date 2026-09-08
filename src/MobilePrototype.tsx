import { useState, useRef, useCallback, useEffect, createElement as h } from "react";
import orgLogo from "@/imports/794230035_122096708427468563_5524214484385948091_n.jpg";
import CardLogo from "@/imports/CardLogo/index";
import CardLogoALC from "@/imports/CardLogo-1/index";
import OrgLogoPlaceholderAdDU from "@/imports/OrgLogoPlaceholder/index";
import html2canvas from "html2canvas";
import JSZip from "jszip";

function E({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span contentEditable suppressContentEditableWarning className={className} spellCheck={false}>
      {children}
    </span>
  );
}

// ─── NAV ────────────────────────────────────────────────────────────────────

type TabName = "Home" | "Organizations" | "Events" | "Merch" | "Profile";

const NAV_ITEMS: { label: TabName; icon: React.ReactNode }[] = [
  { label: "Home", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg> },
  { label: "Organizations", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg> },
  { label: "Events", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" /></svg> },
  { label: "Merch", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg> },
  { label: "Profile", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg> },
];

// ─── SHARED ─────────────────────────────────────────────────────────────────

const BG = "#020b18";
const CARD_BG = { background: "#0e1e38", border: "1px solid rgba(255,255,255,0.08)" };

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-white font-bold text-sm">{title}</span>
      {onSeeAll && <button onClick={onSeeAll} className="text-xs font-semibold" style={{ color: "#38bdf8" }}>See all</button>}
    </div>
  );
}

// ─── HOME SCREEN ────────────────────────────────────────────────────────────

function OrgCard({ name, tagline, badge, color }: { name: string; tagline: string; badge: string; color: string }) {
  return (
    <div className="flex-shrink-0 w-36 rounded-2xl p-3 flex flex-col gap-2" style={CARD_BG}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm" style={{ background: color, color: "#fff" }}>{name.slice(0, 2).toUpperCase()}</div>
      <E className="text-white text-xs font-bold leading-tight block">{name}</E>
      <E className="text-xs leading-tight block" style={{ color: "rgba(255,255,255,0.5)" }}>{tagline}</E>
      <div className="mt-auto">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}><E>{badge}</E></span>
      </div>
    </div>
  );
}

function EventRow({ month, day, dayName, title, type, time, location, typeColor }: { month: string; day: string; dayName: string; title: string; type: string; time: string; location: string; typeColor: string }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex-shrink-0 w-10 text-center">
        <div className="text-xs font-bold uppercase" style={{ color: "#f5a623" }}><E>{month}</E></div>
        <div className="text-xl font-black text-white leading-none"><E>{day}</E></div>
        <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}><E>{dayName}</E></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <E className="text-white text-sm font-bold leading-tight">{title}</E>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: typeColor + "22", color: typeColor }}><E>{type}</E></span>
        </div>
        <div className="flex items-center gap-1 mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M8 5v3.5l2 1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
          <E className="text-xs">{time}</E>
        </div>
        <div className="flex items-center gap-1 mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z"/></svg>
          <E className="text-xs">{location}</E>
        </div>
      </div>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 self-center"><path d="M6 4l4 4-4 4" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"/></svg>
    </div>
  );
}

function HomeScreen({ onOpenApps, onNav, onOpenNotifs }: { onOpenApps: () => void; onNav: (tab: TabName) => void; onOpenNotifs: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden pb-2" style={{ background: BG }}>

      {/* Header */}
      <div className="px-4 safe-top pb-2 flex items-start justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <img src={orgLogo} alt="OrgConnect" className="rounded-full object-cover flex-shrink-0" style={{ width: 36, height: 36 }} />
          <div>
            <div className="flex items-center gap-0.5">
              <span className="font-black text-base" style={{ color: "#f5a623" }}>Org</span>
              <span className="font-black text-base text-white">Connect</span>
            </div>
          </div>
        </div>
        <button onClick={onOpenNotifs} className="relative w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.07)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
        </button>
      </div>

      {/* Welcome */}
      <div className="px-4 mb-3 flex-shrink-0">
        <div className="font-black text-2xl leading-tight mb-1" style={{ color: "#fff" }}>Welcome, <E className="font-black" style={{ color: "#fff" }}>Juan</E>. 👋</div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Discover organizations, events, and opportunities on your campus.</p>
      </div>

      {/* Search */}
      <div className="px-4 mb-4 flex-shrink-0">
        <div className="flex items-center gap-2 rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Search organizations, events...</span>
        </div>
      </div>

      {/* Quick Access */}
      <div className="px-4 mb-4 flex-shrink-0">
        <div className="font-bold text-sm mb-2" style={{ color: "#fff" }}>Quick Access</div>
        <div className="flex gap-2">
          {([
            { label: "Organizations", tab: "Organizations" as TabName, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
            { label: "Events", tab: "Events" as TabName, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
            { label: "Applications", tab: null, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/></svg> },
            { label: "Merch & Deals", tab: "Merch" as TabName, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
          ] as { label: string; tab: TabName | null; icon: React.ReactNode }[]).map(item => (
            <button
              key={item.label}
              onClick={() => item.tab ? onNav(item.tab) : onOpenApps()}
              className="flex-1 rounded-2xl flex flex-col items-center justify-center gap-2 text-center py-4 px-1"
              style={{ background: "#0e1e38", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {item.icon}
              <span className="font-bold leading-tight" style={{ fontSize: 9, color: "#fff" }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Organizations */}
      <div className="px-4 mb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-sm" style={{ color: "#fff" }}>Featured Organizations</span>
          <button onClick={() => onNav("Organizations")} className="text-xs font-semibold" style={{ color: "#38bdf8" }}>See all</button>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { name: "Ateneo Libulan Circle (ALC)", desc: "Open for LGBT and allies." },
            { name: "AdDU CRCY", desc: "Serving humanity. Saving lives." },
            { name: "PIGLASAPAT", desc: "A premier socio-civic, political, and leadership org." },
          ].map(org => (
            <div key={org.name} className="rounded-xl p-3 flex items-center gap-3" style={{ background: "#ffffff" }}>
              <OrgLogo name={org.name} size={44} />
              <div className="flex-1 min-w-0">
                <div className="font-black text-sm leading-tight" style={{ color: "#0d1b3e" }}>{org.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>{org.desc}</div>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded-lg flex-shrink-0" style={{ background: "#dbeafe", color: "#2563eb" }}>OPEN</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="px-4 mb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-sm" style={{ color: "#fff" }}>Upcoming Events</span>
          <button onClick={() => onNav("Events")} className="text-xs font-semibold" style={{ color: "#38bdf8" }}>See all</button>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ background: "#ffffff" }}>
          <div className="flex">
            <div className="flex flex-col items-center justify-center px-4 py-4 flex-shrink-0" style={{ background: "#0d1b3e", minWidth: 66 }}>
              <span className="text-xs font-bold uppercase" style={{ color: "#f5a623" }}>AUG</span>
              <span className="font-black text-white leading-none text-2xl">29</span>
              <span className="text-xs font-bold text-white opacity-60">FRI</span>
            </div>
            <div className="flex-1 px-3 py-3">
              <div className="font-black text-sm mb-1" style={{ color: "#0d1b3e" }}>Org Fair 2026</div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#dbeafe", color: "#2563eb" }}>Campus Event</span>
              <div className="flex items-center gap-1 mt-2" style={{ color: "#64748b" }}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M8 5v3.5l2 1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                <span className="text-xs">9:00 AM – 4:00 PM · Bapa Benny Auditorium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── ORGANIZATIONS SCREEN ───────────────────────────────────────────────────

const ORGS = [
  { name: "PIGLASAPAT", category: "Socio-civic", desc: "A premier socio-civic, political, and leadership student organization.", status: "Open", color: "#f5a623", bg: "#1a2a52" },
  { name: "AdDU CRCY", category: "Service", desc: "Serving humanity. Saving lives.", status: "Open", color: "#ef4444", bg: "#1a2a52" },
  { name: "Ateneo Libulan Circle (ALC)", category: "Advocacy", desc: "Open for LGBT and allies.", status: "Open", color: "#8b5cf6", bg: "#1a2a52" },
  { name: "JFINEX AdDU", category: "Finance", desc: "Empowering the next generation of entrepreneurs.", status: "Open", color: "#f59e0b", bg: "#1a2a52" },
  { name: "Ateneo Debate Society", category: "Academic", desc: "Building critical thinkers and effective communicators.", status: "Open", color: "#38bdf8", bg: "#1a2a52" },
  { name: "BMS (Blue Marketing Society)", category: "Academic", desc: "Developing future marketing leaders.", status: "Open", color: "#6366f1", bg: "#1a2a52" },
  { name: "Photography Club", category: "Arts", desc: "Capturing moments that matter on campus.", status: "Closed", color: "#f472b6", bg: "#1a2a52" },
  { name: "Computer Society", category: "Tech", desc: "Where code meets community.", status: "Open", color: "#10b981", bg: "#1a2a52" },
  { name: "Dance Troupe", category: "Arts", desc: "Performing arts collective open for auditions.", status: "Auditions", color: "#fb923c", bg: "#1a2a52" },
];

const ORG_CATEGORIES = ["All Categories", "Academic", "Service", "Arts", "Tech", "Advocacy", "Socio-civic", "Finance"];
const ORG_STATUSES = ["All Status", "Open", "Closed", "Auditions"];

const ORG_IMAGES: Record<string, string> = {
  "PIGLASAPAT": "https://images.unsplash.com/photo-1557401622-cfc0aa5d146c?w=200&h=200&fit=crop",
  "AdDU CRCY": "https://images.unsplash.com/photo-1783028104792-8506735c0383?w=200&h=200&fit=crop",
  "Ateneo Libulan Circle (ALC)": "https://images.unsplash.com/photo-1566835770430-27dde2eb4367?w=200&h=200&fit=crop",
  "JFINEX AdDU": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop",
  "Ateneo Debate Society": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=200&h=200&fit=crop",
  "BMS (Blue Marketing Society)": "https://images.unsplash.com/photo-1758873272540-439a105db676?w=200&h=200&fit=crop",
  "Photography Club": "https://images.unsplash.com/photo-1724011015356-f65e60cc4448?w=200&h=200&fit=crop",
  "Computer Society": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=200&fit=crop",
  "Dance Troupe": "https://images.unsplash.com/photo-1495791185843-c73f2269f669?w=200&h=200&fit=crop",
  "Math Society": "https://images.unsplash.com/photo-1758873268877-3cd8ed329ed8?w=200&h=200&fit=crop",
};

function OrgLogo({ name, size = 56 }: { name: string; size?: number }) {
  const radius = size * 0.18;

  if (name === "PIGLASAPAT") {
    return (
      <div style={{ width: size, height: size, borderRadius: radius, overflow: "hidden", flexShrink: 0 }}>
        <CardLogo />
      </div>
    );
  }

  if (name === "Ateneo Libulan Circle (ALC)") {
    return (
      <div style={{ width: size, height: size, borderRadius: radius, overflow: "hidden", flexShrink: 0 }}>
        <CardLogoALC />
      </div>
    );
  }

  if (name === "AdDU CRCY") {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
        <OrgLogoPlaceholderAdDU />
      </div>
    );
  }

  const img = ORG_IMAGES[name];
  if (img) {
    return (
      <img
        src={img}
        alt={name}
        style={{ width: size, height: size, borderRadius: radius, objectFit: "cover", flexShrink: 0 }}
      />
    );
  }

  return (
    <div className="flex items-center justify-center font-black" style={{ width: size, height: size, borderRadius: radius, background: "#334155", color: "#fff", fontSize: size * 0.25, flexShrink: 0 }}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function OrgLogoPlaceholder({ name }: { name: string; color?: string }) {
  return <OrgLogo name={name} size={56} />;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    Open: { bg: "#10b981", text: "#fff" },
    Closed: { bg: "#ef4444", text: "#fff" },
    Auditions: { bg: "#f5a623", text: "${BG}" },
  };
  const c = colors[status] ?? { bg: "#6b7280", text: "#fff" };
  return (
    <span className="text-xs font-black px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ background: c.bg, color: c.text, letterSpacing: "0.04em" }}>
      {status.toUpperCase()}
    </span>
  );
}

function OrganizationsScreen({ onSelect }: { onSelect: (org: typeof ORGS[0]) => void }) {
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [search, setSearch] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const filtered = ORGS.filter(o =>
    (category === "All Categories" || o.category === category) &&
    (status === "All Status" || o.status === status) &&
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BG }}>
      {/* Header */}
      <div className="px-4 safe-top pb-3 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-white font-black text-xl">Organizations</h2>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search organizations..." className="bg-transparent flex-1 text-sm text-white placeholder:text-white/30 outline-none" />
        </div>

        {/* Dropdowns */}
        <div className="flex gap-2 relative">
          {/* Category dropdown */}
          <div className="relative flex-1">
            <button onClick={() => { setCatOpen(!catOpen); setStatusOpen(false); }} className="w-full flex items-center justify-between gap-1 rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: category !== "All Categories" ? "#f5a623" : "rgba(255,255,255,0.7)" }}>
              <span className="truncate">{category}</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ transform: catOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-20" style={{ background: "#1e2f5a", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                {ORG_CATEGORIES.map(c => (
                  <button key={c} onClick={() => { setCategory(c); setCatOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-semibold transition-colors" style={{ color: category === c ? "#f5a623" : "rgba(255,255,255,0.7)", background: category === c ? "rgba(245,166,35,0.1)" : "transparent" }}>{c}</button>
                ))}
              </div>
            )}
          </div>

          {/* Status dropdown */}
          <div className="relative flex-1">
            <button onClick={() => { setStatusOpen(!statusOpen); setCatOpen(false); }} className="w-full flex items-center justify-between gap-1 rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: status !== "All Status" ? "#f5a623" : "rgba(255,255,255,0.7)" }}>
              <span className="truncate">{status}</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ transform: statusOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
            </button>
            {statusOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-20" style={{ background: "#1e2f5a", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                {ORG_STATUSES.map(s => (
                  <button key={s} onClick={() => { setStatus(s); setStatusOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-semibold transition-colors" style={{ color: status === s ? "#f5a623" : "rgba(255,255,255,0.7)", background: status === s ? "rgba(245,166,35,0.1)" : "transparent" }}>{s}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-4 flex flex-col gap-2">
        {filtered.map(org => (
          <button key={org.name} onClick={() => onSelect(org)} className="rounded-2xl p-3 flex items-center gap-3 text-left w-full" style={{ background: "#0e1c35", border: "1px solid rgba(255,255,255,0.07)" }}>
            <OrgLogoPlaceholder name={org.name} color={org.color} />
            <div className="flex-1 min-w-0">
              <div className="text-white font-black text-sm leading-tight">{org.name}</div>
              <div className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{org.desc}</div>
            </div>
            <StatusBadge status={org.status} />
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="rgba(255,255,255,0.15)"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>No organizations found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ORG DETAIL SCREEN ──────────────────────────────────────────────────────

// ─── APPLY SCREEN ───────────────────────────────────────────────────────────

const APPLY_STEPS = ["Personal Info", "Letter of Intent", "Availability", "Review"];

function ApplyScreen({ org, onBack, onSubmit }: { org: typeof ORGS[0]; onBack: () => void; onSubmit: () => void }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nickname: "",
    year: "",
    course: "",
    phone: "",
    why: "",
    skills: "",
    days: [] as string[],
    times: [] as string[],
    commitment: "",
  });

  const update = (k: keyof typeof form, v: string | string[]) => setForm(f => ({ ...f, [k]: v }));
  const toggleArr = (k: "days" | "times", v: string) => {
    update(k, form[k].includes(v) ? form[k].filter(x => x !== v) : [...form[k], v]);
  };

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-5" style={{ background: BG }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: org.color + "25", border: `2px solid ${org.color}` }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill={org.color}><path d="M9 16.2l-4.2-4.2-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
        </div>
        <div className="text-white font-black text-xl text-center">Application Submitted!</div>
        <div className="text-sm text-center leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
          Your application to <span className="font-bold text-white">{org.name}</span> has been received. We'll notify you once they review it.
        </div>
        <div className="rounded-2xl p-4 w-full" style={CARD_BG}>
          <div className="text-xs font-bold mb-3" style={{ color: org.color }}>WHAT HAPPENS NEXT</div>
          {["Application under review (3–5 days)", "Email/SMS notification sent to you", "Interview scheduled if shortlisted", "Final decision released"].map((s, i) => (
            <div key={s} className="flex items-start gap-3 py-2" style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-black" style={{ background: org.color + "30", color: org.color }}>{i + 1}</div>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{s}</span>
            </div>
          ))}
        </div>
        <button onClick={onSubmit} className="w-full py-3 rounded-2xl font-black text-sm" style={{ background: org.color, color: "#fff" }}>Back to Organization</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BG }}>
      {/* Header */}
      <div className="flex-shrink-0 px-4 safe-top pb-3">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-white font-black text-base leading-tight">Apply to {org.name}</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>Step {step + 1} of {APPLY_STEPS.length}</div>
          </div>
          <OrgLogo name={org.name} size={40} />
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-1">
          {APPLY_STEPS.map((s, i) => (
            <div key={s} className="flex-1 h-1 rounded-full transition-all" style={{ background: i <= step ? org.color : "rgba(255,255,255,0.1)" }} />
          ))}
        </div>
        <div className="text-xs font-bold" style={{ color: org.color }}>{APPLY_STEPS[step]}</div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-4">

        {/* STEP 0 — Personal Info */}
        {step === 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>Let the org get to know you a little better.</p>
            {[
              { label: "Preferred Nickname", key: "nickname", placeholder: "e.g. Nav" },
              { label: "Year Level", key: "year", placeholder: "e.g. 3rd Year" },
              { label: "Course / Program", key: "course", placeholder: "e.g. BS Computer Science" },
              { label: "Contact Number", key: "phone", placeholder: "e.g. 09XX-XXX-XXXX" },
            ].map(f => (
              <div key={f.key} className="flex flex-col gap-1.5">
                <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.65)" }}>{f.label}</label>
                <input
                  value={form[f.key as keyof typeof form] as string}
                  onChange={e => update(f.key as keyof typeof form, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", caretColor: org.color }}
                />
              </div>
            ))}
          </div>
        )}

        {/* STEP 1 — Letter of Intent */}
        {step === 1 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>Share why you want to join and what you bring to the table.</p>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.65)" }}>Why do you want to join {org.name}?</label>
              <textarea
                value={form.why}
                onChange={e => update("why", e.target.value)}
                rows={5}
                placeholder="Share your motivation and how this org aligns with your goals..."
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", caretColor: org.color }}
              />
              <div className="text-xs text-right" style={{ color: "rgba(255,255,255,0.3)" }}>{form.why.length} / 500</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.65)" }}>Skills or experiences you can contribute</label>
              <textarea
                value={form.skills}
                onChange={e => update("skills", e.target.value)}
                rows={3}
                placeholder="Leadership, design, public speaking, event planning..."
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", caretColor: org.color }}
              />
            </div>
          </div>
        )}

        {/* STEP 2 — Availability */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>Help the org know when you're free for meetings and events.</p>
            <div>
              <div className="text-xs font-bold mb-2" style={{ color: "rgba(255,255,255,0.65)" }}>Available Days</div>
              <div className="flex flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                  <button key={d} onClick={() => toggleArr("days", d)} className="px-3 py-1.5 rounded-full text-xs font-bold transition-all" style={{ background: form.days.includes(d) ? org.color : "rgba(255,255,255,0.07)", color: form.days.includes(d) ? "#fff" : "rgba(255,255,255,0.55)", border: `1px solid ${form.days.includes(d) ? org.color : "rgba(255,255,255,0.1)"}` }}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold mb-2" style={{ color: "rgba(255,255,255,0.65)" }}>Preferred Time Slots</div>
              <div className="flex flex-wrap gap-2">
                {["Morning", "Afternoon", "Evening"].map(t => (
                  <button key={t} onClick={() => toggleArr("times", t)} className="px-3 py-1.5 rounded-full text-xs font-bold transition-all" style={{ background: form.times.includes(t) ? org.color : "rgba(255,255,255,0.07)", color: form.times.includes(t) ? "#fff" : "rgba(255,255,255,0.55)", border: `1px solid ${form.times.includes(t) ? org.color : "rgba(255,255,255,0.1)"}` }}>{t}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.65)" }}>Weekly Commitment Level</div>
              <div className="flex flex-col gap-2">
                {["1–3 hours/week", "4–6 hours/week", "7+ hours/week"].map(c => (
                  <button key={c} onClick={() => update("commitment", c)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all" style={{ background: form.commitment === c ? org.color + "20" : "rgba(255,255,255,0.05)", border: `1px solid ${form.commitment === c ? org.color : "rgba(255,255,255,0.08)"}` }}>
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: form.commitment === c ? org.color : "rgba(255,255,255,0.3)" }}>
                      {form.commitment === c && <div className="w-2 h-2 rounded-full" style={{ background: org.color }} />}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: form.commitment === c ? "#fff" : "rgba(255,255,255,0.6)" }}>{c}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Review */}
        {step === 3 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>Review your application before submitting.</p>
            <div className="rounded-2xl p-3" style={CARD_BG}>
              <div className="text-xs font-bold mb-2" style={{ color: org.color }}>APPLYING TO</div>
              <div className="flex items-center gap-3">
                <OrgLogo name={org.name} size={40} />
                <div>
                  <div className="text-white font-bold text-sm">{org.name}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{org.category}</div>
                </div>
              </div>
            </div>
            {[
              { label: "Personal Info", items: [`${form.nickname || "—"} · ${form.year || "—"}`, `${form.course || "—"}`, `${form.phone || "—"}`] },
              { label: "Letter of Intent", items: [form.why ? form.why.slice(0, 80) + (form.why.length > 80 ? "…" : "") : "—"] },
              { label: "Availability", items: [form.days.length ? form.days.join(", ") : "—", form.times.length ? form.times.join(", ") : "—", form.commitment || "—"] },
            ].map(section => (
              <div key={section.label} className="rounded-2xl p-3" style={CARD_BG}>
                <div className="text-xs font-bold mb-2" style={{ color: org.color }}>{section.label.toUpperCase()}</div>
                {section.items.map((item, i) => <div key={i} className="text-sm py-0.5" style={{ color: item === "—" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.75)" }}>{item}</div>)}
              </div>
            ))}
            <div className="rounded-xl p-3 flex gap-2" style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)" }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#f5a623" className="flex-shrink-0 mt-0.5"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm.75 10.5h-1.5v-5h1.5v5zm0-6.5h-1.5V3.5h1.5V5z"/></svg>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>By submitting, you agree to be contacted by the organization regarding your application.</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav buttons */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2 flex gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 rounded-2xl font-black text-sm" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)" }}>Back</button>
        )}
        <button
          onClick={() => step < APPLY_STEPS.length - 1 ? setStep(s => s + 1) : setSubmitted(true)}
          className="flex-1 py-3 rounded-2xl font-black text-sm"
          style={{ background: org.color, color: "#fff" }}
        >
          {step < APPLY_STEPS.length - 1 ? "Continue →" : "Submit Application"}
        </button>
      </div>
    </div>
  );
}

// ─── ORG DETAIL ─────────────────────────────────────────────────────────────

function OrgDetailScreen({ org, onBack, onApply }: { org: typeof ORGS[0]; onBack: () => void; onApply: () => void }) {
  const [joined, setJoined] = useState(false);
  const tabs = ["About", "Members", "Events"];
  const [tab, setTab] = useState("About");

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BG }}>
      {/* Hero banner */}
      <div className="flex-shrink-0 relative" style={{ background: `linear-gradient(160deg, ${org.color}44 0%, ${BG} 100%)`, paddingBottom: 16 }}>
        <div className="flex items-center gap-3 px-4 safe-top pb-3">
          <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <span className="text-white font-black text-base flex-1 truncate">{org.name}</span>
          <StatusBadge status={org.status} />
        </div>
        <div className="flex items-end gap-4 px-4">
          <OrgLogo name={org.name} size={80} />
          <div className="pb-1">
            <div className="text-white font-black text-lg leading-tight">{org.name}</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{org.category}</div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => setJoined(!joined)} className="px-4 py-1.5 rounded-full text-xs font-black transition-all" style={{ background: joined ? "rgba(255,255,255,0.1)" : org.color, color: joined ? "rgba(255,255,255,0.7)" : "#fff" }}>
                {joined ? "✓ Following" : "+ Follow"}
              </button>
              <button onClick={onApply} className="px-4 py-1.5 rounded-full text-xs font-black" style={{ background: "#f5a623", color: "#020b18" }}>Apply Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex-shrink-0 flex px-4 gap-2 py-3">
        {[{ label: "Members", value: "142" }, { label: "Events", value: "8" }, { label: "Founded", value: "2014" }].map(s => (
          <div key={s.label} className="flex-1 rounded-xl py-2 text-center" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="font-black text-white text-base">{s.value}</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 flex px-4 gap-0 mb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 py-2 text-sm font-bold transition-all" style={{ color: tab === t ? org.color : "rgba(255,255,255,0.35)", borderBottom: tab === t ? `2px solid ${org.color}` : "2px solid transparent" }}>{t}</button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-4">
        {tab === "About" && (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl p-3" style={CARD_BG}>
              <div className="text-xs font-bold mb-1" style={{ color: org.color }}>MISSION</div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{org.desc} We strive to empower every member through meaningful programs and community service.</p>
            </div>
            <div className="rounded-2xl p-3" style={CARD_BG}>
              <div className="text-xs font-bold mb-2" style={{ color: org.color }}>WHAT WE DO</div>
              {["Community outreach programs", "Leadership workshops & seminars", "Annual inter-org competitions", "Campus advocacy campaigns"].map(item => (
                <div key={item} className="flex items-center gap-2 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: org.color }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-3" style={CARD_BG}>
              <div className="text-xs font-bold mb-2" style={{ color: org.color }}>REQUIREMENTS</div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>Open to all college students. Submit a letter of intent and attend the orientation. No minimum GPA required.</p>
            </div>
          </div>
        )}
        {tab === "Members" && (
          <div className="flex flex-col gap-2">
            {[{ name: "Maria Santos", role: "President", initials: "MS" }, { name: "Juan dela Cruz", role: "VP Internal", initials: "JD" }, { name: "Ana Reyes", role: "Secretary", initials: "AR" }, { name: "Carlo Mendoza", role: "Treasurer", initials: "CM" }, { name: "Sofia Garcia", role: "Member", initials: "SG" }, { name: "Liam Torres", role: "Member", initials: "LT" }].map(m => (
              <div key={m.name} className="flex items-center gap-3 rounded-xl p-3" style={CARD_BG}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0" style={{ background: org.color, color: "#fff" }}>{m.initials}</div>
                <div className="flex-1">
                  <div className="text-white font-bold text-sm">{m.name}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "Events" && (
          <div className="flex flex-col gap-2">
            {[{ title: "General Assembly", date: "Sep 5 · 5:30 PM", loc: "Finster AdDU" }, { title: "Leadership Summit", date: "Sep 20 · 9:00 AM", loc: "Arrupe Hall" }, { title: "Community Outreach", date: "Oct 4 · 8:00 AM", loc: "Agdao District" }].map(ev => (
              <div key={ev.title} className="flex gap-3 items-center rounded-xl p-3" style={CARD_BG}>
                <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: org.color }} />
                <div>
                  <div className="text-white font-bold text-sm">{ev.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{ev.date} · {ev.loc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── EVENTS SCREEN ──────────────────────────────────────────────────────────

const EVENTS = [
  { month: "AUG", day: "29", dayName: "FRI", title: "Org Fair 2026", type: "Campus", time: "9:00 AM – 4:00 PM", location: "Bapa Benny Auditorium", typeColor: "#10b981", featured: true },
  { month: "SEP", day: "05", dayName: "FRI", title: "PIGLASAPAT General Assembly", type: "Org", time: "5:30 PM – 7:00 PM", location: "Finster AdDU", typeColor: "#f5a623", featured: false },
  { month: "SEP", day: "12", dayName: "FRI", title: "AdDU CRCY Bloodletting Drive", type: "Org", time: "8:00 AM – 1:00 PM", location: "St. Martin Hall, 4th Floor", typeColor: "#f5a623", featured: false },
  { month: "SEP", day: "18", dayName: "THU", title: "Debate Guild Open Invitational", type: "Academic", time: "1:00 PM – 5:00 PM", location: "Arrupe Hall", typeColor: "#38bdf8", featured: false },
  { month: "SEP", day: "25", dayName: "FRI", title: "Photography Exhibit Opening", type: "Arts", time: "4:00 PM – 7:00 PM", location: "Gallery Wing B", typeColor: "#f472b6", featured: false },
  { month: "OCT", day: "03", dayName: "SAT", title: "CS Hackathon 2026", type: "Tech", time: "8:00 AM – 8:00 PM", location: "Tech Building 3F", typeColor: "#6366f1", featured: false },
];

const PAST_EVENTS = [
  { month: "JUL", day: "20", dayName: "SUN", title: "Leadership Workshop", type: "Organization Event", time: "1:00 PM – 5:00 PM", location: "Room 304, Finster", typeColor: "#6366f1" },
  { month: "JUN", day: "14", dayName: "SAT", title: "JS Dev Bootcamp", type: "Tech", time: "9:00 AM – 5:00 PM", location: "Tech Building 2F", typeColor: "#10b981" },
];

function EventCard({ ev, past = false }: { ev: typeof EVENTS[0]; past?: boolean }) {
  return (
    <div className="rounded-xl flex items-stretch overflow-hidden mb-2" style={{ background: "#ffffff" }}>
      <div className="flex flex-col items-center justify-center px-2.5 py-3 flex-shrink-0" style={{ background: past ? "#374151" : "#0d1b3e", minWidth: 56 }}>
        <span className="font-bold uppercase tracking-wide" style={{ color: past ? "#9ca3af" : "#f5a623", fontSize: 9 }}>{ev.month}</span>
        <span className="font-black leading-none mt-0.5" style={{ color: "#fff", fontSize: 22 }}>{ev.day}</span>
        <span className="font-bold mt-0.5" style={{ color: past ? "#9ca3af" : "rgba(255,255,255,0.6)", fontSize: 9 }}>{ev.dayName}</span>
      </div>
      <div className="flex-1 px-2.5 py-2 min-w-0">
        <div className="flex items-start justify-between gap-1.5 mb-1">
          <span className="font-black text-xs leading-tight" style={{ color: "#0d1b3e" }}>{ev.title}</span>
          <span className="font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap" style={{ background: "#e8eaf6", color: "#3949ab", fontSize: 9 }}>{ev.type}</span>
        </div>
        <div className="flex items-center gap-1 mb-0.5">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" strokeLinecap="round"/></svg>
          <span style={{ color: "#64748b", fontSize: 10 }}>{ev.time}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="#64748b"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          <span style={{ color: "#64748b", fontSize: 10 }}>{ev.location}</span>
        </div>
      </div>
      <div className="flex items-center pr-2.5 flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );
}

function EventsScreen() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [typeFilter, setTypeFilter] = useState("All Events");
  const [dateFilter, setDateFilter] = useState("All Dates");
  const upcoming = EVENTS.filter(e => !e.featured);

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BG }}>
      {/* Header */}
      <div className="px-4 safe-top pb-1 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-black text-xl">Events</h2>
          <div className="flex rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            {(["list", "calendar"] as const).map(v => (
              <button key={v} onClick={() => setView(v)} className="px-3 py-1 text-xs font-semibold capitalize transition-all" style={{ background: view === v ? "#f5a623" : "transparent", color: view === v ? BG : "rgba(255,255,255,0.5)" }}>{v}</button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 mb-1.5" style={{ background: "#0e1e38", border: "1px solid rgba(255,255,255,0.07)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Search events...</span>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-1">
          {[
            { label: typeFilter, opts: ["All Events", "Org", "Academic", "Arts", "Tech"] },
            { label: dateFilter, opts: ["All Dates", "This Week", "This Month", "Next Month"] },
          ].map((f, i) => (
            <button key={i} onClick={() => i === 0 ? setTypeFilter(f.opts[(f.opts.indexOf(f.label) + 1) % f.opts.length]) : setDateFilter(f.opts[(f.opts.indexOf(f.label) + 1) % f.opts.length])}
              className="flex-1 flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
              style={{ background: "#0e1e38", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span>{f.label}</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          ))}
        </div>
      </div>

      {view === "list" ? (
        <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-4">
          {/* Upcoming */}
          <div className="text-white font-black text-xs mb-1.5">Upcoming Events</div>
          {upcoming.map(ev => <EventCard key={ev.title} ev={ev} />)}

          {/* Past */}
          <div className="text-white font-black text-xs mb-1.5 mt-1">Past Events</div>
          {PAST_EVENTS.map(ev => <EventCard key={ev.title} ev={ev as any} past />)}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-4">
          <div className="rounded-2xl p-3" style={CARD_BG}>
            <div className="text-white font-bold text-sm mb-3">September 2026</div>
            <div className="grid grid-cols-7 gap-0.5 mb-2">
              {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} className="text-center text-xs font-semibold py-1" style={{ color: "rgba(255,255,255,0.3)" }}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {[...Array(7)].map((_, i) => <div key={"pad-" + i} />)}
              {[...Array(30)].map((_, i) => {
                const day = i + 1;
                const hasEvent = [5, 12, 18, 25].includes(day);
                const isToday = day === 3;
                return (
                  <div key={day} className="text-center py-1.5 rounded-lg text-xs font-semibold relative" style={{ background: isToday ? "#f5a623" : hasEvent ? "rgba(56,189,248,0.15)" : "transparent", color: isToday ? BG : hasEvent ? "#38bdf8" : "rgba(255,255,255,0.7)" }}>
                    {day}
                    {hasEvent && !isToday && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: "#38bdf8" }} />}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {upcoming.filter(e => [5, 12, 18, 25].includes(Number(e.day))).map(ev => <EventCard key={ev.title} ev={ev} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APPLICATIONS SCREEN ────────────────────────────────────────────────────

// ─── PROFILE SCREEN ─────────────────────────────────────────────────────────

function ProfileScreen({ onOpenApps }: { onOpenApps: () => void }) {
  const CHEVRON = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
  );

  const menuGroup1 = [
    {
      label: "My Applications", onClick: onOpenApps,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/></svg>,
    },
    {
      label: "Saved Organizations", onClick: () => {},
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    },
    {
      label: "Registered Events", onClick: () => {},
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    },
  ];

  const menuGroup2 = [
    {
      label: "Notification Settings", onClick: () => {},
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    },
    {
      label: "Help & Support", onClick: () => {},
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    },
    {
      label: "Log Out", onClick: () => {}, danger: true,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BG }}>
      <div className="flex-1 overflow-y-auto phone-scroll">
        {/* Header */}
        <div className="px-5 safe-top pb-0 flex-shrink-0">
          <h1 className="text-white font-black text-2xl">Profile</h1>
        </div>

        {/* Avatar + info */}
        <div className="flex flex-col items-center pt-6 pb-6 px-5">
          <div className="relative mb-4">
            <div className="rounded-full flex items-center justify-center" style={{ width: 100, height: 100, background: "#162347", border: "3px solid rgba(255,255,255,0.1)" }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#162347", border: "2px solid rgba(255,255,255,0.15)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
          </div>
          <div className="text-white font-black text-2xl mb-1">Juan Dela Cruz</div>
          <div className="text-sm mb-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>BS Information Technology – 3rd Year</div>
          <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>juan.delacruz@addu.edu.ph</div>
        </div>

        {/* Group 1 */}
        <div className="px-4 mb-3">
          <div className="rounded-2xl overflow-hidden" style={{ background: "#0e1e38" }}>
            {menuGroup1.map((item, i) => (
              <button key={item.label} onClick={item.onClick} className="w-full flex items-center gap-4 px-4 py-4 text-left" style={{ borderBottom: i < menuGroup1.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                {item.icon}
                <span className="flex-1 text-white font-semibold text-sm">{item.label}</span>
                {CHEVRON}
              </button>
            ))}
          </div>
        </div>

        {/* Group 2 */}
        <div className="px-4 pb-8">
          <div className="rounded-2xl overflow-hidden" style={{ background: "#0e1e38" }}>
            {menuGroup2.map((item, i) => (
              <button key={item.label} onClick={item.onClick} className="w-full flex items-center gap-4 px-4 py-4 text-left" style={{ borderBottom: i < menuGroup2.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                {item.icon}
                <span className="flex-1 font-semibold text-sm" style={{ color: item.danger ? "#ef4444" : "#fff" }}>{item.label}</span>
                {CHEVRON}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS OVERLAY ──────────────────────────────────────────────────

const NOTIFS = [
  { title: "Org Fair 2026 Tomorrow!", body: "Don't miss the biggest campus event of the year.", time: "1h ago", unread: true },
  { title: "Application Update", body: "Your PIGLASAPAT application moved to Under Review.", time: "3h ago", unread: true },
  { title: "Interview Scheduled", body: "Computer Society interview set for Sep 8, 3PM.", time: "Yesterday", unread: false },
  { title: "New Org: Dance Troupe", body: "Now accepting auditions for 2026-2027.", time: "2d ago", unread: false },
];

// ─── APPLICATIONS SCREEN ────────────────────────────────────────────────────

const APPLICATIONS = [
  { org: "PIGLASAPAT", submitted: "Aug 20", reviewDate: "Aug 22", status: "Under Review", step: 1, color: "#f5a623", category: "Socio-civic" },
  { org: "Computer Society", submitted: "Aug 25", reviewDate: "Aug 28", status: "Interview Scheduled", step: 2, color: "#10b981", category: "Tech" },
  { org: "Photography Club", submitted: "Sep 1", reviewDate: "–", status: "Submitted", step: 0, color: "#f472b6", category: "Arts" },
];

const APP_STATUS_STEPS = ["Submitted", "Under Review", "Interview", "Decision"];

function ApplicationsScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<typeof APPLICATIONS[0] | null>(null);

  if (selected) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BG }}>
        <div className="px-4 safe-top pb-3 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <h2 className="text-white font-black text-lg flex-1">Application Detail</h2>
        </div>
        <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-6 flex flex-col gap-4">
          {/* Org card */}
          <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: selected.color + "18", border: `1px solid ${selected.color}33` }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0" style={{ background: selected.color, color: "#fff" }}>{selected.org.slice(0, 2).toUpperCase()}</div>
            <div>
              <div className="text-white font-black text-base">{selected.org}</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{selected.category} · Submitted {selected.submitted}</div>
              <span className="text-xs font-black px-2 py-0.5 rounded-full mt-1.5 inline-block" style={{ background: selected.color + "25", color: selected.color }}>{selected.status}</span>
            </div>
          </div>

          {/* Full vertical stepper */}
          <div className="rounded-2xl p-4" style={CARD_BG}>
            <div className="text-xs font-bold mb-4" style={{ color: selected.color }}>APPLICATION PROGRESS</div>
            <div className="flex flex-col gap-0">
              {APP_STATUS_STEPS.map((step, i) => {
                const done = i < selected.step;
                const current = i === selected.step;
                const future = i > selected.step;
                return (
                  <div key={step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: done ? "#10b981" : current ? selected.color : "rgba(255,255,255,0.08)", border: current ? `2px solid ${selected.color}` : "none" }}>
                        {done
                          ? <svg width="14" height="14" viewBox="0 0 16 16" fill="white"><path d="M6.5 11.5L3 8l1-1 2.5 2.5 5-5 1 1z"/></svg>
                          : <span className="text-xs font-black" style={{ color: future ? "rgba(255,255,255,0.25)" : "#fff" }}>{i + 1}</span>
                        }
                      </div>
                      {i < APP_STATUS_STEPS.length - 1 && (
                        <div className="w-0.5 h-8" style={{ background: done ? "#10b981" : "rgba(255,255,255,0.07)" }} />
                      )}
                    </div>
                    <div className="pb-6 pt-1">
                      <div className="font-bold text-sm" style={{ color: future ? "rgba(255,255,255,0.3)" : "#fff" }}>{step}</div>
                      <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {done ? (i === 0 ? selected.submitted : selected.reviewDate) : current ? "In progress" : "Pending"}
                      </div>
                      {current && (
                        <div className="mt-2 px-2 py-1 rounded-lg inline-block" style={{ background: selected.color + "20" }}>
                          <span className="text-xs font-semibold" style={{ color: selected.color }}>● Current stage</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Letter of intent preview */}
          <div className="rounded-2xl p-4" style={CARD_BG}>
            <div className="text-xs font-bold mb-2" style={{ color: selected.color }}>YOUR LETTER OF INTENT</div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              "I believe in serving the community and building connections across disciplines. My background in student government and volunteering has prepared me to contribute meaningfully to this organization..."
            </p>
            <button className="text-xs font-semibold mt-2" style={{ color: "#38bdf8" }}>Read full →</button>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl p-4" style={CARD_BG}>
            <div className="text-xs font-bold mb-3" style={{ color: selected.color }}>TIMELINE</div>
            {[
              { label: "Application submitted", date: selected.submitted, done: true },
              { label: "Moved to Under Review", date: selected.reviewDate, done: selected.step >= 1 },
              { label: "Interview scheduled", date: selected.step >= 2 ? "Sep 8, 3:00 PM" : "–", done: selected.step >= 2 },
              { label: "Decision released", date: "–", done: false },
            ].map((ev, i) => (
              <div key={ev.label} className="flex gap-3 items-start py-2" style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: ev.done ? "#10b981" : "rgba(255,255,255,0.2)" }} />
                <div className="flex-1">
                  <div className="text-sm" style={{ color: ev.done ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)" }}>{ev.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: ev.done ? "#10b981" : "rgba(255,255,255,0.2)" }}>{ev.date}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-3 rounded-2xl font-bold text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
            Withdraw Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BG }}>
      {/* Header */}
      <div className="px-4 safe-top pb-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <h2 className="text-white font-black text-xl">My Applications</h2>
        </div>
        <p className="text-xs ml-11" style={{ color: "rgba(255,255,255,0.5)" }}>Track all your org application statuses</p>
      </div>

      {/* Summary pills */}
      <div className="px-4 mb-4 flex gap-2 flex-shrink-0">
        {[
          { label: "Active", count: 3, color: "#38bdf8" },
          { label: "Accepted", count: 0, color: "#10b981" },
          { label: "Withdrawn", count: 1, color: "#ef4444" },
        ].map(s => (
          <div key={s.label} className="flex-1 rounded-2xl p-3 text-center" style={{ background: s.color + "12", border: `1px solid ${s.color}30` }}>
            <div className="font-black text-xl" style={{ color: s.color }}>{s.count}</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Application cards */}
      <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-4 flex flex-col gap-3">
        {APPLICATIONS.map(app => (
          <button key={app.org} onClick={() => setSelected(app)} className="rounded-2xl p-4 text-left w-full" style={CARD_BG}>
            {/* Top row */}
            <div className="flex items-center gap-3 mb-4">
              <OrgLogo name={app.org} size={44} />
              <div className="flex-1 min-w-0">
                <div className="text-white font-black text-sm truncate">{app.org}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{app.category} · Submitted {app.submitted}</div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: app.color + "20", color: app.color }}>{app.status}</span>
            </div>

            {/* Stepper */}
            <div className="flex items-center">
              {APP_STATUS_STEPS.map((step, si) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: si < app.step ? "#10b981" : si === app.step ? app.color : "rgba(255,255,255,0.1)" }}>
                    {si < app.step
                      ? <svg width="8" height="8" viewBox="0 0 16 16" fill="white"><path d="M6.5 11.5L3 8l1-1 2.5 2.5 5-5 1 1z"/></svg>
                      : si === app.step
                        ? <div className="w-2 h-2 rounded-full bg-white" />
                        : null
                    }
                  </div>
                  {si < APP_STATUS_STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 mx-0.5" style={{ background: si < app.step ? "#10b981" : "rgba(255,255,255,0.08)" }} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex mt-1.5">
              {APP_STATUS_STEPS.map(step => (
                <span key={step} className="flex-1 text-center" style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)" }}>{step}</span>
              ))}
            </div>

            <div className="flex justify-end mt-3">
              <span className="text-xs font-semibold" style={{ color: "#38bdf8" }}>View details →</span>
            </div>
          </button>
        ))}

        {/* Apply to more */}
        <button className="rounded-2xl p-4 flex items-center justify-center gap-2" style={{ border: "1.5px dashed rgba(245,166,35,0.25)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="#f5a623" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="text-sm font-black" style={{ color: "#f5a623" }}>Apply to New Organization</span>
        </button>
      </div>
    </div>
  );
}

// ─── MERCH & LOCAL SELLERS SCREEN ───────────────────────────────────────────

const MERCH_ITEMS = [
  { id: 1, name: "PIGLASAPAT Hoodie", seller: "PIGLASAPAT", price: 1200, category: "Clothing", tag: "Best Seller", desc: "Comfortable hoodie with embroidered logo.", img: "https://images.unsplash.com/photo-1576188973526-0e5d7047b0cf?w=400&h=400&fit=crop&crop=left" },
  { id: 2, name: "AdDU CRCY Shirt", seller: "AdDU CRCY", price: 450, category: "Clothing", tag: "", desc: "Official CRCY dri-fit shirt.", img: "https://images.unsplash.com/photo-1623057000049-e220f79c7051?w=400&h=400&fit=crop" },
  { id: 3, name: "ALC Pride Tee", seller: "Ateneo Libulan Circle (ALC)", price: 350, category: "Clothing", tag: "New", desc: "Show your pride. Spread love and acceptance.", img: "https://images.unsplash.com/photo-1541481957271-353b2e2487fe?w=400&h=400&fit=crop" },
  { id: 4, name: "PIGLASAPAT Tumbler", seller: "PIGLASAPAT", price: 550, category: "Drinkware", tag: "", desc: "Stainless steel tumbler for everyday use.", img: "https://images.unsplash.com/photo-1588793076577-4c2b666452d3?w=400&h=400&fit=crop" },
  { id: 5, name: "Campus Tote Bag", seller: "BMS (Blue Marketing Society)", price: 220, category: "Accessories", tag: "", desc: "Eco-friendly canvas tote for campus life.", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop" },
  { id: 6, name: "Debate Guild Mug", seller: "Ateneo Debate Society", price: 195, category: "Drinkware", tag: "", desc: "Ceramic mug for the sharpest minds.", img: "https://images.unsplash.com/photo-1516390118834-21602d501886?w=400&h=400&fit=crop" },
  { id: 7, name: "CS Sticker Pack", seller: "Computer Society", price: 80, category: "Accessories", tag: "Popular", desc: "10 premium vinyl stickers for your laptop.", img: "https://images.unsplash.com/photo-1761276297637-4418549ead2d?w=400&h=400&fit=crop" },
  { id: 8, name: "Photography Zine Vol.3", seller: "Photography Club", price: 150, category: "Print", tag: "Limited", desc: "A curated photo collection by our members.", img: "https://images.unsplash.com/photo-1549298222-1c31e8915347?w=400&h=400&fit=crop" },
];

const LOCAL_SELLERS = [
  { name: "Brewed Awakening", cat: "Food & Drinks", desc: "Great coffee to fuel your busy days.", discount: "10% STUDENT DISCOUNT", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop", color: "#f5a623" },
  { name: "PrintHub Davao", cat: "Services", desc: "Quality prints at student-friendly prices.", discount: "15% STUDENT DISCOUNT", img: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=200&h=200&fit=crop", color: "#38bdf8" },
  { name: "Kusina ni Ate", cat: "Food & Drinks", desc: "Lutong bahay goodness made with love.", discount: "5% STUDENT DISCOUNT", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop", color: "#10b981" },
  { name: "Studio Lens", cat: "Services", desc: "Capture moments that matter.", discount: "10% STUDENT DISCOUNT", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop", color: "#a78bfa" },
  { name: "The Org Store", cat: "Merch & Crafts", desc: "Official merch for all recognized student organizations.", discount: "FREE SHIPPING", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop", color: "#f472b6" },
  { name: "Campus Boba Co.", cat: "Food & Drinks", desc: "Handcrafted milktea and boba delivered on campus.", discount: "10% STUDENT DISCOUNT", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", color: "#fb923c" },
];

const MERCH_CATS = ["All", "Clothing", "Accessories", "Drinkware", "Print"];

function MerchScreen() {
  const [view, setView] = useState<"merch" | "sellers">("merch");
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState<number[]>([]);
  const [selected, setSelected] = useState<typeof MERCH_ITEMS[0] | null>(null);

  const filtered = MERCH_ITEMS.filter(m => cat === "All" || m.category === cat);

  // ── Product detail ──────────────────────────────────────────────────────────
  if (selected) {
    const inCart = cart.includes(selected.id);
    return (
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BG }}>
        <div className="px-4 safe-top pb-3 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <h2 className="text-white font-black text-lg">Product Detail</h2>
          <div className="w-8" />
        </div>
        <div className="flex-1 overflow-y-auto phone-scroll pb-6">
          <div className="mx-4 rounded-2xl overflow-hidden mb-4" style={{ height: 220, background: "#f1f5f9" }}>
            <img src={selected.img} alt={selected.name} className="w-full h-full object-cover" />
          </div>
          <div className="px-4 flex flex-col gap-3">
            <div>
              <div className="text-white font-black text-xl leading-tight">{selected.name}</div>
              <div className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>by {selected.seller}</div>
            </div>
            <div className="font-black text-2xl" style={{ color: "#f5a623" }}>₱{selected.price}</div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{selected.desc}</p>
            <div className="rounded-2xl p-3 flex gap-4" style={CARD_BG}>
              {[{ label: "Category", val: selected.category }, { label: "Stock", val: "12 left" }, { label: "Sold", val: "48" }].map(s => (
                <div key={s.label} className="flex-1 text-center">
                  <div className="text-white font-black text-sm">{s.val}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setCart(inCart ? cart.filter(i => i !== selected.id) : [...cart, selected.id])} className="w-full py-3.5 rounded-2xl font-black text-sm transition-all" style={{ background: inCart ? "rgba(255,255,255,0.08)" : "#f5a623", color: inCart ? "rgba(255,255,255,0.5)" : BG }}>
              {inCart ? "✓ Added to Cart" : "Add to Cart"}
            </button>
            <button className="w-full py-3.5 rounded-2xl font-black text-sm" style={{ background: "#1a3a8f", color: "#fff" }}>
              Buy Now · ₱{selected.price}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BG }}>
      {/* Shared header */}
      <div className="px-4 safe-top pb-0 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-black text-xl">Marketplace</h2>
          <button className="relative w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cart.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center font-black" style={{ background: "#ef4444", color: "#fff", fontSize: 9 }}>{cart.length}</span>}
          </button>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-2xl overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {(["merch", "sellers"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className="flex-1 py-2 text-xs font-black transition-all" style={{ background: view === v ? "#f5a623" : "transparent", color: view === v ? "#020b18" : "rgba(255,255,255,0.5)", borderRadius: view === v ? 14 : 0 }}>
              {v === "merch" ? "Org Merch" : "Local Sellers"}
            </button>
          ))}
        </div>
      </div>

      {/* ── ORG MERCH TAB ── */}
      {view === "merch" && (
        <>
          <div className="px-4 flex-shrink-0">
            {/* Hero banner */}
            <div className="rounded-2xl mb-3 overflow-hidden relative flex items-center" style={{ background: "linear-gradient(135deg, #0d1b3e 0%, #162347 100%)", minHeight: 100 }}>
              <div className="px-4 py-4 flex-1 z-10">
                <div className="text-white font-black text-base leading-tight mb-1">Rep Your Org.<br />Wear Your Purpose.</div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Official merch from your orgs.</p>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-32 overflow-hidden">
                <img src={MERCH_ITEMS[0].img} alt="" className="absolute right-0 h-full object-cover opacity-80" style={{ width: 95, top: 0 }} />
                <img src={MERCH_ITEMS[3].img} alt="" className="absolute h-full object-cover opacity-55" style={{ width: 65, right: 88, top: 6 }} />
              </div>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto phone-scroll pb-3">
              {MERCH_CATS.map(c => (
                <button key={c} onClick={() => setCat(c)} className="flex-shrink-0 font-semibold px-3 py-1.5 rounded-2xl text-xs transition-all" style={{ background: cat === c ? "#2563eb" : "rgba(255,255,255,0.07)", color: cat === c ? "#fff" : "rgba(255,255,255,0.65)", border: cat === c ? "none" : "1px solid rgba(255,255,255,0.1)" }}>{c}</button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-4 flex flex-col gap-2">
            {filtered.map(item => (
              <div key={item.id} onClick={() => setSelected(item)} className="rounded-2xl flex items-center gap-3 px-3 py-3 cursor-pointer" style={{ background: "#0e1e38", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 72, height: 72, background: "#1a2a52" }}>
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-black text-sm leading-tight">{item.name}</div>
                  <div className="font-black text-sm mt-0.5 mb-1.5" style={{ color: "#f5a623" }}>₱{item.price}</div>
                  <div className="text-xs leading-snug line-clamp-2" style={{ color: "rgba(255,255,255,0.5)" }}>{item.desc}</div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setCart(cart.includes(item.id) ? cart.filter(i => i !== item.id) : [...cart, item.id]); }}
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ border: `2px solid ${cart.includes(item.id) ? "#10b981" : "rgba(255,255,255,0.3)"}`, background: cart.includes(item.id) ? "rgba(16,185,129,0.15)" : "transparent" }}
                >
                  {cart.includes(item.id)
                    ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/></svg>
                  }
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── LOCAL SELLERS TAB ── */}
      {view === "sellers" && (
        <>
          {/* Hero */}
          <div className="px-4 flex-shrink-0">
            <div className="rounded-2xl mb-3 overflow-hidden relative flex items-center" style={{ background: "linear-gradient(135deg, #0d1b3e 0%, #162347 100%)", minHeight: 100 }}>
              <div className="px-4 py-4 flex-1 z-10">
                <div className="text-white font-black text-base leading-tight mb-1">Support Local.<br />Support Each Other.</div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>Discover trusted local businesses by fellow students and locals.</p>
              </div>
              <div className="flex-shrink-0 pr-4">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
            </div>

            {/* Category filter icons */}
            <div className="flex justify-between mb-3">
              {([
                { label: "All", svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
                { label: "Food & Drinks", svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg> },
                { label: "Services", svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 19.07l1.41-1.41M22 12h-2M4 12H2M19.07 19.07l-1.41-1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2"/></svg> },
                { label: "Merch & Crafts", svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
                { label: "Others", svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg> },
              ] as { label: string; svg: React.ReactNode }[]).map(({ label, svg }) => (
                <button key={label} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: label === "All" ? "#fff" : "rgba(255,255,255,0.08)", color: label === "All" ? "#0d1b3e" : "rgba(255,255,255,0.75)" }}>
                    {svg}
                  </div>
                  <span className="text-center leading-tight" style={{ color: "rgba(255,255,255,0.65)", fontSize: 9, maxWidth: 52 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Seller list */}
          <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-4 flex flex-col gap-2">
            {LOCAL_SELLERS.map(seller => (
              <div key={seller.name} className="rounded-2xl flex items-center gap-3 px-3 py-3 cursor-pointer" style={{ background: "#0e1e38", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 72, height: 72, background: "#1a2a52" }}>
                  <img src={seller.img} alt={seller.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-black text-sm leading-tight">{seller.name}</div>
                  <div className="text-xs mt-0.5 mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>{seller.cat}<br />{seller.desc}</div>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: "#10b981", color: "#fff" }}>{seller.discount}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0"><path d="M6 4l4 4-4 4" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS OVERLAY ──────────────────────────────────────────────────

function NotificationsOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col" style={{ background: BG }}>
      <div className="px-4 safe-top pb-3 flex items-center gap-3 flex-shrink-0">
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <h2 className="text-white font-black text-lg flex-1">Notifications</h2>
        <button className="text-xs font-semibold" style={{ color: "#38bdf8" }}>Mark all read</button>
      </div>
      <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-4 flex flex-col gap-2">
        {NOTIFS.map(n => (
          <div key={n.title} className="rounded-2xl p-3 flex gap-3" style={{ ...CARD_BG, borderColor: n.unread ? "rgba(245,166,35,0.2)" : "rgba(255,255,255,0.07)" }}>
            <div className="flex-shrink-0 w-2 h-2 rounded-full mt-1.5" style={{ background: n.unread ? "#f5a623" : "transparent" }} />
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm">{n.title}</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{n.body}</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AUTH SCREENS ────────────────────────────────────────────────────────────

type AuthScreen = "splash" | "signin" | "signup" | "forgot";

function AuthFlow({ onDone }: { onDone: () => void }) {
  const [screen, setScreen] = useState<AuthScreen>("splash");

  // Shared field state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [signupStep, setSignupStep] = useState(0);

  // ── Splash ──────────────────────────────────────────────────────────────
  if (screen === "splash") {
    return (
      <div className="flex-1 flex flex-col" style={{ background: BG }}>
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <img src={orgLogo} alt="OrgConnect" className="rounded-full object-cover" style={{ width: 88, height: 88, boxShadow: "0 0 0 4px rgba(245,166,35,0.25)" }} />
            <div className="flex items-center gap-1">
              <span className="font-black text-3xl" style={{ color: "#f5a623" }}>Org</span>
              <span className="font-black text-3xl text-white">Connect</span>
            </div>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.18em" }}>Discover · Connect · Belong</p>
          </div>

          {/* Decorative dots */}
          <div className="flex gap-2 opacity-30">
            {["#f5a623","#38bdf8","#8b5cf6","#10b981"].map(c => (
              <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
            ))}
          </div>

          <p className="text-sm text-center leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            One platform for every student organization, event, and opportunity on your campus.
          </p>
        </div>

        <div className="px-6 safe-bottom flex flex-col gap-3">
          <button onClick={() => setScreen("signin")} className="w-full py-3.5 rounded-2xl font-black text-base" style={{ background: "#f5a623", color: "#020b18" }}>
            Sign In
          </button>
          <button onClick={() => setScreen("signup")} className="w-full py-3.5 rounded-2xl font-black text-base" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}>
            Create Account
          </button>
          <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            For Ateneo de Davao University students only
          </p>
        </div>
      </div>
    );
  }

  // ── Sign In ──────────────────────────────────────────────────────────────
  if (screen === "signin") {
    return (
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BG }}>
        <div className="flex-1 overflow-y-auto phone-scroll">
          {/* Header */}
          <div className="px-6 safe-top pb-2 flex items-center gap-3">
            <button onClick={() => setScreen("splash")} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div className="px-6 pt-2 pb-8">
            <div className="mb-8">
              <h1 className="text-white font-black text-2xl mb-1">Welcome back</h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Sign in to your OrgConnect account</p>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>School Email</label>
                <div className="flex items-center gap-2 rounded-xl px-3 py-3" style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${email ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.1)"}` }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@addu.edu.ph" className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25" />
                </div>
              </div>
              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>Password</label>
                <div className="flex items-center gap-2 rounded-xl px-3 py-3" style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${password ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.1)"}` }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/></svg>
                  <input value={password} onChange={e => setPassword(e.target.value)} type={showPass ? "text" : "password"} placeholder="Enter your password" className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25" />
                  <button onClick={() => setShowPass(!showPass)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={showPass ? "#f5a623" : "rgba(255,255,255,0.3)"}><path d={showPass ? "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" : "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"}/></svg>
                  </button>
                </div>
              </div>
              <button onClick={() => setScreen("forgot")} className="text-xs font-bold text-right self-end" style={{ color: "#38bdf8" }}>Forgot password?</button>
            </div>

            <button onClick={onDone} className="w-full py-3.5 rounded-2xl font-black text-base mb-4" style={{ background: "#f5a623", color: "#020b18" }}>
              Sign In
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>or continue with</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            </div>

            {/* Google SSO */}
            <button className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign in with Google
            </button>

            <p className="text-center text-sm mt-6" style={{ color: "rgba(255,255,255,0.5)" }}>
              Don't have an account?{" "}
              <button onClick={() => setScreen("signup")} className="font-black" style={{ color: "#f5a623" }}>Sign Up</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Sign Up ──────────────────────────────────────────────────────────────
  if (screen === "signup") {
    const steps = ["Account", "Profile", "Done"];
    return (
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BG }}>
        <div className="flex-1 overflow-y-auto phone-scroll">
          <div className="px-6 safe-top pb-2 flex items-center gap-3">
            <button onClick={() => signupStep > 0 ? setSignupStep(s => s - 1) : setScreen("splash")} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div className="flex-1 flex gap-1.5">
              {steps.map((_, i) => <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i <= signupStep ? "#f5a623" : "rgba(255,255,255,0.1)" }} />)}
            </div>
          </div>

          <div className="px-6 pt-4 pb-8">
            {signupStep === 0 && (
              <>
                <div className="mb-6">
                  <h1 className="text-white font-black text-2xl mb-1">Create account</h1>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Join OrgConnect with your school email</p>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "School Email", val: email, set: setEmail, type: "email", placeholder: "you@addu.edu.ph", icon: <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/> },
                    { label: "Password", val: password, set: setPassword, type: showPass ? "text" : "password", placeholder: "At least 8 characters", icon: <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/> },
                    { label: "Confirm Password", val: confirmPass, set: setConfirmPass, type: "password", placeholder: "Repeat password", icon: <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/> },
                  ].map(f => (
                    <div key={f.label} className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>{f.label}</label>
                      <div className="flex items-center gap-2 rounded-xl px-3 py-3" style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${f.val ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.1)"}` }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)">{f.icon}</svg>
                        <input value={f.val} onChange={e => f.set(e.target.value)} type={f.type} placeholder={f.placeholder} className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25" />
                      </div>
                    </div>
                  ))}
                  {confirmPass && password !== confirmPass && (
                    <p className="text-xs font-semibold" style={{ color: "#ef4444" }}>Passwords don't match</p>
                  )}
                </div>
              </>
            )}

            {signupStep === 1 && (
              <>
                <div className="mb-6">
                  <h1 className="text-white font-black text-2xl mb-1">Your Profile</h1>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Tell us a bit about yourself</p>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Full Name", val: fullName, set: setFullName, placeholder: "e.g. Juan dela Cruz" },
                    { label: "Student ID", val: studentId, set: setStudentId, placeholder: "e.g. 2023-00123" },
                  ].map(f => (
                    <div key={f.label} className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>{f.label}</label>
                      <div className="flex items-center gap-2 rounded-xl px-3 py-3" style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${f.val ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.1)"}` }}>
                        <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25" />
                      </div>
                    </div>
                  ))}

                  {/* Year level select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>Year Level</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(y => (
                        <button key={y} className="py-2.5 rounded-xl text-xs font-bold" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.1)" }}>{y}</button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl p-3 flex gap-2" style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)" }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="#38bdf8" className="flex-shrink-0 mt-0.5"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm.75 10.5h-1.5v-5h1.5v5zm0-6.5h-1.5V3.5h1.5V5z"/></svg>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>Your student ID will be verified by the admin before your account is activated.</p>
                  </div>
                </div>
              </>
            )}

            {signupStep === 2 && (
              <div className="flex flex-col items-center gap-5 pt-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(245,166,35,0.15)", border: "2px solid #f5a623" }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="#f5a623"><path d="M9 16.2l-4.2-4.2-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
                </div>
                <div className="text-white font-black text-xl text-center">You're all set!</div>
                <p className="text-sm text-center leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Welcome to OrgConnect, <span className="text-white font-bold">{fullName || "Student"}</span>! Verify your email at <span className="text-white font-bold">{email || "your inbox"}</span> to activate your account.
                </p>
                <div className="w-full rounded-2xl p-4 flex flex-col gap-3" style={CARD_BG}>
                  <div className="text-xs font-bold" style={{ color: "#f5a623" }}>NEXT STEPS</div>
                  {["Check your email for a verification link", "Complete your profile after login", "Browse and apply to organizations"].map((s, i) => (
                    <div key={s} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: "rgba(245,166,35,0.2)", color: "#f5a623" }}>{i + 1}</div>
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-8 pt-2 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {signupStep < 2 ? (
            <button onClick={() => setSignupStep(s => s + 1)} className="w-full py-3.5 rounded-2xl font-black text-base" style={{ background: "#f5a623", color: "#020b18" }}>
              {signupStep === 0 ? "Continue" : "Create Account"}
            </button>
          ) : (
            <button onClick={onDone} className="w-full py-3.5 rounded-2xl font-black text-base" style={{ background: "#f5a623", color: "#020b18" }}>
              Go to OrgConnect →
            </button>
          )}
          {signupStep === 0 && (
            <p className="text-center text-sm mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
              Already have an account?{" "}
              <button onClick={() => setScreen("signin")} className="font-black" style={{ color: "#f5a623" }}>Sign In</button>
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Forgot Password ──────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BG }}>
      <div className="flex-1 overflow-y-auto phone-scroll">
        <div className="px-6 safe-top pb-2">
          <button onClick={() => setScreen("signin")} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="px-6 pt-4 pb-8">
          {!resetSent ? (
            <>
              <div className="flex flex-col items-center mb-8 gap-3">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#38bdf8"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/></svg>
                </div>
                <h1 className="text-white font-black text-2xl">Forgot Password?</h1>
                <p className="text-sm text-center leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>No worries! Enter your school email and we'll send you a reset link.</p>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>School Email</label>
                  <div className="flex items-center gap-2 rounded-xl px-3 py-3" style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${resetEmail ? "rgba(56,189,248,0.4)" : "rgba(255,255,255,0.1)"}` }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    <input value={resetEmail} onChange={e => setResetEmail(e.target.value)} type="email" placeholder="you@addu.edu.ph" className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25" />
                  </div>
                </div>
              </div>

              <button onClick={() => setResetSent(true)} className="w-full py-3.5 rounded-2xl font-black text-base mb-4" style={{ background: "#38bdf8", color: "#020b18" }}>
                Send Reset Link
              </button>
              <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                Remember it?{" "}
                <button onClick={() => setScreen("signin")} className="font-black" style={{ color: "#f5a623" }}>Sign In</button>
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-5 pt-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)", border: "2px solid #10b981" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="#10b981"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </div>
              <div className="text-white font-black text-xl text-center">Check your inbox!</div>
              <p className="text-sm text-center leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                We sent a password reset link to{" "}
                <span className="text-white font-bold">{resetEmail || "your email"}</span>. It expires in 30 minutes.
              </p>
              <div className="w-full rounded-2xl p-4" style={CARD_BG}>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Didn't receive it? Check your spam folder or{" "}
                  <button onClick={() => setResetSent(false)} className="font-bold" style={{ color: "#38bdf8" }}>try again</button>.
                </p>
              </div>
              <button onClick={() => setScreen("signin")} className="w-full py-3.5 rounded-2xl font-black text-base" style={{ background: "#f5a623", color: "#020b18" }}>
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN EXPORTER ─────────────────────────────────────────────────────────

const PHONE_W = 390;
const PHONE_H = 844;

const EXPORT_SCREENS: { label: string; tab: TabName | null; extra?: string }[] = [
  { label: "Home", tab: "Home" },
  { label: "Organizations", tab: "Organizations" },
  { label: "Events", tab: "Events" },
  { label: "Merch", tab: "Merch" },
  { label: "Profile", tab: "Profile" },
  { label: "Applications", tab: "Home", extra: "apps" },
  { label: "OrgDetail_PIGLASAPAT", tab: "Organizations", extra: "org:PIGLASAPAT" },
  { label: "Apply_PIGLASAPAT", tab: "Organizations", extra: "apply:PIGLASAPAT" },
  { label: "Auth_Splash", tab: null, extra: "auth:splash" },
  { label: "Auth_SignIn", tab: null, extra: "auth:signin" },
];

function ScreenExporter() {
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const captureScreen = useCallback(async (
    content: React.ReactNode,
    label: string,
  ): Promise<{ label: string; blob: Blob }> => {
    return new Promise((resolve, reject) => {
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: ${PHONE_W}px;
        height: ${PHONE_H}px;
        overflow: hidden;
        background: ${BG};
        font-family: 'Nunito', sans-serif;
        color: white;
        display: flex;
        flex-direction: column;
      `;
      document.body.appendChild(wrapper);

      const root = createRoot(wrapper);
      root.render(content);

      // Wait for fonts + images to settle
      setTimeout(async () => {
        try {
          const canvas = await html2canvas(wrapper, {
            width: PHONE_W,
            height: PHONE_H,
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: BG,
            logging: false,
          });
          canvas.toBlob(blob => {
            root.unmount();
            document.body.removeChild(wrapper);
            if (blob) resolve({ label, blob });
            else reject(new Error("canvas.toBlob returned null"));
          }, "image/png");
        } catch (e) {
          root.unmount();
          document.body.removeChild(wrapper);
          reject(e);
        }
      }, 600);
    });
  }, []);

  const runExport = useCallback(async () => {
    setStatus("running");
    setTotal(EXPORT_SCREENS.length);
    setProgress(0);

    const zip = new JSZip();
    const folder = zip.folder("OrgConnect-Screens")!;

    for (let i = 0; i < EXPORT_SCREENS.length; i++) {
      const { label, tab, extra } = EXPORT_SCREENS[i];

      let screen: React.ReactNode = null;
      const noOp = () => {};

      if (extra === "auth:splash") {
        screen = h(AuthFlow, { onDone: noOp });
      } else if (extra === "auth:signin") {
        // Render AuthFlow and it'll show splash (close enough for export)
        screen = h(AuthFlow, { onDone: noOp });
      } else if (extra === "apps") {
        screen = h("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" } },
          h(ApplicationsScreen, { onBack: noOp })
        );
      } else if (extra?.startsWith("org:")) {
        const orgName = extra.slice(4);
        const org = ORGS.find(o => o.name === orgName) ?? ORGS[0];
        screen = h(OrgDetailScreen, { org, onBack: noOp, onApply: noOp });
      } else if (extra?.startsWith("apply:")) {
        const orgName = extra.slice(6);
        const org = ORGS.find(o => o.name === orgName) ?? ORGS[0];
        screen = h(ApplyScreen, { org, onBack: noOp, onSubmit: noOp });
      } else if (tab === "Home") {
        screen = h(HomeScreen, { onOpenApps: noOp, onNav: noOp as any });
      } else if (tab === "Organizations") {
        screen = h(OrganizationsScreen, { onSelect: noOp as any });
      } else if (tab === "Events") {
        screen = h(EventsScreen, {});
      } else if (tab === "Merch") {
        screen = h(MerchScreen, {});
      } else if (tab === "Profile") {
        screen = h(ProfileScreen, { onOpenApps: noOp });
      }

      if (!screen) { setProgress(i + 1); continue; }

      const wrapper = h(
        "div",
        { style: { background: BG, fontFamily: "'Nunito', sans-serif", color: "#fff", width: PHONE_W, height: PHONE_H, display: "flex", flexDirection: "column", overflow: "hidden" } },
        screen
      );

      try {
        const { label: l, blob } = await captureScreen(wrapper, label);
        folder.file(`${l}.png`, blob);
      } catch (e) {
        console.warn("Failed to capture", label, e);
      }
      setProgress(i + 1);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "OrgConnect-Screens.zip";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("done");
    setTimeout(() => setStatus("idle"), 3000);
  }, [captureScreen]);

  // Hotkey: Ctrl+Shift+E
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "E") runExport();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [runExport]);

  return (
    <div ref={containerRef} style={{ position: "fixed", bottom: 80, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, pointerEvents: "none" }}>
      {status === "running" && (
        <div style={{ background: "#0e1e38", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "8px 14px", fontSize: 12, color: "#fff", fontFamily: "'Nunito', sans-serif", pointerEvents: "auto" }}>
          <div style={{ color: "#f5a623", fontWeight: 800, marginBottom: 4 }}>Exporting screens…</div>
          <div style={{ color: "rgba(255,255,255,0.5)" }}>{progress} / {total}</div>
          <div style={{ marginTop: 6, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)" }}>
            <div style={{ height: "100%", borderRadius: 2, background: "#f5a623", width: `${total ? (progress / total) * 100 : 0}%`, transition: "width 0.3s" }} />
          </div>
        </div>
      )}
      {status === "done" && (
        <div style={{ background: "#0e1e38", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "8px 14px", fontSize: 12, color: "#10b981", fontFamily: "'Nunito', sans-serif", fontWeight: 800, pointerEvents: "auto" }}>
          ✓ ZIP downloaded!
        </div>
      )}
      <button
        onClick={status === "idle" || status === "done" ? runExport : undefined}
        style={{
          pointerEvents: "auto",
          background: status === "running" ? "rgba(245,166,35,0.2)" : "#f5a623",
          color: status === "running" ? "#f5a623" : "#020b18",
          border: status === "running" ? "1px solid #f5a623" : "none",
          borderRadius: 999,
          padding: "10px 18px",
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 900,
          fontSize: 13,
          cursor: status === "running" ? "not-allowed" : "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
        title="Export all screens as PNG ZIP (Ctrl+Shift+E)"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
        {status === "running" ? "Exporting…" : "Export Screens"}
      </button>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────

export default function MobilePrototype() {
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>("Home");
  const [showNotifs, setShowNotifs] = useState(false);
  const [showApps, setShowApps] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<typeof ORGS[0] | null>(null);
  const [applyingOrg, setApplyingOrg] = useState<typeof ORGS[0] | null>(null);
  return (
    <div className="w-full flex flex-col" style={{ background: BG, fontFamily: "'Nunito', sans-serif", color: "white", height: "100%", overflow: "hidden" }}>

      {/* Screen content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {!authed ? (
          <AuthFlow onDone={() => setAuthed(true)} />
        ) : (
          <>
            {showNotifs && <NotificationsOverlay onClose={() => setShowNotifs(false)} />}
            {showApps && <ApplicationsScreen onBack={() => setShowApps(false)} />}
            {!showApps && activeTab === "Home" && <HomeScreen onOpenApps={() => setShowApps(true)} onNav={setActiveTab} onOpenNotifs={() => setShowNotifs(true)} />}
            {!showApps && activeTab === "Organizations" && (
              applyingOrg
                ? <ApplyScreen org={applyingOrg} onBack={() => setApplyingOrg(null)} onSubmit={() => { setApplyingOrg(null); setSelectedOrg(null); }} />
                : selectedOrg
                  ? <OrgDetailScreen org={selectedOrg} onBack={() => setSelectedOrg(null)} onApply={() => setApplyingOrg(selectedOrg)} />
                  : <OrganizationsScreen onSelect={setSelectedOrg} />
            )}
            {!showApps && activeTab === "Events" && <EventsScreen />}
            {!showApps && activeTab === "Merch" && <MerchScreen />}
            {!showApps && activeTab === "Profile" && <ProfileScreen onOpenApps={() => setShowApps(true)} />}
          </>
        )}
      </div>


      {/* Bottom nav — only when authed */}
      {authed && (
        <div className="flex-shrink-0 flex items-center pt-2 safe-bottom border-t" style={{ background: BG, borderColor: "rgba(255,255,255,0.07)" }}>
          {NAV_ITEMS.map(({ label, icon }) => {
            const active = activeTab === label;
            return (
              <button key={label} onClick={() => setActiveTab(label)} className="flex-1 flex flex-col items-center gap-0.5">
                <span style={{ color: active ? "#f5a623" : "rgba(255,255,255,0.35)" }}>{icon}</span>
                <span className="font-semibold" style={{ color: active ? "#f5a623" : "rgba(255,255,255,0.35)", fontSize: "10px" }}>{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
