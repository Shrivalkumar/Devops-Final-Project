import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "/Users/shrivalkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const ROOT = "/Users/shrivalkumar/Desktop/Devops-Final-Project";
const OUT = path.join(ROOT, "deliverables");
const SHOTS = path.join(ROOT, "screenshots");
const SKILL_DIR = "/Users/shrivalkumar/.codex/plugins/cache/openai-primary-runtime/presentations/26.1013.11914/skills/presentations";
const RUNTIME_PYTHON = "/Users/shrivalkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const W = 1280;
const H = 720;
const C = {
  bg: "#080B18",
  panel: "#12172A",
  panel2: "#181D34",
  ink: "#F6F7FB",
  muted: "#AAB2CF",
  violet: "#8B5CF6",
  cyan: "#22D3EE",
  green: "#34D399",
  amber: "#FBBF24",
  red: "#FB7185",
  line: "#2D3658",
};

async function blob(file) {
  const bytes = await fs.readFile(file);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function box(slide, x, y, w, h, fill = C.panel, radius = "rounded-xl", line = C.line) {
  return slide.shapes.add({
    geometry: "roundRect",
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: line, width: 1 },
    borderRadius: radius,
  });
}

function text(slide, value, x, y, w, h, size = 24, color = C.ink, opts = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = value;
  shape.text.style = {
    fontSize: size,
    fontFamily: "Aptos",
    color,
    bold: opts.bold ?? false,
    italic: opts.italic ?? false,
    alignment: opts.align ?? "left",
    verticalAlignment: opts.valign ?? "top",
  };
  return shape;
}

function pill(slide, value, x, y, w, color = C.violet) {
  box(slide, x, y, w, 34, `${color}22`, "rounded-full", color);
  text(slide, value, x + 10, y + 7, w - 20, 20, 12, color, { bold: true, align: "center" });
}

function header(slide, eyebrow, title, subtitle, number) {
  text(slide, eyebrow.toUpperCase(), 64, 42, 530, 22, 12, C.cyan, { bold: true });
  text(slide, title, 64, 73, 1050, 54, 34, C.ink, { bold: true });
  if (subtitle) text(slide, subtitle, 64, 127, 1030, 38, 16, C.muted);
  text(slide, String(number).padStart(2, "0"), 1170, 46, 48, 24, 12, C.muted, { bold: true, align: "right" });
}

function footer(slide, label = "DEPLOYFLOW · DEVOPS CAPSTONE") {
  slide.shapes.add({ geometry: "rect", position: { left: 64, top: 684, width: 1152, height: 1 }, fill: C.line, line: { style: "solid", fill: C.line, width: 0 } });
  text(slide, label, 64, 691, 500, 16, 9, C.muted, { bold: true });
}

async function screenshot(slide, name, x, y, w, h, alt, fit = "cover") {
  slide.images.add({
    blob: await blob(path.join(SHOTS, name)),
    contentType: "image/jpeg",
    alt,
    fit,
    position: { left: x, top: y, width: w, height: h },
    geometry: "roundRect",
    borderRadius: "rounded-xl",
  });
}

function metric(slide, value, label, x, y, w, color) {
  box(slide, x, y, w, 94, C.panel2);
  text(slide, value, x + 18, y + 15, w - 36, 40, 28, color, { bold: true });
  text(slide, label, x + 18, y + 59, w - 36, 20, 12, C.muted, { bold: true });
}

function bullet(slide, title, body, x, y, w, color = C.violet) {
  slide.shapes.add({ geometry: "ellipse", position: { left: x, top: y + 5, width: 10, height: 10 }, fill: color, line: { style: "solid", fill: color, width: 0 } });
  text(slide, title, x + 22, y, w - 22, 22, 15, C.ink, { bold: true });
  text(slide, body, x + 22, y + 26, w - 22, 44, 13, C.muted);
}

