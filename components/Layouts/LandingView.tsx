import CTASection from "../Landing/CTASection";
import FeaturesSection from "../Landing/FeaturesSection";
import HeroSection from "../Landing/HeroSection";
import LakesSection from "../Landing/LakesSection";
import ReportsSection from "../Landing/ReportsSection";
import TrophySection from "../Landing/TrophySection";
import Navbar from "./Navbar";
import Footer from "./Footer";


export function LandingView() {
  return (
    <div className="w-full flex flex-col bg-white">
      <Navbar />
      <HeroSection />
      <LakesSection />
      <TrophySection />
      <FeaturesSection />
      <ReportsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
