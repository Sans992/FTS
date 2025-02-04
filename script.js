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

// Cart class
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateUI();
    }

    addItem(productId, color) {
        const product = {
            id: productId,
            name: document.querySelector(`#colors-${productId}`).closest('.product-card').querySelector('.product-name').textContent,
            price: parseFloat(document.querySelector(`#colors-${productId}`).closest('.product-card').querySelector('.product-price').textContent),
            image: document.querySelector(`#colors-${productId}`).closest('.product-card').querySelector('.product-image').src
        };

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

// Handle color selection
function selectColor(button, productId) {
    const colorButtons = document.querySelectorAll(`#colors-${productId} .color-option`);
    colorButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

// Handle add to cart
function addToCart(productId) {
    const selectedColorButton = document.querySelector(`#colors-${productId} .color-option.selected`);
    if (!selectedColorButton) {
        const firstColorButton = document.querySelector(`#colors-${productId} .color-option`);
        selectColor(firstColorButton, productId);
    }
    const color = JSON.parse(selectedColorButton.dataset.color);
    cart.addItem(productId, color);
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

// Select first color for each product on page load
document.addEventListener('DOMContentLoaded', () => {
    const productIds = [1, 2, 3, 4];
    productIds.forEach(id => {
        const firstColorButton = document.querySelector(`#colors-${id} .color-option`);
        if (firstColorButton) {
            selectColor(firstColorButton, id);
        }
    });
});