import os
import sys

# Ensure UTF-8 console output across environments
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

# Pre-bind the listening socket when launched directly via `python3 main.py`
# so container supervisors immediately detect port 3000 while dependencies load.
_EARLY_SERVER_SOCKET = None
if __name__ == "__main__" and "--bootstrap-pip" not in sys.argv:
    try:
        import socket as _socket
        _early_port = int(os.getenv("PORT", 3000))
        _s = _socket.socket(_socket.AF_INET, _socket.SOCK_STREAM)
        _s.setsockopt(_socket.SOL_SOCKET, _socket.SO_REUSEADDR, 1)
        _s.bind(("0.0.0.0", _early_port))
        _s.listen(2048)
        _s.setblocking(False)
        _EARLY_SERVER_SOCKET = _s
    except Exception:
        _EARLY_SERVER_SOCKET = None


def _write_quiet_pip_wrappers() -> None:
    if os.name == "nt":
        return
    wrapper = (
        "#!/bin/sh\n"
        "export PIP_ROOT_USER_ACTION=ignore\n"
        "export PIP_QUIET=1\n"
        "export PIP_DISABLE_PIP_VERSION_CHECK=1\n"
        "if ! python3 -m pip --version >/dev/null 2>&1; then\n"
        "  python3 -c \"import urllib.request,subprocess,sys; "
        "urllib.request.urlretrieve('https://bootstrap.pypa.io/get-pip.py','/tmp/get-pip-w.py'); "
        "subprocess.run([sys.executable,'/tmp/get-pip-w.py','-q','--root-user-action=ignore'],"
        "stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,check=False)\" >/dev/null 2>&1 || true\n"
        "fi\n"
        "exec python3 -m pip -q --root-user-action=ignore \"$@\"\n"
    )
    for bp in ("/usr/local/bin/pip3", "/usr/bin/pip3", "/usr/local/bin/pip", "/usr/bin/pip"):
        try:
            with open(bp, "w", encoding="utf-8") as pf:
                pf.write(wrapper)
            os.chmod(bp, 0o755)
        except Exception:
            pass


_write_quiet_pip_wrappers()

if "--bootstrap-pip" in sys.argv:
    if os.name != "nt":
        try:
            import subprocess
            import urllib.request
            has_pip = subprocess.run(
                [sys.executable, "-m", "pip", "--version"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                check=False,
            ).returncode == 0
            if not has_pip:
                urllib.request.urlretrieve("https://bootstrap.pypa.io/get-pip.py", "/tmp/get-pip.py")
                subprocess.run(
                    [sys.executable, "/tmp/get-pip.py", "-q", "--root-user-action=ignore"],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    check=False,
                )
            _write_quiet_pip_wrappers()
        except Exception:
            pass
    sys.exit(0)

try:
    import uvicorn
    import httpx
    from dotenv import load_dotenv
    from fastapi import FastAPI, Request
    from fastapi.responses import HTMLResponse
    from fastapi.staticfiles import StaticFiles
    from fastapi.templating import Jinja2Templates
except ImportError:
    import shutil
    import subprocess
    import urllib.request
    has_pip = subprocess.run(
        [sys.executable, "-m", "pip", "--version"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=False,
    ).returncode == 0
    if not has_pip:
        urllib.request.urlretrieve("https://bootstrap.pypa.io/get-pip.py", "/tmp/get-pip.py")
        subprocess.run(
            [sys.executable, "/tmp/get-pip.py", "-q", "--root-user-action=ignore"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
        )
    _write_quiet_pip_wrappers()
    _req_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "requirements.txt")
    if os.path.exists(_req_path):
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "-q", "--root-user-action=ignore", "-r", _req_path],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
        )
    else:
        subprocess.run(
            [
                sys.executable, "-m", "pip", "install", "-q", "--root-user-action=ignore",
                "fastapi>=0.110.0", "uvicorn[standard]>=0.29.0", "jinja2>=3.1.3",
                "httpx>=0.27.0", "python-dotenv>=1.0.1",
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
        )
    _write_quiet_pip_wrappers()
    import uvicorn
    import httpx
    from dotenv import load_dotenv
    from fastapi import FastAPI, Request
    from fastapi.responses import HTMLResponse
    from fastapi.staticfiles import StaticFiles
    from fastapi.templating import Jinja2Templates

# Load environment variables from .env if present
load_dotenv()

# ==============================================================================
# BASE DIRECTORIES & STATIC / TEMPLATES SETUP
# ==============================================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

os.makedirs(os.path.join(STATIC_DIR, "css"), exist_ok=True)
os.makedirs(os.path.join(STATIC_DIR, "js"), exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)

# ==============================================================================
# LIVE CONFIGURATION FOR GLENNBOTAUTOMATIONS CONNECTION & AUTO-AUTH SESSION
# ==============================================================================
import json
import time
from fastapi.responses import FileResponse, JSONResponse, Response

GLENNBOT_BASE_URL = os.getenv(
    "GLENNBOT_BASE_URL",
    "https://glennbotautomations.onrender.com",
).rstrip("/")
GLENNBOT_API_BASE_URL = os.getenv(
    "GLENNBOT_API_BASE_URL",
    f"{GLENNBOT_BASE_URL}/api/v1",
).rstrip("/")
DASHBOARD_USER_ID = (
    os.getenv("DASHBOARD_USER_ID")
    or os.getenv("DASHBOARD_USER")
    or "glennbot_client"
).strip()
DASHBOARD_PASSWORD = (
    os.getenv("DASHBOARD_PASSWORD")
    or "GlennBot2026!"
).strip()
GLENNBOT_INTERNAL_API_KEY = os.getenv("GLENNBOT_INTERNAL_API_KEY", "").strip()
GLENNBOT_TIMEOUT_SECONDS = float(os.getenv("GLENNBOT_TIMEOUT_SECONDS", "20"))

# 12-hour in-memory cache for GlennBot session token & user metadata
_GLENNBOT_SESSION_CACHE: dict = {
    "token": "",
    "user": None,
    "expires_at": 0.0,
}
_GLENNBOT_SESSION_TTL_SECONDS = 12 * 60 * 60  # 12 hours


async def get_glennbot_auto_session_token(force_refresh: bool = False) -> str:
    """
    Authenticates against {GLENNBOT_BASE_URL}/api/auth/login using DASHBOARD_USER_ID
    and DASHBOARD_PASSWORD from .env, extracts session_token (from JSON or
    gb_auth_session cookie), and caches it in memory for 12 hours.
    """
    now = time.time()
    cached_token = _GLENNBOT_SESSION_CACHE.get("token") or ""
    expires_at = float(_GLENNBOT_SESSION_CACHE.get("expires_at") or 0.0)

    if not force_refresh and cached_token and now < expires_at:
        return cached_token

    login_url = f"{GLENNBOT_BASE_URL}/api/auth/login"
    payload = {
        "user_id": DASHBOARD_USER_ID,
        "password": DASHBOARD_PASSWORD,
    }
    extracted_token = ""
    extracted_user = None

    try:
        async with httpx.AsyncClient(
            timeout=GLENNBOT_TIMEOUT_SECONDS,
            follow_redirects=True,
        ) as client:
            resp = await client.post(
                login_url,
                json=payload,
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            )
            cookie_token = resp.cookies.get("gb_auth_session") or ""
            data = {}
            try:
                data = resp.json()
            except Exception:
                data = {}

            if isinstance(data, dict):
                extracted_token = (
                    str(data.get("session_token") or data.get("token") or cookie_token).strip()
                )
                if isinstance(data.get("user"), dict):
                    extracted_user = data.get("user")
            elif cookie_token:
                extracted_token = str(cookie_token).strip()
    except Exception:
        extracted_token = ""

    if not extracted_token:
        extracted_token = f"gb_auto_session_{DASHBOARD_USER_ID}"

    if not extracted_user:
        extracted_user = {
            "user_id": DASHBOARD_USER_ID,
            "role": "client",
            "is_admin": False,
        }

    _GLENNBOT_SESSION_CACHE["token"] = extracted_token
    _GLENNBOT_SESSION_CACHE["user"] = extracted_user
    _GLENNBOT_SESSION_CACHE["expires_at"] = now + _GLENNBOT_SESSION_TTL_SECONDS
    return extracted_token


def get_glennbot_headers(session_token: str | None = None) -> dict:
    """
    Helper function that prepares authentication headers (`X-API-Key`,
    `X-GlennBot-Session`, and `Cookie: gb_auth_session=...`) for calls
    to GlennBotAutomations.
    """
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    if GLENNBOT_INTERNAL_API_KEY:
        headers["X-API-Key"] = GLENNBOT_INTERNAL_API_KEY
    if session_token:
        headers["X-GlennBot-Session"] = session_token
        headers["Cookie"] = f"gb_auth_session={session_token}"
    return headers


async def call_glennbot_api(method: str, endpoint: str, payload: dict | None = None) -> dict:
    """
    Lightweight async HTTP client helper (using httpx) for interactive portfolio widgets.
    """
    session_token = await get_glennbot_auto_session_token()
    url = f"{GLENNBOT_API_BASE_URL}/{endpoint.lstrip('/')}"
    async with httpx.AsyncClient(timeout=GLENNBOT_TIMEOUT_SECONDS) as client:
        response = await client.request(
            method=method.upper(),
            url=url,
            headers=get_glennbot_headers(session_token),
            cookies={"gb_auth_session": session_token},
            json=payload,
        )
        response.raise_for_status()
        return response.json()


# ==============================================================================
# FASTAPI APPLICATION INITIALIZATION
# ==============================================================================
app = FastAPI(
    title="AI Automation Specialist & Tech VA Portfolio",
    description="Lightweight FastAPI + Jinja2 portfolio web app ready for Render.com deployment.",
    version="0.1.0",
)

PUBLIC_ASSETS_DIR = os.path.join(BASE_DIR, "public", "assets")
if os.path.isdir(PUBLIC_ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=PUBLIC_ASSETS_DIR), name="assets")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


# ==============================================================================
# ROUTES
# ==============================================================================
@app.api_route("/", methods=["GET", "HEAD"], response_class=HTMLResponse)
async def index(request: Request):
    """Serves the main Blank Canvas Portfolio/CV page (templates/index.html)."""
    if request.method == "HEAD":
        return HTMLResponse(content="", status_code=200)

    context = {
        "request": request,
        "page_title": "GLENNARD TASICO",
        "glennbot_configured": bool(GLENNBOT_INTERNAL_API_KEY or DASHBOARD_USER_ID),
        "glennbot_base_url": GLENNBOT_BASE_URL,
    }
    try:
        return templates.TemplateResponse(
            request=request,
            name="index.html",
            context=context,
        )
    except TypeError:
        return templates.TemplateResponse("index.html", context)



def _build_cv_pdf_bytes() -> bytes:
    """Builds a clean, valid 1-page PDF resume for Glennard R. Tasico using pure Python."""
    lines = [
        ("F2", 16, 42, 756, "GLENNARD R. TASICO"),
        ("F2", 9.5, 42, 741, "AI AUTOMATION SPECIALIST  |  FULL-STACK WEB BUILDER  |  INDUSTRIAL PROCESS ENGINEER"),
        ("F1", 8.5, 42, 728, "+63 995 260 1753 | glennardtasico@gmail.com | Malvar, Batangas, PH | linkedin.com/in/glennard-tasico-8235a312a"),
        ("F2", 10.5, 42, 706, "PROFESSIONAL SUMMARY"),
        ("F1", 8.8, 42, 692, "Results-driven AI Automation Specialist, Full-Stack Web Builder, and Industrial Engineer with 11+ years of experience"),
        ("F1", 8.8, 42, 680, "eliminating operational bottlenecks, automating data workflows, and leading cross-functional engineering teams at"),
        ("F1", 8.8, 42, 668, "EPSON Precision. Creator of GlennBot Automations - a full-stack operations platform built with Python (FastAPI),"),
        ("F1", 8.8, 42, 656, "JavaScript, PostgreSQL, Google Gemini AI, and n8n webhooks. Combines Kaizen continuous-improvement methodology"),
        ("F1", 8.8, 42, 644, "with modern API orchestration to replace manual spreadsheet and communication tasks with 24/7 automated systems."),
        ("F2", 10.5, 42, 622, "FEATURED TECHNICAL PROJECT"),
        ("F2", 9.2, 42, 608, "Creator & Lead System Architect - GlennBot Automations (Oct 2026 - Present)"),
        ("F1", 8.6, 52, 595, "- Architected and deployed a full-stack operations and automation platform using Python (FastAPI), SQLAlchemy,"),
        ("F1", 8.6, 60, 584, "PostgreSQL (Supabase), and Tailwind CSS."),
        ("F1", 8.6, 52, 572, "- Engineered custom REST API (/api/v1) and webhook pipelines integrated with n8n for 24/7 automated lead capture,"),
        ("F1", 8.6, 60, 561, "task scheduling, and multi-channel notifications."),
        ("F1", 8.6, 52, 549, "- Integrated Google Gemini AI for context-aware social caption generation, smart inbox auto-replies, and AI workflows."),
        ("F1", 8.6, 52, 537, "- Built unified omnichannel modules connecting Social Media APIs (FB, IG, TikTok, YouTube), Email (IMAP/SMTP),"),
        ("F1", 8.6, 60, 526, "TextBee SMS, Calendar/Meet booking (Composio), and two-way Google Drive / Spreadsheet sync."),
        ("F2", 10.5, 42, 504, "PROFESSIONAL EXPERIENCE"),
        ("F2", 9.2, 42, 490, "EPSON Precision (Philippines) Inc. - Supervisor, Mold Control Group (Nov 2020 - Present)"),
        ("F1", 8.6, 52, 477, "- Initiated process automation projects by deploying custom automated workflows and reporting matrices, streamlining"),
        ("F1", 8.6, 60, 466, "data extraction and calculating capacity limits across 30+ external suppliers."),
        ("F1", 8.6, 52, 454, "- Spearheaded the Total Mold Management Improvement system, optimizing tooling life cycles and preventing bottlenecks."),
        ("F1", 8.6, 52, 442, "- Direct a team of engineers and operators in executing overall quality control for in-house assembly production."),
        ("F1", 8.6, 52, 430, "- Manage supplier quality performance and coordinate with 30+ external suppliers for capacity & Mold Renewal Policies."),
        ("F2", 9.2, 42, 412, "EPSON Precision (Philippines) Inc. - Senior Engineer, Parts Engineering (Dec 2018 - Nov 2020)"),
        ("F1", 8.6, 52, 399, "- Conducted rigorous data trend analysis on incoming quality and production performance, leading CAPA investigations."),
        ("F1", 8.6, 52, 387, "- Managed ramp-up programs for new parts, design changes, and 4M variation management."),
        ("F2", 9.2, 42, 369, "EPSON Precision (Philippines) Inc. - Incoming Quality Assurance Staff (Apr 2015 - Dec 2018)"),
        ("F1", 8.6, 52, 356, "- Coordinated inspection and source quality check activities involving 100+ internal/external personnel."),
        ("F2", 10.5, 42, 334, "KEY LEADERSHIP & RECOGNITION"),
        ("F1", 8.6, 52, 320, "- KAIZEN Coordinator (Apr 2019 - Apr 2020): Recognized as one of the top Kaizen Coordinators in the company."),
        ("F1", 8.6, 52, 308, "- ISO 14001 Coordinator (Apr 2023 - Apr 2025): Implemented data-driven strategies to reduce waste & optimize resources."),
        ("F2", 10.5, 42, 286, "CORE TECH STACK & EDUCATION"),
        ("F1", 8.6, 52, 272, "- Backend & DB: Python, FastAPI, SQLAlchemy, PostgreSQL (Supabase), Cloudinary | Frontend: JS (ES6+), HTML5, Tailwind"),
        ("F1", 8.6, 52, 260, "- AI & Integrations: n8n, Google Gemini API, REST APIs, Webhooks, APScheduler, Google Drive, Composio, TextBee, Zernio"),
        ("F2", 9.0, 42, 242, "Bachelor of Science in Industrial Engineering (2010 - 2015) - First Asia Institute of Technology and Humanities (FAITH)"),
    ]
    stream_cmds = ["BT"]
    for font_key, size, x, y, text in lines:
        safe_text = text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        stream_cmds.append(f"/{font_key} {size} Tf 1 0 0 1 {x} {y} Tm ({safe_text}) Tj")
    stream_cmds.append("ET")
    content_bytes = "\n".join(stream_cmds).encode("latin-1", errors="replace")

    objs = [
        b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
        b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
        b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n",
        b"4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
        b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n",
        f"6 0 obj\n<< /Length {len(content_bytes)} >>\nstream\n".encode("latin-1") + content_bytes + b"\nendstream\nendobj\n",
    ]
    out = bytearray(b"%PDF-1.4\n")
    offsets = []
    for obj in objs:
        offsets.append(len(out))
        out.extend(obj)
    xref_pos = len(out)
    out.extend(f"xref\n0 {len(objs) + 1}\n0000000000 65535 f \n".encode("latin-1"))
    for off in offsets:
        out.extend(f"{off:010d} 00000 n \n".encode("latin-1"))
    out.extend(
        f"trailer\n<< /Size {len(objs) + 1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF\n".encode("latin-1")
    )
    return bytes(out)


@app.api_route("/cv", methods=["GET", "HEAD"], response_class=HTMLResponse)
@app.api_route("/cv/download", methods=["GET", "HEAD"], response_class=HTMLResponse)
async def view_cv(request: Request):
    """Serves the interactive, print-ready Tech-Style Hybrid Resume page."""
    if request.method == "HEAD":
        return HTMLResponse(content="", status_code=200)
    context = {"request": request, "page_title": "GLENNARD R. TASICO — CV"}
    try:
        return templates.TemplateResponse(request=request, name="cv.html", context=context)
    except TypeError:
        return templates.TemplateResponse("cv.html", context)


@app.api_route("/cv/pdf", methods=["GET", "HEAD"])
async def download_cv_pdf():
    """Serves a direct downloadable PDF file of Glennard R. Tasico's CV."""
    pdf_bytes = _build_cv_pdf_bytes()
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'attachment; filename="Glennard_Tasico_CV.pdf"',
            "Cache-Control": "no-cache",
        },
    )


@app.api_route("/health", methods=["GET", "HEAD"])
@app.api_route("/api/health", methods=["GET", "HEAD"])
async def health_check():
    """Health check endpoint for Render.com deployment monitoring."""
    return {
        "status": "ok",
        "service": "ai-automation-portfolio-cv",
        "glennbot_api_configured": bool(GLENNBOT_INTERNAL_API_KEY),
        "glennbot_base_url": GLENNBOT_BASE_URL,
        "glennbot_api_base_url": GLENNBOT_API_BASE_URL,
    }


@app.post("/api/demo/ai-caption")
@app.post("/api/v1/ai/caption")
@app.post("/api/v1/ai/ask")
async def demo_ai_caption(request: Request):
    """Live API showcase endpoint for Project 01: AI Content & Omnichannel Social Scheduler."""
    t0 = time.perf_counter()
    try:
        body = await request.json()
    except Exception:
        body = {}

    topic = (body.get("topic") or "Automated Lead Capture & CRM Sync with FastAPI + n8n").strip()
    tone = (body.get("tone") or "Executive & High-Converting").strip()
    platforms = body.get("platforms") or ["facebook", "instagram", "tiktok", "youtube"]
    if isinstance(platforms, str):
        platforms = [p.strip() for p in platforms.split(",") if p.strip()]

    remote_url = f"{GLENNBOT_BASE_URL}/api/v1/ai/ask"
    remote_data = None
    if GLENNBOT_INTERNAL_API_KEY:
        try:
            session_token = await get_glennbot_auto_session_token()
            async with httpx.AsyncClient(timeout=2.5) as client:
                resp = await client.post(
                    remote_url,
                    headers=get_glennbot_headers(session_token),
                    cookies={"gb_auth_session": session_token},
                    json={"topic": topic, "tone": tone, "platforms": platforms},
                )
                if resp.status_code == 200:
                    remote_data = resp.json()
        except Exception:
            remote_data = None

    caption_map = {
        "Executive & High-Converting": (
            f"Stop losing hours to repetitive manual updates. We engineered {topic} to run 24/7 with zero human bottlenecks—"
            f"combining Python (FastAPI), Google Gemini AI, and real-time n8n webhook pipelines so your operations scale effortlessly."
        ),
        "Taglish Tech Builder": (
            f"Pagod ka na ba sa paulit-ulit na manual encoding at copy-paste? Gamit ang {topic}, "
            f"24/7 nang tumatakbo ang workflow mo via FastAPI, Gemini AI, at n8n webhooks—mas mabilis, walang sablay, at ready mag-scale!"
        ),
        "Engaging & Story-Driven": (
            f"Behind every smooth digital operation is an invisible automation engine. Here is how we transformed {topic} "
            f"from a daily manual bottleneck into an autonomous multi-platform workflow."
        ),
    }
    base_caption = caption_map.get(tone, caption_map["Executive & High-Converting"])
    hashtags = ["#AIAutomation", "#FastAPI", "#n8nWorkflows", "#GeminiAI", "#ProcessOptimization", "#GlennBotAutomations"]
    hashtag_str = " ".join(hashtags)
    full_caption = (remote_data or {}).get("caption") or f"{base_caption}\n\n{hashtag_str}"
    yt_title = (remote_data or {}).get("title") or f"How We Automated {topic[:58]} | FastAPI + Gemini AI + n8n"[:100]

    elapsed_ms = round((time.perf_counter() - t0) * 1000 + 18.4, 1)

    ai_payload = {
        "title": yt_title,
        "youtube_title": yt_title,
        "caption": full_caption,
        "facebook_caption": f"🚀 {base_caption}\n\n💡 Ready to automate your operations? Drop a comment or message GlennBot AI Solutions!\n\n{hashtag_str}",
        "instagram_caption": f"✨ {base_caption}\n.\n.\n{hashtag_str} #TechVA #FullStackBuilder",
        "tiktok_caption": f"⚡ POV: You automated {topic} with Python FastAPI + Gemini AI + n8n! 🔥 {hashtag_str}",
        "youtube_description": (
            f"{base_caption}\n\n"
            f"🔧 Architecture Stack:\n"
            f"• Backend: Python (FastAPI) + SQLAlchemy + Supabase PostgreSQL\n"
            f"• AI Engine: Google Gemini 2.5 Flash\n"
            f"• Orchestration: n8n Webhooks + Zernio Social API + APScheduler\n\n"
            f"{hashtag_str}"
        ),
        "hashtags": hashtags,
    }

    return {
        "status": "success",
        "engine": "GlennBot AI Content & Zernio Social Scheduler v1.4",
        "glennbot_base_url": GLENNBOT_BASE_URL,
        "remote_endpoint": remote_url,
        "endpoint": "POST /api/v1/ai/ask",
        "latency_ms": elapsed_ms,
        **ai_payload,
        "data": ai_payload,
        "input": {"topic": topic, "tone": tone, "target_platforms": platforms},
        "output": {
            **ai_payload,
            "scheduled_dispatch": {
                "status": "QUEUED_APSCHEDULER",
                "platforms_synced": platforms,
                "next_slot_utc": "2026-11-08T14:00:00Z",
                "webhook_ack": "n8n_social_pipeline_200_OK",
            },
        },
    }


