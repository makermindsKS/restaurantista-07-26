let currentIndex = 0;
const visibleItemsCount = 3;
let currentFoodPrice = 0;
let currentQuantity = 1;

async function fetchFoodData () {
  try {
    const response = await fetch("js/foods.json");
    const foodData = await response.json();

    const initialCategory = "Lunch";
    renderFoodCarousel(foodData.categories[initialCategory]);

    document.querySelector(".order-info-total .price").textContent =
      `$${foodData.categories[initialCategory][0].price.toFixed(2)}`;

    currentFoodPrice = foodData.categories[initialCategory][0].price.toFixed(2);

    updateHeroImage(foodData.categories[initialCategory][0]);

    setupArrowNavigation(foodData.categories[initialCategory]);
    console.log(foodData);
  } catch (error) {
    console.log(error);
  }
}

function renderFoodCarousel(foods) {
  const foodItemsContainer = document.querySelector(".food-items");
  foodItemsContainer.innerHTML = "";

  foods.forEach((food, index) => {
    const foodItem = document.createElement("div");
    foodItem.classList.add("food-item");

    if (index === 0) {
      foodItem.classList.add("selected");
    }
    foodItem.innerHTML = `
    <img src="${food.image}" width="200px" alt="${food.name}" />
    <p>
        ${food.name} <br />
        <span class="item-price">
            <span class="valute">$</span> ${food.price.toFixed(2)}
        </span>
    </p>`;

    if (index >= visibleItemsCount) {
      foodItem.style.display = "none";
    }

    foodItem.addEventListener("click", () => {
      selectedFoodItem(food, foodItem);
      currentIndex = index;
    });

    foodItemsContainer.appendChild(foodItem);
  });
}

function updateTotalPrice() {
  const totalPriceElement = document.querySelector(".order-info-total .price");

  const total = currentFoodPrice * currentQuantity;

  totalPriceElement.textContent = `$ ${total.toFixed(2)}`;
}

function updateQuantity(newQuantity) {
  currentQuantity = newQuantity;

  const quantityElement = document.getElementById("quantity");
  if (quantityElement) {
    quantityElement.textContent = currentQuantity;
  }

  updateTotalPrice();
}

const increaseBtn = document.getElementById("increase");
increaseBtn.addEventListener("click", () => {
  updateQuantity(currentQuantity + 1);
});

const decreaseBtn = document.getElementById("decrease");
decreaseBtn.addEventListener("click", () => {
  if (currentQuantity > 1) {
    updateQuantity(currentQuantity - 1);
  }
});

function selectedFoodItem(selectedFood, selectedElement) {
  updateHeroImage(selectedFood);

  currentFoodPrice = selectedFood.price;
  currentQuantity = 1;
  updateQuantity(currentQuantity);

  const allFoodItems = document.querySelectorAll(".food-item");
  allFoodItems.forEach((item) => item.classList.remove("selected"));

  selectedElement.classList.add("selected");
}

function updateHeroImage(food) {
  const heroImage = document.querySelector(".hero-main-image");
  const foodTitle = document.querySelector(".food-title p:first-of-type");
  const foodRating = document.querySelector(".food-title p:last-of-type");
  const preparationTime = document.querySelector(".prepare-time");

  heroImage.src = food.image;
  heroImage.alt = food.name;
  foodTitle.textContent = food.name;
  foodRating.innerHTML = ` <i class="fa-solid fa-star"></i><span id="rating">${food.rating}</span>`;
  preparationTime.innerHTML = `<i class="fa-regular fa-clock"></i> ${food.preparationTime}`;
}

function setupArrowNavigation(foods) {
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  leftArrow.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = foods.length - visibleItemsCount;
    }
    updateVisibleItems();
  });

  rightArrow.addEventListener("click", () => {
    if (currentIndex < foods.length - visibleItemsCount) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateVisibleItems();
  });
}

function updateVisibleItems() {
  const foodItems = document.querySelectorAll(".food-item");

  foodItems.forEach((food, index) => {
    if (index >= currentIndex && index < currentIndex + visibleItemsCount) {
      food.style.display = "block";
    } else {
      food.style.display = "none";
    }
  });
}

document.querySelector(".add-to-cart").addEventListener("click", () => {
  const selectedFoodItem = {
    name: document.querySelector(".food-title p:first-of-type").textContent,
    price: currentFoodPrice,
    image: document.querySelector(".hero-main-image").src,
  };

  addToCart(selectedFoodItem);
});

function addToCart(selectedFood) {
  //local Storage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItemIndex = cart.findIndex(
    (item) => item.name === selectedFood.name,
  );

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += currentQuantity;
  } else {
    cart.push({
      name: selectedFood.name,
      price: selectedFood.price,
      image: selectedFood.image,
      quantity: selectedFood.quantity,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();

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

fetchFoodData();
updateCartBadge();
