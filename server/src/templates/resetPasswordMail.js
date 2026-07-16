const resetPasswordMail = (resetUrl) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Reset Password</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 15px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td align="center"
              style="background:#2563eb;padding:30px;color:#fff;font-size:28px;font-weight:bold;">
              🔒 ShopSphere
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px;">

              <h2 style="margin-top:0;color:#222;">
                Reset Your Password
              </h2>

              <p style="font-size:16px;color:#555;line-height:1.7;">
                We received a request to reset your password.
                Click the button below to create a new password.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:30px 0;">

                    <a href="${resetUrl}"
                      style="
                        background:#2563eb;
                        color:#ffffff;
                        text-decoration:none;
                        padding:14px 35px;
                        border-radius:8px;
                        font-size:16px;
                        font-weight:bold;
                        display:inline-block;
                      ">
                      Reset Password
                    </a>

                  </td>
                </tr>
              </table>

              <p style="color:#666;font-size:15px;line-height:1.7;">
                This password reset link will expire in
                <strong>15 minutes</strong>.
              </p>

              <p style="color:#666;font-size:15px;line-height:1.7;">
                If you didn't request this password reset,
                you can safely ignore this email.
              </p>

              <hr
                style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;" />

           

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center"
              style="background:#f8fafc;padding:25px;color:#888;font-size:13px;">

              © ${new Date().getFullYear()} ShopSphere. All rights reserved.

              <br><br>

              This is an automated email. Please do not reply.

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

export default resetPasswordMail;
