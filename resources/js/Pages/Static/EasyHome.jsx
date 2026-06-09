import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ContactForm from '@/Components/ContactForm';

const financePlans = [
       {
              key: 'buyer',
              title: 'XpertBid Easy Buyer',
              subtitle: 'Move into a verified property with a flexible ownership path.',
              image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600',
              maxFinanceRatio: 0.75,
              tenureLabel: '3 to 25 years',
              rate: 13.5,
              bullets: [
                     'Ideal for ready properties and listed homes',
                     'Guided installment planning for salaried and business buyers',
                     'Best for customers who want predictable monthly payments',
              ],
       },
       {
              key: 'builder',
              title: 'XpertBid Easy Builder',
              subtitle: 'Buy land and build step by step with a structured timeline.',
              image: 'https://images.pexels.com/photos/1105754/pexels-photo-1105754.jpeg?auto=compress&cs=tinysrgb&w=1600',
              maxFinanceRatio: 0.70,
              tenureLabel: '2 to 25 years',
              rate: 13.25,
              bullets: [
                     'For plot purchase plus construction support',
                     'Useful for self-build and family home planning',
                     'Great for long-horizon property owners',
              ],
       },
       {
              key: 'renovate',
              title: 'XpertBid Easy Renovate',
              subtitle: 'Upgrade your current home with a budget-friendly plan.',
              image: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1600',
              maxFinanceRatio: 0.30,
              tenureLabel: '2 to 15 years',
              rate: 14.25,
              bullets: [
                     'Perfect for repair, refurbishment, and extension work',
                     'Shorter tenure with practical monthly commitments',
                     'Supports value-adding home improvement projects',
              ],
       },
       {
              key: 'replace',
              title: 'XpertBid Easy Replace',
              subtitle: 'Shift your existing property finance into a cleaner structure.',
              image: 'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1600',
              maxFinanceRatio: 0.75,
              tenureLabel: '3 to 25 years',
              rate: 13.35,
              bullets: [
                     'Designed for existing mortgage/finance transfer cases',
                     'Ideal when customers want better structure or service',
                     'Keeps the plan organized under one clear ownership path',
              ],
       },
       {
              key: 'enhancement',
              title: 'XpertBid Easy Enhancement',
              subtitle: 'Add extra financing against an existing property facility.',
              image: 'https://images.pexels.com/photos/323776/pexels-photo-323776.jpeg?auto=compress&cs=tinysrgb&w=1600',
              maxFinanceRatio: 0.65,
              tenureLabel: 'Up to remaining tenure',
              rate: 13.6,
              bullets: [
                     'Useful for customers who already have an active facility',
                     'Can help with renovation or value-add upgrades',
                     'Keeps the property journey in one ecosystem',
              ],
       },
];

const benefitCards = [
       {
              icon: 'fa-shield-heart',
              title: 'XpertBid-first confidence',
              text: 'A polished property-financing experience aligned with trust, verified inventory, and clear ownership guidance.',
       },
       {
              icon: 'fa-hand-holding-dollar',
              title: 'Flexible ownership planning',
              text: 'Choose a path that suits your budget, whether you are buying a ready unit, building, renovating, or switching plans.',
       },
       {
              icon: 'fa-chart-line',
              title: 'Transparent monthly view',
              text: 'See an estimate before you proceed so users understand the shape of the payment journey early.',
       },
];

const howItWorks = [
       {
              step: '01',
              title: 'Pick your plan',
              text: 'Select the path that fits your property goal: buy, build, renovate, replace, or enhance.',
       },
       {
              step: '02',
              title: 'Estimate your budget',
              text: 'Use the live calculator to see the approximate monthly commitment and financing share.',
       },
       {
              step: '03',
              title: 'Submit your interest',
              text: 'Share your details so the team can contact you with the right property and financing path.',
       },
       {
              step: '04',
              title: 'Move with clarity',
              text: 'Proceed with a guided process that keeps the property journey simple and well-structured.',
       },
];

const eligibilityBlocks = [
       {
              title: 'Who can explore it',
              items: [
                     'Pakistani residents and non-residents',
                     'Salaried professionals and business owners',
                     'Buyers looking for verified property options',
              ],
       },
       {
              title: 'What we usually review',
              items: [
                     'Income profile and repayment comfort',
                     'Property value and expected financing share',
                     'Basic documents and contact details',
              ],
       },
       {
              title: 'Best use cases',
              items: [
                     'Purchase of a ready home or apartment',
                     'Construction on owned land',
                     'Renovation or improvement projects',
              ],
       },
];

