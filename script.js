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

class Cart {
    constructor() {
        this.items = [];
    }

    addItem(productId, color) {
        const existingItem = this.items.find(item => item.id === productId && item.color.name === color);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const newItem = {
                id: productId,
                name: `Product ${productId}`,
                color: { name: color },
                quantity: 1,
                price: 100 // Example price, replace with actual price
            };
            this.items.push(newItem);
        }
        this.updateUI();
    }

    updateQuantity(productId, color, quantity) {
        const item = this.items.find(item => item.id === productId && item.color.name === color);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId, color);
            } else {
                this.updateUI();
            }
        }
    }

    removeItem(productId, color) {
        this.items = this.items.filter(item => !(item.id === productId && item.color.name === color));
        this.updateUI();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    updateUI() {
        const cartItems = document.getElementById('cartItems');
        cartItems.innerHTML = '';

        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">Price: ${item.price} MDL</div>
                    <div class="quantity-controls">
                        <button class="quantity-button" onclick="cart.updateQuantity('${item.id}', '${item.color.name}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-button" onclick="cart.updateQuantity('${item.id}', '${item.color.name}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="cart.removeItem('${item.id}', '${item.color.name}')">Elimină</button>
            `;
            cartItems.appendChild(itemElement);
        });

        const cartTotal = document.getElementById('cartTotal');
        cartTotal.textContent = this.getTotal().toFixed(2);
    }
}

// Initialize cart
const cart = new Cart();


// Attach event listeners to "Adaugă în coș" buttons
document.querySelectorAll('.text-add').forEach(button => {
    button.addEventListener('click', event => {
        event.preventDefault();
        const productId = parseInt(button.getAttribute('data-id'));
        const selectedColorButton = document.querySelector(`#colors-${productId} .color-option.selected`);
        if (selectedColorButton) {
            const color = selectedColorButton.textContent;
            cart.addItem(productId, color);

        }
    });
});

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