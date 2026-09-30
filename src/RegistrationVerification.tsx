import { useState } from "react";

type AccountType = "organization" | "business";

const Shield = ({size=22}:{size?:number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>;
const Mail = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>;
const Upload = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 20h14"/></svg>;

export default function RegistrationVerification({type,mobile=false,onComplete,onCancel}:{type:AccountType;mobile?:boolean;onComplete?:()=>void;onCancel?:()=>void}) {
  const [step,setStep]=useState(1);
  const [verified,setVerified]=useState(false);
  const [details,setDetails]=useState({name:"", representative:"", contact:"", category:""});
  const [error,setError]=useState("");
  const [accountEmail,setAccountEmail]=useState("");
  const [file,setFile]=useState("");
  const [privacy,setPrivacy]=useState(false);
  const [accurate,setAccurate]=useState(false);
  const isOrg=type==="organization";
  const title=isOrg?"Register an Organization":"Register a Local Business";
  const documentName=isOrg?"Recognition letter, organization ID, or adviser endorsement":"Valid business permit, Mayor’s permit, or DTI/SEC registration";

  const wrap=mobile?"flex-1 overflow-y-auto phone-scroll pb-28 bg-[#020b18]":"h-full overflow-y-auto bg-[#020b18] p-8";
  const panel=mobile?"px-4":"max-w-4xl mx-auto";
  const input="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-3 text-xs text-white outline-none focus:border-amber-400/70 placeholder:text-slate-600";

  return <div className={wrap}>
    <div className={mobile?"px-4 pt-14 pb-4":"mb-6"}>
      <div className="flex items-center gap-2 text-amber-400 text-[10px] font-black uppercase tracking-[.16em]"><Shield size={18}/> Secure registration</div>
      <h2 className={`${mobile?"text-2xl":"text-xl"} text-white font-black mt-2`}>{title}</h2>
      <p className="text-slate-400 text-xs mt-1">Preview the registration flow. You can click Next without entering details or uploading documents.</p>
    </div>
    <div className={panel}>
      <div className="grid grid-cols-4 gap-2 mb-5">
        {["Email","Details","Documents","Review"].map((label,i)=><div key={label}><div className={`h-1.5 rounded-full ${step>=i+1?"bg-amber-400":"bg-white/10"}`}/><div className={`text-[9px] mt-1.5 font-bold ${step===i+1?"text-amber-400":"text-slate-600"}`}>{i+1}. {label}</div></div>)}
      </div>

      <div className={`rounded-2xl bg-[#0e1e38] border border-white/10 ${mobile?"p-4":"p-6"}`}>
        {step===1&&<div>
          <h3 className="text-white font-black">Verify your email address</h3>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Use an official or accountable email. Email verification is simulated in this prototype; no email is sent.</p>
          <label className="block text-slate-500 text-[10px] uppercase tracking-wider font-black mt-5 mb-1.5">Account email</label>
          <div className="flex gap-2"><div className={`${input} flex items-center gap-2 text-slate-300`}><Mail/><input aria-label="Account email" type="email" value={accountEmail} onChange={e=>{setAccountEmail(e.target.value);setVerified(false)}} placeholder="you@example.com" className="w-full min-w-0 bg-transparent outline-none"/></div><button onClick={()=>{setVerified(true);setError("")}} className={`px-4 rounded-xl text-xs font-black whitespace-nowrap ${verified?"bg-emerald-400/15 text-emerald-400":"bg-amber-400 text-[#020b18]"}`}>{verified?"Verified ✓":"Verify demo email"}</button></div>
          <div className="mt-4 rounded-xl bg-blue-400/5 border border-blue-400/20 p-3 text-[10px] text-slate-400 leading-relaxed">The verification link expires after 15 minutes. OrgConnect will never ask for your password by email.</div>
        </div>}

        {step===2&&<div>
          <h3 className="text-white font-black">{isOrg?"Organization":"Business"} information</h3>
          <p className="text-slate-400 text-xs mt-1.5">These details will be checked before the account is approved.</p>
          <div className={`${mobile?"space-y-3":"grid grid-cols-2 gap-4"} mt-5`}>
            <label className="block"><span className="block text-slate-500 text-[10px] font-black mb-1.5">{isOrg?"ORGANIZATION / CLUSTER NAME":"REGISTERED BUSINESS NAME"}</span><input className={input} value={details.name} onChange={e=>setDetails({...details,name:e.target.value})} placeholder={isOrg?"PIGLASAPAT":"Campus Brew Café"}/></label>
            <label className="block"><span className="block text-slate-500 text-[10px] font-black mb-1.5">{isOrg?"ADVISER / MODERATOR":"OWNER / AUTHORIZED REPRESENTATIVE"}</span><input className={input} value={details.representative} onChange={e=>setDetails({...details,representative:e.target.value})} placeholder="Full name"/></label>
            <label className="block"><span className="block text-slate-500 text-[10px] font-black mb-1.5">CONTACT NUMBER</span><input className={input} value={details.contact} onChange={e=>setDetails({...details,contact:e.target.value})} placeholder="09XX XXX XXXX"/></label>
            <label className="block"><span className="block text-slate-500 text-[10px] font-black mb-1.5">{isOrg?"SCHOOL UNIT / CATEGORY":"BUSINESS ADDRESS"}</span><input className={input} value={details.category} onChange={e=>setDetails({...details,category:e.target.value})} placeholder={isOrg?"e.g. Student organization":"Complete address"}/></label>
          </div>
        </div>}

        {step===3&&<div>
          <h3 className="text-white font-black">Validation document</h3>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Upload one valid document: {documentName}.</p>
          <label className="mt-5 min-h-32 rounded-2xl border-2 border-dashed border-white/15 bg-white/[.025] flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400/60">
            <span className="w-11 h-11 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center"><Upload/></span>
            <span className="text-white text-xs font-black mt-3">{file||"Choose PDF, JPG, or PNG"}</span>
            <span className="text-slate-500 text-[10px] mt-1">Maximum file size: 10 MB</span>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e=>{const f=e.target.files?.[0];setFile("");if(!f)return;if(f.size>10*1024*1024||!/\.(pdf|jpe?g|png)$/i.test(f.name)){setError("Choose a PDF, JPG, or PNG file up to 10 MB.");return;}setFile(f.name);setError("")}}/>
          </label>
          <div className="mt-4 rounded-xl bg-emerald-400/5 border border-emerald-400/20 p-3 text-[10px] text-slate-400 leading-relaxed"><b className="text-emerald-400">Protected upload.</b> Prototype only: the selected file stays on your device and is not uploaded. In the planned service, documents will be restricted to authorized reviewers and kept under a retention policy.</div>
        </div>}

        {step===4&&<div>
          <h3 className="text-white font-black">Consent and submission</h3>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Review how OrgConnect handles your information before submitting.</p>
          <div className="mt-4 rounded-xl bg-white/[.035] border border-white/10 p-4">
            <div className="flex gap-3"><span className="text-amber-400"><Shield/></span><div><div className="text-white text-xs font-black">Data Privacy Notice</div><p className="text-slate-400 text-[10px] leading-relaxed mt-1">Personal and verification data will be collected only to validate the account, prevent fraudulent listings, operate the service, and meet legal obligations. Data is processed in accordance with the Philippine Data Privacy Act of 2012 (RA 10173). You may request access, correction, or deletion subject to legal and operational retention requirements.</p></div></div>
          </div>
          <label className="flex items-start gap-3 mt-4 cursor-pointer"><input type="checkbox" checked={privacy} onChange={e=>setPrivacy(e.target.checked)} className="mt-0.5 accent-amber-400"/><span className="text-slate-300 text-[11px] leading-relaxed">I have read the Privacy Notice and consent to the collection and processing of the submitted data for verification.</span></label>
          <label className="flex items-start gap-3 mt-3 cursor-pointer"><input type="checkbox" checked={accurate} onChange={e=>setAccurate(e.target.checked)} className="mt-0.5 accent-amber-400"/><span className="text-slate-300 text-[11px] leading-relaxed">I confirm that the information and documents are accurate and that I am authorized to register this {isOrg?"organization":"business"}.</span></label>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center"><div className="rounded-xl bg-white/5 p-3"><div className="text-amber-400 text-sm font-black">1</div><div className="text-slate-500 text-[9px] mt-1">Email verified</div></div><div className="rounded-xl bg-white/5 p-3"><div className="text-amber-400 text-sm font-black">2</div><div className="text-slate-500 text-[9px] mt-1">Reviewer checks file</div></div><div className="rounded-xl bg-white/5 p-3"><div className="text-amber-400 text-sm font-black">3</div><div className="text-slate-500 text-[9px] mt-1">Email decision sent</div></div></div>
        </div>}
      </div>

      {error&&<p role="alert" className="text-red-400 text-xs mt-3">{error}</p>}
      {step===2&&<p className="text-slate-400 text-xs mt-3">Fields are optional in this demo. Click Next to continue.</p>}
      <div className="flex gap-3 mt-4 mb-5">
        {step===1&&onCancel&&<button onClick={onCancel} className="text-slate-300 text-xs">Back to login</button>}
        {step>1&&<button onClick={()=>setStep(v=>v-1)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-black">Back</button>}
        <button onClick={()=>{setError("");if(step<4)setStep(v=>v+1);else onComplete?.()}} className="flex-[1.5] py-3 rounded-xl bg-amber-400 text-[#020b18] text-xs font-black">{step===4?"Proceed to dashboard":"Next"}</button>
      </div>
      <p className="text-center text-slate-600 text-[9px] pb-4">Demo submission opens the dashboard. Approval and public listing would require reviewer verification in the live service.</p>
    </div>
  </div>;
}
