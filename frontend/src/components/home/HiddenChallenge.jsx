import { XCircle } from "lucide-react";

const HiddenChallenge = () => {
  const challenges = [
    "Apply to the wrong roles",
    "Have weak positioning",
    "Don’t understand what recruiters look for",
    "Use CVs that never pass ATS",
    "Don’t know their real skill gaps",
    "Don’t know where to get sure job openings",
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-black text-[#111827] mb-6">
            The Hidden Challenge
          </h2>
          <p className="text-xl text-gray-600 font-medium">
            Most job seekers fail because they:
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => (
            <div key={index} className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-100 hover:bg-red-50/30 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-lg font-bold text-[#111827] leading-tight pt-1">
                {challenge}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
            <p className="text-2xl font-black text-red-600 italic">
                "And nobody tells them the truth."
            </p>
        </div>
      </div>
    </section>
  );
};

export default HiddenChallenge;
