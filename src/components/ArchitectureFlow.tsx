import { useMemo, useState } from "react";
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
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Cloud,
  ShieldCheck,
  Globe,
  FolderOpen,
  Workflow,
  Bot,
  Server,
  Database,
  Boxes,
  Zap,
  FileText,
  GitBranch,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Radio,
  Rocket,
  ScrollText,
  Gauge,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
type NodeData = {
  label: string;
  sub?: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color?: string;
  step?: number; // execution order (lower = earlier)
  role?: string; // short tagline
  desc?: string; // detailed description
  inputs?: string[];
  outputs?: string[];
  active?: boolean; // currently selected
};

/* ------------------------------------------------------------------ */
/* Compact node — just chip with icon + step badge                    */
/* ------------------------------------------------------------------ */
function ServiceNode({ data }: NodeProps<NodeData>) {
  const Icon = data.icon;
  const color = data.color ?? "var(--primary)";
  const active = data.active;
  return (
    <div
      className="group relative flex cursor-pointer items-center gap-2 rounded-lg border bg-surface/95 px-2.5 py-1.5 text-foreground backdrop-blur transition"
      style={{
        borderColor: active ? color : `color-mix(in oklab, ${color} 35%, var(--border))`,
        boxShadow: active
          ? `0 0 0 2px ${color}, 0 0 24px -4px ${color}`
          : `0 0 0 1px ${color}1f, 0 4px 14px -8px ${color}66`,
        minWidth: 140,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      {Icon && (
        <div
          className="grid h-6 w-6 shrink-0 place-items-center rounded-md"
          style={{ background: `${color}1f`, color }}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[11.5px] font-semibold leading-tight">{data.label}</div>
        {data.sub && (
          <div className="mono truncate text-[9px] uppercase tracking-wider text-muted-foreground">
            {data.sub}
          </div>
        )}
      </div>
      {data.step !== undefined && (
        <div
          className="mono grid h-5 min-w-[20px] shrink-0 place-items-center rounded-full px-1 text-[9.5px] font-bold"
          style={{ background: color, color: "var(--background)" }}
        >
          {String(data.step).padStart(2, "0")}
        </div>
      )}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
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
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: data.color, boxShadow: `0 0 8px ${data.color}` }}
        />
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
const COL = { input: 40, api: 250, orch: 480, paths: 740, eval: 1170 } as const;
const C = {
  user: "var(--cyan)",
  api: "var(--primary)",
  orch: "var(--rose)",
  doc: "#22c55e",
  code: "var(--violet)",
  data: "var(--amber)",
  result: "var(--accent)",
} as const;

type ND = Omit<NodeData, "active">;

const NODE_DEFS: { id: string; pos: { x: number; y: number }; data: ND }[] = [
  // ---------- Input ----------
  {
    id: "user",
    pos: { x: COL.input, y: 60 },
    data: {
      label: "Reviewer / User",
      sub: "engineer · TL",
      icon: Users,
      color: C.user,
      step: 1,
      role: "Người khởi tạo review",
      desc: "Reviewer mở Portal, dán link CR (Confluence/Jira) hoặc upload tài liệu. Đây là điểm bắt đầu của một phiên review mới.",
      outputs: ["CR link", "uploaded files"],
    },
  },
  {
    id: "portal",
    pos: { x: COL.input, y: 140 },
    data: {
      label: "CR Review Portal",
      sub: "chat · versions",
      icon: ScrollText,
      color: C.user,
      step: 2,
      role: "Giao diện chat + lịch sử review",
      desc: "Portal lưu chat history, review versions, file upload và hiển thị kết quả GO/NO_GO. Mỗi CR có nhiều phiên review để so sánh.",
      inputs: ["user actions"],
      outputs: ["POST /reviews"],
    },
  },
  {
    id: "src-jira",
    pos: { x: COL.input, y: 340 },
    data: {
      label: "ITSM / Jira",
      sub: "on-prem",
      icon: GitBranch,
      color: C.user,
      role: "Nguồn ITSM",
      desc: "Hệ thống ITSM/Jira chứa metadata của CR: ticket, comment, link tới MR, attachment. Được Intent Agent fetch để hiểu ngữ cảnh.",
    },
  },
  {
    id: "src-conf",
    pos: { x: COL.input, y: 410 },
    data: {
      label: "Confluence",
      sub: "cloud / on-prem",
      icon: FileText,
      color: C.user,
      role: "Tài liệu CR",
      desc: "Confluence là nơi viết CR document chính. Intent Agent đọc page, resolve link đính kèm và normalize sang markdown.",
    },
  },
  {
    id: "src-files",
    pos: { x: COL.input, y: 480 },
    data: {
      label: "Uploaded Files",
      sub: "pdf · md · xlsx",
      icon: FolderOpen,
      color: C.user,
      role: "File bổ sung",
      desc: "Người dùng có thể upload thêm tài liệu (runbook, diagram, spec). Lưu vào S3 và đưa vào CR package.",
    },
  },

  // ---------- API ----------
  {
    id: "cloudfront",
    pos: { x: COL.api, y: 60 },
    data: {
      label: "CloudFront",
      sub: "optional edge",
      icon: Globe,
      color: C.api,
      role: "CDN edge",
      desc: "Phục vụ static assets của Portal qua edge, giảm latency cho reviewer ở nhiều vùng.",
    },
  },
  {
    id: "amplify",
    pos: { x: COL.api, y: 140 },
    data: {
      label: "AWS Amplify",
      sub: "portal UI",
      icon: Cloud,
      color: C.api,
      role: "Hosting frontend",
      desc: "Build & deploy Portal UI. CI/CD tự động khi merge vào main.",
    },
  },
  {
    id: "cognito",
    pos: { x: COL.api, y: 220 },
    data: {
      label: "Amazon Cognito",
      sub: "auth · jwt",
      icon: ShieldCheck,
      color: C.api,
      role: "Xác thực người dùng",
      desc: "Quản lý user pool, phát hành JWT. API Gateway validate token trước khi forward request.",
    },
  },
  {
    id: "apigw",
    pos: { x: COL.api, y: 310 },
    data: {
      label: "API Gateway",
      sub: "CR Review API",
      icon: Zap,
      color: C.api,
      step: 3,
      role: "Cổng vào backend",
      desc: "Nhận request từ Portal, validate JWT, throttling, sau đó kích hoạt Step Functions execution mới cho mỗi CR review.",
      inputs: ["POST /reviews"],
      outputs: ["StartExecution"],
    },
  },
  {
    id: "s3-upload",
    pos: { x: COL.api, y: 420 },
    data: {
      label: "S3 · File Uploads",
      sub: "raw inputs",
      icon: Boxes,
      color: C.api,
      role: "Lưu file raw",
      desc: "Lưu file người dùng upload (presigned URL). Intent Agent sẽ đọc lại khi build CR package.",
    },
  },

  // ---------- Orchestration ----------
  {
    id: "stepfn",
    pos: { x: COL.orch, y: 90 },
    data: {
      label: "Step Functions",
      sub: "CR Review Workflow",
      icon: Workflow,
      color: C.orch,
      step: 4,
      role: "Orchestrator chính",
      desc: "State machine điều phối toàn bộ workflow: Intent → routing → DOCUMENT_ONLY hoặc CODE_AWARE → Aggregate → Decide. Có retry, parallel, audit history.",
      outputs: ["invoke agents", "branching"],
    },
  },
  {
    id: "intent",
    pos: { x: COL.orch, y: 200 },
    data: {
      label: "CR Intent Agent",
      sub: "resolve · routing",
      icon: Bot,
      color: C.orch,
      step: 5,
      role: "Hiểu ý định CR + định tuyến",
      desc: "Fetch ITSM/Confluence/files, resolve link (MR, image tag, SHA), normalize sang markdown, phát hiện có code change hay không, rồi tạo routing decision.",
      inputs: ["CR link"],
      outputs: ["DOCUMENT_ONLY | CODE_AWARE", "CR package"],
    },
  },
  {
    id: "s3-pkg",
    pos: { x: COL.orch, y: 410 },
    data: {
      label: "S3 · CR Package",
      sub: "normalized md",
      icon: Boxes,
      color: C.data,
      role: "CR đã chuẩn hoá",
      desc: "Markdown CR package (đã merge mọi nguồn) — input chung cho cả Document và Code agents.",
    },
  },
  {
    id: "ddb-sess",
    pos: { x: COL.orch, y: 480 },
    data: {
      label: "DynamoDB",
      sub: "sessions · versions",
      icon: Database,
      color: C.data,
      role: "State Portal",
      desc: "Lưu review sessions, version, chat history. Portal đọc trực tiếp để render lịch sử.",
    },
  },

  // ---------- DOCUMENT_ONLY ----------
  {
    id: "d-comp",
    pos: { x: COL.paths, y: 70 },
    data: {
      label: "Completeness",
      sub: "λ agent",
      icon: CheckCircle2,
      color: C.doc,
      step: 6,
      role: "Kiểm tra đầy đủ",
      desc: "Đảm bảo CR có đủ mục bắt buộc: mục tiêu, scope, rollout, rollback, communication.",
    },
  },
  {
    id: "d-cons",
    pos: { x: COL.paths + 130, y: 70 },
    data: {
      label: "Consistency",
      sub: "λ agent",
      icon: ScrollText,
      color: C.doc,
      step: 6,
      role: "Đối chiếu thông tin",
      desc: "Phát hiện mâu thuẫn giữa các phần của CR: scope vs rollout, owner vs approver…",
    },
  },
  {
    id: "d-vgap",
    pos: { x: COL.paths + 260, y: 70 },
    data: {
      label: "Verification Gap",
      sub: "λ agent",
      icon: AlertTriangle,
      color: C.doc,
      step: 6,
      role: "Khoảng trống verify",
      desc: "Đánh giá test plan/UAT của CR. Báo nếu thiếu evidence chứng minh thay đổi hoạt động.",
    },
  },
  {
    id: "d-roll",
    pos: { x: COL.paths, y: 150 },
    data: {
      label: "Rollout / Runbook",
      sub: "λ agent",
      icon: Rocket,
      color: C.doc,
      step: 6,
      role: "Đánh giá runbook",
      desc: "Phân tích kế hoạch rollout, rollback, readiness gate; phát hiện step thiếu hoặc rủi ro.",
    },
  },
  {
    id: "d-sec",
    pos: { x: COL.paths + 130, y: 150 },
    data: {
      label: "Security Review",
      sub: "λ agent",
      icon: Lock,
      color: C.doc,
      step: 6,
      role: "Risk an ninh từ document",
      desc: "Phát hiện thay đổi nhạy cảm (IAM, network, data exposure) chỉ từ mô tả CR.",
    },
  },

  // ---------- CODE_AWARE ----------
  {
    id: "fargate",
    pos: { x: COL.paths, y: 330 },
    data: {
      label: "ECS · Fargate Workspace",
      sub: "long-running",
      icon: Server,
      color: C.code,
      step: 6,
      role: "1 CR = 1 workspace",
      desc: "Long-running task: clone repos, checkout đúng SHA, build diff, dựng CodeGraph index, expose Workspace API & MCP tools. Read-only, isolate trong VPC.",
      outputs: ["READY signal", "MCP tools"],
    },
  },
  {
    id: "secrets",
    pos: { x: COL.paths + 260, y: 330 },
    data: {
      label: "Secrets Manager",
      sub: "read-only",
      icon: KeyRound,
      color: C.data,
      role: "Cung cấp credential",
      desc: "Inject token clone repo, registry token. Read-only scope, không cho phép write.",
    },
  },
  {
    id: "ddb-ws",
    pos: { x: COL.paths + 260, y: 410 },
    data: {
      label: "Workspace Registry",
      sub: "DynamoDB",
      icon: Database,
      color: C.data,
      role: "Theo dõi workspace",
      desc: "Lưu trạng thái workspace (READY/BUSY/STOPPED), TTL để cleanup tự động.",
    },
  },
  {
    id: "s3-audit",
    pos: { x: COL.paths, y: 490 },
    data: {
      label: "S3 · Audit Trail",
      sub: "every tool call",
      icon: Boxes,
      color: C.data,
      role: "Bằng chứng audit",
      desc: "Mỗi tool call (request + response) được append. Immutable, dùng cho compliance và replay.",
    },
  },
  {
    id: "gateway",
    pos: { x: COL.paths + 130, y: 570 },
    data: {
      label: "Code Tool Gateway",
      sub: "λ · MCP proxy",
      icon: Zap,
      color: C.code,
      step: 7,
      role: "Cổng truy vấn code",
      desc: "Lambda đứng giữa agents và workspace. Mọi tool call đi qua gateway → audit + rate limit + chuẩn hoá schema MCP.",
      inputs: ["agent tool.call"],
      outputs: ["workspace API"],
    },
  },
  {
    id: "c-hidden",
    pos: { x: COL.paths + 10, y: 660 },
    data: {
      label: "Hidden Impact",
      sub: "λ agent",
      icon: AlertTriangle,
      color: C.code,
      step: 8,
      role: "Tác động ẩn",
      desc: "Tìm module bị ảnh hưởng gián tiếp (callers, transitive deps) ngoài diff trực tiếp.",
    },
  },
  {
    id: "c-vgap",
    pos: { x: COL.paths + 210, y: 660 },
    data: {
      label: "Verification Gap",
      sub: "λ agent",
      icon: CheckCircle2,
      color: C.code,
      step: 8,
      role: "Coverage gap",
      desc: "Đối chiếu test coverage với scope thay đổi thực tế. Báo phần code thay đổi nhưng chưa test.",
    },
  },
  {
    id: "c-sec",
    pos: { x: COL.paths + 10, y: 720 },
    data: {
      label: "Security & PII",
      sub: "λ agent",
      icon: Lock,
      color: C.code,
      step: 8,
      role: "Security trên code",
      desc: "Quét secret leak, PII trong log, IAM/scope mở rộng, dependency CVE.",
    },
  },
  {
    id: "c-kafka",
    pos: { x: COL.paths + 210, y: 720 },
    data: {
      label: "Kafka / vs Prod",
      sub: "λ agent",
      icon: Radio,
      color: C.code,
      step: 8,
      role: "Event schema & env diff",
      desc: "Kiểm tra breaking change schema Kafka, so sánh config/flag/image tag giữa non-prod và prod.",
    },
  },

  // ---------- Evaluation ----------
  {
    id: "agg",
    pos: { x: COL.eval, y: 80 },
    data: {
      label: "Evaluation Aggregator",
      sub: "λ agent",
      icon: Bot,
      color: C.result,
      step: 9,
      role: "Tổng hợp findings",
      desc: "Merge findings từ cả Document và Code agents, khử trùng, gom theo theme, gắn evidence link.",
    },
  },
  {
    id: "risk",
    pos: { x: COL.eval, y: 220 },
    data: {
      label: "Risk Scoring Engine",
      sub: "score · confidence",
      icon: Gauge,
      color: C.result,
      step: 10,
      role: "Chấm điểm rủi ro",
      desc: "Tính risk score theo trọng số: impact × confidence × blast radius. Output mức rủi ro tổng.",
    },
  },
  {
    id: "report",
    pos: { x: COL.eval, y: 340 },
    data: {
      label: "Final Report",
      sub: "evidence · rationale",
      icon: FileText,
      color: C.result,
      step: 11,
      role: "Quyết định cuối",
      desc: "Render report có rationale + evidence link. Bốn outcome: GO / GO_WITH_WARNING / NEEDS_MANUAL_REVIEW / NO_GO. Publish ngược về Portal.",
      outputs: ["GO", "GO_WITH_WARNING", "NEEDS_MANUAL_REVIEW", "NO_GO"],
    },
  },
];

const GROUPS = [
  {
    id: "g-input",
    x: COL.input - 20,
    y: 20,
    w: 210,
    h: 540,
    label: "1 · User & Input",
    color: C.user,
  },
  {
    id: "g-api",
    x: COL.api - 20,
    y: 20,
    w: 210,
    h: 540,
    label: "2 · Frontend & API",
    color: C.api,
  },
  {
    id: "g-orch",
    x: COL.orch - 20,
    y: 20,
    w: 230,
    h: 540,
    label: "3 · Orchestration",
    color: C.orch,
  },
  {
    id: "g-doc",
    x: COL.paths - 20,
    y: 20,
    w: 410,
    h: 220,
    label: "A · DOCUMENT_ONLY",
    sub: "no code change",
    color: C.doc,
  },
  {
    id: "g-code",
    x: COL.paths - 20,
    y: 290,
    w: 410,
    h: 480,
    label: "B · CODE_AWARE",
    sub: "1 CR = 1 Fargate workspace",
    color: C.code,
  },
  {
    id: "g-result",
    x: COL.eval - 20,
    y: 20,
    w: 220,
    h: 540,
    label: "4 · Evaluation & Results",
    color: C.result,
  },
];

function makeEdges(): Edge[] {
  const e = (
    id: string,
    source: string,
    target: string,
    color: string,
    label?: string,
    animated = false,
  ): Edge => ({
    id,
    source,
    target,
    label,
    animated,
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, color },
    style: { stroke: color, strokeWidth: 1.4 },
    labelStyle: { fill: "var(--muted-foreground)", fontSize: 9.5 },
    labelBgStyle: { fill: "var(--background)", fillOpacity: 0.85 },
  });
  return [
    e("u-portal", "user", "portal", C.user),
    e("portal-cf", "portal", "cloudfront", C.user, "browse"),
    e("cf-amp", "cloudfront", "amplify", C.api),
    e("amp-cog", "amplify", "cognito", C.api),
    e("cog-api", "cognito", "apigw", C.api, "jwt"),
    e("jira-api", "src-jira", "apigw", C.user),
    e("conf-api", "src-conf", "apigw", C.user),
    e("files-s3", "src-files", "s3-upload", C.user),
    e("api-step", "apigw", "stepfn", C.orch, "start", true),
    e("step-intent", "stepfn", "intent", C.orch),
    e("intent-pkg", "intent", "s3-pkg", C.data),
    e("intent-ddb", "intent", "ddb-sess", C.data),
    e("intent-doc", "intent", "d-comp", C.doc, "no code", true),
    e("intent-doc2", "intent", "d-cons", C.doc),
    e("intent-doc3", "intent", "d-vgap", C.doc),
    e("intent-fg", "intent", "fargate", C.code, "code change", true),
    e("fg-sec", "fargate", "secrets", C.data),
    e("fg-ws", "fargate", "ddb-ws", C.data),
    e("fg-audit", "fargate", "s3-audit", C.data),
    e("fg-gw", "fargate", "gateway", C.code),
    e("gw-h", "gateway", "c-hidden", C.code, "fan-out", true),
    e("gw-v", "gateway", "c-vgap", C.code),
    e("gw-s", "gateway", "c-sec", C.code),
    e("gw-k", "gateway", "c-kafka", C.code),
    e("d1-agg", "d-comp", "agg", C.doc),
    e("d2-agg", "d-cons", "agg", C.doc),
    e("d3-agg", "d-vgap", "agg", C.doc),
    e("d4-agg", "d-roll", "agg", C.doc),
    e("d5-agg", "d-sec", "agg", C.doc),
    e("c1-agg", "c-hidden", "agg", C.code),
    e("c2-agg", "c-vgap", "agg", C.code),
    e("c3-agg", "c-sec", "agg", C.code),
    e("c4-agg", "c-kafka", "agg", C.code),
    e("agg-risk", "agg", "risk", C.result),
    e("risk-report", "risk", "report", C.result),
    e("report-portal", "report", "portal", C.result, "publish", true),
  ];
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export function ArchitectureFlow() {
  const [selectedId, setSelectedId] = useState<string | null>("intent");

  const nodes = useMemo<Node[]>(() => {
    const gs: Node<{ label: string; sub?: string; color: string }>[] = GROUPS.map((g) => ({
      id: g.id,
      type: "group",
      position: { x: g.x, y: g.y },
      data: { label: g.label, sub: g.sub, color: g.color },
      style: { width: g.w, height: g.h },
      selectable: false,
      draggable: false,
      zIndex: 0,
    }));
    const items: Node<NodeData>[] = NODE_DEFS.map((d) => ({
      id: d.id,
      type: "service",
      position: d.pos,
      data: { ...d.data, active: d.id === selectedId },
    }));
    return [...gs, ...items];
  }, [selectedId]);

  const edges = useMemo<Edge[]>(() => {
    const all = makeEdges();
    if (!selectedId) return all;
    return all.map((e) => {
      const touch = e.source === selectedId || e.target === selectedId;
      return {
        ...e,
        animated: touch || e.animated,
        style: {
          ...e.style,
          strokeWidth: touch ? 2.4 : 1,
          opacity: touch ? 1 : 0.35,
        },
      };
    });
  }, [selectedId]);

  const selected = NODE_DEFS.find((n) => n.id === selectedId)?.data;

  // ordered list for sequence rail
  const sequence = useMemo(
    () =>
      [...NODE_DEFS]
        .filter((n) => n.data.step !== undefined)
        .sort((a, b) => a.data.step! - b.data.step!),
    [],
  );

  return (
    <div
      className="glass overflow-hidden rounded-2xl border border-border"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-center justify-between border-b border-border bg-background/40 px-5 py-3">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: "var(--primary)", boxShadow: "0 0 8px var(--primary)" }}
          />
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            interactive · click vào node để xem chi tiết
          </span>
        </div>
        <div className="mono hidden text-[10px] text-muted-foreground md:block">
          drag · zoom · pan
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.7fr_1fr]">
        {/* Flow */}
        <div style={{ height: 720 }} className="relative bg-background/30">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.12 }}
            minZoom={0.4}
            maxZoom={1.6}
            proOptions={{ hideAttribution: true }}
            nodesDraggable
            nodesConnectable={false}
            onNodeClick={(_, n) => {
              if (n.type === "service") setSelectedId(n.id);
            }}
            onPaneClick={() => setSelectedId(null)}
          >
            <Background gap={20} size={1} color="var(--border)" />
            <Controls showInteractive={false} className="!bg-surface !border !border-border" />
            <MiniMap
              pannable
              zoomable
              nodeColor={(n) => {
                const data = n.data as { color?: string } | undefined;
                return data?.color ?? "var(--primary)";
              }}
              maskColor="oklch(0.16 0.03 265 / 0.6)"
              style={{ background: "var(--background)", border: "1px solid var(--border)" }}
            />
          </ReactFlow>
        </div>

        {/* Detail panel */}
        <div className="border-t border-border bg-background/50 lg:border-l lg:border-t-0">
          <div className="border-b border-border px-4 py-2.5">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              detail · component
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selectedId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {selected.icon && (
                        <div
                          className="grid h-8 w-8 place-items-center rounded-md"
                          style={{ background: `${selected.color}1f`, color: selected.color }}
                        >
                          <selected.icon className="h-4 w-4" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-semibold">{selected.label}</div>
                        {selected.sub && (
                          <div className="mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            {selected.sub}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="rounded p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
                      aria-label="close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {selected.step !== undefined && (
                    <div className="mono mt-3 inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1 text-[10px]">
                      <span
                        className="grid h-4 w-4 place-items-center rounded-full"
                        style={{ background: selected.color, color: "var(--background)" }}
                      >
                        {selected.step}
                      </span>
                      <span className="uppercase tracking-[0.18em] text-muted-foreground">
                        thứ tự thực hiện
                      </span>
                    </div>
                  )}

                  {selected.role && (
                    <div className="mt-3 text-[12px] font-medium" style={{ color: selected.color }}>
                      {selected.role}
                    </div>
                  )}
                  {selected.desc && (
                    <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                      {selected.desc}
                    </p>
                  )}

                  {(selected.inputs?.length || selected.outputs?.length) && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {selected.inputs?.length ? (
                        <div className="rounded-md border border-border bg-surface/50 p-2">
                          <div className="mono text-[9.5px] uppercase tracking-wider text-muted-foreground">
                            inputs
                          </div>
                          <ul className="mt-1 space-y-0.5">
                            {selected.inputs.map((x) => (
                              <li key={x} className="mono text-[10.5px] text-foreground/85">
                                · {x}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div />
                      )}
                      {selected.outputs?.length ? (
                        <div className="rounded-md border border-border bg-surface/50 p-2">
                          <div className="mono text-[9.5px] uppercase tracking-wider text-muted-foreground">
                            outputs
                          </div>
                          <ul className="mt-1 space-y-0.5">
                            {selected.outputs.map((x) => (
                              <li key={x} className="mono text-[10.5px] text-foreground/85">
                                · {x}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mono py-6 text-center text-[11px] text-muted-foreground"
                >
                  Click vào một node để xem mô tả &amp; thứ tự
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sequence rail */}
          <div className="border-t border-border px-4 py-3">
            <div className="mono mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              thứ tự thực hiện · end-to-end
            </div>
            <ol className="space-y-1">
              {sequence.map((n) => {
                const active = n.id === selectedId;
                const Icon = n.data.icon;
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => setSelectedId(n.id)}
                      className="flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left transition"
                      style={{
                        borderColor: active ? n.data.color : "var(--border)",
                        background: active ? `${n.data.color}14` : "transparent",
                      }}
                    >
                      <span
                        className="mono grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9.5px] font-bold"
                        style={{ background: n.data.color, color: "var(--background)" }}
                      >
                        {String(n.data.step).padStart(2, "0")}
                      </span>
                      {Icon && (
                        <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: n.data.color }} />
                      )}
                      <span className="truncate text-[11.5px]">{n.data.label}</span>
                      <span className="mono ml-auto truncate text-[9.5px] text-muted-foreground">
                        {n.data.role}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
