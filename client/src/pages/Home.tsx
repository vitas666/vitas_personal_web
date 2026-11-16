import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight,
  Copy, Github, Globe2, Mail, MapPin, Menu, MessageSquareText, X,
} from "lucide-react";
import ArchitectureViz from "@/components/ArchitectureViz";
import { copy, type Language } from "@/i18n/content";

const githubUrl = "https://github.com/vitas666?tab=repositories";
const emailAddress = "twandy543hient@gmail.com";

function SectionEyebrow({ children }: { children: string }) {
  return <div className="section-eyebrow"><span className="eyebrow-line" /><span>{children}</span></div>;
}

function LanguageToggle({ lang, onChange }: { lang: Language; onChange: (lang: Language) => void }) {
  return (
    <div className="language-toggle" role="group" aria-label={lang === "zh" ? "選擇語言" : "Select language"}>
      <button type="button" onClick={() => onChange("zh")} className={lang === "zh" ? "active" : ""} aria-pressed={lang === "zh"}>繁中</button>
      <span aria-hidden="true">/</span>
      <button type="button" onClick={() => onChange("en")} className={lang === "en" ? "active" : ""} aria-pressed={lang === "en"}>EN</button>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Language>(() => {
    try { return window.localStorage.getItem("vitas-language") === "en" ? "en" : "zh"; }
    catch { return "zh"; }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusExpanded, setStatusExpanded] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [mailPrepared, setMailPrepared] = useState(false);
  const [formBusy, setFormBusy] = useState(false);
  const previousFocus = useRef<HTMLElement | null>(null);
  const t = copy[lang];
  const projects = t.projects.items;

  const changeLanguage = (next: Language) => {
    setLang(next);
    document.documentElement.lang = next === "zh" ? "zh-Hant" : "en";
    try { window.localStorage.setItem("vitas-language", next); } catch { /* Private browsing can disable storage. */ }
  };

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    const targets = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      targets.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    document.body.classList.add("reveal-ready");
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.11, rootMargin: "0px 0px -36px 0px" });
    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [lang]);

  useEffect(() => {
    if (activeProject === null) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.classList.add("modal-open");
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveProject(null);
        return;
      }
      if (event.key === "Tab") {
        const focusable = document.querySelectorAll<HTMLElement>(".project-modal a[href], .project-modal button:not([disabled])");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    const closeButton = document.querySelector<HTMLButtonElement>(".modal-close");
    closeButton?.focus();
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("modal-open");
      previousFocus.current?.focus();
    };
  }, [activeProject]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
    } catch {
      const input = document.createElement("textarea");
      input.value = emailAddress;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  };

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const sender = String(form.get("email") ?? "");
    const subject = String(form.get("subject") ?? "");
    const message = String(form.get("message") ?? "");
    setFormBusy(true);
    const mailSubject = `[VitasYao.dev] ${subject} — ${name}`;
    const mailBody = `${lang === "zh" ? "稱呼" : "Name"}: ${name}\n${lang === "zh" ? "回覆信箱" : "Reply-to"}: ${sender}\n\n${message}`;
    window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    window.setTimeout(() => {
      setFormBusy(false);
      setMailPrepared(true);
    }, 650);
  };

  const closeMobileNav = () => setMenuOpen(false);
  const navItems = [
    { href: "#about", label: t.nav.about }, { href: "#stack", label: t.nav.stack },
    { href: "#projects", label: t.nav.work }, { href: "#journey", label: t.nav.journey },
  ];

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="Vitas Yao — home">
            <span className="brand-mark"><span>V</span><i /><span>Y</span></span>
            <span className="brand-name">VITAS YAO<span>／ ENGINEER</span></span>
          </a>
          <nav className={`desktop-nav ${menuOpen ? "mobile-open" : ""}`} aria-label={lang === "zh" ? "主要導覽" : "Main navigation"}>
            {navItems.map((item) => <a key={item.href} href={item.href} onClick={closeMobileNav}>{item.label}</a>)}
            <a className="mobile-contact" href="#contact" onClick={closeMobileNav}>{t.nav.contact}<ArrowUpRight size={13}/></a>
          </nav>
          <div className="header-actions">
            <a className="header-github" href={githubUrl} target="_blank" rel="noreferrer" aria-label="Vitas Yao on GitHub"><Github size={17}/></a>
            <span className="header-separator" />
            <LanguageToggle lang={lang} onChange={changeLanguage}/>
            <button type="button" className="mobile-menu-button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? (lang === "zh" ? "關閉選單" : "Close menu") : (lang === "zh" ? "開啟選單" : "Open menu")}>
              {menuOpen ? <X size={19}/> : <Menu size={19}/>}
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero-grid-overlay" aria-hidden="true"/><div className="hero-glow" aria-hidden="true"/>
          <div className="hero-inner page-wrap">
            <div className="hero-copy">
              <div className="hero-kicker reveal"><span className="hero-kicker-dot"/>{t.hero.eyebrow}</div>
              <h1 className="hero-title reveal"><span className="hero-chinese">{t.hero.title}</span><span className="hero-roman">{t.hero.roman}<span className="hero-period">.</span></span></h1>
              <div className="hero-role reveal"><span className="role-marker">/</span>{t.hero.role}</div>
              <h2 className="hero-value reveal">{t.hero.value.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
              <p className="hero-description reveal">{t.hero.description}</p>
              <div className="status-wrap reveal">
                <button type="button" className="status-pill" aria-expanded={statusExpanded} onClick={() => setStatusExpanded((value) => !value)}><span className="status-light"/><span>{t.hero.status}</span><ArrowDownRight size={14}/></button>
                {statusExpanded && <p className="status-detail">{t.hero.statusMore}</p>}
              </div>
              <div className="hero-actions reveal">
                <a className="button-primary" href="#projects"><span>{t.hero.projects}</span><ArrowUpRight size={16}/></a>
                <a className="button-secondary" href="#contact"><span>{t.hero.contact}</span><ArrowRight size={15}/></a>
              </div>
              <a className="hero-github reveal" href={githubUrl} target="_blank" rel="noreferrer"><Github size={15}/><span>github.com/vitas666</span><ArrowUpRight size={12}/></a>
            </div>
            <div className="hero-art reveal"><ArchitectureViz lang={lang} nodes={t.hero.nodes} label={t.hero.live} uptime={t.hero.uptime}/></div>
          </div>
          <a className="hero-scroll" href="#about"><span>{t.hero.scroll}</span><span className="scroll-line"><i/></span></a>
          <span className="hero-coordinate">25° 01' 09.8" N&nbsp; / &nbsp;121° 27' 15.1" E</span>
        </section>

        <section className="about-section section-pad" id="about">
          <div className="page-wrap">
            <div className="section-heading split-heading reveal"><div><SectionEyebrow>{t.about.index}</SectionEyebrow><h2 className="section-title">{t.about.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2></div><div className="about-summary"><p>{t.about.body}</p><span className="summary-note"><i/>{t.about.note}</span></div></div>
            <div className="metrics-grid">
              {t.about.metrics.map((metric, index) => <article className={`metric-card reveal metric-${index + 1}`} key={metric.label} style={{ "--reveal-delay": `${index * 75}ms` } as React.CSSProperties}><span className="metric-index">0{index + 1} / IMPACT</span><strong>{metric.value}</strong><span className="metric-label">{metric.label}</span><span className="metric-note">{metric.note}</span><span className="metric-arrow"><ArrowUpRight size={14}/></span></article>)}
            </div>
          </div>
        </section>

        <section className="stack-section section-pad" id="stack">
          <div className="page-wrap">
            <div className="section-heading stack-heading reveal"><div><SectionEyebrow>{t.stack.index}</SectionEyebrow><h2 className="section-title">{t.stack.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2></div><p className="section-intro">{t.stack.subtitle}</p></div>
            <div className="stack-grid">
              {t.stack.groups.map((group, index) => <article key={group.icon} className={`stack-card stack-card-${index + 1} reveal`} style={{ "--reveal-delay": `${index * 65}ms` } as React.CSSProperties}>
                <div className="stack-card-top"><span className="stack-card-num">{group.icon}</span><span className="stack-card-arrow"><ArrowUpRight size={15}/></span></div>
                <div className="stack-card-title"><h3>{lang === "zh" ? group.local : group.name}</h3><span>{lang === "zh" ? group.name : group.local}</span></div>
                <p>{group.description}</p>
                <div className="tag-list">{group.tags.map((tag) => <span className="tech-tag" key={tag}>{tag}</span>)}</div>
              </article>)}
            </div>
            <div className="stack-footnote reveal"><span className="footnote-mark">∿</span>{lang === "zh" ? "保持好奇，持續演進。" : "Curious by default. Always evolving."}<span className="footnote-rule"/><span className="footnote-index">LEARN → APPLY → IMPROVE</span></div>
          </div>
        </section>

        <section className="projects-section section-pad" id="projects">
          <div className="page-wrap">
            <div className="section-heading projects-heading reveal"><div><SectionEyebrow>{t.projects.index}</SectionEyebrow><h2 className="section-title">{t.projects.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2></div><div className="projects-intro"><p>{t.projects.subtitle}</p><span>SCROLL TO EXPLORE <ArrowDown size={13}/></span></div></div>
            <div className="projects-list">
              {projects.map((project, index) => <button type="button" className={`project-card project-${project.accent} reveal`} key={project.kind} style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties} onClick={() => setActiveProject(index)} aria-haspopup="dialog" aria-label={`${t.projects.open}: ${project.name}`}>
                <span className="project-number">{project.kind}</span>
                <span className="project-content"><span className="project-period">{project.period}</span><span className="project-name">{project.name}</span><span className="project-summary">{project.summary}</span><span className="tag-list project-tags">{project.tech.slice(0, 5).map((tag) => <span className="tech-tag" key={tag}>{tag}</span>)}{project.tech.length > 5 && <span className="tech-tag more-tag">+{project.tech.length - 5}</span>}</span></span>
                <span className="project-outcome"><span className="outcome-icon"><ArrowUpRight size={18}/></span><span>{project.metric}</span><span className="project-impact">{project.impact}</span></span>
                <span className="project-open"><ArrowUpRight size={16}/></span>
              </button>)}
            </div>
            <a href={githubUrl} target="_blank" rel="noreferrer" className="all-projects-link reveal"><Github size={16}/>{t.projects.code}<ArrowUpRight size={13}/></a>
          </div>
        </section>

        <section className="journey-section section-pad" id="journey">
          <div className="page-wrap">
            <div className="section-heading journey-heading reveal"><div><SectionEyebrow>{t.journey.index}</SectionEyebrow><h2 className="section-title">{t.journey.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2></div><p className="section-intro">{t.journey.subtitle}</p></div>
            <div className="timeline">
              {t.journey.roles.map((role, index) => <article className={`timeline-item reveal ${index === 0 ? "current-role" : ""}`} key={role.period} style={{ "--reveal-delay": `${index * 65}ms` } as React.CSSProperties}>
                <div className="timeline-date"><span>{role.period}</span>{index === 0 && <span className="current-pill"><i/>{t.journey.present}</span>}</div>
                <div className="timeline-track"><span className="timeline-dot"/></div>
                <div className="timeline-content"><div className="role-heading"><h3>{role.role}</h3><span>{role.company}</span></div><div className="role-label">{role.label}</div><p>{role.description}</p><div className="timeline-tags">{role.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
              </article>)}
            </div>
            <div className="education-grid reveal">
              <article className="education-card"><span className="edu-index">01 / EDUCATION</span><h3>{t.journey.educationTitle}</h3><p className="edu-degree">{t.journey.education}</p><p>{t.journey.educationNote}</p></article>
              <article className="education-card certification-card"><span className="edu-index">02 / CREDENTIALS</span><h3>{t.journey.certificationTitle}</h3><div className="credential-tags">{t.journey.certifications.map((certificate) => <span key={certificate}>{certificate}</span>)}</div></article>
            </div>
          </div>
        </section>

        <section className="contact-section section-pad" id="contact">
          <div className="contact-glow" aria-hidden="true"/><div className="page-wrap contact-wrap">
            <div className="contact-heading reveal"><SectionEyebrow>{t.contact.index}</SectionEyebrow><h2 className="section-title">{t.contact.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2><p>{t.contact.description}</p></div>
            <div className="contact-layout">
              <div className="contact-info reveal">
                <article className="contact-detail"><span className="contact-icon"><Mail size={17}/></span><span className="contact-detail-label">{t.contact.email}</span><a href={`mailto:${emailAddress}`}>{emailAddress}<ArrowUpRight size={13}/></a><button type="button" className="copy-button" onClick={copyEmail} aria-label={copied ? t.contact.copied : t.contact.copy}>{copied ? <Check size={13}/> : <Copy size={13}/>}<span>{copied ? t.contact.copied : t.contact.copy}</span></button></article>
                <a className="contact-detail contact-detail-link" href={githubUrl} target="_blank" rel="noreferrer"><span className="contact-icon"><Github size={17}/></span><span className="contact-detail-label">{t.contact.github}</span><span>github.com/vitas666<ArrowUpRight size={13}/></span></a>
                <article className="contact-detail"><span className="contact-icon"><MapPin size={17}/></span><span className="contact-detail-label">{t.contact.location}</span><span>{t.contact.locationValue}<Globe2 size={14}/></span></article>
                <div className="contact-availability"><span className="status-light"/><span>{t.hero.status}</span></div>
              </div>
              <form className="contact-form reveal" onSubmit={submitContact}>
                <div className="form-heading"><MessageSquareText size={17}/><h3>{t.contact.formTitle}</h3></div>
                <div className="form-row"><label>{t.contact.name}<input name="name" autoComplete="name" placeholder={t.contact.namePlaceholder} required maxLength={100}/></label><label>{t.contact.emailLabel}<input type="email" name="email" autoComplete="email" placeholder={t.contact.emailPlaceholder} required maxLength={254}/></label></div>
                <label>{t.contact.subject}<select name="subject" defaultValue="" required><option value="" disabled>{t.contact.subjectPlaceholder}</option>{t.contact.subjects.map((subject) => <option value={subject} key={subject}>{subject}</option>)}</select></label>
                <label>{t.contact.message}<textarea name="message" placeholder={t.contact.messagePlaceholder} rows={4} required minLength={8} maxLength={4000}/></label>
                <div className="form-bottom"><p><span>i</span>{t.contact.fallback}</p><button type="submit" className="button-primary form-submit" disabled={formBusy}><span>{formBusy ? t.contact.sending : t.contact.send}</span><ArrowUpRight size={15}/></button></div>
                {mailPrepared && <p className="form-feedback" role="status"><Check size={14}/>{t.contact.prepared}</p>}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div className="page-wrap footer-inner"><a href="#top" className="footer-brand"><span className="brand-mark"><span>V</span><i/><span>Y</span></span><span>VITAS YAO</span></a><span className="footer-motto">{t.contact.footer}</span><div className="footer-right"><span>© {new Date().getFullYear()} VITAS YAO</span><a href="#top">{t.contact.backTop}<span><ArrowLeft size={13}/></span></a></div></div></footer>

      {activeProject !== null && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveProject(null); }}>
        <section className={`project-modal project-${projects[activeProject].accent}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-topline"><span>{projects[activeProject].kind}</span><button type="button" className="modal-close" onClick={() => setActiveProject(null)} aria-label={t.projects.close}><X size={19}/></button></div>
          <div className="modal-period">{projects[activeProject].period}</div><h2 id="modal-title">{projects[activeProject].name}</h2><span className="modal-english">{projects[activeProject].english}</span>
          <div className="modal-impact"><span><ArrowUpRight size={18}/></span><p>{projects[activeProject].impact}</p></div>
          <p className="modal-description">{projects[activeProject].detail}</p>
          <div className="modal-tech"><span>{lang === "zh" ? "技術與工具" : "TECHNOLOGIES"}</span><div className="tag-list">{projects[activeProject].tech.map((tag) => <span className="tech-tag" key={tag}>{tag}</span>)}</div></div>
          <div className="modal-footer"><a href={githubUrl} target="_blank" rel="noreferrer"><Github size={15}/>{t.projects.code}<ArrowUpRight size={13}/></a><button type="button" onClick={() => setActiveProject((activeProject + 1) % projects.length)}>{t.projects.next}<ChevronRight size={15}/></button></div>
        </section>
      </div>}
    </div>
  );
}
