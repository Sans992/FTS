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

document.addEventListener('DOMContentLoaded', () => {
    const containerAnimatie = document.querySelector('.container-animatie');
    const sectiune1 = document.getElementById('sectiune1');
    const sectiune2 = document.getElementById('sectiune2');

    function updateRotation() {
        const scrollPosition = window.pageYOffset;
        const startPosition = 2500; // pozitia de unde se porneste
        const endPosition = startPosition + 3250; //sfarsit

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
            addToCart(productId);
        });
    });

    function addToCart(productId) {

        const existingProduct = cart.find(product => product.id === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            const product = { id: productId, name: `Produs ${productId}`, price: 170, quantity: 1 }; 
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
                <img src="poze/poza${product.id}.webp" alt="${product.name}" class="cart-item-image">
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

        // controleaza cantitatea
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

    // controleaza cosul
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
});