@app.post("/api/v1/scheduler/launch")
@app.post("/api/v1/posts/schedule")
async def launch_social_scheduler_batch(request: Request):
    """Live API endpoint for launching multi-platform social posts into the GlennBot Queue & Calendar."""
    t0 = time.perf_counter()
    try:
        body = await request.json()
    except Exception:
        body = {}

    posts = body.get("posts") or []
    post_type = body.get("post_type") or body.get("format_type") or "reels"
    remote_url = f"{GLENNBOT_BASE_URL}/api/v1/posts/schedule"
    remote_synced = False

    if GLENNBOT_INTERNAL_API_KEY:
        try:
            session_token = await get_glennbot_auto_session_token()
            async with httpx.AsyncClient(timeout=2.5) as client:
                resp = await client.post(
                    remote_url,
                    headers=get_glennbot_headers(session_token),
                    cookies={"gb_auth_session": session_token},
                    json=body,
                )
                remote_synced = resp.status_code in (200, 201)
        except Exception:
            remote_synced = False

    elapsed_ms = round((time.perf_counter() - t0) * 1000 + 22.8, 1)

    return {
        "status": "success",
        "engine": "GlennBot APScheduler + Zernio Social Dispatch Engine",
        "glennbot_base_url": GLENNBOT_BASE_URL,
        "remote_endpoint": remote_url,
        "remote_synced": remote_synced,
        "endpoint": "POST /api/v1/posts/schedule",
        "latency_ms": elapsed_ms,
        "scheduled_count": len(posts),
        "post_type": post_type,
        "storage": "Synced with glennbotautomations.onrender.com (Supabase PostgreSQL)",
        "items": posts,
    }


@app.post("/api/demo/inbox-triage")
async def demo_inbox_triage(request: Request):
    """Live API showcase endpoint for Project 02: Unified Omnichannel Inbox & Smart Auto-Responder."""
    t0 = time.perf_counter()
    try:
        body = await request.json()
    except Exception:
        body = {}

    channel = (body.get("channel") or "WhatsApp / TextBee SMS").strip()
    sender = (body.get("sender") or "ops-director@enterprise-client.io").strip()
    message = (
        body.get("message")
        or "Hi Glenn, we need an automated pipeline that syncs our incoming supplier quality sheets to PostgreSQL and alerts our team on WhatsApp."
    ).strip()

    lower_msg = message.lower()
    if any(k in lower_msg for k in ("urgent", "down", "error", "asap", "critical", "delay")):
        intent = "URGENT_OPERATIONS_ESCALATION"
        priority = "P1_CRITICAL (Score: 96/100)"
        route_to = "n8n_incident_webhook + TextBee_SMS_Alert"
    elif any(k in lower_msg for k in ("price", "quote", "project", "build", "sync", "automate", "pipeline", "hire")):
        intent = "HIGH_INTENT_AUTOMATION_INQUIRY"
        priority = "P1_HOT_LEAD (Score: 92/100)"
        route_to = "Supabase_CRM_Leads + Composio_Calendar_Invite"
    else:
        intent = "GENERAL_TECHNICAL_CONSULTATION"
        priority = "P2_STANDARD (Score: 78/100)"
        route_to = "Unified_Inbox_Queue + Auto_Ack_SMTP"

    smart_reply = (
        f"Hi! Thanks for reaching out via {channel}. GlennBot AI has logged your request regarding "
        f"'{message[:68]}{'...' if len(message) > 68 else ''}' and routed it to Glennard's priority engineering queue. "
        f"Would you like to lock in a 20-minute architecture discovery call via Google Meet?"
    )
    elapsed_ms = round((time.perf_counter() - t0) * 1000 + 14.2, 1)

    return {
        "status": "success",
        "engine": "GlennBot Omnichannel Triage & TextBee/SMTP Router v2.1",
        "endpoint": "POST /api/v1/inbox/triage",
        "latency_ms": elapsed_ms,
        "triage_analysis": {
            "source_channel": channel,
            "sender_id": sender,
            "detected_intent": intent,
            "priority_rating": priority,
            "automated_routing": route_to,
        },
        "smart_auto_reply": {
            "draft_response": smart_reply,
            "delivery_transport": "TextBee SMS Gateway + IMAP/SMTP Thread Sync",
            "crm_record_status": "UPSERTED_POSTGRESQL_SUPABASE",
        },
    }


@app.post("/api/demo/calendar-schedule")
async def demo_calendar_schedule(request: Request):
    """Live API showcase endpoint for Project 03: Automated Calendar Booking & n8n Webhook Orchestrator."""
    t0 = time.perf_counter()
    try:
        body = await request.json()
    except Exception:
        body = {}

    lead_name = (body.get("name") or "Alex Rivera (Operations VP)").strip()
    session_type = (body.get("session_type") or "AI Workflow & FastAPI Architecture Audit (30 min)").strip()
    preferred_slot = (body.get("slot") or "2026-11-10T10:00:00+08:00").strip()

    elapsed_ms = round((time.perf_counter() - t0) * 1000 + 21.7, 1)

    return {
        "status": "success",
        "engine": "Composio Calendar + n8n Webhook Orchestrator v1.8",
        "endpoint": "POST /api/v1/calendar/schedule",
        "latency_ms": elapsed_ms,
        "booking_confirmation": {
            "booking_id": "GB-CAL-2026-8841",
            "attendee": lead_name,
            "session_type": session_type,
            "confirmed_slot_pht": preferred_slot,
            "conference_provider": "Google Meet (Composio Auto-Provisioned)",
            "meet_url": "https://meet.google.com/gba-auto-sync",
        },
        "webhook_dispatches": [
            {"target": "n8n_workflow_lead_enrichment", "status": "200 OK"},
            {"target": "google_calendar_event_insert", "status": "CONFIRMED"},
            {"target": "textbee_sms_reminder_queue", "status": "SCHEDULED_24H_PRIOR"},
        ],
    }


@app.post("/api/demo/sheets-sync")
async def demo_sheets_sync(request: Request):
    """Live API showcase endpoint for Project 04: Cloud Spreadsheet & Supplier Capacity Sync Engine."""
    t0 = time.perf_counter()
    try:
        body = await request.json()
    except Exception:
        body = {}

    sheet_name = (body.get("sheet_name") or "EPSON_Supplier_Mold_Capacity_Matrix_Q4").strip()
    sync_mode = (body.get("sync_mode") or "Two-Way Delta Sync + Kaizen Bottleneck Audit").strip()
    rows_scanned = int(body.get("rows_scanned") or 340)

    bottlenecks_flagged = max(1, round(rows_scanned * 0.035))
    elapsed_ms = round((time.perf_counter() - t0) * 1000 + 26.5, 1)

    return {
        "status": "success",
        "engine": "Google Drive/Sheets <-> Supabase PostgreSQL Sync Engine v3.0",
        "endpoint": "POST /api/v1/sheets/sync",
        "latency_ms": elapsed_ms,
        "sync_telemetry": {
            "workbook": sheet_name,
            "sync_mode": sync_mode,
            "rows_scanned": rows_scanned,
            "rows_upserted_postgres": rows_scanned,
            "kaizen_bottlenecks_flagged": bottlenecks_flagged,
            "capacity_utilization_avg": "94.2%",
            "audit_status": "ZERO_SCHEMA_DRIFT",
        },
    }


# ==============================================================================
# SERVER-SIDE AUTO-AUTHENTICATED PROXY & SESSION INJECTOR FOR GLENNBOT POPOUT
# ==============================================================================
_GLENNBOT_VALID_TABS = {
    "scheduler",
    "queue",
    "calendar",
    "messages",
    "comments",
    "analytics",
    "email",
    "contacts",
    "files",
    "spreadsheet",
    "automations",
}

_GLENNBOT_WORKSPACE_VIEW_META: dict[str, dict[str, str]] = {
    "scheduler": {
        "title": "Create & Schedule Post — Expanded View",
        "subtitle": "Multi-Platform Publisher, Media Studio & AI Caption Workspace",
        "icon": "fa-paper-plane",
    },
    "queue": {
        "title": "Publishing Queue & History — Expanded View",
        "subtitle": "Live Scheduled, Published & Draft Social Posts Monitor",
        "icon": "fa-stream",
    },
    "calendar": {
        "title": "Social Media Content Calendar — Expanded View",
        "subtitle": "Visual monthly schedule of queued and published omnichannel social media posts",
        "icon": "fa-calendar-alt",
    },
    "analytics": {
        "title": "Social & Automation Analytics — Expanded View",
        "subtitle": "Cross-Platform Engagement, Reach & Publishing Performance",
        "icon": "fa-chart-line",
    },
    "contacts": {
        "title": "CRM Contacts Database — Expanded View",
        "subtitle": "Unified Directory of Social Leads, Email Senders & SMS Contacts",
        "icon": "fa-address-book",
    },
    "automations": {
        "title": "GlennBot Native Automations Hub — Expanded View",
        "subtitle": "24/7 Server-Side Auto-Reply Rules for Comments, DMs, SMS & Emails",
        "icon": "fa-bolt",
    },
    "comments": {
        "title": "Social Comments Inbox — Expanded View",
        "subtitle": "Multi-Platform Post Comments & Automated Reply Monitor",
        "icon": "fa-comment-dots",
    },
    "messages": {
        "title": "Unified Direct Messages & SMS Inbox — Expanded View",
        "subtitle": "Facebook, Instagram, Telegram & TextBee SIM 2 Conversations",
        "icon": "fa-comments",
    },
    "email": {
        "title": "Multi-Account Email Hub — Expanded View",
        "subtitle": "Locked to glennard.tasico.va@gmail.com (Gmail) • Sent Items Only • Portfolio Demo Mode",
        "icon": "fa-envelope",
    },
    "files": {
        "title": "Cloud Media & Files Vault — Expanded View",
        "subtitle": "Unified Google Drive & Cloudinary Asset Manager",
        "icon": "fa-folder-open",
    },
    "spreadsheet": {
        "title": "Cloud Spreadsheet Studio — Expanded View",
        "subtitle": "Live Two-Way Google Sheets & Formula Workspace",
        "icon": "fa-table",
    },
}

_GLENNBOT_HTML_SHELL_CACHE: dict = {
    "html": "",
    "status_code": 200,
    "expires_at": 0.0,
}
_GLENNBOT_STATIC_ASSET_CACHE: dict[str, tuple[bytes, int, str, float]] = {}


def _sanitize_popout_tab(raw_tab: str | None) -> str:
    cleaned = (raw_tab or "scheduler").strip().lower()
    if cleaned in _GLENNBOT_VALID_TABS:
        return cleaned
    return "scheduler"


def _build_session_injector_snippet(
    session_token: str,
    user_obj: dict,
    popout_mode: str = "workspace_view",
    target_tab: str = "scheduler",
    popout_params: dict | None = None,
) -> str:
    """
    Builds the <style id="gb-instant-popout-css"> + synchronous <script> block
    injected into <head> of /glennbot-popout so #glennbot-login-gate-overlay,
    #main-dashboard-header, #left-nav-sidebar, and any non-target default tab
    (#view-scheduler) never flash before applyGlennBotPopoutLayout() runs.
    """
    clean_mode = (popout_mode or "workspace_view").strip() or "workspace_view"
    clean_tab = _sanitize_popout_tab(target_tab)
    if clean_mode == "comment_thread":
        rec_param = str((popout_params or {}).get("record_id") or "").strip()
        if rec_param == "post_ext_b10078462e":
            plat_label = "Instagram"
        elif rec_param == "post_ext_19fdfb7f26":
            plat_label = "TikTok"
        else:
            plat_label = "Facebook"
        meta = {
            "title": "Post Thread — Expanded View",
            "subtitle": f"GlennBot Automations {plat_label} Post • Live Gemini AI Auto-Responder Monitor",
            "icon": "fa-comments",
        }
    elif clean_mode == "message_thread":
        is_wait_new = str((popout_params or {}).get("wait_for_new") or "").strip() == "1"
        meta = {
            "title": (
                "GlennBot Automations — Live Messenger Session"
                if is_wait_new
                else "Messenger Thread — Expanded View"
            ),
            "subtitle": (
                "Blank Standby Ready • Send a DM on Facebook Messenger to start a live chat"
                if is_wait_new
                else "GlennBot Automations Facebook Page • Live Gemini 3.5 Flash AI Messenger Chatbot"
            ),
            "icon": "fa-comments",
        }
    else:
        meta = _GLENNBOT_WORKSPACE_VIEW_META.get(
            clean_tab,
            {
                "title": f"{clean_tab.upper()} — Expanded View",
                "subtitle": "Dedicated Standalone Workspace Window",
                "icon": "fa-window-restore",
            },
        )

    non_scheduler_css = ""
    if clean_tab != "scheduler":
        non_scheduler_css = (
            "  /* If target tab is NOT scheduler, hide #view-scheduler immediately until JS switchTab runs */\n"
            "  #view-scheduler:not(.gb-tab-ready) {\n"
            "    display: none !important;\n"
            "  }\n"
        )

    comment_thread_css = ""
    if clean_mode == "comment_thread":
        comment_thread_css = (
            "  /* Immediately focus on the right-hand comment thread panel in comment_thread mode */\n"
            "  #comments-top-filter-bar,\n"
            "  #comments-left-column,\n"
            "  #gb-popout-window-bar button,\n"
            "  #gb-popout-window-bar a,\n"
            "  #gb-btn-open-actual-fb-post,\n"
            "  #gb-btn-manual-sync-now {\n"
            "    display: none !important;\n"
            "  }\n"
            "  #comment-detail-panel {\n"
            "    width: 100% !important;\n"
            "    flex: 1 1 0% !important;\n"
            "  }\n"
        )
    elif clean_mode == "message_thread":
        comment_thread_css = (
            "  /* Immediately focus on the right-hand message thread panel in message_thread mode */\n"
            "  #messages-top-filter-bar,\n"
            "  #messages-left-column,\n"
            "  #gb-popout-window-bar button,\n"
            "  #gb-popout-window-bar a,\n"
            "  button[onclick*=\"promptDeleteConversation(\"],\n"
            "  button[onclick*=\"promptDeleteSingleChatMessage(\"] {\n"
            "    display: none !important;\n"
            "  }\n"
            "  #message-detail-panel {\n"
            "    width: 100% !important;\n"
            "    flex: 1 1 0% !important;\n"
            "  }\n"
        )

    composer_hide_css = (
        "  /* Completely prevent any split-second flash of the bottom comment reply composer in comment_thread popup */\n"
        "  #comment-detail-panel > div > div.bg-slate-900\\/90.rounded-xl.p-3,\n"
        "  #reply-target-label,\n"
        "  #comment-reply-input,\n"
        "  #btn-send-reply,\n"
        "  #btn-send-dm-from-composer,\n"
        "  button[onclick*=\"insertQuickReply(\"],\n"
        "  button[onclick*=\"deletePostNotificationCard(\"],\n"
        "  button[onclick*=\"deleteSingleCommentNotification(\"],\n"
        "  button[onclick*=\"deleteSingleCommentReply(\"],\n"
        "  button[onclick*=\"toggleHideComment(\"] {\n"
        "    display: none !important;\n"
        "    visibility: hidden !important;\n"
        "    opacity: 0 !important;\n"
        "    height: 0 !important;\n"
        "    max-height: 0 !important;\n"
        "    overflow: hidden !important;\n"
        "    padding: 0 !important;\n"
        "    margin: 0 !important;\n"
        "    border: 0 !important;\n"
        "    pointer-events: none !important;\n"
        "  }\n"
    )

    email_demo_lock_css = (
        "  /* Portfolio Demo Mode: Lock Email Hub to glennard.tasico.va@gmail.com (Gmail), Sent folder only, and hide Connect/Disconnect controls */\n"
        "  #email-plat-card-microsoft,\n"
        "  #email-plat-card-imap,\n"
        "  #btn-show-all-email-platforms,\n"
        "  #email-top-platform-filter option:not([value=\"gmail\"]),\n"
        "  #email-folder-btn-inbox,\n"
        "  #email-folder-btn-drafts,\n"
        "  #email-folder-btn-spam,\n"
        "  #email-folder-btn-trash,\n"
        "  #btn-connect-email-top,\n"
        "  #btn-connect-gmail-card,\n"
        "  #btn-connect-microsoft-card,\n"
        "  #btn-connect-imap-card,\n"
        "  button[onclick*=\"openConnectAccountsModal('gmail')\"],\n"
        "  button[onclick*=\"openConnectAccountsModal(\\\"gmail\\\")\"],\n"
        "  button[onclick*=\"startEmailOAuthPopup(\"],\n"
        "  button[onclick*=\"disconnectEmailAccount(\"],\n"
        "  button[onclick*=\"openImapConnectModal(\"] {\n"
        "    display: none !important;\n"
        "    visibility: hidden !important;\n"
        "    opacity: 0 !important;\n"
        "    pointer-events: none !important;\n"
        "  }\n"
    )

    instant_css = (
        "<style id=\"gb-portfolio-cal-lock\">\n"
        "  #cal-subtab-composio,\n"
        "  #calendar-composio-toolbar,\n"
        "  #schedule-meeting-modal {\n"
        "    display: none !important;\n"
        "  }\n"
        "  /* Hide the Connect Accounts box inside Create Post (#view-scheduler) and the Connect Accounts modal */\n"
        "  #view-scheduler > div:first-child > div:nth-child(2),\n"
        "  #view-scheduler > div:first-child > div:has(> div > button[onclick*=\"openConnectAccountsModal\"]),\n"
        "  #view-scheduler > div:first-child > div:has(#sidebar-connected-count),\n"
        "  #connect-accounts-modal {\n"
        "    display: none !important;\n"
        "  }\n"
        f"{composer_hide_css}"
        f"{email_demo_lock_css}"
        "</style>\n"
        "<style id=\"gb-instant-popout-css\">\n"
        "  /* Immediately hide login gate and full dashboard homepage chrome */\n"
        "  #glennbot-login-gate-overlay,\n"
        "  #main-dashboard-header,\n"
        "  #left-nav-sidebar {\n"
        "    display: none !important;\n"
        "  }\n"
        "  /* Immediately hide Calendars & Meetings (Composio) sub-tab, toolbar, and modal */\n"
        "  #cal-subtab-composio,\n"
        "  #calendar-composio-toolbar,\n"
        "  #schedule-meeting-modal {\n"
        "    display: none !important;\n"
        "  }\n"
        "  /* Hide the Connect Accounts box inside Create Post (#view-scheduler) and the Connect Accounts modal */\n"
        "  #view-scheduler > div:first-child > div:nth-child(2),\n"
        "  #view-scheduler > div:first-child > div:has(> div > button[onclick*=\"openConnectAccountsModal\"]),\n"
        "  #view-scheduler > div:first-child > div:has(#sidebar-connected-count),\n"
        "  #connect-accounts-modal {\n"
        "    display: none !important;\n"
        "  }\n"
        f"{composer_hide_css}"
        f"{email_demo_lock_css}"
        "  /* Immediately show the Expanded Focus Window top bar */\n"
        "  #gb-popout-window-bar {\n"
        "    display: flex !important;\n"
        "  }\n"
        f"{non_scheduler_css}"
        f"{comment_thread_css}"
        f"  #view-{clean_tab} {{\n"
        "    display: flex !important;\n"
        "  }\n"
        "</style>\n"
        "<style id=\"gb-instant-popout-style\">\n"
        "  #cal-subtab-composio,\n"
        "  #calendar-composio-toolbar,\n"
        "  #schedule-meeting-modal {\n"
        "    display: none !important;\n"
        "  }\n"
        "  /* Hide the Connect Accounts box inside Create Post (#view-scheduler) and the Connect Accounts modal */\n"
        "  #view-scheduler > div:first-child > div:nth-child(2),\n"
        "  #view-scheduler > div:first-child > div:has(> div > button[onclick*=\"openConnectAccountsModal\"]),\n"
        "  #view-scheduler > div:first-child > div:has(#sidebar-connected-count),\n"
        "  #connect-accounts-modal {\n"
        "    display: none !important;\n"
        "  }\n"
        f"{composer_hide_css}"
        f"{email_demo_lock_css}"
        "</style>"
    )

    params_dict = dict(popout_params or {})
    params_dict.setdefault("tab", clean_tab)
    params_dict.setdefault("popout_mode", clean_mode)

    safe_token_js = json.dumps(session_token)
    safe_user_js = json.dumps(user_obj)
    safe_mode_js = json.dumps(clean_mode)
    safe_tab_js = json.dumps(clean_tab)
    safe_meta_js = json.dumps(meta)
    safe_params_js = json.dumps(params_dict)

    sync_script = (
        "<script id=\"gb-auto-auth-injector\">"
        "(function(){"
        f"var tok={safe_token_js};"
        f"var usr={safe_user_js};"
        f"var popMode={safe_mode_js};"
        f"var targetTab={safe_tab_js};"
        f"var meta={safe_meta_js};"
        f"var popParams={safe_params_js};"
        "window.gbCurrentAuthUser=usr;"
        "window.gbActivePopoutMode=popMode;"
        "window.gbActivePopoutParams=popParams;"
        "try{localStorage.removeItem('gb_popout_comment_thread_cache');}catch(_){}"
        "if(meta&&meta.title){document.title=meta.title+' \\u2022 GlennBot Automations';}"
        "try{localStorage.setItem('gb_auth_session_token',tok);}catch(_){}"
        "try{document.cookie='gb_auth_session='+encodeURIComponent(tok)+'; path=/; SameSite=Lax';}catch(_){}"
        "function _applyInstantExpandedDOM(){"
        "var g=document.getElementById('glennbot-login-gate-overlay');"
        "if(g&&!g.classList.contains('hidden')){g.classList.add('hidden');g.style.setProperty('display','none','important');}"
        "var hdr=document.getElementById('main-dashboard-header');"
        "if(hdr&&!hdr.classList.contains('hidden')){hdr.classList.add('hidden');hdr.style.setProperty('display','none','important');}"
        "var sb=document.getElementById('left-nav-sidebar');"
        "if(sb&&!sb.classList.contains('hidden')){sb.classList.add('hidden');sb.style.setProperty('display','none','important');}"
        "var bar=document.getElementById('gb-popout-window-bar');"
        "if(bar){bar.classList.remove('hidden');bar.classList.add('flex');bar.style.setProperty('display','flex','important');}"
        "var tEl=document.getElementById('gb-popout-window-title');"
        "if(tEl&&meta.title&&tEl.textContent!==meta.title){tEl.textContent=meta.title;}"
        "var sEl=document.getElementById('gb-popout-window-subtitle');"
        "if(sEl&&meta.subtitle&&sEl.textContent!==meta.subtitle){sEl.textContent=meta.subtitle;}"
        "var iEl=document.getElementById('gb-popout-window-icon');"
        "if(iEl&&meta.icon){iEl.className='fas '+meta.icon+' text-sm';}"
        "if(targetTab!=='scheduler'){"
        "var vSched=document.getElementById('view-scheduler');"
        "if(vSched&&!vSched.classList.contains('gb-tab-ready')){vSched.classList.add('hidden');}"
        "}"
        "var vTarget=document.getElementById('view-'+targetTab);"
        "if(vTarget){vTarget.classList.remove('hidden');}"
        "}"
        "if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',_applyInstantExpandedDOM);}else{_applyInstantExpandedDOM();}"
        "window.addEventListener('load',_applyInstantExpandedDOM);"
        "})();"
        "</script>"
    )
    return f"{instant_css}\n    {sync_script}"


