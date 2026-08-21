import AppLayout from '@/Layouts/AppLayout';
import HeroSection from '@/Components/HeroSection';
import SliderBrowseCategories from '@/Components/SliderBrowseCategories';
import FeaturedProducts from '@/Components/FeaturedProducts';
import HomeCategorySection from '@/Components/HomeCategorySection';
import WhyChooseXpertBid from '@/Components/WhyChooseXpertBid';
import SeoContentSection from '@/Components/SeoContentSection';
import useTranslate from '@/hooks/useTranslate';

export default function Home({
       auth,
       sliders,
       categories,
       featuredAuctions,
       categorySections = [],
       favoriteListingIds,
}) {
       const { t } = useTranslate();

       return (
              <AppLayout title={t('Online Auction Marketplace Pakistan | Bid & Sell on XpertBid')}>
                     <div className="home-page overflow-x-hidden">
                            <HeroSection sliders={sliders} />
                            <SliderBrowseCategories categories={categories} />
                            <FeaturedProducts products={featuredAuctions} />

                            {(categorySections || []).map((section) => {
                                   const category = section?.category || {};
                                   const slug = category.slug || '';
                                   const name = category.name || 'Category';
                                   const viewAllHref = slug
                                          ? `/marketplace/${encodeURIComponent(slug)}`
                                          : '/marketplace';

                                   return (
                                          <HomeCategorySection
                                                 key={category.id || slug || name}
                                                 title={name}
                                                 products={section.products || []}
                                                 viewAllHref={viewAllHref}
                                          />
                                   );
                            })}

                            <WhyChooseXpertBid />
                            <SeoContentSection />
                     </div>
              </AppLayout>
       );
}
