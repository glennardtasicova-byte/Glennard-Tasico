// Portfolio Theme Switcher (Light / Dark Mode) & Interactive Hooks
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "glenn_portfolio_theme";
  const root = document.documentElement;
  const toggleBtn = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    const normalized = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", normalized);
    if (toggleBtn) {
      const nextModeLabel = normalized === "dark" ? "Switch to light mode" : "Switch to dark mode";
      toggleBtn.setAttribute("aria-label", nextModeLabel);
      toggleBtn.setAttribute("title", nextModeLabel);
      toggleBtn.setAttribute("aria-pressed", normalized === "light" ? "true" : "false");
    }
  }

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

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const active = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = active === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        // Ignore storage write errors
      }
    });
  }
});
