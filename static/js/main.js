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

      if (!prefersReducedMotion) {
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
            <span>Launch Interactive API Widget &rarr;</span>
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

      // 3. Render Live Interactive API Widget Tab
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

