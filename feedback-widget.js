(() => {
  if (document.body.dataset.feedbackWidget === "off" || document.querySelector(".feedback-widget")) return;

  const style = document.createElement("style");
  style.textContent = `
    .feedback-widget{position:fixed;z-index:40;right:20px;bottom:20px;width:min(390px,calc(100% - 32px));padding:20px;border:1px solid rgba(23,33,43,.2);border-radius:16px;background:color-mix(in srgb,#fffdf8 94%,#ece6d9);color:#17212b;box-shadow:0 18px 60px rgba(7,18,29,.2);font-family:"PingFang SC","Microsoft YaHei",system-ui,sans-serif}
    .feedback-widget[hidden]{display:none}.feedback-widget-close{position:absolute;right:10px;top:8px;width:30px;height:30px;border:0;background:transparent;color:#69717a;font-size:20px;cursor:pointer}
    .feedback-widget h2{margin:0 30px 8px 0;font-family:"Songti SC",Georgia,serif;font-size:21px}.feedback-widget p{margin:0;color:#69717a;font-size:13px;line-height:1.7}
    .feedback-widget-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}.feedback-widget-actions a{display:grid;min-height:42px;place-items:center;border:1px solid #17212b;border-radius:8px;font-size:12px;font-weight:800;text-decoration:none}
    .feedback-widget-actions a:first-child{background:#17212b;color:#fffdf8}.feedback-widget-actions a:last-child{background:transparent;color:#17212b}.feedback-widget small{display:block;margin-top:12px;color:#9a7b56;text-align:center;font-size:10px}
    body.dark .feedback-widget{border-color:#344451;background:#17232e;color:#f2eee5}.dark .feedback-widget p,.dark .feedback-widget-close{color:#a9b1b8}.dark .feedback-widget-actions a:first-child{background:#f2eee5;color:#17232e}.dark .feedback-widget-actions a:last-child{border-color:#f2eee5;color:#f2eee5}
    @media(max-width:640px){.feedback-widget{right:12px;bottom:12px;padding:16px}.feedback-widget-actions{grid-template-columns:1fr}.feedback-widget small{display:none}}
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
  card.querySelector(".feedback-widget-close").addEventListener("click", () => { card.hidden = true; });
})();
