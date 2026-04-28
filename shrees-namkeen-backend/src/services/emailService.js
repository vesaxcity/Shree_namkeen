const nodemailer = require('nodemailer');
const { email: emailConfig } = require('../config/config');

const transporter = nodemailer.createTransport({
  host:   emailConfig.host,
  port:   emailConfig.port,
  secure: emailConfig.port === 465,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});

/**
 * Send order confirmation email to the customer
 * @param {object} order - Full order object with items, address, user
 */
const sendOrderConfirmation = async (order) => {
  if (!emailConfig.user || !emailConfig.pass) {
    console.warn('[Email] Skipping — email credentials not configured.');
    return;
  }

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0e8d0">
          ${item.product.name} (${item.variant.weight})
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0e8d0;text-align:center">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0e8d0;text-align:right">₹${item.total.toFixed(2)}</td>
      </tr>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family:'Segoe UI',Arial,sans-serif;background:#faf6f0;margin:0;padding:20px">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#d4a017,#8b4513);padding:32px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:26px;letter-spacing:1px">Shree's Namkeen</h1>
          <p style="color:rgba(255,255,255,0.85);margin:6px 0 0">Order Confirmed! 🎉</p>
        </div>

        <!-- Body -->
        <div style="padding:32px">
          <p style="color:#333;font-size:16px">Hello <strong>${order.user.name}</strong>,</p>
          <p style="color:#555">Thank you for your order! We've received it and will start preparing your namkeen shortly.</p>

          <!-- Order Info -->
          <div style="background:#faf6f0;border-radius:8px;padding:16px;margin:20px 0">
            <p style="margin:4px 0;color:#555">📦 Order Number: <strong style="color:#8b4513">${order.orderNumber}</strong></p>
            <p style="margin:4px 0;color:#555">💳 Payment: <strong>${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</strong></p>
            ${order.estimatedDelivery ? `<p style="margin:4px 0;color:#555">🚚 Expected Delivery: <strong>${new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}</strong></p>` : ''}
          </div>

          <!-- Items Table -->
          <table style="width:100%;border-collapse:collapse;margin:20px 0">
            <thead>
              <tr style="background:#f0e8d0">
                <th style="padding:10px 12px;text-align:left;color:#8b4513">Item</th>
                <th style="padding:10px 12px;text-align:center;color:#8b4513">Qty</th>
                <th style="padding:10px 12px;text-align:right;color:#8b4513">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <!-- Totals -->
          <div style="border-top:2px solid #f0e8d0;padding-top:16px;text-align:right">
            <p style="margin:4px 0;color:#555">Subtotal: ₹${order.subtotal.toFixed(2)}</p>
            <p style="margin:4px 0;color:#555">Shipping: ${order.shippingCharge === 0 ? '<span style="color:green">FREE</span>' : `₹${order.shippingCharge.toFixed(2)}`}</p>
            <p style="margin:8px 0 0;font-size:18px;font-weight:bold;color:#8b4513">Total: ₹${order.total.toFixed(2)}</p>
          </div>

          <!-- Delivery Address -->
          <div style="margin-top:24px;padding:16px;border:1px solid #f0e8d0;border-radius:8px">
            <p style="margin:0 0 8px;font-weight:bold;color:#333">📍 Delivery Address</p>
            <p style="margin:2px 0;color:#555">${order.address.name} · ${order.address.phone}</p>
            <p style="margin:2px 0;color:#555">${order.address.line1}${order.address.line2 ? ', ' + order.address.line2 : ''}</p>
            <p style="margin:2px 0;color:#555">${order.address.city}, ${order.address.state} — ${order.address.pincode}</p>
          </div>

          <p style="margin-top:24px;color:#555">If you have any questions, reply to this email or contact us. We're always happy to help!</p>
          <p style="color:#555">With love & spice,<br/><strong>Team Shree's Namkeen</strong></p>
        </div>

        <!-- Footer -->
        <div style="background:#f0e8d0;padding:16px;text-align:center">
          <p style="margin:0;color:#8b4513;font-size:13px">© ${new Date().getFullYear()} Shree's Namkeen. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: emailConfig.from,
    to:   order.user.email,
    subject: `Order Confirmed — ${order.orderNumber} | Shree's Namkeen`,
    html,
  });

  console.log(`[Email] Confirmation sent to ${order.user.email} for order ${order.orderNumber}`);
};

module.exports = { sendOrderConfirmation };
