// src/pages/Home.jsx
import HeroSection from "../components/home/HeroSection";
import WhyTechAge from "../components/home/WhyTechAge";
import FeaturedCourses from "../components/home/FeaturedCourses";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";
import Stats from "../components/home/Stats";
import BrandLogos from "../components/home/BrandLogos";

const Home = () => {
  return (
    <div className="min-h-screen">
      <div data-aos="fade-up">
        <HeroSection />
      </div>
      <div data-aos="fade-left" data-aos-delay="50">
        <Stats />
      </div>
      <div data-aos="fade-right" data-aos-delay="100">
        <WhyTechAge />
      </div>
      <div data-aos="fade-left" data-aos-delay="150">
        <FeaturedCourses />
      </div>
      <div data-aos="fade-right" data-aos-delay="200">
        <Testimonials />
      </div>
      <div data-aos="fade-left" data-aos-delay="250">
        <BrandLogos />
      </div>
      <div data-aos="fade-right" data-aos-delay="300">
        <Newsletter />
      </div>
    </div>
  );
};

export default Home;
