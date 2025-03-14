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

document.addEventListener('DOMContentLoaded', function() {

    const orderNumber = 'NR-' + Math.floor(Math.random() * 10000);
    document.getElementById('orderNumber').textContent = orderNumber;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItemsContainer = document.getElementById('orderItems');
    const orderTotalElement = document.getElementById('orderTotal');
    
    let totalPrice = 0;
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p>Nu există produse în coș. <a href="../index.html#produs">Adăugați produse</a></p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            const orderItemDiv = document.createElement('div');
            orderItemDiv.className = 'order-item';
            orderItemDiv.innerHTML = `
                <div>${item.name} x ${item.quantity}</div>
                <div>${itemTotal.toFixed(2)} Lei</div>
            `;
            orderItemsContainer.appendChild(orderItemDiv);
        });
    }
    
    orderTotalElement.textContent = totalPrice.toFixed(2) + ' Lei';
    
    const checkoutForm = document.getElementById('checkoutForm');
    const responseMessage = document.getElementById('responseMessage');
    
    checkoutForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const customerName = document.getElementById('customerName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        
        if (!phoneNumber) {
            responseMessage.textContent = 'Vă rugăm să introduceți numărul de telefon.';
            responseMessage.className = 'message error';
            responseMessage.style.display = 'block';
            return;
        }
        
        try {
            const response = await fetch('/api/submit-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderNumber,
                    customerName,
                    phoneNumber,
                    email,
                    address,
                    products: cart,
                    totalPrice: totalPrice.toFixed(2)
                })
            });
            
            const result = await response.json();
            
            if (result.success) {

                localStorage.removeItem('cart');
                
                responseMessage.textContent = result.message;
                responseMessage.className = 'message success';
                responseMessage.style.display = 'block';
                
                checkoutForm.reset();
                const formInputs = checkoutForm.querySelectorAll('input, textarea, button');
                formInputs.forEach(input => {
                    input.disabled = true;
                });
                
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 3000);
            } else {
                responseMessage.textContent = result.message;
                responseMessage.className = 'message error';
                responseMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            responseMessage.textContent = 'A apărut o eroare. Vă rugăm să încercați din nou.';
            responseMessage.className = 'message error';
            responseMessage.style.display = 'block';
        }
    });
});