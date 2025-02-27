const grandParent = document.getElementById("grand-parent");
const parent = document.getElementById("parent");
const child = document.getElementById("child");

grandParent.addEventListener("click", (e) => {
  const dataId = e.target.dataset.id;
  console.log(`you pressed on the ${dataId}`);
});

// parent.addEventListener("click", () => {
//   console.log("you pressed on the parent");
// });
//
// child.addEventListener("click", (e) => {
//   e.stopPropagation();
//   console.log("you pressed on the child");
// });
