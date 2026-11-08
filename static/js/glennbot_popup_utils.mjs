export const GLENNBOT_LIVE_ORIGIN = "https://glennbotautomations.onrender.com";

export const SYS01_EXPANDED_VIEWS = {
  scheduler: {
    tab: "scheduler",
    label: "📝 Create Post",
    title: "Create & Schedule Post — Expanded View",
    subtitle: "Multi-Platform Publisher, Media Studio & AI Caption Workspace",
    icon: "fas fa-paper-plane",
    width: 1240,
    height: 860,
    baseUrl: "https://glennbotautomations.onrender.com/?popout_mode=workspace_view&tab=scheduler",
  },
  queue: {
    tab: "queue",
    label: "⏳ Queue",
    title: "Publishing Queue & History — Expanded View",
    subtitle: "Live Scheduled, Published & Draft Social Posts Monitor",
    icon: "fas fa-stream",
    width: 1220,
    height: 840,
    baseUrl: "https://glennbotautomations.onrender.com/?popout_mode=workspace_view&tab=queue",
  },
  calendar: {
    tab: "calendar",
    label: "📅 Calendar",
    title: "Content & Meetings Calendar — Expanded View",
    subtitle: "Unified Monthly Schedule for Social Media Posts & Video Appointments",
    icon: "fas fa-calendar-alt",
    width: 1260,
    height: 860,
    baseUrl: "https://glennbotautomations.onrender.com/?popout_mode=workspace_view&tab=calendar",
  },
};

export function buildGlennBotExpandedUrl(tabName = "scheduler", mode = "workspace_view", timestamp = null) {
  if (typeof tabName === "string" && /^https?:\/\//i.test(tabName.trim())) {
    return tabName.trim();
  }
  const cleanTab = String(tabName || "scheduler").trim();
  const cleanMode = String(mode || "workspace_view").trim();
  const base = `${GLENNBOT_LIVE_ORIGIN}/?popout_mode=${encodeURIComponent(cleanMode)}&tab=${encodeURIComponent(cleanTab)}`;
  if (timestamp !== null && timestamp !== undefined) {
    return `${base}&_ts=${encodeURIComponent(String(timestamp))}`;
  }
  return base;
}

export function computeCenteredPopupFeatures(width = 1240, height = 860, screenAvailW = 1440, screenAvailH = 900) {
  const availW = Number(screenAvailW) > 0 ? Number(screenAvailW) : 1440;
  const availH = Number(screenAvailH) > 0 ? Number(screenAvailH) : 900;
  const w = Math.min(Number(width) || 1240, availW - 40);
  const h = Math.min(Number(height) || 860, availH - 80);
  const left = Math.max(0, Math.round((availW - w) / 2));
  const top = Math.max(0, Math.round((availH - h) / 2));
  const features = `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
  return { w, h, left, top, features };
}
