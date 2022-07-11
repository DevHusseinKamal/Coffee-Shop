const navbar = document.querySelector(".navbar");
const searchForm = document.querySelector(".search-form");
const cartItem = document.querySelector(".cart-items-container");

const showBars = () => {
  document.querySelector("#menu-btn").addEventListener("click", () => {
    navbar.classList.toggle("active");
    searchForm.classList.remove("active");
    cartItem.classList.remove("active");
  });
};

showBars();

const showSearch = () => {
  document.querySelector("#search-btn").onclick = () => {
    searchForm.classList.toggle("active");
    navbar.classList.remove("active");
    cartItem.classList.remove("active");
  };
};

showSearch();

const showCart = () => {
  document.querySelector("#cart-btn").addEventListener("click", () => {
    cartItem.classList.toggle("active");
    navbar.classList.remove("active");
    searchForm.classList.remove("active");
  });
};

showCart();

const navLinks = [...document.querySelectorAll(".navbar a")];
const sections = Array.from(document.querySelectorAll("section"));

const smoothScroll = () => {
  navLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      sections[index].scrollIntoView({ behavior: "smooth" });
    });
  });
};

smoothScroll();

const changeActiveClass = () => {
  window.addEventListener("scroll", () => {
    let currentIndex = 0;
    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      if (scrollY > sectionTop - 100) {
        currentIndex = index;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
    });
    navLinks[currentIndex].classList.add("active");
  });
};

changeActiveClass();

class CoffeeShop {
  #cart = Storage.getCart();

  constructor() {
    this.addBtns = [...document.querySelectorAll(".box .btn")];
    this.cartContainer = document.querySelector(".cart-items-container");
    this.addItem();
    this.removeItem();
  }

  inCart(id) {
    return this.#cart.find((item) => item.id === id);
  }

  addItem() {
    this.addBtns.forEach((btn, index) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();

        const id = index + 1;

        if (this.inCart(id)) {
          alert("Item already in the cart!");
          return;
        }

        const data = {};

        const coffeTitle =
          e.currentTarget.previousElementSibling.previousElementSibling
            .textContent;

        const coffePrice = parseFloat(
          e.currentTarget.previousElementSibling.textContent.slice(1, 6)
        );

        const coffeImg =
          e.currentTarget.previousElementSibling.previousElementSibling
            .previousElementSibling.src;

        data.id = id;
        data.title = coffeTitle;
        data.price = coffePrice;
        data.img = coffeImg;

        this.#cart.push(data);
        Storage.saveCart(this.#cart);
        this.updateCart();
        alert("Item added to the cart!");
      });
    });
  }

  updateCart() {
    let result = "";
    this.#cart.map((item) => {
      result += `
        <div class="cart-item" id=${item.id}>
          <span class="fas fa-times"></span>
          <img src=${item.img} alt=${item.title}>
          <div class="content">
            <h3>${item.title}</h3>
            <div class="price">$${item.price}/-</div>
          </div>
        </div>
      `;
    });

    this.cartContainer.innerHTML = `${result} <a href="#" class="btn check">checkout now</a>`;
  }

  removeItem() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-times")) {
        const id = +e.target.parentElement.id;
        this.#cart = this.#cart.filter((item) => item.id !== id);

        Storage.saveCart(this.#cart);
        this.updateCart();
      }
    });
  }
}

class Storage {
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }
}

const coffeShop = new CoffeeShop();

document.addEventListener("DOMContentLoaded", () => {
  coffeShop.updateCart();
});
