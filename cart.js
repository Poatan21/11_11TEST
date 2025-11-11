document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cartItems");
  const totalPriceEl = document.getElementById("totalPrice");
  const selectAllCheckbox = document.getElementById("selectAll");
  const removeSelectedBtn = document.getElementById("removeSelected");
  const checkoutBtn = document.getElementById("checkout");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // =========================
  // RENDER CART ITEMS
  // =========================
  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      totalPriceEl.textContent = "0.00";
      return;
    }

    cart.forEach((item, index) => {
      const cleanPrice = parseFloat(
        String(item.price).replace(/[₱,]/g, "").trim()
      );
      const quantity = item.quantity || 1;
      const itemTotal = cleanPrice * quantity;
      total += itemTotal;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <input type="checkbox" class="item-checkbox" data-index="${index}">
        <img src="${item.image}" alt="${item.title}">
        <div class="item-details">
          <h3>${item.title}</h3>
          <p>Size: ${item.size || "N/A"}</p>
          <p class="stock">Stock: ${item.stock || "N/A"}</p>
          <p class="item-price">₱${cleanPrice.toLocaleString()}</p>
        </div>
        <div class="item-actions">
          <button class="minus" data-index="${index}">-</button>
          <span class="quantity">${quantity}</span>
          <button class="plus" data-index="${index}">+</button>
          <button class="delete" data-index="${index}">🗑️</button>
        </div>
      `;
      cartItemsContainer.appendChild(div);
    });

    // update displayed total
    totalPriceEl.textContent = total.toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });

    addEventListeners();
  }

  // =========================
  // UPDATE TOTAL WHEN CHECKBOXES CHANGE
  // =========================
  function updateTotal() {
    let total = 0;
    document.querySelectorAll(".cart-item").forEach((item) => {
      const checkbox = item.querySelector(".item-checkbox");
      if (checkbox && checkbox.checked) {
        const quantity = parseInt(item.querySelector(".quantity").textContent);
        const priceText = item
          .querySelector(".item-price")
          .textContent.replace(/[₱,]/g, "");
        const price = parseFloat(priceText);
        if (!isNaN(price)) total += quantity * price;
      }
    });

    totalPriceEl.textContent = total.toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
  }

  // =========================
  // ADD EVENT LISTENERS
  // =========================
  function addEventListeners() {
    // PLUS
    document.querySelectorAll(".plus").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        const stock = parseInt(cart[index].stock) || 99;
        if (cart[index].quantity < stock) {
          cart[index].quantity++;
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCart();
        } else {
          alert("Stock limit reached!");
        }
      });
    });

    // MINUS
    document.querySelectorAll(".minus").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCart();
        }
      });
    });

    // DELETE
    document.querySelectorAll(".delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });

    // ITEM CHECKBOXES
    document.querySelectorAll(".item-checkbox").forEach((box) => {
      box.addEventListener("change", updateTotal);
    });
  }

  // =========================
  // SELECT ALL
  // =========================
  selectAllCheckbox.addEventListener("change", () => {
    const checked = selectAllCheckbox.checked;
    document.querySelectorAll(".item-checkbox").forEach((box) => {
      box.checked = checked;
    });
    updateTotal();
  });

  // =========================
  // REMOVE SELECTED
  // =========================
  removeSelectedBtn.addEventListener("click", () => {
    const selectedIndexes = [];
    document.querySelectorAll(".item-checkbox").forEach((cb, i) => {
      if (cb.checked) selectedIndexes.push(i);
    });

    if (selectedIndexes.length === 0) {
      alert("No items selected to remove.");
      return;
    }

    cart = cart.filter((_, i) => !selectedIndexes.includes(i));
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  });

  // =========================
  // CHECKOUT (REDIRECT)
  // =========================
  checkoutBtn.addEventListener("click", () => {
    const selectedItems = [];
    document.querySelectorAll(".item-checkbox").forEach((cb, i) => {
      if (cb.checked) selectedItems.push(cart[i]);
    });

    if (selectedItems.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }

    localStorage.setItem("selectedCart", JSON.stringify(selectedItems));
    window.location.href = "checkout.html";
  });

  // Initial render
  renderCart();
});
