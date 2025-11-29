// ============================================
// FILE: src/components/home/WhyTechAge.jsx
// ============================================
import { useNavigate } from "react-router-dom";
import { Target, Rocket, Users, Globe, Zap, Shield } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const WhyTechAge = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Africa-Focused",
      description:
        "Courses designed specifically for African learners, addressing local challenges and opportunities in the digital economy.",
    },
    {
      icon: Rocket,
      title: "Career Ready",
      description:
        "Practical, hands-on training that prepares you for real-world digital careers and remote work opportunities.",
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description:
        "Learn from experienced professionals and entrepreneurs who have succeeded in their respective fields.",
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description:
        "Access international job markets and remote work opportunities from anywhere in Africa.",
    },
    {
      icon: Zap,
      title: "Fast-Track Learning",
      description:
        "Accelerated courses that get you job-ready faster, without compromising on quality or depth.",
    },
    {
      icon: Shield,
      title: "Lifetime Access",
      description:
        "Once enrolled, get lifetime access to course materials and updates at no additional cost.",
    },
  ];

  return (
    <section className="py-20 md:py-32">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Why Choose TechAge Africa?
          </h2>
          <p className="text-lg text-muted-foreground">
            We're more than just an ed-tech platform. We're building Africa's
            digital future, one learner at a time.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col md:flex-row items-center gap-4 p-8 rounded-2xl bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border">
            <div className="text-left flex-1">
              <h3 className="text-2xl font-bold mb-2">
                Ready to Start Your Journey?
              </h3>
              <p className="text-muted-foreground">
                Join thousands of Africans transforming their careers through
                digital skills.
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => navigate("/about")}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Know more about us{" "}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyTechAge;
