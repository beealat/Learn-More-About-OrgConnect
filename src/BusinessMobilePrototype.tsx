import { useMemo, useState } from "react";
import orgConnectLogo from "./povassets/businessmobile/orgconnect-logo-clean.png";

type Tab = "Dashboard" | "Products" | "Orders" | "Analytics" | "More";
type OrderStatus = "New" | "Preparing" | "Ready" | "Completed";

const products = [
  { name: "Iced Spanish Latte", price: 95, stock: 28, sales: 64, image: "https://images.unsplash.com/photo-1783244653100-ad25e5452166?auto=format&fit=crop&w=500&q=80", active: true },
  { name: "Chocolate Chip Cookie", price: 45, stock: 34, sales: 47, image: "https://images.unsplash.com/photo-1495085570317-992279e0c33d?auto=format&fit=crop&w=500&q=80", active: true },
  { name: "Chicken Pesto Sandwich", price: 110, stock: 12, sales: 31, image: "https://images.unsplash.com/photo-1783286854750-a81c5e7a4bd3?auto=format&fit=crop&w=500&q=80", active: true },
  { name: "Study Combo", price: 135, stock: 8, sales: 22, image: "https://images.unsplash.com/photo-1741448682479-cf2ff435576d?auto=format&fit=crop&w=500&q=80", active: false },
];

