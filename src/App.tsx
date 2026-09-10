import { useState } from 'react'
import MobilePrototype from './MobilePrototype'
import DesktopPrototype from './DesktopPrototype'
import OrganizationMobilePrototype from './OrganizationMobilePrototype'
import OrganizationDesktopPrototype from './OrganizationDesktopPrototype'
import BusinessMobilePrototype from './BusinessMobilePrototype'
import BusinessDesktopPrototype from './BusinessDesktopPrototype'

type Mode = 'mobile' | 'desktop'
type Pov = 'student' | 'organization' | 'business'

export default function App() {
  const [mode, setMode] = useState<Mode>('mobile')
  const [pov, setPov] = useState<Pov>('student')

  const Prototype = pov === 'student'
    ? (mode === 'mobile' ? MobilePrototype : DesktopPrototype)
    : pov === 'organization'
      ? (mode === 'mobile' ? OrganizationMobilePrototype : OrganizationDesktopPrototype)
      : (mode === 'mobile' ? BusinessMobilePrototype : BusinessDesktopPrototype)

  const povName = pov === 'student' ? 'Student' : pov === 'organization' ? 'Organization' : 'Local Business'

  return (
    <main className="walkthrough-shell">
      <div className="wrap">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow-logo">
              <img className="site-logo" src="./orgconnect-logo.jpg" alt="OrgConnect logo" />
              <span><b>Org</b>Connect</span>
            </div>
            <h1>Discover. Connect. <em>Belong.</em></h1>
            <p>One platform for student organizations, applications, events, merch, local businesses, and campus opportunities — shown as real interactive prototypes.</p>
            <div className="hero-tags">
              <span className="tag">Student POV</span>
              <span className="tag">Organization POV</span>
              <span className="tag">Local Business POV</span>
              <span className="tag">Mobile + Desktop</span>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-kicker">LIVE PROTOTYPES</div>
            <strong>Click the components.</strong>
            <span>All six prototype views are combined into this website and remain interactive.</span>
          </div>
        </section>

        <section className="section">
          <p className="kicker">THE EXPERIENCE</p>
          <h2>One website. Three user perspectives.</h2>
          <p className="lede">Explore OrgConnect as a student, an organization officer, or a local business partner. Each perspective includes its own mobile and desktop prototype.</p>
          <div className="ba-grid">
            <div className="ba-card before">
              <span className="ba-label">Before</span>
              <h3>Scattered campus tools</h3>
              <ul className="ba-list">
                <li><span className="ico">×</span><span>Recruitment posts get buried in social feeds.</span></li>
                <li><span className="ico">×</span><span>Applications and partnerships move between forms, chats, and spreadsheets.</span></li>
                <li><span className="ico">×</span><span>Students, organizations, and businesses use separate channels.</span></li>
              </ul>
            </div>
            <div className="ba-card after">
              <span className="ba-label">With OrgConnect</span>
              <h3>One connected experience</h3>
              <ul className="ba-list">
                <li><span className="ico">✓</span><span>Students discover organizations, events, applications, merch, and deals.</span></li>
                <li><span className="ico">✓</span><span>Organizations manage recruitment and engagement.</span></li>
                <li><span className="ico">✓</span><span>Local businesses can participate in the campus marketplace.</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section prototype-section" id="prototype">
          <p className="kicker">INTERACTIVE PROTOTYPES</p>
          <h2>Choose a POV and try it yourself.</h2>
          <p className="lede">First choose the user perspective, then switch between its mobile and desktop version.</p>

          <div className="pov-switch" role="tablist" aria-label="User perspective">
            <button type="button" className={pov === 'student' ? 'active' : ''} onClick={() => setPov('student')}>Student POV</button>
            <button type="button" className={pov === 'organization' ? 'active' : ''} onClick={() => setPov('organization')}>Organization POV</button>
            <button type="button" className={pov === 'business' ? 'active' : ''} onClick={() => setPov('business')}>Local Business POV</button>
          </div>

          <div className="proto-toolbar" role="tablist" aria-label="Prototype device">
            <div className="seg">
              <button className={mode === 'mobile' ? 'active' : ''} onClick={() => setMode('mobile')} type="button">Mobile app</button>
              <button className={mode === 'desktop' ? 'active' : ''} onClick={() => setMode('desktop')} type="button">Desktop / Web</button>
            </div>
            <span className="interaction-hint">● LIVE — controls are clickable</span>
          </div>

          <div className="current-view-label">{povName} POV · {mode === 'mobile' ? 'Mobile' : 'Desktop'}</div>

          <div className="proto-stage">
            {mode === 'mobile' ? (
              <div className="phone-frame interactive-device">
                <div className="phone-speaker" />
                <div className="phone-screen live-mobile">
                  <Prototype />
                </div>
              </div>
            ) : (
              <div className="browser-frame interactive-device desktop-device">
                <div className="browser-bar">
                  <span className="dot-b red" />
                  <span className="dot-b yellow" />
                  <span className="dot-b green" />
                  <div className="addr">orgconnect.app · {povName.toLowerCase()} view</div>
                </div>
                <div className="browser-screen live-desktop">
                  <Prototype />
                </div>
              </div>
            )}
          </div>

          <div className="proto-help">
            <strong>{povName} · {mode === 'mobile' ? 'Mobile mode:' : 'Desktop mode:'}</strong>{' '}
            Click directly inside the prototype. Its original buttons, navigation, cards, forms, and controls remain interactive.
          </div>
        </section>

        <section className="section feedback-section" id="feedback">
          <p className="kicker">FEEDBACK</p>
          <h2>Help us improve OrgConnect.</h2>
          <p className="lede">Try any of the prototypes first, then tell us what worked, what felt confusing, or what you would like us to improve.</p>
          <form className="feedback-form" action="https://formspree.io/f/xnpqgwla" method="POST">
            <div className="feedback-grid">
              <label><span>Name <small>(optional)</small></span><input type="text" name="name" placeholder="Juan Dela Cruz" autoComplete="name" /></label>
              <label><span>Email <small>(optional)</small></span><input type="email" name="email" placeholder="juan@example.com" autoComplete="email" /></label>
            </div>
            <label className="feedback-message"><span>Your feedback</span><textarea name="message" rows={5} placeholder="Share your thoughts about the prototype..." required /></label>
            <input type="hidden" name="_subject" value="OrgConnect Prototype Feedback" />
            <div className="feedback-actions">
              <p>Feedback is submitted through Formspree.</p>
              <button type="submit">Send Feedback</button>
            </div>
          </form>
        </section>

        <footer className="foot"><span className="mark-small">OrgConnect</span> · One platform, every organization, every opportunity.</footer>
      </div>
    </main>
  )
}