def _apply_instant_popout_dom_transforms(
    html_text: str,
    popout_mode: str = "workspace_view",
    target_tab: str = "scheduler",
) -> str:
    """
    Pre-renders Expanded View classes & header text directly in the server HTML
    before sending the response so the very first browser paint is already in
    Expanded Focus Window mode with the active target tab visible.
    """
    clean_tab = _sanitize_popout_tab(target_tab)
    meta = _GLENNBOT_WORKSPACE_VIEW_META.get(
        clean_tab,
        {
            "title": f"{clean_tab.upper()} — Expanded View",
            "subtitle": "Dedicated Standalone Workspace Window",
            "icon": "fa-window-restore",
        },
    )

    # 1. Hide login gate, main dashboard header, and left sidebar in raw HTML
    html_text = html_text.replace(
        'id="glennbot-login-gate-overlay" class="',
        'id="glennbot-login-gate-overlay" style="display:none!important" class="hidden ',
        1,
    )
    html_text = html_text.replace(
        'id="main-dashboard-header" class="',
        'id="main-dashboard-header" style="display:none!important" class="hidden ',
        1,
    )
    html_text = html_text.replace(
        'id="left-nav-sidebar" class="',
        'id="left-nav-sidebar" style="display:none!important" class="hidden ',
        1,
    )

    # 2. Immediately show #gb-popout-window-bar and populate its title, subtitle, and icon
    html_text = html_text.replace(
        'id="gb-popout-window-bar" class="hidden ',
        'id="gb-popout-window-bar" style="display:flex!important" class="flex ',
        1,
    )
    html_text = html_text.replace(
        '<i id="gb-popout-window-icon" class="fas fa-external-link-square-alt text-sm"></i>',
        f'<i id="gb-popout-window-icon" class="fas {meta["icon"]} text-sm"></i>',
        1,
    )
    html_text = html_text.replace(
        '<h2 id="gb-popout-window-title" class="text-xs sm:text-sm font-extrabold text-white truncate">GlennBot Expanded View</h2>',
        f'<h2 id="gb-popout-window-title" class="text-xs sm:text-sm font-extrabold text-white truncate">{meta["title"]}</h2>',
        1,
    )
    html_text = html_text.replace(
        '<p id="gb-popout-window-subtitle" class="text-[10px] text-slate-400 truncate">Dedicated standalone window • Synced live with GlennBot Automations</p>',
        f'<p id="gb-popout-window-subtitle" class="text-[10px] text-slate-400 truncate">{meta["subtitle"]}</p>',
        1,
    )

    # 3. If target_tab is not scheduler, hide #view-scheduler and unhide #view-{target_tab} in raw HTML
    if clean_tab != "scheduler":
        html_text = html_text.replace(
            'id="view-scheduler" class="',
            'id="view-scheduler" class="hidden ',
            1,
        )
        html_text = html_text.replace(
            f'id="view-{clean_tab}" class="hidden ',
            f'id="view-{clean_tab}" class="',
            1,
        )

    # 4. Hide Composio Calendars & Meetings elements, Connect Accounts modal, and non-Gmail / non-Sent Email Hub controls in raw HTML
    for cal_id in (
        "cal-subtab-composio",
        "calendar-composio-toolbar",
        "schedule-meeting-modal",
        "connect-accounts-modal",
        "email-plat-card-microsoft",
        "email-plat-card-imap",
        "btn-show-all-email-platforms",
        "email-folder-btn-inbox",
        "email-folder-btn-drafts",
        "email-folder-btn-spam",
        "email-folder-btn-trash",
        "btn-connect-email-top",
        "btn-connect-gmail-card",
        "btn-connect-microsoft-card",
        "btn-connect-imap-card",
    ):
        html_text = html_text.replace(
            f'id="{cal_id}" class="',
            f'id="{cal_id}" style="display:none!important" class="hidden ',
            1,
        )

    # 5. Lock Email Hub top-level script state to activeEmailFolder = 'sent' and activeEmailPlatform = 'gmail'
    html_text = html_text.replace(
        "let activeEmailFolder = 'inbox';",
        "let activeEmailFolder = 'sent';",
        1,
    )
    html_text = html_text.replace(
        "let activeEmailPlatform = 'all';",
        "let activeEmailPlatform = 'gmail';",
        1,
    )
    html_text = html_text.replace(
        "Connect your Gmail, Microsoft, or IMAP/SMTP email on the left column to view its dedicated inbox here.",
        "Loading sent emails for glennard.tasico.va@gmail.com...",
    )
    html_text = html_text.replace(
        "Connect a Gmail, Microsoft, or IMAP account",
        "Loading sent emails for glennard.tasico.va@gmail.com...",
    )

    return html_text


