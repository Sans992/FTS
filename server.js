const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const PORT = process.env.PORT || 3000;
require('dotenv').config(); // Load environment variables

const app = express(); // Create an instance of the Express application

// Middleware
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Route for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for the cart page
app.get('/pagini/cos.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'pagini/cos.html'));
});

// API endpoint for order submission
app.post('/api/submit-order', async (req, res) => {
  try {
    const {
      orderNumber,
      customerName,
      phoneNumber,
      email,
      address,
      products,
      totalPrice
    } = req.body;

    // Validate required fields
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Numărul de telefon este obligatoriu.'
      });
    }

    // Ensure products is an array
    if (!Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: 'Produsele trebuie să fie in cos.'
      });
    }

    // Create email content
    let itemsHtml = '';
    products.forEach(item => {
      itemsHtml += `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.price} Lei</td>
          <td>${(item.price * item.quantity).toFixed(2)} Lei</td>
        </tr>
      `;
    });

    const emailHtml = `
      <h2>Comandă nouă! #${orderNumber}</h2>
      <h3>Detalii client:</h3>
      <p><strong>Nume:</strong> ${customerName || 'Nespecificat'}</p>
      <p><strong>Telefon:</strong> ${phoneNumber}</p>
      <p><strong>Email:</strong> ${email || 'Nespecificat'}</p>
      <p><strong>Adresa:</strong> ${address || 'Nespecificat'}</p>
      
      <h3>Produse comandate:</h3>
      <table border="1" cellpadding="5" style="border-collapse: collapse;">
        <tr>
          <th>Produs</th>
          <th>Cantitate</th>
          <th>Preț unitar</th>
          <th>Total</th>
        </tr>
        ${itemsHtml}
        <tr>
          <td colspan="3" style="text-align: right;"><strong>Total comandă:</strong></td>
          <td><strong>${totalPrice} Lei</strong></td>
        </tr>
      </table>
    `;

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "danielpc.org@gmail.com", 
        pass: "xgmz piwh zjkz crpy", 
      },
    });
    
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Use environment variables
      to: 'danzcrackz@gmail.com', // Where shop orders are sent
      subject: `Comandă nouă #${orderNumber} - Luci Boutique`,
      html: emailHtml
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation to customer if they provided an email
    if (email) {
      const customerMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Confirmare comandă #${orderNumber} - Luci Boutique`,
        html: `
          <h2>Vă mulțumim pentru comandă, ${customerName || 'client drag'}!</h2>
          <p>Am primit comanda dumneavoastră #${orderNumber} și o vom procesa în curând.</p>
          <p>Vă vom contacta telefonic la ${phoneNumber} pentru confirmare.</p>
          
          <h3>Numarul comenzii:</h3>
          <table border="1" cellpadding="5" style="border-collapse: collapse;">
            <tr>
              <th>Produs</th>
              <th>Cantitate</th>
              <th>Preț unitar</th>
              <th>Total</th>
            </tr>
            ${itemsHtml}
            <tr>
              <td colspan="3" style="text-align: right;"><strong>Total comandă:</strong></td>
              <td><strong>${totalPrice} Lei</strong></td>
            </tr>
          </table>
          
          <p>Cu drag,<br>Echipa Luci Boutique</p>
        `
      };

      await transporter.sendMail(customerMailOptions);
      console.log('Customer confirmation email sent successfully');
    }

    res.json({
      success: true,
      message: 'Comanda a fost trimisă cu succes! Vă mulțumim!'
    });
  } catch (error) {
    console.error('Error submitting order:', error);
    res.status(500).json({
      success: false,
      message: 'A apărut o eroare la procesarea comenzii. Vă rugăm să încercați din nou.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open your browser and navigate to http://localhost:${PORT}`);
});