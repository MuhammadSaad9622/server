require('dotenv').config();
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const upload = multer();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/Contact', upload.any(), async (req, res) => {
  try {
    const formData = req.body;
  

    const mailOptions = {
      from: `"Contact US" <${process.env.EMAIL_USER}>`,
      to: 'saadsaadfast34@gmail.com',
      subject: 'Contact',
      html: generateEmailHtml(formData),
      
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'submitted successfully' });
  } catch (error) {
    console.error('Error submitting case:', error);
    res.status(500).json({ error: 'Error submitting ' });
  }
});

function generateEmailHtml(formData) {
  return `
    <h1>New Case Submission</h1>
    ${Object.entries(formData)
      .map(
        ([key, value]) => `
      <p><strong>${key}:</strong> ${value}</p>
    `
      )
      .join('')}
   
  `;
}

// Added code: Basic endpoint and server listen
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// If needed for serverless deployments (e.g., Vercel), export the Express app
module.exports = app;
