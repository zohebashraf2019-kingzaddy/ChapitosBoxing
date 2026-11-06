// Vercel serverless function: emails contact-form messages to the gym.
// Set these in Vercel → Project → Settings → Environment Variables:
//   GMAIL_USER          the Gmail address that sends the email
//   GMAIL_APP_PASSWORD  a Google "App password" for that account (not the normal password)
//   CONTACT_TO          where messages go (defaults to GMAIL_USER)
const nodemailer = require("nodemailer");

const clean = (v, max) => String(v || "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  let body = req.body || {};
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }

  if (body.company) return res.status(200).json({ ok: true }); // honeypot: bots fill it

  const name = clean(body.name, 100);
  const email = clean(body.email, 150);
  const phone = clean(body.phone, 40);
  const interest = clean(body.interest, 80) || "General question";
  const message = String(body.message || "").trim().slice(0, 4000);

  if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "Name, a valid email and a message are required." });
  }
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return res.status(500).json({ error: "Email is not configured." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `"Chapito's Boxing Website" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_TO || process.env.GMAIL_USER,
      replyTo: `"${name}" <${email}>`,
      subject: `New inquiry: ${interest} (${name})`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\nAsking about: ${interest}\n\n${message}`,
      html: `<h2>New website inquiry</h2>
        <p><b>Name:</b> ${escapeHtml(name)}<br><b>Email:</b> ${escapeHtml(email)}<br>
        <b>Phone:</b> ${escapeHtml(phone || "-")}<br><b>Asking about:</b> ${escapeHtml(interest)}</p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact mail failed", err);
    return res.status(500).json({ error: "Could not send message." });
  }
};