const initialOrders = [
  { id: "OC-1048", customer: "Juan Dela Cruz", items: "2 items", total: 190, status: "New" as OrderStatus, time: "8 min ago" },
  { id: "OC-1047", customer: "Maria Santos", items: "1 item", total: 110, status: "Preparing" as OrderStatus, time: "14 min ago" },
  { id: "OC-1046", customer: "Carlo Reyes", items: "3 items", total: 255, status: "Ready" as OrderStatus, time: "22 min ago" },
  { id: "OC-1045", customer: "Angela Cruz", items: "2 items", total: 140, status: "Completed" as OrderStatus, time: "Today, 10:12 AM" },
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const p: Record<string, React.ReactNode> = {
    home: <path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z"/>,
    box: <><path d="M4 7l8-4 8 4-8 4-8-4z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/></>,
    orders: <><path d="M6 3h12l2 18H4L6 3z"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    bell: <><path d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    store: <><path d="M3 9l2-5h14l2 5"/><path d="M5 9v11h14V9M9 20v-6h6v6"/><path d="M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0015 19.4a1.7 1.7 0 00-1 .6 1.7 1.7 0 00-.4 1.1V21h-4v-.09A1.7 1.7 0 008.6 19.4a1.7 1.7 0 00-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 004.6 15a1.7 1.7 0 00-.6-1 1.7 1.7 0 00-1.1-.4H3v-4h.09A1.7 1.7 0 004.6 8.6a1.7 1.7 0 00-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 009 4.6a1.7 1.7 0 001-.6 1.7 1.7 0 00.4-1.1V3h4v.09A1.7 1.7 0 0015.4 4.6a1.7 1.7 0 001.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0019.4 9c.14.37.36.7.64.97.28.28.63.48 1 .59H21v4h-.09a1.7 1.7 0 00-1.51.44z"/></>,
    chevron: <path d="M9 18l6-6-6-6"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{p[name]}</svg>;
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="px-4 pt-12 pb-3 flex items-center justify-between flex-shrink-0">
    <div>
      <div className="flex items-center gap-2 mb-1"><img src={orgConnectLogo} className="w-7 h-7 rounded-full object-cover"/><span className="text-[11px] font-black tracking-[.18em] uppercase text-amber-400">Local Business Portal</span></div>
      <h1 className="text-white text-2xl font-black leading-tight">{title}</h1>
      {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
    </div>
    <button className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300"><Icon name="bell" size={19}/><span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"/></button>
  </div>;
}

function Stat({label,value,note}:{label:string;value:string;note:string}){return <div className="rounded-2xl p-3 border border-white/10 bg-[#0e1e38]"><div className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">{label}</div><div className="text-xl font-black text-white mt-1">{value}</div><div className="text-[10px] mt-1 text-amber-400 font-bold">{note}</div></div>}
function OrderBadge({s}:{s:OrderStatus}){const c={New:"bg-blue-500/15 text-blue-400",Preparing:"bg-amber-400/15 text-amber-400",Ready:"bg-emerald-400/15 text-emerald-400",Completed:"bg-slate-400/10 text-slate-400"}[s];return <span className={`px-2 py-1 rounded-lg text-[9px] font-black ${c}`}>{s.toUpperCase()}</span>}

function Dashboard({go}:{go:(t:Tab)=>void}){
  return <div className="flex-1 overflow-y-auto phone-scroll pb-28"><Header title="Good morning, Campus Brew" subtitle="Manage your products, orders, and student reach."/><div className="px-4">
    <div className="rounded-3xl p-4 bg-gradient-to-br from-[#172c52] to-[#0d1b3e] border border-white/10 flex items-center gap-3 mb-4"><div className="w-14 h-14 rounded-2xl bg-amber-300/15 overflow-hidden"><img src="https://images.unsplash.com/photo-1741448682479-cf2ff435576d?auto=format&fit=crop&w=500&q=80" alt="Campus Brew Café" className="w-full h-full object-cover"/></div><div className="flex-1"><div className="text-white font-black">Campus Brew Café</div><div className="text-slate-400 text-xs mt-1">Food & Drinks · Near campus</div><div className="mt-2 inline-flex px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-[10px] font-black">STORE ACTIVE</div></div><Icon name="chevron" size={18}/></div>
    <div className="grid grid-cols-2 gap-2 mb-5"><Stat label="Sales Today" value="₱2,840" note="+12% vs yesterday"/><Stat label="Orders" value="18" note="3 active now"/><Stat label="Product Views" value="486" note="+21% this week"/><Stat label="Net Sales" value="₱2,698" note="after 5% commission"/></div>
    <h2 className="text-white font-black text-sm mb-2">Quick actions</h2><div className="grid grid-cols-4 gap-2 mb-5">{[{i:"plus",l:"Add Product",t:"Products" as Tab},{i:"orders",l:"Orders",t:"Orders" as Tab},{i:"chart",l:"Analytics",t:"Analytics" as Tab},{i:"store",l:"Store Profile",t:"More" as Tab}].map(x=><button key={x.l} onClick={()=>go(x.t)} className="rounded-2xl bg-[#0e1e38] border border-white/10 py-3 px-1 flex flex-col items-center gap-2 text-slate-200"><span className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center"><Icon name={x.i} size={18}/></span><span className="text-[9px] font-bold">{x.l}</span></button>)}</div>
    <div className="flex items-center justify-between mb-2"><h2 className="text-white font-black text-sm">Recent orders</h2><button onClick={()=>go("Orders")} className="text-amber-400 text-xs font-bold">See all</button></div><div className="rounded-2xl border border-white/10 bg-[#0e1e38] overflow-hidden mb-5">{initialOrders.slice(0,3).map((o,i)=><div key={o.id} className={`p-3 flex items-center gap-3 ${i<2?"border-b border-white/5":""}`}><div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">🧾</div><div className="flex-1"><div className="text-white text-xs font-bold">{o.id} · {o.customer}</div><div className="text-slate-500 text-[10px]">{o.items} · ₱{o.total}</div></div><OrderBadge s={o.status}/></div>)}</div>
    <h2 className="text-white font-black text-sm mb-2">Top products</h2><div className="rounded-2xl border border-white/10 bg-[#0e1e38] overflow-hidden">{products.slice(0,3).map((p,i)=><div key={p.name} className={`p-3 flex items-center ${i<2?"border-b border-white/5":""}`}><div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl mr-3"><img src={p.image} alt={p.name} className="w-full h-full object-cover"/></div><div className="flex-1"><div className="text-white text-xs font-bold">{p.name}</div><div className="text-slate-500 text-[10px]">{p.sales} sold · {p.stock} in stock</div></div><div className="text-amber-400 text-xs font-black">₱{p.price}</div></div>)}</div>
  </div></div>
}

function Products(){const[q,setQ]=useState("");const list=useMemo(()=>products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())),[q]);return <div className="flex-1 overflow-y-auto phone-scroll pb-28"><Header title="Products" subtitle="Manage what students can view in the marketplace."/><div className="px-4"><div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-3 flex items-center gap-2 mb-3"><Icon name="search" size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products..." className="bg-transparent outline-none text-xs text-white placeholder:text-slate-500 flex-1"/></div><button className="w-full mb-4 py-3 rounded-2xl bg-amber-400 text-[#020b18] text-xs font-black flex items-center justify-center gap-2"><Icon name="plus" size={16}/>Add new product</button><div className="space-y-3">{list.map(p=><div key={p.name} className="rounded-2xl border border-white/10 bg-[#0e1e38] p-3 flex items-center"><div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-2xl mr-3"><img src={p.image} alt={p.name} className="w-full h-full object-cover"/></div><div className="flex-1"><div className="text-white text-xs font-black">{p.name}</div><div className="text-slate-500 text-[10px] mt-1">{p.stock} stock · {p.sales} sold</div><div className={`text-[9px] font-black mt-1 ${p.active?"text-emerald-400":"text-amber-400"}`}>{p.active?"ACTIVE":"HIDDEN"}</div></div><div className="text-right"><div className="text-amber-400 text-sm font-black">₱{p.price}</div><button className="mt-2 px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-[10px] font-bold">Edit</button></div></div>)}</div></div></div>}

function Orders(){const[orders,setOrders]=useState(initialOrders);const advance=(id:string)=>setOrders(v=>v.map(o=>o.id===id?{...o,status:o.status==="New"?"Preparing":o.status==="Preparing"?"Ready":o.status==="Ready"?"Completed":"Completed"}:o));return <div className="flex-1 overflow-y-auto phone-scroll pb-28"><Header title="Orders" subtitle="Track and fulfill student marketplace orders."/><div className="px-4 space-y-3">{orders.map(o=><div key={o.id} className="rounded-2xl border border-white/10 bg-[#0e1e38] p-4"><div className="flex justify-between items-start"><div><div className="text-white text-sm font-black">{o.id}</div><div className="text-slate-400 text-xs mt-1">{o.customer} · {o.time}</div></div><OrderBadge s={o.status}/></div><div className="mt-3 flex justify-between text-xs"><span className="text-slate-500">{o.items}</span><span className="text-white font-black">₱{o.total}</span></div>{o.status!=="Completed"&&<button onClick={()=>advance(o.id)} className="w-full mt-3 py-2.5 rounded-xl bg-amber-400/10 text-amber-400 text-xs font-black">{o.status==="New"?"Start preparing":o.status==="Preparing"?"Mark ready":"Complete order"}</button>}</div>)}</div></div>}

function Analytics(){return <div className="flex-1 overflow-y-auto phone-scroll pb-28"><Header title="Analytics" subtitle="See how students discover and buy from your store."/><div className="px-4"><div className="grid grid-cols-2 gap-2 mb-4"><Stat label="This Month" value="₱18,420" note="Gross marketplace sales"/><Stat label="Orders" value="126" note="Average ₱146/order"/><Stat label="Store Views" value="3,840" note="+18% month over month"/><Stat label="Commission" value="₱921" note="5% OrgConnect fee"/></div><div className="rounded-2xl border border-white/10 bg-[#0e1e38] p-4 mb-4"><h3 className="text-white text-sm font-black mb-4">Product performance</h3>{products.slice(0,3).map((p,i)=><div key={p.name} className="mb-4 last:mb-0"><div className="flex justify-between text-xs mb-1"><span className="text-slate-400">{p.name}</span><span className="text-white font-black">{p.sales} sold</span></div><div className="h-2 rounded-full bg-white/5"><div className="h-full rounded-full bg-amber-400" style={{width:`${88-i*17}%`}}/></div></div>)}</div><div className="rounded-2xl border border-white/10 bg-[#0e1e38] p-4"><h3 className="text-white text-sm font-black">Marketplace fee summary</h3><p className="text-slate-400 text-xs leading-relaxed mt-2">OrgConnect takes a 5% commission on products sold through the marketplace. Your estimated net sales this month are <span className="text-white font-black">₱17,499</span>.</p></div></div></div>}

function More(){return <div className="flex-1 overflow-y-auto phone-scroll pb-28"><Header title="Business Settings" subtitle="Manage your public store and account."/><div className="px-4 space-y-3">{[{i:"store",t:"Store profile",s:"Campus Brew Café · Food & Drinks"},{i:"box",t:"Pickup & availability",s:"Set store hours and pickup details"},{i:"chart",t:"Payout summary",s:"Review gross sales, commission, and net amount"},{i:"settings",t:"Account settings",s:"Notifications, contact details, and security"}].map(x=><button key={x.t} className="w-full rounded-2xl border border-white/10 bg-[#0e1e38] p-4 flex items-center text-left"><span className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mr-3"><Icon name={x.i} size={18}/></span><span className="flex-1"><span className="block text-white text-xs font-black">{x.t}</span><span className="block text-slate-500 text-[10px] mt-1">{x.s}</span></span><Icon name="chevron" size={17}/></button>)}</div></div>}

export default function App(){
  const[tab,setTab]=useState<Tab>("Dashboard");
  const body=tab==="Dashboard"?<Dashboard go={setTab}/>:tab==="Products"?<Products/>:tab==="Orders"?<Orders/>:tab==="Analytics"?<Analytics/>:<More/>;
  const nav:[Tab,string,string][]=[["Dashboard","home","Home"],["Products","box","Products"],["Orders","orders","Orders"],["Analytics","chart","Analytics"],["More","more","More"]];
  return <div className="w-full h-full bg-[#020b18] overflow-hidden">
    <div className="relative w-full h-full bg-[#020b18] text-white flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">{body}</div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#071426]/95 backdrop-blur border-t border-white/10 px-3 flex items-start pt-2">
        {nav.map(([t,i,l])=><button key={t} onClick={()=>setTab(t)} className={`flex-1 flex flex-col items-center gap-1 py-1 ${tab===t?"text-amber-400":"text-slate-500"}`}><span className={`w-9 h-9 rounded-xl flex items-center justify-center ${tab===t?"bg-amber-400/10":""}`}><Icon name={i} size={19}/></span><span className="text-[9px] font-black">{l}</span></button>)}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-white/25 pointer-events-none" />
      </div>
    </div>
  </div>
}
