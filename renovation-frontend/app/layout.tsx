import type { Metadata } from "next";
import { AuthModalProvider } from "@/components/auth/AuthModalProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Suspense } from "react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SiteFooter, SiteHeader, WhatsAppFab } from "@/components/SiteChrome";
import { getPropertyCategories } from "@/lib/api/client";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { CategoryNode } from "@/types/property";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Home Renovation & Contractors in Pakistan`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Browse verified home renovation services, contractors, modular kitchens, bathrooms, flooring, and false ceiling in Pakistan on XpertBid.",
  icons: {
    icon: "/favicon.ico",
    apple: "/assets/images/favicon.ico",
  },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_PK",
  },
};

function isMainVertical(category: CategoryNode) {
  const slug = category.slug?.toLowerCase() || "";
  const name = category.name?.toLowerCase() || "";
  return (
    slug.includes("home-renovation") ||
    slug.includes("home-builder") ||
    name.includes("home renovation") ||
    name.includes("home builder")
  );
}

async function loadPurposes(): Promise<CategoryNode[]> {
  try {
    const tree = await getPropertyCategories();
    const mains = (tree.main_categories || []).filter(isMainVertical);
    if (mains.length > 0) {
      return mains;
    }
    if (isMainVertical(tree)) {
      return [tree];
    }
    return [];
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const purposes = await loadPurposes();

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body
        className="font-sans antialiased"
        style={{ background: "#fff" }}
        suppressHydrationWarning
      >
        <AuthProvider>
          <AuthModalProvider>
            <div className="min-h-screen bg-white has-mobile-bottom-nav">
              <SiteHeader purposes={purposes} />
              <main>{children}</main>
              <SiteFooter />
            </div>
            <Suspense fallback={null}>
              <MobileBottomNav purposes={purposes} />
            </Suspense>
            <WhatsAppFab />
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