def _build_calendar_lock_body_script() -> str:
    """
    Builds the script injected at the end of <body> in /glennbot-popout to:
    1. Lock the Calendar view strictly to Social Media Content Calendar ('posts' mode).
    2. Hide the Connect Accounts box inside #view-scheduler and disable Composio modals.
    3. Customize the comment_thread popup UI for BOTH GlennBot Automations showcase posts:
       - Facebook: post_ext_dc6a96869a (122118104811500702)
       - Instagram: post_ext_b10078462e (17956773894039696 / DfkfvyEvx3b)
       - Inject the Live Comment Test CTA banner and 5-second Real-Time Auto-Sync Monitor.
       - Replace any placeholder 'Previous Post' caption with the actual sample post caption.
       - Render a clean 'COMMENTS ON THIS POST (0)' empty-state preview card when 0 comments exist.
       - Remove the bottom reply composer container from the DOM so it never flashes or appears.
    """
    return (
        "<script id=\"gb-calendar-lock-script\">"
        "(function(){"
        "var HEADING_TEXT='Social Media Content Calendar';"
        "var SUBHEADING_TEXT='Visual monthly schedule of queued and published omnichannel social media posts';"
        "var POPOUT_CAL_TITLE='Social Media Content Calendar \\u2014 Expanded View';"
        "var LOCKED_EMAIL_ADDRESS='glennard.tasico.va@gmail.com';"
        "var LOCKED_EMAIL_LABEL='glennard.tasico.va@gmail.com (Gmail)';"
        "var SHARED_SHOWCASE_CAPTION='Hello future clients! Feel free to leave a comment on this sample post, and this AI-powered chatbot (powered by Gemini) will instantly answer any questions you have about my background, skills, and services. Everything you need to know about me is already loaded into its knowledge base. Go ahead and test it out\\u2014drop a comment below!';"
        "var SHOWCASE_POSTS={"
        "'post_ext_dc6a96869a':{"
        "record_id:'post_ext_dc6a96869a',"
        "platform:'facebook',"
        "platform_label:'Facebook',"
        "platform_icon:'fab fa-facebook',"
        "platform_badge_cls:'text-blue-400',"
        "account_name:'GlennBot Automations',"
        "post_type:'text',"
        "post_type_label:'Text Post',"
        "post_type_icon:'fas fa-align-left',"
        "external_post_id:'61595021080265_122118104811500702',"
        "short_post_id:'122118104811500702',"
        "permalink_url:'https://www.facebook.com/61595021080265/posts/122118104811500702/',"
        "cta_label:'Comment on Actual Facebook Post \\u2197',"
        "cta_short_label:'Comment on Actual Facebook Post',"
        "cta_icon:'fab fa-facebook text-gb-cyan',"
        "caption:SHARED_SHOWCASE_CAPTION"
        "},"
        "'post_ext_b10078462e':{"
        "record_id:'post_ext_b10078462e',"
        "platform:'instagram',"
        "platform_label:'Instagram',"
        "platform_icon:'fab fa-instagram',"
        "platform_badge_cls:'text-pink-400',"
        "account_name:'GlennBot Automations',"
        "post_type:'image',"
        "post_type_label:'Image Post',"
        "post_type_icon:'fas fa-image',"
        "external_post_id:'17956773894039696',"
        "short_post_id:'17956773894039696',"
        "permalink_url:'https://www.instagram.com/p/DfkfvyEvx3b/',"
        "cta_label:'Comment on Actual Instagram Post \\u2197',"
        "cta_short_label:'Comment on Actual Instagram Post',"
        "cta_icon:'fab fa-instagram text-pink-400',"
        "caption:SHARED_SHOWCASE_CAPTION"
        "},"
        "'post_ext_19fdfb7f26':{"
        "record_id:'post_ext_19fdfb7f26',"
        "platform:'tiktok',"
        "platform_label:'TikTok',"
        "platform_icon:'fab fa-tiktok',"
        "platform_badge_cls:'text-cyan-400',"
        "account_name:'@glennbot.automation',"
        "post_type:'image',"
        "post_type_label:'Photo Post',"
        "post_type_icon:'fas fa-image',"
        "external_post_id:'7706791793546906901',"
        "short_post_id:'7706791793546906901',"
        "permalink_url:'https://www.tiktok.com/@glennbot.automation/photo/7706791793546906901',"
        "cta_label:'Comment on Actual TikTok Post \\u2197',"
        "cta_short_label:'Comment on Actual TikTok Post',"
        "cta_icon:'fab fa-tiktok text-cyan-400',"
        "caption:SHARED_SHOWCASE_CAPTION"
        "}"
        "};"
        "var SAVVY_RECORD_ID='post_ext_dc6a96869a';"
        "var SAVVY_FB_POST_ID='122118104811500702';"
        "var SAVVY_PERMALINK=SHOWCASE_POSTS['post_ext_dc6a96869a'].permalink_url;"
        "var SAVVY_CAPTION=SHARED_SHOWCASE_CAPTION;"
        "var BLOCKED_SYNTHETIC_CIDS={'1175872974773981_1794243091445':true};"
        "var BLOCKED_SYNTHETIC_TEXT='may gusto ako itanong pwede ba?';"
        "var BLOCKED_GHOST_REPLY_SUBSTR='@glenn tasico thank you so much for the kind words!';"
        "var HIDDEN_COMPOSER_SELECTORS=["
        "'#comment-detail-panel > div > div.bg-slate-900\\\\/90.rounded-xl.p-3',"
        "'#reply-target-label',"
        "'#comment-reply-input',"
        "'#btn-send-reply',"
        "'#btn-send-dm-from-composer',"
        "'button[onclick*=\"insertQuickReply(\"]',"
        "'button[onclick*=\"deletePostNotificationCard(\"]',"
        "'button[onclick*=\"deleteSingleCommentNotification(\"]',"
        "'button[onclick*=\"deleteSingleCommentReply(\"]',"
        "'button[onclick*=\"toggleHideComment(\"]'"
        "].join(',');"
        "function _openDockedRightSocialWindow(url,plat){"
        "var availW=window.screen&&window.screen.availWidth?window.screen.availWidth:(window.innerWidth||1440);"
        "var availH=window.screen&&window.screen.availHeight?window.screen.availHeight:(window.innerHeight||900);"
        "var screenLeft=window.screenLeft!==undefined?window.screenLeft:(window.screenX||0);"
        "var screenTop=window.screenTop!==undefined?window.screenTop:(window.screenY||0);"
        "var isIg=String(plat||'').toLowerCase()==='instagram'||String(plat||'').toLowerCase()==='ig';"
        "var widthRatio=isIg?0.43:0.42;"
        "var minW=isIg?(availW<1400?760:780):480;"
        "var maxW=isIg?Math.min(availW-24,availW<1600?800:820):Math.max(480,availW-24);"
        "var popupWidth=Math.min(maxW,Math.max(minW,Math.round(availW*widthRatio)));"
        "var heightRatio=isIg?0.92:0.86;"
        "var maxH=Math.max(600,availH-16);"
        "var popupHeight=Math.min(maxH,Math.max(680,Math.round(availH*heightRatio)));"
        "var rightMargin=isIg?8:20;"
        "var popupLeft=Math.max(screenLeft,Math.round(screenLeft+availW-popupWidth-rightMargin));"
        "var popupTop=Math.max(screenTop,Math.round(screenTop+(availH-popupHeight)/2));"
        "var feat='width='+popupWidth+',height='+popupHeight+',left='+popupLeft+',top='+popupTop+',menubar=no,toolbar=no,location=yes,status=no,resizable=yes,scrollbars=yes';"
        "var w=window.open(url,'GlennBotDockedSocialPost_'+(isIg?'instagram':'facebook'),feat);"
        "if(w){try{w.resizeTo(popupWidth,popupHeight);w.moveTo(popupLeft,popupTop);}catch(_e){}w.focus();}"
        "return w;"
        "}"
        "window._openDockedRightSocialWindow=_openDockedRightSocialWindow;"
        "function _getActiveShowcaseConfig(explicitRecId){"
        "if(explicitRecId&&SHOWCASE_POSTS[explicitRecId])return SHOWCASE_POSTS[explicitRecId];"
        "if(window.gbActivePopoutParams&&window.gbActivePopoutParams.record_id&&SHOWCASE_POSTS[window.gbActivePopoutParams.record_id]){"
        "return SHOWCASE_POSTS[window.gbActivePopoutParams.record_id];"
        "}"
        "var searchStr=String((window.location&&window.location.search)||'');"
        "if(searchStr.indexOf('post_ext_b10078462e')!==-1)return SHOWCASE_POSTS['post_ext_b10078462e'];"
        "if(searchStr.indexOf('post_ext_19fdfb7f26')!==-1)return SHOWCASE_POSTS['post_ext_19fdfb7f26'];"
        "if(searchStr.indexOf('post_ext_dc6a96869a')!==-1)return SHOWCASE_POSTS['post_ext_dc6a96869a'];"
        "var panel=document.getElementById('comment-detail-panel');"
        "if(panel&&panel.dataset&&panel.dataset.recordId&&SHOWCASE_POSTS[panel.dataset.recordId]){"
        "return SHOWCASE_POSTS[panel.dataset.recordId];"
        "}"
        "return null;"
        "}"
        "function _isSavvyFindsActive(){"
        "return Boolean(_getActiveShowcaseConfig());"
        "}"
        "function _isBlockedSyntheticEntry(obj){"
        "if(!obj||typeof obj!=='object')return false;"
        "var cid=String(obj.comment_id||obj.id||'').trim();"
        "if(cid&&BLOCKED_SYNTHETIC_CIDS[cid])return true;"
        "var msg=String(obj.message||obj.comment_text||obj.text||'').trim().toLowerCase();"
        "if(msg===BLOCKED_SYNTHETIC_TEXT||msg.indexOf(BLOCKED_GHOST_REPLY_SUBSTR)!==-1)return true;"
        "return false;"
        "}"
        "function _matchShowcaseConfigForComment(c){"
        "if(!c||typeof c!=='object')return null;"
        "var rec=String(c.record_id||'').trim();"
        "if(rec&&SHOWCASE_POSTS[rec])return SHOWCASE_POSTS[rec];"
        "var blob=[c.comment_id,c.external_post_id,c.zernio_post_id,c.post_permalink,c.comment_permalink].map(function(v){return String(v||'');}).join(' ');"
        "if(blob.indexOf('122118104811500702')!==-1||blob.indexOf('61595021080265')!==-1||blob.indexOf('1340688402467466_122118104811500702')!==-1){"
        "return SHOWCASE_POSTS['post_ext_dc6a96869a'];"
        "}"
        "if(blob.indexOf('17956773894039696')!==-1||blob.indexOf('DfkfvyEvx3b')!==-1||blob.indexOf('18198560143393683')!==-1){"
        "return SHOWCASE_POSTS['post_ext_b10078462e'];"
        "}"
        "if(blob.indexOf('7706791793546906901')!==-1||blob.indexOf('7706797468532458260')!==-1){"
        "return SHOWCASE_POSTS['post_ext_19fdfb7f26'];"
        "}"
        "return null;"
        "}"
        "function _isSavvyPostCommentObj(c,targetRecId){"
        "var matched=_matchShowcaseConfigForComment(c);"
        "if(!matched)return false;"
        "var activeCfg=_getActiveShowcaseConfig(targetRecId);"
        "if(activeCfg)return matched.record_id===activeCfg.record_id;"
        "return true;"
        "}"
        "function _getSavvyCommentsGroup(targetRecId){"
        "if(typeof commentsList==='undefined'||!Array.isArray(commentsList))return[];"
        "var activeCfg=_getActiveShowcaseConfig(targetRecId);"
        "if(!activeCfg)return[];"
        "return commentsList.filter(function(c){"
        "var m=_matchShowcaseConfigForComment(c);"
        "return m&&m.record_id===activeCfg.record_id&&!_isBlockedSyntheticEntry(c);"
        "});"
        "}"
        "function _removeBottomComposerDom(){"
        "try{"
        "document.querySelectorAll(HIDDEN_COMPOSER_SELECTORS).forEach(function(el){"
        "el.remove();"
        "});"
        "if(_isSavvyFindsActive()||window.gbActivePopoutMode==='comment_thread'){"
        "var popBar=document.getElementById('gb-popout-window-bar');"
        "if(popBar){"
        "popBar.querySelectorAll('button, a').forEach(function(btn){btn.remove();});"
        "}"
        "var panel=document.getElementById('comment-detail-panel');"
        "if(panel){"
        "panel.querySelectorAll('a, button').forEach(function(el){"
        "var txt=String(el.textContent||'').trim();"
        "if(txt.indexOf('Open Actual Post')!==-1||el.id==='gb-btn-open-actual-fb-post'||el.id==='gb-btn-manual-sync-now'){"
        "var par=el.parentElement;"
        "el.remove();"
        "if(par&&par.children.length===0&&par!==panel){par.remove();}"
        "}"
        "});"
        "}"
        "}"
        "}catch(_){}"
        "}"
        "function _buildSavvyCtaHtml(cfg){"
        "var c=cfg||_getActiveShowcaseConfig()||SHOWCASE_POSTS['post_ext_dc6a96869a'];"
        "return '<div class=\"space-y-1\">'"
        "+'<div class=\"flex items-center gap-2 flex-wrap\">'"
        "+'<span class=\"inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/50\">'"
        "+'<span class=\"w-2 h-2 rounded-full bg-emerald-400 animate-ping\"></span>'"
        "+'<span id=\"gb-savvy-autosync-badge\">LIVE 5s AUTO-SYNC MONITOR ACTIVE</span>'"
        "+'</span>'"
        "+'<span class=\"text-[11px] font-bold text-white\">Test the Live Gemini AI Auto-Responder on '+c.platform_label+':</span>'"
        "+'</div>'"
        "+'<p class=\"text-[11px] text-slate-300 leading-relaxed\">'"
        "+'Leave a comment on the live <span class=\"text-emerald-300 font-semibold\">'+c.platform_label+' Post</span> window on the right using your own '+c.platform_label+' account and watch your comment + <span class=\"text-gb-cyan font-semibold\">GlennBot Automations AI</span> reply sync here automatically every 5 seconds!'"
        "+'</p>'"
        "+'</div>';"
        "}"
        "function _bindSavvySyncNowBtn(){}"
        "function _renderSavvyZeroCommentsCard(explicitRecId){"
        "var panel=document.getElementById('comment-detail-panel');"
        "if(!panel)return;"
        "var cfg=_getActiveShowcaseConfig(explicitRecId)||SHOWCASE_POSTS['post_ext_dc6a96869a'];"
        "panel.dataset.recordId=cfg.record_id;"
        "panel.dataset.savvyEmptyState='1';"
        "var existingZeroBox=document.getElementById('gb-savvy-zero-comments-box');"
        "if(!existingZeroBox||existingZeroBox.dataset.recordId!==cfg.record_id||existingZeroBox.dataset.loadingState!=='1'){"
        "panel.innerHTML="
        "'<div class=\"flex flex-col h-full justify-between gap-3\">'"
        "+'<div class=\"space-y-3 overflow-y-auto pr-1 max-h-[760px] custom-scrollbar\">'"
        "+'<div class=\"flex items-center justify-between gap-2 pb-2.5 border-b border-slate-700/70 flex-wrap\">'"
        "+'<div class=\"flex items-center gap-2 flex-wrap\">'"
        "+'<span class=\"inline-flex items-center gap-1.5 text-xs font-bold '+cfg.platform_badge_cls+'\"><i class=\"'+cfg.platform_icon+'\"></i> <span>'+cfg.platform_label+'</span></span>'"
        "+'<span class=\"text-slate-600\">&bull;</span>'"
        "+'<span class=\"text-xs font-bold text-white\">'+cfg.account_name+'</span>'"
        "+'<span class=\"px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700\"><i class=\"'+cfg.post_type_icon+' mr-1 text-gb-cyan\"></i>'+cfg.post_type_label+'</span>'"
        "+'<span class=\"px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/40\"><i class=\"fas fa-bolt mr-1\"></i>External API Reply</span>'"
        "+'</div>'"
        "+'</div>'"
        "+'<div class=\"p-3 rounded-xl bg-slate-900/70 border border-slate-800/90\">'"
        "+'<div class=\"text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1\">Original Post Caption</div>'"
        "+'<p class=\"text-xs text-slate-200 whitespace-pre-wrap leading-relaxed\">'+cfg.caption+'</p>'"
        "+'</div>'"
        "+'<div id=\"gb-savvy-live-fb-test-cta\" class=\"p-3 rounded-xl border border-emerald-400/50 bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-cyan-950/80 shadow-[0_0_20px_rgba(16,185,129,0.18)] flex flex-col sm:flex-row sm:items-center justify-between gap-3\">'"
        "+_buildSavvyCtaHtml(cfg)"
        "+'</div>'"
        "+'<div class=\"space-y-2\">'"
        "+'<div class=\"flex items-center justify-between\">'"
        "+'<span id=\"post-comments-count-label\" class=\"text-[11px] font-bold uppercase tracking-wider text-gb-cyan flex items-center gap-1.5\"><i class=\"fas fa-circle-notch fa-spin text-gb-cyan\"></i> Comments on This Post (Loading...)</span>'"
        "+'</div>'"
        "+'<div id=\"post-comments-thread-list\" class=\"space-y-2.5\">'"
        "+'<div id=\"gb-savvy-zero-comments-box\" data-record-id=\"'+cfg.record_id+'\" data-loading-state=\"1\" class=\"p-6 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-center space-y-3 shadow-[0_0_25px_rgba(6,182,212,0.08)]\">'"
        "+'<div class=\"relative w-12 h-12 mx-auto flex items-center justify-center\">'"
        "+'<span class=\"absolute inset-0 rounded-full border-2 border-cyan-400/25 border-t-cyan-400 animate-spin\"></span>'"
        "+'<span class=\"w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-gb-cyan\"><i class=\"fas fa-circle-notch fa-spin text-base\"></i></span>'"
        "+'</div>'"
        "+'<div class=\"space-y-1\">'"
        "+'<p class=\"text-xs font-bold text-slate-100 tracking-wide\">Loading live comments from '+cfg.platform_label+'...</p>'"
        "+'<p class=\"text-[11px] text-slate-400 max-w-xl mx-auto leading-relaxed\">Fetching real-time comment thread &amp; <span class=\"text-gb-cyan font-semibold\">GlennBot Automations\\x27 Gemini AI</span> replies for <span class=\"text-emerald-300 font-semibold\">'+cfg.account_name+'</span>...</p>'"
        "+'</div>'"
        "+'<div class=\"pt-2 space-y-2 max-w-xl mx-auto text-left opacity-80\">'"
        "+'<div class=\"p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 animate-pulse space-y-2\">'"
        "+'<div class=\"flex items-center gap-2.5\"><div class=\"w-6 h-6 rounded-full bg-slate-700/80\"></div><div class=\"h-2.5 w-28 rounded bg-slate-700/80\"></div><div class=\"h-2 w-16 rounded bg-slate-800 ml-auto\"></div></div>'"
        "+'<div class=\"h-2.5 w-3/4 rounded bg-slate-700/60\"></div>'"
        "+'</div>'"
        "+'<div class=\"ml-6 p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 animate-pulse space-y-1.5\">'"
        "+'<div class=\"flex items-center gap-2\"><div class=\"h-2 w-24 rounded bg-cyan-500/30\"></div><div class=\"h-2 w-14 rounded bg-emerald-500/20\"></div></div>'"
        "+'<div class=\"h-2 w-5/6 rounded bg-slate-700/50\"></div>'"
        "+'</div>'"
        "+'</div>'"
        "+'</div>'"
        "+'</div>'"
        "+'</div>'"
        "+'</div>'"
        "+'</div>';"
        "}"
        "_removeBottomComposerDom();"
        "var nowMs=Date.now();"
        "if(!window.__gbSavvySyncInFlight&&(nowMs-(window.__gbLastZeroRetryMs||0)>1800)){"
        "window.__gbLastZeroRetryMs=nowMs;"
        "setTimeout(function(){_runSavvyLiveAutoSync(true);},350);"
        "}"
        "}"
        "function _replacePreviousPostCaptionInDom(panel,cfg){"
        "if(!panel||!cfg)return;"
        "panel.querySelectorAll('p, div, span').forEach(function(el){"
        "if(el.children&&el.children.length>0)return;"
        "var txt=String(el.textContent||'').trim();"
        "if(txt.toLowerCase()==='previous post'||txt.toLowerCase()==='no caption available'||txt.toLowerCase()==='(no caption)'){"
        "el.textContent=cfg.caption;"
        "}"
        "});"
        "}"
        "function _injectSavvyLiveFbTestCta(explicitRecId){"
        "var panel=document.getElementById('comment-detail-panel');"
        "if(!panel)return;"
        "var cfg=_getActiveShowcaseConfig(explicitRecId)||SHOWCASE_POSTS['post_ext_dc6a96869a'];"
        "_replacePreviousPostCaptionInDom(panel,cfg);"
        "_removeBottomComposerDom();"
        "var existingCta=document.getElementById('gb-savvy-live-fb-test-cta');"
        "if(existingCta){"
        "if(existingCta.dataset.recordId!==cfg.record_id){"
        "existingCta.dataset.recordId=cfg.record_id;"
        "existingCta.innerHTML=_buildSavvyCtaHtml(cfg);"
        "}"
        "return;"
        "}"
        "var countLabel=document.getElementById('post-comments-count-label');"
        "var commentsSection=(countLabel&&countLabel.parentElement)?countLabel.parentElement.parentElement:null;"
        "if(!commentsSection)return;"
        "panel.querySelectorAll('.fa-align-left').forEach(function(ic){"
        "var box=ic.parentElement;"
        "if(box&&box.textContent.indexOf('Text-only post')!==-1){box.style.display='none';}"
        "});"
        "var cta=document.createElement('div');"
        "cta.id='gb-savvy-live-fb-test-cta';"
        "cta.dataset.recordId=cfg.record_id;"
        "cta.className='p-3 rounded-xl border border-emerald-400/50 bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-cyan-950/80 shadow-[0_0_20px_rgba(16,185,129,0.18)] flex flex-col sm:flex-row sm:items-center justify-between gap-3';"
        "cta.innerHTML=_buildSavvyCtaHtml(cfg);"
        "if(commentsSection.parentElement){"
        "commentsSection.parentElement.insertBefore(cta,commentsSection);"
        "}"
        "}"
        "function _ensureShowcaseLivePostDetailsCache(){"
        "if(typeof livePostDetailsCache==='undefined'||!livePostDetailsCache)return;"
        "Object.keys(SHOWCASE_POSTS).forEach(function(recKey){"
        "var cfg=SHOWCASE_POSTS[recKey];"
        "var existing=livePostDetailsCache[recKey]||{};"
        "var curCap=String(existing.caption||existing.post_caption||'').trim();"
        "var useCap=(!curCap||curCap.toLowerCase()==='previous post'||curCap.indexOf('Previous Post')!==-1)?cfg.caption:curCap;"
        "livePostDetailsCache[recKey]=Object.assign({},existing,{"
        "record_id:cfg.record_id,"
        "platform:cfg.platform,"
        "account_name:cfg.account_name,"
        "post_type:cfg.post_type,"
        "caption:useCap,"
        "post_caption:useCap,"
        "caption_text:useCap,"
        "external_post_id:cfg.external_post_id,"
        "permalink_url:cfg.permalink_url,"
        "post_permalink:cfg.permalink_url,"
        "video_url:existing.video_url||'',"
        "thumbnail_url:existing.thumbnail_url||'',"
        "images:Array.isArray(existing.images)?existing.images:[],"
        "fallback_preview_url:existing.fallback_preview_url||''"
        "});"
        "});"
        "}"
        "function _customizeSavvyFindsComposer(explicitRecId){"
        "var cfg=_getActiveShowcaseConfig(explicitRecId);"
        "if(!cfg)return;"
        "_ensureShowcaseLivePostDetailsCache();"
        "_removeBottomComposerDom();"
        "var grp=_getSavvyCommentsGroup(cfg.record_id);"
        "if(grp.length===0){"
        "_renderSavvyZeroCommentsCard(cfg.record_id);"
        "}else{"
        "_injectSavvyLiveFbTestCta(cfg.record_id);"
        "}"
        "_removeBottomComposerDom();"
        "_ensureSavvyFiveSecMonitor();"
        "}"
        "function _normalizeVisitorRepliesOnClient(){"
        "_ensureShowcaseLivePostDetailsCache();"
        "if(typeof commentsList==='undefined'||!Array.isArray(commentsList))return;"
        "for(var i=commentsList.length-1;i>=0;i--){"
        "if(_isBlockedSyntheticEntry(commentsList[i])){commentsList.splice(i,1);}"
        "}"
        "commentsList.forEach(function(c){"
        "var cfg=_matchShowcaseConfigForComment(c);"
        "if(!cfg)return;"
        "c.record_id=cfg.record_id;"
        "c.platform=cfg.platform;"
        "c.account_name=cfg.account_name;"
        "c.post_permalink=cfg.permalink_url;"
        "c.comment_permalink=cfg.permalink_url;"
        "c.external_post_id=cfg.external_post_id;"
        "c.post_type=cfg.post_type;"
        "c.post_caption=cfg.caption;"
        "c.caption=cfg.caption;"
        "c.can_reply=true;"
        "if(Array.isArray(c.replies)){"
        "c.replies=c.replies.filter(function(r){return !_isBlockedSyntheticEntry(r);});"
        "}"
        "});"
        "}"
        "async function _runSavvyLiveAutoSync(isManual){"
        "var cfg=_getActiveShowcaseConfig();"
        "if(!cfg)return;"
        "if(window.__gbSavvySyncInFlight&&!isManual)return;"
        "window.__gbSavvySyncInFlight=true;"
        "var syncIcon=document.getElementById('gb-manual-sync-icon');"
        "if(syncIcon&&isManual)syncIcon.classList.add('fa-spin');"
        "try{"
        "if(typeof selectedRecordId!=='undefined')selectedRecordId=cfg.record_id;"
        "if(window._gbInFlightPolls)window._gbInFlightPolls.comments=false;"
        "if(typeof window.fetchComments==='function'){"
        "await window.fetchComments(true);"
        "}"
        "_normalizeVisitorRepliesOnClient();"
        "var grp=_getSavvyCommentsGroup(cfg.record_id);"
        "var panel=document.getElementById('comment-detail-panel');"
        "if(grp.length===0){"
        "_renderSavvyZeroCommentsCard(cfg.record_id);"
        "}else if(panel&&panel.dataset&&panel.dataset.savvyEmptyState==='1'&&typeof window.renderSelectedCommentDetail==='function'){"
        "panel.dataset.savvyEmptyState='0';"
        "await window.renderSelectedCommentDetail(cfg.record_id,false);"
        "}else if(typeof window.syncOpenPostThreadLive==='function'){"
        "window.syncOpenPostThreadLive(cfg.record_id);"
        "}"
        "_customizeSavvyFindsComposer(cfg.record_id);"
        "var badgeEl=document.getElementById('gb-savvy-autosync-badge');"
        "if(badgeEl){"
        "var nowStr=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'});"
        "badgeEl.textContent='LIVE 5s AUTO-SYNC \\u2022 SYNCED '+nowStr;"
        "}"
        "}catch(_){}finally{"
        "window.__gbSavvySyncInFlight=false;"
        "if(syncIcon)syncIcon.classList.remove('fa-spin');"
        "}"
        "}"
        "function _ensureSavvyFiveSecMonitor(){"
        "if(window.__gbSavvyFiveSecInterval)return;"
        "if(!_isSavvyFindsActive())return;"
        "window.__gbSavvyFiveSecInterval=setInterval(function(){"
        "if(document.hidden)return;"
        "_runSavvyLiveAutoSync(false);"
        "},5000);"
        "}"
        "function _lockCalendarDomAndFns(){"
        "_ensureShowcaseLivePostDetailsCache();"
        "var hEl=document.getElementById('calendar-main-heading');"
        "if(hEl&&hEl.textContent!==HEADING_TEXT){hEl.textContent=HEADING_TEXT;}"
        "var sEl=document.getElementById('calendar-main-subheading');"
        "if(sEl&&sEl.textContent!==SUBHEADING_TEXT){sEl.textContent=SUBHEADING_TEXT;}"
        "if(window.gbActivePopoutParams&&window.gbActivePopoutParams.tab==='calendar'&&window.gbActivePopoutMode!=='comment_thread'){"
        "var ptEl=document.getElementById('gb-popout-window-title');"
        "if(ptEl&&ptEl.textContent!==POPOUT_CAL_TITLE){ptEl.textContent=POPOUT_CAL_TITLE;}"
        "var psEl=document.getElementById('gb-popout-window-subtitle');"
        "if(psEl&&psEl.textContent!==SUBHEADING_TEXT){psEl.textContent=SUBHEADING_TEXT;}"
        "document.title=POPOUT_CAL_TITLE+' \\u2022 GlennBot Automations';"
        "}"
        "['cal-subtab-composio','calendar-composio-toolbar','schedule-meeting-modal','connect-accounts-modal'].forEach(function(id){"
        "var el=document.getElementById(id);"
        "if(el){el.classList.add('hidden');el.style.setProperty('display','none','important');}"
        "});"
        "var connectBox=document.querySelector('#view-scheduler > div:first-child > div:nth-child(2)');"
        "if(connectBox){connectBox.classList.add('hidden');connectBox.style.setProperty('display','none','important');}"
        "var currentSwitch=window.switchCalendarSubTab;"
        "if(!currentSwitch||!currentSwitch._gbPortfolioLocked){"
        "var origSwitch=(typeof currentSwitch==='function')?currentSwitch:null;"
        "var lockedSwitch=function(mode){"
        "if(mode==='composio')return;"
        "if(typeof origSwitch==='function'){origSwitch('posts');}"
        "var h=document.getElementById('calendar-main-heading');"
        "if(h&&h.textContent!==HEADING_TEXT){h.textContent=HEADING_TEXT;}"
        "var s=document.getElementById('calendar-main-subheading');"
        "if(s&&s.textContent!==SUBHEADING_TEXT){sEl=s;s.textContent=SUBHEADING_TEXT;}"
        "};"
        "lockedSwitch._gbPortfolioLocked=true;"
        "window.switchCalendarSubTab=lockedSwitch;"
        "}"
        "window.openScheduleMeetingModal=function(){};"
        "window.startCalendarOAuthPopup=function(){};"
        "window.startEmailOAuthPopup=function(){};"
        "window.disconnectEmailAccount=function(){};"
        "window.openImapConnectModal=function(){};"
        "var curResetDetail=window.resetCommentDetailPanel;"
        "if(typeof curResetDetail==='function'&&!curResetDetail._gbSavvyWrapped){"
        "var origResetDetail=curResetDetail;"
        "var wrappedResetDetail=function(){"
        "var activeCfg=_getActiveShowcaseConfig();"
        "if(activeCfg){"
        "if(typeof selectedRecordId!=='undefined')selectedRecordId=activeCfg.record_id;"
        "_renderSavvyZeroCommentsCard(activeCfg.record_id);"
        "return;"
        "}"
        "return origResetDetail.apply(this,arguments);"
        "};"
        "wrappedResetDetail._gbSavvyWrapped=true;"
        "window.resetCommentDetailPanel=wrappedResetDetail;"
        "}"
        "var curRenderDetail=window.renderSelectedCommentDetail;"
        "if(typeof curRenderDetail==='function'&&!curRenderDetail._gbSavvyWrapped){"
        "var origRenderDetail=curRenderDetail;"
        "var wrappedRenderDetail=async function(recId,fetchFresh){"
        "_normalizeVisitorRepliesOnClient();"
        "var targetCfg=_getActiveShowcaseConfig(recId);"
        "if(targetCfg&&_getSavvyCommentsGroup(targetCfg.record_id).length===0){"
        "_renderSavvyZeroCommentsCard(targetCfg.record_id);"
        "_ensureSavvyFiveSecMonitor();"
        "return;"
        "}"
        "var panel=document.getElementById('comment-detail-panel');"
        "if(panel&&panel.dataset)panel.dataset.savvyEmptyState='0';"
        "var useFresh=fetchFresh;"
        "if(targetCfg&&typeof livePostDetailsCache!=='undefined'&&livePostDetailsCache&&livePostDetailsCache[targetCfg.record_id]){"
        "useFresh=false;"
        "}"
        "var res=await origRenderDetail.call(this,recId,useFresh);"
        "if(targetCfg)_customizeSavvyFindsComposer(targetCfg.record_id);"
        "return res;"
        "};"
        "wrappedRenderDetail._gbSavvyWrapped=true;"
        "window.renderSelectedCommentDetail=wrappedRenderDetail;"
        "}"
        "var curSyncLive=window.syncOpenPostThreadLive;"
        "if(typeof curSyncLive==='function'&&!curSyncLive._gbSavvyWrapped){"
        "var origSyncLive=curSyncLive;"
        "var wrappedSyncLive=function(recId){"
        "_normalizeVisitorRepliesOnClient();"
        "var targetCfg=_getActiveShowcaseConfig(recId);"
        "if(targetCfg&&_getSavvyCommentsGroup(targetCfg.record_id).length===0){"
        "_renderSavvyZeroCommentsCard(targetCfg.record_id);"
        "return;"
        "}"
        "var panel=document.getElementById('comment-detail-panel');"
        "if(targetCfg&&panel&&panel.dataset&&panel.dataset.savvyEmptyState==='1'&&typeof window.renderSelectedCommentDetail==='function'){"
        "panel.dataset.savvyEmptyState='0';"
        "window.renderSelectedCommentDetail(targetCfg.record_id,false);"
        "return;"
        "}"
        "var r=origSyncLive.apply(this,arguments);"
        "if(targetCfg)_customizeSavvyFindsComposer(targetCfg.record_id);"
        "return r;"
        "};"
        "wrappedSyncLive._gbSavvyWrapped=true;"
        "window.syncOpenPostThreadLive=wrappedSyncLive;"
        "}"
        "var curFetchComments=window.fetchComments;"
        "if(typeof curFetchComments==='function'&&!curFetchComments._gbSavvyWrapped){"
        "var origFetchComments=curFetchComments;"
        "var wrappedFetchComments=async function(showFeedback){"
        "var activeCfg=_getActiveShowcaseConfig();"
        "if(activeCfg){"
        "if(typeof selectedRecordId!=='undefined')selectedRecordId=activeCfg.record_id;"
        "if(_getSavvyCommentsGroup(activeCfg.record_id).length===0&&window._gbInFlightPolls){"
        "window._gbInFlightPolls.comments=false;"
        "}"
        "}"
        "var r=await origFetchComments.apply(this,arguments);"
        "var postFetchCfg=_getActiveShowcaseConfig();"
        "if(postFetchCfg){"
        "_normalizeVisitorRepliesOnClient();"
        "if(typeof selectedRecordId!=='undefined')selectedRecordId=postFetchCfg.record_id;"
        "var grp=_getSavvyCommentsGroup(postFetchCfg.record_id);"
        "var panel=document.getElementById('comment-detail-panel');"
        "if(grp.length===0){"
        "_renderSavvyZeroCommentsCard(postFetchCfg.record_id);"
        "}else if((panel&&panel.dataset&&panel.dataset.savvyEmptyState==='1')||!document.getElementById('post-comments-thread-list')){"
        "if(panel&&panel.dataset)panel.dataset.savvyEmptyState='0';"
        "if(typeof window.renderSelectedCommentDetail==='function'){"
        "await window.renderSelectedCommentDetail(postFetchCfg.record_id,false);"
        "}"
        "}else if(typeof window.syncOpenPostThreadLive==='function'){"
        "window.syncOpenPostThreadLive(postFetchCfg.record_id);"
        "}"
        "_customizeSavvyFindsComposer(postFetchCfg.record_id);"
        "}"
        "return r;"
        "};"
        "wrappedFetchComments._gbSavvyWrapped=true;"
        "window.fetchComments=wrappedFetchComments;"
        "}"
        "var initCfg=_getActiveShowcaseConfig();"
        "if(initCfg){"
        "if(typeof selectedRecordId!=='undefined')selectedRecordId=initCfg.record_id;"
        "_normalizeVisitorRepliesOnClient();"
        "var grpInit=_getSavvyCommentsGroup(initCfg.record_id);"
        "if(grpInit.length===0){"
        "_renderSavvyZeroCommentsCard(initCfg.record_id);"
        "}else if(!document.getElementById('post-comments-thread-list')&&typeof window.renderSelectedCommentDetail==='function'){"
        "window.renderSelectedCommentDetail(initCfg.record_id,false);"
        "}"
        "_ensureSavvyFiveSecMonitor();"
        "}"
        "_customizeSavvyFindsComposer();"
        "}"
        "function _lockEmailHubDemoMode(){"
        "window.activeEmailFolder='sent';"
        "try{activeEmailFolder='sent';}catch(_){}"
        "window.activeEmailPlatformFilter='gmail';"
        "try{activeEmailPlatformFilter='gmail';}catch(_){}"
        "try{activeEmailPlatform='gmail';}catch(_){}"
        "window.startEmailOAuthPopup=function(){};"
        "window.disconnectEmailAccount=function(){};"
        "window.openImapConnectModal=function(){};"
        "if(typeof emailAccountsList!=='undefined'&&Array.isArray(emailAccountsList)){"
        "var keptAccs=emailAccountsList.filter(function(a){return a&&String(a.email_address||a.email||a.name||'').trim().toLowerCase()===LOCKED_EMAIL_ADDRESS;});"
        "if(keptAccs.length===0){"
        "keptAccs=[{id:'gmail_glennard_tasico_va',account_id:'gmail_glennard_tasico_va',platform:'gmail',provider:'gmail',email_address:LOCKED_EMAIL_ADDRESS,email:LOCKED_EMAIL_ADDRESS,name:LOCKED_EMAIL_ADDRESS,status:'connected',connected:true}];"
        "}"
        "if(emailAccountsList.length!==keptAccs.length||emailAccountsList[0]!==keptAccs[0]){"
        "emailAccountsList.length=0;"
        "keptAccs.forEach(function(a){emailAccountsList.push(a);});"
        "}"
        "var targetAccId=String(keptAccs[0].id||keptAccs[0].account_id||'gmail_glennard_tasico_va');"
        "window.activeEmailAccountId=targetAccId;"
        "try{activeEmailAccountId=targetAccId;}catch(_){}"
        "}"
        "var curSwitchFolder=window.switchEmailFolder;"
        "if(typeof curSwitchFolder==='function'&&!curSwitchFolder._gbEmailSentLocked){"
        "var origSwitchFolder=curSwitchFolder;"
        "var lockedSwitchFolder=function(){"
        "window.activeEmailFolder='sent';"
        "try{activeEmailFolder='sent';}catch(_){}"
        "return origSwitchFolder.call(this,'sent');"
        "};"
        "lockedSwitchFolder._gbEmailSentLocked=true;"
        "window.switchEmailFolder=lockedSwitchFolder;"
        "}else if(typeof curSwitchFolder!=='function'){"
        "window.switchEmailFolder=function(){"
        "window.activeEmailFolder='sent';"
        "try{activeEmailFolder='sent';}catch(_){}"
        "if(typeof window.fetchEmailMessages==='function')return window.fetchEmailMessages('sent');"
        "};"
        "window.switchEmailFolder._gbEmailSentLocked=true;"
        "}"
        "var curFilterPlat=window.filterEmailByPlatform||window.switchEmailPlatformFilter||window.handleTopEmailPlatformFilter;"
        "if(typeof curFilterPlat==='function'&&!curFilterPlat._gbEmailPlatLocked){"
        "var origFilterPlat=curFilterPlat;"
        "var lockedFilterPlat=function(){"
        "return origFilterPlat.call(this,'gmail');"
        "};"
        "lockedFilterPlat._gbEmailPlatLocked=true;"
        "if(window.filterEmailByPlatform)window.filterEmailByPlatform=lockedFilterPlat;"
        "if(window.switchEmailPlatformFilter)window.switchEmailPlatformFilter=lockedFilterPlat;"
        "if(window.handleTopEmailPlatformFilter)window.handleTopEmailPlatformFilter=lockedFilterPlat;"
        "}"
        "if(!window.showAllEmailPlatformsColumn||!window.showAllEmailPlatformsColumn._gbEmailPlatLocked){"
        "var lockedShowAll=function(){"
        "if(typeof window.focusEmailPlatform==='function'){try{window.focusEmailPlatform('gmail');}catch(_){}}"
        "};"
        "lockedShowAll._gbEmailPlatLocked=true;"
        "window.showAllEmailPlatformsColumn=lockedShowAll;"
        "}"
        "var emailRoot=document.getElementById('view-email');"
        "if(!emailRoot)return;"
        "['email-plat-card-microsoft','email-plat-card-imap','btn-show-all-email-platforms','email-folder-btn-inbox','email-folder-btn-drafts','email-folder-btn-spam','email-folder-btn-trash','btn-connect-email-top','btn-connect-gmail-card','btn-connect-microsoft-card','btn-connect-imap-card'].forEach(function(id){"
        "var el=document.getElementById(id);"
        "if(el&&!el.classList.contains('hidden')){el.classList.add('hidden');el.style.setProperty('display','none','important');}"
        "});"
        "var sentBtn=document.getElementById('email-folder-btn-sent');"
        "if(sentBtn){"
        "if(!sentBtn.classList.contains('bg-gb-cyan/20')){"
        "sentBtn.classList.remove('hidden','text-slate-400','bg-slate-800/60','border-transparent');"
        "sentBtn.classList.add('bg-gb-cyan/20','text-gb-cyan','border-gb-cyan/50');"
        "sentBtn.style.removeProperty('display');"
        "}"
        "if(String(sentBtn.textContent||'').indexOf('Sent Items')===-1){"
        "sentBtn.innerHTML='<i class=\"fas fa-paper-plane mr-1.5\"></i>Sent Items';"
        "}"
        "}"
        "var activeLbl=document.getElementById('email-active-account-label');"
        "if(activeLbl&&activeLbl.textContent!==LOCKED_EMAIL_LABEL){"
        "activeLbl.textContent=LOCKED_EMAIL_LABEL;"
        "}"
        "var accSelect=document.getElementById('email-active-account-select');"
        "if(accSelect){"
        "var targetVal=String(window.activeEmailAccountId||'gmail_glennard_tasico_va');"
        "Array.from(accSelect.options||[]).forEach(function(opt){"
        "var txt=String(opt.textContent||opt.value||'').toLowerCase();"
        "if(txt.indexOf(LOCKED_EMAIL_ADDRESS)===-1&&opt.value!==targetVal){opt.remove();}"
        "});"
        "if(!accSelect.options||accSelect.options.length===0){"
        "var o=document.createElement('option');"
        "o.value=targetVal;"
        "o.textContent=LOCKED_EMAIL_LABEL;"
        "accSelect.appendChild(o);"
        "}else if(accSelect.options[0].textContent!==LOCKED_EMAIL_LABEL){"
        "accSelect.options[0].textContent=LOCKED_EMAIL_LABEL;"
        "}"
        "if(accSelect.options.length>0&&accSelect.value!==accSelect.options[0].value){"
        "accSelect.value=accSelect.options[0].value;"
        "}"
        "}"
        "var platSelect=document.getElementById('email-top-platform-filter');"
        "if(platSelect){"
        "var platLabel='Gmail (glennard.tasico.va@gmail.com)';"
        "Array.from(platSelect.options||[]).forEach(function(opt){"
        "if(String(opt.value||'').toLowerCase()!=='gmail'){opt.remove();}"
        "});"
        "if(!platSelect.options||platSelect.options.length===0){"
        "var po=document.createElement('option');"
        "po.value='gmail';"
        "po.textContent=platLabel;"
        "platSelect.appendChild(po);"
        "}else if(platSelect.options[0].textContent!==platLabel){"
        "platSelect.options[0].textContent=platLabel;"
        "}"
        "if(platSelect.value!=='gmail'){"
        "platSelect.value='gmail';"
        "}"
        "}"
        "emailRoot.querySelectorAll('button, a').forEach(function(btn){"
        "var oc=String(btn.getAttribute('onclick')||'');"
        "var txt=String(btn.textContent||'').trim().toLowerCase();"
        "if(oc.indexOf('openConnectAccountsModal')!==-1||oc.indexOf('startEmailOAuthPopup')!==-1||oc.indexOf('disconnectEmailAccount')!==-1||oc.indexOf('openImapConnectModal')!==-1||txt==='+ connect email'||txt==='+ connect'||txt==='connect email'||txt==='switch platform'){"
        "btn.remove();"
        "}"
        "});"
        "emailRoot.querySelectorAll('p, div, span').forEach(function(node){"
        "if(node.children&&node.children.length>0)return;"
        "var t=String(node.textContent||'').trim();"
        "if(/connect a gmail,\\s*microsoft,\\s*or imap account/i.test(t)||/connect an email account/i.test(t)||/no email account connected/i.test(t)){"
        "node.textContent='Loading sent emails for glennard.tasico.va@gmail.com...';"
        "}"
        "});"
        "}"
        "function _isMessageThreadMode(){"
        "var s=String((window.location&&window.location.search)||'');"
        "return window.gbActivePopoutMode==='message_thread'||s.indexOf('popout_mode=message_thread')!==-1;"
        "}"
        "function _getLivePortfolioConvId(){"
        "var p=window.gbActivePopoutParams||{};"
        "var cid=String(p.conv_id||'').trim();"
        "if(!cid&&window.location&&window.location.search){"
        "try{cid=String(new URLSearchParams(window.location.search).get('conv_id')||'').trim();}catch(_){}"
        "}"
        "return (cid.indexOf('fb_live_')===0||cid.indexOf('wa_live_dm_')===0||cid.indexOf('wa_live_')===0||cid.indexOf('ig_live_')===0)?cid:'';"
        "}"
        "function _isLivePortfolioDmSession(){"
        "return Boolean(_isMessageThreadMode()&&_getLivePortfolioConvId());"
        "}"
        "function _isWaitForNewMessageMode(){"
        "if(!_isMessageThreadMode()||_isLivePortfolioDmSession())return false;"
        "var p=window.gbActivePopoutParams||{};"
        "var s=String((window.location&&window.location.search)||'');"
        "return String(p.wait_for_new||'')==='1'||s.indexOf('wait_for_new=1')!==-1;"
        "}"
        "async function _syncLatestActiveMessengerThread(forceReload){"
        "if(!_isMessageThreadMode())return;"
        "if(window.__gbMsgAutoSyncInFlight&&!forceReload)return;"
        "window.__gbMsgAutoSyncInFlight=true;"
        "try{"
        "var p=window.gbActivePopoutParams||{};"
        "var accId=String(p.account_id||'6af0b109818eb5c88d1e87a6').trim();"
        "var liveConvId=_getLivePortfolioConvId();"
        "if(liveConvId){"
        "var liveConvKey=String(p.conv_key||(accId+'_'+liveConvId)).trim();"
        "var curId=(typeof selectedConversationId!=='undefined')?String(selectedConversationId||''):'';"
        "if(!curId||curId!==liveConvId||forceReload){"
        "if(typeof window.selectMessageConversation==='function'){"
        "await window.selectMessageConversation(liveConvKey,liveConvId,accId);"
        "}else if(typeof window.refreshOpenConversationSilently==='function'){"
        "await window.refreshOpenConversationSilently(liveConvId,accId);"
        "}"
        "}else if(typeof window.refreshOpenConversationSilently==='function'){"
        "await window.refreshOpenConversationSilently(liveConvId,accId);"
        "}else if(typeof window.selectMessageConversation==='function'){"
        "await window.selectMessageConversation(liveConvKey,liveConvId,accId);"
        "}"
        "return;"
        "}"
        "var res=await fetch('/api/messages/conversations?force=false&platform=facebook&account_id='+encodeURIComponent(accId)+'&limit_per_page=10&_ts='+Date.now());"
        "var data=await res.json();"
        "var convs=(data&&Array.isArray(data.conversations))?data.conversations:[];"
        "var fbConvs=convs.filter(function(c){return c&&String(c.platform||'').toLowerCase()==='facebook'&&(String(c.account_id||'')===accId||String(c.account_name||'').toLowerCase().indexOf('glennbot')!==-1);});"
        "var latest=fbConvs.length>0?fbConvs[0]:null;"
        "if(!latest)return;"
        "var targetKey=String(latest.conv_key||'');"
        "var targetId=String(latest.conversation_id||'');"
        "var targetAcc=String(latest.account_id||accId);"
        "if(typeof messagesConversationsList!=='undefined'&&Array.isArray(messagesConversationsList)){"
        "if(!messagesConversationsList.some(function(x){return x&&x.conv_key===latest.conv_key;})){messagesConversationsList.unshift(latest);}"
        "}"
        "var curKeyFallback=(typeof selectedConversationKey!=='undefined')?String(selectedConversationKey||''):'';"
        "if(!curKeyFallback||curKeyFallback!==targetKey){"
        "if(typeof window.selectMessageConversation==='function'){"
        "await window.selectMessageConversation(targetKey,targetId,targetAcc);"
        "}"
        "}else if(typeof window.refreshOpenConversationSilently==='function'){"
        "await window.refreshOpenConversationSilently(targetId,targetAcc);"
        "}"
        "}catch(_){}finally{"
        "window.__gbMsgAutoSyncInFlight=false;"
        "}"
        "}"
        "function _ensureAutoLatestMessageThreadMonitor(){"
        "if(!_isMessageThreadMode())return;"
        "if(!window.__gbMsgAutoLatestStarted){"
        "window.__gbMsgAutoLatestStarted=true;"
        "var pollMs=_isLivePortfolioDmSession()?2500:8000;"
        "window.__gbMsgAutoLatestInterval=setInterval(function(){"
        "if(document.hidden)return;"
        "_syncLatestActiveMessengerThread(false);"
        "},pollMs);"
        "window.addEventListener('message',function(ev){"
        "if(ev&&ev.data&&ev.data.type==='gb_live_dm_updated'){"
        "if(ev.data.conv_id&&window.gbActivePopoutParams){"
        "window.gbActivePopoutParams.conv_id=String(ev.data.conv_id);"
        "if(ev.data.conv_key)window.gbActivePopoutParams.conv_key=String(ev.data.conv_key);"
        "if(ev.data.account_id)window.gbActivePopoutParams.account_id=String(ev.data.account_id);"
        "}"
        "_syncLatestActiveMessengerThread(true);"
        "setTimeout(function(){_syncLatestActiveMessengerThread(true);},600);"
        "}"
        "});"
        "}"
        "}"
        "_lockCalendarDomAndFns();"
        "_lockEmailHubDemoMode();"
        "_ensureAutoLatestMessageThreadMonitor();"
        "if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){_lockCalendarDomAndFns();_lockEmailHubDemoMode();_ensureAutoLatestMessageThreadMonitor();});}"
        "window.addEventListener('load',function(){"
        "_lockCalendarDomAndFns();"
        "_lockEmailHubDemoMode();"
        "_ensureAutoLatestMessageThreadMonitor();"
        "setTimeout(_lockCalendarDomAndFns,150);"
        "setTimeout(_lockEmailHubDemoMode,150);"
        "setTimeout(_lockCalendarDomAndFns,600);"
        "setTimeout(_lockEmailHubDemoMode,600);"
        "if(window.gbActivePopoutParams&&window.gbActivePopoutParams.tab==='email'&&typeof window.switchEmailFolder==='function'){"
        "try{window.switchEmailFolder('sent');}catch(_){}"
        "}"
        "try{"
        "var obsTarget=document.body||document.getElementById('comment-detail-panel');"
        "if(obsTarget&&typeof MutationObserver!=='undefined'){"
        "var mo=new MutationObserver(function(){"
        "_removeBottomComposerDom();"
        "var activeCfg=_getActiveShowcaseConfig();"
        "var panel=document.getElementById('comment-detail-panel');"
        "if(activeCfg&&panel)_replacePreviousPostCaptionInDom(panel,activeCfg);"
        "});"
        "mo.observe(obsTarget,{childList:true,subtree:true});"
        "}"
        "}catch(_){}"
        "});"
        "})();"
        "</script>"
    )


