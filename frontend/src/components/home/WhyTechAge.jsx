import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Target, BarChart3, GraduationCap, Microscope, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const WhyJobladda = () => {
  const navigate = useNavigate();

  const hiddenChallenges = [
    "Apply to the wrong roles",
    "Have weak positioning",
    "Don’t understand what recruiters look for",
    "Use CVs that never pass ATS",
    "Don’t know their real skill gaps",
    "Don’t know where to get sure job openings",
    "And nobody tells them the truth.",
  ];

  const solutions = [
    {
      icon: Target,
      title: "Job Readiness Assessment",
      description: "Discover why applications fail with our comprehensive test.",
    },
    {
      icon: BarChart3,
      title: "Actionable Insights",
      description: "Clear steps tailored to your specific career path.",
    },
    {
      icon: GraduationCap,
      title: "Strategic Courses",
      description: "Improve your skills, profile, and positioning effectively.",
    },
    {
      icon: Microscope,
      title: "Job Microscope",
      description: "Shows you how to find jobs not posted publicly.",
    },
    {
      icon: ShieldCheck,
      title: "AI-Proof Career Edge",
      description: "Stay competitive in a rapidly changing job market.",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container-custom">
        {/* The Hidden Challenge Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-32 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              The Hidden Challenge
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
              Most job seekers are flying blind.
            </h2>
            <div className="space-y-4">
              {hiddenChallenges.map((challenge, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  </div>
                  <p className="text-lg text-muted-foreground">{challenge}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border-2 border-border">
              <img
                src="/images/frustrated_jobseeker.jpg"
                alt="Frustrated job seeker"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decortive element */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-secondary-500 rounded-full opacity-20 blur-2xl" />
          </div>
        </div>

        {/* Our Solution Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 text-sm font-medium mb-4">
            <CheckCircle2 className="w-4 h-4" />
            Our Solution
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            A structured path. Measurable progress. Real results.
          </h2>
          <p className="text-lg text-muted-foreground">
            No guessing. No frustration. Only clarity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <Card
              key={index}
              className="border-2 hover:border-secondary-200 hover:shadow-lg transition-all duration-300 group"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-secondary-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <solution.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {solution.title}
                  </h3>
                  <p className="text-muted-foreground">{solution.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="flex items-center justify-center p-6 bg-secondary-50 dark:bg-secondary-900/10 rounded-xl border-2 border-dashed border-secondary-200">
             <p className="text-center font-medium text-secondary-600">
               And more specialized paths launching monthly.
             </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <Button
            size="lg"
            onClick={() => navigate("/register")}
            className="bg-secondary-500 hover:bg-secondary-600 text-white px-10 h-14 text-lg rounded-full"
          >
            Start Your Free Readiness Test Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WhyJobladda;
