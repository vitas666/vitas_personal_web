import { ArrowDown, ArrowUpRight, Braces, CircuitBoard, Database, GitBranch, Radio } from "lucide-react";
import type { Language } from "@/i18n/content";

export default function ArchitectureViz({ lang, nodes, label, uptime }: { lang: Language; nodes: readonly string[]; label: string; uptime: string }) {
  const codeLines = lang === "zh"
    ? ["const system = await architect({", "  reliability: 'enterprise',", "  intelligence: 'context-aware',", "  scale: 'by design'", "})"]
    : ["const system = await architect({", "  reliability: 'enterprise',", "  intelligence: 'context-aware',", "  scale: 'by design'", "})"];
  return (
    <div className="architecture" role="img" aria-label={label}>
      <div className="arch-topline"><span><span className="live-dot" />{label}</span><span className="arch-index">SYS / 001</span></div>
      <div className="arch-visual">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <svg className="arch-lines" viewBox="0 0 640 470" fill="none" aria-hidden="true">
          <path d="M120 108h152v72h111v95h133" stroke="url(#lineA)" strokeWidth="1.4" strokeDasharray="5 7" />
          <path d="M120 108v234h152v-67h111v-95" stroke="url(#lineB)" strokeWidth="1.2" strokeDasharray="4 7" />
          <path d="M383 113h97v162h36" stroke="url(#lineB)" strokeWidth="1" strokeDasharray="4 7" />
          <circle cx="272" cy="180" r="4" fill="#3B82F6" /><circle cx="383" cy="275" r="4" fill="#10B981" /><circle cx="272" cy="342" r="3" fill="#3B82F6" />
          <defs><linearGradient id="lineA" x1="120" y1="108" x2="516" y2="275" gradientUnits="userSpaceOnUse"><stop stopColor="#3B82F6" stopOpacity=".2"/><stop offset=".58" stopColor="#3B82F6"/><stop offset="1" stopColor="#10B981" stopOpacity=".7"/></linearGradient><linearGradient id="lineB" x1="120" y1="108" x2="383" y2="342" gradientUnits="userSpaceOnUse"><stop stopColor="#3B82F6" stopOpacity=".5"/><stop offset="1" stopColor="#10B981" stopOpacity=".4"/></linearGradient></defs>
        </svg>
        <div className="core-halo"><div className="core-mark"><Braces size={25} strokeWidth={1.3}/><span>VY</span></div><span className="core-caption">INTELLIGENCE CORE</span></div>
        <div className="arch-node node-app"><div className="node-icon"><CircuitBoard size={15}/></div><span>{nodes[0]}</span><i /></div>
        <div className="arch-node node-service"><div className="node-icon"><GitBranch size={15}/></div><span>{nodes[1]}</span><i /></div>
        <div className="arch-node node-rag"><div className="node-icon"><Radio size={15}/></div><span>{nodes[2]}</span><i /></div>
        <div className="arch-node node-data"><div className="node-icon"><Database size={15}/></div><span>{nodes[3]}</span><i /></div>
        <div className="signal signal-one"/><div className="signal signal-two"/><div className="signal signal-three"/>
        <div className="coordinate coord-one">24.9894° N</div><div className="coordinate coord-two">121.4542° E</div>
        <div className="arch-cross cross-one">+</div><div className="arch-cross cross-two">+</div>
      </div>
      <div className="code-terminal"><div className="terminal-head"><span><i /><i /><i /></span><span>system.config.ts</span><ArrowUpRight size={14}/></div><pre>{codeLines.map((line, i) => <code key={line}><b>{String(i + 1).padStart(2, "0")}</b>{line}{"\n"}</code>)}</pre></div>
      <div className="arch-foot"><span><span className="foot-check">↗</span>{uptime}</span><span>LATENCY <b>18ms</b></span></div>
      <span className="architecture-scroll" aria-hidden="true"><ArrowDown size={13}/></span>
    </div>
  );
}
