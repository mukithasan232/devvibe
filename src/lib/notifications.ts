import nodemailer from "nodemailer";

// Configuration for Email (Using SMTP/GMail or Resend is recommended)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * High-Fidelity Professional Email Template
 */
export const getEmailTemplate = (orderData: any, type: "customer" | "admin" = "customer") => {
  const isCustomer = type === "customer";
  const title = isCustomer ? "Order Confirmed: Execution Started" : "NEW ORDER DETECTED: ACTION REQUIRED";
  const subTitle = isCustomer ? "Thank you for joining the DevVibe infrastructure." : "A new asset has been reserved in the system.";
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', sans-serif; background-color: #0A0A0B; color: #FFFFFF; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #131415; border: 1px solid #1E2023; border-radius: 24px; overflow: hidden; }
        .header { background: #131415; padding: 40px; text-align: center; border-bottom: 1px solid #1E2023; }
        .logo { width: 120px; margin-bottom: 20px; }
        .content { padding: 40px; line-height: 1.6; }
        .status-badge { display: inline-block; background: #39FF14; color: #0A0A0B; padding: 4px 12px; border-radius: 99px; font-weight: 900; font-size: 10px; text-transform: uppercase; margin-bottom: 20px; }
        .order-id { font-family: monospace; color: #39FF14; font-weight: bold; }
        .item-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #1E2023; }
        .total-box { background: #1E2023; padding: 20px; border-radius: 16px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
        .total-price { font-size: 24px; font-weight: 900; color: #39FF14; }
        .footer { padding: 40px; text-align: center; color: #666; font-size: 12px; }
        .cta-button { display: inline-block; background: #39FF14; color: #0A0A0B; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 30px; text-transform: uppercase; letter-spacing: 1px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://devvibe-mu.vercel.app/images/logo/DevVibe.png" className="logo" />
          <div class="status-badge">${isCustomer ? "Order Processing" : "Payment Pending/Received"}</div>
          <h1 style="margin:0; font-size: 24px;">${title}</h1>
          <p style="color: #666; margin-top: 10px;">${subTitle}</p>
        </div>
        <div class="content">
          <p>Order ID: <span class="order-id">#${orderData.id.slice(-8).toUpperCase()}</span></p>
          <div style="margin-top: 30px;">
            ${orderData.items.map((item: any) => `
              <div class="item-row">
                <span>${item.name} (${item.size}) <br/> <small style="color:#666">Qty: ${item.quantity}</small></span>
                <span>৳${item.price * item.quantity}</span>
              </div>
            `).join('')}
          </div>
          <div class="total-box">
            <span>TOTAL VALUE</span>
            <span class="total-price">৳${orderData.totalAmount}</span>
          </div>
          ${isCustomer ? `
            <p style="margin-top: 30px;">Your package is being compiled at our fulfillment center. You will receive a tracking ID as soon as the dispatch pipe is active.</p>
            <a href="https://devvibe-mu.vercel.app/track?id=${orderData.id}" class="cta-button">Track Status</a>
          ` : `
            <p style="margin-top: 30px;"><strong>Shipping Address:</strong><br/>${orderData.customerName}<br/>${orderData.phone}<br/>${orderData.address}, ${orderData.city}</p>
            <a href="https://devvibe-mu.vercel.app/admin/orders/${orderData.id}" class="cta-button">View in Dashboard</a>
          `}
        </div>
        <div class="footer">
          &copy; 2026 DEVVIBE CLOTHING | COMPILED FOR COMFORT<br/>
          Designed for developers by developers.
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * SMS NOTIFICATION SERVICE
 */
export const sendSMS = async (phone: string, message: string) => {
  try {
    const url = `https://bulksmsbd.net/api/smsapi?api_key=${process.env.SMS_API_KEY}&type=text&number=${phone}&senderid=${process.env.SMS_SENDER_ID}&message=${encodeURIComponent(message)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("SMS Delivery Failed:", error);
    return null;
  }
};

/**
 * EMAIL NOTIFICATION SERVICE
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"DevVibe Intelligence" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error("Email Delivery Failed:", error);
    return null;
  }
};
