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
    const sectiune2 = document.getElementById('sectiune2');

    function updatePosition() {
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const startPosition = windowHeight * 0.5; 
        const endPosition = startPosition + windowHeight;

        let progress = (scrollPosition - startPosition) / (endPosition - startPosition);
        progress = Math.max(0, Math.min(1, progress));

        const leftPosition = progress * 100 - 100; // De la -100% la 0%

        sectiune2.style.left = `${leftPosition}%`;
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updatePosition);
    });
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
        const productName = button.getAttribute('data-name');
        const productPrice = parseFloat(button.getAttribute('data-price'));
        const productImage = button.getAttribute('data-image');
        addToCart(productId, productName, productPrice, productImage);
    });
});

function addToCart(productId, productName, productPrice, productImage) {
    // Verifică dacă produsul există deja în coș
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

    // Actualizează lista de produse din coș
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

document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileNav = document.getElementById('mobileNav');

    hamburgerMenu.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
    });

    document.addEventListener('click', function(event) {
        if (!mobileNav.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            mobileNav.classList.remove('active');
        }
    });
});

let currentTranslate = -100;
let targetTranslate = -100;
let currentTranslate2 = 100;
let targetTranslate2 = 100;
let currentTranslate3 = -100;
let targetTranslate3 = -100;
let currentTranslate4 = 100;
let targetTranslate4 = 100;
const smoothFactor = 0.05;
const scrollFactor = 1.2;

let ticking = false;

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function updateOverlay() {
    currentTranslate = lerp(currentTranslate, targetTranslate, smoothFactor);
    currentTranslate2 = lerp(currentTranslate2, targetTranslate2, smoothFactor);
    currentTranslate3 = lerp(currentTranslate3, targetTranslate3, smoothFactor);
    currentTranslate4 = lerp(currentTranslate4, targetTranslate4, smoothFactor);
    
    document.querySelector('.image-overlay').style.transform = `translateX(${currentTranslate}%)`;
    document.querySelector('.image-overlay-2').style.transform = `translateX(${currentTranslate2}%)`;
    document.querySelector('.image-overlay-3').style.transform = `translateX(${currentTranslate3}%)`;
    document.querySelector('.image-overlay-4').style.transform = `translateX(${currentTranslate4}%)`;

    if (
        Math.abs(currentTranslate - targetTranslate) > 0.1 || 
        Math.abs(currentTranslate2 - targetTranslate2) > 0.1 ||
        Math.abs(currentTranslate3 - targetTranslate3) > 0.1 ||
        Math.abs(currentTranslate4 - targetTranslate4) > 0.1
    ) {
        requestAnimationFrame(updateOverlay);
    } else {
        ticking = false;
    }
}

document.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const triggerHeight = 4500; 
    const animationDistance = 1500;
    const delayDistance = 1500; 
    
    const triggerHeight2 = triggerHeight + animationDistance + delayDistance;
    const triggerHeight3 = triggerHeight2 + animationDistance + delayDistance;
    const triggerHeight4 = triggerHeight3 + animationDistance + delayDistance;

    if (scrollPosition >= triggerHeight) {
        const firstAnimationProgress = Math.min((scrollPosition - triggerHeight) / animationDistance, 1);
        targetTranslate = -100 + (firstAnimationProgress * 100);
        targetTranslate = Math.min(targetTranslate, 0);

        if (scrollPosition >= triggerHeight2) {
            const secondAnimationProgress = Math.min((scrollPosition - triggerHeight2) / animationDistance, 1);
            targetTranslate2 = 100 - (secondAnimationProgress * 100);
            targetTranslate2 = Math.max(targetTranslate2, 0);

            if (scrollPosition >= triggerHeight3) {
                const thirdAnimationProgress = Math.min((scrollPosition - triggerHeight3) / animationDistance, 1);
                targetTranslate3 = -100 + (thirdAnimationProgress * 100);
                targetTranslate3 = Math.min(targetTranslate3, 0);

                if (scrollPosition >= triggerHeight4) {
                    const fourthAnimationProgress = Math.min((scrollPosition - triggerHeight4) / animationDistance, 1);
                    targetTranslate4 = 100 - (fourthAnimationProgress * 100);
                    targetTranslate4 = Math.max(targetTranslate4, 0);
                }
            }
        }

        if (!ticking) {
            requestAnimationFrame(updateOverlay);
            ticking = true;
        }
    } else {
        targetTranslate = -100;
        targetTranslate2 = 100;
        targetTranslate3 = -100;
        targetTranslate4 = 100;
        if (!ticking) {
            requestAnimationFrame(updateOverlay);
            ticking = true;
        }
    }
});