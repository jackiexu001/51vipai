(() => {
  const form = document.querySelector("#feedback-form");
  const status = document.querySelector("#feedback-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    const data = new FormData(form);
    const payload = {
      type: data.get("type"),
      message: data.get("message"),
      contact: data.get("contact"),
      website: data.get("website"),
      pageUrl: document.referrer || location.href,
    };
    button.disabled = true;
    status.className = "feedback-status";
    status.textContent = "正在提交…";
    try {
      const response = await fetch("/api/v1/feedback", { method:"POST", headers:{ "content-type":"application/json" }, body:JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "提交失败，请稍后重试。");
      form.reset();
      status.className = "feedback-status success";
      status.textContent = result.message || "感谢你的反馈，我们会认真阅读。";
    } catch (error) {
      status.className = "feedback-status error";
      status.textContent = error.message || "提交失败，请稍后重试。";
    } finally {
      button.disabled = false;
    }
  });
})();
