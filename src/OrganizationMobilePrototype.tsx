import { useState } from "react";
import orgConnectLogo from "./povassets/organizationmobile/orgconnect-logo-clean.png";
import CardLogo from "./povassets/organizationmobile/CardLogo/index";

type Tab = "Dashboard" | "Applicants" | "Events" | "Marketplace" | "More";
type ApplicantStatus = "New" | "Review" | "Accepted" | "Waitlisted";

const applicants = [
  { name: "Maria Santos", course: "BS Psychology · 2nd Year", role: "Membership Committee", status: "New" as ApplicantStatus, date: "Sep 8" },
  { name: "Carlo Reyes", course: "BS IT · 3rd Year", role: "Creatives Committee", status: "Review" as ApplicantStatus, date: "Sep 8" },
  { name: "Angela Cruz", course: "BA Communication · 1st Year", role: "Programs Committee", status: "Accepted" as ApplicantStatus, date: "Sep 7" },
  { name: "Miguel Torres", course: "BS Accountancy · 2nd Year", role: "Finance Committee", status: "Waitlisted" as ApplicantStatus, date: "Sep 7" },
  { name: "Sofia Lim", course: "BS Entrepreneurship · 1st Year", role: "Membership Committee", status: "New" as ApplicantStatus, date: "Sep 6" },
];

const events = [
  { day: "12", mon: "SEP", title: "PIGLASAPAT General Assembly", place: "Finster Auditorium", time: "4:30 PM", status: "Published" },
  { day: "19", mon: "SEP", title: "Leadership Workshop", place: "F213", time: "2:00 PM", status: "Draft" },
  { day: "26", mon: "SEP", title: "Community Outreach", place: "Bajada, Davao City", time: "8:00 AM", status: "Published" },
];

