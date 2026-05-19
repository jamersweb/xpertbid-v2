<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width,initial-scale=1">
       <meta name="x-apple-disable-message-reformatting">
       <title>@yield('title', 'XpertBid Notification')</title>
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
              h2,
              h3,
              p,
              a {
                     font-family: Arial, Helvetica, sans-serif;
              }

              body {
                     margin: 0;
                     padding: 0;
                     background-color: #f4f7fb;
                     overflow-x: hidden;
              }

              a {
                     color: #43ACE9;
              }

              .email-shell {
                     width: 100%;
                     background-color: #f4f7fb;
                     padding: 28px 12px;
                     box-sizing: border-box;
              }

              .email-container {
                     max-width: 640px;
                     margin: 0 auto;
                     background: #ffffff;
                     border-radius: 14px;
                     overflow: hidden;
                     box-shadow: 0 14px 40px rgba(17, 24, 39, 0.08);
              }

              .email-header {
                     background-color: #ffffff;
                     border-bottom: 1px solid #eef2f7;
                     padding: 24px 30px;
                     text-align: left;
              }

              .email-header img {
                     width: 154px;
                     max-width: 154px;
                     height: auto;
                     border: 0;
                     display: block;
                     outline: none;
                     text-decoration: none;
              }

              .content-section {
                     background-color: #ffffff;
                     padding: 38px 30px;
              }

              .content-section h1 {
                     color: #23262F;
                     margin: 0 0 16px;
                     font-size: 24px;
                     line-height: 1.3;
              }

              .content-section p {
                     color: #555f70;
                     font-size: 15px;
                     line-height: 1.65;
              }

              .btn-primary {
                     display: inline-block;
                     padding: 13px 24px;
                     background-color: #23262F;
                     color: #ffffff !important;
                     text-decoration: none;
                     border-radius: 8px;
                     font-weight: bold;
                     font-size: 15px;
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
                     color: #23262F;
                     width: 35%;
              }

              .info-table td {
                     color: #333333;
              }

              .status-badge {
                     display: inline-block;
                     padding: 6px 12px;
                     border-radius: 20px;
                     font-size: 14px;
                     font-weight: bold;
                     color: #fff;
                     background-color: #43ACE9;
              }

              .email-footer {
                     background-color: #f9fbfd;
                     border-top: 1px solid #eef2f7;
                     padding: 30px 24px 26px;
                     text-align: center;
                     color: #7b8494;
                     font-size: 12px;
              }

              .email-footer-logo {
                     width: 150px;
                     max-width: 150px;
                     height: auto;
                     border: 0;
                     display: block;
                     margin: 0 auto 18px;
                     outline: none;
                     text-decoration: none;
              }

              .social-row {
                     text-align: center;
                     margin: 0 0 20px;
              }

              .social-link {
                     display: inline-block;
                     width: 28px;
                     height: 28px;
                     line-height: 28px;
                     color: #43ACE9 !important;
                     text-align: center;
                     text-decoration: none;
                     margin: 0 14px;
              }

              .social-icon {
                     width: 24px;
                     height: 24px;
                     display: inline-block;
                     vertical-align: middle;
                     margin-top: 2px;
              }

              .footer-link {
                     color: #43ACE9 !important;
                     text-decoration: none;
                     font-weight: bold;
              }

              @media screen and (max-width: 530px) {
                     .email-shell {
                            padding: 14px 8px;
                     }

                     .email-header,
                     .content-section {
                            padding: 22px 18px;
                     }

                     .email-header img {
                            width: 138px;
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
       @php
              $siteUrl = config('app.url') ?: url('/');
              $logo = asset('assets/images/header-logo.png');
              $footerLogo = asset('assets/images/footer-logo.png');
              $socialLinks = [
                     [
                            'label' => 'Instagram',
                            'url' => 'https://www.instagram.com/xpert_bid?igsh=NWFqcmh5eTgwOWpq',
                            'icon' => '<svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" role="img" aria-hidden="true"><path fill="#43ACE9" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141Zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7Zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8Zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1S-.7 127.6-2.5 163.5c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.9ZM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1Z"/></svg>',
                     ],
                     [
                            'label' => 'LinkedIn',
                            'url' => 'https://www.linkedin.com/company/xpertbid/',
                            'icon' => '<svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" role="img" aria-hidden="true"><path fill="#43ACE9" d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3C448 46.5 433.6 32 416 32ZM135.4 416H69V202.2h66.5V416ZM102.2 173c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5S123.4 173 102.2 173Zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416Z"/></svg>',
                     ],
                     [
                            'label' => 'Facebook',
                            'url' => 'https://www.facebook.com/share/18qvrpo3uW/?mibextid=wwXIfr',
                            'icon' => '<svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-hidden="true"><path fill="#43ACE9" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256c0 127.8 93.6 233.7 216 252.9V330h-65v-74h65v-56.4c0-64.2 38.2-99.6 96.7-99.6 28 0 57.3 5 57.3 5v63h-32.3c-31.8 0-41.7 19.8-41.7 40v48h71l-11.4 74H296v178.9C418.4 489.7 512 383.8 512 256Z"/></svg>',
                     ],
              ];
       @endphp

       <div role="article" aria-roledescription="email" lang="en" class="email-shell">
              <div class="email-container">
                     <div class="email-header">
                            <a href="{{ $siteUrl }}" target="_blank" rel="noopener noreferrer">
                                   <img src="{{ $logo }}" alt="XpertBid">
                            </a>
                     </div>

                     <div class="content-section">
                            @yield('content')
                     </div>

                     <div class="email-footer">
                            <a href="{{ $siteUrl }}" target="_blank" rel="noopener noreferrer">
                                   <img class="email-footer-logo" src="{{ $footerLogo }}" alt="XpertBid">
                            </a>

                            <div class="social-row">
                                   @foreach ($socialLinks as $social)
                                          <a class="social-link" href="{{ $social['url'] }}" target="_blank" rel="noopener noreferrer" aria-label="{{ $social['label'] }}">
                                                 {!! $social['icon'] !!}
                                          </a>
                                   @endforeach
                            </div>

                            <p style="margin:0 0 10px;">&copy; {{ date('Y') }} XpertBid. All rights reserved.</p>
                            <p style="margin:0;">
                                   <a class="footer-link" href="{{ $siteUrl }}" target="_blank" rel="noopener noreferrer">Visit Website</a>
                                   <span style="color:#c3cad5;"> | </span>
                                   <a class="footer-link" href="mailto:support@xpertbid.com">Contact Support</a>
                            </p>
                            <p style="margin:12px 0 0;font-size:11px;color:#9aa3b2;">
                                   You are receiving this email because you are registered on XpertBid.
                            </p>
                     </div>
              </div>
       </div>
</body>

</html>
