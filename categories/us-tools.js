(() => {
  const trigger = document.querySelector("#us-tools-trigger");
  const menu = document.querySelector("#us-tools-dropdown");
  if (!trigger || !menu) return;
  const close = () => { menu.hidden = true; trigger.setAttribute("aria-expanded", "false"); };
  trigger.addEventListener("click", () => {
    const opening = menu.hidden;
    menu.hidden = !opening;
    trigger.setAttribute("aria-expanded", String(opening));
  });
  document.addEventListener("click", (event) => { if (!event.target.closest(".us-tools-menu")) close(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { close(); trigger.focus(); } });
})();
