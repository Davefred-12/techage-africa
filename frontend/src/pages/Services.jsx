// ============================================
// FILE: src/pages/Services.jsx
// ============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code,
  FileText,
  Search,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Megaphone
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import TalkToExpertModal from '../components/modals/TalkToExpertModal';

const Services = () => {
  const navigate = useNavigate();
  const isVisible = true;
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const services = [
    {
      id: 'content-writing',
      title: 'Content Writing and Management',
      icon: FileText,
      shortDesc: 'Strategic content that engages and converts',
      description: 'Transform your brand\'s voice with professional content writing and management services. We create compelling, SEO-optimized content that resonates with your audience and drives engagement. From blog posts and articles to social media content and email campaigns, our expert writers craft messages that tell your story and achieve your business goals. We also provide comprehensive content management, ensuring consistency, quality, and timely delivery across all your platforms.',
      images: [
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&h=500&fit=crop'
      ],
      features: [
        'Blog Posts & Articles',
        'Website Content & Copy',
        'Social Media Content',
        'Email Marketing Campaigns',
        'Content Strategy & Planning',
        'Editorial Calendar Management'
      ],
      stats: { projects: '500+', rating: 4.9, clients: '300+' },
      popular: true,
    },
    {
      id: 'marketing-pr',
      title: 'Business and Personal Brand Marketing & PR',
      icon: Megaphone,
      shortDesc: 'Build a brand that stands out and gets noticed',
      description: 'Elevate your business or personal brand with our comprehensive marketing and PR services. We develop strategic campaigns that increase visibility, build credibility, and drive growth. Our team combines traditional PR tactics with modern digital marketing strategies to create a powerful brand presence. From media relations and press releases to influencer partnerships and brand storytelling, we position you as a leader in your industry and connect you with your target audience.',
      images: [
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop'
      ],
      features: [
        'Brand Strategy & Positioning',
        'Media Relations & Press Releases',
        'Social Media Marketing',
        'Influencer Partnerships',
        'Crisis Management',
        'Personal Brand Development'
      ],
      stats: { projects: '350+', rating: 4.8, clients: '250+' },
      popular: false,
    },
    {
      id: 'seo-visibility',
      title: 'SEO and Visibility Management',
      icon: Search,
      shortDesc: 'Dominate search results and maximize online visibility',
      description: 'Boost your online presence and outrank competitors with our comprehensive SEO and visibility management services. We implement data-driven strategies that improve your search rankings, increase organic traffic, and enhance your digital footprint. Our experts conduct thorough keyword research, technical audits, and competitive analysis to create customized SEO solutions. We also manage your online reputation, optimize local search presence, and ensure your brand is visible across all relevant platforms.',
      images: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=500&fit=crop'
      ],
      features: [
        'Keyword Research & Analysis',
        'Technical SEO Optimization',
        'On-Page & Off-Page SEO',
        'Local SEO & Google My Business',
        'Link Building Strategy',
        'Analytics & Performance Tracking'
      ],
      stats: { projects: '400+', rating: 4.9, clients: '280+' },
      popular: false,
    },
    {
      id: 'web-app-development',
      title: 'Website and App Development',
      icon: Code,
      shortDesc: 'Build powerful digital solutions that scale',
      description: 'Transform your digital vision into reality with our expert website and app development services. We create responsive, high-performance web applications and mobile apps using cutting-edge technologies like React, Next.js, React Native, and Node.js. From sleek landing pages to complex enterprise applications, we deliver solutions that are beautiful, functional, and scalable. Our development process focuses on user experience, performance optimization, and seamless integration with your business systems.',
      images: [
        'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop'
      ],
      features: [
        'Custom Website Development',
        'Mobile App Development (iOS & Android)',
        'E-commerce Solutions',
        'Progressive Web Apps (PWA)',
        'API Development & Integration',
        'Maintenance & Support'
      ],
      stats: { projects: '300+', rating: 5.0, clients: '200+' },
      popular: false,
    },
  ];

  const nextImage = (serviceId) => {
    setCurrentImageIndex(prev => {
      const service = services.find(s => s.id === serviceId);
      const current = prev[serviceId] || 0;
      return {
        ...prev,
        [serviceId]: (current + 1) % service.images.length
      };
    });
  };

  const prevImage = (serviceId) => {
    setCurrentImageIndex(prev => {
      const service = services.find(s => s.id === serviceId);
      const current = prev[serviceId] || 0;
      return {
        ...prev,
        [serviceId]: current === 0 ? service.images.length - 1 : current - 1
      };
    });
  };

  const openModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white py-20">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6 animate-bounce">
              <Sparkles className="h-4 w-4" />
              <span>Transform Your Business</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Professional digital solutions to grow your business and reach your goals
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <CheckCircle className="h-4 w-4" />
                <span>Expert Team</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Clock className="h-4 w-4" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Award className="h-4 w-4" />
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid - Separated Image and Content */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive range of digital services designed to help your business thrive
            </p>
          </div>

          <div className="max-w-7xl mx-auto space-y-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              const currentImg = currentImageIndex[service.id] || 0;
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={service.id}
                  className={`transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Image Card - Only contains carousel */}
                    <div className={`${!isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <Card className="relative h-96 overflow-hidden bg-muted group shadow-2xl rounded-2xl border-0">
                        {service.popular && (
                          <div className="absolute top-4 right-4 z-20">
                            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                              <Star className="h-3 w-3 fill-current" />
                              Most Popular
                            </div>
                          </div>
                        )}

                        {/* Images */}
                        <div className="relative h-full">
                          {service.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${service.title} ${idx + 1}`}
                              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                                idx === currentImg ? 'opacity-100' : 'opacity-0'
                              }`}
                            />
                          ))}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>

                        {/* Navigation Buttons */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage(service.id);
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                        >
                          <ChevronLeft className="h-5 w-5 text-gray-800" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage(service.id);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                        >
                          <ChevronRight className="h-5 w-5 text-gray-800" />
                        </button>

                        {/* Dots Indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                          {service.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(prev => ({ ...prev, [service.id]: idx }));
                              }}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                idx === currentImg 
                                  ? 'bg-white w-6' 
                                  : 'bg-white/60 hover:bg-white/80'
                              }`}
                            />
                          ))}
                        </div>
                      </Card>
                    </div>

                    {/* Content - Outside the card */}
                    <div className={`space-y-6 ${!isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      {/* Icon & Title */}
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform duration-300">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl lg:text-3xl font-heading font-bold mb-1">
                            {service.title}
                          </h3>
                          <p className="text-sm text-muted-foreground font-medium">
                            {service.shortDesc}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-6 pb-6 border-b">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary-600">{service.stats.projects}</div>
                          <div className="text-xs text-muted-foreground">Projects</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary-600 flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {service.stats.rating}
                          </div>
                          <div className="text-xs text-muted-foreground">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary-600">{service.stats.clients}</div>
                          <div className="text-xs text-muted-foreground">Clients</div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-3">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="leading-tight">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Button
                        onClick={() => openModal(service)}
                        className="w-full lg:w-auto bg-gradient-to-r from-primary-600 to-secondary-600 h-12 px-8 group/btn"
                      >
                        Talk to an Expert
                        <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's discuss your project and create something amazing together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white"
                onClick={() => navigate('/contact')}
              >
                Get Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/about')}
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Talk to Expert Modal */}
      <TalkToExpertModal
        isOpen={isModalOpen}
        onClose={closeModal}
        service={selectedService}
        allServices={services}
      />
    </div>
  );
};

export default Services;