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
        addToCart(productId);
    });
});

function addToCart(productId) {
    // Verifică dacă produsul există deja în coș
    const existingProduct = cart.find(product => product.id === productId);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        const product = { id: productId, name: `Produs ${productId}`, price: 170, quantity: 1 }; // Exemplu de produs
        cart.push(product);
    }
    updateCartUI();
    saveCart();
}

function updateCartUI() {
    // Actualizează numărul de produse din coș
    cartCountElement.textContent = cart.length;

    // Actualizează lista de produse din coș
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

    // Actualizează totalul coșului
    const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
    cartTotalElement.textContent = total.toFixed(2);

    // Adaugă evenimente pentru butoanele de modificare a cantității
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

// Gestionarea închiderii coșului
closeCartButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Gestionarea deschiderii coșului
document.getElementById('cartButton').addEventListener('click', () => {
    cartModal.style.display = 'block';
});

// Gestionarea finalizării comenzii
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

// Încarcă coșul din localStorage la încărcarea paginii
updateCartUI();

let currentTranslate = -100;
let targetTranslate = -100;
const smoothFactor = 0.03;  // Mai mic = mișcare mai lină
const scrollFactor = 2.5;   // Crește distanța necesară pentru animație

let ticking = false;

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function updateOverlay() {
    currentTranslate = lerp(currentTranslate, targetTranslate, smoothFactor);
    document.querySelector('.image-overlay').style.transform = `translateX(${currentTranslate}%)`;

    // Continuă animația doar dacă diferența este vizibilă
    if (Math.abs(currentTranslate - targetTranslate) > 0.1) {
        requestAnimationFrame(updateOverlay);
    } else {
        ticking = false;
    }
}

document.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const triggerHeight = 4500;

    // Only start animation after reaching trigger height
    if (scrollPosition >= triggerHeight) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const effectiveScroll = scrollPosition - triggerHeight;
        const scrollPercentage = effectiveScroll / (maxScroll - triggerHeight);

        targetTranslate = -100 + (scrollPercentage * 100 * scrollFactor);
        targetTranslate = Math.min(targetTranslate, 0);

        if (!ticking) {
            requestAnimationFrame(updateOverlay);
            ticking = true;
        }
    } else {
        // Reset position when above trigger height
        targetTranslate = -100;
        if (!ticking) {
            requestAnimationFrame(updateOverlay);
            ticking = true;
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileNav = document.getElementById('mobileNav');

    if (!hamburgerMenu || !mobileNav) {
        console.error("Elementele meniului nu au fost găsite!");
        return;
    }

    // Deschide/închide meniul la click
    hamburgerMenu.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });

    // Închide meniul dacă utilizatorul dă click în afara lui
    document.addEventListener('click', (event) => {
        if (!mobileNav.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            mobileNav.classList.remove('active');
        }
    });
});