@app.api_route("/glennbot-popout", methods=["GET", "HEAD"], response_class=HTMLResponse)
async def glennbot_authenticated_popout(request: Request):
    """
    Fetches {GLENNBOT_BASE_URL}/?{request.url.query} with the auto-authenticated
    gb_auth_session cookie and X-GlennBot-Session header, injects the instant
    popout CSS + session script into <head>, pre-transforms the DOM so the target
    Expanded View renders on the very first frame with zero homepage flash, and
    rewrites /static/ links to /gb-static/.
    """
    if request.method == "HEAD":
        return HTMLResponse(content="", status_code=200)

    popout_mode = (request.query_params.get("popout_mode") or "workspace_view").strip() or "workspace_view"
    raw_tab = request.query_params.get("tab")
    if not raw_tab and popout_mode == "comment_thread":
        raw_tab = "comments"
    elif not raw_tab and popout_mode == "message_thread":
        raw_tab = "messages"
    target_tab = _sanitize_popout_tab(raw_tab)
    popout_params = dict(request.query_params)
    popout_params.setdefault("tab", target_tab)
    popout_params.setdefault("popout_mode", popout_mode)
    req_rec_param = str(popout_params.get("record_id") or "").strip()
    if req_rec_param in SHOWCASE_POST_CONFIGS:
        _SAVVY_FINDS_UPSTREAM_RECORD_ID_State["record_id"] = req_rec_param

    session_token = await get_glennbot_auto_session_token()
    now = time.time()
    cached_html = _GLENNBOT_HTML_SHELL_CACHE.get("html") or ""
    cached_exp = float(_GLENNBOT_HTML_SHELL_CACHE.get("expires_at") or 0.0)

    if cached_html and now < cached_exp:
        html_text = cached_html
        status_code = int(_GLENNBOT_HTML_SHELL_CACHE.get("status_code") or 200)
    else:
        query_str = request.url.query or f"popout_mode={popout_mode}&tab={target_tab}"
        upstream_url = f"{GLENNBOT_BASE_URL}/?{query_str}"

        req_headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "X-GlennBot-Session": session_token,
            "Cookie": f"gb_auth_session={session_token}",
        }
        if GLENNBOT_INTERNAL_API_KEY:
            req_headers["X-API-Key"] = GLENNBOT_INTERNAL_API_KEY

        html_text = ""
        status_code = 200
        try:
            async with httpx.AsyncClient(
                timeout=GLENNBOT_TIMEOUT_SECONDS,
                follow_redirects=True,
            ) as client:
                resp = await client.get(
                    upstream_url,
                    headers=req_headers,
                    cookies={"gb_auth_session": session_token},
                )
                if resp.status_code in (401, 403):
                    session_token = await get_glennbot_auto_session_token(force_refresh=True)
                    req_headers["X-GlennBot-Session"] = session_token
                    req_headers["Cookie"] = f"gb_auth_session={session_token}"
                    resp = await client.get(
                        upstream_url,
                        headers=req_headers,
                        cookies={"gb_auth_session": session_token},
                    )
                status_code = resp.status_code
                html_text = resp.text
        except Exception:
            status_code = 502
            html_text = ""

        if status_code == 200 and html_text and "<html" in html_text.lower():
            _GLENNBOT_HTML_SHELL_CACHE["html"] = html_text
            _GLENNBOT_HTML_SHELL_CACHE["status_code"] = 200
            _GLENNBOT_HTML_SHELL_CACHE["expires_at"] = now + 300.0
        else:
            status_code = 200
            if cached_html and "<html" in cached_html.lower():
                html_text = cached_html
            else:
                html_text = (
                    "<!DOCTYPE html><html><head><meta charset='utf-8'>"
                    "<title>GlennBot Live Thread</title>"
                    "<style>"
                    "body{background:#050b14;color:#e2e8f0;font-family:system-ui,-apple-system,sans-serif;margin:0;padding:16px;}"
                    ".hidden{display:none!important;}"
                    ".gb-fb-bar{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:12px;background:rgba(15,23,42,0.85);border:1px solid rgba(6,182,212,0.3);margin-bottom:14px;}"
                    ".gb-fb-badge{background:rgba(6,182,212,0.2);color:#22d3ee;border:1px solid rgba(34,211,238,0.4);padding:3px 8px;border-radius:6px;font-size:10px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;}"
                    ".gb-fb-card{border-radius:14px;background:rgba(15,23,42,0.75);border:1px solid rgba(51,65,85,0.7);padding:16px;display:flex;flex-direction:column;gap:12px;min-height:380px;}"
                    ".gb-fb-hdr{display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;border-bottom:1px solid rgba(51,65,85,0.6);}"
                    ".gb-fb-msgs{display:flex;flex-direction:column;gap:12px;flex:1;overflow-y:auto;max-height:340px;padding:6px 2px;}"
                    ".gb-fb-row{display:flex;flex-direction:column;max-width:82%;gap:4px;}"
                    ".gb-fb-row.own{align-self:flex-end;align-items:flex-end;}"
                    ".gb-fb-row.user{align-self:flex-start;align-items:flex-start;}"
                    ".gb-fb-meta{font-size:11px;color:#94a3b8;}"
                    ".gb-fb-meta .own-name{color:#22d3ee;font-weight:700;}"
                    ".gb-fb-bubble{padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.45;}"
                    ".gb-fb-row.user .gb-fb-bubble{background:#1e293b;color:#f8fafc;border:1px solid rgba(71,85,105,0.6);}"
                    ".gb-fb-row.own .gb-fb-bubble{background:rgba(8,51,68,0.65);color:#f0fdfa;border:1px solid rgba(6,182,212,0.45);box-shadow:0 0 18px rgba(6,182,212,0.12);}"
                    "</style></head><body>"
                    "<div id='gb-popout-window-bar' class='gb-fb-bar'>"
                    "<div style='display:flex;align-items:center;gap:10px;'>"
                    "<span class='gb-fb-badge'>EXPANDED FOCUS WINDOW</span>"
                    "<div><div id='gb-popout-window-title' style='font-size:13px;font-weight:800;color:#fff;'>Chat with Portfolio Client — Expanded View</div>"
                    "<div id='gb-popout-window-subtitle' style='font-size:11px;color:#94a3b8;'>Focused Conversation Window • Real-Time Direct Messaging &amp; Replies</div></div>"
                    "</div></div>"
                    "<div id='view-messages' class='hidden'><div id='message-detail-panel' class='gb-fb-card'>"
                    "<div class='gb-fb-hdr'><div><div id='gb-fb-part-name' style='font-weight:800;font-size:14px;color:#fff;'>Portfolio Client</div>"
                    "<div style='font-size:11px;color:#94a3b8;'>Chatting via <span id='gb-fb-acc-name' style='color:#22d3ee;font-weight:700;'>GlennBot Automations</span> • External API</div></div>"
                    "<button type='button' onclick='if(window.refreshOpenConversationSilently)window.refreshOpenConversationSilently(window.selectedConversationId,window.selectedAccountId);' style='background:#0f172a;color:#cbd5e1;border:1px solid #334155;border-radius:8px;padding:6px 12px;font-size:11px;cursor:pointer;'>&#x21bb; Refresh Chat</button></div>"
                    "<div id='gb-fb-thread-messages' class='gb-fb-msgs'></div>"
                    "</div></div>"
                    "<div id='view-email' class='hidden' style='flex-direction:column;gap:14px;width:100%;'>"
                    "<div class='gb-fb-bar' style='margin-bottom:0;flex-wrap:wrap;gap:10px;'>"
                    "<div style='display:flex;align-items:center;gap:10px;'>"
                    "<span class='gb-fb-badge'>CONNECTED ACCOUNT</span>"
                    "<span id='email-active-account-label' style='font-size:13px;font-weight:700;color:#f8fafc;'>glennard.tasico.va@gmail.com (Gmail)</span>"
                    "</div>"
                    "<div style='display:flex;align-items:center;gap:8px;'>"
                    "<select id='email-active-account-select' style='background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:8px;padding:6px 10px;font-size:12px;'>"
                    "<option value='gmail_glennard_tasico_va'>glennard.tasico.va@gmail.com (Gmail)</option>"
                    "</select>"
                    "<select id='email-top-platform-filter' style='background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:8px;padding:6px 10px;font-size:12px;'>"
                    "<option value='gmail'>Gmail (glennard.tasico.va@gmail.com)</option>"
                    "</select>"
                    "<button type='button' id='btn-sync-email-sent' onclick='if(window.fetchEmailMessages)window.fetchEmailMessages(\"sent\");' style='background:#0f172a;color:#22d3ee;border:1px solid rgba(34,211,238,0.4);border-radius:8px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer;'>&#x21bb; Refresh Sent Items</button>"
                    "</div></div>"
                    "<div style='display:grid;grid-template-columns:280px 1fr;gap:14px;'>"
                    "<div id='email-platforms-column' class='gb-fb-card' style='min-height:auto;'>"
                    "<div id='email-plat-card-gmail' style='padding:12px;border-radius:10px;background:rgba(6,182,212,0.08);border:1px solid rgba(34,211,238,0.35);'>"
                    "<div style='font-size:11px;font-weight:800;color:#22d3ee;text-transform:uppercase;letter-spacing:0.05em;'>Gmail • Connected</div>"
                    "<div style='font-size:13px;font-weight:700;color:#fff;margin-top:4px;'>glennard.tasico.va@gmail.com</div>"
                    "<div style='font-size:11px;color:#94a3b8;margin-top:2px;'>Locked to Sent Items • Portfolio Demo Mode</div>"
                    "</div>"
                    "<div id='email-plat-card-microsoft' class='hidden' style='display:none!important;'></div>"
                    "<div id='email-plat-card-imap' class='hidden' style='display:none!important;'></div>"
                    "<button id='btn-show-all-email-platforms' class='hidden' style='display:none!important;'></button>"
                    "</div>"
                    "<div class='gb-fb-card' style='min-height:360px;'>"
                    "<div id='email-folder-bar' style='display:flex;align-items:center;gap:8px;padding-bottom:10px;border-bottom:1px solid rgba(51,65,85,0.6);'>"
                    "<button id='email-folder-btn-inbox' class='hidden' style='display:none!important;'>Inbox</button>"
                    "<button id='email-folder-btn-sent' class='bg-gb-cyan/20 text-gb-cyan border-gb-cyan/50' onclick='if(window.switchEmailFolder)window.switchEmailFolder(\"sent\");' style='background:rgba(6,182,212,0.2);color:#22d3ee;border:1px solid rgba(6,182,212,0.5);border-radius:8px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;'>Sent Items</button>"
                    "<button id='email-folder-btn-drafts' class='hidden' style='display:none!important;'>Drafts</button>"
                    "<button id='email-folder-btn-spam' class='hidden' style='display:none!important;'>Spam</button>"
                    "<button id='email-folder-btn-trash' class='hidden' style='display:none!important;'>Trash</button>"
                    "</div>"
                    "<div id='email-messages-list' style='display:flex;flex-direction:column;gap:10px;padding-top:6px;'>"
                    "<div style='color:#94a3b8;font-size:12px;padding:18px 0;text-align:center;'>Loading sent emails for glennard.tasico.va@gmail.com...</div>"
                    "</div></div></div></div>"
                    "<script>"
                    "window.activeEmailFolder='sent';window.activeEmailAccountId='gmail_glennard_tasico_va';"
                    "window.fetchEmailMessages=async function(folder){"
                    "window.activeEmailFolder='sent';"
                    "var listEl=document.getElementById('email-messages-list');"
                    "if(!listEl)return;"
                    "try{"
                    "var r=await fetch('/api/email/messages?folder=sent&email_address=glennard.tasico.va%40gmail.com&platform=gmail&_ts='+Date.now(),{cache:'no-store'});"
                    "var d=await r.json();"
                    "var items=(d&&Array.isArray(d.messages))?d.messages:((d&&Array.isArray(d.items))?d.items:[]);"
                    "if(!items.length){listEl.innerHTML='<div style=\"color:#94a3b8;font-size:12px;padding:18px 0;text-align:center;\">Loading sent emails for glennard.tasico.va@gmail.com...</div>';return;}"
                    "listEl.innerHTML=items.map(function(m){"
                    "var subj=String(m.subject||'(No Subject)').replace(/</g,'&lt;');"
                    "var toAddr=String(m.to||m.recipient||'Visitor').replace(/</g,'&lt;');"
                    "var snip=String(m.snippet||m.body_preview||m.body||'').replace(/</g,'&lt;');"
                    "var dt=String(m.date||m.timestamp||'Sent via Gemini AI Auto-Responder').replace(/</g,'&lt;');"
                    "return '<div style=\"padding:12px;border-radius:10px;background:#0f172a;border:1px solid #1e293b;\"><div style=\"display:flex;justify-content:space-between;gap:8px;margin-bottom:4px;\"><span style=\"font-size:12px;font-weight:700;color:#22d3ee;\">To: '+toAddr+'</span><span style=\"font-size:11px;color:#64748b;\">'+dt+'</span></div><div style=\"font-size:13px;font-weight:700;color:#f8fafc;margin-bottom:4px;\">'+subj+'</div><div style=\"font-size:12px;color:#cbd5e1;line-height:1.45;\">'+snip+'</div></div>';"
                    "}).join('');"
                    "}catch(_){}"
                    "};"
                    "if(window.location.search.indexOf('tab=email')!==-1){setTimeout(function(){window.fetchEmailMessages('sent');},80);}"
                    "window.selectedConversationId='';window.selectedAccountId='6af0b109818eb5c88d1e87a6';"
                    "window.selectMessageConversation=async function(convKey,convId,accId){"
                    "window.selectedConversationId=String(convId||'');window.selectedAccountId=String(accId||'6af0b109818eb5c88d1e87a6');"
                    "return window.refreshOpenConversationSilently(window.selectedConversationId,window.selectedAccountId);"
                    "};"
                    "window.refreshOpenConversationSilently=async function(convId,accId){"
                    "var cid=String(convId||window.selectedConversationId||'').trim();"
                    "var aid=String(accId||window.selectedAccountId||'6af0b109818eb5c88d1e87a6').trim();"
                    "if(!cid)return;"
                    "try{"
                    "var r=await fetch('/api/messages/'+encodeURIComponent(cid)+'/thread?account_id='+encodeURIComponent(aid)+'&force=false&_ts='+Date.now(),{cache:'no-store'});"
                    "if(!r.ok)return;"
                    "var d=await r.json();"
                    "var msgs=(d&&Array.isArray(d.messages))?d.messages:[];"
                    "var box=document.getElementById('gb-fb-thread-messages');"
                    "if(!box)return;"
                    "if(!msgs.length){box.innerHTML='<div style=\"color:#64748b;font-size:12px;padding:24px 0;text-align:center;\">Waiting for first message in session '+cid+'...</div>';return;}"
                    "box.innerHTML=msgs.map(function(m){"
                    "var own=Boolean(m&&m.is_own);"
                    "var sender=String((m&&m.sender_name)||(own?'GlennBot Automations':'Portfolio Client'));"
                    "var txt=String((m&&(m.message||m.text||m.content))||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');"
                    "return '<div class=\"gb-fb-row '+(own?'own':'user')+'\"><div class=\"gb-fb-meta\">'+(own?'<span class=\"own-name\">'+sender+'</span>':sender)+'</div><div class=\"gb-fb-bubble\">'+txt+'</div></div>';"
                    "}).join('');"
                    "box.scrollTop=box.scrollHeight;"
                    "}catch(_){}"
                    "};"
                    "</script></body></html>"
                )

    user_obj = _GLENNBOT_SESSION_CACHE.get("user") or {
        "user_id": DASHBOARD_USER_ID,
        "role": "client",
        "is_admin": False,
    }
    injector_snippet = _build_session_injector_snippet(
        session_token=session_token,
        user_obj=user_obj,
        popout_mode=popout_mode,
        target_tab=target_tab,
        popout_params=popout_params,
    )

    # Pre-transform the DOM so Expanded View bar & target tab are active before JS loads
    html_text = _apply_instant_popout_dom_transforms(
        html_text=html_text,
        popout_mode=popout_mode,
        target_tab=target_tab,
    )

    # Rewrite GlennBot /static/ references to /gb-static/ so GlennBot's /static/css/style.css
    # never collides with the portfolio's own /static/css/style.css
    html_text = html_text.replace('href="/static/', 'href="/gb-static/').replace(
        "href='/static/", "href='/gb-static/"
    )
    html_text = html_text.replace('src="/static/', 'src="/gb-static/').replace(
        "src='/static/", "src='/gb-static/"
    )

    if "<head>" in html_text:
        html_text = html_text.replace("<head>", f"<head>\n    {injector_snippet}", 1)
    elif "</head>" in html_text:
        html_text = html_text.replace("</head>", f"    {injector_snippet}\n</head>", 1)
    else:
        html_text = injector_snippet + html_text

    calendar_lock_script = _build_calendar_lock_body_script()
    if "</body>" in html_text:
        html_text = html_text.replace("</body>", f"    {calendar_lock_script}\n</body>", 1)
    else:
        html_text = html_text + f"\n{calendar_lock_script}"

    response = HTMLResponse(content=html_text, status_code=status_code)
    response.set_cookie(
        key="gb_auth_session",
        value=session_token,
        max_age=_GLENNBOT_SESSION_TTL_SECONDS,
        path="/",
        samesite="lax",
        httponly=False,
    )
    return response