function arrow(slide, x, y, w, color = C.violet) {
  slide.shapes.add({ geometry: "rect", position: { left: x, top: y + 6, width: w - 10, height: 3 }, fill: color, line: { style: "solid", fill: color, width: 0 } });
  slide.shapes.add({ geometry: "chevron", position: { left: x + w - 18, top: y, width: 18, height: 16 }, fill: color, line: { style: "solid", fill: color, width: 0 } });
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const deck = Presentation.create({ slideSize: { width: W, height: H } });

  // 1 — Cover
  {
    const s = deck.slides.add(); s.background.fill = C.bg;
    text(s, "DEVOPS CAPSTONE", 66, 66, 260, 24, 13, C.cyan, { bold: true });
    text(s, "DeployFlow", 66, 150, 480, 76, 58, C.ink, { bold: true });
    text(s, "Release operations—from commit to live metrics", 68, 236, 445, 72, 24, C.muted);
    pill(s, "FASTAPI", 68, 344, 108, C.green);
    pill(s, "REACT", 188, 344, 94, C.cyan);
    pill(s, "KUBERNETES", 294, 344, 132, C.violet);
    text(s, "A production-minded delivery system with container security, Infrastructure as Code, Helm deployment, and observable runtime behavior.", 68, 414, 450, 112, 18, C.ink);
    box(s, 585, 54, 630, 580, C.panel, "rounded-2xl", C.violet);
    await screenshot(s, "deployflow-dashboard.jpg", 610, 78, 580, 532, "DeployFlow release dashboard running locally", "contain");
    text(s, "Final Project · 2026", 68, 650, 280, 20, 12, C.muted, { bold: true });
    s.speakerNotes.text = ["Open with the product: DeployFlow gives a team one place to plan, promote, and observe service releases.", "Explain that every screenshot in this deck was captured from the working local system."];
  }

  // 2 — Product
  {
    const s = deck.slides.add(); s.background.fill = C.bg;
    header(s, "01 · PRODUCT", "Release decisions need an operational home", "DeployFlow turns scattered deployment context into a visible, auditable workflow.", 2);
    await screenshot(s, "deployflow-create-deployment.jpg", 64, 192, 720, 450, "DeployFlow create deployment workflow", "contain");
    bullet(s, "Plan the change", "Capture service, version, owner, risk, target environment, and change summary.", 830, 215, 355, C.cyan);
    bullet(s, "Track execution", "Move a release through planned, running, succeeded, or failed states.", 830, 315, 355, C.violet);
    bullet(s, "Read the room", "Live status metrics surface risk concentration and release outcomes at a glance.", 830, 415, 355, C.green);
    metric(s, "4", "RELEASE STATES", 830, 535, 165, C.cyan);
    metric(s, "3", "ENVIRONMENTS", 1012, 535, 165, C.green);
    footer(s);
    s.speakerNotes.text = ["Demo creating a deployment, then update its status.", "The domain and interface were redesigned from the starter material to avoid a copy-only submission."];
  }

  // 3 — Architecture
  {
    const s = deck.slides.add(); s.background.fill = C.bg;
    header(s, "02 · ARCHITECTURE", "One delivery path, seven verifiable layers", "The same application moves from source checks to containers, Kubernetes, and telemetry.", 3);
    const labels = [
      ["React", "Operator UI", C.cyan], ["FastAPI", "REST + metrics", C.green], ["PostgreSQL", "Release state", C.violet],
      ["Docker", "Reproducible images", C.cyan], ["GitHub Actions", "Test · scan · push", C.violet], ["Helm + EKS", "Declarative runtime", C.green], ["Prometheus", "Operational feedback", C.amber],
    ];
    let x = 68;
    labels.forEach(([a,b,c], i) => {
      box(s, x, 244, 142, 142, C.panel2, "rounded-xl", c);
      text(s, a, x + 14, 269, 114, 28, 16, c, { bold: true, align: "center" });
      text(s, b, x + 14, 316, 114, 42, 12, C.muted, { align: "center" });
      if (i < labels.length - 1) arrow(s, x + 145, 307, 24, C.line);
      x += 164;
    });
    text(s, "Build once", 77, 427, 260, 28, 18, C.ink, { bold: true });
    text(s, "Immutable images are tagged with the commit SHA, scanned, and promoted through Helm values.", 77, 464, 324, 78, 14, C.muted);
    text(s, "Operate safely", 474, 427, 260, 28, 18, C.ink, { bold: true });
    text(s, "Non-root workloads, health probes, resource limits, ingress routing, and autoscaling are encoded—not remembered.", 474, 464, 324, 78, 14, C.muted);
    text(s, "Close the loop", 871, 427, 260, 28, 18, C.ink, { bold: true });
    text(s, "Prometheus scrapes the API; Grafana turns request behavior into a live operational signal.", 871, 464, 324, 78, 14, C.muted);
    footer(s);
    s.speakerNotes.text = ["Walk left to right: interface, API, database, container build, CI, cluster release, monitoring.", "All runtime layers are represented by checked-in configuration."];
  }

  // 4 — API and tests
  {
    const s = deck.slides.add(); s.background.fill = C.bg;
    header(s, "03 · QUALITY", "The API is observable—and exercised", "Release CRUD, aggregate statistics, health, readiness, and Prometheus metrics are built in.", 4);
    await screenshot(s, "deployflow-api-docs.jpg", 64, 188, 705, 455, "FastAPI Swagger documentation for DeployFlow", "contain");
    metric(s, "9/9", "PYTEST CASES PASS", 810, 198, 180, C.green);
    metric(s, "0", "RUFF ERRORS", 1010, 198, 180, C.cyan);
    bullet(s, "Behavior, not snapshots", "Create, validate, list, fetch, update, delete, stats, health, and readiness paths are covered.", 812, 328, 370, C.green);
    bullet(s, "Isolated test state", "Each test suite overrides the database dependency with an in-memory SQLite engine.", 812, 438, 370, C.cyan);
    bullet(s, "Machine-readable contract", "Swagger documents every endpoint and schema directly from the running application.", 812, 548, 370, C.violet);
    footer(s);
    s.speakerNotes.text = ["Run pytest -v during the live demo if time allows.", "Point out the /health, /ready, and /metrics endpoints that support operations."];
  }

  // 5 — Containers and CI
  {
    const s = deck.slides.add(); s.background.fill = C.bg;
    header(s, "04 · DELIVERY", "GitHub Actions completed the delivery gate", "The completed `main` workflow tested the code, built both images, scanned them, published GHCR tags, and reported deployment configuration.", 5);
    await screenshot(s, "github-actions-success.jpg", 64, 190, 600, 442, "GitHub Actions showing successful test, build-scan-push, and deploy jobs", "contain");
    const stages = [
      ["1", "Test", "pytest · Ruff · npm build"], ["2", "Build", "backend + frontend images"], ["3", "Scan", "Trivy HIGH/CRITICAL gate"], ["4", "Publish", "GHCR · commit SHA tags"], ["5", "Deploy", "Helm when kubeconfig exists"],
    ];
    stages.forEach(([n,a,b], i) => {
      const y = 190 + i * 86;
      pill(s, n, 712, y + 8, 50, i === 2 ? C.amber : C.violet);
      text(s, a, 783, y, 180, 24, 16, C.ink, { bold: true });
      text(s, b, 783, y + 30, 374, 30, 13, C.muted);
      if (i < 4) s.shapes.add({ geometry: "rect", position: { left: 736, top: y + 47, width: 2, height: 47 }, fill: C.line, line: { style: "solid", fill: C.line, width: 0 } });
    });
    footer(s);
    s.speakerNotes.text = ["This is the actual successful GitHub Actions run for the pushed main branch.", "The containers run as non-root users and expose explicit health checks.", "The Trivy action is pinned to an immutable action commit and fails on HIGH or CRITICAL findings."];
  }

  // 6 — Infrastructure
  {
    const s = deck.slides.add(); s.background.fill = C.bg;
    header(s, "05 · INFRASTRUCTURE AS CODE", "Real AWS infrastructure—provisioned and verified", "Terraform created the two-AZ VPC and EKS platform in Mumbai; the cluster reported Active with zero node-health issues.", 6);
    await screenshot(s, "aws-eks-console-active.jpg", 64, 190, 770, 445, "AWS console showing the active DeployFlow EKS cluster", "contain");
    metric(s, "ACTIVE", "EKS 1.36 · AP-SOUTH-1", 870, 205, 300, C.green);
    bullet(s, "Non-empty plan", "56 resources planned: VPC, four subnets, NAT, IAM, encryption, logging, EKS, and managed nodes.", 870, 330, 300, C.cyan);
    bullet(s, "Two ready workers", "Workloads ran across private subnets in two availability zones behind an AWS load balancer.", 870, 430, 300, C.violet);
    bullet(s, "Cost-safe teardown", "Helm releases and the load balancer were removed before Terraform destroyed the cloud stack.", 870, 530, 300, C.amber);
    footer(s);
    s.speakerNotes.text = ["This is an actual AWS Console screenshot from ap-south-1.", "Terraform planned 56 resources and applied the VPC, EKS control plane, and two-node managed group.", "The complete destroy was captured after the live demonstration to prevent ongoing costs."];
  }

  // 7 — Kubernetes
  {
    const s = deck.slides.add(); s.background.fill = C.bg;
    header(s, "06 · KUBERNETES", "The Helm release ran on EKS—not hypothetical", "The same chart deployed PostgreSQL, two backend replicas, two frontend replicas, and ingress on the live AWS cluster.", 7);
    await screenshot(s, "aws-eks-deployflow-app.jpg", 64, 190, 750, 450, "DeployFlow application served through the live EKS ingress", "contain");
    metric(s, "2 + 2", "BACKEND + FRONTEND PODS", 854, 202, 326, C.green);
    bullet(s, "ClusterIP by default", "Frontend, backend, and PostgreSQL stay internal; ingress is the controlled entry point.", 856, 336, 320, C.cyan);
    bullet(s, "Environment overlays", "Base, development, and production values separate resource and scaling choices.", 856, 446, 320, C.violet);
    bullet(s, "Operational safeguards", "Readiness/liveness probes, resource requests and limits, security contexts, and HPA are templated.", 856, 556, 320, C.green);
    footer(s);
    s.speakerNotes.text = ["This screenshot is the application running behind the EKS ingress controller.", "The terminal evidence shows both frontend and backend replicas distributed across the two workers.", "The same chart was also validated locally on kind."];
  }

  // 8 — Observability
  {
    const s = deck.slides.add(); s.background.fill = C.bg;
    header(s, "07 · OBSERVABILITY", "Telemetry closes the delivery loop", "ServiceMonitor discovery proves scrape health; a controlled load test produces visible request-rate behavior.", 8);
    await screenshot(s, "prometheus-targets-up.jpg", 64, 192, 535, 395, "Prometheus targets showing both DeployFlow backend pods up", "contain");
    await screenshot(s, "grafana-deployflow-dashboard.jpg", 625, 192, 591, 395, "Grafana DeployFlow dashboard showing live request load", "contain");
    pill(s, "2 / 2 TARGETS UP", 76, 610, 180, C.green);
    text(s, "Prometheus discovers both API replicas through the chart’s ServiceMonitor.", 278, 611, 315, 32, 13, C.muted);
    pill(s, "604 REQUESTS", 637, 610, 165, C.cyan);
    text(s, "Grafana captured the generated traffic spike and 15-minute request count.", 824, 611, 380, 32, 13, C.muted);
    footer(s);
    s.speakerNotes.text = ["These are actual screenshots from the running local monitoring stack.", "The load generator issues repeat API requests so the graph has a clear, verifiable signal."];
  }

  // 9 — Readiness
  {
    const s = deck.slides.add(); s.background.fill = C.bg;
    header(s, "08 · HANDOFF", "Submission-ready with published container evidence", "The repository, GitHub workflow, GHCR image, AWS, Kubernetes, and observability evidence are complete.", 9);
    box(s, 64, 190, 526, 407, C.panel, "rounded-2xl", C.green);
    text(s, "Verified now", 94, 220, 300, 34, 24, C.green, { bold: true });
    const done = ["9 backend tests + Ruff", "Frontend build + npm audit", "Hardened Docker Compose stack", "GitHub Actions: all jobs successful", "Public GHCR SHA-tagged image", "Helm on kind + live EKS", "Prometheus, Grafana, AWS evidence"];
    done.forEach((v,i) => { text(s, "✓", 96, 278 + i*42, 24, 22, 15, C.green, { bold: true }); text(s, v, 130, 278 + i*42, 395, 24, 14, C.ink); });
    await screenshot(s, "github-ghcr-backend.jpg", 626, 190, 590, 407, "Public GitHub Container Registry backend image with immutable commit SHA tag", "contain");
    text(s, "Recommended demo path", 66, 630, 210, 22, 13, C.cyan, { bold: true });
    text(s, "Create release → update status → call API → generate load → watch Grafana", 280, 628, 810, 26, 16, C.ink, { bold: true });
    footer(s, "DEPLOYFLOW · AWS VERIFIED · GHCR PUBLISHED");
    s.speakerNotes.text = ["Close with the live demo path.", "The GHCR backend package shown here is public and tagged with the immutable workflow commit SHA.", "AWS plan, apply, EKS runtime, and destroy are also evidenced."];
  }

  for (const [i, slide] of deck.slides.items.entries()) {
    const png = await deck.export({ slide, format: "png", scale: 1 });
    await fs.writeFile(path.join(OUT, `slide-${String(i + 1).padStart(2, "0")}.png`), new Uint8Array(await png.arrayBuffer()));
  }
  const montage = await deck.export({ format: "webp", montage: true });
  await fs.writeFile(path.join(OUT, "DeployFlow-DevOps-Capstone-montage.webp"), new Uint8Array(await montage.arrayBuffer()));
  const stagingDir = path.join(ROOT, ".codex-finalizer");
  const candidatePath = path.join(stagingDir, "DeployFlow-DevOps-Capstone-candidate.pptx");
  const finalPath = path.join(OUT, "DeployFlow-DevOps-Capstone.pptx");
  await fs.mkdir(stagingDir, { recursive: true });
  const pptx = await PresentationFile.exportPptx(deck);
  await pptx.save(candidatePath);
  const { finalizePresentation } = await import(pathToFileURL(path.join(SKILL_DIR, "container_tools/artifact_tool_utils.mjs")).href);
  await finalizePresentation({
    explicitTotalSlideCount: 9,
    requiredNativeTableOwnerSlides: [],
    requiredNativeChartOwnerSlides: [],
    workspaceDir: ROOT,
    candidatePath,
    finalPath,
    pythonExecutable: RUNTIME_PYTHON,
    integrityValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_package_integrity.py"),
    layoutValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_layout_geometry.py"),
    layoutArgs: ["--expected-slide-size-emu", "12192000,6858000", "--validate-bullet-geometry", "--validate-heading-fit"],
    fontPolicy: { basis: "design", families: ["Aptos"] },
    verifyArtifactToolImport: true,
    receiptPath: path.join(stagingDir, "DeployFlow-DevOps-Capstone.validation.json"),
  });
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
