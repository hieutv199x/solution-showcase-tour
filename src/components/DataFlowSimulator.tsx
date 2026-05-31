import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText, Workflow, Server, Bot, ShieldCheck, Database, Boxes,
  Play, Pause, RotateCcw, Zap, Radio, Lock,
} from "lucide-react";

/* -------------------------------------------------------------
 * DataFlowSimulator
 * Visual simulation of how a CR moves through the system.
 * - SVG architecture with animated packets traveling along paths
 * - Live event log on the right
 * - Play / Pause / Reset controls + scrub indicator
 * ------------------------------------------------------------- */

type NodeId =
  | "confluence" | "stepfn" | "intent" | "workspace"
  | "gateway" | "agents" | "decision"
  | "s3" | "dynamo";

type Node = {
  id: NodeId; label: string; sub?: string;
  x: number; y: number; w: number; h: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

const NODES: Node[] = [
  { id: "confluence", label: "Confluence CR", sub: "input link",     x:  20, y: 180, w: 130, h: 64, icon: FileText,    color: "var(--cyan)" },
  { id: "stepfn",     label: "Step Functions", sub: "orchestrator",  x: 190, y: 180, w: 130, h: 64, icon: Workflow,    color: "var(--violet)" },
  { id: "intent",     label: "CR Intent Agent", sub: "resolve MRs",  x: 360, y: 180, w: 140, h: 64, icon: Bot,         color: "var(--violet)" },
  { id: "workspace",  label: "Fargate Workspace", sub: "code + index", x: 540, y: 160, w: 170, h: 104, icon: Server,   color: "var(--lime)" },
  { id: "gateway",    label: "Code Tool Gateway", sub: "lambda",     x: 750, y: 180, w: 150, h: 64, icon: Zap,         color: "var(--primary)" },
  { id: "agents",     label: "Domain Agents",    sub: "7 in parallel", x: 940, y: 60, w: 150, h: 100, icon: Radio,    color: "var(--amber)" },
  { id: "decision",   label: "Risk Decision",   sub: "report + alert", x: 940, y: 290, w: 150, h: 80, icon: ShieldCheck, color: "var(--rose)" },
  { id: "s3",         label: "S3 Audit",        sub: "tool calls",    x: 540, y: 320, w: 130, h: 56, icon: Boxes,    color: "var(--cyan)" },
  { id: "dynamo",     label: "DynamoDB",        sub: "workspace state", x: 360, y: 320, w: 130, h: 56, icon: Database, color: "var(--violet)" },
];

const nodeById = (id: NodeId) => NODES.find((n) => n.id === id)!;
const centerR = (n: Node) => ({ x: n.x + n.w, y: n.y + n.h / 2 });
const centerL = (n: Node) => ({ x: n.x,       y: n.y + n.h / 2 });
const centerT = (n: Node) => ({ x: n.x + n.w / 2, y: n.y });
const centerB = (n: Node) => ({ x: n.x + n.w / 2, y: n.y + n.h });

type Edge = { id: string; d: string; color: string; from: NodeId; to: NodeId };

function buildEdges(): Edge[] {
  const path = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const mx = (a.x + b.x) / 2;
    return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
  };
  const e = (from: NodeId, to: NodeId, color: string, fromSide: "R" | "L" | "T" | "B" = "R", toSide: "L" | "R" | "T" | "B" = "L"): Edge => {
    const f = nodeById(from), t = nodeById(to);
    const a = fromSide === "R" ? centerR(f) : fromSide === "L" ? centerL(f) : fromSide === "T" ? centerT(f) : centerB(f);
    const b = toSide   === "L" ? centerL(t) : toSide   === "R" ? centerR(t) : toSide   === "T" ? centerT(t) : centerB(t);
    return { id: `${from}->${to}`, d: path(a, b), color, from, to };
  };
  return [
    e("confluence", "stepfn",   "var(--cyan)"),
    e("stepfn",     "intent",   "var(--violet)"),
    e("intent",     "workspace","var(--lime)"),
    e("workspace",  "gateway",  "var(--primary)"),
    e("gateway",    "agents",   "var(--amber)", "R", "L"),
    e("agents",     "gateway",  "var(--amber)", "B", "T"),    // queries back
    e("gateway",    "decision", "var(--rose)", "R", "L"),
    e("workspace",  "s3",       "var(--cyan)", "B", "T"),
    e("workspace",  "dynamo",   "var(--violet)", "B", "T"),
  ];
}