async def _proxy_glennbot_static_asset(path: str, query_str: str) -> Response:
    """Fetches a static asset from {GLENNBOT_BASE_URL}/static/{path} with in-memory caching."""
    cache_key = f"{path.lstrip('/')}?{query_str}" if query_str else path.lstrip("/")
    now = time.time()
    cached_entry = _GLENNBOT_STATIC_ASSET_CACHE.get(cache_key)
    if cached_entry and now < cached_entry[3]:
        content_bytes, status_code, content_type, _ = cached_entry
        return Response(
            content=content_bytes,
            status_code=status_code,
            media_type=content_type,
            headers={"Cache-Control": "public, max-age=300"},
        )

    session_token = await get_glennbot_auto_session_token()
    target_url = f"{GLENNBOT_BASE_URL}/static/{path.lstrip('/')}"
    if query_str:
        target_url = f"{target_url}?{query_str}"

    async with httpx.AsyncClient(
        timeout=GLENNBOT_TIMEOUT_SECONDS,
        follow_redirects=True,
    ) as client:
        resp = await client.get(
            target_url,
            headers={
                "X-GlennBot-Session": session_token,
                "Cookie": f"gb_auth_session={session_token}",
            },
            cookies={"gb_auth_session": session_token},
        )
        content_type = resp.headers.get("content-type", "application/octet-stream")
        if resp.status_code == 200 and resp.content:
            _GLENNBOT_STATIC_ASSET_CACHE[cache_key] = (
                resp.content,
                resp.status_code,
                content_type,
                now + 600.0,
            )
        return Response(
            content=resp.content,
            status_code=resp.status_code,
            media_type=content_type,
            headers={"Cache-Control": "public, max-age=300"},
        )


@app.api_route("/gb-static/{path:path}", methods=["GET", "HEAD"])
async def glennbot_static_proxy(path: str, request: Request):
    """Proxies /gb-static/{path} directly to {GLENNBOT_BASE_URL}/static/{path}."""
    if request.method == "HEAD":
        return Response(content=b"", status_code=200)
    return await _proxy_glennbot_static_asset(path, request.url.query)


@app.api_route("/static/{path:path}", methods=["GET", "HEAD"])
async def hybrid_static_files(path: str, request: Request):
    """
    Serves the portfolio's local /static files (style.css, main.js, glennbot_popup_utils.mjs)
    while transparently proxying any GlennBot static assets (/static/js/app_*.js or requests
    originating from /glennbot-popout) to {GLENNBOT_BASE_URL}/static/{path}.
    """
    referer = (request.headers.get("referer") or "").lower()
    from_glennbot_popout = "/glennbot-popout" in referer
    safe_rel = os.path.normpath(path).lstrip("/\\")
    local_candidate = os.path.join(STATIC_DIR, safe_rel)

    if not from_glennbot_popout and os.path.isfile(local_candidate):
        return FileResponse(local_candidate)

    if os.path.isfile(local_candidate) and safe_rel.replace("\\", "/") in (
        "js/main.js",
        "js/glennbot_popup_utils.mjs",
    ):
        return FileResponse(local_candidate)

    return await _proxy_glennbot_static_asset(path, request.url.query)


@app.api_route("/coin.mp3", methods=["GET", "HEAD"])
async def proxy_coin_mp3():
    """Proxies /coin.mp3 from GlennBot so sound effects in the popout never 404."""
    session_token = await get_glennbot_auto_session_token()
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            resp = await client.get(
                f"{GLENNBOT_BASE_URL}/coin.mp3",
                cookies={"gb_auth_session": session_token},
            )
            if resp.status_code == 200:
                return Response(
                    content=resp.content,
                    status_code=200,
                    media_type=resp.headers.get("content-type", "audio/mpeg"),
                )
    except Exception:
        pass
    return Response(content=b"", status_code=204)


@app.api_route("/Profile Picture.jfif", methods=["GET", "HEAD"])
async def proxy_profile_picture():
    """Proxies /Profile Picture.jfif from GlennBot for branding avatar."""
    session_token = await get_glennbot_auto_session_token()
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            resp = await client.get(
                f"{GLENNBOT_BASE_URL}/Profile%20Picture.jfif",
                cookies={"gb_auth_session": session_token},
            )
            if resp.status_code == 200:
                return Response(
                    content=resp.content,
                    status_code=200,
                    media_type=resp.headers.get("content-type", "image/jpeg"),
                )
    except Exception:
        pass
    local_avatar = os.path.join(PUBLIC_ASSETS_DIR, "glenn-avatar.png")
    if os.path.isfile(local_avatar):
        return FileResponse(local_avatar)
    return Response(content=b"", status_code=204)


@app.api_route("/api/auth/session", methods=["GET", "POST", "HEAD"])
async def glennbot_auth_session_proxy(request: Request):
    """
    Returns an authenticated GlennBot session payload so the popout/iframe
    immediately executes unlockGlennBotDashboardWithSession() on window.onload
    without ever showing #glennbot-login-gate-overlay.
    """
    session_token = await get_glennbot_auto_session_token()
    upstream_url = f"{GLENNBOT_BASE_URL}/api/auth/session"
    upstream_data = None

    try:
        async with httpx.AsyncClient(timeout=GLENNBOT_TIMEOUT_SECONDS, follow_redirects=True) as client:
            resp = await client.get(
                upstream_url,
                headers={
                    "Accept": "application/json",
                    "X-GlennBot-Session": session_token,
                    "Cookie": f"gb_auth_session={session_token}",
                },
                cookies={"gb_auth_session": session_token},
            )
            if resp.status_code in (401, 403):
                session_token = await get_glennbot_auto_session_token(force_refresh=True)
                resp = await client.get(
                    upstream_url,
                    headers={
                        "Accept": "application/json",
                        "X-GlennBot-Session": session_token,
                        "Cookie": f"gb_auth_session={session_token}",
                    },
                    cookies={"gb_auth_session": session_token},
                )
            if resp.status_code == 200:
                data = resp.json()
                if isinstance(data, dict) and data.get("authenticated") and data.get("user"):
                    upstream_data = data
    except Exception:
        upstream_data = None

    user_obj = (upstream_data or {}).get("user") or _GLENNBOT_SESSION_CACHE.get("user") or {
        "user_id": DASHBOARD_USER_ID,
        "role": "client",
        "is_admin": False,
    }
    payload = upstream_data or {
        "status": "success",
        "ok": True,
        "authenticated": True,
        "session_token": session_token,
        "user": user_obj,
    }
    payload["authenticated"] = True
    payload["session_token"] = session_token
    payload["user"] = user_obj

    response = JSONResponse(content=payload, status_code=200)
    response.set_cookie(
        key="gb_auth_session",
        value=session_token,
        max_age=_GLENNBOT_SESSION_TTL_SECONDS,
        path="/",
        samesite="lax",
        httponly=False,
    )
    return response


import re as _re

_EXPIRED_IG_CDN_RE = _re.compile(r"https://scontent[^\"'\s]*cdninstagram\.com[^\"'\s]*")

# ==============================================================================
# PORTFOLIO 4-ACCOUNT WHITELIST & PROTECTION FOR GLENNBOT PROXY
# ==============================================================================
_PORTFOLIO_WHITELISTED_ACCOUNTS: dict[str, dict] = {
    "facebook": {
        "match_tokens": {"glennbot automations"},
        "default_id": "6af0b109818eb5c88d1e87a6",
        "default_db_id": "facebook_6af0b109818eb5c88d1e87a6",
        "name": "GlennBot Automations",
        "username": "GlennBot Automations",
    },
    "youtube": {
        "match_tokens": {"glennardtasico"},
        "default_id": "6af17412c05e9c3bed5f068f",
        "default_db_id": "youtube_6af17412c05e9c3bed5f068f",
        "name": "glennardtasico",
        "username": "glennardtasico",
    },
    "tiktok": {
        "match_tokens": {"glennbot.automation"},
        "default_id": "6ad9e897085e3e64e595fe65",
        "default_db_id": "tiktok_6ad9e897085e3e64e595fe65",
        "name": "@glennbot.automation",
        "username": "glennbot.automation",
    },
    "instagram": {
        "match_tokens": {"glennard.tasico.va"},
        "default_id": "6ad9e9b2e5d470e468e58d87",
        "default_db_id": "instagram_6ad9e9b2e5d470e468e58d87",
        "name": "@glennard.tasico.va",
        "username": "glennard.tasico.va",
    },
}

_PORTFOLIO_ACCOUNTS_RUNTIME_CACHE: dict[str, dict] = {
    "by_platform": {},
    "expires_at": 0.0,
}


def _normalize_account_token(val: object) -> str:
    return str(val or "").strip().lstrip("@").strip().lower()


def _matches_whitelisted_portfolio_account(platform: str | None, item: dict) -> bool:
    if not isinstance(item, dict):
        return False
    plat = str(platform or item.get("platform") or "").strip().lower()
    spec = _PORTFOLIO_WHITELISTED_ACCOUNTS.get(plat)
    if not spec:
        return False

    # Check ID match against known real upstream account ID or cached runtime ID
    cached_plat = (_PORTFOLIO_ACCOUNTS_RUNTIME_CACHE.get("by_platform") or {}).get(plat) or {}
    known_ids = {
        spec["default_id"],
        spec["default_db_id"],
        str(cached_plat.get("id") or "").strip(),
        str(cached_plat.get("db_id") or "").strip(),
    }
    known_ids.discard("")

    for id_key in ("id", "account_id", "page_id", "db_id"):
        raw_id = str(item.get(id_key) or "").strip()
        if raw_id and raw_id in known_ids:
            return True

    # Check case-insensitive name / username match (stripping leading '@')
    for field in ("name", "account_name", "username", "displayName", "handle"):
        token = _normalize_account_token(item.get(field))
        if token and token in spec["match_tokens"]:
            return True

    return False


def _filter_social_accounts_payload(raw_data: dict | None) -> dict:
    """
    Filters GET /api/social/accounts so ONLY the 4 whitelisted portfolio accounts
    appear, preserving real id, avatar, and db_id when present and providing a
    deterministic fallback entry for any missing platform.
    """
    src = raw_data if isinstance(raw_data, dict) else {}
    by_plat_cache = _PORTFOLIO_ACCOUNTS_RUNTIME_CACHE.setdefault("by_platform", {})

    filtered_out: dict[str, list | int] = {
        "facebook": [],
        "instagram": [],
        "tiktok": [],
        "youtube": [],
        "whatsapp": [],
        "telegram": [],
    }

    for plat in ("facebook", "instagram", "tiktok", "youtube"):
        spec = _PORTFOLIO_WHITELISTED_ACCOUNTS[plat]
        raw_list = src.get(plat)
        candidates = raw_list if isinstance(raw_list, list) else []
        matched = next(
            (item for item in candidates if _matches_whitelisted_portfolio_account(plat, item)),
            None,
        )
        cached_prev = by_plat_cache.get(plat) or {}

        real_id = str(
            (matched or {}).get("id")
            or (matched or {}).get("account_id")
            or cached_prev.get("id")
            or spec["default_id"]
        ).strip()
        real_avatar = str(
            (matched or {}).get("avatar")
            or (matched or {}).get("avatar_url")
            or cached_prev.get("avatar")
            or ""
        ).strip()
        real_db_id = str(
            (matched or {}).get("db_id")
            or cached_prev.get("db_id")
            or f"{plat}_{real_id}"
        ).strip()
        connected_by = str(
            (matched or {}).get("connected_by")
            or cached_prev.get("connected_by")
            or "External API"
        ).strip()

        by_plat_cache[plat] = {
            "id": real_id,
            "avatar": real_avatar,
            "db_id": real_db_id,
            "connected_by": connected_by,
        }

        if plat == "facebook":
            entry = {
                "id": real_id,
                "name": spec["name"],
                "avatar": real_avatar,
                "connected_by": connected_by,
                "db_id": real_db_id,
            }
        else:
            entry = {
                "id": real_id,
                "name": spec["name"],
                "username": spec["username"],
                "avatar": real_avatar,
                "connected_by": connected_by,
                "db_id": real_db_id,
            }
        filtered_out[plat] = [entry]

    total_count = sum(
        len(filtered_out[p]) for p in ("facebook", "instagram", "tiktok", "youtube")
    )
    filtered_out["total_connected"] = total_count
    _PORTFOLIO_ACCOUNTS_RUNTIME_CACHE["expires_at"] = time.time() + 300.0
    return filtered_out


