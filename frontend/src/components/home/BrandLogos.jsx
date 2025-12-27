import { useState } from "react";

const BrandLogos = () => {
  const [isPaused, setIsPaused] = useState(false);

  // Add your brand logos here - just add the filename from public/images/
  const brands = [
    {
      name: "VentureBurn",
      logo: "/images/ven.svg",
      url: "https://ventureburn.com/",
    },
    {
      name: "Nuvosphere",
      logo: "/images/nuvo.svg",
      url: "https://www.nuvosphere.io/",
    },
    {
      name: "Integra",
      logo: "/images/Integra.jpg",
      url: "https://integra.ng/",
    },
    {
      name: "ChainPlay",
      logo: "/images/chain.svg",
      url: "https://chainplay.gg/",
    },
    {
      name: "Cadremit",
      logo: "/images/cadremit.svg",
      url: "https://cadremit.com/",
    },
    {
      name: "YellowCard",
      logo: "/images/yellow.svg",
      url: "https://yellowcard.io/",
    },
    {
      name: "BingX",
      logo: "/images/bing.png",
      url: "https://bingx.com/en",
    },
    {
      name: "NuDEX Exchange",
      logo: "/images/nunu.png",
      url: "https://nudex.io/",
    },
    {
      name: "Connectopia",
      logo: "/images/connect.jpg",
      url: "https://www.instagram.com/connectopia/?hl=en",
    },
     {
      name: "The Coin Times",
      logo: "/images/coin.jpg",
      url: "https://www.linkedin.com/company/the-coin-times/?originalSubdomain=uk",
    },
  ];

  // Duplicate brands for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Trusted By Industry Leaders</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
            Brands We've Worked With
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Partnering with leading companies to deliver exceptional results
            across various industries
          </p>
        </div>

        {/* Scrolling Logos - No Cards, Bigger Size */}
        <div className="relative">
          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling container */}
          <div
            className="flex gap-20 py-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className={`flex gap-20 animate-scroll ${
                isPaused ? "paused" : ""
              }`}
            >
              {duplicatedBrands.map((brand, index) => (
                <a
                  key={`${brand.name}-${index}`}
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-44 h-28 md:w-56 md:h-32 flex items-center justify-center p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 group transition-all duration-300 hover:shadow-lg"
                  title={brand.name}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback to text if image fails
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `<span class="text-sm font-semibold text-foreground group-hover:text-primary-600 transition-colors">${brand.name}</span>`;
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row - Using Blue Theme */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="text-center p-4 rounded-lg bg-card border border-border hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              10+
            </div>
            <div className="text-sm text-muted-foreground">Brands Served</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-card border border-border hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              150%
            </div>
            <div className="text-sm text-muted-foreground">Avg. Growth</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-card border border-border hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              4M+
            </div>
            <div className="text-sm text-muted-foreground">Page Views</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-card border border-border hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              100%
            </div>
            <div className="text-sm text-muted-foreground">
              Client Satisfaction
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 45s linear infinite;
        }

        .animate-scroll.paused {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default BrandLogos;