type Step = {
  edge: string;
  label: string;
  payload: string;
  durationMs: number;
};

const SCRIPT: Step[] = [
  { edge: "confluence->stepfn", label: "POST /reviews",          payload: "{ url: \"confluence/CR-8231\" }", durationMs: 1100 },
  { edge: "stepfn->intent",     label: "invoke: resolveIntent",  payload: "{ cr: \"CR-8231\" }",            durationMs: 1100 },
  { edge: "intent->workspace",  label: "bootstrap workspace",    payload: "{ repos: 3, sha: \"a17f9c2\" }",  durationMs: 1300 },
  { edge: "workspace->dynamo",  label: "state: READY",           payload: "{ status: \"READY\" }",          durationMs: 900 },
  { edge: "workspace->gateway", label: "expose MCP tools",       payload: "{ tools: [\"grep\",\"graph\"] }", durationMs: 900 },
  { edge: "gateway->agents",    label: "fan-out → 7 agents",     payload: "{ parallel: 7 }",                durationMs: 1100 },
  { edge: "agents->gateway",    label: "tool.call: graph.findCallers", payload: "{ symbol: \"PaymentSvc\" }", durationMs: 1100 },
  { edge: "workspace->s3",      label: "audit.append",           payload: "{ size: \"2.4 KB\" }",           durationMs: 900 },
  { edge: "agents->gateway",    label: "tool.call: search.kafkaSchema", payload: "{ topic: \"orders.v2\" }", durationMs: 1100 },
  { edge: "workspace->s3",      label: "audit.append",           payload: "{ size: \"1.8 KB\" }",           durationMs: 900 },
  { edge: "gateway->decision",  label: "aggregate findings",     payload: "{ findings: 12, high: 3 }",      durationMs: 1200 },
  { edge: "decision->agents",   label: "publish risk report",    payload: "{ risk: \"MEDIUM\", evidence: 27 }", durationMs: 1200 },
];

