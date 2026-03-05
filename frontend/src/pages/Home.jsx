// src/pages/Home.jsx
import { Helmet } from "react-helmet-async";
import HeroSection from "../components/home/HeroSection";
import HiddenChallenge from "../components/home/HiddenChallenge";
import OurSolution from "../components/home/OurSolution";
import FeaturedCourses from "../components/home/FeaturedCourses";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";
import BrandLogos from "../components/home/BrandLogos";
import { CheckCircle2, Users, Briefcase, GraduationCap, Globe } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Take the Job Readiness Test",
      description: "Free, fast, and personalized assessment of your current career standing.",
    },
    {
      number: "02",
      title: "See your score and major gaps",
      description: "Get immediate clarity on what's holding your applications back.",
    },
    {
      number: "03",
      title: "Upgrade to the full report",
      description: "Fix weaknesses with actionable steps and deep insights tailored for you.",
    },
    {
      number: "04",
      title: "Follow our structured plan",
      description: "Track progress and start landing interviews with confidence.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            Stop wondering why you're not getting hired. Follow these 4 simple steps.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative p-8 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow">
              <span className="text-5xl font-black text-secondary-500/10 absolute top-4 right-6">
                {step.number}
              </span>
              <h3 className="text-xl font-black mb-3 relative z-10">{step.title}</h3>
              <p className="text-muted-foreground relative z-10">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" className="bg-secondary-500 hover:bg-secondary-600 text-white rounded-full px-10 h-14 font-bold shadow-lg">
            Take the Free Test Today
          </Button>
        </div>
      </div>
    </section>
  );
};

const WhoItsFor = () => {
  const targets = [
    {
      icon: GraduationCap,
      label: "Graduates entering the workforce",
    },
    {
      icon: Briefcase,
      label: "Career switchers exploring opportunities",
    },
    {
      icon: Users,
      label: "Mid-level professionals seeking promotion",
    },
    {
      icon: Globe,
      label: "Remote job seekers facing global competition",
    },
  ];

  const navigate = useNavigate();

  return (
    <section className="py-20">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-12">Who It’s For</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {targets.map((target, index) => (
            <div key={index} className="flex flex-col items-center p-6 rounded-2xl border bg-card hover:bg-primary-50/50 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-secondary-500/10 flex items-center justify-center mb-4">
                <target.icon className="w-8 h-8 text-secondary-500" />
              </div>
              <p className="font-black text-xl text-[#111827]">{target.label}</p>
            </div>
          ))}
        </div>
        <div className="max-w-4xl mx-auto p-10 rounded-3xl bg-secondary-500 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl md:text-5xl font-black mb-4">Your next job opportunity starts here.</h3>
            <p className="text-xl mb-8 opacity-90 font-medium text-white/80">JobLadda is structured, practical, and designed to get you results.</p>
            <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-[#111827] hover:bg-white/90 rounded-full px-12 h-16 text-xl font-black shadow-xl"
                onClick={() => navigate("/register")}
            >
                Take the Test Today
            </Button>
          </div>
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Discover Why You’re Not Getting Hired – JobLadda Job Readiness</title>
        <meta name="description" content="Stop applying randomly. Take the JobLadda Job Readiness Test, uncover what’s holding you back, and get the career edge you need to land interviews faster." />
      </Helmet>
      
      <div data-aos="fade-up">
        <HeroSection />
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        <BrandLogos />
      </div>
      
      <div data-aos="fade-up" data-aos-delay="100">
        <HiddenChallenge />
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        <OurSolution />
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        <HowItWorks />
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        <WhoItsFor />
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        <FeaturedCourses />
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        <Testimonials />
      </div>

      

      <div data-aos="fade-right" data-aos-delay="100">
        <Newsletter />
      </div>
    </div>
  );
};

export default Home;
