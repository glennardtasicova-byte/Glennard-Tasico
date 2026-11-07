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
# PLACEHOLDER CONFIGURATION FOR GLENNBOTAUTOMATIONS CONNECTION
# ==============================================================================
GLENNBOT_API_BASE_URL = os.getenv(
    "GLENNBOT_API_BASE_URL",
    "http://localhost:8000/api/v1",
).rstrip("/")
GLENNBOT_INTERNAL_API_KEY = os.getenv("GLENNBOT_INTERNAL_API_KEY", "").strip()
GLENNBOT_TIMEOUT_SECONDS = float(os.getenv("GLENNBOT_TIMEOUT_SECONDS", "15"))


def get_glennbot_headers() -> dict:
    """
    Helper function that prepares authentication headers (`X-API-Key`)
    for future API calls from Portfolio mini-widgets to GlennBotAutomations.
    """
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    if GLENNBOT_INTERNAL_API_KEY:
        headers["X-API-Key"] = GLENNBOT_INTERNAL_API_KEY
    return headers


async def call_glennbot_api(method: str, endpoint: str, payload: dict | None = None) -> dict:
    """
    Lightweight async HTTP client helper (using httpx) ready for future
    interactive portfolio widgets (e.g., /status, /ai/ask, /calendar/schedule).
    """
    url = f"{GLENNBOT_API_BASE_URL}/{endpoint.lstrip('/')}"
    async with httpx.AsyncClient(timeout=GLENNBOT_TIMEOUT_SECONDS) as client:
        response = await client.request(
            method=method.upper(),
            url=url,
            headers=get_glennbot_headers(),
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

# Mount /static (and /assets if present) and configure Jinja2 templates
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
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
        "glennbot_configured": bool(GLENNBOT_INTERNAL_API_KEY),
        "glennbot_base_url": GLENNBOT_API_BASE_URL,
    }
    try:
        return templates.TemplateResponse(
            request=request,
            name="index.html",
            context=context,
        )
    except TypeError:
        return templates.TemplateResponse("index.html", context)


from fastapi.responses import Response


def _build_cv_pdf_bytes() -> bytes:
    """Builds a clean, valid 1-page PDF resume for Glennard Tasico using pure Python."""
    lines = [
        ("F2", 18, 50, 760, "GLENNARD TASICO"),
        ("F1", 11, 50, 742, "AI Automation Specialist & Full-Stack Web Application Developer"),
        ("F1", 9, 50, 726, "Email: sccmoldgroup@gmail.com  |  GitHub: github.com/glennardtasico  |  Portfolio: GlennBot Automations"),
        ("F2", 12, 50, 696, "ABOUT ME"),
        ("F1", 9.5, 50, 680, "AI Automation Specialist & Full-Stack Web Developer building custom web dashboards and 24/7"),
        ("F1", 9.5, 50, 667, "automation workflows that eliminate repetitive manual work. Architected and engineered GlennBot"),
        ("F1", 9.5, 50, 654, "Automations - an all-in-one operations platform combining AI content generation, multi-platform"),
        ("F1", 9.5, 50, 641, "social scheduling, unified omnichannel inbox, cloud spreadsheet sync, and n8n webhook orchestration."),
        ("F2", 12, 50, 612, "EXPERIENCE & FEATURED ARCHITECTURE"),
        ("F2", 10, 50, 596, "AI Automation & Full-Stack Web Developer | Creator of GlennBot Automations (2024 - Present)"),
        ("F1", 9.5, 62, 581, "- Engineered 24/7 automated pipelines using n8n, custom FastAPI REST APIs (/api/v1), and webhooks."),
        ("F1", 9.5, 62, 568, "- Built responsive internal tools, CRM dashboards, and cloud spreadsheet sync with Python & JS."),
        ("F1", 9.5, 62, 555, "- Integrated Google Gemini API for context-aware caption generation, smart inbox auto-replies, and AI workflows."),
        ("F1", 9.5, 62, 542, "- Unified omnichannel social scheduling & inbox (FB, IG, TikTok, YouTube), IMAP/SMTP Email, TextBee SMS,"),
        ("F1", 9.5, 70, 529, "Composio Calendar/Meet booking, and two-way Google Drive / Spreadsheet synchronization."),
        ("F2", 12, 50, 500, "WHAT I BUILD"),
        ("F1", 9.5, 62, 484, "- Workflow & Webhook Automation: 24/7 automated pipelines using n8n, custom REST APIs (/api/v1), webhooks."),
        ("F1", 9.5, 62, 471, "- Custom Web Dashboards: Fast, responsive internal tools and CRM interfaces (FastAPI, JS, Tailwind CSS)."),
        ("F1", 9.5, 62, 458, "- AI Integration: Context-aware caption generators, smart inbox auto-replies, Gemini API workflows."),
        ("F1", 9.5, 62, 445, "- Omnichannel Social, Comms & Cloud Sync: Multi-platform social, Email, SMS, Calendar, Drive/Sheets sync."),
        ("F2", 12, 50, 416, "CORE TECH STACK"),
        ("F1", 9.5, 62, 400, "- Backend & Database: Python, FastAPI, SQLAlchemy, PostgreSQL (Supabase), Cloudinary"),
        ("F1", 9.5, 62, 387, "- Frontend: JavaScript (ES6+), HTML5, Tailwind CSS"),
        ("F1", 9.5, 62, 374, "- AI & Automation: n8n, Google Gemini API, REST APIs, Webhooks, APScheduler"),
        ("F1", 9.5, 62, 361, "- Integrations & Cloud: Google Drive API, Composio (Calendar/Meet/Zoom), TextBee SMS, Zernio, Render"),
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


@app.api_route("/cv/download", methods=["GET", "HEAD"])
async def download_cv():
    """Serves a downloadable PDF Resume/CV for Glennard Tasico."""
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
        "glennbot_api_base_url": GLENNBOT_API_BASE_URL,
    }


if __name__ == "__main__":
    port = int(os.getenv("PORT", 3000))
    print(f"Starting Portfolio Web App on http://0.0.0.0:{port}")
    if _EARLY_SERVER_SOCKET is not None:
        _config = uvicorn.Config(app, host="0.0.0.0", port=port)
        _server = uvicorn.Server(_config)
        _server.run(sockets=[_EARLY_SERVER_SOCKET])
    else:
        uvicorn.run(app, host="0.0.0.0", port=port)
