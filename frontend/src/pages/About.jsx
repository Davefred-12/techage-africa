// ============================================
// FILE: src/pages/About.jsx
// ============================================
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Target,
  Eye,
  Heart,
  Users,
  TrendingUp,
  Award,
  Globe,
  Rocket,
  ArrowRight,
  Quote,
  CheckCircle,
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Target,
      title: "Africa-Focused",
      description:
        "Building solutions specifically designed for African learners and their unique challenges.",
    },
    {
      icon: Heart,
      title: "Accessibility",
      description:
        "Democratizing digital education to make it affordable and accessible to everyone.",
    },
    {
      icon: TrendingUp,
      title: "Excellence",
      description:
        "Delivering high-quality, practical education that transforms careers and lives.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building a supportive network of learners, instructors, and industry professionals.",
    },
  ];

  const milestones = [
    {
      year: "2019",
      title: "The Beginning",
      description: "Started with WhatsApp forums engaging 557 youth members.",
      icon: "🌱",
    },
    {
      year: "2020-2024",
      title: "Growth Phase",
      description: "Trained over 2,000+ youths in digital skills and online safety.",
      icon: "📈",
    },
    {
      year: "2025",
      title: "Going Public",
      description: "Launched full digital platform to scale our impact across Africa.",
      icon: "🚀",
    },
    {
      year: "Future",
      title: "The Vision",
      description: "Training 100,000+ Africans and launching startup accelerator.",
      icon: "✨",
    },
  ];

  const goals = [
    {
      icon: Users,
      goal: "100,000+",
      description: "Africans trained in digital skills",
    },
    {
      icon: Award,
      goal: "10,000+",
      description: "Job & internship placements",
    },
    {
      icon: Rocket,
      goal: "10+",
      description: "Startups accelerated",
    },
    {
      icon: Globe,
      goal: "5+",
      description: "African countries reached",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-primary-900/20 dark:via-background dark:to-secondary-900/20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <Badge className="text-sm px-4 py-2 animate-fade-in">About TechAge Africa</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight animate-fade-in-up animation-delay-200">
              Accelerating Africa's{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                Tech Advantage
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-fade-in-up animation-delay-400">
              We believe Africa's greatest asset is its people — youthful,
              creative, and hungry for opportunity. Since 2019, we've been
              empowering African youth with the digital skills needed to thrive
              in the global economy.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "2000+", label: "Students Trained", color: "text-primary-600", delay: "0" },
              { value: "6+", label: "Years Experience", color: "text-secondary-600", delay: "100" },
              { value: "95%", label: "Success Rate", color: "text-accent-600", delay: "200" },
              { value: "12+", label: "Expert Courses", color: "text-primary-600", delay: "300" },
            ].map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${stat.delay}ms` }}>
                <CardContent className="p-6">
                  <p className={`text-4xl font-bold ${stat.color} animate-scale-in`}>{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey - Horizontal Timeline */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              From humble beginnings to transforming thousands of lives
            </p>
          </div>

          {/* Horizontal Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 transform -translate-y-1/2"></div>

            <div className="grid md:grid-cols-4 gap-6">
              {milestones.map((milestone, index) => (
                <Card
                  key={index}
                  className="relative hover:shadow-2xl transition-all group animate-fade-in-up hover:-translate-y-2"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Timeline Dot */}
                  <div className="hidden md:block absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform animate-bounce-in" style={{ animationDelay: `${index * 150}ms` }}>
                      <span className="text-2xl">{milestone.icon}</span>
                    </div>
                  </div>

                  <CardContent className="p-6 mt-8 text-center space-y-3">
                    <Badge variant="secondary" className="text-xs font-bold">
                      {milestone.year}
                    </Badge>
                    <h3 className="text-lg font-bold">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {milestone.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Vision */}
            <Card className="border-2 hover:border-primary-300 transition-all group animate-fade-in-left hover:shadow-2xl">
              <CardContent className="p-8 lg:p-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold">Our Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base">
                  To accelerate Africa's tech advantage by equipping millions
                  with skills, tools, and opportunities to thrive in the digital
                  economy. We envision a continent where access to global tech
                  innovation is borderless, inclusive, and scalable.
                </p>
                <div className="pt-4 space-y-2">
                  {["Borderless tech access", "Inclusive digital economy", "Scalable solutions"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm animate-fade-in-left" style={{ animationDelay: `${i * 100 + 300}ms` }}>
                      <CheckCircle className="w-4 h-4 text-primary-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="border-2 hover:border-secondary-300 transition-all group animate-fade-in-right hover:shadow-2xl">
              <CardContent className="p-8 lg:p-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base">
                  To democratize access to digital skills, improve business
                  visibility for African brands, and prepare the next generation
                  of startups for global relevance. We empower youth and
                  professionals through accessible, practical education.
                </p>
                <div className="pt-4 space-y-2">
                  {["Democratize digital skills", "Empower African brands", "Prepare future startups"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm animate-fade-in-right" style={{ animationDelay: `${i * 100 + 300}ms` }}>
                      <CheckCircle className="w-4 h-4 text-secondary-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <Card className="overflow-hidden border-2 animate-fade-in-up hover:shadow-2xl transition-shadow">
            <div className="grid lg:grid-cols-2">
              {/* Founder Image */}
              <div className="relative h-64 lg:h-auto overflow-hidden group">
                <img
                  src="/images/clint.jpg"
                  alt="Clinton Nwachukwu - Founder of TechAge Africa"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent lg:bg-gradient-to-r"></div>
              </div>

              {/* Founder Info */}
              <CardContent className="p-8 lg:p-12 space-y-6 animate-fade-in-right">
                <Badge className="mb-2">Meet The Founder</Badge>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-2">
                    Clinton Nwachukwu
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Founder & CEO, TechAge Africa
                  </p>
                </div>

                <div className="relative pl-6 border-l-4 border-primary-600">
                  <Quote className="absolute -left-3 top-0 w-6 h-6 text-primary-600 bg-background" />
                  <p className="text-muted-foreground leading-relaxed italic">
                    "I started TechAge Africa with a simple belief: that every
                    African youth deserves access to quality digital education.
                    What began as WhatsApp forums has grown into a movement
                    that's transforming lives across the continent."
                  </p>
                </div>

                <div className="space-y-3 text-sm lg:text-base">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">
                      Entrepreneur, Educator, and Digital Marketer
                    </strong>{" "}
                    with over 6 years of experience training 2000+ youths
                    across Africa in digital skills, online safety, and career
                    development.
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="hover:shadow-2xl hover:border-primary-200 transition-all group animate-fade-in-up hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all shadow-lg">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Goals 2028 */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <Badge className="mb-4">Our Goals by 2028</Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Building Africa's Digital Future
            </h2>
            <p className="text-lg text-muted-foreground">
              We're committed to creating measurable impact across Africa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {goals.map((item, index) => (
              <Card
                key={index}
                className="relative overflow-hidden group hover:shadow-2xl transition-all border-2 hover:border-primary-200 animate-fade-in-up hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                <CardContent className="p-6 relative z-10 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <p className="text-4xl font-bold text-foreground">{item.goal}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-96 h-96 bg-white rounded-full -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-white rounded-full -bottom-48 -right-48 animate-pulse animation-delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white space-y-8 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
              Join the Movement to Transform Africa's Tech Future
            </h2>
            <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
              Whether you want to learn, grow your business, or support our
              mission — there's a place for you at TechAge Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="secondary"
                className="text-base group shadow-2xl hover:scale-105 transition-transform animate-fade-in-up animation-delay-200"
                onClick={() => navigate("/courses")}
              >
                Browse Courses
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base bg-white/10 hover:bg-white/20 text-white border-white/30 group shadow-2xl hover:scale-105 transition-transform animate-fade-in-up animation-delay-400"
                onClick={() => navigate("/contact")}
              >
                Get In Touch
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 10px) scale(1.05); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }

        .animate-blob {
          animation: blob 8s infinite;
        }

        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default About