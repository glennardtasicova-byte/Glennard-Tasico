import test from "node:test";
import assert from "node:assert/strict";
import {
  SYS01_EXPANDED_VIEWS,
  buildGlennBotExpandedUrl,
  buildInstantPopoutStyleTag,
  computeCenteredPopupFeatures,
} from "../static/js/glennbot_popup_utils.mjs";

test("SYS-01 defines the 3 auto-authenticated /glennbot-popout Expanded View URLs and upstream URLs", () => {
  assert.equal(
    SYS01_EXPANDED_VIEWS.scheduler.baseUrl,
    "/glennbot-popout?popout_mode=workspace_view&tab=scheduler"
  );
  assert.equal(
    SYS01_EXPANDED_VIEWS.queue.baseUrl,
    "/glennbot-popout?popout_mode=workspace_view&tab=queue"
  );
  assert.equal(
    SYS01_EXPANDED_VIEWS.calendar.baseUrl,
    "/glennbot-popout?popout_mode=workspace_view&tab=calendar"
  );
  assert.equal(
    SYS01_EXPANDED_VIEWS.scheduler.upstreamUrl,
    "https://glennbotautomations.onrender.com/?popout_mode=workspace_view&tab=scheduler"
  );
});

test("buildGlennBotExpandedUrl formats /glennbot-popout workspace_view URLs with and without timestamp", () => {
  assert.equal(
    buildGlennBotExpandedUrl("scheduler", "workspace_view"),
    "/glennbot-popout?popout_mode=workspace_view&tab=scheduler"
  );
  assert.equal(
    buildGlennBotExpandedUrl("queue", "workspace_view", 1700000000000),
    "/glennbot-popout?popout_mode=workspace_view&tab=queue&_ts=1700000000000"
  );
  assert.equal(
    buildGlennBotExpandedUrl("calendar", "workspace_view", 1700000000000),
    "/glennbot-popout?popout_mode=workspace_view&tab=calendar&_ts=1700000000000"
  );
});

test("computeCenteredPopupFeatures centers popup window within available screen bounds", () => {
  const res = computeCenteredPopupFeatures(1240, 860, 1920, 1080);
  assert.equal(res.w, 1240);
  assert.equal(res.h, 860);
  assert.equal(res.left, 340);
  assert.equal(res.top, 110);
  assert.ok(res.features.includes("width=1240,height=860,left=340,top=110"));
});

test("buildInstantPopoutStyleTag hides homepage chrome and toggles #view-scheduler based on targetTab", () => {
  const queueCss = buildInstantPopoutStyleTag("queue");
  assert.ok(queueCss.includes('<style id="gb-instant-popout-css">'));
  assert.ok(queueCss.includes("#main-dashboard-header"));
  assert.ok(queueCss.includes("#left-nav-sidebar"));
  assert.ok(queueCss.includes("#gb-popout-window-bar"));
  assert.ok(queueCss.includes("#view-scheduler:not(.gb-tab-ready)"));
  assert.ok(queueCss.includes("#view-queue"));

  const schedCss = buildInstantPopoutStyleTag("scheduler");
  assert.ok(!schedCss.includes("#view-scheduler:not(.gb-tab-ready)"));
  assert.ok(schedCss.includes("#view-scheduler {"));
});