const products = [
  { name: "PIGLASAPAT Org Shirt", price: "₱350", stock: "24 in stock", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&q=80" },
  { name: "Leadership Sticker Pack", price: "₱80", stock: "42 in stock", image: "https://images.unsplash.com/photo-1621252756235-7f37e5e5125e?auto=format&fit=crop&w=500&q=80" },
  { name: "Org Lanyard", price: "₱120", stock: "18 in stock", image: "https://images.unsplash.com/photo-1769142726489-6f40b1c575c5?auto=format&fit=crop&w=500&q=80" },
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const p: Record<string, React.ReactNode> = {
    home: <path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z"/>,
    users: <><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    bag: <><path d="M6 7h12l2 14H4L6 7z"/><path d="M9 7V5a3 3 0 016 0v2"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    bell: <><path d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    megaphone: <><path d="M3 11v2h4l10 5V6L7 11H3z"/><path d="M7 13l2 6"/></>,
    members: <><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0114 0M18 8h4M20 6v4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0015 19.4a1.7 1.7 0 00-1 .6 1.7 1.7 0 00-.4 1.1V21h-4v-.09A1.7 1.7 0 008.6 19.4a1.7 1.7 0 00-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 004.6 15a1.7 1.7 0 00-.6-1 1.7 1.7 0 00-1.1-.4H3v-4h.09A1.7 1.7 0 004.6 8.6a1.7 1.7 0 00-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 009 4.6a1.7 1.7 0 001-.6 1.7 1.7 0 00.4-1.1V3h4v.09A1.7 1.7 0 0015.4 4.6a1.7 1.7 0 001.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0019.4 9c.14.37.36.7.64.97.28.28.63.48 1 .59H21v4h-.09a1.7 1.7 0 00-1.51.44z"/></>,
    chevron: <path d="M9 18l6-6-6-6"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{p[name]}</svg>;
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="px-4 pt-14 pb-3 flex items-center justify-between flex-shrink-0">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <img src={orgConnectLogo} className="w-7 h-7 rounded-full object-cover" />
        <span className="text-[11px] font-black tracking-[.18em] uppercase text-amber-400">Org Officer Portal</span>
      </div>
      <h1 className="text-white text-2xl font-black leading-tight">{title}</h1>
      {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
    </div>
    <button className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
      <Icon name="bell" size={19}/><span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"/>
    </button>
  </div>;
}

function Stat({ label, value, note, accent }: { label: string; value: string; note: string; accent: string }) {
  return <div className="rounded-2xl p-3 border border-white/10 bg-[#0e1e38] min-w-0">
    <div className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">{label}</div>
    <div className="text-xl font-black text-white mt-1">{value}</div>
    <div className="text-[10px] mt-1 font-bold" style={{color:accent}}>{note}</div>
  </div>;
}

function Dashboard({ setTab }: { setTab: (t: Tab) => void }) {
  return <div className="flex-1 overflow-y-auto phone-scroll pb-28">
    <Header title="Good morning, PIGLASAPAT" subtitle="Here’s what’s happening with your organization." />
    <div className="px-4">
      <div className="rounded-3xl p-4 bg-gradient-to-br from-[#172c52] to-[#0d1b3e] border border-white/10 flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white flex-shrink-0"><CardLogo/></div>
        <div className="flex-1 min-w-0"><div className="text-white font-black text-base">PIGLASAPAT</div><div className="text-slate-400 text-xs mt-1">Socio-civic · Political · Leadership</div><div className="mt-2 inline-flex px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-[10px] font-black">RECRUITMENT OPEN</div></div>
        <button className="w-9 h-9 rounded-xl bg-white/5 text-slate-300 flex items-center justify-center"><Icon name="chevron" size={18}/></button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5">
        <Stat label="Applicants" value="38" note="+9 this week" accent="#f5a623"/>
        <Stat label="Members" value="74" note="6 new this month" accent="#34d399"/>
        <Stat label="Profile Views" value="1,284" note="+18% vs last week" accent="#f5a623"/>
        <Stat label="Conversion" value="12.6%" note="Views → applies" accent="#c084fc"/>
      </div>

      <div className="flex items-center justify-between mb-2"><h2 className="text-white font-black text-sm">Quick actions</h2></div>
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[{i:"users",l:"Applicants",t:"Applicants" as Tab},{i:"calendar",l:"New Event",t:"Events" as Tab},{i:"megaphone",l:"Post Update",t:"More" as Tab},{i:"bag",l:"Add Product",t:"Marketplace" as Tab}].map(x=><button key={x.l} onClick={()=>setTab(x.t)} className="rounded-2xl bg-[#0e1e38] border border-white/10 py-3 px-1 flex flex-col items-center gap-2 text-slate-200"><span className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center"><Icon name={x.i} size={18}/></span><span className="text-[9px] font-bold">{x.l}</span></button>)}
      </div>

      <div className="flex items-center justify-between mb-2"><h2 className="text-white font-black text-sm">Recent applicants</h2><button onClick={()=>setTab("Applicants")} className="text-amber-400 text-xs font-bold">See all</button></div>
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0e1e38] mb-5">
        {applicants.slice(0,3).map((a,i)=><div key={a.name} className={`p-3 flex items-center gap-3 ${i<2?"border-b border-white/5":""}`}><div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-black">{a.name.split(" ").map(n=>n[0]).join("")}</div><div className="flex-1 min-w-0"><div className="text-white text-xs font-bold">{a.name}</div><div className="text-slate-500 text-[10px] truncate">{a.role}</div></div><Status status={a.status}/></div>)}
      </div>

      <div className="flex items-center justify-between mb-2"><h2 className="text-white font-black text-sm">Recruitment funnel</h2><span className="text-[10px] text-slate-500">Last 30 days</span></div>
      <div className="rounded-2xl bg-[#0e1e38] border border-white/10 p-4 mb-5">
        {[['Profile views',1284,100],['Started application',214,62],['Submitted',162,48],['Accepted',38,26]].map(([l,v,w])=><div key={String(l)} className="mb-3 last:mb-0"><div className="flex justify-between text-[10px] mb-1"><span className="text-slate-400">{l}</span><span className="text-white font-bold">{v}</span></div><div className="h-2 rounded-full bg-white/5 overflow-hidden"><div className="h-full rounded-full bg-amber-400" style={{width:`${w}%`}}/></div></div>)}
      </div>
    </div>
  </div>;
}

function Status({ status }: { status: ApplicantStatus }) {
  const c: Record<ApplicantStatus,string> = {New:"bg-amber-400/15 text-amber-400",Review:"bg-amber-400/15 text-amber-400",Accepted:"bg-emerald-400/15 text-emerald-400",Waitlisted:"bg-purple-400/15 text-purple-400"};
  return <span className={`px-2 py-1 rounded-lg text-[9px] font-black ${c[status]}`}>{status.toUpperCase()}</span>;
}

function Applicants() {
  const [filter,setFilter]=useState("All");
  const list=filter==="All"?applicants:applicants.filter(a=>a.status===filter);
  return <div className="flex-1 overflow-y-auto phone-scroll pb-28"><Header title="Applicants" subtitle="Review and update recruitment applications."/><div className="px-4"><div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-3 flex items-center gap-2 text-slate-500 mb-3"><Icon name="search" size={17}/><span className="text-xs">Search applicants...</span></div><div className="flex gap-2 overflow-x-auto phone-scroll mb-4">{["All","New","Review","Accepted","Waitlisted"].map(f=><button key={f} onClick={()=>setFilter(f)} className={`px-3 py-2 rounded-xl text-[10px] font-black whitespace-nowrap ${filter===f?"bg-amber-400 text-[#020b18]":"bg-[#0e1e38] text-slate-400 border border-white/10"}`}>{f}</button>)}</div><div className="space-y-2">{list.map(a=><div key={a.name} className="rounded-2xl p-4 bg-[#0e1e38] border border-white/10"><div className="flex items-start gap-3"><div className="w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-black">{a.name.split(" ").map(n=>n[0]).join("")}</div><div className="flex-1"><div className="flex items-start justify-between gap-2"><div><div className="text-white text-sm font-black">{a.name}</div><div className="text-slate-500 text-[10px] mt-0.5">{a.course}</div></div><Status status={a.status}/></div><div className="text-slate-300 text-[11px] mt-3">Applied for <b className="text-white">{a.role}</b></div><div className="flex items-center justify-between mt-3"><span className="text-[10px] text-slate-500">Submitted {a.date}</span><button className="px-3 py-1.5 rounded-lg bg-white/5 text-amber-400 text-[10px] font-black">Review</button></div></div></div></div>)}</div></div></div>;
}

function Events() { return <div className="flex-1 overflow-y-auto phone-scroll pb-28"><Header title="Events" subtitle="Create, publish, and manage organization events."/><div className="px-4"><button className="w-full rounded-2xl py-3 bg-amber-400 text-[#020b18] text-xs font-black flex items-center justify-center gap-2 mb-4"><Icon name="plus" size={17}/> Create event</button><div className="space-y-3">{events.map(e=><div key={e.title} className="rounded-2xl bg-[#0e1e38] border border-white/10 p-3 flex gap-3"><div className="w-14 h-16 rounded-xl bg-[#172c52] flex flex-col items-center justify-center"><span className="text-amber-400 text-[10px] font-black">{e.mon}</span><span className="text-white text-xl font-black leading-none">{e.day}</span></div><div className="flex-1"><div className="flex justify-between gap-2"><div className="text-white text-sm font-black leading-tight">{e.title}</div><span className={`text-[9px] font-black ${e.status==='Published'?'text-emerald-400':'text-amber-400'}`}>{e.status}</span></div><div className="text-slate-500 text-[10px] mt-2">{e.time} · {e.place}</div><div className="flex gap-2 mt-3"><button className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-[10px] font-bold">Edit</button><button className="px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-400 text-[10px] font-bold">View</button></div></div></div>)}</div></div></div>; }

function Marketplace() { return <div className="flex-1 overflow-y-auto phone-scroll pb-28"><Header title="Marketplace" subtitle="Manage merchandise and product listings."/><div className="px-4"><div className="grid grid-cols-2 gap-2 mb-4"><Stat label="Sales" value="₱8,460" note="This month" accent="#34d399"/><Stat label="Orders" value="27" note="5 pending" accent="#f5a623"/></div><button className="w-full rounded-2xl py-3 bg-amber-400 text-[#020b18] text-xs font-black flex items-center justify-center gap-2 mb-4"><Icon name="plus" size={17}/> Add product</button><div className="space-y-2">{products.map(p=><div key={p.name} className="rounded-2xl bg-[#0e1e38] border border-white/10 p-3 flex items-center gap-3"><div className="w-14 h-14 rounded-xl bg-white/5 overflow-hidden"><img src={p.image} alt={p.name} className="w-full h-full object-cover"/></div><div className="flex-1"><div className="text-white text-xs font-black">{p.name}</div><div className="text-amber-400 text-xs font-black mt-1">{p.price}</div><div className="text-slate-500 text-[10px] mt-1">{p.stock}</div></div><button className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-[10px] font-bold">Edit</button></div>)}</div></div></div>; }

function More({setTab}:{setTab:(t:Tab)=>void}) { const rows=[{i:'megaphone',t:'Announcements',s:'Create and publish organization updates'},{i:'members',t:'Members',s:'Manage active members and officer roles'},{i:'chart',t:'Recruitment Analytics',s:'Views, applications and conversion trends'},{i:'settings',t:'Organization Settings',s:'Profile, recruitment status and officer handoff'}]; return <div className="flex-1 overflow-y-auto phone-scroll pb-28"><Header title="Manage Organization" subtitle="Everything else your officers need."/><div className="px-4"><div className="rounded-2xl bg-[#0e1e38] border border-white/10 overflow-hidden">{rows.map((r,i)=><button key={r.t} className={`w-full p-4 flex items-center gap-3 text-left ${i<rows.length-1?'border-b border-white/5':''}`}><span className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center"><Icon name={r.i} size={19}/></span><span className="flex-1"><span className="block text-white text-xs font-black">{r.t}</span><span className="block text-slate-500 text-[10px] mt-1">{r.s}</span></span><span className="text-slate-600"><Icon name="chevron" size={17}/></span></button>)}</div><div className="mt-5 rounded-2xl p-4 border border-amber-400/20 bg-amber-400/5"><div className="text-amber-400 text-xs font-black">Officer handoff ready</div><div className="text-slate-400 text-[10px] mt-1 leading-relaxed">Transfer admin access to next semester’s officers while keeping previous recruitment and membership records.</div><button className="mt-3 px-3 py-2 rounded-lg bg-amber-400/10 text-amber-400 text-[10px] font-black">Manage handoff</button></div></div></div>; }

export default function App(){
  const [tab,setTab]=useState<Tab>("Dashboard");
  const body=tab==="Dashboard"?<Dashboard setTab={setTab}/>:tab==="Applicants"?<Applicants/>:tab==="Events"?<Events/>:tab==="Marketplace"?<Marketplace/>:<More setTab={setTab}/>;
  const nav=([{t:'Dashboard',i:'home'},{t:'Applicants',i:'users'},{t:'Events',i:'calendar'},{t:'Marketplace',i:'bag'},{t:'More',i:'more'}] as {t:Tab,i:string}[]);
  return <div className="w-full h-full bg-[#020b18] overflow-hidden">
    <div className="relative w-full h-full bg-[#020b18] text-white flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">{body}</div>
      <nav className="absolute bottom-0 left-0 right-0 h-20 bg-[#071426]/95 backdrop-blur border-t border-white/10 px-2 pt-2 flex justify-around">
        {nav.map(n=><button key={n.t} onClick={()=>setTab(n.t)} className={`w-[19%] flex flex-col items-center gap-1.5 py-1 ${tab===n.t?'text-amber-400':'text-slate-500'}`}><span className={`w-9 h-9 rounded-xl flex items-center justify-center ${tab===n.t?'bg-amber-400/10':''}`}><Icon name={n.i} size={20}/></span><span className="text-[9px] font-bold">{n.t}</span></button>)}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-white/25 pointer-events-none" />
      </nav>
    </div>
  </div>;
}
