// --------------------- SEARCH FUNCTION ---------------------
function searchProducts() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const products = document.querySelectorAll('.product');

  products.forEach(product => {
    const name = product.querySelector('h3').textContent.toLowerCase();
    product.style.display = name.includes(input) ? 'block' : 'none';
  });
}

// adding shop sa cart
// Get existing cart from localStorage or create new one
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart counter display
function updateCartCount() {
  const cartCounter = document.getElementById('cart-count');
  cartCounter.textContent = cart.length;
}
updateCartCount();

// Add to Cart button
document.querySelectorAll('.add-cart-btn').forEach(button => {
  button.addEventListener('click', (event) => {
    const productCard = event.target.closest('.product-card');
    const product = {
      title: productCard.querySelector('.product-title').textContent,
      price: productCard.querySelector('.product-price').textContent,
      image: productCard.querySelector('img').src
    };

    // Add to cart array
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    alert(`${product.title} added to cart!`);
  });
});
// === PRODUCT MODAL LOGIC ===
const modal = document.getElementById('productModal');
const modalImg = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalStock = document.getElementById('modalStock');
const modalDesc = document.getElementById('modalDesc');
const sizeButtonsContainer = document.getElementById('sizeButtons');

const modalAddToCart = document.getElementById('modalAddToCart');
const modalBuyNow = document.getElementById('modalBuyNow');
const closeBtn = document.querySelector('.close-btn');

let currentImages = [];
let currentIndex = 0;
let selectedSize = null;
let currentProduct = null;

// Example product-specific images
const productImages = {
  "AFEEC Signature Hoodie": [
    "https://via.placeholder.com/400x400?text=Hoodie+Front",
    "https://via.placeholder.com/400x400?text=Hoodie+Model"
  ],
  "AFEEC Classic Tee": [
    "https://via.placeholder.com/400x400?text=Tee+Front",
    "https://via.placeholder.com/400x400?text=Tee+Model"
  ]
};

// Open modal when product is clicked
document.querySelectorAll('.product-card img').forEach(img => {
  img.addEventListener('click', e => {
    const card = e.target.closest('.product-card');
    const title = card.querySelector('.product-title').textContent;
    const price = card.querySelector('.product-price').textContent;
    const stock = card.querySelector('.product-stock')?.textContent || 'In stock';
    const desc = card.querySelector('.product-desc')?.textContent || 'High-quality product from Affectious Closet.';
    const category = card.dataset.category;

    // Use product-specific images or fallback
    currentImages = productImages[title] || [img.src];
    currentIndex = 0;
    modalImg.src = currentImages[currentIndex];

    modalTitle.textContent = title;
    modalPrice.textContent = price;
    modalStock.textContent = stock;
    modalDesc.textContent = desc;
    selectedSize = null;

    // Size options based on category
    sizeButtonsContainer.innerHTML = '';
    let sizes = [];
    if (category === 'hoodie' || category === 'tshirt') sizes = ['S','M','L','XL','XXL'];
    else if (category === 'shoes') sizes = ['6','7','8','9','10'];
    else if (category === 'socks') sizes = ['1 Pair','2 Pairs','3 Pairs'];
    else sizes = ['Free Size'];

    sizes.forEach(size => {
      const btn = document.createElement('button');
      btn.textContent = size;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-buttons button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = size;
      });
      sizeButtonsContainer.appendChild(btn);
    });

    currentProduct = { title, price, category, stock, desc };

    modal.style.display = 'flex';
  });
});

// Close modal
closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});



// Arrows (boxed)
document.querySelector('.arrow-box.left').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
});
document.querySelector('.arrow-box.right').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
});

// Add to cart
modalAddToCart.addEventListener('click', () => {
  if (!selectedSize) return alert('Please select a size first.');
  const product = { ...currentProduct, size: selectedSize, image: currentImages[0] };
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${product.title} (${product.size}) added to cart!`);
  modal.style.display = 'none';
});

// Buy now
modalBuyNow.addEventListener('click', () => {
  if (!selectedSize) return alert('Please select a size first.');
  const product = { ...currentProduct, size: selectedSize, image: currentImages[0] };
  localStorage.setItem('cart', JSON.stringify([product]));
  window.location.href = 'cart.html';
});

