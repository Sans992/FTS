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

        window.location.href = "pagini/cos.html";
    }
});

updateCartUI();

//meniu mobil
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const overlay = document.getElementById('overlay');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        overlay.classList.add('active');
    });

    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        overlay.classList.remove('active');
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
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const triggers = document.querySelectorAll('.trigger');
    let visibleSlides = new Set();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const index = parseInt(entry.target.dataset.index);
            
            if (entry.isIntersecting) {

                setTimeout(() => {
                    visibleSlides.add(index);
                    updateSlides();
                }, 50);
            } else {
                const maxVisible = Math.max(...visibleSlides);
                if (index === maxVisible) {
                    setTimeout(() => {
                        visibleSlides.delete(index);
                        updateSlides();
                    }, 50);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-10% 0px -10% 0px' 
    });

    function updateSlides() {
        slides.forEach((slide, index) => {
            if (visibleSlides.has(index)) {
                slide.classList.add('visible');
                slide.style.zIndex = 10 + index;
            } else {
                slide.classList.remove('visible');

                setTimeout(() => {
                    if (!slide.classList.contains('visible')) {
                        slide.style.zIndex = 0;
                    }
                }, 1500);
            }
        });
    }

    triggers.forEach(trigger => observer.observe(trigger));
});

let sortAscending = false;

function sortFlowers() {
    const mainGrid = document.querySelector('.main-grid');
    const cardContainers = Array.from(mainGrid.querySelectorAll('.card-container'));

    cardContainers.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.text-carte3').textContent);
        const priceB = parseFloat(b.querySelector('.text-carte3').textContent);

        return sortAscending ? priceA - priceB : priceB - priceA;
    });

    cardContainers.forEach(container => mainGrid.appendChild(container));

    sortAscending = !sortAscending;
    const sortIcon = document.getElementById('sortIcon');
    sortIcon.src = sortAscending ? 'poze/sortup.png' : 'poze/sortdown.png';
    sortIcon.alt = sortAscending ? 'Sortare crescătoare' : 'Sortare descrescătoare';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sortContainer').addEventListener('click', sortFlowers);
});
