    // După 4 secunde, ascundem ecranul de încărcare și animăm pagina principală
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.transition = 'transform 1s ease-in-out';
        loadingScreen.style.transform = 'translateY(-60%)'; // Ridicăm ecranul

        setTimeout(() => {
            loadingScreen.style.display = 'none'; // Ascundem complet după animație
            const mainContent = document.getElementById('main-content');
            mainContent.style.display = 'block'; // Afișăm conținutul
            setTimeout(() => {
                mainContent.style.opacity = 1; // Aplicăm efectul de fade-in
            }, 50); // Mică întârziere pentru tranziție
        }, 800); // Așteptăm ca animația să se termine
    }, 2300); // Setăm durata totală la 3 secunde


document.addEventListener('DOMContentLoaded', () => {
  const containerAnimatie = document.querySelector('.container-animatie');
  const sectiune1 = document.getElementById('sectiune1');
  const sectiune2 = document.getElementById('sectiune2');
  
  function updateRotation() {
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const startPosition = windowHeight * 5; //viewport
    const endPosition = startPosition + windowHeight; 
    
    let progress = (scrollPosition - startPosition) / (endPosition - startPosition);
    progress = Math.max(0, Math.min(1, progress));
    
    const rotation = progress * 180;
    
    sectiune1.style.transform = `rotateX(${rotation}deg)`;
    sectiune2.style.transform = `rotateX(${180 + rotation}deg)`;
    
    if (scrollPosition >= startPosition * 0.8 && scrollPosition <= endPosition * 1.2) {
      containerAnimatie.style.opacity = '1';
      containerAnimatie.style.visibility = 'visible';
    } else {
      containerAnimatie.style.opacity = '0';
      containerAnimatie.style.visibility = 'hidden';
    }
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateRotation);
  });

  updateRotation();
});

/*

// Products data
const products = [
    {
        id: 1,
        name: 'Trandafiri Premium',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800',
        colors: [
            { name: 'Roșu', value: '#dc2626' },
            { name: 'Roz', value: '#ec4899' },
            { name: 'Alb', value: '#f3f4f6' }
        ]
    },
    {
        id: 2,
        name: 'Buchet Lalele',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800',
        colors: [
            { name: 'Roșu', value: '#dc2626' },
            { name: 'Galben', value: '#fbbf24' },
            { name: 'Roz', value: '#ec4899' },
            { name: 'Violet', value: '#7c3aed' }
        ]
    },
    {
        id: 3,
        name: 'Crin Imperial',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1509784073363-4b6a394b4ab3?auto=format&fit=crop&w=800',
        colors: [
            { name: 'Alb', value: '#f3f4f6' },
            { name: 'Roz', value: '#ec4899' }
        ]
    },
    {
        id: 4,
        name: 'Orhidee Elegantă',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1566896546083-321519a7e849?auto=format&fit=crop&w=800',
        colors: [
            { name: 'Violet', value: '#7c3aed' },
            { name: 'Alb', value: '#f3f4f6' },
            { name: 'Roz', value: '#ec4899' }
        ]
    }
];

// Cart class
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateUI();
    }

    addItem(product, color) {
        const existingItem = this.items.find(item => 
            item.id === product.id && item.color.name === color.name
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                color,
                quantity: 1
            });
        }

        this.save();
        this.updateUI();
        this.showNotification(`${product.name} adăugat în coș`);
    }

    removeItem(productId, colorName) {
        this.items = this.items.filter(item => 
            !(item.id === productId && item.color.name === colorName)
        );
        this.save();
        this.updateUI();
    }

    updateQuantity(productId, colorName, newQuantity) {
        const item = this.items.find(item => 
            item.id === productId && item.color.name === colorName
        );

        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId, colorName);
            } else {
                item.quantity = newQuantity;
                this.save();
                this.updateUI();
            }
        }
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateUI() {
        const cartCount = document.getElementById('cartCount');
        cartCount.textContent = this.items.reduce((sum, item) => sum + item.quantity, 0);

        const cartItems = document.getElementById('cartItems');
        cartItems.innerHTML = '';

        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-color">Culoare: ${item.color.name}</div>
                    <div class="quantity-controls">
                        <button class="quantity-button" onclick="cart.updateQuantity(${item.id}, '${item.color.name}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-button" onclick="cart.updateQuantity(${item.id}, '${item.color.name}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    <div>${(item.price * item.quantity).toFixed(2)} RON</div>
                    <button class="remove-item" onclick="cart.removeItem(${item.id}, '${item.color.name}')">Elimină</button>
                </div>
            `;
            cartItems.appendChild(itemElement);
        });

        const cartTotal = document.getElementById('cartTotal');
        cartTotal.textContent = this.getTotal().toFixed(2);
    }
}

// Initialize cart
const cart = new Cart();

// Render products
function renderProducts() {
    const productsContainer = document.getElementById('products');
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        
        const colorOptions = product.colors.map(color => `
            <button
                class="color-option"
                style="background-color: ${color.value}"
                data-color='${JSON.stringify(color)}'
                onclick="selectColor(this, ${product.id})"
            ></button>
        `).join('');

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price} RON</p>
                <div class="color-options" id="colors-${product.id}">
                    ${colorOptions}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Adaugă în coș
                </button>
            </div>
        `;
        
        productsContainer.appendChild(productElement);
    });

    // Select first color for each product
    products.forEach(product => {
        const firstColorButton = document.querySelector(`#colors-${product.id} .color-option`);
        if (firstColorButton) {
            selectColor(firstColorButton, product.id);
        }
    });
}

// Handle color selection
function selectColor(button, productId) {
    const colorButtons = document.querySelectorAll(`#colors-${productId} .color-option`);
    colorButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

// Handle add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const selectedColorButton = document.querySelector(`#colors-${productId} .color-option.selected`);
    const color = JSON.parse(selectedColorButton.dataset.color);
    
    cart.addItem(product, color);
}

// Cart modal controls
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const checkoutButton = document.getElementById('checkoutButton');

cartButton.addEventListener('click', () => {
    cartModal.classList.add('open');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.remove('open');
});

checkoutButton.addEventListener('click', () => {
    if (cart.items.length === 0) {
        alert('Coșul este gol');
        return;
    }
    alert('Procesul de checkout va fi implementat aici');
});

// Initialize the app
renderProducts();

*/