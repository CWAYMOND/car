// File: server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();  // Add this line to use environment variables

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// POST route for form submission
app.post('/submit-form', (req, res) => {
  const { model, year, mileage, panelReplaced, contact } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'dinochen0418@gmail.com',
    subject: '新的車輛資料',
    text: `
      車型: ${model}
      年份: ${year}
      里程: ${mileage}
      是否有鈑件更換: ${panelReplaced}
      聯絡資訊: ${contact}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Form submitted successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});