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