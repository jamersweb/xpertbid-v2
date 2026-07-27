<?php

namespace App\Http\Controllers;

use App\Models\FaqQuestion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StaticPageController extends Controller
{
    /**
     * Display the About Us page.
     */
    public function about(): Response
    {
        return Inertia::render('Static/AboutUs');
    }

    /**
     * Display the About Our Partners page.
     */
    public function aboutOurPartner(): Response
    {
        return Inertia::render('Static/AboutOurPartner');
    }

    /**
     * Display the Contact Us page.
     */
    public function contact(): Response
    {
        return Inertia::render('Static/ContactUs');
    }

    /**
     * Display the Terms & Conditions page.
     */
    public function terms(): Response
    {
        return Inertia::render('Static/Terms');
    }

    /**
     * Display the Privacy Policy page.
     */
    public function privacy(): Response
    {
        return Inertia::render('Static/PrivacyPolicy');
    }

    /**
     * Display the Refund Policy page.
     */
    public function refund(): Response
    {
        return Inertia::render('Static/RefundPolicy');
    }

    /**
     * Display the Shipping Policy page.
     */
    public function shipping(): Response
    {
        return Inertia::render('Static/ShippingPolicy');
    }

    /**
     * Display the Seller Policy page.
     */
    public function sellerPolicy(): Response
    {
        return Inertia::render('Static/SellerPolicy');
    }

    /**
     * Display the FAQ page.
     */
    public function faq(): Response
    {
        $faqs = FaqQuestion::query()
            ->where('status', 'Active')
            ->orderBy('id')
            ->get(['id', 'question_text', 'answer_text']);

        return Inertia::render('Static/FAQ', [
            'faqs' => $faqs,
        ]);
    }

    /**
     * Display the Easy Home financing page.
     */
    public function easyHome(): Response
    {
        return Inertia::render('Static/EasyHome');
    }
}
