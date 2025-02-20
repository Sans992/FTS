const nodemailer = require('nodemailer');

// Crează un transportor pentru a trimite emailuri (folosind Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'email_tu@gmail.com',  // adresa ta de email Gmail
    pass: 'parola_ta'  // parola ta pentru Gmail sau un App Password (dacă ai activat 2FA)
  }
});

// Datele formularului
const formData = {
  nume: 'John Doe',
  email: 'johndoe@example.com',
  mesaj: 'Acesta este un mesaj test'
};

// Configurarea emailului
const mailOptions = {
  from: 'email_tu@gmail.com',
  to: 'destinatar@example.com',  // adresa la care vrei să trimiti emailul
  subject: 'Mesaj din formular',
  text: `Nume: ${formData.nume}\nEmail: ${formData.email}\nMesaj: ${formData.mesaj}`
};

// Trimiterea emailului
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Mesaj trimis: ' + info.response);
});
