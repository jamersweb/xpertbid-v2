import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ContactForm from '@/Components/ContactForm';

export default function ContactUs() {
       return (
              <AppLayout>
                     <Head title="Contact Us" />
                     <div className="color py-5">
                            <ContactForm />
                     </div>
              </AppLayout>
       );
}
