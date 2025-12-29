const bg = document.getElementById("bg");
const items = document.querySelectorAll(".item");

items.forEach(item => {
  item.addEventListener("mouseenter", () => {
    const img = item.getAttribute("data-bg");
    bg.style.backgroundImage = `url(${img})`;
  });
});
