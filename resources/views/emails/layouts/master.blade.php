<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width,initial-scale=1">
       <meta name="x-apple-disable-message-reformatting">
       <title>XpertBid Notification</title>
       <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
       <style>
              table,
              td,
              div,
              h1,
              p {
                     font-family: Arial, sans-serif;
              }

              body {
                     margin: 0;
                     padding: 0;
                     background-color: #f6f9fc;
              }

              .btn-primary {
                     display: inline-block;
                     padding: 12px 24px;
                     background-color: #5356FB;
                     color: #ffffff !important;
                     text-decoration: none;
                     border-radius: 4px;
                     font-weight: bold;
                     font-size: 16px;
                     margin: 20px 0;
                     text-align: center;
              }

              .info-table {
                     width: 100%;
                     border-collapse: collapse;
                     margin: 20px 0;
              }

              .info-table td,
              .info-table th {
                     padding: 10px;
                     border-bottom: 1px solid #eeeeee;
              }

              .info-table th {
                     text-align: left;
                     color: #5356FB;
                     width: 35%;
              }

              .info-table td {
                     color: #333333;
              }

              .heading-section {
                     background-color: #ffffff;
                     border-bottom: 1px solid #e0e0e0;
                     padding: 30px;
                     text-align: center;
              }

              .content-section {
                     background-color: #ffffff;
                     padding: 40px 30px;
              }

              .footer-section {
                     padding: 20px;
                     text-align: center;
                     color: #888888;
                     font-size: 12px;
              }

              .box-container {
                     max-width: 600px;
                     margin: 20px auto;
                     background: #ffffff;
                     border-radius: 8px;
                     overflow: hidden;
                     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
              }

              .status-badge {
                     display: inline-block;
                     padding: 6px 12px;
                     border-radius: 20px;
                     font-size: 14px;
                     font-weight: bold;
                     color: #fff;
                     background-color: #5356FB;
              }

              /* Mobile overrides */
              @media screen and (max-width: 530px) {
                     .content-section {
                            padding: 20px;
                     }

                     .info-table th {
                            display: block;
                            width: 100%;
                            border-bottom: none;
                            padding-bottom: 0;
                     }

                     .info-table td {
                            display: block;
                            width: 100%;
                            padding-top: 5px;
                     }
              }
       </style>
</head>

<body style="margin:0;padding:0;">
       <div role="article" aria-roledescription="email" lang="en"
              style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#f6f9fc;">
              <div class="box-container">
                     <!-- Header with Logo -->
                     <div class="heading-section">
                            <!-- Ensure the path is correct relative to the public directory for email clients, or use full URL in production -->
                            <!-- Ideally use asset() helper in blade, but sometimes emails need full domain. -->
                            <img src="{{ asset('images/header-logo.png') }}" alt="XpertBid Logo"
                                   style="width: 150px; height: auto; border:0; display:block; margin: 0 auto; outline:none; text-decoration:none;">
                     </div>

                     <!-- Main Content -->
                     <div class="content-section">
                            @yield('content')
                     </div>

                     <!-- Footer -->
                     <div class="footer-section">
                            <p style="margin:0 0 10px 0;">&copy; {{ date('Y') }} XpertBid. All rights reserved.</p>
                            <p style="margin:0;">
                                   <a href="{{ url('xpertbid.com') }}" style="color:#5356FB;text-decoration:none;">Visit
                                          Website</a> |
                                   <a href="mailto:support@xpertbid.com"
                                          style="color:#5356FB;text-decoration:none;">Contact Support</a>
                            </p>
                            <p style="margin-top: 10px; font-size: 11px; color: #aaaaaa;">
                                   You are receiving this email because you are registered on XpertBid.
                            </p>
                     </div>
              </div>
       </div>
</body>

</html>