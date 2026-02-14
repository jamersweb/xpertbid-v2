import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import MobileBottomNav from '@/Components/MobileBottomNav';
import { CartProvider } from '@/Contexts/CartContext';
import { AuthModalProvider } from '@/Contexts/AuthModalContext';

export default function AppLayout({ children, title }) {
       return (
              <CartProvider>
                     <AuthModalProvider>
                            <div className="min-h-screen bg-gray-100">
                                   {title && <Head title={title} />}

                                   <Header />

                                   <main>
                                          {children}
                                   </main>

                                   <Footer />
                                   <MobileBottomNav />
                            </div>
                     </AuthModalProvider>
              </CartProvider>
       );
}
