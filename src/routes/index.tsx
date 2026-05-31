import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  GitBranch, FileText, Network, Bot, ShieldCheck, Boxes, Workflow, Server,
  Search, AlertTriangle, Radio, History, Rocket, Lock, Activity, Database,
  Zap, ArrowRight, CheckCircle2, Sparkles, Activity as Pulse,
} from "lucide-react";
import { DataFlowSimulator } from "@/components/DataFlowSimulator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solution Tour — AI CR Review Platform" },
      { name: "description", content: "Một chuyến tham quan trực quan qua hệ thống AI-assisted Change Request Review: từ một link Confluence đến quyết định rủi ro có bằng chứng." },
      { property: "og:title", content: "Solution Tour — AI CR Review Platform" },
      { property: "og:description", content: "Khám phá cách 1 CR = 1 Code Workspace giúp AI agents review code thông minh, an toàn và có audit." },
    ],
  }),
  component: SolutionTour,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

function SolutionTour() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />
      <Hero />
      <Problem />
      <BigIdea />
      <Journey />
      <Simulation />
      <Agents />
      <Evidence />
      <Why />
      <Footer />
    </main>
  );
}

/* ---------------- NAV ---------------- */
function Nav() {
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-md" style={{ background: "var(--grad-cool)" }}>
            <Sparkles className="h-4 w-4 text-background" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">CR.Review<span className="text-primary">/AI</span></span>
        </div>
        <nav className="hidden gap-7 text-sm text-muted-foreground md:flex">
          <a href="#problem" className="hover:text-foreground">Vấn đề</a>
          <a href="#idea" className="hover:text-foreground">Ý tưởng</a>
          <a href="#journey" className="hover:text-foreground">Hành trình</a>
          <a href="#simulation" className="hover:text-foreground">Mô phỏng</a>
          <a href="#agents" className="hover:text-foreground">Agents</a>
          <a href="#why" className="hover:text-foreground">Vì sao</a>
        </nav>
        <a href="#journey" className="rounded-md border border-border px-3.5 py-1.5 text-sm font-medium transition hover:border-primary hover:text-primary">
          Bắt đầu tour →
        </a>
      </div>
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, oklch(0.78 0.18 200 / 0.15), transparent 60%)" }} />
      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32 md:pt-32 md:pb-40">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3.5 py-1.5 text-xs text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            AI-Assisted Change Request Review · powered by Claude Code runtime
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Từ một link Confluence{" "}
            <span className="text-gradient">đến quyết định rủi ro</span>
            <br className="hidden md:block" /> có bằng chứng.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Mỗi Change Request được phân tích bởi một <span className="text-foreground">workspace AI riêng</span> trên AWS Fargate.
            Code được index một lần, hàng loạt domain agents truy vấn song song, mọi tool call đều có audit trail.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="#journey" className="group inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-primary-foreground" style={{ background: "var(--grad-cool)", boxShadow: "var(--shadow-glow)" }}>
              Xem hệ thống vận hành <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a href="#idea" className="rounded-md border border-border bg-surface/40 px-5 py-3 text-sm font-medium hover:border-primary/60">
              Triết lý thiết kế
            </a>
          </div>
        </motion.div>

        {/* Hero schematic */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="glass rounded-2xl p-1.5 shadow-soft" style={{ boxShadow: "var(--shadow-soft), var(--shadow-glow)" }}>
            <div className="rounded-xl border border-border bg-background/60 p-8">
              <HeroDiagram />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroDiagram() {
  const nodes = [
    { label: "Confluence CR", icon: FileText, color: "var(--cyan)" },
    { label: "Resolve Intent", icon: Workflow, color: "var(--violet)" },
    { label: "Code Workspace", icon: Server, color: "var(--lime)" },
    { label: "Domain Agents", icon: Bot, color: "var(--amber)" },
    { label: "Risk Decision", icon: ShieldCheck, color: "var(--rose)" },
  ];
  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-2">
      {nodes.map((n, i) => (
        <div key={n.label} className="flex flex-1 items-center gap-2 md:flex-col md:gap-3">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.12, type: "spring", stiffness: 200 }}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-border bg-surface"
            style={{ boxShadow: `inset 0 0 0 1px ${n.color}33, 0 8px 24px -8px ${n.color}55` }}
          >
            <n.icon className="h-6 w-6" style={{ color: n.color }} />
          </motion.div>
          <div className="text-xs font-medium text-muted-foreground md:text-center">{n.label}</div>
          {i < nodes.length - 1 && (
            <div className="hidden flex-1 md:block">
              <svg className="w-full" height="2" viewBox="0 0 100 2" preserveAspectRatio="none">
                <line x1="0" y1="1" x2="100" y2="1" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" style={{ animation: "dash 1.2s linear infinite" }} />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------- PROBLEM ---------------- */
function Problem() {
  const pains = [
    { icon: Search, title: "Reviewer bỏ sót impact ẩn", text: "Một MR có thể đụng vào event consumer, contract DB hay flag rollout mà không ai để ý." },
    { icon: AlertTriangle, title: "AI nhận định chung chung", text: "Câu trả lời 'có vẻ ổn' không đủ. Cần bằng chứng từ chính dòng code, file, commit." },
    { icon: Lock, title: "Clone & index lặp lại tốn kém", text: "Mỗi agent tự pull repo, tự build index. Latency cao, chi phí cao, không audit được." },
  ];
  return (
    <section id="problem" className="relative border-y border-border bg-surface/30 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="max-w-3xl">
          <div className="mono mb-4 text-xs uppercase tracking-[0.2em] text-primary">01 — Vấn đề</div>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Review CR thủ công đang <span className="text-gradient">vỡ trận</span> vì quy mô và tốc độ release.
          </h2>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Một CR có thể chứa nhiều GitLab MR, nhiều image tag, nhiều rủi ro chéo giữa các service. Con người không scale kịp,
            còn AI generic thì thiếu bằng chứng để tin được.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pains.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group rounded-xl border border-border bg-surface p-6 transition hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-lg bg-background text-primary">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- BIG IDEA ---------------- */
function BigIdea() {
  return (
    <section id="idea" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <div className="mono mb-4 text-xs uppercase tracking-[0.2em] text-primary">02 — Ý tưởng cốt lõi</div>
            <h2 className="text-4xl font-bold leading-tight md:text-5xl">
              Một dòng nguyên tắc <br />
              <span className="text-gradient">thay đổi toàn bộ kiến trúc.</span>
            </h2>
            <p className="mt-6 text-muted-foreground">
              Thay vì để mỗi agent tự clone repo và tự build index, hệ thống dựng
              <span className="text-foreground"> một workspace AI sống lâu </span>
              cho từng CR. Code được checkout đúng SHA, CodeGraph index build một lần,
              Claude Code runtime sẵn sàng. Các agent chỉ <span className="text-foreground">hỏi</span> qua một gateway.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Reuse code knowledge giữa nhiều agents",
                "Audit trail từng tool call vào S3",
                "Read-only boundary — không có quyền merge / deploy",
                "Cleanup tự động khi workflow kết thúc",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-foreground/90">{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="glass relative overflow-hidden rounded-2xl p-8" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full" style={{ background: "var(--grad-cool)", filter: "blur(60px)", opacity: 0.3 }} />
              <div className="mono text-xs text-muted-foreground">// principle.txt</div>
              <div className="mt-4 font-display text-3xl font-semibold leading-tight md:text-4xl">
                <span className="text-primary">1 CR</span>
                <span className="text-muted-foreground"> = </span>
                <span className="text-accent">1 Long-running</span><br />
                <span>Code Workspace Session</span><br />
                <span className="text-muted-foreground">on </span><span className="text-foreground">AWS Fargate</span>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 text-xs">
                {[
                  { k: "Checkout", v: "exact SHA" },
                  { k: "Index", v: "CodeGraph MCP" },
                  { k: "Runtime", v: "Claude Code SDK" },
                  { k: "Boundary", v: "Read-only" },
                ].map((x) => (
                  <div key={x.k} className="rounded-lg border border-border bg-background/40 p-3">
                    <div className="mono text-[10px] uppercase tracking-wider text-muted-foreground">{x.k}</div>
                    <div className="mt-1 font-medium">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- JOURNEY ---------------- */
function Journey() {
  const steps = [
    {
      n: "01", title: "Submit CR", icon: FileText, color: "var(--cyan)",
      desc: "Người dùng paste một link Confluence CR. Step Functions kích hoạt workflow review.",
      tags: ["Confluence", "Jira", "GitLab", "Step Functions"],
    },
    {
      n: "02", title: "Resolve Intent", icon: Workflow, color: "var(--violet)",
      desc: "CR Intent Agent phân tích document, resolve danh sách MR, image tag, commit SHA, repo liên quan và sinh ra Review Manifest.",
      tags: ["MCP", "review_manifest.json", "MR list", "Image tags"],
    },
    {
      n: "03", title: "Start Workspace", icon: Server, color: "var(--lime)",
      desc: "Một Fargate task khởi tạo: pull repos, checkout SHA, generate diff, build CodeGraph index, khởi động Claude Code runtime — đến khi READY.",
      tags: ["Fargate", "CodeGraph", "MCP Gateway", "READY"],
    },
    {
      n: "04", title: "Analyze in Parallel", icon: Network, color: "var(--amber)",
      desc: "Code Tool Gateway (Lambda) forward mọi truy vấn của agent tới workspace. Mọi request/response được lưu vào S3 để audit.",
      tags: ["Lambda", "Audit S3", "Tool routing"],
    },
    {
      n: "05", title: "Domain Agents", icon: Bot, color: "var(--rose)",
      desc: "Bảy domain agents chạy song song: Hidden Impact, Verification Gap, Security, Kafka, Non-prod vs Prod, Rollout, Historical Incident.",
      tags: ["7 Agents", "Parallel", "Evidence-based"],
    },
    {
      n: "06", title: "Decide & Publish", icon: ShieldCheck, color: "var(--cyan)",
      desc: "Risk Decision Engine tổng hợp findings, publish final report có bằng chứng, gửi thông báo và stop workspace.",
      tags: ["Risk score", "Report", "Slack / Email", "Cleanup"],
    },
  ];

  return (
    <section id="journey" className="relative border-t border-border py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl">
          <div className="mono mb-4 text-xs uppercase tracking-[0.2em] text-primary">03 — Hành trình của một CR</div>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Sáu chặng. <span className="text-gradient">Từ link đến quyết định.</span>
          </h2>
        </motion.div>

        <div className="relative mt-16">
          <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-accent/40 to-transparent md:left-1/2 md:-translate-x-1/2" />

          <ol className="space-y-12 md:space-y-16">
            {steps.map((s, i) => {
              const right = i % 2 === 1;
              const Icon = s.icon;
              return (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  className="relative md:grid md:grid-cols-2 md:gap-16"
                >
                  <div
                    className="absolute left-0 top-1 z-10 grid h-14 w-14 place-items-center rounded-xl border border-border bg-surface md:left-1/2 md:-translate-x-1/2"
                    style={{ boxShadow: `0 0 0 4px var(--background), 0 0 24px -4px ${s.color}99` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: s.color }} />
                  </div>
                  <div className={`pl-20 md:pl-0 ${right ? "md:col-start-2 md:pl-12" : "md:pr-12"}`}>
                    <StepCard step={s} />
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step }: { step: { n: string; title: string; desc: string; tags: string[]; color: string } }) {
  return (
    <div className="glass rounded-2xl border border-border p-7 text-left transition hover:border-primary/40" style={{ boxShadow: "var(--shadow-soft)" }}>
      <div className="flex items-center gap-3">
        <span className="mono text-xs tracking-widest text-muted-foreground">STEP {step.n}</span>
        <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${step.color}88, transparent)` }} />
      </div>
      <h3 className="mt-3 text-2xl font-semibold">{step.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {step.tags.map((t) => (
          <span key={t} className="mono rounded-md border border-border bg-background/60 px-2 py-1 text-[10.5px] text-foreground/80">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- SIMULATION ---------------- */
function Simulation() {
  return (
    <section id="simulation" className="relative border-t border-border py-28 md:py-36">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl">
          <div className="mono mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
            <Pulse className="h-3.5 w-3.5" /> 04 — Mô phỏng luồng data
          </div>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Xem từng <span className="text-gradient">packet</span> di chuyển qua hệ thống — theo thời gian thực.
          </h2>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Bấm play để theo dõi một CR thật sự được orchestrate: từ Confluence link, qua Step Functions, dựng workspace trên Fargate,
            phát fan-out cho 7 domain agents, và mọi tool call đều được audit vào S3 với evidence rõ ràng.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-12"
        >
          <DataFlowSimulator />
        </motion.div>

        <div className="mono mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
          <LegendDot color="var(--cyan)" label="ingress / state" />
          <LegendDot color="var(--violet)" label="orchestration" />
          <LegendDot color="var(--lime)" label="workspace" />
          <LegendDot color="var(--primary)" label="gateway" />
          <LegendDot color="var(--amber)" label="agent query" />
          <LegendDot color="var(--rose)" label="decision" />
        </div>
      </div>
    </section>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      {label}
    </span>
  );
}

/* ---------------- AGENTS ---------------- */
function Agents() {
  const agents = [
    { icon: AlertTriangle, name: "Hidden Impact", desc: "Tìm những module bị ảnh hưởng gián tiếp, không có trong diff.", color: "var(--amber)" },
    { icon: CheckCircle2, name: "Verification Gap", desc: "Đối chiếu test coverage với phạm vi thay đổi thực tế.", color: "var(--lime)" },
    { icon: Lock, name: "Security & PII", desc: "Phát hiện secret leak, log PII, IAM/scope mở quá rộng.", color: "var(--rose)" },
    { icon: Radio, name: "Kafka / Event", desc: "Kiểm tra breaking change ở event schema và consumer.", color: "var(--violet)" },
    { icon: GitBranch, name: "Non-prod vs Prod", desc: "So sánh config, flag, image tag giữa các môi trường.", color: "var(--cyan)" },
    { icon: Rocket, name: "Rollout / Runbook", desc: "Đánh giá rollout plan, rollback và readiness gates.", color: "var(--primary)" },
    { icon: History, name: "Historical Incident", desc: "Đối chiếu thay đổi với incident & post-mortem trước đây.", color: "var(--accent)" },
  ];

  return (
    <section id="agents" className="relative border-t border-border bg-surface/30 py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl">
          <div className="mono mb-4 text-xs uppercase tracking-[0.2em] text-primary">04 — Đội hình AI</div>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Bảy domain agent <span className="text-gradient">chạy song song</span>, mỗi agent một góc nhìn rủi ro.
          </h2>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Không có agent nào clone repo. Tất cả đều hỏi qua Code Tool Gateway — đảm bảo audit, an toàn và nhất quán bằng chứng.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
              className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 transition hover:-translate-y-1"
            >
              <div
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition group-hover:opacity-30"
                style={{ background: a.color, filter: "blur(40px)" }}
              />
              <div className="relative">
                <div className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-background" style={{ color: a.color }}>
                  <a.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold">{a.name}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{a.desc}</p>
                <div className="mono mt-4 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color, animation: "pulse-dot 1.8s ease-in-out infinite" }} />
                  ready · parallel
                </div>
              </div>
            </motion.div>
          ))}
          {/* gateway emphasis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 7 * 0.05, duration: 0.45 }}
            className="relative overflow-hidden rounded-xl border p-6 sm:col-span-2 lg:col-span-1"
            style={{ borderColor: "transparent", background: "var(--grad-cool)" }}
          >
            <Zap className="h-5 w-5 text-background" />
            <h3 className="mt-5 font-display text-base font-semibold text-background">Code Tool Gateway</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-background/80">
              Boundary duy nhất giữa agent và workspace. Mọi tool call được route, enforce policy, và lưu vào S3.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- EVIDENCE / DATA LAYER ---------------- */
function Evidence() {
  const items = [
    { icon: Database, t: "DynamoDB", s: "Workspace registry & state" },
    { icon: Boxes, t: "S3", s: "Manifest, diff, audit logs" },
    { icon: Lock, t: "Secrets Manager", s: "GitLab tokens, API keys" },
    { icon: Activity, t: "CloudWatch", s: "Logs, metrics, observability" },
  ];
  return (
    <section className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl">
          <div className="mono mb-4 text-xs uppercase tracking-[0.2em] text-primary">05 — Tin được vì có bằng chứng</div>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Mỗi finding gắn với <span className="text-gradient">file, dòng code, commit</span> cụ thể.
          </h2>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Data & state layer được thiết kế để mọi quyết định AI đều có thể truy ngược: ai hỏi gì, workspace trả lời thế nào, bằng chứng nằm ở đâu.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((x, i) => (
            <motion.div
              key={x.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <x.icon className="h-5 w-5 text-primary" />
              <div className="mt-4 font-display font-semibold">{x.t}</div>
              <div className="mt-1 text-xs text-muted-foreground">{x.s}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHY ---------------- */
function Why() {
  const metrics = [
    { v: "1", l: "workspace mỗi CR", sub: "code & index reuse" },
    { v: "7", l: "domain agents song song", sub: "không clone repo" },
    { v: "100%", l: "tool call có audit", sub: "lưu vào S3" },
    { v: "0", l: "quyền merge / deploy", sub: "read-only boundary" },
  ];
  return (
    <section id="why" className="relative border-t border-border py-28 md:py-36">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <div className="mono mb-4 text-xs uppercase tracking-[0.2em] text-primary">06 — Vì sao quan trọng</div>
          <h2 className="text-4xl font-bold leading-tight md:text-6xl">
            Release nhanh hơn,<br /><span className="text-gradient">tự tin hơn</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Không thay thế con người — mà cho con người một AI reviewer đáng tin: nhanh, có bằng chứng, có audit, có boundary.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.l}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-7 text-center"
            >
              <div className="font-display text-5xl font-bold text-gradient md:text-6xl">{m.v}</div>
              <div className="mt-2 text-sm font-medium">{m.l}</div>
              <div className="mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{m.sub}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center gap-4 text-center">
          <a href="#journey" className="group inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-sm font-semibold text-primary-foreground" style={{ background: "var(--grad-cool)", boxShadow: "var(--shadow-glow)" }}>
            Quay lại tour hệ thống <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
          <p className="mono text-xs text-muted-foreground">design · evidence · audit · safety</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-xs text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: "var(--grad-cool)" }} />
          <span>CR.Review/AI · Solution Tour</span>
        </div>
        <span className="mono">© 2026 · AI-Assisted CR Review Platform</span>
      </div>
    </footer>
  );
}
