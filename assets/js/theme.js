function loadTheme() {
  const toggleBtn = document.getElementById("toggle-theme");
  const iconClass = toggleBtn.querySelector("#theme-icon");

  const saved = localStorage.getItem("themeInfo");
  const themeInfo = saved ? JSON.parse(saved) : ["light", "bxs:moon"];

  document.documentElement.setAttribute("data-bs-theme", themeInfo[0]);
  document.documentElement.setAttribute("data-theme", themeInfo[0]);
  iconClass.setAttribute("data-icon", themeInfo[1]);
}

function toggleMode() {
  const html = document.documentElement;
  const toggleBtn = document.getElementById("toggle-theme");
  const iconClass = toggleBtn.querySelector("#theme-icon");

  const currentTheme = html.getAttribute("data-bs-theme");
  const themeInfo =
    currentTheme === "dark"
      ? ["light", "bxs:moon"]
      : ["dark", "famicons:sunny"];

  html.setAttribute("data-bs-theme", themeInfo[0]);
  html.setAttribute("data-theme", themeInfo[0]);
  iconClass.setAttribute("data-icon", themeInfo[1]);

  localStorage.setItem("themeInfo", JSON.stringify(themeInfo));
}

function themeHandler() {
  loadTheme();
  document.getElementById("toggle-theme").addEventListener("click", toggleMode);
}

export { themeHandler };
