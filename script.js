//loading screen
setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.transition = 'transform 1s ease-in-out';
    loadingScreen.style.transform = 'translateY(-60%)'; 

    setTimeout(() => {
        loadingScreen.style.display = 'none'; 
        const mainContent = document.getElementById('main-content');
        mainContent.style.display = 'block'; 
        setTimeout(() => {
            mainContent.style.opacity = 1; 
        }, 50); 
    }, 800); 
}, 2300); 

//cos
const addToCartButtons = document.querySelectorAll('.text-add');
const cartCountElement = document.getElementById('cartCount');
const cartItemsElement = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartModal = document.getElementById('cartModal');
const closeCartButton = document.getElementById('closeCart');
const checkoutButton = document.getElementById('checkoutButton');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const productId = button.getAttribute('data-id');
        const productName = button.getAttribute('data-name');
        const productPrice = parseFloat(button.getAttribute('data-price'));
        const productImage = button.getAttribute('data-image');
        addToCart(productId, productName, productPrice, productImage);
    });
});

function addToCart(productId, productName, productPrice, productImage) {
    const existingProduct = cart.find(product => product.id === productId);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        const product = { id: productId, name: productName, price: productPrice, image: productImage, quantity: 1 };
        cart.push(product);
    }
    updateCartUI();
    saveCart();
}

function updateCartUI() {
    cartCountElement.textContent = cart.length;

    cartItemsElement.innerHTML = '';
    cart.forEach(product => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="cart-item-image">
            <div class="cart-item-details">
                <p class="cart-item-name">${product.name}</p>
                <p class="cart-item-price">${product.price} Lei</p>
                <div class="quantity-controls">
                    <button class="decrease-quantity" data-id="${product.id}">-</button>
                    <span class="quantity">${product.quantity}</span>
                    <button class="increase-quantity" data-id="${product.id}">+</button>
                </div>
            </div>
        `;
        cartItemsElement.appendChild(cartItem);
    });

    const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
    cartTotalElement.textContent = total.toFixed(2);

    const decreaseButtons = document.querySelectorAll('.decrease-quantity');
    const increaseButtons = document.querySelectorAll('.increase-quantity');

    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            updateQuantity(productId, -1);
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            updateQuantity(productId, 1);
        });
    });
}

function updateQuantity(productId, change) {
    const product = cart.find(product => product.id === productId);
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            cart = cart.filter(product => product.id !== productId);
        }
        updateCartUI();
        saveCart();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

closeCartButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

document.getElementById('cartButton').addEventListener('click', () => {
    cartModal.style.display = 'block';
});

checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Coșul este gol!');
    } else {
        alert('Comanda a fost finalizată!');
        cart = [];
        updateCartUI();
        saveCart();
        cartModal.style.display = 'none';
    }
});

updateCartUI();

//meniu mobil
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const overlay = document.getElementById("overlay");

    function toggleMenu() {
        mobileMenu.classList.toggle("open");
        overlay.classList.toggle("active");
    }

    menuToggle.addEventListener("click", toggleMenu);

    overlay.addEventListener("click", toggleMenu);

    document.querySelectorAll(".mobile-menu a").forEach(link => {
        link.addEventListener("click", toggleMenu);
    });
});

//disclaimer
function closeAlert() {
    document.getElementById("alertBox").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("alertBox").style.display = "none";
    }, 500);
}

setTimeout(() => {
    closeAlert();
}, 10000);

//animatie end page
const slides = document.querySelectorAll('.slide');
const contents = document.querySelectorAll('.slide-content');
const triggers = document.querySelectorAll('.trigger');

triggers.forEach((trigger, index) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          slides[index].classList.add('visible');
          contents[index].classList.add('visible');
        } else {
          slides[index].classList.remove('visible');
          contents[index].classList.remove('visible');
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(trigger);
});