import { CheckCircle2, Zap, BarChart3, Target } from "lucide-react";

const OurSolution = () => {
  const solutions = [
    {
      title: "Job Readiness Assessment",
      description: "Discover why applications fail with our AI-powered scanner.",
      icon: BarChart3,
      color: "blue"
    },
    {
      title: "Actionable Insights",
      description: "Clear steps tailored to your career path and skill level.",
      icon: Zap,
      color: "orange"
    },
    {
      title: "Strategic Growth",
      description: "Focused 14-day path to bridge your specific career gaps.",
      icon: Target,
      color: "purple"
    },
    {
      title: "Real Results",
      description: "Land interviews faster with a CV that recruiters actually love.",
      icon: CheckCircle2,
      color: "green"
    }
  ];

  return (
    <section className="py-24 bg-[#111827] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary-500/10 border border-secondary-500/20 px-4 py-2 rounded-full mb-6">
            <span className="text-sm font-bold text-secondary-500 uppercase tracking-widest">
              Our Solution
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6 leading-tight">
            A structured path. Measurable progress. Real results.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutions.map((item, index) => (
            <div key={index} className="bg-gray-800/40 border border-gray-700/50 p-8 rounded-[2rem] hover:border-gray-600 transition-all hover:-translate-y-2 group">
              <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-${item.color}-500/20 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-8 h-8 text-${item.color}-500`} />
              </div>
              <h3 className="text-xl font-black text-white mb-3 leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-400 font-medium leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurSolution;
