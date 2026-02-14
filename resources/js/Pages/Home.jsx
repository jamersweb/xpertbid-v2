import AppLayout from '@/Layouts/AppLayout';
import HeroSection from '@/Components/HeroSection';
import SliderBrowseCategories from '@/Components/SliderBrowseCategories'; // Imported
import FeaturedProducts from '@/Components/FeaturedProducts'; // Imported
import VehicleSection from '@/Components/VehicleSection'; // Imported
import PropertySection from '@/Components/PropertySection'; // Imported
import AuctionSection from '@/Components/AuctionSection'; // Imported
import NormalListSection from '@/Components/NormalListSection'; // Imported
import WhyChooseXpertBid from '@/Components/WhyChooseXpertBid'; // Imported
import SeoContentSection from '@/Components/SeoContentSection'; // Imported

export default function Home({ auth, sliders, categories, featuredAuctions, latestAuctions, latestVehicles, latestProperties, latestNormalLists }) {
       return (
              <AppLayout title="Online Auction Marketplace Pakistan | Bid & Sell on XpertBid">
                     <div className="home-page overflow-x-hidden">
                            <HeroSection sliders={sliders} />
                            <SliderBrowseCategories categories={categories} />
                            <FeaturedProducts products={featuredAuctions} />
                            <VehicleSection products={latestVehicles} />
                            <PropertySection products={latestProperties} />
                            <AuctionSection products={latestAuctions} />
                            <NormalListSection products={latestNormalLists} />
                            <WhyChooseXpertBid />
                            <SeoContentSection />
                     </div>
              </AppLayout>
       );
}
