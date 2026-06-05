import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  AlertTriangle,
  Database,
  GitPullRequestArrow,
  MessageSquareWarning,
  Network,
  RadioTower,
  Server,
  ShieldAlert,
} from "lucide-react";

type GraphTone = "direct" | "normal" | "indirect" | "new" | "incident";

type GraphNodeData = {
  label: string;
  subtitle: string;
  tone: GraphTone;
  icon: keyof typeof iconMap;
};

const toneColor: Record<GraphTone, string> = {
  direct: "var(--magenta)",
  normal: "var(--border)",
  indirect: "var(--orange)",
  new: "var(--cyan)",
  incident: "var(--purple)",
};

const iconMap = {
  alert: AlertTriangle,
  database: Database,
  incident: MessageSquareWarning,
  network: Network,
  request: GitPullRequestArrow,
  server: Server,
  shield: ShieldAlert,
  topic: RadioTower,
} as const;

function GraphEntityNode({ data, selected }: NodeProps<GraphNodeData>) {
  const color = toneColor[data.tone];
  const Icon = iconMap[data.icon];

  return (
    <div
      className="group relative w-[190px] cursor-grab rounded-lg border bg-background/90 px-3 py-2 text-left shadow-soft backdrop-blur transition active:cursor-grabbing"
      style={{
        borderColor: selected ? color : data.tone === "normal" ? "var(--border)" : `${color}90`,
        boxShadow:
          selected || data.tone === "new"
            ? `0 0 28px -10px ${color}, 0 0 0 1px ${color}55`
            : "none",
      }}
      title="Drag to reposition"
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div className="flex items-start gap-2.5">
        <div
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md border"
          style={{ borderColor: `${color}55`, background: `${color}18`, color }}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[12px] font-semibold leading-tight text-foreground">
            {data.label}
          </div>
          <div className="mono mt-1 text-[9.5px] uppercase tracking-wider text-muted-foreground">
            {data.subtitle}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

const nodeTypes = { entity: GraphEntityNode };

const initialNodes: Node<GraphNodeData>[] = [
  {
    id: "payment-service",
    type: "entity",
    position: { x: 380, y: 150 },
    data: {
      label: "payment-service",
      subtitle: "declared impact",
      tone: "direct",
      icon: "server",
    },
  },
  {
    id: "refund-service",
    type: "entity",
    position: { x: 110, y: 80 },
    data: {
      label: "refund-service",
      subtitle: "known caller",
      tone: "normal",
      icon: "server",
    },
  },
  {
    id: "ledger-service",
    type: "entity",
    position: { x: 670, y: 190 },
    data: {
      label: "ledger-service",
      subtitle: "discovered consumer",
      tone: "indirect",
      icon: "database",
    },
  },
  {
    id: "notification-service",
    type: "entity",
    position: { x: 720, y: 55 },
    data: {
      label: "notification-service",
      subtitle: "discovered consumer",
      tone: "indirect",
      icon: "server",
    },
  },
  {
    id: "fraud-monitoring",
    type: "entity",
    position: { x: 790, y: 335 },
    data: {
      label: "fraud-monitoring",
      subtitle: "candidate consumer",
      tone: "indirect",
      icon: "shield",
    },
  },
  {
    id: "kafka-bus",
    type: "entity",
    position: { x: 400, y: 335 },
    data: {
      label: "kafka-bus",
      subtitle: "event backbone",
      tone: "normal",
      icon: "network",
    },
  },
  {
    id: "payment-authorized",
    type: "entity",
    position: { x: 505, y: 245 },
    data: {
      label: "payment.authorized",
      subtitle: "new candidate topic",
      tone: "new",
      icon: "topic",
    },
  },
  {
    id: "cr-2026-001",
    type: "entity",
    position: { x: 130, y: 405 },
    data: {
      label: "CR-2026-001",
      subtitle: "change record",
      tone: "direct",
      icon: "request",
    },
  },
  {
    id: "inc-2026-009",
    type: "entity",
    position: { x: 770, y: 515 },
    data: {
      label: "INC-2026-009",
      subtitle: "related incident",
      tone: "incident",
      icon: "incident",
    },
  },
  {
    id: "risk-pattern",
    type: "entity",
    position: { x: 410, y: 535 },
    data: {
      label: "Risk Pattern",
      subtitle: "downstream flag missing",
      tone: "incident",
      icon: "alert",
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "payment-refund",
    source: "payment-service",
    target: "refund-service",
    label: "CALLS",
  },
  {
    id: "payment-topic",
    source: "payment-service",
    target: "payment-authorized",
    label: "PUBLISHES",
    style: { stroke: "var(--cyan)" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--cyan)" },
  },
  {
    id: "topic-ledger",
    source: "payment-authorized",
    target: "ledger-service",
    label: "CONSUMES",
    style: { stroke: "var(--orange)" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--orange)" },
  },
  {
    id: "topic-notification",
    source: "payment-authorized",
    target: "notification-service",
    label: "CONSUMES",
    style: { stroke: "var(--orange)" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--orange)" },
  },
  {
    id: "topic-fraud",
    source: "payment-authorized",
    target: "fraud-monitoring",
    label: "CONSUMES",
    style: { stroke: "var(--orange)", strokeDasharray: "6 5" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--orange)" },
  },
  {
    id: "cr-payment",
    source: "cr-2026-001",
    target: "payment-service",
    label: "IMPACTS",
    style: { stroke: "var(--magenta)" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--magenta)" },
  },
  {
    id: "cr-ledger",
    source: "cr-2026-001",
    target: "ledger-service",
    label: "DISCOVERED",
    style: { stroke: "var(--cyan)", strokeDasharray: "6 5" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--cyan)" },
  },
  {
    id: "incident-cr",
    source: "inc-2026-009",
    target: "cr-2026-001",
    label: "CAUSED_BY",
    style: { stroke: "var(--purple)" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--purple)" },
  },
  {
    id: "incident-pattern",
    source: "inc-2026-009",
    target: "risk-pattern",
    label: "FEEDS",
    style: { stroke: "var(--purple)" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--purple)" },
  },
].map((edge) => ({
  ...edge,
  type: "smoothstep",
  labelBgPadding: [8, 4],
  labelBgBorderRadius: 6,
  labelBgStyle: { fill: "var(--surface)", fillOpacity: 0.88 },
  labelStyle: {
    fill: "var(--muted-foreground)",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
  },
  markerEnd: edge.markerEnd ?? { type: MarkerType.ArrowClosed, color: "var(--muted-foreground)" },
  style: {
    ...(edge.style ?? {}),
    stroke: edge.style?.stroke ?? "var(--muted-foreground)",
    strokeWidth: 1.7,
  },
}));

export function KnowledgeGraphFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const legendItems = useMemo(
    () => [
      ["Declared", toneColor.direct],
      ["Discovered", toneColor.indirect],
      ["Candidate", toneColor.new],
      ["Incident learning", toneColor.incident],
    ],
    [],
  );

  return (
    <div className="relative h-[620px] overflow-hidden rounded-xl border border-border bg-surface/60">
      <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-lg border border-border bg-background/80 px-3 py-2 backdrop-blur">
        <div className="mono text-[10px] uppercase tracking-[0.2em] text-cyan">
          draggable graph database
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Drag nodes to rearrange the ecosystem view.
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable
        nodesConnectable={false}
        fitView
        fitViewOptions={{ padding: 0.16 }}
        minZoom={0.35}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
        onNodeDragStop={(_, draggedNode) => {
          setNodes((currentNodes) =>
            currentNodes.map((node) =>
              node.id === draggedNode.id ? { ...node, position: draggedNode.position } : node,
            ),
          );
        }}
      >
        <Background gap={26} size={1} color="var(--border)" />
        <Controls showInteractive={false} className="!border !border-border !bg-surface" />
        <MiniMap
          pannable
          zoomable
          nodeColor={(node) => toneColor[(node.data as GraphNodeData).tone] ?? "var(--cyan)"}
          maskColor="oklch(0.12 0.03 250 / 0.72)"
          style={{ background: "var(--background)", border: "1px solid var(--border)" }}
        />
      </ReactFlow>

      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
        {legendItems.map(([label, color]) => (
          <div
            key={label}
            className="mono inline-flex items-center gap-2 rounded-md border border-border bg-background/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
