(() => {
  if (document.body.dataset.feedbackWidget === "off" || document.querySelector(".feedback-widget")) return;

  const style = document.createElement("style");
  style.textContent = `
    .feedback-widget{position:fixed;z-index:40;right:20px;bottom:20px;width:min(390px,calc(100% - 32px));padding:20px;border:1px solid rgba(23,33,43,.2);border-radius:16px;background:color-mix(in srgb,#fffdf8 94%,#ece6d9);color:#17212b;box-shadow:0 18px 60px rgba(7,18,29,.2);font-family:"PingFang SC","Microsoft YaHei",system-ui,sans-serif}
    .feedback-widget[hidden]{display:none}.feedback-widget-close{position:absolute;right:10px;top:8px;width:30px;height:30px;border:0;background:transparent;color:#69717a;font-size:20px;cursor:pointer}
    .feedback-widget h2{margin:0 30px 8px 0;font-family:"Songti SC",Georgia,serif;font-size:21px}.feedback-widget p{margin:0;color:#69717a;font-size:13px;line-height:1.7}
    .feedback-widget-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}.feedback-widget-actions a{display:grid;min-height:42px;place-items:center;border:1px solid #17212b;border-radius:8px;font-size:12px;font-weight:800;text-decoration:none}
    .feedback-widget-actions a:first-child{background:#17212b;color:#fffdf8}.feedback-widget-actions a:last-child{background:transparent;color:#17212b}.feedback-widget small{display:block;margin-top:12px;color:#9a7b56;text-align:center;font-size:10px}
    .feedback-launcher{position:fixed;z-index:39;right:20px;bottom:20px;display:flex;align-items:center;gap:8px;min-height:46px;padding:0 16px;border:1px solid rgba(23,33,43,.22);border-radius:999px;background:#17212b;color:#fffdf8;box-shadow:0 12px 36px rgba(7,18,29,.22);font:800 12px "PingFang SC","Microsoft YaHei",system-ui,sans-serif;cursor:pointer}.feedback-launcher[hidden]{display:none}.feedback-launcher i{width:8px;height:8px;border-radius:50%;background:#e3b35b;box-shadow:0 0 0 4px rgba(227,179,91,.16)}
    body.dark .feedback-widget{border-color:#344451;background:#17232e;color:#f2eee5}.dark .feedback-widget p,.dark .feedback-widget-close{color:#a9b1b8}.dark .feedback-widget-actions a:first-child{background:#f2eee5;color:#17232e}.dark .feedback-widget-actions a:last-child{border-color:#f2eee5;color:#f2eee5}.dark .feedback-launcher{border-color:#52616d;background:#f2eee5;color:#17232e}
    @media(max-width:640px){.feedback-widget{right:12px;bottom:12px;padding:16px}.feedback-widget-actions{grid-template-columns:1fr}.feedback-widget small{display:none}.feedback-launcher{right:12px;bottom:12px}}
  `;
  document.head.append(style);

  const card = document.createElement("aside");
  card.className = "feedback-widget";
  card.setAttribute("aria-label", "网站反馈入口");
  card.innerHTML = `
    <button class="feedback-widget-close" type="button" aria-label="关闭反馈卡片">×</button>
    <h2>💬 你的反馈很重要</h2>
    <p>网站还在持续优化中，欢迎提出建议。你的每一条反馈对我们都很重要 ♥️</p>
    <div class="feedback-widget-actions">
      <a href="/feedback/#submit">提交反馈</a>
      <a href="/feedback/#community">加入交流群</a>
    </div>
    <small>每一条反馈都会被认真阅读</small>`;
  document.body.append(card);
  const launcher = document.createElement("button");
  launcher.className = "feedback-launcher";
  launcher.type = "button";
  launcher.innerHTML = '<i></i><span>公告与反馈</span>';
  launcher.setAttribute("aria-label", "打开公告与反馈卡片");
  document.body.append(launcher);

  const setCollapsed = (collapsed) => {
    card.hidden = collapsed;
    launcher.hidden = !collapsed;
    try { localStorage.setItem("51vipai-feedback-collapsed", collapsed ? "1" : "0"); } catch { /* storage can be unavailable */ }
  };
  let collapsed = false;
  try { collapsed = localStorage.getItem("51vipai-feedback-collapsed") === "1"; } catch { /* storage can be unavailable */ }
  setCollapsed(collapsed);
  card.querySelector(".feedback-widget-close").addEventListener("click", () => setCollapsed(true));
  launcher.addEventListener("click", () => setCollapsed(false));
})();
