// src/pages/Home.jsx
import HeroSection from '../components/home/HeroSection';
import WhyTechAge from '../components/home/WhyTechAge';
import FeaturedCourses from '../components/home/FeaturedCourses';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';
import Stats from '../components/home/Stats';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Stats />
      <WhyTechAge />
      <FeaturedCourses />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Home;