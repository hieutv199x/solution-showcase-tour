import { useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  Archive,
  Bot,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Cpu,
  Database,
  FileSearch,
  FileText,
  Gauge,
  GitBranch,
  Keyboard,
  Layers,
  Lock,
  Maximize2,
  Minimize2,
  Network,
  Paperclip,
  Route,
  Server,
  ShieldCheck,
  Sparkles,
  Split,
  Ticket,
  UserCheck,
  Workflow,
  X,
} from "lucide-react";
import { flowEdges, flowNodeDetails, flowSteps, type FlowNodeDetail } from "@/data/crSentinel";

const palette = {
  main: "var(--cyan)",
  code: "var(--blue)",
  graph: "var(--green)",
  prelive: "var(--orange)",
  learn: "var(--purple)",
  risk: "var(--magenta)",
};

const iconMap = {
  activity: Activity,
  alert: AlertTriangle,
  archive: Archive,
  bot: Bot,
  brain: Brain,
  check: CheckCircle2,
  checklist: ClipboardCheck,
  clock: Clock,
  cpu: Cpu,
  database: Database,
  file: FileText,
  "file-search": FileSearch,
  gauge: Gauge,
  git: GitBranch,
  keyboard: Keyboard,
  layers: Layers,
  lock: Lock,
  network: Network,
  paperclip: Paperclip,
  route: Route,
  server: Server,
  shield: ShieldCheck,
  sparkles: Sparkles,
  split: Split,
  ticket: Ticket,
  "user-check": UserCheck,
  workflow: Workflow,
} as const;

const kindColor: Record<FlowNodeDetail["kind"], string> = {
  input: "var(--cyan)",
  agent: "var(--purple)",
  decision: "var(--orange)",
  workspace: "var(--blue)",
  graph: "var(--green)",
  risk: "var(--magenta)",
  human: "var(--cyan)",
  scheduler: "var(--orange)",
  skill: "var(--purple)",
  incident: "var(--magenta)",
  artifact: "var(--blue)",
};

const lanePositions = [
  { label: "Input Sources", x: 0, w: 220 },
  { label: "Source Resolution", x: 280, w: 230 },
  { label: "Historical Context", x: 570, w: 330 },
  { label: "Routing", x: 960, w: 260 },
  { label: "Code Workspace", x: 1280, w: 300 },
  { label: "Domain Agent Reasoning", x: 1660, w: 260 },
  { label: "Evaluation", x: 1980, w: 300 },
  { label: "Go-Live Governance", x: 2360, w: 360 },
  { label: "Knowledge Commit", x: 2800, w: 300 },
  { label: "Learning Loop", x: 3160, w: 520 },
];

const nodePositions: Record<string, { x: number; y: number }> = {
  jira: { x: 40, y: 70 },
  confluence: { x: 40, y: 160 },
  gitlab: { x: 40, y: 250 },
  attachments: { x: 40, y: 340 },
  manual: { x: 40, y: 430 },
  resolver: { x: 305, y: 210 },
  history: { x: 610, y: 70 },
  pir: { x: 610, y: 160 },
  "verification-lib": { x: 610, y: 250 },
  "neo4j-context": { x: 610, y: 340 },
  route: { x: 995, y: 210 },
  "document-path": { x: 990, y: 80 },
  "code-path": { x: 990, y: 350 },
  workspace: { x: 1315, y: 280 },
  claude: { x: 1315, y: 410 },
  agents: { x: 1688, y: 220 },
  aggregator: { x: 2010, y: 120 },
  "risk-engine": { x: 2010, y: 250 },
  approval: { x: 2010, y: 380 },
  scheduler: { x: 2400, y: 60 },
  prelive: { x: 2400, y: 180 },
  drift: { x: 2400, y: 320 },
  "prod-check": { x: 2400, y: 450 },
  done: { x: 2835, y: 120 },
  "graph-commit": { x: 2835, y: 250 },
  "neo4j-update": { x: 2835, y: 380 },
  incident: { x: 3200, y: 60 },
  "learning-agent": { x: 3200, y: 160 },
  "skill-proposal": { x: 3200, y: 260 },
  "historical-eval": { x: 3200, y: 360 },
  "skill-registry": { x: 3200, y: 460 },
};

