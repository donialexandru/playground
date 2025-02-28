window.addEventListener("DOMContentLoaded", () => {
  console.log("the DOM was loaded");
  const grandParent = document.getElementById("grand-parent");
  const parent = document.getElementById("parent");
  const child = document.getElementById("child");

  grandParent.addEventListener("click", (e) => {
    const dataId = e.target.dataset.id;
    console.log(`you pressed on the ${dataId}`);
    e.stopPropagation();
  });

  const body = document.body;
  body.addEventListener("click", (e) => {
    console.log("The body was activated");
    e.stopPropagation();
  });

  class MyCardItem extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.titleElement = document.createElement("h5");
      this.idElement = document.createElement("p");
      this.priceElement = document.createElement("p");
      this.shadow.appendChild(this.titleElement);
      this.shadow.appendChild(this.idElement);
      this.shadow.appendChild(this.priceElement);
    }
    static get observedAttributes() {
      return ["title", "data-id", "price"];
    }
    attributeChangedCallback(name, oldvalue, newValue) {
      if (name === "title") {
        this.titleElement.textContent = newValue;
      } else if (name === "price") {
        this.priceElement.textContent = newValue;
      } else if (name === "data-id") {
        this.idElement.textContent = newValue;
      }
    }

    connectedCallback() {
      this.titleElement.textContent = this.getAttribute("title");
      this.idElement.textContent = this.getAttribute("data-id");
      this.priceElement.textContent = this.getAttribute("price");
    }
  }

  customElements.define("my-card-item", MyCardItem);

  function createItem(title, id, price) {
    element = document.createElement("my-card-item");
    element.setAttribute("title", title);
    element.setAttribute("data-id", id);
    element.setAttribute("price", price);
    element.setAttribute("class", "card");

    return element;
  }

  const productsElement = document.getElementById("pagination-root");
  productsElement.innerHTML = "";
  productsElement.addEventListener("click", (e) => {
    console.log(`You have selected the card with id: ${e.target.dataset.id}`);
    e.stopPropagation();
  });

  let skip = 0;

  async function fetchData() {
    const data = await fetch(
      `https://dummyjson.com/products?limit=10&skip=${skip}&select=title,price`,
    );
    const dataJson = await data.json();
    const products = dataJson.products;
    skip += 10;
    return products;
  }

  async function changeItems() {
    newProducts = await fetchData();
    for (let i = 0; i < productsElement.children.length; i++) {
      product = newProducts[i];
      productsElement.children[i].setAttribute("title", product.title);
      productsElement.children[i].dataset.id = product.id;
      productsElement.children[i].setAttribute("price", product.price);
    }
  }

  async function fetchAndProcessData() {
    if (productsElement.children.length == 0) {
      const products = await fetchData();
      products.forEach((element) => {
        const item = createItem(element.title, element.id, element.price);
        productsElement.appendChild(item);
      });
    } else {
      changeItems();
    }
  }

  fetchButton = document.getElementById("fetch-button");
  fetchButton.addEventListener("click", (e) => {
    e.stopPropagation();
    fetchAndProcessData();
  });
});
