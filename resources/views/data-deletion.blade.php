<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Account and Data Deletion | XpertBid</title>
    <meta name="description" content="How XpertBid users can request account and personal data deletion.">
    <style>
        :root {
            color-scheme: light;
            --ink: #0f172a;
            --muted: #64748b;
            --line: #dbe7f3;
            --blue: #42b3f5;
            --deep: #1e293b;
            --soft: #f4f8fc;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: var(--ink);
            background:
                radial-gradient(circle at top right, rgba(66, 179, 245, 0.16), transparent 34rem),
                linear-gradient(180deg, #ffffff 0%, var(--soft) 100%);
            line-height: 1.65;
        }

        main {
            width: min(960px, calc(100% - 32px));
            margin: 0 auto;
            padding: 40px 0 64px;
        }

        .hero,
        .card {
            background: rgba(255, 255, 255, 0.92);
            border: 1px solid var(--line);
            border-radius: 28px;
            box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
        }

        .hero {
            padding: clamp(28px, 5vw, 56px);
            overflow: hidden;
            position: relative;
        }

        .hero::after {
            content: "";
            position: absolute;
            width: 260px;
            height: 260px;
            right: -90px;
            top: -90px;
            border-radius: 999px;
            background: rgba(66, 179, 245, 0.16);
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 28px;
            font-weight: 800;
            font-size: 22px;
        }

        .brand img {
            height: 38px;
            width: auto;
        }

        .eyebrow {
            color: var(--blue);
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.16em;
            text-transform: uppercase;
        }

        h1 {
            margin: 10px 0 16px;
            font-size: clamp(36px, 7vw, 64px);
            line-height: 0.98;
            letter-spacing: -0.05em;
        }

        h2 {
            margin: 0 0 12px;
            font-size: 24px;
            letter-spacing: -0.02em;
        }

        p {
            margin: 0 0 14px;
            color: var(--muted);
            font-size: 17px;
        }

        a {
            color: #168fda;
            font-weight: 700;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
            margin-top: 22px;
        }

        .card {
            padding: 26px;
        }

        .step {
            display: flex;
            gap: 14px;
            align-items: flex-start;
            margin-top: 18px;
        }

        .badge {
            flex: 0 0 auto;
            display: inline-grid;
            place-items: center;
            width: 34px;
            height: 34px;
            border-radius: 999px;
            color: #fff;
            background: var(--deep);
            font-weight: 800;
        }

        .panel {
            margin-top: 22px;
            padding: 22px;
            border-radius: 22px;
            background: #eaf6ff;
            border: 1px solid #c9eaff;
        }

        .panel p {
            color: #36556b;
        }

        footer {
            margin-top: 26px;
            color: var(--muted);
            font-size: 14px;
            text-align: center;
        }

        @media (max-width: 720px) {
            main {
                padding-top: 20px;
            }

            .grid {
                grid-template-columns: 1fr;
            }

            .hero,
            .card {
                border-radius: 22px;
            }
        }
    </style>
</head>
<body>
<main>
    <section class="hero">
        <div class="brand">
            <img src="/assets/images/logo.png" alt="XpertBid">
        </div>
        <div class="eyebrow">Privacy request</div>
        <h1>Account and Data Deletion</h1>
        <p>
            XpertBid users can request deletion of their account and associated personal data at any time.
            This page explains the in-app deletion path and the support request path required for Google Play.
        </p>
        <div class="panel">
            <p>
                For deletion support, email
                <a href="mailto:Support@xpertbid.com?subject=Account%20and%20Data%20Deletion%20Request">Support@xpertbid.com</a>
                from the email address linked to your XpertBid account. Include your registered email address
                or phone number so we can verify the request.
            </p>
        </div>
    </section>

    <section class="grid" aria-label="Deletion options">
        <article class="card">
            <h2>Delete from the app</h2>
            <div class="step">
                <span class="badge">1</span>
                <p>Open the XpertBid mobile app and sign in to your account.</p>
            </div>
            <div class="step">
                <span class="badge">2</span>
                <p>Go to <strong>Profile</strong> and open <strong>Account Settings</strong>.</p>
            </div>
            <div class="step">
                <span class="badge">3</span>
                <p>Select the account deletion option and confirm your request.</p>
            </div>
        </article>

        <article class="card">
            <h2>Request by email</h2>
            <div class="step">
                <span class="badge">1</span>
                <p>Email Support@xpertbid.com with the subject <strong>Account and Data Deletion Request</strong>.</p>
            </div>
            <div class="step">
                <span class="badge">2</span>
                <p>Send the request from your registered account email where possible.</p>
            </div>
            <div class="step">
                <span class="badge">3</span>
                <p>We verify ownership before deleting account data to protect users from unauthorized deletion.</p>
            </div>
        </article>
    </section>

    <section class="card" style="margin-top: 18px;">
        <h2>What data is deleted</h2>
        <p>
            Deletion includes account profile information, authentication data, saved addresses, notification settings,
            uploaded profile/listing media where deletion is legally and operationally permitted, favorites, and app
            activity associated with your account.
        </p>
        <p>
            Some records may be retained where required for legal, security, fraud prevention, dispute resolution,
            accounting, order, auction, bid, or regulatory obligations. Retained records are limited to the required
            purpose and retention period.
        </p>
        <p>
            Verified deletion requests are normally processed within 30 days. If additional verification or legal
            retention applies, we will notify you through the contact information linked to your account.
        </p>
    </section>

    <footer>
        XPERTBID AUCTIONS ORGANIZING L.L.C · Office # 2F.031, Fahad Ahmad Building, Street # 13B, Hor Al Anz, Dubai, UAE
    </footer>
</main>
</body>
</html>
