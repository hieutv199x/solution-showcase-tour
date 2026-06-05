import { createFileRoute } from "@tanstack/react-router";
import { useState, type ComponentType, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Code2,
  Cpu,
  Database,
  FileCode2,
  FileSearch,
  GitBranch,
  Gauge,
  LayoutDashboard,
  Lock,
  Network,
  Play,
  Radar,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Split,
  UserCheck,
  Workflow,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar as RadarShape,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataFlowReactFlow } from "@/components/DataFlowReactFlow";
import { KnowledgeGraphFlow } from "@/components/KnowledgeGraphFlow";
import {
  agents,
  coreDecisions,
  demoSteps,
  findings,
  goLiveChecks,
  graphLifecycle,
  highLevelFlow,
  navItems,
  rubricRows,
  scoringCriteria,
  valueCards,
  workspaceEndpoints,
  type ViewId,
} from "@/data/crSentinel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CR-Sentinel - AI-Assisted Change Review" },
      {
        name: "description",
        content:
          "Interactive solution showcase for CR-Sentinel, an AI-assisted Change Review and Go-Live Intelligence Platform.",
      },
      { property: "og:title", content: "CR-Sentinel" },
      {
        property: "og:description",
        content:
          "From fragmented CR input to evidence-backed GO / NO-GO decisions, ecosystem impact graph, and incident-driven skill learning.",
      },
    ],
  }),
  component: CRSentinelShowcase,
});

const viewTitles: Record<ViewId, string> = {
  overview: "Overview",
  "data-flow": "End-to-End Data Flow",
  architecture: "Architecture",
  agents: "Agent System",
  workspace: "Code Workspace",
  graph: "Knowledge Graph",
  "go-live": "Go-Live Gate",
  learning: "Incident Learning",
  rubric: "Rubric Scorecard",
  demo: "Demo Scenario",
};

const viewIcons: Record<ViewId, ComponentType<{ className?: string }>> = {
  overview: LayoutDashboard,
  "data-flow": Workflow,
  architecture: Network,
  agents: Bot,
  workspace: Code2,
  graph: Database,
  "go-live": ShieldCheck,
  learning: Brain,
  rubric: BarChart3,
  demo: Play,
};

function CRSentinelShowcase() {
  const [activeView, setActiveView] = useState<ViewId>("overview");
  const [query, setQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 grid-bg opacity-35" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_5%,oklch(0.78_0.16_205_/_0.17),transparent_30%),radial-gradient(circle_at_85%_15%,oklch(0.7_0.22_310_/_0.16),transparent_32%),radial-gradient(circle_at_55%_95%,oklch(0.76_0.17_155_/_0.11),transparent_35%)]" />
      <div
        className={`relative grid min-h-screen transition-[grid-template-columns] duration-300 ${
          sidebarCollapsed
            ? "lg:grid-cols-[88px_minmax(0,1fr)]"
            : "lg:grid-cols-[280px_minmax(0,1fr)]"
        }`}
      >
        <SidebarNav
          activeView={activeView}
          setActiveView={setActiveView}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        <section className="min-w-0">
          <TopHeader
            activeView={activeView}
            query={query}
            setQuery={setQuery}
            setActiveView={setActiveView}
          />
          <div className="mx-auto max-w-[1540px] px-4 pb-10 pt-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <View activeView={activeView} query={query} setActiveView={setActiveView} />
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </main>
  );
}

