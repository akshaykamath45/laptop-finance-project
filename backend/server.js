const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 9009;

app.use(cors());
app.use(express.json());

app.post("/send-signup-email", async (req, res) => {
  const {
    customerName, dob, phone, email, panNumber,
    aadharNumber, employer, location
  } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `🎉 Welcome, ${customerName}! Registration Received 🎉`,
    text: `Hi ${customerName},\nThank you for registering with us. Here is a summary of your details:\n- Name: ${customerName}\n- DOB: ${dob}\n- Phone: ${phone}\n- Email: ${email}\n- PAN: ${panNumber}\n- Aadhar: ${aadharNumber}\n- Employer: ${employer.employerName} (${employer.employerId})\n- Location: ${location.city}, ${location.state} (${location.locationId})\nWe will contact you shortly regarding the next steps.\nRegards, Laptop Finance Team`,
    html: `
  <div style="max-width:520px;margin:32px auto;padding:0;background:#f4f7fb;font-family:sans-serif;">
    <div style="background:#fff;border-radius:18px;box-shadow:0 4px 24px #3b82f61a;padding:32px 28px 24px 28px;margin:0;">
      <div style="text-align:center;font-size:2.1rem;margin-bottom:12px;">
        🎉 <b>Welcome to LaptopFinance!</b> 🎉
      </div>
      <p style="font-size:1.13rem;text-align:center;margin-bottom:18px;">
        Hi <b>${customerName}</b>,<br>
        <span style="font-size:1.05rem;">Thank you for <b>registering</b> with us! Here’s a summary of your details:</span>
      </p>
      <div style="background:#f8fafc;border-radius:12px;padding:18px 20px 14px 20px;margin:18px 0 22px 0;border:1px solid #e0e7ef;">
        <ul style="list-style:none;padding:0;margin:0;font-size:1.04rem;">
          <li>👤 <b>Name:</b> ${customerName}</li>
          <li>🎂 <b>DOB:</b> ${dob}</li>
          <li>📞 <b>Phone:</b> ${phone}</li>
          <li>✉️ <b>Email:</b> ${email}</li>
          <li>🪪 <b>PAN:</b> ${panNumber}</li>
          <li>🆔 <b>Aadhar:</b> ${aadharNumber}</li>
          <li>🏢 <b>Employer:</b> ${employer.employerName} (${employer.employerId})</li>
          <li>📍 <b>Location:</b> ${location.city}, ${location.state} (${location.locationId})</li>
        </ul>
      </div>
      <div style="margin: 28px 0; text-align: center;">
        <a href="http://localhost:9090" style="background: linear-gradient(135deg, #718de9 0%, #3b82f6 100%); color: #fff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 1.08rem; box-shadow: 0 2px 8px #718de933;">Visit LaptopFinance</a>
      </div>
      <div style="margin: 24px 0;">
        <h3 style="color: #718de9; font-size: 1.15rem; margin-bottom: 8px;">✨ Why Choose Us?</h3>
        <ul style="color: #334155; font-size: 1rem; line-height: 1.6; margin-left: 18px;">
          <li>💸 Flexible EMI plans (3-24 months)</li>
          <li>⚡ Instant eligibility check & approval</li>
          <li>🆓 Zero down payment options</li>
          <li>💻 Premium brands: Apple, Dell, HP, Lenovo, ASUS & more</li>
          <li>🚚 Fast doorstep delivery</li>
          <li>🤝 Dedicated support team</li>
        </ul>
      </div>
      <p style="color: #64748b; font-size: 1.01rem;">We will contact you shortly regarding the next steps.<br><br>Regards,<br><b>Laptop Finance Team</b></p>
      <hr style="margin: 32px 0;">
      <div style="text-align: center; color: #94a3b8; font-size: 0.95em;">
        &copy; ${new Date().getFullYear()} LaptopFinance. All rights reserved.
      </div>
    </div>
  </div>
  `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Signup email sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send signup email" });
  }
});

app.post("/send-login-email", async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Login Notification",
    html: `
    <div style="font-family: 'Inter', Arial, sans-serif; background: #f5f7fa; padding: 32px;">
      <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 16px; box-shadow: 0 2px 16px #718de933; padding: 32px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 2.2rem; color: #718de9; font-weight: bold;">
            <i style="color: #718de9; margin-right: 8px;" class="fas fa-laptop"></i>LaptopFinance
          </span>
        </div>
        <h2 style="color: #1e3a8a; margin-bottom: 12px;">Login Alert</h2>
        <p style="color: #334155; font-size: 1.08rem;">
          A login attempt was made to your account with this email (<b>${email}</b>) on <b>${new Date().toLocaleString()}</b>.
        </p>
        <div style="margin: 24px 0; text-align: center;">
          <i class="fas fa-shield-alt" style="font-size: 2.5rem; color: #06b6d4; margin-bottom: 8px;"></i>
          <p style="color: #06b6d4; font-weight: 600; font-size: 1.08rem;">Your account security is our top priority.</p>
        </div>
        <p style="color: #64748b; font-size: 1.01rem;">
          If this was you, you can safely ignore this email.<br>
          If not, please <a href="mailto:support@laptopfinance.com" style="color: #718de9; text-decoration: underline;">contact our support team</a> immediately.
        </p>
        <hr style="margin: 32px 0;">
        <div style="text-align: center; color: #94a3b8; font-size: 0.95em;">
          &copy; ${new Date().getFullYear()} LaptopFinance. All rights reserved.
        </div>
      </div>
    </div>
    `
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Login email sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send login email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
