const apiUrl = 'https://fakestoreapi.com/products';
let cart = [];
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  setupSearch();
  updateCartVisibility(); 
});

function fetchProducts() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(products => {
      displayProducts(products);
      setupSearch(products);
    });
}

function displayProducts(products) {
  const productSection = document.getElementById('products');
  productSection.innerHTML = ''; 

  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product-card');

    productDiv.innerHTML = `
      <img src="${product.image}" class="product-card__image" alt="${product.title}">
      <h3 class="product-card__title">${product.title}</h3>
      <p>Rating: ${product.rating.rate} <i class="fa-solid fa-star" style="color:rgb(247, 247, 85);"></i> </p>
      <p class="product-card__price">₹${product.price}</p>
      <button class="product-card__button" onclick="addToCart(${product.id})">Add to Cart</button>
    `;

    productSection.appendChild(productDiv);
  });
}

function setupSearch(products) {
  const searchBar = document.getElementById('searchBar');
  
  searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
  });
}

function addToCart(productId) {
  fetch(`${apiUrl}/${productId}`)
    .then(res => res.json())
    .then(product => {
      const existingProduct = cart.find(item => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      updateCart();
    });
}

function updateCart() {
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = ''; 
  let totalAmount = 0;

  cart.forEach(item => {
    totalAmount += item.price * item.quantity;
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cart__item');

    cartItemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="cart__item-details">
        <p class="cart__item-title">${item.title}</p>
        <p class="cart__item-price">₹${item.price}</p>
      </div>
      <div class="cart__item-quantity">
        <button onclick="changeQuantity(${item.id}, -1)">-</button>
        <input type="text" value="${item.quantity}" readonly>
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
      </div>
      <div class="cart__item-remove">
        <button class="delete-button" onclick="removeFromCart(${item.id})">Delete</button>
      </div>
    `;

    cartItems.appendChild(cartItemDiv);
  });

  document.getElementById('totalAmount').innerText = `₹${totalAmount}`;
  updateCartVisibility();
}

function changeQuantity(productId, delta) {
  const product = cart.find(item => item.id === productId);
  if (product) {
    product.quantity += delta;
    if (product.quantity <= 0) {
      removeFromCart(productId);
    }
  }
  updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

function updateCartVisibility() {
  const cartSection = document.getElementById('cart');
  const productsSection = document.getElementById('products');

  if (cart.length > 0) {
    cartSection.style.display = 'block';
    productsSection.style.width = '75%'; 
  } else {
    cartSection.style.display = 'none';
    productsSection.style.width = '100%'; 
  }
}
