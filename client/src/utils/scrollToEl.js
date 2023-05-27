export function scrollToEl(id) {
  const el = document.getElementById(id);
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("chat-selected");
  setTimeout(() => el.classList.remove("chat-selected"), 2500);
}
