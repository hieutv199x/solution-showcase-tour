import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Users, Cloud, ShieldCheck, Globe, FolderOpen, Workflow, Bot, Server,
  Database, Boxes, Zap, FileText, GitBranch, KeyRound, AlertTriangle,
  CheckCircle2, Lock, Radio, Rocket, History, ScrollText, Gauge,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Custom node                                                         */
/* ------------------------------------------------------------------ */
type NodeData = {
  label: string;
  sub?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  tone?: "default" | "muted" | "accent";
  bullets?: string[];
  hideTop?: boolean;
  hideBottom?: boolean;
  hideLeft?: boolean;
  hideRight?: boolean;
};

function ServiceNode({ data }: NodeProps<NodeData>) {
  const Icon = data.icon;
  const color = data.color ?? "var(--primary)";
  return (
    <div
      className="rounded-lg border bg-surface/95 px-3 py-2 text-foreground shadow-md backdrop-blur"
      style={{
        borderColor: `color-mix(in oklab, ${color} 45%, var(--border))`,
        boxShadow: `0 0 0 1px ${color}22, 0 6px 18px -8px ${color}55`,
        minWidth: 170,
      }}
    >
      {!data.hideTop && <Handle type="target" position={Position.Top} style={{ background: color, opacity: 0 }} />}
      {!data.hideLeft && <Handle type="target" position={Position.Left} style={{ background: color, opacity: 0 }} />}
      <div className="flex items-start gap-2">
        {Icon && (
          <div
            className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md"
            style={{ background: `${color}1a`, color }}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-semibold leading-tight">{data.label}</div>
          {data.sub && (
            <div className="mono mt-0.5 text-[9.5px] uppercase tracking-wider text-muted-foreground">
              {data.sub}
            </div>
          )}
          {data.bullets && data.bullets.length > 0 && (
            <ul className="mt-1.5 space-y-0.5">
              {data.bullets.map((b) => (
                <li key={b} className="text-[10px] leading-snug text-muted-foreground">
                  · {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {!data.hideRight && <Handle type="source" position={Position.Right} style={{ background: color, opacity: 0 }} />}
      {!data.hideBottom && <Handle type="source" position={Position.Bottom} style={{ background: color, opacity: 0 }} />}
    </div>
  );
}

function GroupNode({ data }: NodeProps<{ label: string; sub?: string; color: string }>) {
  return (
    <div
      className="h-full w-full rounded-2xl border-2"
      style={{
        borderColor: `${data.color}55`,
        borderStyle: "dashed",
        background: `${data.color}08`,
      }}
    >
      <div className="flex items-center gap-2 px-3 pt-2">
        <span className="h-2 w-2 rounded-full" style={{ background: data.color, boxShadow: `0 0 8px ${data.color}` }} />
        <span className="mono text-[10px] uppercase tracking-[0.2em]" style={{ color: data.color }}>
          {data.label}
        </span>
        {data.sub && <span className="mono text-[10px] text-muted-foreground">— {data.sub}</span>}
      </div>
    </div>
  );
}

const nodeTypes = { service: ServiceNode, group: GroupNode };

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

const COL = {
  input: 40,
  api: 290,
  orchestrate: 560,
  paths: 850,
  evaluate: 1320,
} as const;

const C = {
  user: "var(--cyan)",
  api: "var(--primary)",
  orch: "var(--rose)",
  doc: "#22c55e",
  code: "var(--violet)",
  data: "var(--amber)",
  result: "var(--accent)",
} as const;

function makeNodes(): Node<NodeData>[] {
  const nodes: Node<any>[] = [];

  // ---------------- Group containers ----------------
  nodes.push(
    {
      id: "g-input", type: "group", position: { x: COL.input - 20, y: 20 },
      data: { label: "1 · User & Input", color: C.user },
      style: { width: 230, height: 540 }, selectable: false, draggable: false, zIndex: 0,
    },
    {
      id: "g-api", type: "group", position: { x: COL.api - 20, y: 20 },
      data: { label: "2 · Frontend & API", color: C.api },
      style: { width: 230, height: 540 }, selectable: false, draggable: false, zIndex: 0,
    },
    {
      id: "g-orch", type: "group", position: { x: COL.orchestrate - 20, y: 20 },
      data: { label: "3 · Orchestration", color: C.orch },
      style: { width: 250, height: 540 }, selectable: false, draggable: false, zIndex: 0,
    },
    {
      id: "g-doc", type: "group", position: { x: COL.paths - 20, y: 20 },
      data: { label: "A · DOCUMENT_ONLY", sub: "no code change", color: C.doc },
      style: { width: 420, height: 240 }, selectable: false, draggable: false, zIndex: 0,
    },
    {
      id: "g-code", type: "group", position: { x: COL.paths - 20, y: 290 },
      data: { label: "B · CODE_AWARE", sub: "1 CR = 1 Fargate workspace", color: C.code },
      style: { width: 420, height: 470 }, selectable: false, draggable: false, zIndex: 0,
    },
    {
      id: "g-result", type: "group", position: { x: COL.evaluate - 20, y: 20 },
      data: { label: "4 · Evaluation & Results", color: C.result },
      style: { width: 250, height: 540 }, selectable: false, draggable: false, zIndex: 0,
    },
  );

  // ---------------- Column 1 — Input ----------------
  nodes.push(
    { id: "user", type: "service", position: { x: COL.input, y: 60 },
      data: { label: "Reviewer / User", sub: "engineer · TL", icon: Users, color: C.user, hideLeft: true, hideTop: true } },
    { id: "portal", type: "service", position: { x: COL.input, y: 160 },
      data: { label: "CR Review Portal", sub: "chat · versions", icon: ScrollText, color: C.user,
        bullets: ["Chat history", "Review versions", "Upload files", "GO / NO_GO"] } },
    { id: "src-jira", type: "service", position: { x: COL.input, y: 360 },
      data: { label: "ITSM / Jira", sub: "on-prem", icon: GitBranch, color: C.user, hideLeft: true } },
    { id: "src-conf", type: "service", position: { x: COL.input, y: 430 },
      data: { label: "Confluence", sub: "cloud / on-prem", icon: FileText, color: C.user, hideLeft: true } },
    { id: "src-files", type: "service", position: { x: COL.input, y: 500 },
      data: { label: "Uploaded Files", sub: "pdf · md · xlsx", icon: FolderOpen, color: C.user, hideLeft: true } },
  );

  // ---------------- Column 2 — Frontend & API ----------------
  nodes.push(
    { id: "cloudfront", type: "service", position: { x: COL.api, y: 60 },
      data: { label: "CloudFront", sub: "optional edge", icon: Globe, color: C.api } },
    { id: "amplify", type: "service", position: { x: COL.api, y: 160 },
      data: { label: "AWS Amplify", sub: "portal UI", icon: Cloud, color: C.api } },
    { id: "cognito", type: "service", position: { x: COL.api, y: 260 },
      data: { label: "Amazon Cognito", sub: "auth · jwt", icon: ShieldCheck, color: C.api } },
    { id: "apigw", type: "service", position: { x: COL.api, y: 360 },
      data: { label: "API Gateway", sub: "CR Review API", icon: Zap, color: C.api } },
    { id: "s3-upload", type: "service", position: { x: COL.api, y: 470 },
      data: { label: "S3 · File Uploads", sub: "raw inputs", icon: Boxes, color: C.api } },
  );

  // ---------------- Column 3 — Orchestration ----------------
  nodes.push(
    { id: "stepfn", type: "service", position: { x: COL.orchestrate, y: 90 },
      data: { label: "Step Functions", sub: "CR Review Workflow", icon: Workflow, color: C.orch } },
    { id: "intent", type: "service", position: { x: COL.orchestrate, y: 220 },
      data: { label: "CR Intent & Source Resolver", sub: "agent · routing", icon: Bot, color: C.orch,
        bullets: ["Fetch ITSM / Confluence", "Resolve links", "Normalize → markdown", "Detect code change"] } },
    { id: "s3-pkg", type: "service", position: { x: COL.orchestrate, y: 430 },
      data: { label: "S3 · CR Package", sub: "normalized md", icon: Boxes, color: C.data } },
    { id: "ddb-sess", type: "service", position: { x: COL.orchestrate, y: 500 },
      data: { label: "DynamoDB", sub: "sessions · versions", icon: Database, color: C.data } },
  );

  // ---------------- Path A — DOCUMENT_ONLY ----------------
  const docAgents = [
    { id: "d-comp", label: "Completeness", icon: CheckCircle2 },
    { id: "d-cons", label: "Consistency", icon: ScrollText },
    { id: "d-vgap", label: "Verification Gap", icon: AlertTriangle },
    { id: "d-roll", label: "Rollout / Runbook", icon: Rocket },
    { id: "d-sec", label: "Security Review", icon: Lock },
  ];
  docAgents.forEach((a, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    nodes.push({
      id: a.id, type: "service",
      position: { x: COL.paths + col * 130, y: 70 + row * 80 },
      data: { label: a.label, sub: "λ agent", icon: a.icon, color: C.doc },
    });
  });

  // ---------------- Path B — CODE_AWARE ----------------
  nodes.push(
    { id: "fargate", type: "service", position: { x: COL.paths, y: 340 },
      data: { label: "ECS · Fargate Workspace", sub: "long-running", icon: Server, color: C.code,
        bullets: ["Clone repos · checkout SHA", "Build diff · CodeGraph index", "Workspace API · MCP tools"] } },
    { id: "secrets", type: "service", position: { x: COL.paths + 260, y: 340 },
      data: { label: "Secrets Manager", sub: "read-only", icon: KeyRound, color: C.data } },
    { id: "ddb-ws", type: "service", position: { x: COL.paths + 260, y: 430 },
      data: { label: "Workspace Registry", sub: "DynamoDB", icon: Database, color: C.data } },
    { id: "s3-audit", type: "service", position: { x: COL.paths, y: 530 },
      data: { label: "S3 · Audit Trail", sub: "every tool call", icon: Boxes, color: C.data } },
    { id: "gateway", type: "service", position: { x: COL.paths + 130, y: 590 },
      data: { label: "Code Tool Gateway", sub: "λ · MCP proxy", icon: Zap, color: C.code } },
  );
  const codeAgents = [
    { id: "c-hidden", label: "Hidden Impact", icon: AlertTriangle },
    { id: "c-vgap", label: "Verification Gap", icon: CheckCircle2 },
    { id: "c-sec", label: "Security & PII", icon: Lock },
    { id: "c-kafka", label: "Kafka / vs Prod", icon: Radio },
  ];
  codeAgents.forEach((a, i) => {
    nodes.push({
      id: a.id, type: "service",
      position: { x: COL.paths + (i % 2) * 200, y: 680 + Math.floor(i / 2) * 0 },
      data: { label: a.label, sub: "λ agent", icon: a.icon, color: C.code },
    });
  });
  // Reposition code agents in a 2x2 grid
  const grid = [
    { id: "c-hidden", x: 0, y: 0 },
    { id: "c-vgap", x: 1, y: 0 },
    { id: "c-sec", x: 0, y: 1 },
    { id: "c-kafka", x: 1, y: 1 },
  ];
  grid.forEach((g) => {
    const n = nodes.find((nn) => nn.id === g.id);
    if (n) n.position = { x: COL.paths + 10 + g.x * 200, y: 660 + g.y * 60 };
  });

  // ---------------- Column 4 — Evaluation ----------------
  nodes.push(
    { id: "agg", type: "service", position: { x: COL.evaluate, y: 80 },
      data: { label: "Evaluation Aggregator", sub: "λ agent", icon: Bot, color: C.result,
        bullets: ["Merge findings", "Doc + Code paths"] } },
    { id: "risk", type: "service", position: { x: COL.evaluate, y: 240 },
      data: { label: "Risk Scoring Engine", sub: "score · confidence", icon: Gauge, color: C.result } },
    { id: "report", type: "service", position: { x: COL.evaluate, y: 360 },
      data: { label: "Final Report", sub: "evidence · rationale", icon: FileText, color: C.result,
        bullets: ["GO · GO_WITH_WARNING", "NEEDS_MANUAL_REVIEW", "NO_GO"], hideRight: true } },
  );

  return nodes as Node<NodeData>[];
}

function makeEdges(): Edge[] {
  const e = (id: string, source: string, target: string, color: string, label?: string, animated = false): Edge => ({
    id, source, target, label, animated,
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, color },
    style: { stroke: color, strokeWidth: 1.6 },
    labelStyle: { fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono, monospace)" },
    labelBgStyle: { fill: "var(--background)", fillOpacity: 0.85 },
  });

  const edges: Edge[] = [
    // Input → API
    e("u-portal", "user", "portal", C.user),
    e("portal-cf", "portal", "cloudfront", C.user, "browse"),
    e("cf-amp", "cloudfront", "amplify", C.api),
    e("amp-cog", "amplify", "cognito", C.api, "auth"),
    e("cog-api", "cognito", "apigw", C.api, "jwt"),
    e("jira-api", "src-jira", "apigw", C.user),
    e("conf-api", "src-conf", "apigw", C.user),
    e("files-s3", "src-files", "s3-upload", C.user, "upload"),

    // API → Orchestration
    e("api-step", "apigw", "stepfn", C.orch, "start review", true),
    e("step-intent", "stepfn", "intent", C.orch),
    e("intent-pkg", "intent", "s3-pkg", C.data, "normalized md"),
    e("intent-ddb", "intent", "ddb-sess", C.data, "version"),

    // Intent → Document path
    e("intent-doc", "intent", "d-comp", C.doc, "if no code", true),
    e("intent-doc2", "intent", "d-cons", C.doc),
    e("intent-doc3", "intent", "d-vgap", C.doc),

    // Intent → Code path
    e("intent-fargate", "intent", "fargate", C.code, "if code change", true),
    e("fargate-sec", "fargate", "secrets", C.data),
    e("fargate-ws", "fargate", "ddb-ws", C.data),
    e("fargate-audit", "fargate", "s3-audit", C.data, "audit"),
    e("fargate-gw", "fargate", "gateway", C.code, "expose MCP"),
    e("gw-h", "gateway", "c-hidden", C.code, "fan-out", true),
    e("gw-v", "gateway", "c-vgap", C.code),
    e("gw-s", "gateway", "c-sec", C.code),
    e("gw-k", "gateway", "c-kafka", C.code),

    // Domain agents → Aggregator
    e("d1-agg", "d-comp", "agg", C.doc),
    e("d2-agg", "d-cons", "agg", C.doc),
    e("d3-agg", "d-vgap", "agg", C.doc),
    e("d4-agg", "d-roll", "agg", C.doc),
    e("d5-agg", "d-sec", "agg", C.doc),
    e("c1-agg", "c-hidden", "agg", C.code),
    e("c2-agg", "c-vgap", "agg", C.code),
    e("c3-agg", "c-sec", "agg", C.code),
    e("c4-agg", "c-kafka", "agg", C.code),

    // Aggregator → Risk → Report → Portal (feedback)
    e("agg-risk", "agg", "risk", C.result),
    e("risk-report", "risk", "report", C.result),
    e("report-portal", "report", "portal", C.result, "publish", true),
  ];
  return edges;
}

/* ------------------------------------------------------------------ */

export function ArchitectureFlow() {
  const nodes = useMemo(makeNodes, []);
  const edges = useMemo(makeEdges, []);

  return (
    <div className="glass overflow-hidden rounded-2xl border border-border" style={{ boxShadow: "var(--shadow-soft)" }}>
      <div className="flex items-center justify-between border-b border-border bg-background/40 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--primary)", boxShadow: "0 0 8px var(--primary)" }} />
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            interactive · system architecture
          </span>
        </div>
        <div className="mono text-[10px] text-muted-foreground hidden md:block">
          drag · zoom · pan
        </div>
      </div>
      <div style={{ height: 780 }} className="bg-background/30">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.4}
          maxZoom={1.6}
          proOptions={{ hideAttribution: true }}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Background gap={20} size={1} color="var(--border)" />
          <Controls showInteractive={false} className="!bg-surface !border !border-border" />
          <MiniMap
            pannable
            zoomable
            nodeColor={(n: any) => (n.data?.color as string) ?? "var(--primary)"}
            maskColor="oklch(0.16 0.03 265 / 0.6)"
            style={{ background: "var(--background)", border: "1px solid var(--border)" }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
