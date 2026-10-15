async function fetchMenuData() {
  try {
    const response = await fetch("js/foods.json");
    const menuData = await response.json();

    renderCategories(menuData.categories);

    const firstCategory = Object.keys(menuData.categories)[0];
    renderMenuItems(menuData.categories[firstCategory], firstCategory);

    setupCategorySwitching(menuData.categories);
  } catch (error) {
    console.error("Error while fetching menu data!");
  }
}

function renderCategories(categories) {
  const categoriesContainer = document.querySelector(".menu-categories");
  categoriesContainer.innerHTML = "";

  Object.keys(categories).forEach((categoryName, index) => {
    const categoryElement = document.createElement("div");
    categoryElement.classList.add("menu-category");

    if (index === 0) {
      categoryElement.classList.add("active");
    }
    categoryElement.innerHTML = `
    <img src="img/pasta.svg" alt="${categoryName}" width="200px" />
    <div class="menu-category-info">
        <h3 class="menu-category-title">${categoryName}</h3>
        <p class="text-gray">${categories[categoryName].length} Menu items</p>
    </div>`;

    categoriesContainer.appendChild(categoryElement);
  });
}

function renderMenuItems(items, categoryName) {
  const itemsContainer = document.querySelector(".menu-items");

  const categoryTitleElement = document.getElementById("selectedCategoryTitle");
  categoryTitleElement.textContent = `${categoryName} Menu`;

  itemsContainer.innerHTML = "";

  items.forEach((item) => {
    const menuItemElement = document.createElement("div");
    menuItemElement.classList.add("menu-item");
    menuItemElement.innerHTML = `
    <div class="menu-item-header">
      <img src="${item.image}" alt="${item.name}" width="200px" class="menu-item-img" />
      <div class="menu-item-title">
        <h3>${item.name}</h3>
        <p class="text-gray menu-item-desc">${item.ingredients ? item.ingredients : "No ingredients description!"}</p>
      </div>
    </div>
    <div class="menu-item-footer">
      <h3 class="menu-item-price"><span>$</span>${item.price.toFixed(2)}</h3>
      <button class="menu-item-button" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">Add to cart</button>
    </div>`;
    itemsContainer.appendChild(menuItemElement);
  });``

  document.querySelectorAll(".menu-item-button").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const price = button.getAttribute("data-price");
      const image = button.getAttribute("data-image");

      addToCart({ name, price, image });
    });
  });
}

function addToCart(selectedFood) {
  //local Storage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItemIndex = cart.findIndex(
    (item) => item.name === selectedFood.name,
  );

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({
      name: selectedFood.name,
      price: selectedFood.price,
      image: selectedFood.image,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();

  renderInvoice();
  Toastify({
    text: `${selectedFood.name} added to cart!`,
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "center",
    backgroundColor: "#ff7a00",
    stopOnFocus: true,
  }).showToast();
}

function updateCartBadge() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalUniqueItems = cart.length;

  document.getElementById("cart-badge").textContent = totalUniqueItems;
}

function setupCategorySwitching(categories) {
  const categoryElements = document.querySelectorAll(".menu-category");

  categoryElements.forEach((categoryElement) => {
    categoryElement.addEventListener("click", () => {
      const selectedCategoryName = categoryElement.querySelector(
        ".menu-category-title",
      ).textContent;

      categoryElements.forEach((element) => {
        element.classList.remove("active");
      });
      categoryElement.classList.add("active");

      renderMenuItems(categories[selectedCategoryName], selectedCategoryName);
    });
  });
}

function renderInvoice() {
  const invoiceItemsContainer = document.querySelector(".invoice-items");
  const paymentSummaryContainer = document.querySelector(".payment-summary");

  invoiceItemsContainer.innerHTML = "<h2>Invoice</h2>";

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let subTotal = 0;

  cart.forEach((item, index) => {
    const itemTotalPrice = item.price * item.quantity;
    subTotal += itemTotalPrice; // subTotal = subTotal+ itemTotalPrice;

    const invoiceItemElement = document.createElement("div");
    invoiceItemElement.classList.add("invoice-item");

    invoiceItemElement.innerHTML = `
     <img src="${item.image}"  alt="${item.name}" width="200xp" />
            <div class="invoice-item-details">
              <h3>${item.name}</h3>
              <div class="invoice-item-quantity">
                <button class="quantity-btn decrease" data-index = "${index}">-</button>
                <input type="text" class="quantity-input" value="${item.quantity}" />
                <button class="quantity-btn increase" data-index = "${index}">+</button>
              </div>
            </div>
            <div class="invoice-item-price">
              <h3>$${itemTotalPrice.toFixed(2)}</h3>`;

    invoiceItemsContainer.appendChild(invoiceItemElement);
  });

  const tax = subTotal * 0.04;
  const totalPayment = subTotal + tax;

  paymentSummaryContainer.innerHTML = `
   <h3>Payment Summary</h3>
          <div class="summary-details">
            <p class="text-gray">Sub Total</p>
            <p> $ ${subTotal.toFixed(2)}</p>
          </div>
          <div class="summary-details">
            <p class="text-gray">Tax</p>
            <p>$ ${tax.toFixed(2)}</p>
          </div>
          <div class="summary-total">
            <p class="text-gray">Total Payment</p>
            <p>$${totalPayment.toFixed(2)}</p>
          </div>
          <button class="pay-button">Pay $${totalPayment.toFixed(2)}</button> `;

  const increaseButton = document.querySelectorAll(".quantity-btn.increase");
  const decreaseButton = document.querySelectorAll(".quantity-btn.decrease");

  increaseButton.forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.dataset.index;
      updateCartQuantity(index, 1);
    });
  });

  decreaseButton.forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.dataset.index;
      updateCartQuantity(index, -1);
    });
  });
  document.querySelector(".pay-button").addEventListener("click", () => {
    document.getElementById("payment-modal").style.display = "flex";
  });
}

function updateCartQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const item = cart[index];

  if (item) {
    item.quantity += change;

    if (item.quantity < 1) {
      cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    renderInvoice();
    updateCartBadge();
  }
}

fetchMenuData();
updateCartBadge();
renderInvoice();