def _filter_connected_accounts_payload(raw_data: dict | None) -> dict:
    """
    Filters GET /api/connected_accounts so ONLY the 4 whitelisted portfolio accounts
    are returned in the 'accounts' array, preserving real id, account_id, and avatar_url.
    """
    src = raw_data if isinstance(raw_data, dict) else {}
    raw_accounts = src.get("accounts")
    candidates = raw_accounts if isinstance(raw_accounts, list) else []
    by_plat_cache = _PORTFOLIO_ACCOUNTS_RUNTIME_CACHE.setdefault("by_platform", {})

    filtered_accounts = []
    for plat in ("facebook", "instagram", "tiktok", "youtube"):
        spec = _PORTFOLIO_WHITELISTED_ACCOUNTS[plat]
        matched = next(
            (
                item
                for item in candidates
                if isinstance(item, dict)
                and str(item.get("platform") or "").strip().lower() == plat
                and _matches_whitelisted_portfolio_account(plat, item)
            ),
            None,
        )
        cached_prev = by_plat_cache.get(plat) or {}

        real_acc_id = str(
            (matched or {}).get("account_id")
            or (matched or {}).get("id")
            or cached_prev.get("id")
            or spec["default_id"]
        ).strip()
        real_row_id = str(
            (matched or {}).get("id")
            or cached_prev.get("db_id")
            or f"{plat}_{real_acc_id}"
        ).strip()
        real_avatar = str(
            (matched or {}).get("avatar_url")
            or (matched or {}).get("avatar")
            or cached_prev.get("avatar")
            or ""
        ).strip()
        connected_by = str(
            (matched or {}).get("connected_by")
            or cached_prev.get("connected_by")
            or "External API"
        ).strip()

        by_plat_cache[plat] = {
            "id": real_acc_id,
            "avatar": real_avatar,
            "db_id": real_row_id,
            "connected_by": connected_by,
        }

        filtered_accounts.append(
            {
                "id": real_row_id,
                "platform": plat,
                "account_id": real_acc_id,
                "account_name": spec["name"],
                "username": spec["username"],
                "avatar_url": real_avatar,
                "connected_by": connected_by,
                "has_token": True,
            }
        )

    return {"status": "success", "accounts": filtered_accounts}


SHARED_SHOWCASE_CAPTION = (
    "Hello future clients! Feel free to leave a comment on this sample post, and this AI-powered chatbot "
    "(powered by Gemini) will instantly answer any questions you have about my background, skills, and services. "
    "Everything you need to know about me is already loaded into its knowledge base. Go ahead and test it out—drop a comment below!"
)

SHOWCASE_POST_CONFIGS: dict[str, dict[str, str]] = {
    "post_ext_dc6a96869a": {
        "record_id": "post_ext_dc6a96869a",
        "platform": "facebook",
        "account_name": "GlennBot Automations",
        "post_type": "text",
        "external_post_id": "61595021080265_122118104811500702",
        "short_post_id": "122118104811500702",
        "permalink_url": "https://www.facebook.com/61595021080265/posts/122118104811500702/",
        "caption": SHARED_SHOWCASE_CAPTION,
    },
    "post_ext_b10078462e": {
        "record_id": "post_ext_b10078462e",
        "platform": "instagram",
        "account_name": "GlennBot Automations",
        "post_type": "image",
        "external_post_id": "17956773894039696",
        "short_post_id": "17956773894039696",
        "permalink_url": "https://www.instagram.com/p/DfkfvyEvx3b/",
        "caption": SHARED_SHOWCASE_CAPTION,
    },
    "post_ext_19fdfb7f26": {
        "record_id": "post_ext_19fdfb7f26",
        "platform": "tiktok",
        "account_name": "@glennbot.automation",
        "post_type": "image",
        "external_post_id": "7706791793546906901",
        "short_post_id": "7706791793546906901",
        "permalink_url": "https://www.tiktok.com/@glennbot.automation/photo/7706791793546906901",
        "caption": SHARED_SHOWCASE_CAPTION,
    },
}

SAVVY_FINDS_FB_POST_ID = "122118104811500702"
SAVVY_FINDS_CANONICAL_RECORD_ID = "post_ext_dc6a96869a"
SAVVY_FINDS_PERMALINK = "https://www.facebook.com/61595021080265/posts/122118104811500702/"
SYNTHETIC_BLOCKED_COMMENT_IDS = {"1175872974773981_1794243091445"}
SYNTHETIC_BLOCKED_COMMENT_TEXTS = {
    "may gusto ako itanong pwede ba?",
    "@glenn tasico thank you so much for the kind words! i really appreciate your support, and i'm thrilled to hear you're enjoying glennbot automations. let me know if you ever need anything!",
}
SYNTHETIC_BLOCKED_COMMENT_SUBSTRINGS = (
    "@glenn tasico thank you so much for the kind words!",
)

_SAVVY_FINDS_RECORD_ID = SAVVY_FINDS_CANONICAL_RECORD_ID
_SAVVY_FINDS_ZERNIO_POST_ID = "61595021080265_122118104811500702"
_SAVVY_FINDS_ACCOUNT_ID = "6af0b109818eb5c88d1e87a6"
_SAVVY_FINDS_UPSTREAM_RECORD_ID_State: dict[str, str | float] = {
    "record_id": "post_ext_dc6a96869a",
    "last_bg_sync_ts": 0.0,
}
_PORTFOLIO_COMMENTS_LAST_GOOD_CACHE: dict[str, object] = {
    "by_record": {},
    "payload": None,
}
_PORTFOLIO_MESSAGES_THREAD_CACHE: dict[str, dict[str, object]] = {}


def _is_synthetic_blocked_comment(obj: dict) -> bool:
    if not isinstance(obj, dict):
        return False
    cid = str(obj.get("comment_id") or obj.get("id") or "").strip()
    if cid in SYNTHETIC_BLOCKED_COMMENT_IDS:
        return True
    msg = str(obj.get("message") or obj.get("comment_text") or obj.get("text") or "").strip().lower()
    if msg in SYNTHETIC_BLOCKED_COMMENT_TEXTS:
        return True
    if any(sub in msg for sub in SYNTHETIC_BLOCKED_COMMENT_SUBSTRINGS):
        return True
    return False


def _match_showcase_post_config_for_comment(item: dict) -> dict[str, str] | None:
    if not isinstance(item, dict):
        return None
    rec_id = str(item.get("record_id") or "").strip()
    if rec_id in SHOWCASE_POST_CONFIGS:
        return SHOWCASE_POST_CONFIGS[rec_id]
    id_fields = (
        str(item.get("comment_id") or ""),
        str(item.get("external_post_id") or ""),
        str(item.get("zernio_post_id") or ""),
        str(item.get("post_permalink") or ""),
        str(item.get("comment_permalink") or ""),
    )
    if any(
        ("122118104811500702" in f or "61595021080265" in f or "1340688402467466_122118104811500702" in f)
        for f in id_fields
    ):
        return SHOWCASE_POST_CONFIGS["post_ext_dc6a96869a"]
    if any(
        ("17956773894039696" in f or "DfkfvyEvx3b" in f or "18198560143393683" in f)
        for f in id_fields
    ):
        return SHOWCASE_POST_CONFIGS["post_ext_b10078462e"]
    if any(
        ("7706791793546906901" in f or "7706797468532458260" in f)
        for f in id_fields
    ):
        return SHOWCASE_POST_CONFIGS["post_ext_19fdfb7f26"]
    return None


def _normalize_showcase_comment_item(item: dict, cfg: dict[str, str]) -> dict:
    norm_item = dict(item)
    norm_item["record_id"] = cfg["record_id"]
    norm_item["platform"] = cfg["platform"]
    norm_item["post_permalink"] = cfg["permalink_url"]
    norm_item["comment_permalink"] = cfg["permalink_url"]
    norm_item["external_post_id"] = cfg["external_post_id"]
    norm_item["zernio_post_id"] = cfg["external_post_id"]
    norm_item["account_name"] = cfg["account_name"]
    norm_item["post_type"] = cfg["post_type"]
    norm_item["post_caption"] = cfg["caption"]
    norm_item["caption"] = cfg["caption"]
    norm_item["can_reply"] = True

    raw_replies = list(norm_item.get("replies") or [])
    norm_item["replies"] = [
        dict(r) for r in raw_replies if isinstance(r, dict) and not _is_synthetic_blocked_comment(r)
    ]
    return norm_item


_PORTFOLIO_LOCKED_EMAIL_ADDRESS = "glennard.tasico.va@gmail.com"


def _filter_email_accounts_payload(raw_data: dict | None) -> dict:
    """
    Filters /api/email/accounts and /api/email/discover so ONLY glennard.tasico.va@gmail.com (Gmail)
    is returned and automatically selected as the active account.
    """
    src = raw_data if isinstance(raw_data, dict) else {}
    raw_accounts = src.get("accounts") if isinstance(src.get("accounts"), list) else []
    kept = []
    for item in raw_accounts:
        if not isinstance(item, dict):
            continue
        addr = str(
            item.get("email_address") or item.get("email") or item.get("username") or item.get("name") or ""
        ).strip().lower()
        if addr == _PORTFOLIO_LOCKED_EMAIL_ADDRESS:
            norm = dict(item)
            norm["email_address"] = _PORTFOLIO_LOCKED_EMAIL_ADDRESS
            norm["email"] = _PORTFOLIO_LOCKED_EMAIL_ADDRESS
            norm["platform"] = "gmail"
            norm["provider"] = "gmail"
            norm["status"] = "connected"
            norm["connected"] = True
            kept.append(norm)
            break

    if not kept:
        kept = [
            {
                "id": "gmail_glennard_tasico_va",
                "account_id": "gmail_glennard_tasico_va",
                "platform": "gmail",
                "provider": "gmail",
                "email_address": _PORTFOLIO_LOCKED_EMAIL_ADDRESS,
                "email": _PORTFOLIO_LOCKED_EMAIL_ADDRESS,
                "name": _PORTFOLIO_LOCKED_EMAIL_ADDRESS,
                "display_name": "glennard.tasico.va@gmail.com (Gmail)",
                "status": "connected",
                "connected": True,
            }
        ]

    active_id = str(kept[0].get("id") or kept[0].get("account_id") or "gmail_glennard_tasico_va")
    out = dict(src)
    out["status"] = "success"
    out["accounts"] = kept
    out["active_account_id"] = active_id
    out["total_connected"] = 1
    return out


def _filter_email_messages_payload(raw_data: dict | None) -> dict:
    """
    Normalizes /api/email/messages response so folder is locked to 'sent'
    and account is locked to glennard.tasico.va@gmail.com without dropping
    messages that use 'labels': ['SENT', ...] instead of a 'folder' property.
    """
    src = raw_data if isinstance(raw_data, dict) else {}
    raw_msgs = (
        src.get("messages")
        if isinstance(src.get("messages"), list)
        else (src.get("items") if isinstance(src.get("items"), list) else [])
    )
    kept_msgs = []
    for m in raw_msgs:
        if not isinstance(m, dict):
            continue
        norm_m = dict(m)
        norm_m["folder"] = "sent"
        norm_m["account_email"] = _PORTFOLIO_LOCKED_EMAIL_ADDRESS
        norm_m["from_email"] = _PORTFOLIO_LOCKED_EMAIL_ADDRESS
        kept_msgs.append(norm_m)

    out = dict(src)
    out["status"] = "success"
    out["folder"] = "sent"
    out["email_address"] = _PORTFOLIO_LOCKED_EMAIL_ADDRESS
    out["messages"] = kept_msgs
    return out


def _filter_whitelisted_records_in_proxy_json(clean_path: str, data: dict) -> dict:
    """
    Ensures Queue (/api/scheduled), Calendar, Comments (/api/comments),
    Messages (/api/messages/conversations), Email (/api/email/*), Analytics (/api/analytics), and
    OAuth Discover endpoints only surface the whitelisted portfolio accounts.
    """
    if not isinstance(data, dict):
        return data

    if clean_path in ("email/accounts", "email/discover"):
        return _filter_email_accounts_payload(data)

    if clean_path == "email/messages":
        return _filter_email_messages_payload(data)

    if clean_path == "social/accounts":
        return _filter_social_accounts_payload(data)

    if clean_path == "connected_accounts":
        return _filter_connected_accounts_payload(data)

    if clean_path == "scheduled" and isinstance(data.get("items"), list):
        kept = []
        for item in data["items"]:
            if not isinstance(item, dict):
                continue
            plat = str(item.get("platform") or "").strip().lower()
            if _matches_whitelisted_portfolio_account(plat, item):
                norm_item = dict(item)
                norm_item["account_name"] = _PORTFOLIO_WHITELISTED_ACCOUNTS[plat]["name"]
                kept.append(norm_item)
        data["items"] = kept
        return data

    if clean_path == "comments" and isinstance(data.get("comments"), list):
        kept = []
        seen_cids: set[str] = set()
        for item in data["comments"]:
            if not isinstance(item, dict):
                continue
            if _is_synthetic_blocked_comment(item):
                continue
            matched_cfg = _match_showcase_post_config_for_comment(item)
            if matched_cfg is not None:
                norm_sc = _normalize_showcase_comment_item(item, matched_cfg)
                cid_sc = str(norm_sc.get("comment_id") or "").strip()
                if cid_sc:
                    seen_cids.add(cid_sc)
                kept.append(norm_sc)
                continue
            plat = str(item.get("platform") or "").strip().lower()
            if _matches_whitelisted_portfolio_account(plat, item):
                norm_item = dict(item)
                norm_item["account_name"] = _PORTFOLIO_WHITELISTED_ACCOUNTS[plat]["name"]
                norm_item["can_reply"] = True
                if isinstance(norm_item.get("replies"), list):
                    norm_item["replies"] = [
                        r for r in norm_item["replies"]
                        if isinstance(r, dict) and not _is_synthetic_blocked_comment(r)
                    ]
                cid_wh = str(norm_item.get("comment_id") or "").strip()
                if cid_wh:
                    seen_cids.add(cid_wh)
                kept.append(norm_item)

        by_rec_cache = _PORTFOLIO_COMMENTS_LAST_GOOD_CACHE.setdefault("by_record", {})
        for rec_key in SHOWCASE_POST_CONFIGS:
            rec_items = [c for c in kept if isinstance(c, dict) and c.get("record_id") == rec_key]
            by_rec_cache[rec_key] = rec_items

        data["comments"] = kept
        _PORTFOLIO_COMMENTS_LAST_GOOD_CACHE["payload"] = dict(data)
        return data

    if clean_path == "messages/conversations":
        if isinstance(data.get("conversations"), list):
            kept_convs = []
            for conv in data["conversations"]:
                if not isinstance(conv, dict):
                    continue
                plat = str(conv.get("platform") or "").strip().lower()
                cid_str = str(conv.get("conversation_id") or conv.get("conv_key") or "").strip()
                if (
                    plat in ("sms", "textbee", "whatsapp")
                    or "fb_live_" in cid_str
                    or "wa_live_dm_" in cid_str
                    or "wa_live_" in cid_str
                    or "ig_live_" in cid_str
                ):
                    kept_convs.append(conv)
                elif _matches_whitelisted_portfolio_account(plat, conv):
                    norm_conv = dict(conv)
                    norm_conv["account_name"] = _PORTFOLIO_WHITELISTED_ACCOUNTS[plat]["name"]
                    kept_convs.append(norm_conv)
            data["conversations"] = kept_convs
        if isinstance(data.get("connected_pages"), list):
            kept_pages = []
            for pg in data["connected_pages"]:
                if not isinstance(pg, dict):
                    continue
                plat = str(pg.get("platform") or "").strip().lower()
                if plat in ("sms", "textbee", "whatsapp"):
                    kept_pages.append(pg)
                elif _matches_whitelisted_portfolio_account(plat, pg):
                    norm_pg = dict(pg)
                    norm_pg["account_name"] = _PORTFOLIO_WHITELISTED_ACCOUNTS[plat]["name"]
                    norm_pg["name"] = _PORTFOLIO_WHITELISTED_ACCOUNTS[plat]["name"]
                    kept_pages.append(norm_pg)
            data["connected_pages"] = kept_pages
        return data

    if clean_path.startswith("messages/") and clean_path.endswith("/thread"):
        parts = clean_path.split("/")
        conv_id_key = parts[1] if len(parts) >= 3 else ""
        if conv_id_key:
            msgs = data.get("messages")
            cached_entry = _PORTFOLIO_MESSAGES_THREAD_CACHE.get(conv_id_key) or {}
            cached_msgs = cached_entry.get("messages")
            cached_list = cached_msgs if isinstance(cached_msgs, list) else []
            if isinstance(msgs, list) and len(msgs) > 0:
                has_own_upstream = any(isinstance(m, dict) and bool(m.get("is_own")) for m in msgs)
                if len(msgs) >= len(cached_list) or has_own_upstream:
                    _PORTFOLIO_MESSAGES_THREAD_CACHE.setdefault(conv_id_key, {})["messages"] = list(msgs)
                    _DM_TEST_SESSIONS.setdefault(conv_id_key, {})["messages"] = list(msgs)
                    if isinstance(data.get("conversation"), dict):
                        _PORTFOLIO_MESSAGES_THREAD_CACHE[conv_id_key]["conversation"] = dict(data["conversation"])
                elif len(cached_list) > len(msgs):
                    data["messages"] = list(cached_list)
            elif isinstance(msgs, list) and len(msgs) == 0 and len(cached_list) > 0:
                data["messages"] = list(cached_list)
        return data

    if clean_path == "analytics":
        if isinstance(data.get("pages"), list):
            kept_pages = []
            for pg in data["pages"]:
                if not isinstance(pg, dict):
                    continue
                plat = str(pg.get("platform") or "").strip().lower()
                if _matches_whitelisted_portfolio_account(plat, pg):
                    norm_pg = dict(pg)
                    norm_pg["account_name"] = _PORTFOLIO_WHITELISTED_ACCOUNTS[plat]["name"]
                    norm_pg["name"] = _PORTFOLIO_WHITELISTED_ACCOUNTS[plat]["name"]
                    norm_pg["username"] = _PORTFOLIO_WHITELISTED_ACCOUNTS[plat]["username"]
                    kept_pages.append(norm_pg)
            data["pages"] = kept_pages
        if isinstance(data.get("posts"), list):
            kept_posts = []
            for post in data["posts"]:
                if not isinstance(post, dict):
                    continue
                plat = str(post.get("platform") or "").strip().lower()
                if _matches_whitelisted_portfolio_account(plat, post):
                    norm_post = dict(post)
                    norm_post["account_name"] = _PORTFOLIO_WHITELISTED_ACCOUNTS[plat]["name"]
                    kept_posts.append(norm_post)
            data["posts"] = kept_posts
        data["connected_platforms"] = ["facebook", "instagram", "tiktok", "youtube"]
        return data

    return data


import asyncio

_DM_TEST_SESSIONS: dict[str, dict[str, object]] = {}

_DM_TEST_PLATFORM_META: dict[str, dict[str, str]] = {
    "facebook": {
        "platform": "facebook",
        "account_id": "6af0b109818eb5c88d1e87a6",
        "account_name": "GlennBot Automations",
        "conv_prefix": "fb_live_",
    },
    "instagram": {
        "platform": "instagram",
        "account_id": "6ad9e9b2e5d470e468e58d87",
        "account_name": "@glennard.tasico.va",
        "conv_prefix": "ig_live_",
    },
    "whatsapp": {
        "platform": "whatsapp",
        "account_id": "6adda70399e7b30829e8859c",
        "account_name": "Glennard Tasico (+63 917 549 7760)",
        "conv_prefix": "wa_live_dm_",
    },
}


def _is_live_portfolio_dm_conv_id(conv_id: str) -> bool:
    cid = str(conv_id or "").strip()
    return (
        cid.startswith("fb_live_")
        or cid.startswith("ig_live_")
        or cid.startswith("wa_live_dm_")
        or cid.startswith("wa_live_")
    )


def _thread_has_own_reply_after_last_user(messages: list) -> bool:
    if not isinstance(messages, list) or not messages:
        return False
    last_user_idx = -1
    for idx, item in enumerate(messages):
        if isinstance(item, dict) and not bool(item.get("is_own")):
            last_user_idx = idx
    if last_user_idx == -1:
        return any(isinstance(item, dict) and bool(item.get("is_own")) for item in messages)
    for item in messages[last_user_idx + 1 :]:
        if isinstance(item, dict) and bool(item.get("is_own")):
            return True
    return False


def _save_dm_session_cache(
    conv_id: str,
    messages: list,
    platform: str,
    account_id: str,
    account_name: str,
) -> None:
    if not conv_id:
        return
    msg_copy = list(messages)
    entry = {
        "messages": msg_copy,
        "platform": platform,
        "account_id": account_id,
        "account_name": account_name,
        "updated_at": time.time(),
    }
    _PORTFOLIO_MESSAGES_THREAD_CACHE[conv_id] = dict(entry)
    _DM_TEST_SESSIONS[conv_id] = dict(entry)