export function DataFlowSimulator() {
  const edges = useMemo(buildEdges, []);
  const edgeMap = useMemo(() => Object.fromEntries(edges.map((e) => [e.id, e])), [edges]);

  const [playing, setPlaying] = useState(true);
  const [stepIdx, setStepIdx] = useState(0);
  const [log, setLog] = useState<{ id: number; t: string; label: string; payload: string; color: string }[]>([]);
  const counterRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  // advance through script
  useEffect(() => {
    if (!playing) return;
    const step = SCRIPT[stepIdx];
    const edge = edgeMap[step.edge];
    // push log entry at start
    const id = ++counterRef.current;
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setLog((prev) => [{ id, t, label: step.label, payload: step.payload, color: edge?.color ?? "var(--primary)" }, ...prev].slice(0, 9));

    timerRef.current = window.setTimeout(() => {
      setStepIdx((i) => (i + 1) % SCRIPT.length);
    }, step.durationMs);
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [stepIdx, playing, edgeMap]);

  const reset = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setStepIdx(0);
    setLog([]);
    counterRef.current = 0;
  };

  const activeStep = SCRIPT[stepIdx];
  const activeEdge = edgeMap[activeStep.edge];

  return (
    <div className="glass overflow-hidden rounded-2xl border border-border" style={{ boxShadow: "var(--shadow-soft)" }}>
      {/* Header / controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/40 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: activeEdge?.color }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: activeEdge?.color }} />
          </span>
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">live · packet </span>
          <span className="mono text-xs text-foreground">{String(stepIdx + 1).padStart(2, "0")} / {String(SCRIPT.length).padStart(2, "0")}</span>
          <span className="hidden text-xs text-muted-foreground md:inline">— {activeStep.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setPlaying((p) => !p)} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs hover:border-primary/60">
            {playing ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Play className="h-3.5 w-3.5" /> Play</>}
          </button>
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs hover:border-primary/60">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.7fr_1fr]">
        {/* SVG canvas */}
        <div className="relative bg-background/30 p-2">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <svg viewBox="0 0 1110 410" className="relative h-auto w-full">
            <defs>
              {edges.map((e) => (
                <linearGradient key={e.id} id={`g-${e.id}`} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={e.color} stopOpacity="0" />
                  <stop offset="50%" stopColor={e.color} stopOpacity="0.7" />
                  <stop offset="100%" stopColor={e.color} stopOpacity="0" />
                </linearGradient>
              ))}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* edges (static) */}
            {edges.map((e) => (
              <path key={e.id} d={e.d} stroke={e.color} strokeOpacity="0.18" strokeWidth="1.5" fill="none" strokeDasharray="3 4" />
            ))}

            {/* active edge highlight */}
            {activeEdge && (
              <path
                key={`active-${activeEdge.id}-${stepIdx}`}
                d={activeEdge.d}
                stroke={activeEdge.color}
                strokeOpacity="0.55"
                strokeWidth="2"
                fill="none"
                filter="url(#glow)"
              />
            )}

            {/* animated packet on active edge */}
            {activeEdge && (
              <g key={`packet-${stepIdx}`}>
                <circle r="6" fill={activeEdge.color} filter="url(#glow)">
                  <animateMotion dur={`${activeStep.durationMs}ms`} repeatCount="1" path={activeEdge.d} rotate="auto" />
                </circle>
                <circle r="3" fill="white">
                  <animateMotion dur={`${activeStep.durationMs}ms`} repeatCount="1" path={activeEdge.d} rotate="auto" />
                </circle>
              </g>
            )}

            {/* nodes */}
            {NODES.map((n) => {
              const isActive = activeEdge && (activeEdge.from === n.id || activeEdge.to === n.id);
              const Icon = n.icon;
              return (
                <g key={n.id}>
                  <rect
                    x={n.x} y={n.y} rx="12" ry="12" width={n.w} height={n.h}
                    fill="oklch(0.21 0.035 265 / 0.9)"
                    stroke={isActive ? n.color : "var(--border)"}
                    strokeWidth={isActive ? 1.5 : 1}
                    style={{ filter: isActive ? `drop-shadow(0 0 12px ${n.color})` : "none", transition: "all 0.3s" }}
                  />
                  <foreignObject x={n.x} y={n.y} width={n.w} height={n.h}>
                    <div className="flex h-full items-center gap-2.5 px-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border" style={{ color: n.color, background: "var(--background)" }}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-[12px] font-semibold leading-tight text-foreground">{n.label}</div>
                        {n.sub && <div className="mono mt-0.5 truncate text-[9.5px] uppercase tracking-wider text-muted-foreground">{n.sub}</div>}
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* boundary label around workspace */}
            <g>
              <rect x="525" y="148" width="200" height="132" rx="14" fill="none" stroke="var(--lime)" strokeOpacity="0.25" strokeDasharray="4 4" />
              <text x="535" y="143" fill="var(--lime)" fillOpacity="0.7" fontSize="9" className="mono" style={{ letterSpacing: "0.15em" }}>
                READ-ONLY · AWS FARGATE
              </text>
            </g>
            <g>
              <rect x="345" y="305" width="335" height="90" rx="14" fill="none" stroke="var(--violet)" strokeOpacity="0.2" strokeDasharray="4 4" />
              <text x="355" y="300" fill="var(--violet)" fillOpacity="0.7" fontSize="9" className="mono" style={{ letterSpacing: "0.15em" }}>
                EVIDENCE · STATE LAYER
              </text>
            </g>
          </svg>
        </div>

        {/* Event log */}
        <div className="border-t border-border bg-background/50 lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div className="mono flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <Lock className="h-3 w-3" /> audit · event stream
            </div>
            <div className="mono text-[10px] text-muted-foreground">→ s3://cr-audit/</div>
          </div>
          <div className="max-h-[360px] space-y-1.5 overflow-hidden p-3">
            <AnimatePresence initial={false}>
              {log.map((entry) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, x: 20, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-md border border-border bg-surface px-3 py-2"
                  style={{ borderLeft: `2px solid ${entry.color}` }}
                >
                  <div className="mono flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{entry.t}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                    <span style={{ color: entry.color }}>{entry.label}</span>
                  </div>
                  <div className="mono mt-1 truncate text-[11px] text-foreground/85">{entry.payload}</div>
                </motion.div>
              ))}
            </AnimatePresence>
            {log.length === 0 && (
              <div className="mono py-10 text-center text-[11px] text-muted-foreground">awaiting packets…</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
