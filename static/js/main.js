// Portfolio Theme Switcher, Viewport-Aware Scroll Reveal, Role Typing Illumination & Animated Circuit Engine
(function () {
  const STORAGE_KEY = "glenn_portfolio_theme";

  function applyTheme(theme) {
    const root = document.documentElement;
    const toggleBtn = document.getElementById("theme-toggle");
    const normalized = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", normalized);

    if (toggleBtn) {
      const nextModeLabel =
        normalized === "dark" ? "Switch to light mode" : "Switch to dark mode";
      toggleBtn.setAttribute("aria-label", nextModeLabel);
      toggleBtn.setAttribute("title", nextModeLabel);
      toggleBtn.setAttribute(
        "aria-pressed",
        normalized === "light" ? "true" : "false"
      );
    }
  }

  function initThemeToggle() {
    const root = document.documentElement;
    const toggleBtn = document.getElementById("theme-toggle");

    let currentTheme = root.getAttribute("data-theme") || "dark";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        currentTheme = saved;
      }
    } catch (e) {
      // Ignore storage access errors in restricted frames
    }
    applyTheme(currentTheme);

    if (toggleBtn && !toggleBtn.dataset.themeBound) {
      toggleBtn.dataset.themeBound = "true";
      toggleBtn.addEventListener("click", () => {
        const active =
          root.getAttribute("data-theme") === "light" ? "light" : "dark";
        const next = active === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch (e) {
          // Ignore storage write errors
        }
      });
    }
  }

  function initRoleTypingEffect() {
    const roleEl = document.getElementById("hero-typing-role");
    if (!roleEl || roleEl.dataset.typingInitialized) return;
    roleEl.dataset.typingInitialized = "true";

    const fullText = (
      roleEl.getAttribute("data-typing-text") ||
      roleEl.textContent ||
      "AI Automation Specialist & Web Application Developer"
    ).trim();

    roleEl.setAttribute("aria-label", fullText);
    roleEl.textContent = "";

    const charSpans = [];
    const words = fullText.split(" ");

    words.forEach((word, wIdx) => {
      const wordWrap = document.createElement("span");
      wordWrap.className = "role-word";
      wordWrap.setAttribute("aria-hidden", "true");

      for (let i = 0; i < word.length; i++) {
        const chSpan = document.createElement("span");
        chSpan.className = "role-char";
        chSpan.textContent = word[i];
        wordWrap.appendChild(chSpan);
        charSpans.push(chSpan);
      }

      roleEl.appendChild(wordWrap);

      if (wIdx < words.length - 1) {
        const spaceSpan = document.createElement("span");
        spaceSpan.className = "role-char role-space";
        spaceSpan.setAttribute("aria-hidden", "true");
        spaceSpan.textContent = " ";
        roleEl.appendChild(spaceSpan);
        charSpans.push(spaceSpan);
      }
    });

    if (!charSpans.length) return;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      charSpans.forEach((sp) => sp.classList.add("is-lit"));
      charSpans[charSpans.length - 1].classList.add("is-caret-pos");
      return;
    }

    const TYPING_SPEED_MS = 48; // Normal per-letter typing speed
    const REPEAT_DELAY_MS = 5000; // Wait 5 seconds before repeating the typing cycle
    let currentIdx = -1;

    function setCaretAt(index) {
      for (let i = 0; i < charSpans.length; i++) {
        if (i === index) {
          charSpans[i].classList.add("is-caret-pos");
        } else {
          charSpans[i].classList.remove("is-caret-pos");
        }
      }
    }

    function startTypingPass() {
      // Reset all letters to dim/faint ("malabo / matamlay na kulay") while keeping the full word intact
      for (let i = 0; i < charSpans.length; i++) {
        charSpans[i].classList.remove("is-lit", "is-caret-pos");
      }
      currentIdx = 0;

      function stepLetter() {
        if (window.__PAUSE_BG_ANIMATIONS) return;
        if (currentIdx < charSpans.length) {
          charSpans[currentIdx].classList.add("is-lit");
          setCaretAt(currentIdx);
          currentIdx++;
          window.setTimeout(stepLetter, TYPING_SPEED_MS);
        } else {
          // Keep blinking "|" at the end of the fully lit title for 5 seconds, then replay
          setCaretAt(charSpans.length - 1);
          window.setTimeout(startTypingPass, REPEAT_DELAY_MS);
        }
      }

      stepLetter();
    }

    // Start the first typing pass right as Step 3 ("AI Automation Specialist & Web Application Developer") floats in
    window.setTimeout(startTypingPass, 580);
  }

  function initScrollReveal() {
    const revealItems = Array.from(document.querySelectorAll(".scroll-reveal"));
    if (!revealItems.length) return;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      revealItems.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    revealItems.forEach((el) => {
      const rawDelay = parseInt(
        el.getAttribute("data-reveal-delay") || "0",
        10
      );
      const delayMs = Number.isFinite(rawDelay) ? Math.max(0, rawDelay) : 0;
      el.style.setProperty("--reveal-delay", `${delayMs}ms`);

      // Keep the Hero outer card container visible at t=0 so its inner .hero-intro-item elements play their sequential float-in cleanly
      if (el.classList.contains("resume-header-card")) {
        el.classList.add("is-visible");
      }
    });

    document.documentElement.classList.add("js-scroll-ready");

    let ticking = false;

    function updateRevealStates() {
      ticking = false;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const docHeight = document.documentElement.scrollHeight;
      const nearPageBottom = scrollY + vh >= docHeight - 28;

      const topExitBoundary = 82;
      const bottomEnterBoundary = nearPageBottom ? vh * 0.99 : vh * 0.91;

      revealItems.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isInsideViewport =
          rect.top < bottomEnterBoundary && rect.bottom > topExitBoundary;

        if (isInsideViewport) {
          el.classList.remove("is-scrolled-past");
          el.classList.add("is-visible");
        } else if (rect.bottom <= topExitBoundary) {
          el.classList.remove("is-visible");
          el.classList.add("is-scrolled-past");
        } else {
          el.classList.remove("is-visible", "is-scrolled-past");
        }
      });
    }

    function requestTick() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateRevealStates);
      }
    }

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });

    // Wait one paint frame after adding .js-scroll-ready so initial-viewport elements smoothly float in
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(updateRevealStates);
    });
  }

  function initCircuitCanvas() {
    const canvas = document.getElementById("circuit-bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let traces = [];
    let pulses = [];

    function createSeededRandom(seed) {
      let s = seed;
      return function () {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
      };
    }

    function buildCircuitNetwork() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth || document.documentElement.clientWidth;
      height = window.innerHeight || document.documentElement.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      traces = [];
      pulses = [];

      const rand = createSeededRandom(20261107);
      const gridStep = width < 768 ? 56 : 68;
      const cols = Math.ceil(width / gridStep) + 1;
      const rows = Math.ceil(height / gridStep) + 1;

      const traceCount = width < 768 ? 22 : 38;
      const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
      ];

      for (let t = 0; t < traceCount; t++) {
        let cx = Math.floor(rand() * cols) * gridStep;
        let cy = Math.floor(rand() * rows) * gridStep;
        const points = [{ x: cx, y: cy }];
        const segments = 3 + Math.floor(rand() * 4);

        for (let s = 0; s < segments; s++) {
          const useChamfer = s % 2 === 1 && rand() > 0.35;
          const dirIdx = useChamfer
            ? 4 + Math.floor(rand() * 4)
            : Math.floor(rand() * 4);
          const dir = dirs[dirIdx];
          const stepMult = useChamfer ? 1 : 1 + Math.floor(rand() * 3);
          const nx = cx + dir[0] * gridStep * stepMult;
          const ny = cy + dir[1] * gridStep * stepMult;

          if (
            nx < -gridStep ||
            nx > width + gridStep ||
            ny < -gridStep ||
            ny > height + gridStep
          ) {
            continue;
          }
          if (nx === cx && ny === cy) continue;

          points.push({ x: nx, y: ny });
          cx = nx;
          cy = ny;
        }

        if (points.length >= 2) {
          const segLengths = [];
          let totalLen = 0;
          for (let i = 0; i < points.length - 1; i++) {
            const dx = points[i + 1].x - points[i].x;
            const dy = points[i + 1].y - points[i].y;
            const len = Math.hypot(dx, dy);
            segLengths.push(len);
            totalLen += len;
          }

          if (totalLen > 40) {
            const isCyanVariant = t % 3 === 0;
            traces.push({
              points,
              segLengths,
              totalLen,
              isCyanVariant,
            });
          }
        }
      }

      const pulseCount = Math.min(traces.length, width < 768 ? 16 : 28);
      for (let i = 0; i < pulseCount; i++) {
        const trace = traces[i % traces.length];
        pulses.push({
          trace,
          dist: rand() * trace.totalLen,
          speed: 55 + rand() * 75,
          tailLen: 48 + rand() * 44,
          direction: i % 4 === 0 ? -1 : 1,
        });
      }
    }

    function getPointAtDistance(trace, d) {
      const clamped = Math.max(0, Math.min(trace.totalLen, d));
      let acc = 0;
      for (let i = 0; i < trace.segLengths.length; i++) {
        const segLen = trace.segLengths[i];
        if (clamped <= acc + segLen || i === trace.segLengths.length - 1) {
          const t = segLen > 0 ? (clamped - acc) / segLen : 0;
          const p0 = trace.points[i];
          const p1 = trace.points[i + 1];
          return {
            x: p0.x + (p1.x - p0.x) * t,
            y: p0.y + (p1.y - p0.y) * t,
          };
        }
        acc += segLen;
      }
      return trace.points[trace.points.length - 1];
    }

    let lastTime = performance.now();

    function renderFrame(now) {
      if (window.__PAUSE_BG_ANIMATIONS) return;
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      const isLight =
        document.documentElement.getAttribute("data-theme") === "light";

      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 1.25;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < traces.length; i++) {
        const tr = traces[i];
        ctx.strokeStyle = isLight
          ? tr.isCyanVariant
            ? "rgba(2, 132, 199, 0.14)"
            : "rgba(5, 150, 105, 0.15)"
          : tr.isCyanVariant
          ? "rgba(12, 230, 255, 0.10)"
          : "rgba(0, 214, 155, 0.11)";

        ctx.beginPath();
        ctx.moveTo(tr.points[0].x, tr.points[0].y);
        for (let j = 1; j < tr.points.length; j++) {
          ctx.lineTo(tr.points[j].x, tr.points[j].y);
        }
        ctx.stroke();

        const startPt = tr.points[0];
        const endPt = tr.points[tr.points.length - 1];
        ctx.fillStyle = isLight
          ? "rgba(5, 150, 105, 0.22)"
          : "rgba(0, 214, 155, 0.20)";

        ctx.beginPath();
        ctx.arc(startPt.x, startPt.y, 2.6, 0, Math.PI * 2);
        ctx.arc(endPt.x, endPt.y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];
        if (!prefersReducedMotion) {
          p.dist += p.speed * dt * p.direction;
          if (p.direction > 0 && p.dist > p.trace.totalLen + p.tailLen) {
            p.dist = -10;
          } else if (p.direction < 0 && p.dist < -p.tailLen) {
            p.dist = p.trace.totalLen + 10;
          }
        }

        const headDist = p.dist;
        const tailDist = p.dist - p.tailLen * p.direction;

        const visibleStart = Math.max(0, Math.min(p.trace.totalLen, tailDist));
        const visibleEnd = Math.max(0, Math.min(p.trace.totalLen, headDist));

        if (Math.abs(visibleEnd - visibleStart) < 2) continue;

        const steps = 8;
        ctx.beginPath();
        for (let s = 0; s <= steps; s++) {
          const d = visibleStart + ((visibleEnd - visibleStart) * s) / steps;
          const pt = getPointAtDistance(p.trace, d);
          if (s === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }

        const headPt = getPointAtDistance(p.trace, visibleEnd);
        const tailPt = getPointAtDistance(p.trace, visibleStart);

        const grad = ctx.createLinearGradient(
          tailPt.x,
          tailPt.y,
          headPt.x,
          headPt.y
        );

        if (isLight) {
          const headColor = p.trace.isCyanVariant
            ? "rgba(2, 132, 199, 0.72)"
            : "rgba(5, 150, 105, 0.75)";
          grad.addColorStop(0, "rgba(5, 150, 105, 0)");
          grad.addColorStop(1, headColor);
        } else {
          const headColor = p.trace.isCyanVariant
            ? "rgba(12, 230, 255, 0.78)"
            : "rgba(0, 214, 155, 0.80)";
          grad.addColorStop(0, "rgba(0, 214, 155, 0)");
          grad.addColorStop(1, headColor);
        }

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        if (headDist >= 0 && headDist <= p.trace.totalLen) {
          ctx.beginPath();
          ctx.arc(headPt.x, headPt.y, 2.7, 0, Math.PI * 2);
          ctx.fillStyle = isLight
            ? p.trace.isCyanVariant
              ? "#0284c7"
              : "#059669"
            : p.trace.isCyanVariant
            ? "#0ce6ff"
            : "#00d69b";
          ctx.fill();
        }
      }

      if (!prefersReducedMotion && !window.__PAUSE_BG_ANIMATIONS) {
        window.requestAnimationFrame(renderFrame);
      }
    }

    buildCircuitNetwork();
    window.addEventListener("resize", buildCircuitNetwork, { passive: true });
    window.requestAnimationFrame(renderFrame);
  }

  function initFeaturedProjectsInspector() {
    const modal = document.getElementById("project-inspector-modal");
    if (!modal || modal.dataset.boundInspector) return;
    modal.dataset.boundInspector = "true";

    const closeBtn = document.getElementById("project-modal-close");
    const sysIdEl = document.getElementById("modal-project-sysid");
    const categoryEl = document.getElementById("modal-project-category");
    const endpointEl = document.getElementById("modal-project-endpoint");
    const titleEl = document.getElementById("modal-project-title");

    const tabButtons = Array.from(modal.querySelectorAll("[data-modal-tab]"));
    const panelCaseStudy = document.getElementById("modal-panel-case-study");
    const panelSourceCode = document.getElementById("modal-panel-source-code");
    const panelLiveWidget = document.getElementById("modal-panel-live-widget");

    const PROJECTS_DATA = {
      "social-scheduler": {
        sysId: "SYS-01",
        category: "AI Content & Social Publishing",
        endpoint: "POST /api/v1/ai/caption",
        demoEndpoint: "/api/demo/ai-caption",
        title: "AI Content & Omnichannel Social Scheduler",
        bottleneck:
          "Marketing and operations teams were spending 12+ hours weekly manually writing platform-specific social copy, formatting media assets, and logging into separate dashboards for Facebook, Instagram, TikTok, and YouTube.",
        solution:
          "Architected a unified FastAPI microservice inside GlennBot Automations that ingests a single campaign brief, generates platform-tailored captions & hashtag sets via Google Gemini AI, optimizes media via Cloudinary, and schedules multi-channel dispatches through Zernio Social APIs and APScheduler.",
        architectureSteps: [
          "Campaign Brief / Topic submitted via Dashboard or n8n Webhook trigger",
          "FastAPI service calls Google Gemini 2.5 Flash with brand voice & platform constraints",
          "Cloudinary pipeline validates aspect ratios and CDN URLs for reels/carousels",
          "APScheduler + Zernio API dispatches synchronized posts to FB, IG, TikTok & YouTube",
        ],
        metrics: [
          { value: "85% Faster", label: "End-to-End Content Ops" },
          { value: "4 Platforms", label: "Simultaneous Publishing" },
          { value: "100% Automated", label: "APScheduler Cron Queue" },
        ],
        sourceFile: "glennbot_automations/routers/social_scheduler.py",
        sourceCode: `from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel, Field
from google import genai
import httpx

router = APIRouter(prefix="/api/v1", tags=["AI Content & Social Scheduler"])

class CaptionScheduleRequest(BaseModel):
    topic: str = Field(..., min_length=4, description="Campaign topic or product update")
    tone: str = Field(default="Executive & High-Converting")
    platforms: list[str] = Field(default=["LinkedIn", "Facebook", "Instagram", "TikTok"])
    schedule_iso: str | None = None

@router.post("/ai/caption")
async def generate_and_queue_social_post(
    payload: CaptionScheduleRequest,
    x_api_key: str = Header(..., alias="X-API-Key"),
):
    client = genai.Client()
    prompt = (
        f"Generate a {payload.tone} social media post about: {payload.topic}. "
        f"Target platforms: {', '.join(payload.platforms)}. Return caption and 6 hashtags."
    )
    ai_resp = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    # Dispatch to Zernio Multi-Platform Scheduler & APScheduler Queue
    async with httpx.AsyncClient(timeout=15.0) as http:
        zernio_res = await http.post(
            "https://api.zernio.io/v1/social/dispatch",
            headers={"Authorization": f"Bearer {x_api_key}"},
            json={
                "caption": ai_resp.text,
                "platforms": payload.platforms,
                "scheduled_at": payload.schedule_iso,
            },
        )
        zernio_res.raise_for_status()

    return {
        "status": "QUEUED_APSCHEDULER",
        "platforms_synced": payload.platforms,
        "generated_caption": ai_resp.text,
    }`,
        widgetFields: [
          {
            name: "topic",
            label: "Campaign Topic / Operational Update",
            type: "text",
            value: "Automated Lead Capture & CRM Sync with FastAPI + n8n",
          },
          {
            name: "tone",
            label: "AI Brand Voice & Tone",
            type: "select",
            options: [
              "Executive & High-Converting",
              "Taglish Tech Builder",
              "Engaging & Story-Driven",
            ],
          },
          {
            name: "platforms",
            label: "Target Social Channels (Comma-separated)",
            type: "text",
            value: "LinkedIn, Facebook, Instagram, TikTok",
          },
        ],
      },
      "omnichannel-inbox": {
        sysId: "SYS-02",
        category: "Omnichannel Comms & AI Triage",
        endpoint: "POST /api/v1/inbox/triage",
        demoEndpoint: "/api/demo/inbox-triage",
        title: "Unified Omnichannel Inbox & Smart Auto-Responder",
        bottleneck:
          "Client inquiries and urgent supplier alerts were scattered across WhatsApp/SMS, Email threads, and Facebook/Instagram DMs—causing delayed response times and missed high-value leads outside business hours.",
        solution:
          "Built a real-time FastAPI webhook aggregator that normalizes inbound messages from TextBee SMS, IMAP/SMTP Email, and Social DMs, runs instant Gemini AI intent & urgency classification, drafts a context-aware reply, and upserts the lead in Supabase PostgreSQL.",
        architectureSteps: [
          "Inbound webhook received from TextBee SMS Gateway, IMAP/SMTP, or FB/IG DM",
          "FastAPI normalizes sender metadata and runs Gemini AI Intent & Priority Scorer",
          "High-priority leads trigger instant n8n escalation + Supabase CRM record upsert",
          "Smart Auto-Responder dispatches context-aware reply across the originating channel",
        ],
        metrics: [
          { value: "< 2.5s", label: "AI Triage & Routing Time" },
          { value: "3 Channels", label: "SMS • Email • Social DMs" },
          { value: "Zero Missed", label: "24/7 Lead Capture" },
        ],
        sourceFile: "glennbot_automations/routers/omnichannel_inbox.py",
        sourceCode: `from fastapi import APIRouter, Depends, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session
from google import genai
import httpx

router = APIRouter(prefix="/api/v1/inbox", tags=["Omnichannel Inbox & AI Triage"])

class InboundMessagePayload(BaseModel):
    channel: str
    sender: str
    message: str

@router.post("/triage")
async def triage_inbound_message(
    payload: InboundMessagePayload,
    x_api_key: str = Header(..., alias="X-API-Key"),
):
    client = genai.Client()
    triage_prompt = (
        f"Classify intent, urgency score (0-100), and draft a concise reply "
        f"for this {payload.channel} message from {payload.sender}: {payload.message}"
    )
    analysis = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=triage_prompt,
    )

    # Dispatch SMS notification via TextBee Gateway & sync to Supabase CRM
    async with httpx.AsyncClient(timeout=10.0) as http:
        await http.post(
            "https://api.textbee.dev/api/v1/gateway/send-sms",
            headers={"x-api-key": x_api_key},
            json={"recipient": payload.sender, "message": analysis.text[:320]},
        )

    return {
        "status": "TRIAGED_AND_ROUTED",
        "channel": payload.channel,
        "smart_reply": analysis.text,
    }`,
        widgetFields: [
          {
            name: "channel",
            label: "Inbound Source Channel",
            type: "select",
            options: [
              "WhatsApp / TextBee SMS",
              "Enterprise Email (IMAP/SMTP)",
              "Facebook / Instagram DM",
            ],
          },
          {
            name: "sender",
            label: "Sender Handle / Contact",
            type: "text",
            value: "ops-director@enterprise-client.io",
          },
          {
            name: "message",
            label: "Inbound Client / Supplier Message",
            type: "textarea",
            value:
              "Hi Glenn, we need an automated pipeline that syncs our incoming supplier quality sheets to PostgreSQL and alerts our team on WhatsApp.",
          },
        ],
      },
      "calendar-orchestrator": {
        sysId: "SYS-03",
        category: "Workflow Automation & Booking",
        endpoint: "POST /api/v1/calendar/schedule",
        demoEndpoint: "/api/demo/calendar-schedule",
        title: "Automated Calendar Booking & n8n Webhook Orchestrator",
        bottleneck:
          "Back-and-forth timezone emails, manual Google Meet link creation, and forgotten CRM updates were slowing down technical discovery calls and client onboarding.",
        solution:
          "Engineered a zero-touch FastAPI booking endpoint integrated with Composio (Google Calendar / Meet / Zoom) and n8n webhooks. Every confirmed slot automatically provisions a video room, logs the prospect in PostgreSQL, and queues a 24-hour SMS reminder via TextBee.",
        architectureSteps: [
          "Client selects consultation slot from portfolio widget or intake form",
          "FastAPI queries Composio Google Calendar integration to verify zero conflicts",
          "Composio provisions Google Meet / Zoom conference link & sends calendar invite",
          "n8n webhook triggers CRM lead enrichment and schedules TextBee SMS reminder",
        ],
        metrics: [
          { value: "Zero-Touch", label: "Calendar & Meet Setup" },
          { value: "3 Webhooks", label: "Meet • Supabase • SMS" },
          { value: "100% Synced", label: "Timezone-Safe Scheduling" },
        ],
        sourceFile: "glennbot_automations/routers/calendar_orchestrator.py",
        sourceCode: `from fastapi import APIRouter, Header
from pydantic import BaseModel
import httpx

router = APIRouter(prefix="/api/v1/calendar", tags=["Calendar & n8n Orchestrator"])

class ConsultationBookingRequest(BaseModel):
    name: str
    session_type: str
    slot: str

@router.post("/schedule")
async def schedule_discovery_session(
    payload: ConsultationBookingRequest,
    x_api_key: str = Header(..., alias="X-API-Key"),
):
    async with httpx.AsyncClient(timeout=15.0) as http:
        # 1. Provision Google Calendar Event + Meet link via Composio
        composio_res = await http.post(
            "https://backend.composio.dev/api/v2/actions/googlecalendar_create_event/execute",
            headers={"X-API-Key": x_api_key},
            json={
                "summary": f"{payload.session_type} — {payload.name}",
                "start_datetime": payload.slot,
                "create_conference_link": True,
            },
        )
        # 2. Trigger downstream n8n Webhook for CRM + TextBee SMS reminder
        await http.post(
            "https://n8n.glennbot.io/webhook/calendar-booking-sync",
            json=payload.model_dump(),
        )

    return {
        "status": "CONFIRMED",
        "attendee": payload.name,
        "slot": payload.slot,
        "conference": "Google Meet Auto-Provisioned",
    }`,
        widgetFields: [
          {
            name: "name",
            label: "Attendee Name & Role",
            type: "text",
            value: "Alex Rivera (Operations VP)",
          },
          {
            name: "session_type",
            label: "Consultation / Audit Type",
            type: "select",
            options: [
              "AI Workflow & FastAPI Architecture Audit (30 min)",
              "Custom CRM & Web Dashboard Discovery (45 min)",
              "Manufacturing & Supplier Data Automation Call (30 min)",
            ],
          },
          {
            name: "slot",
            label: "Preferred ISO Slot (PHT / UTC+8)",
            type: "text",
            value: "2026-11-10T10:00:00+08:00",
          },
        ],
      },
      "sheets-capacity-sync": {
        sysId: "SYS-04",
        category: "Data Pipeline & Kaizen Analytics",
        endpoint: "POST /api/v1/sheets/sync",
        demoEndpoint: "/api/demo/sheets-sync",
        title: "Cloud Spreadsheet & Supplier Capacity Sync Engine",
        bottleneck:
          "Inspired by managing 30+ external suppliers at EPSON Precision: engineering teams were manually consolidating Excel/Google Sheets capacity matrices, leading to version drift and delayed bottleneck detection.",
        solution:
          "Built a bidirectional ETL sync engine connecting Google Drive / Spreadsheets with PostgreSQL (Supabase) via SQLAlchemy. Automatically validates incoming rows, calculates tooling & supplier capacity utilization, and flags Kaizen bottleneck alerts in real time.",
        architectureSteps: [
          "Scheduled APScheduler job or manual webhook triggers Google Sheets delta pull",
          "FastAPI + Pydantic validates row schemas and normalizes supplier metrics",
          "Kaizen capacity rule engine flags utilization > 90% or mold renewal thresholds",
          "SQLAlchemy bulk-upserts clean records into Supabase PostgreSQL & updates dashboard",
        ],
        metrics: [
          { value: "30+ Suppliers", label: "Audited Matrix Architecture" },
          { value: "2-Way Sync", label: "Google Sheets ↔ PostgreSQL" },
          { value: "Zero Drift", label: "Pydantic Schema Validation" },
        ],
        sourceFile: "glennbot_automations/routers/sheets_capacity_sync.py",
        sourceCode: `from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v1/sheets", tags=["Cloud Spreadsheet & Capacity Sync"])

class SheetSyncRequest(BaseModel):
    sheet_name: str
    sync_mode: str = "Two-Way Delta Sync + Kaizen Bottleneck Audit"
    rows_scanned: int = 340

@router.post("/sync")
async def sync_spreadsheet_to_postgres(payload: SheetSyncRequest):
    # Validate supplier capacity thresholds & upsert to Supabase PostgreSQL
    bottlenecks = max(1, round(payload.rows_scanned * 0.035))
    return {
        "status": "SYNC_COMPLETED",
        "workbook": payload.sheet_name,
        "rows_upserted": payload.rows_scanned,
        "kaizen_bottlenecks_flagged": bottlenecks,
        "audit_status": "ZERO_SCHEMA_DRIFT",
    }`,
        widgetFields: [
          {
            name: "sheet_name",
            label: "Target Google Spreadsheet Workbook",
            type: "text",
            value: "EPSON_Supplier_Mold_Capacity_Matrix_Q4",
          },
          {
            name: "sync_mode",
            label: "Synchronization & Audit Mode",
            type: "select",
            options: [
              "Two-Way Delta Sync + Kaizen Bottleneck Audit",
              "Google Sheets -> Supabase PostgreSQL Upsert",
              "Supplier Capacity Threshold Scan (>90% Load)",
            ],
          },
          {
            name: "rows_scanned",
            label: "Batch Rows to Validate & Sync",
            type: "number",
            value: "340",
          },
        ],
      },
    };

    let activeProjectId = "social-scheduler";
    let activeTab = "case-study";

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    // Helper for YYYY-MM-DD formatting in local time
    function formatDateYMD(dateObj) {
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, "0");
      const d = String(dateObj.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }

    const nowDate = new Date();
    const todayStr = formatDateYMD(nowDate);
    const tomorrowDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 1);
    const tomorrowStr = formatDateYMD(tomorrowDate);
    const plusTwoDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 2);
    const plusTwoStr = formatDateYMD(plusTwoDate);
    const yesterdayDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() - 1);
    const yesterdayStr = formatDateYMD(yesterdayDate);

    // Built-in Google Drive Files Vault sample assets
    const VAULT_FILES_LIST = [
      {
        id: "vault_reel_01",
        name: "glennbot_demo_reel.mp4",
        mimeType: "video/mp4",
        sizeLabel: "14.2 MB • 9:16 Vertical Reel",
        thumbUrl: "/assets/aistudio/image_0f71ad01.png",
        previewUrl: "https://glennbot.automations/vault/glennbot_demo_reel.mp4",
      },
      {
        id: "vault_img_02",
        name: "kaizen_dashboard_preview.png",
        mimeType: "image/png",
        sizeLabel: "2.8 MB • 1080x1350 Portrait",
        thumbUrl: "/assets/aistudio/image_404ebbdb.png",
        previewUrl: "https://glennbot.automations/vault/kaizen_dashboard_preview.png",
      },
      {
        id: "vault_vid_03",
        name: "n8n_webhook_pipeline.mp4",
        mimeType: "video/mp4",
        sizeLabel: "28.6 MB • 16:9 HD Walkthrough",
        thumbUrl: "/assets/aistudio/image_68d1ca77.png",
        previewUrl: "https://glennbot.automations/vault/n8n_webhook_pipeline.mp4",
      },
      {
        id: "vault_img_04",
        name: "ai_social_carousel.png",
        mimeType: "image/png",
        sizeLabel: "3.4 MB • Multi-Slide Cover",
        thumbUrl: "/assets/aistudio/image_7ed0ded4.png",
        previewUrl: "https://glennbot.automations/vault/ai_social_carousel.png",
      },
    ];

    // Pre-connected Demo Accounts per platform
    const PLATFORM_META = {
      facebook: {
        name: "Facebook",
        icon: "fab fa-facebook",
        colorClass: "gb-text-blue",
        bgColor: "#1877F2",
        badgeText: "2 pages",
        accounts: [
          { id: "fb_glennbot_main", label: "GlennBot AI Solutions (FB)" },
          { id: "fb_kaizen_hub", label: "GlennBot Ops Automation Hub (FB)" },
        ],
      },
      instagram: {
        name: "Instagram",
        icon: "fab fa-instagram",
        colorClass: "gb-text-pink",
        bgColor: "#E1306C",
        badgeText: "2 accts",
        accounts: [
          { id: "ig_glennbot_ai", label: "@glennbot.ai (IG)" },
          { id: "ig_glenn_kaizen", label: "@glenn_kaizen_tech (IG)" },
        ],
      },
      tiktok: {
        name: "TikTok",
        icon: "fab fa-tiktok",
        colorClass: "gb-text-cyan",
        bgColor: "#06B6D4",
        badgeText: "1 acct",
        accounts: [
          { id: "tt_glennbot_auto", label: "@glennbot_automations (TikTok)" },
        ],
      },
      youtube: {
        name: "YouTube",
        icon: "fab fa-youtube",
        colorClass: "gb-text-red",
        bgColor: "#FF0000",
        badgeText: "1 chnl",
        accounts: [
          { id: "yt_glennbot_tech", label: "GlennBot Tech Channel (YT)" },
        ],
      },
    };

    // Persistent state for GlennBot Social Scheduler Mini-App
    const gbSchedulerState = {
      activeSubTab: "create", // 'create' | 'queue' | 'calendar'
      selectedPlatforms: {
        facebook: true,
        instagram: true,
        tiktok: false,
        youtube: false,
      },
      formatType: "reels", // 'text' | 'reels' | 'video' | 'image'
      askAiOpen: false,
      askAiTopic: "AI Content & Omnichannel Social Scheduler scaling content 10x faster",
      askAiTone: "Executive & High-Converting",
      askAiLoading: false,
      activeVaultPickerPlatform: null,
      queueFilter: "all",
      calendarMonth: nowDate.getMonth(),
      calendarYear: nowDate.getFullYear(),
      inspectedCalendarDate: todayStr,
      platformDrafts: {
        facebook: {
          accountLabel: "GlennBot AI Solutions (FB)",
          date: todayStr,
          time: "18:30",
          title: "",
          caption:
            "How we eliminated 90% of manual social media scheduling using FastAPI, Gemini 2.5 Flash, and asynchronous platform workers. Full architecture breakdown inside! ⚡🚀 #AIAgent #Automation #FastAPI #BuildInPublic",
          media: VAULT_FILES_LIST[0],
        },
        instagram: {
          accountLabel: "@glennbot.ai (IG)",
          date: todayStr,
          time: "19:00",
          title: "",
          caption:
            "Stop copy-pasting across 4 platforms. Watch how GlennBot Social Scheduler generates platform-native hooks & dispatches Reels + Carousels from one unified workspace. ✨🤖 #AIAutomation #TechBuilder #ProductivityHacks",
          media: VAULT_FILES_LIST[0],
        },
        tiktok: {
          accountLabel: "@glennbot_automations (TikTok)",
          date: tomorrowStr,
          time: "20:00",
          title: "",
          caption:
            "POV: Your Python FastAPI backend writes, schedules, and publishes your short-form videos automatically while you sleep ⚡🔥 #Coding #Python #AIWorkflow #TechTok",
          media: VAULT_FILES_LIST[0],
        },
        youtube: {
          accountLabel: "GlennBot Tech Channel (YT)",
          date: tomorrowStr,
          time: "21:00",
          title: "Automating Omnichannel Content with Python FastAPI & Gemini 2.5 #Shorts",
          caption:
            "In this breakdown, we walk through the GlennBot Social Scheduler architecture: Google Drive Vault media streaming, Gemini 2.5 caption synthesis, and zero-lockup background job queues.",
          media: VAULT_FILES_LIST[2],
        },
      },
      scheduledPostsList: [
        {
          id: "post_seed_101",
          date: todayStr,
          time: "18:30",
          platform: "facebook",
          page_name: "GlennBot AI Solutions (FB)",
          post_type: "reels",
          caption:
            "How we eliminated 90% of manual social media scheduling using FastAPI, Gemini 2.5 Flash, and asynchronous platform workers. ⚡🚀 #AIAgent #Automation",
          status: "Waiting / Scheduled",
          media_name: "glennbot_demo_reel.mp4",
          media_thumb: "/assets/aistudio/image_0f71ad01.png",
          published_url: "",
        },
        {
          id: "post_seed_102",
          date: todayStr,
          time: "19:00",
          platform: "instagram",
          page_name: "@glennbot.ai (IG)",
          post_type: "image",
          caption:
            "From Toyota Production System (Kaizen) to AI Systems Engineering: Why standardized workflows beat ad-hoc prompting every single time. 📊✨ #Kaizen #AISystems",
          status: "Waiting / Scheduled",
          media_name: "kaizen_dashboard_preview.png",
          media_thumb: "/assets/aistudio/image_404ebbdb.png",
          published_url: "",
        },
        {
          id: "post_seed_103",
          date: tomorrowStr,
          time: "14:00",
          platform: "tiktok",
          page_name: "@glennbot_automations (TikTok)",
          post_type: "reels",
          caption:
            "3 n8n + FastAPI webhook patterns every AI Automation Engineer needs in production 🔥⚡ #n8n #FastAPI #AutomationEngineer",
          status: "Waiting / Scheduled",
          media_name: "n8n_webhook_pipeline.mp4",
          media_thumb: "/assets/aistudio/image_68d1ca77.png",
          published_url: "",
        },
        {
          id: "post_seed_104",
          date: yesterdayStr,
          time: "11:00",
          platform: "youtube",
          page_name: "GlennBot Tech Channel (YT)",
          post_type: "video",
          title: "Building an Enterprise Omnichannel Social Scheduler in Python",
          caption:
            "Full system architecture deep dive: Supabase PostgreSQL 30-day retention queue, Google Drive media chunking, and OAuth token refresh pipelines.",
          status: "Published",
          media_name: "n8n_webhook_pipeline.mp4",
          media_thumb: "/assets/aistudio/image_68d1ca77.png",
          published_url: "https://youtube.com/watch?v=glennbot_sys01",
        },
      ],
    };

    function setActiveTab(tabName) {
      activeTab = tabName;
      tabButtons.forEach((btn) => {
        const isMatch = btn.getAttribute("data-modal-tab") === tabName;
        btn.classList.toggle("is-active", isMatch);
        btn.setAttribute("aria-selected", isMatch ? "true" : "false");
      });

      const map = {
        "case-study": panelCaseStudy,
        "source-code": panelSourceCode,
        "live-widget": panelLiveWidget,
      };

      Object.keys(map).forEach((key) => {
        const panel = map[key];
        if (!panel) return;
        if (key === tabName) {
          panel.hidden = false;
          panel.classList.add("is-active");
        } else {
          panel.hidden = true;
          panel.classList.remove("is-active");
        }
      });
    }

    // Format compatibility helper (matches GlennBot updatePreviews logic)
    function isPlatformFormatIncompatible(platform, formatType) {
      if (platform === "instagram" && formatType === "text") return true;
      if ((platform === "tiktok" || platform === "youtube") && (formatType === "text" || formatType === "image")) {
        return true;
      }
      return false;
    }

    // Shared 9-Column Queue Table HTML Builder (replicated from GlennBot buildPostsTableHTML)
    function buildPostsTableHTML(postsToRender) {
      if (!postsToRender || postsToRender.length === 0) {
        return `
          <div class="gb-empty-preview">
            <i class="fas fa-calendar-times"></i>
            <p>No scheduled posts match the selected filter.</p>
          </div>
        `;
      }

      const formatBadgeMap = {
        reels: { label: "Reels/Short", icon: "fas fa-mobile-alt", cls: "gb-format-badge-reels" },
        image: { label: "Image/Album", icon: "fas fa-images", cls: "gb-format-badge-image" },
        video: { label: "16:9 Video", icon: "fas fa-video", cls: "gb-format-badge-video" },
        text: { label: "Text Post", icon: "fas fa-align-left", cls: "gb-format-badge-text" },
      };

      const rowsHtml = postsToRender
        .map((post, idx) => {
          const pMeta = PLATFORM_META[post.platform] || PLATFORM_META.facebook;
          const fmt = formatBadgeMap[post.post_type] || formatBadgeMap.reels;

          let statusHtml = "";
          const stLower = (post.status || "").toLowerCase();
          if (stLower.includes("published")) {
            statusHtml = `<span class="gb-status-pill gb-status-published"><i class="fas fa-check-circle"></i> Published</span>`;
          } else if (stLower.includes("processing")) {
            statusHtml = `<span class="gb-status-pill gb-status-processing"><i class="fas fa-spinner fa-spin"></i> Processing Payload</span>`;
          } else if (stLower.includes("failed")) {
            statusHtml = `<span class="gb-status-pill gb-status-failed"><i class="fas fa-exclamation-triangle"></i> Failed</span>`;
          } else {
            statusHtml = `<span class="gb-status-pill gb-status-waiting"><i class="fas fa-clock"></i> Waiting / Scheduled</span>`;
          }

          let mediaCellHtml = `<span class="gb-media-badge"><i class="fas fa-align-left"></i> Text-only</span>`;
          if (stLower.includes("published") && post.published_url) {
            mediaCellHtml = `<a href="${escapeHtml(post.published_url)}" target="_blank" rel="noopener noreferrer" class="gb-live-post-link"><i class="fas fa-external-link-alt"></i> View Live Post</a>`;
          } else if (post.post_type !== "text" && post.media_name) {
            mediaCellHtml = `<span class="gb-media-badge" title="${escapeHtml(post.media_name)}"><i class="fas fa-photo-video"></i> ${escapeHtml(post.media_name)}</span>`;
          }

          const displayCaption = post.title
            ? `[${post.title}] ${post.caption || ""}`
            : post.caption || "No caption";

          const isPublished = stLower.includes("published");

          return `
            <tr data-post-row="${escapeHtml(post.id)}">
              <td class="gb-col-idx">${idx + 1}</td>
              <td>
                <div class="gb-sched-date">${escapeHtml(post.date)}</div>
                <div class="gb-sched-time">${escapeHtml(post.time)}</div>
              </td>
              <td>
                <span class="gb-platform-pill">
                  <i class="${escapeHtml(pMeta.icon)} ${escapeHtml(pMeta.colorClass)}"></i>
                  <span>${escapeHtml(pMeta.name)}</span>
                </span>
              </td>
              <td>
                <span class="gb-page-name">${escapeHtml(post.page_name)}</span>
              </td>
              <td>
                <span class="gb-format-badge ${escapeHtml(fmt.cls)}">
                  <i class="${escapeHtml(fmt.icon)}"></i>
                  <span>${escapeHtml(fmt.label)}</span>
                </span>
              </td>
              <td>${mediaCellHtml}</td>
              <td>
                <div class="gb-caption-clamp" title="${escapeHtml(displayCaption)}">${escapeHtml(displayCaption)}</div>
              </td>
              <td>${statusHtml}</td>
              <td>
                <div class="gb-row-actions">
                  ${
                    !isPublished
                      ? `<button type="button" class="gb-btn-publish-now" data-action-publish="${escapeHtml(post.id)}" title="Trigger immediate webhook dispatch">
                          <i class="fas fa-bolt"></i> Publish Now
                        </button>`
                      : ""
                  }
                  <button type="button" class="gb-btn-remove-post" data-action-remove="${escapeHtml(post.id)}" title="Remove post from queue">
                    <i class="fas fa-trash-alt"></i> Remove
                  </button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("");

      return `
        <div class="gb-table-scroll">
          <table class="gb-queue-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Schedule</th>
                <th>Platform</th>
                <th>Social Media Page</th>
                <th>Post Format</th>
                <th>Media / Link</th>
                <th>Caption</th>
                <th>Live Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      `;
    }

    function renderGlennBotSchedulerWorkspace(container) {
      if (!container) return;

      const totalQueueCount = gbSchedulerState.scheduledPostsList.length;
      const scheduledCalendarCount = gbSchedulerState.scheduledPostsList.length;

      container.innerHTML = `
        <div class="gb-scheduler-workspace" id="gb-scheduler-app">
          <!-- Top Sub-Navigation Bar -->
          <div class="gb-subnav-bar">
            <div class="gb-subnav-tabs" role="tablist" aria-label="GlennBot Social Scheduler Views">
              <button type="button" class="gb-subnav-btn ${gbSchedulerState.activeSubTab === "create" ? "is-active" : ""}" data-gb-subtab="create">
                <span>📝 Create Post</span>
              </button>
              <button type="button" class="gb-subnav-btn ${gbSchedulerState.activeSubTab === "queue" ? "is-active" : ""}" data-gb-subtab="queue">
                <span>⏳ Queue</span>
                <span class="gb-subnav-badge" id="gb-badge-queue">${totalQueueCount}</span>
              </button>
              <button type="button" class="gb-subnav-btn ${gbSchedulerState.activeSubTab === "calendar" ? "is-active" : ""}" data-gb-subtab="calendar">
                <span>📅 Calendar</span>
                <span class="gb-subnav-badge" id="gb-badge-calendar">${scheduledCalendarCount}</span>
              </button>
            </div>
            <div class="gb-workspace-status">
              <span class="status-dot-live" aria-hidden="true"></span>
              <span>GlennBot Omnichannel Engine &bull; Supabase + Gemini 2.5 Active</span>
            </div>
          </div>

          <!-- Toast Banner -->
          <div id="gb-scheduler-toast" class="gb-toast-banner" hidden>
            <i class="fas fa-check-circle"></i>
            <span id="gb-scheduler-toast-text"></span>
          </div>

          <!-- SUB-TAB 1: CREATE POST -->
          <div id="gb-subview-create" class="gb-subview ${gbSchedulerState.activeSubTab === "create" ? "is-active" : ""}">
            <div class="gb-create-grid">
              <!-- Left Column: Platforms & Connected Demo Accounts -->
              <div class="gb-create-left">
                <div class="gb-panel-card">
                  <h4 class="gb-panel-heading"><i class="fas fa-share-alt"></i> Platforms</h4>
                  <div class="gb-platform-list">
                    ${Object.keys(PLATFORM_META)
                      .map((pKey) => {
                        const meta = PLATFORM_META[pKey];
                        const isChecked = !!gbSchedulerState.selectedPlatforms[pKey];
                        return `
                          <label class="gb-platform-item ${isChecked ? "is-checked" : ""}">
                            <div class="gb-platform-item-left">
                              <input type="checkbox" class="gb-platform-checkbox" value="${pKey}" ${isChecked ? "checked" : ""} />
                              <i class="${meta.icon} ${meta.colorClass}"></i>
                              <span class="gb-platform-name">${meta.name}</span>
                            </div>
                            <span class="gb-platform-acct-badge">${meta.badgeText}</span>
                          </label>
                        `;
                      })
                      .join("")}
                  </div>

                  <!-- Connected Demo Accounts Status Box -->
                  <div class="gb-connected-accounts-box">
                    <div class="gb-connected-title">
                      <span>Connected Demo Accounts</span>
                      <span class="gb-connected-dot" title="OAuth Tokens Active"></span>
                    </div>
                    <ul class="gb-connected-list">
                      <li class="gb-connected-item">
                        <i class="fab fa-facebook gb-text-blue"></i>
                        <span>GlennBot AI Solutions (FB)</span>
                      </li>
                      <li class="gb-connected-item">
                        <i class="fab fa-instagram gb-text-pink"></i>
                        <span>@glennbot.ai (IG)</span>
                      </li>
                      <li class="gb-connected-item">
                        <i class="fab fa-tiktok gb-text-cyan"></i>
                        <span>@glennbot_automations (TikTok)</span>
                      </li>
                      <li class="gb-connected-item">
                        <i class="fab fa-youtube gb-text-red"></i>
                        <span>GlennBot Tech Channel (YT)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Right Column: Format Type, Ask AI Bar & Per-Platform Live Preview Cards -->
              <div class="gb-create-right">
                <div class="gb-panel-card">
                  <h4 class="gb-panel-heading"><i class="fas fa-sliders-h"></i> Format Type</h4>
                  <div class="gb-format-grid" role="radiogroup" aria-label="Post Format Type">
                    <label class="gb-format-option">
                      <input type="radio" name="gb-format-type" value="text" ${gbSchedulerState.formatType === "text" ? "checked" : ""} />
                      <div class="gb-format-card">
                        <i class="fas fa-align-left"></i>
                        <span>Text Post</span>
                      </div>
                    </label>
                    <label class="gb-format-option">
                      <input type="radio" name="gb-format-type" value="reels" ${gbSchedulerState.formatType === "reels" ? "checked" : ""} />
                      <div class="gb-format-card">
                        <i class="fas fa-mobile-alt"></i>
                        <span>Reels/Short</span>
                      </div>
                    </label>
                    <label class="gb-format-option">
                      <input type="radio" name="gb-format-type" value="video" ${gbSchedulerState.formatType === "video" ? "checked" : ""} />
                      <div class="gb-format-card">
                        <i class="fas fa-video"></i>
                        <span>16:9 Video</span>
                      </div>
                    </label>
                    <label class="gb-format-option">
                      <input type="radio" name="gb-format-type" value="image" ${gbSchedulerState.formatType === "image" ? "checked" : ""} />
                      <div class="gb-format-card">
                        <i class="fas fa-images"></i>
                        <span>Image/Album</span>
                      </div>
                    </label>
                  </div>

                  <!-- Live Preview Header Row + Ask AI Button -->
                  <div class="gb-preview-header-row">
                    <span class="gb-preview-label">
                      <i class="fas fa-eye"></i> Live Preview &amp; Platform Editors
                    </span>
                    <button type="button" class="gb-btn-ask-ai" id="gb-toggle-ask-ai-btn">
                      <span>✨ Ask AI (Gemini)</span>
                    </button>
                  </div>

                  <!-- Inline Gemini AI Caption & Title Generator Drawer -->
                  <div id="gb-ask-ai-drawer" class="gb-ask-ai-drawer" ${gbSchedulerState.askAiOpen ? "" : "hidden"}>
                    <div class="gb-ask-ai-top">
                      <span class="gb-ask-ai-title">
                        <i class="fas fa-robot"></i> Gemini 2.5 Omnichannel Copy &amp; Title Generator
                      </span>
                      <button type="button" class="gb-ask-ai-close" id="gb-close-ask-ai-btn">Close &times;</button>
                    </div>
                    <div class="gb-preset-chips">
                      <button type="button" class="gb-preset-chip" data-ai-preset="AI Workflow Case Study: Eliminating 90% of manual social media scheduling with FastAPI & Gemini">
                        ⚡ AI Workflow Case Study
                      </button>
                      <button type="button" class="gb-preset-chip" data-ai-preset="Manufacturing Kaizen Automation: Applying Toyota Production System principles to AI Agent pipelines">
                        🏭 Manufacturing Kaizen Automation
                      </button>
                      <button type="button" class="gb-preset-chip" data-ai-preset="SaaS Feature Launch: Introducing GlennBot Omnichannel Scheduler with Google Drive Vault sync">
                        🚀 SaaS Feature Launch
                      </button>
                    </div>
                    <div class="gb-ask-ai-controls">
                      <input
                        type="text"
                        id="gb-ai-topic-input"
                        class="gb-ai-topic-input"
                        placeholder="Describe your post topic, hook, or campaign..."
                        value="${escapeHtml(gbSchedulerState.askAiTopic)}"
                      />
                      <select id="gb-ai-tone-select" class="gb-ai-tone-select" aria-label="AI Tone">
                        <option value="Executive & High-Converting" ${gbSchedulerState.askAiTone === "Executive & High-Converting" ? "selected" : ""}>Tone: Executive &amp; High-Converting</option>
                        <option value="Taglish Tech Builder" ${gbSchedulerState.askAiTone === "Taglish Tech Builder" ? "selected" : ""}>Tone: Taglish Tech Builder</option>
                        <option value="Engaging & Story-Driven" ${gbSchedulerState.askAiTone === "Engaging & Story-Driven" ? "selected" : ""}>Tone: Engaging &amp; Story-Driven</option>
                      </select>
                      <button type="button" class="gb-btn-generate-apply" id="gb-ai-generate-btn">
                        <i class="fas fa-magic"></i>
                        <span>Generate &amp; Apply to Selected Platforms</span>
                      </button>
                    </div>
                  </div>

                  <!-- Per-Platform Editor Cards (#preview-container) -->
                  <div id="preview-container" class="gb-preview-container"></div>

                  <!-- Bottom Launch Bar -->
                  <div class="gb-launch-bar">
                    <button type="button" id="gb-launch-automation-btn" class="gb-btn-launch-automation">
                      <span>🚀 Launch Automation</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SUB-TAB 2: QUEUE -->
          <div id="gb-subview-queue" class="gb-subview ${gbSchedulerState.activeSubTab === "queue" ? "is-active" : ""}">
            <div class="gb-panel-card">
              <div class="gb-queue-topbar">
                <div>
                  <h4 class="gb-queue-title">
                    <i class="fas fa-list-ul" style="color:#a855f7;"></i>
                    <span>Scheduled Posts Queue (Tabular View)</span>
                  </h4>
                  <p class="gb-queue-subtitle">Chronological master table &bull; Stored in Supabase PostgreSQL (30-Day Retention)</p>
                </div>
                <div class="gb-queue-controls">
                  <select id="gb-queue-filter-select" class="gb-queue-filter-select" aria-label="Filter Queue by Status">
                    <option value="all" ${gbSchedulerState.queueFilter === "all" ? "selected" : ""}>All Statuses</option>
                    <option value="processing" ${gbSchedulerState.queueFilter === "processing" ? "selected" : ""}>Processing Payload</option>
                    <option value="waiting" ${gbSchedulerState.queueFilter === "waiting" ? "selected" : ""}>Waiting / Scheduled</option>
                    <option value="published" ${gbSchedulerState.queueFilter === "published" ? "selected" : ""}>Published</option>
                    <option value="failed" ${gbSchedulerState.queueFilter === "failed" ? "selected" : ""}>Failed</option>
                  </select>
                  <button type="button" id="gb-queue-refresh-btn" class="gb-btn-queue-refresh">
                    <i class="fas fa-sync-alt"></i> Refresh
                  </button>
                </div>
              </div>
              <div id="gb-queue-table-container"></div>
            </div>
          </div>

          <!-- SUB-TAB 3: CALENDAR -->
          <div id="gb-subview-calendar" class="gb-subview ${gbSchedulerState.activeSubTab === "calendar" ? "is-active" : ""}">
            <div class="gb-panel-card">
              <div class="gb-calendar-topbar">
                <h4 class="gb-queue-title">
                  <i class="fas fa-calendar-alt" style="color:#22d3ee;"></i>
                  <span>Social Media Scheduled Posts Calendar</span>
                </h4>
                <div class="gb-calendar-nav">
                  <button type="button" class="gb-cal-nav-btn" id="gb-cal-prev-btn" title="Previous Month">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <select id="gb-cal-month-select" class="gb-cal-select" aria-label="Select Month"></select>
                  <select id="gb-cal-year-select" class="gb-cal-select" aria-label="Select Year"></select>
                  <button type="button" class="gb-cal-nav-btn" id="gb-cal-next-btn" title="Next Month">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                  <button type="button" class="gb-cal-today-btn" id="gb-cal-today-btn">Today</button>
                </div>
              </div>

              <!-- 7-Column Calendar Weekday Header -->
              <div class="gb-calendar-weekdays">
                <div class="gb-cal-weekday">Sun</div>
                <div class="gb-cal-weekday">Mon</div>
                <div class="gb-cal-weekday">Tue</div>
                <div class="gb-cal-weekday">Wed</div>
                <div class="gb-cal-weekday">Thu</div>
                <div class="gb-cal-weekday">Fri</div>
                <div class="gb-cal-weekday">Sat</div>
              </div>

              <!-- 7-Column Monthly Calendar Grid -->
              <div id="gb-calendar-grid" class="gb-calendar-grid"></div>

              <!-- Day Schedule Inspector -->
              <div id="gb-day-inspector" class="gb-day-inspector" hidden></div>
            </div>
          </div>
        </div>
      `;

      const toastEl = container.querySelector("#gb-scheduler-toast");
      const toastTextEl = container.querySelector("#gb-scheduler-toast-text");
      let toastTimer = null;

      function showSchedulerToast(msg) {
        if (!toastEl || !toastTextEl) return;
        toastTextEl.textContent = msg;
        toastEl.hidden = false;
        if (toastTimer) window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => {
          toastEl.hidden = true;
        }, 4200);
      }

      function updateBadgeCounters() {
        const qBadge = container.querySelector("#gb-badge-queue");
        const cBadge = container.querySelector("#gb-badge-calendar");
        const total = gbSchedulerState.scheduledPostsList.length;
        if (qBadge) qBadge.textContent = String(total);
        if (cBadge) cBadge.textContent = String(total);
      }

      function switchSubTab(subTab) {
        gbSchedulerState.activeSubTab = subTab;
        container.querySelectorAll("[data-gb-subtab]").forEach((btn) => {
          btn.classList.toggle("is-active", btn.getAttribute("data-gb-subtab") === subTab);
        });
        const map = {
          create: container.querySelector("#gb-subview-create"),
          queue: container.querySelector("#gb-subview-queue"),
          calendar: container.querySelector("#gb-subview-calendar"),
        };
        Object.keys(map).forEach((k) => {
          if (map[k]) {
            map[k].classList.toggle("is-active", k === subTab);
          }
        });
        if (subTab === "create") {
          updatePreviews();
        } else if (subTab === "queue") {
          renderQueueTable();
        } else if (subTab === "calendar") {
          renderCalendar();
        }
      }

      // Render Per-Platform Live Preview Cards inside #preview-container
      function updatePreviews() {
        const previewContainer = container.querySelector("#preview-container");
        if (!previewContainer) return;

        const checkedPlatforms = Object.keys(PLATFORM_META).filter(
          (p) => gbSchedulerState.selectedPlatforms[p]
        );

        if (checkedPlatforms.length === 0) {
          previewContainer.innerHTML = `
            <div class="gb-empty-preview">
              <i class="fas fa-hand-point-left"></i>
              <p>Select at least one platform on the left to start configuring your omnichannel post.</p>
            </div>
          `;
          return;
        }

        const formatType = gbSchedulerState.formatType;

        previewContainer.innerHTML = checkedPlatforms
          .map((pKey) => {
            const meta = PLATFORM_META[pKey];
            const draft = gbSchedulerState.platformDrafts[pKey];
            const isIncompatible = isPlatformFormatIncompatible(pKey, formatType);

            const accountOptionsHtml = meta.accounts
              .map(
                (acct) =>
                  `<option value="${escapeHtml(acct.label)}" ${
                    draft.accountLabel === acct.label ? "selected" : ""
                  }>${escapeHtml(acct.label)}</option>`
              )
              .join("");

            if (isIncompatible) {
              return `
                <div class="gb-platform-editor-card" data-platform-card="${pKey}">
                  <div class="gb-platform-card-header">
                    <div class="gb-platform-card-identity">
                      <span class="gb-platform-circle-icon" style="background:${meta.bgColor};">
                        <i class="${meta.icon}"></i>
                      </span>
                      <span class="gb-platform-card-title">${meta.name}</span>
                    </div>
                  </div>
                  <div class="gb-format-warning-banner">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>This platform requires an Image or Video format.</span>
                  </div>
                </div>
              `;
            }

            const editorInputsHtml =
              pKey === "youtube"
                ? `
                  <div>
                    <label class="gb-editor-field-label">YouTube Video / Short Title</label>
                    <input
                      type="text"
                      class="gb-editor-input"
                      data-draft-field="title"
                      data-platform="${pKey}"
                      placeholder="Enter YouTube Video Title..."
                      value="${escapeHtml(draft.title || "")}"
                    />
                  </div>
                  <div>
                    <label class="gb-editor-field-label">YouTube Description &amp; Tags</label>
                    <textarea
                      rows="3"
                      class="gb-editor-textarea"
                      data-draft-field="caption"
                      data-platform="${pKey}"
                      placeholder="Write your YouTube description..."
                    >${escapeHtml(draft.caption || "")}</textarea>
                  </div>
                `
                : `
                  <div>
                    <label class="gb-editor-field-label">${meta.name} Post Caption &amp; Hashtags</label>
                    <textarea
                      rows="3"
                      class="gb-editor-textarea"
                      data-draft-field="caption"
                      data-platform="${pKey}"
                      placeholder="Write your ${meta.name} caption..."
                    >${escapeHtml(draft.caption || "")}</textarea>
                  </div>
                `;

            let mediaBoxHtml = "";
            if (formatType !== "text") {
              const attached = draft.media;
              const isVaultOpen = gbSchedulerState.activeVaultPickerPlatform === pKey;

              const vaultItemsHtml = VAULT_FILES_LIST.map((vFile) => {
                const isSelected = attached && attached.id === vFile.id;
                return `
                  <div class="gb-vault-item ${isSelected ? "is-selected" : ""}" data-select-vault="${vFile.id}" data-platform="${pKey}">
                    <img src="${escapeHtml(vFile.thumbUrl)}" alt="${escapeHtml(vFile.name)}" class="gb-vault-item-thumb" />
                    <div class="gb-vault-item-info">
                      <div class="gb-vault-item-name">${escapeHtml(vFile.name)}</div>
                      <div class="gb-vault-item-type">${escapeHtml(vFile.sizeLabel)}</div>
                    </div>
                  </div>
                `;
              }).join("");

              mediaBoxHtml = `
                <div class="gb-media-attachment-box">
                  <div class="gb-media-box-top">
                    <div class="gb-media-selected-info">
                      ${
                        attached
                          ? `<img src="${escapeHtml(attached.thumbUrl)}" alt="${escapeHtml(attached.name)}" class="gb-media-thumb" />`
                          : `<div class="gb-media-icon-placeholder"><i class="fas fa-photo-video"></i></div>`
                      }
                      <div class="gb-media-meta">
                        <div class="gb-media-filename">${
                          attached ? escapeHtml(attached.name) : "No media file attached yet"
                        }</div>
                        <div class="gb-media-sub">${
                          attached
                            ? escapeHtml(attached.sizeLabel || attached.mimeType || "Ready for chunked upload")
                            : "Select from Google Drive Vault or upload local video/image"
                        }</div>
                      </div>
                    </div>
                    <div class="gb-media-actions">
                      <button type="button" class="gb-btn-vault-picker" data-toggle-vault="${pKey}">
                        <i class="fab fa-google-drive"></i>
                        <span>Google Drive Files Vault</span>
                      </button>
                      <label class="gb-btn-local-upload">
                        <i class="fas fa-upload"></i>
                        <span>Upload Local</span>
                        <input type="file" accept="image/*,video/*" data-local-file="${pKey}" hidden />
                      </label>
                    </div>
                  </div>
                  <div class="gb-vault-picker-drawer" ${isVaultOpen ? "" : "hidden"}>
                    <div class="gb-vault-picker-header">
                      <span><i class="fab fa-google-drive"></i> Select Pre-Synced Media from Google Drive Vault</span>
                      <button type="button" class="gb-ask-ai-close" data-toggle-vault="${pKey}">Close &times;</button>
                    </div>
                    <div class="gb-vault-grid">
                      ${vaultItemsHtml}
                    </div>
                  </div>
                </div>
              `;
            }

            return `
              <div class="gb-platform-editor-card" data-platform-card="${pKey}">
                <div class="gb-platform-card-header">
                  <div class="gb-platform-card-identity">
                    <span class="gb-platform-circle-icon" style="background:${meta.bgColor};">
                      <i class="${meta.icon}"></i>
                    </span>
                    <span class="gb-platform-card-title">${meta.name}</span>
                    <select class="gb-account-select" data-draft-field="accountLabel" data-platform="${pKey}" aria-label="${meta.name} Account">
                      ${accountOptionsHtml}
                    </select>
                  </div>
                  <div class="gb-schedule-Config">
                    <span class="gb-schedule-label"><i class="far fa-clock"></i> Schedule:</span>
                    <input
                      type="date"
                      class="gb-datetime-input"
                      data-draft-field="date"
                      data-platform="${pKey}"
                      value="${escapeHtml(draft.date)}"
                      aria-label="${meta.name} Schedule Date"
                    />
                    <input
                      type="time"
                      class="gb-datetime-input"
                      data-draft-field="time"
                      data-platform="${pKey}"
                      value="${escapeHtml(draft.time)}"
                      aria-label="${meta.name} Schedule Time"
                    />
                  </div>
                </div>
                ${editorInputsHtml}
                ${mediaBoxHtml}
              </div>
            `;
          })
          .join("");

        // Bind events inside #preview-container
        previewContainer.querySelectorAll("[data-draft-field]").forEach((inputEl) => {
          inputEl.addEventListener("input", () => {
            const pKey = inputEl.getAttribute("data-platform");
            const field = inputEl.getAttribute("data-draft-field");
            if (pKey && field && gbSchedulerState.platformDrafts[pKey]) {
              gbSchedulerState.platformDrafts[pKey][field] = inputEl.value;
            }
          });
        });

        previewContainer.querySelectorAll("[data-toggle-vault]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const pKey = btn.getAttribute("data-toggle-vault");
            gbSchedulerState.activeVaultPickerPlatform =
              gbSchedulerState.activeVaultPickerPlatform === pKey ? null : pKey;
            updatePreviews();
          });
        });

        previewContainer.querySelectorAll("[data-select-vault]").forEach((itemEl) => {
          itemEl.addEventListener("click", () => {
            const vaultId = itemEl.getAttribute("data-select-vault");
            const pKey = itemEl.getAttribute("data-platform");
            const found = VAULT_FILES_LIST.find((f) => f.id === vaultId);
            if (found && pKey && gbSchedulerState.platformDrafts[pKey]) {
              gbSchedulerState.platformDrafts[pKey].media = found;
              gbSchedulerState.activeVaultPickerPlatform = null;
              updatePreviews();
              showSchedulerToast(`Attached "${found.name}" from Google Drive Vault to ${PLATFORM_META[pKey].name}.`);
            }
          });
        });

        previewContainer.querySelectorAll("[data-local-file]").forEach((fileInput) => {
          fileInput.addEventListener("change", () => {
            const pKey = fileInput.getAttribute("data-local-file");
            const file = fileInput.files && fileInput.files[0];
            if (!file || !pKey || !gbSchedulerState.platformDrafts[pKey]) return;
            const objectUrl = URL.createObjectURL(file);
            const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
            gbSchedulerState.platformDrafts[pKey].media = {
              id: "local_" + Date.now(),
              name: file.name,
              mimeType: file.type || "image/png",
              sizeLabel: `${sizeMb} MB • Local Upload`,
              thumbUrl: file.type.startsWith("image/") ? objectUrl : "/assets/aistudio/image_0f71ad01.png",
              previewUrl: objectUrl,
            };
            updatePreviews();
            showSchedulerToast(`Uploaded local file "${file.name}" to ${PLATFORM_META[pKey].name}.`);
          });
        });
      }

      // Render Queue Sub-Tab Table
      function renderQueueTable() {
        const qContainer = container.querySelector("#gb-queue-table-container");
        if (!qContainer) return;

        const filterVal = gbSchedulerState.queueFilter;
        const filtered = gbSchedulerState.scheduledPostsList.filter((post) => {
          if (filterVal === "all") return true;
          const st = (post.status || "").toLowerCase();
          return st.includes(filterVal);
        });

        qContainer.innerHTML = buildPostsTableHTML(filtered);
        bindQueueTableActions(qContainer);
      }

      function bindQueueTableActions(scopeEl) {
        if (!scopeEl) return;

        scopeEl.querySelectorAll("[data-action-publish]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const postId = btn.getAttribute("data-action-publish");
            const target = gbSchedulerState.scheduledPostsList.find((p) => p.id === postId);
            if (target) {
              target.status = "Published";
              target.published_url = `https://glennbot.automations/live/${target.platform}/${target.id}`;
              showSchedulerToast(`🚀 Dispatched ${PLATFORM_META[target.platform].name} post (${target.page_name}) — Status: Published!`);
              renderQueueTable();
              if (gbSchedulerState.activeSubTab === "calendar") {
                renderCalendar();
              }
            }
          });
        });

        scopeEl.querySelectorAll("[data-action-remove]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const postId = btn.getAttribute("data-action-remove");
            const idx = gbSchedulerState.scheduledPostsList.findIndex((p) => p.id === postId);
            if (idx !== -1) {
              const removed = gbSchedulerState.scheduledPostsList.splice(idx, 1)[0];
              updateBadgeCounters();
              showSchedulerToast(`Removed scheduled ${PLATFORM_META[removed.platform].name} post from Queue.`);
              renderQueueTable();
              if (gbSchedulerState.activeSubTab === "calendar") {
                renderCalendar();
              }
            }
          });
        });
      }

      // Render Calendar Sub-Tab
      function renderCalendar() {
        const monthSelect = container.querySelector("#gb-cal-month-select");
        const yearSelect = container.querySelector("#gb-cal-year-select");
        const calGrid = container.querySelector("#gb-calendar-grid");
        const dayInspector = container.querySelector("#gb-day-inspector");
        if (!calGrid || !monthSelect || !yearSelect) return;

        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December",
        ];

        monthSelect.innerHTML = monthNames
          .map(
            (mName, idx) =>
              `<option value="${idx}" ${idx === gbSchedulerState.calendarMonth ? "selected" : ""}>${mName}</option>`
          )
          .join("");

        const baseYear = nowDate.getFullYear();
        const years = [baseYear - 1, baseYear, baseYear + 1];
        yearSelect.innerHTML = years
          .map(
            (yr) =>
              `<option value="${yr}" ${yr === gbSchedulerState.calendarYear ? "selected" : ""}>${yr}</option>`
          )
          .join("");

        const year = gbSchedulerState.calendarYear;
        const month = gbSchedulerState.calendarMonth;
        const firstDayWeekIdx = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const cellsHtml = [];
        for (let i = 0; i < firstDayWeekIdx; i++) {
          cellsHtml.push(`<div class="gb-cal-cell is-empty"></div>`);
        }

        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = dateStr === todayStr;
          const isInspected = dateStr === gbSchedulerState.inspectedCalendarDate;
          const dayPosts = gbSchedulerState.scheduledPostsList.filter((p) => p.date === dateStr);

          const pillsHtml = dayPosts
            .map((post) => {
              const pMeta = PLATFORM_META[post.platform] || PLATFORM_META.facebook;
              const isPub = (post.status || "").toLowerCase().includes("published");
              const statusIcon = isPub
                ? `<i class="fas fa-check-circle" style="color:#34d399;"></i>`
                : `<i class="fas fa-clock" style="color:#fbbf24;"></i>`;
              return `
                <div class="gb-cal-pill" title="${escapeHtml(pMeta.name + " • " + post.time + " • " + (post.caption || ""))}">
                  <i class="${pMeta.icon} ${pMeta.colorClass}"></i>
                  <span class="gb-cal-pill-time">${escapeHtml(post.time)}</span>
                  ${statusIcon}
                </div>
              `;
            })
            .join("");

          cellsHtml.push(`
            <div class="gb-cal-cell ${isToday ? "is-today" : ""} ${isInspected ? "is-selected" : ""}" data-cal-date="${dateStr}">
              <div class="gb-cal-day-header">
                <span class="gb-cal-day-num">${day}</span>
                ${
                  isToday
                    ? `<span class="gb-cal-today-tag">Today</span>`
                    : `<span class="gb-cal-expand-icon" title="Inspect Day Schedule"><i class="fas fa-expand-alt"></i></span>`
                }
              </div>
              <div class="gb-cal-pills-list">
                ${pillsHtml}
              </div>
            </div>
          `);
        }

        calGrid.innerHTML = cellsHtml.join("");

        calGrid.querySelectorAll("[data-cal-date]").forEach((cell) => {
          cell.addEventListener("click", () => {
            const clickedDate = cell.getAttribute("data-cal-date");
            if (clickedDate) {
              gbSchedulerState.inspectedCalendarDate = clickedDate;
              renderCalendar();
            }
          });
        });

        // Render Day Schedule Inspector below calendar grid
        if (dayInspector && gbSchedulerState.inspectedCalendarDate) {
          const selDate = gbSchedulerState.inspectedCalendarDate;
          const dayPosts = gbSchedulerState.scheduledPostsList.filter((p) => p.date === selDate);
          dayInspector.hidden = false;
          dayInspector.innerHTML = `
            <div class="gb-day-inspector-header">
              <div class="gb-day-inspector-title">
                <i class="fas fa-calendar-day" style="color:#22d3ee;"></i>
                <span>Day Schedule Inspector: <strong>${escapeHtml(selDate)}</strong> (${dayPosts.length} post${dayPosts.length === 1 ? "" : "s"})</span>
              </div>
              <button type="button" class="gb-btn-schedule-on-date" id="gb-schedule-on-date-btn" data-target-date="${escapeHtml(selDate)}">
                <span>+ Schedule Post on This Date</span>
              </button>
            </div>
            ${buildPostsTableHTML(dayPosts)}
          `;

          bindQueueTableActions(dayInspector);

          const jumpBtn = dayInspector.querySelector("#gb-schedule-on-date-btn");
          if (jumpBtn) {
            jumpBtn.addEventListener("click", () => {
              const targetDate = jumpBtn.getAttribute("data-target-date") || todayStr;
              Object.keys(gbSchedulerState.platformDrafts).forEach((pKey) => {
                gbSchedulerState.platformDrafts[pKey].date = targetDate;
              });
              switchSubTab("create");
              showSchedulerToast(`📅 Pre-filled schedule date ${targetDate} across all selected platforms.`);
            });
          }
        }
      }

      // Sub-nav tab clicks
      container.querySelectorAll("[data-gb-subtab]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const target = btn.getAttribute("data-gb-subtab");
          if (target) switchSubTab(target);
        });
      });

      // Platform checkbox toggles
      container.querySelectorAll(".gb-platform-checkbox").forEach((cb) => {
        cb.addEventListener("change", () => {
          const pKey = cb.value;
          gbSchedulerState.selectedPlatforms[pKey] = cb.checked;
          const parentLabel = cb.closest(".gb-platform-item");
          if (parentLabel) {
            parentLabel.classList.toggle("is-checked", cb.checked);
          }
          updatePreviews();
        });
      });

      // Format Type radio buttons
      container.querySelectorAll('input[name="gb-format-type"]').forEach((radio) => {
        radio.addEventListener("change", () => {
          if (radio.checked) {
            gbSchedulerState.formatType = radio.value;
            updatePreviews();
          }
        });
      });

      // Ask AI Drawer toggle & presets & generate
      const toggleAskAiBtn = container.querySelector("#gb-toggle-ask-ai-btn");
      const closeAskAiBtn = container.querySelector("#gb-close-ask-ai-btn");
      const askAiDrawer = container.querySelector("#gb-ask-ai-drawer");
      const aiTopicInput = container.querySelector("#gb-ai-topic-input");
      const aiToneSelect = container.querySelector("#gb-ai-tone-select");
      const aiGenerateBtn = container.querySelector("#gb-ai-generate-btn");

      if (toggleAskAiBtn && askAiDrawer) {
        toggleAskAiBtn.addEventListener("click", () => {
          gbSchedulerState.askAiOpen = !gbSchedulerState.askAiOpen;
          askAiDrawer.hidden = !gbSchedulerState.askAiOpen;
        });
      }

      if (closeAskAiBtn && askAiDrawer) {
        closeAskAiBtn.addEventListener("click", () => {
          gbSchedulerState.askAiOpen = false;
          askAiDrawer.hidden = true;
        });
      }

      container.querySelectorAll("[data-ai-preset]").forEach((chip) => {
        chip.addEventListener("click", () => {
          const presetText = chip.getAttribute("data-ai-preset") || "";
          gbSchedulerState.askAiTopic = presetText;
          if (aiTopicInput) aiTopicInput.value = presetText;
        });
      });

      if (aiGenerateBtn) {
        aiGenerateBtn.addEventListener("click", async () => {
          const topic = aiTopicInput ? aiTopicInput.value.trim() : gbSchedulerState.askAiTopic;
          const tone = aiToneSelect ? aiToneSelect.value : gbSchedulerState.askAiTone;
          gbSchedulerState.askAiTopic = topic || "AI Workflow Automation";
          gbSchedulerState.askAiTone = tone;

          const checkedPlatforms = Object.keys(PLATFORM_META).filter(
            (p) => gbSchedulerState.selectedPlatforms[p]
          );

          aiGenerateBtn.disabled = true;
          aiGenerateBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>Synthesizing via Gemini 2.5...</span>`;

          try {
            const res = await fetch("/api/v1/ai/caption", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                topic: gbSchedulerState.askAiTopic,
                tone: gbSchedulerState.askAiTone,
                platforms: checkedPlatforms.join(", "),
              }),
            });
            const rawData = await res.json();
            const data = rawData.output || rawData.data || rawData;

            checkedPlatforms.forEach((pKey) => {
              if (pKey === "youtube") {
                gbSchedulerState.platformDrafts.youtube.title =
                  data.youtube_title || data.title || `${gbSchedulerState.askAiTopic} #Shorts`;
                gbSchedulerState.platformDrafts.youtube.caption =
                  data.youtube_description || data.caption || gbSchedulerState.platformDrafts.youtube.caption;
              } else if (pKey === "facebook") {
                gbSchedulerState.platformDrafts.facebook.caption =
                  data.facebook_caption || data.caption || gbSchedulerState.platformDrafts.facebook.caption;
              } else if (pKey === "instagram") {
                gbSchedulerState.platformDrafts.instagram.caption =
                  data.instagram_caption || data.caption || gbSchedulerState.platformDrafts.instagram.caption;
              } else if (pKey === "tiktok") {
                gbSchedulerState.platformDrafts.tiktok.caption =
                  data.tiktok_caption || data.caption || gbSchedulerState.platformDrafts.tiktok.caption;
              }
            });

            updatePreviews();
            showSchedulerToast(
              `✨ Gemini 2.5 generated & applied platform-optimized captions to ${checkedPlatforms.length} selected platform(s)!`
            );
          } catch (err) {
            showSchedulerToast(`AI generation error: ${String(err)}`);
          } finally {
            aiGenerateBtn.disabled = false;
            aiGenerateBtn.innerHTML = `<i class="fas fa-magic"></i> <span>Generate & Apply to Selected Platforms</span>`;
          }
        });
      }

      // 🚀 Launch Automation button (submitPost)
      const launchBtn = container.querySelector("#gb-launch-automation-btn");
      if (launchBtn) {
        launchBtn.addEventListener("click", async () => {
          const checkedPlatforms = Object.keys(PLATFORM_META).filter(
            (p) => gbSchedulerState.selectedPlatforms[p]
          );

          if (checkedPlatforms.length === 0) {
            showSchedulerToast("⚠️ Please select at least one social platform before launching.");
            return;
          }

          const incompatible = checkedPlatforms.filter((p) =>
            isPlatformFormatIncompatible(p, gbSchedulerState.formatType)
          );
          if (incompatible.length > 0) {
            const names = incompatible.map((p) => PLATFORM_META[p].name).join(", ");
            showSchedulerToast(
              `⚠️ Cannot launch: ${names} requires an Image or Video format.`
            );
            return;
          }

          launchBtn.disabled = true;
          launchBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>Dispatching to Supabase Queue...</span>`;

          const postsPayload = checkedPlatforms.map((pKey) => {
            const draft = gbSchedulerState.platformDrafts[pKey];
            return {
              platform: pKey,
              page_name: draft.accountLabel,
              date: draft.date || todayStr,
              time: draft.time || "18:00",
              post_type: gbSchedulerState.formatType,
              title: pKey === "youtube" ? draft.title : "",
              caption: draft.caption,
              media_name:
                gbSchedulerState.formatType === "text"
                  ? ""
                  : draft.media
                  ? draft.media.name
                  : "glennbot_demo_reel.mp4",
              media_thumb:
                gbSchedulerState.formatType === "text"
                  ? ""
                  : draft.media
                  ? draft.media.thumbUrl
                  : "/assets/aistudio/image_0f71ad01.png",
            };
          });

          try {
            await fetch("/api/v1/scheduler/launch", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                format_type: gbSchedulerState.formatType,
                posts: postsPayload,
              }),
            });
          } catch (_) {
            // Continue local queue insertion even if offline
          }

          const newEntries = postsPayload.map((item, idx) => ({
            id: `post_live_${Date.now()}_${idx}`,
            date: item.date,
            time: item.time,
            platform: item.platform,
            page_name: item.page_name,
            post_type: item.post_type,
            title: item.title,
            caption: item.caption,
            status: "Waiting / Scheduled",
            media_name: item.media_name,
            media_thumb: item.media_thumb,
            published_url: "",
          }));

          gbSchedulerState.scheduledPostsList.unshift(...newEntries);
          if (newEntries[0] && newEntries[0].date) {
            gbSchedulerState.inspectedCalendarDate = newEntries[0].date;
          }
          updateBadgeCounters();

          launchBtn.disabled = false;
          launchBtn.innerHTML = `<span>🚀 Launch Automation</span>`;

          switchSubTab("queue");
          showSchedulerToast(
            `✅ Scheduled ${newEntries.length} post(s) to Queue & Calendar!`
          );
        });
      }

      // Queue filter & refresh controls
      const queueFilterSelect = container.querySelector("#gb-queue-filter-select");
      const queueRefreshBtn = container.querySelector("#gb-queue-refresh-btn");
      if (queueFilterSelect) {
        queueFilterSelect.addEventListener("change", () => {
          gbSchedulerState.queueFilter = queueFilterSelect.value;
          renderQueueTable();
        });
      }
      if (queueRefreshBtn) {
        queueRefreshBtn.addEventListener("click", () => {
          renderQueueTable();
          showSchedulerToast("🔄 Synced Queue state with Supabase PostgreSQL master table.");
        });
      }

      // Calendar navigation controls
      const calPrevBtn = container.querySelector("#gb-cal-prev-btn");
      const calNextBtn = container.querySelector("#gb-cal-next-btn");
      const calTodayBtn = container.querySelector("#gb-cal-today-btn");
      const calMonthSelect = container.querySelector("#gb-cal-month-select");
      const calYearSelect = container.querySelector("#gb-cal-year-select");

      if (calPrevBtn) {
        calPrevBtn.addEventListener("click", () => {
          gbSchedulerState.calendarMonth -= 1;
          if (gbSchedulerState.calendarMonth < 0) {
            gbSchedulerState.calendarMonth = 11;
            gbSchedulerState.calendarYear -= 1;
          }
          renderCalendar();
        });
      }
      if (calNextBtn) {
        calNextBtn.addEventListener("click", () => {
          gbSchedulerState.calendarMonth += 1;
          if (gbSchedulerState.calendarMonth > 11) {
            gbSchedulerState.calendarMonth = 0;
            gbSchedulerState.calendarYear += 1;
          }
          renderCalendar();
        });
      }
      if (calTodayBtn) {
        calTodayBtn.addEventListener("click", () => {
          gbSchedulerState.calendarMonth = nowDate.getMonth();
          gbSchedulerState.calendarYear = nowDate.getFullYear();
          gbSchedulerState.inspectedCalendarDate = todayStr;
          renderCalendar();
        });
      }
      if (calMonthSelect) {
        calMonthSelect.addEventListener("change", () => {
          gbSchedulerState.calendarMonth = parseInt(calMonthSelect.value, 10);
          renderCalendar();
        });
      }
      if (calYearSelect) {
        calYearSelect.addEventListener("change", () => {
          gbSchedulerState.calendarYear = parseInt(calYearSelect.value, 10);
          renderCalendar();
        });
      }

      // Initial render of active sub-tab
      updatePreviews();
      renderQueueTable();
      renderCalendar();
    }

    function renderProjectPanels(projectId) {
      const proj = PROJECTS_DATA[projectId];
      if (!proj) return;

      sysIdEl.textContent = proj.sysId;
      categoryEl.textContent = proj.category;
      endpointEl.textContent = proj.endpoint;
      titleEl.textContent = proj.title;

      // 1. Render Case Study Tab
      panelCaseStudy.innerHTML = `
        <div class="modal-case-grid">
          <div class="modal-case-card">
            <span class="modal-section-eyebrow">Operational Bottleneck</span>
            <h4 class="modal-section-heading">The Challenge</h4>
            <p class="modal-section-text">${escapeHtml(proj.bottleneck)}</p>
          </div>
          <div class="modal-case-card modal-case-card-accent">
            <span class="modal-section-eyebrow">Engineered Solution</span>
            <h4 class="modal-section-heading">GlennBot Architecture</h4>
            <p class="modal-section-text">${escapeHtml(proj.solution)}</p>
          </div>
        </div>
        <div class="modal-arch-steps">
          <h4 class="modal-section-heading">End-to-End Execution Pipeline</h4>
          <ol class="modal-step-list">
            ${proj.architectureSteps
              .map(
                (step, idx) => `
              <li>
                <span class="modal-step-num">0${idx + 1}</span>
                <span>${escapeHtml(step)}</span>
              </li>`
              )
              .join("")}
          </ol>
        </div>
        <div class="modal-kpi-row">
          ${proj.metrics
            .map(
              (m) => `
            <div class="modal-kpi-box">
              <strong class="modal-kpi-val">${escapeHtml(m.value)}</strong>
              <span class="modal-kpi-lbl">${escapeHtml(m.label)}</span>
            </div>`
            )
            .join("")}
        </div>
        <div class="modal-case-footer">
          <button type="button" class="btn-project-widget" data-switch-tab="live-widget">
            <span>${projectId === "social-scheduler" ? "⚡ Launch Expanded Widget &rarr;" : "Launch Interactive API Widget &rarr;"}</span>
          </button>
        </div>
      `;

      const switchBtn = panelCaseStudy.querySelector("[data-switch-tab]");
      if (switchBtn) {
        switchBtn.addEventListener("click", () => setActiveTab("live-widget"));
      }

      // 2. Render Source Code Tab
      panelSourceCode.innerHTML = `
        <div class="code-viewer-frame">
          <div class="code-viewer-topbar">
            <span class="code-file-path">${escapeHtml(proj.sourceFile)}</span>
            <button type="button" class="btn-copy-code" id="modal-copy-code-btn">Copy FastAPI Code</button>
          </div>
          <pre class="code-viewer-pre"><code>${escapeHtml(proj.sourceCode)}</code></pre>
        </div>
      `;

      const copyBtn = document.getElementById("modal-copy-code-btn");
      if (copyBtn) {
        copyBtn.addEventListener("click", () => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(proj.sourceCode).catch(() => {});
          }
          copyBtn.textContent = "Copied to Clipboard ✓";
          window.setTimeout(() => {
            copyBtn.textContent = "Copy FastAPI Code";
          }, 1800);
        });
      }

      // 3. Render Tab 03: Expanded GlennBot Social Scheduler Workspace for SYS-01, or Live API Widget for SYS-02..04
      if (projectId === "social-scheduler") {
        renderGlennBotSchedulerWorkspace(panelLiveWidget);
        return;
      }

      const fieldsHtml = proj.widgetFields
        .map((field) => {
          if (field.type === "select") {
            return `
              <label class="widget-field">
                <span class="widget-field-label">${escapeHtml(field.label)}</span>
                <select name="${escapeHtml(field.name)}" class="widget-input">
                  ${field.options
                    .map(
                      (opt) =>
                        `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`
                    )
                    .join("")}
                </select>
              </label>`;
          }
          if (field.type === "textarea") {
            return `
              <label class="widget-field">
                <span class="widget-field-label">${escapeHtml(field.label)}</span>
                <textarea name="${escapeHtml(field.name)}" rows="3" class="widget-input">${escapeHtml(field.value || "")}</textarea>
              </label>`;
          }
          return `
            <label class="widget-field">
              <span class="widget-field-label">${escapeHtml(field.label)}</span>
              <input type="${escapeHtml(field.type || "text")}" name="${escapeHtml(field.name)}" value="${escapeHtml(field.value || "")}" class="widget-input" />
            </label>`;
        })
        .join("");

      panelLiveWidget.innerHTML = `
        <div class="live-widget-grid">
          <form id="live-api-widget-form" class="live-widget-form">
            <div class="widget-form-header">
              <span class="status-dot-live" aria-hidden="true"></span>
              <span>Live FastAPI Endpoint: <code>${escapeHtml(proj.endpoint)}</code></span>
            </div>
            ${fieldsHtml}
            <button type="submit" id="widget-submit-btn" class="btn-widget-execute">
              <span>Execute Live API Request</span>
            </button>
          </form>

          <div class="live-widget-output">
            <div class="widget-output-topbar">
              <span>Server Telemetry &amp; JSON Response</span>
              <span id="widget-status-badge" class="widget-status-pill">READY &bull; 200 OK</span>
            </div>
            <pre id="widget-json-output" class="widget-json-pre">Click "Execute Live API Request" to send a real POST payload to the FastAPI backend...</pre>
          </div>
        </div>
      `;

      const form = document.getElementById("live-api-widget-form");
      const jsonOut = document.getElementById("widget-json-output");
      const statusBadge = document.getElementById("widget-status-badge");
      const submitBtn = document.getElementById("widget-submit-btn");

      async function executeDemoRequest() {
        if (!form || !jsonOut) return;
        const formData = new FormData(form);
        const payload = {};
        formData.forEach((val, key) => {
          payload[key] = val;
        });

        if (submitBtn) submitBtn.disabled = true;
        if (statusBadge) statusBadge.textContent = "EXECUTING...";

        try {
          const res = await fetch(proj.demoEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (statusBadge) {
            statusBadge.textContent = `200 OK • ${data.latency_ms || 18}ms`;
          }
          jsonOut.textContent = JSON.stringify(data, null, 2);
        } catch (err) {
          if (statusBadge) statusBadge.textContent = "ERROR";
          jsonOut.textContent = JSON.stringify(
            { status: "error", message: String(err) },
            null,
            2
          );
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      }

      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          executeDemoRequest();
        });
      }

      // Automatically run an initial live request so the user immediately sees real telemetry
      executeDemoRequest();
    }

    function openProjectModal(projectId, initialTab) {
      activeProjectId = projectId in PROJECTS_DATA ? projectId : "social-scheduler";
      renderProjectPanels(activeProjectId);
      setActiveTab(initialTab || "case-study");
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeProjectModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
    }

    // Bind buttons with [data-project-open]
    document.querySelectorAll("[data-project-open]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const projId = btn.getAttribute("data-project-open");
        const tab = btn.getAttribute("data-tab") || "case-study";
        openProjectModal(projId, tab);
      });
    });

    // Bind clicking anywhere on a .project-showcase-card
    document.querySelectorAll(".project-showcase-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("button, a")) return;
        const projId = card.getAttribute("data-project-id");
        openProjectModal(projId, "case-study");
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (e.target.closest("button, a")) return;
          e.preventDefault();
          const projId = card.getAttribute("data-project-id");
          openProjectModal(projId, "case-study");
        }
      });
    });

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-modal-tab");
        if (targetTab) setActiveTab(targetTab);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeProjectModal);
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeProjectModal();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) {
        closeProjectModal();
      }
    });
  }

  function initAll() {
    initThemeToggle();
    initRoleTypingEffect();
    initScrollReveal();
    initCircuitCanvas();
    initFeaturedProjectsInspector();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();

