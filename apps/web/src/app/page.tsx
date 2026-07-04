import Hero from "./components/home/Hero";
import DashboardPreview from "./components/UI/DashboardPreview";
import Features from "./components/UI/FeatureSection";
import Footer from "./components/UI/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <DashboardPreview />
      <Features />
      <Footer />
    </>
  );
}
