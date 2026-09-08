import { useState } from 'react'
import MobilePrototype from './MobilePrototype'
import DesktopPrototype from './DesktopPrototype'

type Mode = 'mobile' | 'desktop'

export default function App() {
  const [mode, setMode] = useState<Mode>('mobile')

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
            <p>
              One platform for student organizations, applications, events, merch, and campus opportunities — now shown as a real interactive prototype.
            </p>
            <div className="hero-tags">
              <span className="tag">Interactive mobile prototype</span>
              <span className="tag">Interactive desktop prototype</span>
              <span className="tag">Ateneo de Davao University</span>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-kicker">LIVE PROTOTYPE</div>
            <strong>Click the components.</strong>
            <span>Buttons, tabs, cards, forms, filters, notifications, and navigation remain interactive.</span>
          </div>
        </section>

        <section className="section">
          <p className="kicker">THE EXPERIENCE</p>
          <h2>One walkthrough. Two real interfaces.</h2>
          <p className="lede">
            Switch between the student mobile experience and the desktop web experience. The interface inside each device is the actual React prototype, not a screenshot.
          </p>

          <div className="ba-grid">
            <div className="ba-card before">
              <span className="ba-label">Before</span>
              <h3>Scattered campus tools</h3>
              <ul className="ba-list">
                <li><span className="ico">×</span><span>Recruitment posts get buried in social feeds.</span></li>
                <li><span className="ico">×</span><span>Applications move between forms, chats, and spreadsheets.</span></li>
                <li><span className="ico">×</span><span>Students have no single status tracker.</span></li>
              </ul>
            </div>
            <div className="ba-card after">
              <span className="ba-label">With OrgConnect</span>
              <h3>One connected experience</h3>
              <ul className="ba-list">
                <li><span className="ico">✓</span><span>Search organizations and see recruitment status.</span></li>
                <li><span className="ico">✓</span><span>Apply and track applications in one place.</span></li>
                <li><span className="ico">✓</span><span>Discover events, merch, local deals, and opportunities.</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section prototype-section" id="prototype">
          <p className="kicker">INTERACTIVE PROTOTYPE</p>
          <h2>Try OrgConnect yourself.</h2>
          <p className="lede">Use the switch below, then click directly inside the phone or browser.</p>

          <div className="proto-toolbar" role="tablist" aria-label="Prototype device">
            <div className="seg">
              <button className={mode === 'mobile' ? 'active' : ''} onClick={() => setMode('mobile')} type="button">Mobile app</button>
              <button className={mode === 'desktop' ? 'active' : ''} onClick={() => setMode('desktop')} type="button">Desktop / Web</button>
            </div>
            <span className="interaction-hint">● LIVE — controls are clickable</span>
          </div>

          <div className="proto-stage">
            {mode === 'mobile' ? (
              <div className="phone-frame interactive-device">
                <div className="phone-speaker" />
                <div className="phone-screen live-mobile">
                  <MobilePrototype />
                </div>
              </div>
            ) : (
              <div className="browser-frame interactive-device desktop-device">
                <div className="browser-bar">
                  <span className="dot-b red" />
                  <span className="dot-b yellow" />
                  <span className="dot-b green" />
                  <div className="addr">orgconnect.app</div>
                </div>
                <div className="browser-screen live-desktop">
                  <DesktopPrototype />
                </div>
              </div>
            )}
          </div>

          <div className="proto-help">
            <strong>{mode === 'mobile' ? 'Mobile mode:' : 'Desktop mode:'}</strong>{' '}
            {mode === 'mobile'
              ? 'Start with Sign In, then use the bottom navigation, organization cards, applications, events, notifications, merch, and profile.'
              : 'Use the sidebar, top search, organization directory, applications, events, merch, profile, and notification panel.'}
          </div>
        </section>


        <section className="section feedback-section" id="feedback">
          <p className="kicker">FEEDBACK</p>
          <h2>Help us improve OrgConnect.</h2>
          <p className="lede">Try the prototype first, then tell us what worked, what felt confusing, or what you would like us to improve.</p>

          <form className="feedback-form" action="https://formspree.io/f/xnpqgwla" method="POST">
            <div className="feedback-grid">
              <label>
                <span>Name <small>(optional)</small></span>
                <input type="text" name="name" placeholder="Juan Dela Cruz" autoComplete="name" />
              </label>
              <label>
                <span>Email <small>(optional)</small></span>
                <input type="email" name="email" placeholder="juan@example.com" autoComplete="email" />
              </label>
            </div>

            <label className="feedback-message">
              <span>Your feedback</span>
              <textarea name="message" rows={5} placeholder="Share your thoughts about the prototype..." required />
            </label>

            <input type="hidden" name="_subject" value="OrgConnect Prototype Feedback" />
            <div className="feedback-actions">
              <p>Powered by Formspree. Replace <code>YOUR_FORM_ID</code> with your Formspree form ID before publishing.</p>
              <button type="submit">Send Feedback</button>
            </div>
          </form>
        </section>

        <footer className="foot">
          <span className="mark-small">OrgConnect</span> · One platform, every organization, every opportunity.
        </footer>
      </div>
    </main>
  )
}