type DataFlowNodeData = FlowNodeDetail & {
  color: string;
  active: boolean;
  focused: boolean;
};

function FlowNode({ data }: NodeProps<DataFlowNodeData>) {
  const Icon = iconMap[data.icon as keyof typeof iconMap] ?? FileText;
  return (
    <div
      className="group relative w-[190px] cursor-pointer rounded-lg border bg-surface/95 p-3 text-left shadow-soft backdrop-blur transition"
      style={{
        borderColor: data.focused ? data.color : data.active ? `${data.color}aa` : "var(--border)",
        boxShadow: data.focused
          ? `0 0 0 2px ${data.color}, 0 0 34px -10px ${data.color}`
          : data.active
            ? `0 0 22px -10px ${data.color}`
            : "none",
        opacity: data.active ? 1 : 0.55,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="flex items-start gap-2.5">
        <div
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md border"
          style={{
            color: data.color,
            background: `${data.color}18`,
            borderColor: `${data.color}45`,
          }}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[12px] font-semibold leading-tight text-foreground">
            {data.title}
          </div>
          <div className="mono mt-1 truncate text-[9.5px] uppercase tracking-wider text-muted-foreground">
            {data.subtitle}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="mono rounded border border-border px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
          step {data.step}
        </span>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: data.color }} />
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

function LaneNode({ data }: NodeProps<{ label: string; color: string }>) {
  return (
    <div
      className="h-full w-full rounded-xl border border-dashed bg-background/35"
      style={{ borderColor: `${data.color}55` }}
    >
      <div
        className="mono px-3 py-2 text-[10px] uppercase tracking-[0.22em]"
        style={{ color: data.color }}
      >
        {data.label}
      </div>
    </div>
  );
}

const nodeTypes = { flowNode: FlowNode, lane: LaneNode };

export function DataFlowReactFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedId, setSelectedId] = useState("resolver");
  const [fullscreen, setFullscreen] = useState(false);
  const [annotationVisible, setAnnotationVisible] = useState(true);
  const activeNodeIds = flowSteps[activeStep].nodes;
  const selected = flowNodeDetails.find((node) => node.id === selectedId) ?? flowNodeDetails[0];

  const nodes = useMemo<Node[]>(() => {
    const lanes: Node[] = lanePositions.map((lane) => ({
      id: `lane-${lane.label}`,
      type: "lane",
      position: { x: lane.x, y: 0 },
      data: {
        label: lane.label,
        color: lane.label === "Learning Loop" ? palette.learn : "var(--cyan)",
      },
      style: { width: lane.w, height: 620 },
      selectable: false,
      draggable: false,
      zIndex: 0,
    }));

    const detailNodes: Node<DataFlowNodeData>[] = flowNodeDetails.map((node) => {
      const color = kindColor[node.kind];
      return {
        id: node.id,
        type: "flowNode",
        position: nodePositions[node.id],
        data: {
          ...node,
          color,
          active: activeNodeIds.includes(node.id) || node.id === selectedId,
          focused: node.id === selectedId,
        },
        zIndex: node.id === selectedId ? 3 : 2,
      };
    });

    return [...lanes, ...detailNodes];
  }, [activeNodeIds, selectedId]);

  const edges = useMemo<Edge[]>(
    () =>
      flowEdges.map(([source, target, tone]) => {
        const color = palette[tone];
        const active =
          activeNodeIds.includes(source) ||
          activeNodeIds.includes(target) ||
          source === selectedId ||
          target === selectedId;
        return {
          id: `${source}-${target}`,
          source,
          target,
          type: "smoothstep",
          animated: active,
          markerEnd: { type: MarkerType.ArrowClosed, color },
          style: {
            stroke: color,
            strokeWidth: active ? 2.4 : 1.2,
            opacity: active ? 0.95 : 0.28,
          },
        };
      }),
    [activeNodeIds, selectedId],
  );

  const stepper = (
    <div className="glass rounded-xl border border-border p-3">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1 overflow-x-auto pb-1">
          <div className="flex gap-2">
            {flowSteps.map((step, index) => (
              <button
                key={step.label}
                onClick={() => {
                  setActiveStep(index);
                  setSelectedId(step.nodes[0]);
                  setAnnotationVisible(true);
                }}
                className="shrink-0 rounded-md border px-3 py-2 text-left transition"
                style={{
                  borderColor: index === activeStep ? "var(--cyan)" : "var(--border)",
                  background:
                    index === activeStep ? "oklch(0.78 0.16 205 / 0.12)" : "var(--surface)",
                }}
              >
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="mt-1 text-xs font-semibold">{step.label}</div>
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setFullscreen((value) => !value)}
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-cyan hover:text-cyan"
        >
          {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          {fullscreen ? "Close" : "Full screen"}
        </button>
      </div>
    </div>
  );

  const legend = (
    <div className="flex flex-wrap gap-2">
      <Legend color={palette.main} label="main review flow" />
      <Legend color={palette.code} label="code-aware flow" />
      <Legend color={palette.graph} label="graph commit" />
      <Legend color={palette.prelive} label="pre-go-live validation" />
      <Legend color={palette.learn} label="incident learning" />
      <Legend color={palette.risk} label="blocking risks" />
    </div>
  );

  const fullscreenAnnotation = (
    <ComponentAnnotation
      selected={selected}
      color={kindColor[selected.kind]}
      onHide={() => setAnnotationVisible(false)}
    />
  );

  const flowBoard = (fullscreenMode = false) => (
    <div
      className={`glass overflow-hidden rounded-xl border border-border shadow-soft ${
        fullscreenMode ? "min-h-0 flex-1" : ""
      }`}
    >
      <div
        className={`grid ${
          fullscreenMode ? "xl:grid-cols-1" : "xl:grid-cols-[minmax(0,1.8fr)_390px]"
        } ${fullscreenMode ? "min-h-0 xl:h-full" : ""}`}
      >
        <div
          className={`relative bg-background/35 ${
            fullscreenMode ? "h-[calc(100vh-245px)] min-h-[520px] xl:h-full" : "h-[680px]"
          }`}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.08 }}
            minZoom={0.16}
            maxZoom={1.3}
            nodesConnectable={false}
            nodesDraggable={false}
            proOptions={{ hideAttribution: true }}
            onNodeClick={(_, node) => {
              if (node.type === "flowNode") {
                setSelectedId(node.id);
                setAnnotationVisible(true);
              }
            }}
          >
            <Background gap={24} size={1} color="var(--border)" />
            <Controls showInteractive={false} className="!border !border-border !bg-surface" />
            <MiniMap
              pannable
              zoomable
              nodeColor={(node) => (node.data?.color as string) ?? "var(--cyan)"}
              maskColor="oklch(0.12 0.03 250 / 0.72)"
              style={{ background: "var(--background)", border: "1px solid var(--border)" }}
            />
          </ReactFlow>
        </div>

        {!fullscreenMode && (
          <aside
            className={`border-t border-border bg-background/60 xl:border-l xl:border-t-0 ${
              fullscreenMode ? "min-h-0 overflow-y-auto" : ""
            }`}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  node detail drawer
                </div>
                <div className="mt-1 text-sm font-semibold">{selected.title}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(activeNodeIds[0])}
                className="rounded-md border border-border p-2 text-muted-foreground hover:border-cyan hover:text-cyan"
                aria-label="Reset selected detail"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 p-4"
              >
                <div className="rounded-lg border border-border bg-surface/70 p-4">
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    purpose
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                    {selected.purpose}
                  </p>
                </div>
                <DetailList title="Inputs" items={selected.inputs} />
                <DetailList title="Outputs" items={selected.outputs} />
                <DetailList title="Key functions" items={selected.functions} />
                <DetailList title="Related rubric" items={selected.rubric} />
                <div className="rounded-lg border border-cyan/30 bg-cyan/10 p-4">
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-cyan">
                    example artifact
                  </div>
                  <pre className="mono mt-2 whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">
                    {selected.artifact}
                  </pre>
                </div>
              </motion.div>
            </AnimatePresence>
          </aside>
        )}
      </div>
    </div>
  );

  return (
    <section className="space-y-4">
      {!fullscreen && stepper}
      {!fullscreen && flowBoard()}
      {!fullscreen && legend}

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col gap-3 bg-background/95 p-4 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface/80 px-4 py-3">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.22em] text-cyan">
                  fullscreen · data flow
                </div>
                <div className="mt-1 font-display text-xl font-semibold">
                  End-to-End CR-Sentinel Review Flow
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:border-cyan hover:text-cyan"
              >
                <Minimize2 className="h-4 w-4" />
                Exit full screen
              </button>
            </div>
            <div className="min-h-0 shrink-0">{stepper}</div>
            <div className="relative min-h-0 flex-1">
              {flowBoard(true)}
              <AnimatePresence>
                {annotationVisible && (
                  <motion.div
                    key={selected.id}
                    className="pointer-events-none absolute inset-y-3 right-3 z-20 flex w-[min(390px,calc(100vw-32px))] max-w-full"
                    initial={{ opacity: 0, x: 24, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 24, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                  >
                    {fullscreenAnnotation}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="shrink-0">{legend}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ComponentAnnotation({
  selected,
  color,
  onHide,
}: {
  selected: FlowNodeDetail;
  color: string;
  onHide: () => void;
}) {
  return (
    <aside className="glass pointer-events-auto min-h-0 w-full overflow-y-auto rounded-xl border border-border bg-background/90 shadow-soft backdrop-blur-xl">
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="mono text-[10px] uppercase tracking-[0.22em] text-cyan">
            component annotation
          </div>
          <button
            type="button"
            onClick={onHide}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border bg-surface text-muted-foreground transition hover:border-cyan hover:text-cyan"
            aria-label="Hide component annotation"
            title="Hide annotation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex items-start gap-3">
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border"
            style={{
              borderColor: `${color}55`,
              background: `${color}18`,
              color,
            }}
          >
            <span className="mono text-xs font-semibold">
              {String(selected.step).padStart(2, "0")}
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-base font-semibold leading-tight">{selected.title}</div>
            <div className="mono mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {selected.subtitle}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="rounded-lg border border-border bg-surface/60 p-4">
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            why this component matters
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">{selected.purpose}</p>
        </div>

        <AnnotationList title="Consumes" items={selected.inputs} color={color} />
        <AnnotationList title="Produces" items={selected.outputs} color={color} />
        <AnnotationList
          title="Checks / actions"
          items={selected.functions.slice(0, 4)}
          color={color}
        />

        <div className="rounded-lg border border-cyan/30 bg-cyan/10 p-4">
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-cyan">
            sample evidence
          </div>
          <pre className="mono mt-2 whitespace-pre-wrap text-[11px] leading-relaxed text-foreground/90">
            {selected.artifact}
          </pre>
        </div>
      </div>
    </aside>
  );
}

function AnnotationList({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface/45 p-4">
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </div>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-relaxed text-foreground/85">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: color }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-surface/45 p-4">
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </div>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-relaxed text-foreground/85">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="mono inline-flex items-center gap-2 rounded-md border border-border bg-surface/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: color, boxShadow: `0 0 10px ${color}` }}
      />
      {label}
    </div>
  );
}
