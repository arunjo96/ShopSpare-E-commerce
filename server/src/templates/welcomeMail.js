const welcomeEmail = (name, loginUrl) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Welcome to ShopSphere</title>
</head>

<body style="margin:0;padding:40px 0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,.08);">

<!-- Header -->

<tr>
<td
style="background:linear-gradient(135deg,#2563eb,#4f46e5);padding:35px;text-align:center;color:white;">

<h1 style="margin:0;font-size:32px;">
🛍 ShopSphere
</h1>

<p style="margin-top:10px;font-size:16px;opacity:.9;">
Your Shopping Destination
</p>

</td>
</tr>

<!-- Body -->

<tr>
<td style="padding:45px;">

<h2 style="margin-top:0;color:#111827;">
Hi ${name}, 👋
</h2>

<p style="font-size:16px;color:#4b5563;line-height:28px;">
Welcome to <strong>ShopSphere</strong>!

Your account has been created successfully.

We're excited to have you join thousands of happy shoppers.
</p>

<p style="font-size:16px;color:#4b5563;line-height:28px;">
Explore trending products, amazing deals, secure payments and fast delivery.
</p>

<table width="100%">
<tr>
<td align="center" style="padding:35px 0;">

<a href="${loginUrl}"
style="
background:#2563eb;
color:white;
padding:15px 40px;
border-radius:8px;
text-decoration:none;
font-size:16px;
font-weight:bold;
display:inline-block;
">
Start Shopping
</a>

</td>
</tr>
</table>

<table width="100%" cellpadding="15">

<tr>

<td align="center"
style="background:#f9fafb;border-radius:10px;">

<h3 style="margin:0;color:#111827;">
🚚 Fast Delivery
</h3>

</td>

<td align="center"
style="background:#f9fafb;border-radius:10px;">

<h3 style="margin:0;color:#111827;">
🔒 Secure Payment
</h3>

</td>

<td align="center"
style="background:#f9fafb;border-radius:10px;">

<h3 style="margin:0;color:#111827;">
🎁 Best Deals
</h3>

</td>

</tr>

</table>

<p style="margin-top:40px;color:#6b7280;line-height:28px;">
Thank you for choosing ShopSphere.

We can't wait to serve you.

Happy Shopping ❤️
</p>

</td>
</tr>

<!-- Footer -->

<tr>
<td
style="background:#111827;color:#d1d5db;text-align:center;padding:30px;">

<p style="margin:0;font-size:14px;">
© ${new Date().getFullYear()} ShopSphere.
All Rights Reserved.
</p>

<p style="margin-top:10px;font-size:13px;color:#9ca3af;">
This is an automated email. Please do not reply.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

export default welcomeEmail;