function SidebarNav({
  activeView,
  setActiveView,
  collapsed,
  setCollapsed,
}: {
  activeView: ViewId;
  setActiveView: (view: ViewId) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}) {
  return (
    <aside
      className={`sticky top-0 z-30 hidden h-screen border-r border-border bg-background/80 backdrop-blur-xl transition-[padding] duration-300 lg:block ${
        collapsed ? "p-3" : "p-4"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className={`mb-7 flex gap-2 ${collapsed ? "flex-col" : "items-center"}`}>
          <button
            type="button"
            onClick={() => setActiveView("overview")}
            className={`flex min-w-0 items-center rounded-lg border border-cyan/30 bg-cyan/10 text-left transition ${
              collapsed ? "justify-center p-2.5" : "flex-1 gap-3 p-3"
            }`}
            title="CR-Sentinel"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cyan text-background shadow-cyan">
              <Radar className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="truncate font-display text-lg font-bold tracking-tight">
                  CR-Sentinel
                </div>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-cyan">
                  control center
                </div>
              </div>
            )}
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-surface text-muted-foreground transition hover:border-cyan hover:text-cyan"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item, index) => {
            const Icon = viewIcons[item.id];
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                title={item.label}
                className={`flex w-full items-center rounded-lg border text-left transition ${
                  collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5"
                }`}
                style={{
                  borderColor: active ? "var(--cyan)" : "transparent",
                  background: active ? "oklch(0.78 0.16 205 / 0.12)" : "transparent",
                  color: active ? "var(--foreground)" : "var(--muted-foreground)",
                }}
              >
                {!collapsed && (
                  <span className="mono w-5 text-[10px]">{String(index + 1).padStart(2, "0")}</span>
                )}
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div
          className={`mt-auto rounded-lg border border-border bg-surface/55 ${
            collapsed ? "p-3" : "p-4"
          }`}
        >
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {collapsed ? "demo" : "demo status"}
          </div>
          <div className={`mt-3 flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-magenta opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-magenta" />
            </span>
            {!collapsed && <span className="text-sm font-semibold">NO_GO_PENDING_RESCAN</span>}
          </div>
          {!collapsed && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Tag drift detected one hour before go-live.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

function TopHeader({
  activeView,
  query,
  setQuery,
  setActiveView,
}: {
  activeView: ViewId;
  query: string;
  setQuery: (query: string) => void;
  setActiveView: (view: ViewId) => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1540px] flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display text-xl font-bold tracking-tight lg:hidden">
              CR-Sentinel
            </span>
            <span className="rounded-full border border-purple/40 bg-purple/10 px-3 py-1 text-xs font-medium text-purple">
              Hackathon 2026 Solution Showcase
            </span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{viewTitles[activeView]}</div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative min-w-0 sm:w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search flow, agent, requirement..."
              className="h-10 w-full rounded-lg border border-border bg-surface/80 pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-cyan"
            />
          </label>
          <button
            type="button"
            onClick={() => setActiveView("demo")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan px-4 text-sm font-semibold text-background shadow-cyan"
          >
            <Play className="h-4 w-4" />
            Run Demo Flow
          </button>
          <button
            type="button"
            onClick={() => setActiveView("rubric")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-surface/80 px-4 text-sm font-semibold hover:border-purple hover:text-purple"
          >
            <BarChart3 className="h-4 w-4" />
            View Rubric Mapping
          </button>
        </div>
      </div>
    </header>
  );
}

function View({
  activeView,
  query,
  setActiveView,
}: {
  activeView: ViewId;
  query: string;
  setActiveView: (view: ViewId) => void;
}) {
  switch (activeView) {
    case "overview":
      return <Overview setActiveView={setActiveView} />;
    case "data-flow":
      return <DataFlow />;
    case "architecture":
      return <Architecture />;
    case "agents":
      return <Agents query={query} />;
    case "workspace":
      return <CodeWorkspace />;
    case "graph":
      return <KnowledgeGraph />;
    case "go-live":
      return <GoLiveGate />;
    case "learning":
      return <IncidentLearning />;
    case "rubric":
      return <RubricScorecard query={query} />;
    case "demo":
      return <DemoScenario />;
  }
}

function Overview({ setActiveView }: { setActiveView: (view: ViewId) => void }) {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-xl border border-border bg-surface/60 p-6 shadow-soft md:p-8">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan/10 blur-3xl" />
        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_430px]">
          <div>
            <div className="mono mb-4 inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-cyan">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Assisted Change Review & Go-Live Intelligence Platform
            </div>
            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              CR-Sentinel
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              AI-assisted CR review that detects hidden impact, missing verification, prod readiness
              gaps, and continuously learns from incidents.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/80">
              From fragmented CR input to evidence-backed GO / NO-GO decisions, ecosystem impact
              graph, and incident-driven skill learning.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveView("data-flow")}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan px-5 py-3 text-sm font-semibold text-background shadow-cyan"
              >
                Follow the Data Flow
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveView("rubric")}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/55 px-5 py-3 text-sm font-semibold hover:border-purple hover:text-purple"
              >
                Open Rubric Scorecard
              </button>
            </div>
          </div>
          <RiskScoreCard />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-5">
        {valueCards.map((value, index) => (
          <MetricCard key={value} label={value} value={`0${index + 1}`} tone={index} />
        ))}
      </section>

      <SectionShell
        eyebrow="60 second explanation"
        title="One review cockpit for fragmented evidence, hidden dependencies, deterministic gates, and governed learning."
      >
        <div className="flex gap-2 overflow-x-auto pb-2">
          {highLevelFlow.map((item, index) => (
            <div key={item} className="flex shrink-0 items-center gap-2">
              <div className="rounded-lg border border-border bg-surface/80 px-3 py-2">
                <div className="mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="mt-1 text-xs font-semibold">{item}</div>
              </div>
              {index < highLevelFlow.length - 1 && <ChevronRight className="h-4 w-4 text-cyan" />}
            </div>
          ))}
        </div>
      </SectionShell>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Why this matters" icon={AlertTriangle}>
          {[
            "CR descriptions are often incomplete",
            "Impacted systems are often hidden",
            "Non-prod success does not guarantee prod readiness",
            "Historical CR/incident knowledge is usually not reused",
            "CAB needs evidence, not just AI opinions",
          ].map((item) => (
            <Bullet key={item}>{item}</Bullet>
          ))}
        </Panel>
        <Panel title="Core architecture decisions" icon={Split}>
          {coreDecisions.map((item) => (
            <Bullet key={item}>{item}</Bullet>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function DataFlow() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Most important view"
        title="Trace every signal from CR input to final gate, graph enrichment, and incident learning."
        body="Click a step to highlight the relevant part of the flow. Click any node to open its purpose, inputs, outputs, key functions, rubric coverage, and example artifact."
      />
      <DataFlowReactFlow />
    </div>
  );
}

function Architecture() {
  const diagrams = [
    {
      id: "high-level",
      label: "High-Level Architecture",
      subtitle: "Six major capability columns plus end-to-end flow summary",
      src: "/architecture/high-level-architecture.png",
    },
    {
      id: "system",
      label: "System Architecture",
      subtitle: "Detailed AWS, LangGraph, code workspace, governance, and learning layers",
      src: "/architecture/system-architecture.png",
    },
  ];
  const [activeDiagram, setActiveDiagram] = useState(diagrams[0]);
  const layers = [
    [
      "Experience Layer",
      [
        "CR-Sentinel Portal",
        "Review Dashboard",
        "Chat / Q&A",
        "Rubric Scorecard",
        "Ecosystem Graph UI",
      ],
      LayoutDashboard,
    ],
    [
      "API & Orchestration Layer",
      [
        "API Gateway / Review API",
        "Step Functions Review Workflow",
        "EventBridge Scheduler",
        "Human Approval Workflow",
      ],
      Workflow,
    ],
    [
      "Domain Agent Layer",
      [
        "LangGraph Agent Harness",
        "Agent Skill Loader",
        "Agent Reasoning Runtime",
        "Tool Gateway",
        "Evidence Validator",
      ],
      Bot,
    ],
    [
      "Code Analysis Layer",
      [
        "ECS Fargate Code Workspace",
        "Claude Agent SDK",
        "CodeGraph",
        "Read-only MCP tools",
        "Workspace API",
      ],
      FileCode2,
    ],
    [
      "Knowledge Layer",
      [
        "Neo4j Knowledge Graph",
        "Historical CR Case Store",
        "Incident/PIR Knowledge",
        "Risk Pattern Library",
        "Skill Registry",
      ],
      Database,
    ],
    [
      "Decision & Governance Layer",
      [
        "Evaluation Aggregator",
        "Deterministic Risk Scoring Engine",
        "Graph Commit Workflow",
        "Pre-Go-Live Gate",
        "Audit / Observability",
      ],
      ShieldCheck,
    ],
  ] as const;

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Architecture"
        title="Clear responsibility boundaries: agents reason, tools provide evidence, rules decide gates, humans approve."
        body="The platform separates review orchestration, agent reasoning, code investigation, knowledge graph mutation, and governance decisions."
      />

      <section className="overflow-hidden rounded-xl border border-border bg-surface/65 shadow-soft">
        <div className="flex flex-col gap-4 border-b border-border bg-background/45 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.22em] text-cyan">
              architecture design
            </div>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              {activeDiagram.label}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{activeDiagram.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {diagrams.map((diagram) => (
              <button
                key={diagram.id}
                type="button"
                onClick={() => setActiveDiagram(diagram)}
                className="rounded-lg border px-3 py-2 text-sm font-semibold transition"
                style={{
                  borderColor: activeDiagram.id === diagram.id ? "var(--cyan)" : "var(--border)",
                  background:
                    activeDiagram.id === diagram.id
                      ? "oklch(0.78 0.16 205 / 0.12)"
                      : "var(--surface)",
                  color:
                    activeDiagram.id === diagram.id
                      ? "var(--foreground)"
                      : "var(--muted-foreground)",
                }}
              >
                {diagram.label}
              </button>
            ))}
            <a
              href={activeDiagram.src}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:border-purple hover:text-purple"
            >
              Open full size
            </a>
          </div>
        </div>

        <div className="bg-background/30 p-3">
          <div className="overflow-x-auto rounded-lg border border-cyan/25 bg-background/80">
            <img
              src={activeDiagram.src}
              alt={`CR-Sentinel ${activeDiagram.label}`}
              className="h-auto min-w-[980px] max-w-none rounded-lg xl:min-w-0 xl:w-full"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {layers.map(([title, items, Icon], index) => (
          <div key={title} className="rounded-xl border border-border bg-surface/70 p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-cyan/30 bg-cyan/10 text-cyan">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  layer {index + 1}
                </div>
                <h3 className="font-display text-lg font-semibold">{title}</h3>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {items.map((item) => (
                <Bullet key={item}>{item}</Bullet>
              ))}
            </div>
          </div>
        ))}
      </section>

      <SectionShell
        eyebrow="Primary flows"
        title="Portal to decision, graph commit, and incident learning"
      >
        <div className="grid gap-3 md:grid-cols-3">
          <FlowStrip
            items={[
              "Portal",
              "Review API",
              "Step Functions",
              "Domain Agents",
              "Risk Engine",
              "Portal",
            ]}
            color="var(--cyan)"
          />
          <FlowStrip
            items={["Dependency Agent", "Graph Candidate Store", "Graph Commit", "Neo4j"]}
            color="var(--green)"
          />
          <FlowStrip
            items={["Incident Learning", "Skill Registry", "Agent Harness"]}
            color="var(--purple)"
          />
        </div>
      </SectionShell>

      <Panel title="Responsibility boundary" icon={Lock}>
        {[
          "Agents reason and recommend",
          "Tools provide evidence",
          "Risk Engine decides gates",
          "Humans approve CAB decisions",
          "Graph Commit Workflow writes shared knowledge",
          "Code Workspace never changes code",
        ].map((item) => (
          <Bullet key={item}>{item}</Bullet>
        ))}
      </Panel>
    </div>
  );
}

function Agents({ query }: { query: string }) {
  const filteredAgents = agents.filter((agent) =>
    `${agent.name} ${agent.functions.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="LangGraph Domain Agents"
        title="Reasoning specialists with skill loading, schema validation, and evidence-first outputs."
        body="Every agent can reason, every finding must cite evidence, and agents cannot directly decide GO/NO-GO, write Neo4j, or access source code without the controlled tool gateway."
      />

      <SectionShell eyebrow="Mini flow" title="How each domain agent works">
        <FlowStrip
          color="var(--purple)"
          items={[
            "Load CR Context",
            "Load Active Skills",
            "Retrieve Historical Cases",
            "Query Neo4j",
            "Call Code Workspace if needed",
            "Reason Over Evidence",
            "Produce Findings",
            "Validate Schema",
            "Store Audit",
          ]}
        />
      </SectionShell>

      <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {filteredAgents.map((agent, index) => (
          <div key={agent.name} className="rounded-xl border border-border bg-surface/70 p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-purple/40 bg-purple/10 text-purple">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  agent {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-lg font-semibold">{agent.name}</h3>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {agent.functions.map((item) => (
                <Bullet key={item}>{item}</Bullet>
              ))}
            </div>
          </div>
        ))}
      </section>

      <Panel title="Reasoning policy" icon={ShieldCheck}>
        {[
          "Every agent can reason",
          "Every finding must cite evidence",
          "Every output must match JSON schema",
          "Agents cannot directly decide GO/NO-GO",
          "Agents cannot directly write Neo4j shared graph",
          "Agents cannot directly access GitLab or source code",
        ].map((item) => (
          <Bullet key={item}>{item}</Bullet>
        ))}
      </Panel>
    </div>
  );
}

function CodeWorkspace() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Claude Agent SDK Code Workspace"
        title="A narrow read-only source-code investigation backend, not a general coding agent."
        body="Claude Agent SDK is used only inside an isolated ECS Fargate workspace. Domain agents ask for structured code evidence through the Code Tool Gateway."
      />

      <SectionShell eyebrow="Architecture" title="Domain Agent to structured code evidence">
        <FlowStrip
          color="var(--blue)"
          items={[
            "Domain Agent",
            "Code Tool Gateway",
            "Workspace API",
            "Claude Agent SDK",
            "CodeGraph / Repo Snapshot",
            "Structured Code Evidence",
          ]}
        />
      </SectionShell>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_420px]">
        <Panel title="Workspace properties" icon={Server}>
          {[
            "ECS Fargate per review",
            "Read-only GitLab token",
            "Checkout exact SHA/tag",
            "Build diff summary and CodeGraph",
            "Run Claude Agent SDK query() per analysis request",
            "Use read-only tools only",
            "Return JSON schema output",
            "No code modification, git push, deploy permission, or production secret value access",
          ].map((item) => (
            <Bullet key={item}>{item}</Bullet>
          ))}
        </Panel>
        <div className="rounded-xl border border-blue/35 bg-blue/10 p-5">
          <div className="flex items-center gap-3">
            <Cpu className="h-5 w-5 text-blue" />
            <h3 className="font-display text-lg font-semibold">Why Claude Agent SDK here?</h3>
          </div>
          <div className="mt-4 space-y-2">
            {[
              "Strong source-code reasoning",
              "Structured output",
              "MCP/custom tools",
              "Hooks and permission controls",
              "Good fit for narrow read-only code investigation",
            ].map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface/70">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-background/50 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Endpoint</th>
              <th className="px-4 py-3">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {workspaceEndpoints.map(([endpoint, purpose]) => (
              <tr key={endpoint} className="border-t border-border">
                <td className="mono px-4 py-3 text-blue">{endpoint}</td>
                <td className="px-4 py-3 text-foreground/85">{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ArtifactCard
          title="Sample request"
          content={`{
  "analysis_type": "event_dependency",
  "question": "Find Kafka topics produced or consumed by changed code",
  "changed_files_only": true
}`}
        />
        <ArtifactCard
          title="Sample response"
          content={`{
  "status": "ok",
  "summary": "payment-service publishes payment.authorized event consumed by ledger-service",
  "evidence": ["src/payments/Publisher.ts:84", "neo4j://topic/payment.authorized"]
}`}
        />
      </div>
    </div>
  );
}

function KnowledgeGraph() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Neo4j Enterprise Ecosystem Knowledge Graph"
        title="Shared enterprise memory for services, topics, CRs, incidents, and risk patterns."
        body="Graph updates are not committed immediately after review. Candidate edges wait for pre-go-live validation, CR DONE status, and human governance."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_420px]">
        <KnowledgeGraphFlow />

        <Panel title="Graph lifecycle" icon={Database}>
          {graphLifecycle.map((item, index) => (
            <div key={item} className="flex gap-3">
              <span className="mono grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green text-[10px] font-bold text-background">
                {index + 1}
              </span>
              <span className="text-sm leading-relaxed text-foreground/85">{item}</span>
            </div>
          ))}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <InfoTile label="Declared impact" value="payment-service" color="var(--magenta)" />
        <InfoTile
          label="Discovered impact"
          value="ledger-service, notification-service, fraud-monitoring"
          color="var(--orange)"
        />
        <InfoTile
          label="New candidate edge"
          value="fraud-monitoring consumes payment.authorized"
          color="var(--cyan)"
        />
      </div>
    </div>
  );
}

function GoLiveGate() {
  const states = [
    "READY_FOR_GOLIVE",
    "GO_WITH_WARNINGS",
    "NEEDS_RESCAN",
    "NO_GO_PENDING_RESCAN",
    "HOLD_INSUFFICIENT_INFORMATION",
  ];

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Pre-Go-Live Validation: T-1h Safety Gate"
        title="A review passed on Wednesday is not automatically safe for a Saturday release."
        body="CR-Sentinel schedules validation one hour before go-live to detect moved tags, changed image digests, expanded release scope, and production readiness gaps."
      />

      <SectionShell eyebrow="Timeline" title="Wednesday passed, Saturday blocked">
        <FlowStrip
          color="var(--orange)"
          items={[
            "Wednesday Review Passed",
            "Friday GitLab Tag Updated",
            "Saturday T-1h Validation",
            "Drift Detected",
            "NO_GO_PENDING_RESCAN",
          ]}
        />
      </SectionShell>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Panel title="Checks performed" icon={ClipboardCheck}>
          {goLiveChecks.map((item) => (
            <Bullet key={item}>{item}</Bullet>
          ))}
        </Panel>
        <div className="rounded-xl border border-magenta/40 bg-magenta/10 p-5">
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-magenta">
            sample failed validation
          </div>
          <p className="mt-3 text-lg font-semibold leading-relaxed">
            GitLab tag payment-service-v1.2.3 moved from abc123 to xyz789 after review.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Re-scan required before go-live.</p>
          <DecisionBadge label="NO_GO_PENDING_RESCAN" tone="danger" />
        </div>
      </div>

      <section className="grid gap-3 md:grid-cols-5">
        {states.map((state, index) => (
          <InfoTile
            key={state}
            label={`state ${index + 1}`}
            value={state}
            color={index < 2 ? "var(--green)" : index === 2 ? "var(--orange)" : "var(--magenta)"}
          />
        ))}
      </section>
    </div>
  );
}

function IncidentLearning() {
  const lifecycle = ["CANDIDATE", "EVALUATING", "SHADOW", "APPROVED", "ACTIVE", "RETIRED"];

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Incident-to-Skill Learning Loop"
        title="CR-Sentinel learns safely; it does not self-mutate production agents."
        body="Incidents become candidate skills only after missed-risk analysis, historical evaluation, and human approval."
      />

      <SectionShell eyebrow="Governed loop" title="Incident/PIR to future agent behavior">
        <FlowStrip
          color="var(--purple)"
          items={[
            "Incident/PIR",
            "Map to CR",
            "Missed Risk Analysis",
            "Risk Pattern Candidate",
            "Skill Proposal",
            "Historical Evaluation",
            "Human Approval",
            "Active Skill Version",
            "Future Agent Runs",
          ]}
        />
      </SectionShell>

      <div className="grid gap-4 lg:grid-cols-6">
        {lifecycle.map((state, index) => (
          <div key={state} className="rounded-xl border border-border bg-surface/70 p-4">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              stage {index + 1}
            </div>
            <div className="mt-2 font-semibold text-purple">{state}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Example skill" icon={Sparkles}>
          <InfoTile
            label="Name"
            value="Downstream Feature Flag Readiness Check"
            color="var(--purple)"
          />
          <InfoTile label="Created from" value="INC-2026-009" color="var(--magenta)" />
          <InfoTile
            label="Target agent"
            value="Rollout / Rollback & Environment Readiness Agent"
            color="var(--orange)"
          />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            If a CR impacts a downstream system and UAT evidence mentions a feature flag, verify
            that the same flag exists and is correctly set in production for both source and
            downstream systems.
          </p>
        </Panel>
        <Panel title="Governance note" icon={UserCheck}>
          {[
            "No skill goes live without evaluation",
            "No skill goes live without human approval",
            "Every review records agent version and skill version",
            "Skills can be rolled back",
          ].map((item) => (
            <Bullet key={item}>{item}</Bullet>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function RubricScorecard({ query }: { query: string }) {
  const filteredRows = rubricRows.filter((row) =>
    row.join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  const radarData = scoringCriteria.map(([criterion, weight]) => ({
    criterion: criterion.replace(" ", "\n"),
    score: weight,
    fullMark: 25,
  }));
  const barData = scoringCriteria.map(([criterion, weight]) => ({
    name: criterion.split(" ")[0],
    weight,
  }));

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Hackathon rubric mapping"
        title="Every requirement maps to a concrete CR-Sentinel function, component, and demo artifact."
        body="The scorecard is built for judges: requirement, implementation function, components involved, evidence in demo, and coverage level."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <InfoTile label="Requirement Coverage" value="10/10 strong" color="var(--green)" />
        <InfoTile label="Solution Completeness" value="High" color="var(--cyan)" />
        <InfoTile
          label="Innovation / Feasibility"
          value="High with scoped MVP"
          color="var(--purple)"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="overflow-hidden rounded-xl border border-border bg-surface/70">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-background/55 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                {[
                  "ID",
                  "Requirement",
                  "CR-Sentinel Function",
                  "Components Involved",
                  "Evidence in Demo",
                  "Coverage",
                ].map((head) => (
                  <th key={head} className="px-4 py-3">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row[0]} className="border-t border-border align-top">
                  {row.map((cell, index) => (
                    <td
                      key={`${row[0]}-${index}`}
                      className={
                        index === 0 ? "mono px-4 py-3 text-cyan" : "px-4 py-3 text-foreground/85"
                      }
                    >
                      {index === 5 ? <CoverageBadge label={cell} /> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <ChartPanel title="Scoring Weight">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                />
                <Bar dataKey="weight" fill="var(--cyan)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
          <ChartPanel title="Coverage Shape">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="criterion"
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                />
                <PolarRadiusAxis stroke="var(--border)" fontSize={9} />
                <RadarShape
                  dataKey="score"
                  stroke="var(--purple)"
                  fill="var(--purple)"
                  fillOpacity={0.28}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        {scoringCriteria.map(([criterion, weight, points]) => (
          <div key={criterion} className="rounded-xl border border-border bg-surface/70 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-semibold">{criterion}</h3>
              <span className="rounded-full border border-cyan/35 bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan">
                {weight}%
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {points.map((point) => (
                <Bullet key={point}>{point}</Bullet>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function DemoScenario() {
  const [activeStep, setActiveStep] = useState(0);
  const step = demoSteps[activeStep];

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Interactive demo story"
        title="CR-2026-001: Payment Authorization Change"
        body="Declared impact is payment-service only. CR-Sentinel discovers ledger-service, notification-service, and fraud-monitoring, then blocks go-live when a tag drifts."
      />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-xl border border-border bg-surface/70 p-4">
          <div className="mono mb-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            animated progress
          </div>
          <div className="space-y-2">
            {demoSteps.map(([title], index) => (
              <button
                key={title}
                type="button"
                onClick={() => setActiveStep(index)}
                className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition"
                style={{
                  borderColor: index === activeStep ? "var(--cyan)" : "var(--border)",
                  background: index === activeStep ? "oklch(0.78 0.16 205 / 0.12)" : "transparent",
                }}
              >
                <span className="mono grid h-7 w-7 shrink-0 place-items-center rounded-full bg-background text-[10px]">
                  {index + 1}
                </span>
                <span className="text-xs font-semibold">{title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface/70 p-6">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              step {activeStep + 1}
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold">{step[0]}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InfoTile label="Input" value={step[1]} color="var(--cyan)" />
              <InfoTile label="Processing / Output" value={step[2]} color="var(--purple)" />
              <InfoTile label="Evidence" value={step[3]} color="var(--orange)" />
              <InfoTile label="Rubric covered" value={step[4]} color="var(--green)" />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Show data artifacts",
                "Show impacted systems graph",
                "Show risk reasoning",
                "Show rubric coverage for this step",
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-lg border border-border bg-background/55 px-3 py-2 text-xs font-semibold hover:border-cyan hover:text-cyan"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <DecisionBadge label="Initial: NO_GO" tone="danger" />
            <DecisionBadge label="After fix: GO_WITH_WARNINGS" tone="warn" />
            <DecisionBadge label="T-1h: NO_GO_PENDING_RESCAN" tone="danger" />
          </div>

          <section className="grid gap-4 lg:grid-cols-2">
            {findings.map((finding) => (
              <FindingCard key={finding.category} finding={finding} />
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

function PageIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="rounded-xl border border-border bg-surface/60 p-6 shadow-soft">
      <div className="mono text-[10px] uppercase tracking-[0.24em] text-cyan">{eyebrow}</div>
      <h1 className="mt-3 max-w-5xl font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">
        {body}
      </p>
    </section>
  );
}

function SectionShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface/60 p-5">
      <div className="mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {eyebrow}
      </div>
      <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface/65 p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg border border-cyan/30 bg-cyan/10 text-cyan">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-display text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-4 space-y-2">{children}</div>
    </section>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone: number }) {
  const colors = ["var(--cyan)", "var(--blue)", "var(--purple)", "var(--magenta)", "var(--green)"];
  const color = colors[tone % colors.length];
  return (
    <div className="rounded-xl border border-border bg-surface/70 p-4">
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {value}
      </div>
      <div
        className="mt-3 h-1 w-10 rounded-full"
        style={{ background: color, boxShadow: `0 0 14px ${color}` }}
      />
      <div className="mt-4 text-sm font-semibold leading-snug">{label}</div>
    </div>
  );
}

function RiskScoreCard() {
  return (
    <div className="rounded-xl border border-cyan/30 bg-background/70 p-5 shadow-cyan">
      <div className="flex items-center justify-between">
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            current demo decision
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-magenta">NO_GO</div>
        </div>
        <Gauge className="h-10 w-10 text-magenta" />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <InfoTile label="Risk score" value="91/100" color="var(--magenta)" />
        <InfoTile label="Evidence" value="27 citations" color="var(--cyan)" />
        <InfoTile label="Coverage" value="10/10" color="var(--green)" />
      </div>
      <div className="mt-5 space-y-2">
        {findings.slice(0, 3).map((finding) => (
          <FindingCard key={finding.category} finding={finding} compact />
        ))}
      </div>
    </div>
  );
}

function FindingCard({
  finding,
  compact = false,
}: {
  finding: { severity: string; category: string; text: string };
  compact?: boolean;
}) {
  const color =
    finding.severity === "CRITICAL"
      ? "var(--magenta)"
      : finding.severity === "HIGH"
        ? "var(--orange)"
        : finding.severity === "MEDIUM"
          ? "var(--purple)"
          : "var(--cyan)";
  return (
    <div className="rounded-lg border bg-background/45 p-3" style={{ borderColor: `${color}66` }}>
      <div className="flex items-center gap-2">
        <span
          className="mono rounded px-2 py-0.5 text-[10px] font-bold"
          style={{ background: `${color}20`, color }}
        >
          {finding.severity}
        </span>
        <span className="text-sm font-semibold">{finding.category}</span>
      </div>
      {!compact && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{finding.text}</p>
      )}
      {compact && <p className="mt-1 truncate text-xs text-muted-foreground">{finding.text}</p>}
    </div>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 text-sm leading-relaxed text-foreground/85">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green" />
      <span>{children}</span>
    </div>
  );
}

function FlowStrip({ items, color }: { items: string[]; color: string }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="flex shrink-0 items-center gap-2">
          <div
            className="rounded-lg border bg-background/55 px-3 py-2"
            style={{ borderColor: `${color}66` }}
          >
            <div className="text-xs font-semibold">{item}</div>
          </div>
          {index < items.length - 1 && <ArrowRight className="h-4 w-4" style={{ color }} />}
        </div>
      ))}
    </div>
  );
}

function InfoTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/45 p-3">
      <div className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold leading-snug" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function ArtifactCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface/70 p-5">
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-blue">{title}</div>
      <pre className="mono mt-3 overflow-x-auto rounded-lg border border-border bg-background/70 p-4 text-xs leading-relaxed text-foreground/85">
        {content}
      </pre>
    </div>
  );
}

function CoverageBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-green/40 bg-green/10 px-2.5 py-1 text-xs font-semibold text-green">
      {label}
    </span>
  );
}

function DecisionBadge({ label, tone }: { label: string; tone: "danger" | "warn" }) {
  const color = tone === "danger" ? "var(--magenta)" : "var(--orange)";
  return (
    <div
      className="rounded-xl border bg-background/55 p-4 text-center"
      style={{ borderColor: `${color}66` }}
    >
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        decision
      </div>
      <div className="mt-2 text-sm font-bold" style={{ color }}>
        {label}
      </div>
    </div>
  );
}

function ChartPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface/70 p-4">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