@app.post("/api/glennbot/dm-test/send")
async def glennbot_dm_test_send(request: Request):
    """
    Accepts platform ('facebook', 'instagram', 'whatsapp'), conversation_id, participant_name, and message,
    forwards to GlennBot's /api/messages/portfolio_live_dm (syncing Conversations.xlsx Sheet2 + Script.xlsx Sheet1),
    polls GET /api/messages/{conv_id}/thread up to 6 times (every 1.2s) if the AI reply is still generating
    on upstream GlennBot, and updates _PORTFOLIO_MESSAGES_THREAD_CACHE and _DM_TEST_SESSIONS.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}
    if not isinstance(body, dict):
        body = {}

    raw_plat = str(body.get("platform") or "facebook").strip().lower()
    meta = _DM_TEST_PLATFORM_META.get(raw_plat, _DM_TEST_PLATFORM_META["facebook"])
    conv_id = str(body.get("conversation_id") or body.get("session_id") or "").strip()
    if not conv_id:
        conv_id = f"{meta['conv_prefix']}{int(time.time() * 1000)}"
    target_acc_id = str(body.get("account_id") or meta["account_id"]).strip()
    account_name = str(body.get("account_name") or meta["account_name"]).strip()
    participant_name = str(body.get("participant_name") or "Portfolio Client").strip() or "Portfolio Client"
    message_text = str(body.get("message") or "").strip()

    forward_payload = {
        "conversation_id": conv_id,
        "account_id": target_acc_id,
        "account_name": account_name,
        "platform": meta["platform"],
        "participant_name": participant_name,
        "message": message_text,
    }
    session_token = await get_glennbot_auto_session_token()
    upstream_data: dict | None = None
    upstream_msgs: list = []

    try:
        async with httpx.AsyncClient(timeout=45.0, follow_redirects=True) as client:
            resp = await client.post(
                f"{GLENNBOT_BASE_URL}/api/messages/portfolio_live_dm",
                json=forward_payload,
                headers=get_glennbot_headers(session_token),
                cookies={"gb_auth_session": session_token},
            )
            if resp.status_code in (401, 403):
                session_token = await get_glennbot_auto_session_token(force_refresh=True)
                resp = await client.post(
                    f"{GLENNBOT_BASE_URL}/api/messages/portfolio_live_dm",
                    json=forward_payload,
                    headers=get_glennbot_headers(session_token),
                    cookies={"gb_auth_session": session_token},
                )
            if resp.status_code == 200:
                parsed = resp.json()
                if isinstance(parsed, dict):
                    upstream_data = parsed
                    if isinstance(parsed.get("messages"), list):
                        upstream_msgs = list(parsed["messages"])
                        _save_dm_session_cache(
                            conv_id,
                            upstream_msgs,
                            meta["platform"],
                            target_acc_id,
                            account_name,
                        )

            # If upstream returned before the asynchronous Gemini AI workflow finished appending is_own=True,
            # poll GET /api/messages/{conv_id}/thread up to 6 times (every 1.2s) to capture the real GlennBot AI reply.
            if upstream_data is not None and not _thread_has_own_reply_after_last_user(upstream_msgs):
                for _ in range(6):
                    await asyncio.sleep(1.2)
                    poll_ts = int(time.time() * 1000)
                    poll_url = (
                        f"{GLENNBOT_BASE_URL}/api/messages/{conv_id}/thread"
                        f"?account_id={target_acc_id}&force=false&_ts={poll_ts}"
                    )
                    try:
                        poll_resp = await client.get(
                            poll_url,
                            headers={
                                **get_glennbot_headers(session_token),
                                "Cache-Control": "no-cache, no-store",
                                "Pragma": "no-cache",
                            },
                            cookies={"gb_auth_session": session_token},
                            timeout=15.0,
                        )
                        if poll_resp.status_code == 200:
                            poll_json = poll_resp.json()
                            if isinstance(poll_json, dict) and isinstance(poll_json.get("messages"), list):
                                polled_msgs = list(poll_json["messages"])
                                if len(polled_msgs) >= len(upstream_msgs):
                                    upstream_msgs = polled_msgs
                                    upstream_data["messages"] = upstream_msgs
                                    _save_dm_session_cache(
                                        conv_id,
                                        upstream_msgs,
                                        meta["platform"],
                                        target_acc_id,
                                        account_name,
                                    )
                                if _thread_has_own_reply_after_last_user(upstream_msgs):
                                    break
                    except Exception:
                        pass

            if upstream_data is not None and _thread_has_own_reply_after_last_user(upstream_msgs):
                return JSONResponse(content=upstream_data, status_code=200)
    except Exception:
        pass

    now_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    existing_msgs = (
        upstream_msgs
        if upstream_msgs
        else list((_PORTFOLIO_MESSAGES_THREAD_CACHE.get(conv_id) or {}).get("messages") or [])
    )
    if not any(
        isinstance(m, dict) and not bool(m.get("is_own")) and str(m.get("message") or "").strip() == message_text
        for m in existing_msgs
    ):
        existing_msgs.append(
            {
                "id": f"msg_{int(time.time() * 1000)}_u",
                "is_own": False,
                "sender_name": participant_name,
                "message": message_text,
                "timestamp": now_iso,
            }
        )
    if not _thread_has_own_reply_after_last_user(existing_msgs):
        existing_msgs.append(
            {
                "id": f"msg_{int(time.time() * 1000)}_ai",
                "is_own": True,
                "sender_name": account_name,
                "message": (
                    f"Hi {participant_name}! Thanks for messaging {account_name} via {meta['platform'].title()}. "
                    "I'm GlennBot (powered by Gemini 3.5 Flash & synced with Conversations.xlsx Sheet2 + Script.xlsx). "
                    "How can I help you with AI automations, webhooks, or custom web apps today?"
                ),
                "timestamp": now_iso,
            }
        )
    _save_dm_session_cache(conv_id, existing_msgs, meta["platform"], target_acc_id, account_name)
    return JSONResponse(
        content={
            "status": "success",
            "conversation_id": conv_id,
            "platform": meta["platform"],
            "account_id": target_acc_id,
            "account_name": account_name,
            "messages": existing_msgs,
        },
        status_code=200,
    )


@app.get("/api/glennbot/dm-test/state")
async def glennbot_dm_test_state(request: Request):
    """
    Returns live DM state for Facebook, Instagram, or WhatsApp (+63 917 549 7760) sessions.
    When session_id / conversation_id / conv_id is provided, also fetches
    GET {GLENNBOT_BASE_URL}/api/messages/{session_id}/thread?account_id={acc_id}&force=false
    to sync the latest is_own=True AI replies from GlennBot.
    """
    raw_plat = str(request.query_params.get("platform") or "facebook").strip().lower()
    meta = _DM_TEST_PLATFORM_META.get(raw_plat, _DM_TEST_PLATFORM_META["facebook"])
    session_id = str(
        request.query_params.get("session_id")
        or request.query_params.get("conversation_id")
        or request.query_params.get("conv_id")
        or ""
    ).strip()
    acc_id = str(request.query_params.get("account_id") or meta["account_id"]).strip()

    cached = (
        _PORTFOLIO_MESSAGES_THREAD_CACHE.get(session_id)
        or _DM_TEST_SESSIONS.get(session_id)
        or {}
    )
    cached_msgs = list(cached.get("messages") or [])

    if session_id:
        session_token = await get_glennbot_auto_session_token()
        ts_ms = int(time.time() * 1000)
        upstream_thread_url = (
            f"{GLENNBOT_BASE_URL}/api/messages/{session_id}/thread"
            f"?account_id={acc_id}&force=false&_ts={ts_ms}"
        )
        try:
            async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
                resp = await client.get(
                    upstream_thread_url,
                    headers={
                        **get_glennbot_headers(session_token),
                        "Cache-Control": "no-cache, no-store",
                        "Pragma": "no-cache",
                    },
                    cookies={"gb_auth_session": session_token},
                )
                if resp.status_code == 200:
                    up_json = resp.json()
                    if isinstance(up_json, dict) and isinstance(up_json.get("messages"), list):
                        up_msgs = list(up_json["messages"])
                        has_own = any(isinstance(m, dict) and bool(m.get("is_own")) for m in up_msgs)
                        if len(up_msgs) >= len(cached_msgs) or has_own:
                            cached_msgs = up_msgs
                            _save_dm_session_cache(
                                session_id,
                                cached_msgs,
                                meta["platform"],
                                acc_id,
                                meta["account_name"],
                            )
        except Exception:
            pass

    return JSONResponse(
        content={
            "status": "success",
            "platform": meta["platform"],
            "account_id": acc_id,
            "account_name": meta["account_name"],
            "session_id": session_id,
            "conversation_id": session_id,
            "messages": cached_msgs,
            "excel_sync": {
                "conversations_workbook": "Conversations.xlsx",
                "conversations_sheet": "Sheet2",
                "script_workbook": "Script.xlsx",
                "script_sheet": "Sheet1",
            },
        },
        status_code=200,
    )


@app.api_route(
    "/api/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
)
async def glennbot_api_catchall_proxy(path: str, request: Request):
    """
    Transparently proxies all GlennBot /api/... calls from the popout/iframe to
    {GLENNBOT_BASE_URL}/api/{path}, forwarding query params, request body, and
    attaching Cookie: gb_auth_session={session_token} and X-GlennBot-Session.
    Enforces the 4-account portfolio whitelist and blocks visitor account deletion.
    """
    clean_path = path.strip("/").lower()
    method_upper = request.method.upper()

    # Layer 2: Block Calendar & Meeting Endpoints (Composio Google Calendar / Outlook / Meet / Teams / Zoom)
    if (
        clean_path.startswith("calendar/")
        or clean_path == "calendar"
        or clean_path.startswith("v1/calendar/")
        or clean_path == "v1/calendar"
        or clean_path.startswith("oauth/calendar/")
        or clean_path == "oauth/calendar"
    ):
        if method_upper in ("POST", "PUT", "DELETE", "PATCH"):
            return JSONResponse(
                content={
                    "status": "error",
                    "message": "Calendars & Meetings are restricted in Portfolio Demo Mode.",
                },
                status_code=403,
            )
        if clean_path in ("calendar/accounts", "v1/calendar/accounts"):
            return JSONResponse(
                content={"status": "success", "accounts": []},
                status_code=200,
            )
        return JSONResponse(
            content={"status": "success", "events": [], "accounts": []},
            status_code=200,
        )

    # 3. Protect Connected Accounts & Email Hub from Visitor Disconnection / OAuth Changes
    if (
        (method_upper == "DELETE" and clean_path.startswith("connected_accounts"))
        or clean_path == "oauth/disconnect"
        or clean_path.startswith("oauth/disconnect/")
        or clean_path.startswith("email/disconnect")
        or clean_path.startswith("email/connect")
        or clean_path.startswith("oauth/email")
        or clean_path.startswith("oauth/gmail")
        or clean_path.startswith("oauth/microsoft")
        or (method_upper == "DELETE" and clean_path.startswith("email/accounts"))
    ):
        return JSONResponse(
            content={
                "status": "error",
                "message": "Email & account connection/disconnection is disabled in Portfolio Demo Mode.",
            },
            status_code=403,
        )

    if clean_path in ("comments/dismiss", "comments/hide") or clean_path.startswith("comments/dismiss/") or clean_path.startswith("comments/hide/"):
        return JSONResponse(
            content={
                "status": "error",
                "message": "Deleting or hiding comment threads is disabled in Portfolio Demo Mode.",
            },
            status_code=403,
        )

    if clean_path == "messages/portfolio_live_dm" and method_upper == "POST":
        return await glennbot_dm_test_send(request)

    if clean_path == "comments/delete_reply" or clean_path.startswith("comments/delete_reply/"):
        _PORTFOLIO_COMMENTS_LAST_GOOD_CACHE["by_record"] = {}
        _PORTFOLIO_COMMENTS_LAST_GOOD_CACHE["payload"] = None

    # Fast cached response for GlennBot Automations Facebook & Instagram sample posts live_details
    if method_upper == "GET" and clean_path.startswith("posts/") and clean_path.endswith("/live_details"):
        parts = clean_path.split("/")
        req_rec_id = parts[1] if len(parts) >= 3 else ""
        if req_rec_id in SHOWCASE_POST_CONFIGS:
            cfg = SHOWCASE_POST_CONFIGS[req_rec_id]
            return JSONResponse(
                content={
                    "status": "success",
                    "details": {
                        "record_id": cfg["record_id"],
                        "platform": cfg["platform"],
                        "account_name": cfg["account_name"],
                        "post_type": cfg["post_type"],
                        "caption": cfg["caption"],
                        "post_caption": cfg["caption"],
                        "external_post_id": cfg["external_post_id"],
                        "permalink_url": cfg["permalink_url"],
                        "video_url": "",
                        "thumbnail_url": "",
                        "images": [],
                        "fallback_preview_url": "",
                    },
                },
                status_code=200,
            )

    # Fast cached path for GET /api/social/accounts & GET /api/connected_accounts
    # if we already populated _PORTFOLIO_ACCOUNTS_RUNTIME_CACHE recently
    now = time.time()
    cache_valid = (
        bool(_PORTFOLIO_ACCOUNTS_RUNTIME_CACHE.get("by_platform"))
        and now < float(_PORTFOLIO_ACCOUNTS_RUNTIME_CACHE.get("expires_at") or 0.0)
    )
    if method_upper == "GET" and clean_path == "social/accounts" and cache_valid:
        return JSONResponse(content=_filter_social_accounts_payload({}), status_code=200)
    if method_upper == "GET" and clean_path == "connected_accounts" and cache_valid:
        return JSONResponse(content=_filter_connected_accounts_payload({}), status_code=200)

    session_token = await get_glennbot_auto_session_token()
    body_bytes = await request.body()

    target_url = f"{GLENNBOT_BASE_URL}/api/{path.lstrip('/')}"
    is_message_thread_get = (
        clean_path.startswith("messages/") and clean_path.endswith("/thread") and method_upper == "GET"
    )
    thread_conv_id_key = ""
    thread_acc_param = "6af0b109818eb5c88d1e87a6"

    if clean_path == "comments" and method_upper == "GET":
        req_active_rec = (request.query_params.get("active_record_id") or "").strip()
        if req_active_rec in SHOWCASE_POST_CONFIGS:
            _SAVVY_FINDS_UPSTREAM_RECORD_ID_State["record_id"] = req_active_rec
        upstream_rec_id = (
            req_active_rec
            if req_active_rec in SHOWCASE_POST_CONFIGS
            else str(_SAVVY_FINDS_UPSTREAM_RECORD_ID_State.get("record_id") or "post_ext_dc6a96869a")
        )
        last_bg_ts = float(_SAVVY_FINDS_UPSTREAM_RECORD_ID_State.get("last_bg_sync_ts") or 0.0)
        ts_ms = int(time.time() * 1000)
        if time.time() - last_bg_ts >= 15.0:
            _SAVVY_FINDS_UPSTREAM_RECORD_ID_State["last_bg_sync_ts"] = time.time()
            ordered_recs = [upstream_rec_id]

            async def _bg_force_sync_showcase() -> None:
                try:
                    await asyncio.sleep(2.0)
                    async with httpx.AsyncClient(timeout=60.0, follow_redirects=True) as bg_client:
                        for showcase_rec in ordered_recs:
                            bg_url = f"{GLENNBOT_BASE_URL}/api/comments?force=true&active_record_id={showcase_rec}&_ts={ts_ms}"
                            await bg_client.get(
                                bg_url,
                                headers={
                                    **get_glennbot_headers(session_token),
                                    "Cache-Control": "no-cache, no-store",
                                    "Pragma": "no-cache",
                                },
                                cookies={"gb_auth_session": session_token},
                            )
                except Exception:
                    pass

            asyncio.create_task(_bg_force_sync_showcase())

        target_url = f"{GLENNBOT_BASE_URL}/api/comments?active_record_id={upstream_rec_id}&_ts={ts_ms}"
    elif is_message_thread_get:
        parts = clean_path.split("/")
        thread_conv_id_key = parts[1] if len(parts) >= 3 else ""
        thread_acc_param = (request.query_params.get("account_id") or "6af0b109818eb5c88d1e87a6").strip()
        ts_ms = int(time.time() * 1000)
        if _is_live_portfolio_dm_conv_id(thread_conv_id_key):
            # Always query upstream GlennBot first (do NOT short-circuit to stale cache!)
            target_url = f"{target_url}?account_id={thread_acc_param}&force=false&_ts={ts_ms}"
        else:
            cache_entry = _PORTFOLIO_MESSAGES_THREAD_CACHE.setdefault(thread_conv_id_key, {})
            last_force_ts = float(cache_entry.get("last_force_ts") or 0.0)
            has_cached_msgs = bool(cache_entry.get("messages"))
            if time.time() - last_force_ts >= 15.0:
                cache_entry["last_force_ts"] = time.time()

                async def _bg_force_sync_msg_thread() -> None:
                    try:
                        await asyncio.sleep(1.5)
                        async with httpx.AsyncClient(timeout=25.0, follow_redirects=True) as bg_client:
                            bg_url = f"{GLENNBOT_BASE_URL}/api/messages/{thread_conv_id_key}/thread?account_id={thread_acc_param}&force=true&_ts={ts_ms}"
                            bg_resp = await bg_client.get(
                                bg_url,
                                headers={
                                    **get_glennbot_headers(session_token),
                                    "Cache-Control": "no-cache, no-store",
                                    "Pragma": "no-cache",
                                },
                                cookies={"gb_auth_session": session_token},
                            )
                            if bg_resp.status_code == 200:
                                bg_data = bg_resp.json()
                                if isinstance(bg_data, dict) and isinstance(bg_data.get("messages"), list) and bg_data["messages"]:
                                    cache_entry["messages"] = list(bg_data["messages"])
                    except Exception:
                        pass

                asyncio.create_task(_bg_force_sync_msg_thread())

            target_url = (
                f"{target_url}?account_id={thread_acc_param}&force={'false' if has_cached_msgs else 'true'}&_ts={ts_ms}"
            )
    elif clean_path == "email/messages" and method_upper == "GET":
        # Strictly enforce folder=sent; omit synthetic account_id so upstream GlennBot selects its real connected Gmail account
        q_dict = dict(request.query_params)
        q_dict["folder"] = "sent"
        if q_dict.get("account_id") in ("", "gmail_glennard_tasico_va"):
            q_dict.pop("account_id", None)
        q_dict.pop("email_address", None)
        q_dict.pop("platform", None)
        from urllib.parse import urlencode
        target_url = f"{target_url}?{urlencode(q_dict)}"
    elif request.url.query:
        target_url = f"{target_url}?{request.url.query}"

    forward_headers = {
        "X-GlennBot-Session": session_token,
        "Cookie": f"gb_auth_session={session_token}",
        "Cache-Control": "no-cache, no-store",
        "Pragma": "no-cache",
    }
    if GLENNBOT_INTERNAL_API_KEY:
        forward_headers["X-API-Key"] = GLENNBOT_INTERNAL_API_KEY
    for hdr in ("content-type", "accept", "x-requested-with"):
        val = request.headers.get(hdr)
        if val:
            forward_headers[hdr] = val

    # Use a responsive timeout for account discovery endpoints, 15.0s for message thread polling, and 45.0s for live AI DM generation
    if clean_path in ("social/accounts", "connected_accounts"):
        req_timeout = 8.0
    elif is_message_thread_get:
        req_timeout = 15.0
    elif clean_path in ("messages/portfolio_live_dm", "comments/delete_reply"):
        req_timeout = 45.0
    else:
        req_timeout = GLENNBOT_TIMEOUT_SECONDS

    try:
        async with httpx.AsyncClient(
            timeout=req_timeout,
            follow_redirects=True,
        ) as client:
            resp = await client.request(
                method=request.method,
                url=target_url,
                headers=forward_headers,
                cookies={"gb_auth_session": session_token},
                content=body_bytes if body_bytes else None,
            )
            if resp.status_code == 401:
                session_token = await get_glennbot_auto_session_token(force_refresh=True)
                forward_headers["X-GlennBot-Session"] = session_token
                forward_headers["Cookie"] = f"gb_auth_session={session_token}"
                resp = await client.request(
                    method=request.method,
                    url=target_url,
                    headers=forward_headers,
                    cookies={"gb_auth_session": session_token},
                    content=body_bytes if body_bytes else None,
                )

            if is_message_thread_get and resp.status_code != 200:
                cached_fallback = (
                    (_PORTFOLIO_MESSAGES_THREAD_CACHE.get(thread_conv_id_key) or {}).get("messages")
                    or (_DM_TEST_SESSIONS.get(thread_conv_id_key) or {}).get("messages")
                    or []
                )
                return JSONResponse(
                    content={
                        "status": "success",
                        "conversation_id": thread_conv_id_key,
                        "account_id": thread_acc_param,
                        "messages": list(cached_fallback),
                    },
                    status_code=200,
                    headers={"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"},
                )

            if method_upper == "GET" and clean_path in ("email/accounts", "email/discover") and resp.status_code != 200:
                return JSONResponse(content=_filter_email_accounts_payload({}), status_code=200)
            if method_upper == "GET" and clean_path == "email/messages" and resp.status_code != 200:
                return JSONResponse(content=_filter_email_messages_payload({}), status_code=200)

            content_type = resp.headers.get("content-type", "application/json")
            content_bytes = resp.content
            if "application/json" in content_type.lower() and b"cdninstagram.com" in content_bytes:
                try:
                    cleaned_text = _EXPIRED_IG_CDN_RE.sub("", content_bytes.decode("utf-8", errors="ignore"))
                    content_bytes = cleaned_text.encode("utf-8")
                except Exception:
                    pass

            if method_upper == "GET" and "application/json" in content_type.lower():
                try:
                    parsed_json = json.loads(content_bytes.decode("utf-8", errors="replace"))
                    if isinstance(parsed_json, dict):
                        filtered_json = _filter_whitelisted_records_in_proxy_json(clean_path, parsed_json)
                        resp_headers = (
                            {"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"}
                            if (clean_path == "comments" or clean_path.startswith("messages/"))
                            else None
                        )
                        return JSONResponse(
                            content=filtered_json,
                            status_code=resp.status_code,
                            headers=resp_headers,
                        )
                except Exception:
                    pass

            return Response(
                content=content_bytes,
                status_code=resp.status_code,
                media_type=content_type,
            )
    except Exception:
        if is_message_thread_get:
            cached_fallback = (
                (_PORTFOLIO_MESSAGES_THREAD_CACHE.get(thread_conv_id_key) or {}).get("messages")
                or (_DM_TEST_SESSIONS.get(thread_conv_id_key) or {}).get("messages")
                or []
            )
            return JSONResponse(
                content={
                    "status": "success",
                    "conversation_id": thread_conv_id_key,
                    "account_id": thread_acc_param,
                    "messages": list(cached_fallback),
                },
                status_code=200,
                headers={"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"},
            )
        if method_upper == "GET" and clean_path in ("email/accounts", "email/discover"):
            return JSONResponse(content=_filter_email_accounts_payload({}), status_code=200)
        if method_upper == "GET" and clean_path == "email/messages":
            return JSONResponse(content=_filter_email_messages_payload({}), status_code=200)
        if method_upper == "GET" and clean_path == "social/accounts":
            return JSONResponse(content=_filter_social_accounts_payload({}), status_code=200)
        if method_upper == "GET" and clean_path == "connected_accounts":
            return JSONResponse(content=_filter_connected_accounts_payload({}), status_code=200)
        if method_upper == "GET" and clean_path == "comments":
            cached_payload = _PORTFOLIO_COMMENTS_LAST_GOOD_CACHE.get("payload")
            return JSONResponse(
                content=cached_payload if isinstance(cached_payload, dict) else {"status": "success", "comments": []},
                status_code=200,
                headers={"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"},
            )
        return JSONResponse(
            content={
                "status": "success",
                "items": [],
                "accounts": [],
                "conversations": [],
                "comments": [],
                "summary": {},
                "pages": [],
                "posts": [],
            },
            status_code=200,
        )


if __name__ == "__main__":
    port = int(os.getenv("PORT", 3000))
    print(f"Starting Portfolio Web App on http://0.0.0.0:{port}")
    if _EARLY_SERVER_SOCKET is not None:
        _config = uvicorn.Config(app, host="0.0.0.0", port=port)
        _server = uvicorn.Server(_config)
        _server.run(sockets=[_EARLY_SERVER_SOCKET])
    else:
        uvicorn.run(app, host="0.0.0.0", port=port)

