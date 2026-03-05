// ============================================
// FILE: src/components/home/Testimonials.jsx
// ============================================
import { Card, CardContent } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const testimonials = [
    {
      id: 1,
      name: 'Chidinma Okafor',
      role: 'Digital Marketer',
      company: 'Lagos, Nigeria',
      image: '',
      rating: 5,
      text: 'JobLadda transformed my career! I went from zero knowledge to landing my first remote job in 3 months. The instructors are amazing and the community is so supportive.',
    },
    {
      id: 2,
      name: 'Emmanuel Adesina',
      role: 'Product Designer',
      company: 'Abuja, Nigeria',
      image: '',
      rating: 5,
      text: 'The Product Design course was exactly what I needed. Practical, hands-on, and relevant to the African market. Now I\'m designing products for international clients!',
    },
    {
      id: 3,
      name: 'Amara Nwosu',
      role: 'SEO Specialist',
      company: 'Port Harcourt, Nigeria',
      image: '',
      rating: 5,
      text: 'Best investment I\'ve made in my career. The SEO course gave me the skills to start my own digital marketing agency. Forever grateful to the TechAge team!',
    },
    {
      id: 4,
      name: 'Tunde Williams',
      role: 'AI Enthusiast',
      company: 'Ibadan, Nigeria',
      image: '',
      rating: 5,
      text: 'The AI Appreciation course opened my eyes to opportunities I never knew existed. Simple explanations, real-world examples, and actionable insights. Highly recommend!',
    },
    {
      id: 5,
      name: 'Grace Obi',
      role: 'Content Strategist',
      company: 'Enugu, Nigeria',
      image: '',
      rating: 5,
      text: 'As a career switcher, I was nervous about learning digital skills. TechAge made it so easy and accessible. The support I received was incredible!',
    },
    {
      id: 6,
      name: 'Ibrahim Musa',
      role: 'Freelance Developer',
      company: 'Kano, Nigeria',
      image: '',
      rating: 5,
      text: 'JobLadda doesn\'t just teach you skills, they prepare you for the global market. I\'m now working with clients from 3 different countries!',
    },
  ];

  return (
    <section className="py-20 md:py-32">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-500/10 text-secondary-600 text-sm font-bold mb-4">
             <Star className="w-4 h-4 fill-secondary-500 text-secondary-500" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-[#111827] mb-4">
            Hear from Career Successes
          </h2>
          <p className="text-xl text-gray-500 font-medium">
            Join thousands of professionals who have transformed their careers with JobLadda
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-primary-200">
                  <Quote className="w-8 h-8" />
                </div>

                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-muted-foreground leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Avatar>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {getInitials(testimonial.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role} • {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 p-10 rounded-3xl bg-[#111827] text-white overflow-hidden relative">
          <div className="text-center relative z-10">
            <p className="text-4xl font-black text-white">4.9/5</p>
            <p className="text-sm text-gray-400 font-bold mt-1 uppercase tracking-wider">Average Rating</p>
          </div>
          <div className="text-center relative z-10">
            <p className="text-4xl font-black text-white">2000+</p>
            <p className="text-sm text-gray-400 font-bold mt-1 uppercase tracking-wider">Happy Successes</p>
          </div>
          <div className="text-center relative z-10">
            <p className="text-4xl font-black text-white">95%</p>
            <p className="text-sm text-gray-400 font-bold mt-1 uppercase tracking-wider">Success Rate</p>
          </div>
          <div className="text-center relative z-10">
            <p className="text-4xl font-black text-white">500+</p>
            <p className="text-sm text-gray-400 font-bold mt-1 uppercase tracking-wider">Job Placements</p>
          </div>
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;