const heroImages = [
       'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1600',
       'https://images.pexels.com/photos/323772/pexels-photo-323772.jpeg?auto=compress&cs=tinysrgb&w=1600',
       'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1600',
];

const currencyFormatter = new Intl.NumberFormat('en-PK', {
       style: 'currency',
       currency: 'PKR',
       maximumFractionDigits: 0,
});

function SectionTitle({ eyebrow, title, description, centered = false }) {
       return (
              <div className={`${centered ? 'text-center' : ''} mb-4 mb-lg-5`}>
                     {eyebrow && <div className="text-uppercase fw-bold text-primary small mb-2">{eyebrow}</div>}
                     <h2 className="fw-black text-gray-900 mb-3" style={{ fontSize: 'clamp(1.7rem, 2.6vw, 3rem)' }}>{title}</h2>
                     {description && <p className="text-secondary mb-0" style={{ maxWidth: centered ? '760px' : '720px', margin: centered ? '0 auto' : '0' }}>{description}</p>}
              </div>
       );
}

export default function EasyHome() {
       const [activePlanKey, setActivePlanKey] = useState('buyer');
       const [propertyValue, setPropertyValue] = useState(25000000);
       const [downPayment, setDownPayment] = useState(5000000);
       const [tenureYears, setTenureYears] = useState(15);

       const activePlan = financePlans.find((plan) => plan.key === activePlanKey) || financePlans[0];

       const calculatorData = useMemo(() => {
              const selectedPropertyValue = Number(propertyValue) || 0;
              const selectedDownPayment = Math.min(Number(downPayment) || 0, selectedPropertyValue);
              const financedAmount = Math.max(selectedPropertyValue - selectedDownPayment, 0);
              const monthlyRate = activePlan.rate / 100 / 12;
              const totalMonths = Math.max(Number(tenureYears) || 1, 1) * 12;
              const principalComponent = financedAmount / totalMonths;
              const profitComponent = financedAmount * monthlyRate;
              const estimatedMonthly = Math.max(Math.round(principalComponent + profitComponent), 0);

              return {
                     financedAmount,
                     selectedDownPayment,
                     selectedPropertyValue,
                     estimatedMonthly,
                     financingShare: selectedPropertyValue > 0 ? Math.round((financedAmount / selectedPropertyValue) * 100) : 0,
              };
       }, [activePlan.rate, downPayment, propertyValue, tenureYears]);

       const heroStats = [
              { value: '5', label: 'property paths' },
              { value: '75%', label: 'maximum financing ratio' },
              { value: '24/7', label: 'guided inquiry window' },
       ];

       return (
              <AppLayout>
                     <div className="easy-home-page">
                            <Head title="XpertBid Easy Home">
                                   <meta
                                          name="description"
                                          content="XpertBid Easy Home is a branded property-financing guide with flexible plans, a live estimator, and verified project support."
                                   />
                            </Head>

                            <section className="hero-section">
                                   <div className="container py-5 py-lg-6">
                                          <div className="row align-items-center g-4 g-lg-5">
                                                 <div className="col-lg-6">
                                                        <div className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-2 mb-4 hero-chip">
                                                               <i className="fa-solid fa-house-chimney text-primary"></i>
                                                               <span>XpertBid Easy Home</span>
                                                        </div>
                                                        <h1 className="display-5 fw-black text-white mb-3">
                                                               A premium, XpertBid-branded path to property ownership.
                                                        </h1>
                                                        <p className="lead text-white-75 mb-4">
                                                               Easy Home brings a clean, modern property-financing experience to XpertBid - with guided plans for buying, building, renovating, replacing, and enhancing a home.
                                                        </p>
                                                        <div className="d-flex flex-wrap gap-3 mb-4">
                                                               <a href="#calculator" className="btn home-pill-btn home-pill-btn-primary btn-lg px-4 fw-bold">
                                                                      Estimate Monthly Payment
                                                               </a>
                                                               <a href="#contact" className="btn home-pill-btn home-pill-btn-outline btn-lg px-4 fw-bold">
                                                                      Talk to XpertBid Team
                                                               </a>
                                                        </div>
                                                        <div className="row g-3">
                                                               {heroStats.map((stat) => (
                                                                      <div className="col-12 col-sm-4" key={stat.label}>
                                                                             <div className="hero-stat-card h-100">
                                                                                    <div className="hero-stat-value">{stat.value}</div>
                                                                                    <div className="hero-stat-label">{stat.label}</div>
                                                                             </div>
                                                                      </div>
                                                               ))}
                                                        </div>
                                                 </div>
                                                 <div className="col-lg-6">
                                                        <div className="hero-gallery">
                                                               <img src={heroImages[0]} alt="XpertBid Easy Home hero property" className="hero-main-image" />
                                                               <div className="hero-image-stack">
                                                                      <img src={heroImages[1]} alt="Modern interior property" className="hero-stack-image" />
                                                                      <img src={heroImages[2]} alt="Residential property exterior" className="hero-stack-image" />
                                                               </div>
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>
                            </section>

                            <section className="section-pad">
                                   <div className="container">
                                          <SectionTitle
                                                 eyebrow="Why XpertBid Easy Home"
                                                 title="Designed to feel premium, transparent, and easy to understand."
                                                 description="The structure mirrors the clarity of a leading bank product page, but the content, brand language, and look are fully tailored to XpertBid."
                                          />
                                          <div className="row g-4">
                                                 {benefitCards.map((card) => (
                                                        <div className="col-md-4" key={card.title}>
                                                               <div className="benefit-card h-100">
                                                                      <div className="benefit-icon">
                                                                             <i className={`fa-solid ${card.icon}`}></i>
                                                                      </div>
                                                                      <h3 className="h5 fw-bold text-gray-900 mt-4">{card.title}</h3>
                                                                      <p className="text-secondary mb-0">{card.text}</p>
                                                               </div>
                                                        </div>
                                                 ))}
                                          </div>
                                   </div>
                            </section>

                            <section className="section-pad section-dark">
                                   <div className="container">
                                          <div className="row align-items-center g-4 g-lg-5">
                                                 <div className="col-lg-6">
                                                        <SectionTitle
                                                               eyebrow="Strategic spotlight"
                                                               title="Verified communities, smarter discovery, and guided property support."
                                                               description="XpertBid Easy Home can be positioned around partner communities, curated listings, and a cleaner journey from interest to enquiry."
                                                        />
                                                        <div className="spotlight-list">
                                                               <div><i className="fa-solid fa-circle-check text-primary me-2"></i>Partner project showcases with modern visuals</div>
                                                               <div><i className="fa-solid fa-circle-check text-primary me-2"></i>Clear property details and eligibility guidance</div>
                                                               <div><i className="fa-solid fa-circle-check text-primary me-2"></i>Simple call-to-action flow for enquiries</div>
                                                        </div>
                                                        <div className="d-flex flex-wrap gap-3 mt-4">
                                                               <a href="#plans" className="btn home-pill-btn home-pill-btn-primary px-4 fw-bold">See Plans</a>
                                                               <Link href="/contact" className="btn home-pill-btn home-pill-btn-outline px-4 fw-bold">
                                                                      Contact Page
                                                               </Link>
                                                        </div>
                                                 </div>
                                                 <div className="col-lg-6">
                                                        <div className="spotlight-card">
                                                               <div className="spotlight-image" style={{ backgroundImage: 'linear-gradient(180deg, rgba(15,17,23,0.08), rgba(15,17,23,0.3)), url(https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1600)' }} role="img" aria-label="Partner community property" />
                                                               <div className="spotlight-overlay">
                                                                      <div className="spotlight-badge">Featured community</div>
                                                                      <h3 className="h4 fw-bold mb-2">Modern homes with premium presentation</h3>
                                                                      <p className="mb-0 text-white-75">Dummy image content is used here to keep the design visually rich on both desktop and mobile.</p>
                                                               </div>
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>
                            </section>

                            <section id="plans" className="section-pad">
                                   <div className="container">
                                          <SectionTitle
                                                 eyebrow="Financing paths"
                                                 title="Five clear plans, each with a distinct purpose."
                                                 description="These cards give the page the same product-brochure feel as the reference page, but with XpertBid language and property-first positioning."
                                                 centered
                                          />
                                          <div className="row g-4">
                                                 {financePlans.map((plan) => (
                                                        <div className="col-lg-6" key={plan.key}>
                                                               <div className={`plan-card h-100 ${activePlanKey === plan.key ? 'plan-card-active' : ''}`}>
                                                                       <div className="plan-image-wrap" style={{ backgroundImage: `linear-gradient(180deg, rgba(15,17,23,0.10), rgba(15,17,23,0.30)), url(${plan.image})` }} role="img" aria-label={plan.title}>
                                                                              <span className="plan-image-pill">XpertBid Property</span>
                                                                              <span className="plan-image-title">{plan.title}</span>
                                                                       </div>
                                                                      <div className="plan-body">
                                                                             <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                                                                                    <div>
                                                                                           <div className="text-uppercase text-primary small fw-bold mb-1">Plan {plan.key.toUpperCase()}</div>
                                                                                           <h3 className="h4 fw-black text-gray-900 mb-2">{plan.title}</h3>
                                                                                           <p className="text-secondary mb-0">{plan.subtitle}</p>
                                                                                    </div>
                                                                                    <button
                                                                                           type="button"
                                                                                            className={`btn home-toggle-btn px-3 fw-bold ${activePlanKey === plan.key ? 'btn-dark' : 'btn-outline-dark'}`}
                                                                                           onClick={() => setActivePlanKey(plan.key)}
                                                                                    >
                                                                                           {activePlanKey === plan.key ? 'Selected' : 'Select'}
                                                                                    </button>
                                                                             </div>
                                                                             <div className="plan-meta">
                                                                                    <div><span>Financing ratio</span><strong>Up to {(plan.maxFinanceRatio * 100).toFixed(0)}%</strong></div>
                                                                                    <div><span>Tenure</span><strong>{plan.tenureLabel}</strong></div>
                                                                                    <div><span>Sample annual rate</span><strong>{plan.rate.toFixed(2)}%</strong></div>
                                                                             </div>
                                                                             <ul className="plan-bullets">
                                                                                    {plan.bullets.map((bullet) => (
                                                                                           <li key={bullet}><i className="fa-solid fa-check text-primary me-2"></i>{bullet}</li>
                                                                                    ))}
                                                                             </ul>
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 ))}
                                          </div>
                                   </div>
                            </section>

                            <section id="calculator" className="section-pad section-soft">
                                   <div className="container">
                                          <SectionTitle
                                                 eyebrow="Payment estimator"
                                                 title="A simple calculator for the first conversation."
                                                 description="This is an estimate-only tool that helps users understand the shape of the monthly commitment before they enquire."
                                          />
                                          <div className="row align-items-stretch g-4 g-lg-5">
                                                 <div className="col-lg-6 d-flex">
                                                        <div className="calculator-card h-100 w-100">
                                                               <div className="mb-4">
                                                                      <label className="form-label fw-semibold text-gray-900">Property value</label>
                                                                      <input
                                                                             type="number"
                                                                             min="0"
                                                                             value={propertyValue}
                                                                             onChange={(event) => setPropertyValue(Number(event.target.value))}
                                                                             className="form-control form-control-lg rounded-4"
                                                                      />
                                                               </div>
                                                               <div className="mb-4">
                                                                      <label className="form-label fw-semibold text-gray-900">Down payment</label>
                                                                      <input
                                                                             type="number"
                                                                             min="0"
                                                                             value={downPayment}
                                                                             onChange={(event) => setDownPayment(Number(event.target.value))}
                                                                             className="form-control form-control-lg rounded-4"
                                                                      />
                                                               </div>
                                                               <div className="mb-4">
                                                                      <label className="form-label fw-semibold text-gray-900">Tenure (years)</label>
                                                                      <select
                                                                             className="form-select form-select-lg rounded-4"
                                                                             value={tenureYears}
                                                                             onChange={(event) => setTenureYears(Number(event.target.value))}
                                                                      >
                                                                             {[5, 10, 15, 20, 25].map((year) => (
                                                                                    <option key={year} value={year}>{year} years</option>
                                                                             ))}
                                                                      </select>
                                                               </div>
                                                               <div className="mb-3">
                                                                      <label className="form-label fw-semibold text-gray-900">Current plan</label>
                                                                      <div className="d-flex flex-wrap gap-2">
                                                                             {financePlans.map((plan) => (
                                                                                    <button
                                                                                           key={plan.key}
                                                                                           type="button"
                                                                                            className={`btn home-toggle-btn px-3 ${activePlanKey === plan.key ? 'btn-dark' : 'btn-outline-dark'}`}
                                                                                           onClick={() => setActivePlanKey(plan.key)}
                                                                                    >
                                                                                           {plan.title}
                                                                                    </button>
                                                                             ))}
                                                                      </div>
                                                               </div>
                                                        </div>
                                                 </div>
                                                 <div className="col-lg-6 d-flex">
                                                        <div className="estimate-card h-100 w-100">
                                                               <div className="estimate-header">
                                                                      <div className="text-uppercase small fw-bold text-primary">Estimated summary</div>
                                                                      <h3 className="h4 fw-black text-white mb-0">{activePlan.title}</h3>
                                                               </div>
                                                               <div className="estimate-grid">
                                                                      <div className="estimate-item">
                                                                             <span>Property value</span>
                                                                             <strong>{currencyFormatter.format(calculatorData.selectedPropertyValue)}</strong>
                                                                      </div>
                                                                      <div className="estimate-item">
                                                                             <span>Down payment</span>
                                                                             <strong>{currencyFormatter.format(calculatorData.selectedDownPayment)}</strong>
                                                                      </div>
                                                                      <div className="estimate-item">
                                                                             <span>Financed amount</span>
                                                                             <strong>{currencyFormatter.format(calculatorData.financedAmount)}</strong>
                                                                      </div>
                                                                      <div className="estimate-item">
                                                                             <span>Financing share</span>
                                                                             <strong>{calculatorData.financingShare}%</strong>
                                                                      </div>
                                                               </div>
                                                               <div className="estimate-monthly">
                                                                      <div className="small text-white-75 mb-1">Estimated monthly payment</div>
                                                                      <div className="display-6 fw-black text-white mb-1">{currencyFormatter.format(calculatorData.estimatedMonthly)}</div>
                                                                      <div className="text-white-75">Based on the selected plan and a simple estimate model.</div>
                                                               </div>
                                                               <div className="estimate-footer">
                                                                      <div><i className="fa-solid fa-clock text-primary me-2"></i>Tenure guide: {activePlan.tenureLabel}</div>
                                                                      <div><i className="fa-solid fa-percent text-primary me-2"></i>Sample annual rate: {activePlan.rate.toFixed(2)}%</div>
                                                               </div>
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>
                            </section>

                            <section className="section-pad">
                                   <div className="container">
                                          <div className="row align-items-center g-4 g-lg-5">
                                                 <div className="col-lg-6">
                                                        <img
                                                               src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1600&q=80"
                                                               alt="Modern house exterior"
                                                               className="img-fluid rounded-5 shadow-lg w-100"
                                                               style={{ minHeight: '420px', objectFit: 'cover' }}
                                                        />
                                                 </div>
                                                 <div className="col-lg-6">
                                                        <SectionTitle
                                                               eyebrow="Eligibility guide"
                                                               title="A straightforward checklist for the first review."
                                                               description="This section gives the page the same helpful, trust-building rhythm as the Meezan page while staying aligned with XpertBid."
                                                        />
                                                        <div className="row g-3">
                                                               {eligibilityBlocks.map((block) => (
                                                                      <div className="col-md-12" key={block.title}>
                                                                             <div className="eligibility-card">
                                                                                    <h3 className="h5 fw-bold text-gray-900 mb-3">{block.title}</h3>
                                                                                    <ul className="eligibility-list mb-0">
                                                                                           {block.items.map((item) => (
                                                                                                  <li key={item}>
                                                                                                         <i className="fa-solid fa-circle-check text-primary me-2"></i>
                                                                                                         <span>{item}</span>
                                                                                                  </li>
                                                                                           ))}
                                                                                    </ul>
                                                                             </div>
                                                                      </div>
                                                               ))}
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>
                            </section>

                            <section className="section-pad section-dark">
                                   <div className="container">
                                          <SectionTitle
                                                 eyebrow="How it works"
                                                 title="A clean four-step journey."
                                                 description="Simple, transparent, and easy to follow — the same kind of flow users expect from a premium financing page."
                                                 centered
                                          />
                                          <div className="row g-4">
                                                 {howItWorks.map((item) => (
                                                        <div className="col-md-6 col-lg-3" key={item.step}>
                                                               <div className="step-card h-100">
                                                                      <div className="step-number">{item.step}</div>
                                                                      <h3 className="h5 fw-bold text-white mt-3">{item.title}</h3>
                                                                      <p className="text-white-75 mb-0">{item.text}</p>
                                                               </div>
                                                        </div>
                                                 ))}
                                          </div>
                                   </div>
                            </section>

                            <section id="contact" className="section-pad section-soft">
                                   <div className="container">
                                          <SectionTitle
                                                 eyebrow="Get in touch"
                                                 title="Let’s shape the right property path for you."
                                                 description="We can keep the contact area lightweight and still give users a professional next step for enquiry."
                                                 centered
                                          />
                                          <div className="contact-cta-card mb-4">
                                                 <div className="row align-items-center g-4">
                                                        <div className="col-lg-7">
                                                               <h3 className="h3 fw-black text-white mb-3">Need a guided home ownership discussion?</h3>
                                                               <p className="text-white-75 mb-4">
                                                                      Use XpertBid Easy Home as a polished content page for property enquiries, partner project discovery, and financing guidance.
                                                               </p>
                                                               <div className="d-flex flex-wrap gap-3">
                                                                      <Link href="/contact" className="btn home-pill-btn home-pill-btn-primary px-4 fw-bold">
                                                                             Open Contact Page
                                                                      </Link>
                                                                      <a href="mailto:support@xpertbid.com" className="btn home-pill-btn home-pill-btn-outline px-4 fw-bold">
                                                                             Email Support
                                                                      </a>
                                                               </div>
                                                        </div>
                                                        <div className="col-lg-5">
                                                               <div className="contact-mini-list">
                                                                      <div><i className="fa-solid fa-envelope text-primary me-2"></i>support@xpertbid.com</div>
                                                                      <div><i className="fa-solid fa-phone text-primary me-2"></i>+92 302 2113202</div>
                                                                      <div><i className="fa-solid fa-location-dot text-primary me-2"></i>Pakistan | Dubai | Remote assistance</div>
                                                               </div>
                                                        </div>
                                                 </div>
                                          </div>

                                          <div className="bg-white rounded-5 shadow-lg p-3 p-lg-4">
                                                 <ContactForm />
                                          </div>
                                   </div>
                            </section>
                     </div>

                     <style>{`
                            .easy-home-page {
                                   background: #f6f8fc;
                            }

                            .hero-section {
                                   background:
                                          radial-gradient(circle at top left, rgba(67, 172, 233, 0.18), transparent 30%),
                                          linear-gradient(135deg, #090b10 0%, #111520 50%, #1f2733 100%);
                            }

                            .hero-chip {
                                   background: rgba(255, 255, 255, 0.10);
                                   color: #fff;
                                   border: 1px solid rgba(255, 255, 255, 0.12);
                                   backdrop-filter: blur(12px);
                                   border-radius: 999px;
                            }

                            .hero-stat-card {
                                   background: rgba(255, 255, 255, 0.08);
                                   border: 1px solid rgba(255, 255, 255, 0.12);
                                   border-radius: 20px;
                                   padding: 16px;
                                   color: #fff;
                                   backdrop-filter: blur(12px);
                            }

                            .hero-stat-value {
                                   font-size: 1.7rem;
                                   font-weight: 900;
                                   line-height: 1;
                            }

                            .hero-stat-label {
                                   font-size: 0.82rem;
                                   opacity: 0.78;
                                   margin-top: 6px;
                                   text-transform: uppercase;
                                   letter-spacing: 0.06em;
                            }

                            .hero-gallery {
                                   display: grid;
                                   grid-template-columns: 1.2fr 0.8fr;
                                   gap: 16px;
                                   align-items: stretch;
                            }

                            .hero-main-image,
                            .hero-stack-image,
                            .plan-image-wrap,
                            .spotlight-image {
                                   width: 100%;
                                   display: block;
                                   background-size: cover;
                                   background-position: center;
                                   background-repeat: no-repeat;
                            }

                            .hero-main-image {
                                   height: 100%;
                                   min-height: 520px;
                                   border-radius: 36px;
                                   box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
                            }

                            .hero-image-stack {
                                   display: grid;
                                   gap: 16px;
                            }

                            .hero-stack-image {
                                   height: calc(50% - 8px);
                                   min-height: 252px;
                                   border-radius: 32px;
                                   box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
                            }

                            .plan-image-wrap {
                                   height: 280px;
                                   position: relative;
                                   background-color: #dbe6f2;
                                   border-radius: 36px 36px 24px 24px;
                                   overflow: hidden;
                                   border-bottom: 1px solid #edf2f7;
                            }

                            .plan-image-title {
                                   position: absolute;
                                   left: 20px;
                                   bottom: 18px;
                                   color: #fff;
                                   font-size: 1.25rem;
                                   font-weight: 900;
                                   line-height: 1.1;
                                   max-width: calc(100% - 40px);
                                   text-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
                            }

                            .plan-image-pill {
                                   position: absolute;
                                   left: 20px;
                                   top: 20px;
                                   border-radius: 999px;
                                   background: rgba(9, 11, 16, 0.72);
                                   color: #fff;
                                   padding: 6px 12px;
                                   font-size: 12px;
                                   font-weight: 700;
                                   letter-spacing: 0.02em;
                                   backdrop-filter: blur(8px);
                            }

                            .section-pad {
                                   padding: 90px 0;
                            }

                            .section-soft {
                                   background: linear-gradient(180deg, #f6f8fc 0%, #eef3f9 100%);
                            }

                            .section-dark {
                                   background: #171a23;
                            }

                            .section-dark .text-gray-900,
                            .section-dark h2,
                            .section-dark h3,
                            .section-dark h4,
                            .section-dark h5,
                            .section-dark p {
                                   color: #fff !important;
                            }

                            .section-dark .text-secondary {
                                   color: rgba(255, 255, 255, 0.72) !important;
                            }

                            .benefit-card,
                            .calculator-card,
                            .eligibility-card,
                            .contact-cta-card,
                            .step-card,
                            .plan-card,
                            .spotlight-card,
                            .estimate-card {
                                   border-radius: 36px;
                                   overflow: hidden;
                                   box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
                            }

                            .benefit-card,
                            .calculator-card,
                            .eligibility-card {
                                   background: #fff;
                                   padding: 30px;
                            }

                            .benefit-icon {
                                   width: 60px;
                                   height: 60px;
                                   border-radius: 18px;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   background: rgba(67, 172, 233, 0.12);
                                   color: #43ace9;
                                   font-size: 24px;
                            }

                            .spotlight-card {
                                   position: relative;
                                   min-height: 520px;
                                   background: #000;
                            }

                            .spotlight-image {
                                   height: 100%;
                                   min-height: 520px;
                                   opacity: 0.9;
                            }

                            .spotlight-overlay {
                                   position: absolute;
                                   inset: auto 24px 24px 24px;
                                   background: rgba(23, 26, 35, 0.88);
                                   color: #fff;
                                   padding: 24px;
                                   border-radius: 22px;
                                   backdrop-filter: blur(10px);
                            }

                            .spotlight-badge {
                                   display: inline-flex;
                                   align-items: center;
                                   border-radius: 999px;
                                   background: rgba(67, 172, 233, 0.14);
                                   color: #fff;
                                   padding: 6px 12px;
                                   font-size: 12px;
                                   font-weight: 700;
                                   margin-bottom: 12px;
                            }

                            .plan-card {
                                   background: #fff;
                                   border: 1px solid #e8edf4;
                                   border-radius: 36px;
                                   transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
                            }

                            .plan-card:hover,
                            .plan-card-active {
                                   transform: translateY(-4px);
                                   border-color: #43ace9;
                                   box-shadow: 0 24px 70px rgba(67, 172, 233, 0.12);
                            }

                            .plan-body {
                                   padding: 26px;
                            }

                            .plan-meta {
                                   display: grid;
                                   grid-template-columns: repeat(3, minmax(0, 1fr));
                                   gap: 12px;
                                   background: #f7fafc;
                                   border-radius: 18px;
                                   padding: 16px;
                                   margin-bottom: 18px;
                            }

                            .plan-meta span {
                                   display: block;
                                   font-size: 12px;
                                   color: #64748b;
                                   text-transform: uppercase;
                                   letter-spacing: 0.05em;
                                   margin-bottom: 4px;
                            }

                            .plan-meta strong {
                                   color: #0f172a;
                                   font-size: 14px;
                            }

                            .plan-bullets {
                                   list-style: none;
                                   padding: 0;
                                   margin: 0;
                                   display: grid;
                                   gap: 10px;
                            }

                            .plan-bullets li {
                                   color: #334155;
                                   display: flex;
                                   align-items: flex-start;
                            }

                            .calculator-card {
                                   background: #fff;
                            }

                            .estimate-card {
                                   background: linear-gradient(180deg, #0f1117 0%, #171a23 100%);
                                   color: #fff;
                                   padding: 32px;
                                   border-radius: 36px;
                            }

                            .estimate-header {
                                   border-bottom: 1px solid rgba(255, 255, 255, 0.12);
                                   padding-bottom: 18px;
                                   margin-bottom: 18px;
                            }

                            .estimate-grid {
                                   display: grid;
                                   grid-template-columns: repeat(2, minmax(0, 1fr));
                                   gap: 14px;
                            }

                            .estimate-item {
                                   background: rgba(255, 255, 255, 0.07);
                                   border: 1px solid rgba(255, 255, 255, 0.08);
                                   border-radius: 18px;
                                   padding: 16px;
                            }

                            .estimate-item span {
                                   display: block;
                                   font-size: 12px;
                                   text-transform: uppercase;
                                   letter-spacing: 0.05em;
                                   opacity: 0.72;
                                   margin-bottom: 6px;
                            }

                            .estimate-item strong {
                                   font-size: 18px;
                                   font-weight: 800;
                            }

                            .estimate-monthly {
                                   margin-top: 20px;
                                   padding: 24px;
                                   border-radius: 22px;
                                   background: rgba(67, 172, 233, 0.12);
                                   border: 1px solid rgba(67, 172, 233, 0.20);
                            }

                            .estimate-footer {
                                   display: flex;
                                   flex-wrap: wrap;
                                   gap: 12px 24px;
                                   margin-top: 18px;
                                   color: rgba(255, 255, 255, 0.82);
                            }

                            .eligibility-list {
                                   list-style: none;
                                   padding: 0;
                                   margin: 0;
                                   display: grid;
                                   gap: 10px;
                            }

                            .eligibility-list li {
                                   color: #334155;
                            }

                            .step-card {
                                   background: rgba(255, 255, 255, 0.04);
                                   border: 1px solid rgba(255, 255, 255, 0.08);
                                   padding: 28px;
                            }

                            .step-number {
                                   width: 54px;
                                   height: 54px;
                                   border-radius: 16px;
                                   display: inline-flex;
                                   align-items: center;
                                   justify-content: center;
                                   background: rgba(67, 172, 233, 0.14);
                                   color: #43ace9;
                                   font-size: 18px;
                                   font-weight: 900;
                            }

                            .contact-cta-card {
                                   background: linear-gradient(135deg, #23262f 0%, #0f1117 100%);
                                   padding: 34px;
                                   color: #fff;
                                   margin-bottom: 28px;
                                   border-radius: 36px;
                            }

                            .home-pill-btn {
                                   border-radius: 12px !important;
                                   padding-top: 0.95rem;
                                   padding-bottom: 0.95rem;
                                   border-width: 2px;
                            }

                            .home-toggle-btn {
                                   border-radius: 12px !important;
                                   min-width: 92px;
                                   padding-top: 0.75rem;
                                   padding-bottom: 0.75rem;
                            }

                            .home-pill-btn-primary {
                                   background: #43ace9 !important;
                                   border-color: #43ace9 !important;
                                   color: #fff !important;
                                   box-shadow: 0 16px 32px rgba(67, 172, 233, 0.28);
                            }

                            .home-pill-btn-primary:hover {
                                   background: #2e96d4 !important;
                                   border-color: #2e96d4 !important;
                                   color: #fff !important;
                            }

                            .home-pill-btn-outline {
                                   border-color: rgba(255, 255, 255, 0.85) !important;
                                   color: #fff !important;
                                   background: transparent !important;
                            }

                            .home-pill-btn-outline:hover {
                                   background: rgba(255, 255, 255, 0.10) !important;
                                   color: #fff !important;
                            }

                            .contact-mini-list {
                                   display: grid;
                                   gap: 14px;
                                   background: rgba(255, 255, 255, 0.06);
                                   border: 1px solid rgba(255, 255, 255, 0.08);
                                   border-radius: 22px;
                                   padding: 22px;
                            }

                            .fw-black {
                                   font-weight: 900;
                            }

                            .text-white-75 {
                                   color: rgba(255, 255, 255, 0.75);
                            }

                            @media (max-width: 991.98px) {
                                   .hero-gallery {
                                          grid-template-columns: 1fr;
                                   }

                                   .hero-main-image,
                                   .spotlight-card,
                                   .spotlight-image {
                                          min-height: 360px;
                                   }

                                   .hero-stack-image {
                                          min-height: 180px;
                                          height: 180px;
                                   }

                                   .section-pad {
                                          padding: 72px 0;
                                   }
                            }

                            @media (max-width: 767.98px) {
                                   .hero-section .display-5 {
                                          font-size: clamp(2rem, 10vw, 2.75rem);
                                   }

                                   .hero-stat-card {
                                          padding: 14px 16px;
                                   }

                                   .hero-stat-value {
                                          font-size: 1.35rem;
                                   }

                                   .hero-stat-label {
                                          font-size: 0.72rem;
                                   }

                                   .plan-meta,
                                   .estimate-grid {
                                          grid-template-columns: 1fr;
                                   }

                                   .contact-cta-card {
                                          padding: 24px;
                                   }

                                   .hero-main-image,
                                   .spotlight-card,
                                   .spotlight-image {
                                          min-height: 240px;
                                   }

                                   .hero-stack-image {
                                          min-height: 150px;
                                          height: 150px;
                                   }
                            }
                     `}</style>
              </AppLayout>
       );
}
