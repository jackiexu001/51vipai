(() => {
  const button = document.querySelector("#theme-button");
  if (!button) return;

  try {
    document.body.classList.toggle("dark", localStorage.getItem("51vipai-theme") === "dark");
  } catch { /* storage can be unavailable */ }

  button.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    try {
      localStorage.setItem("51vipai-theme", document.body.classList.contains("dark") ? "dark" : "light");
    } catch { /* storage can be unavailable */ }
  });
})();
