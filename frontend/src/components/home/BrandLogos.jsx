// src/components/home/BrandLogos.jsx
const brands = [
  "Flutterwave",
  "Paystack",
  "Andela",
  "Carbon",
  "Paga",
  "BingX",
  "Yellow Card",
  "Vendease",
  "Skyhub",
  "Jobberman",
];

const BrandLogos = () => {
  return (
    <section className="w-full bg-[#f3f4f6] py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Label */}
        <p className="text-center text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8 md:mb-10">
          Our users are building careers at the best companies
        </p>

        {/* Brand names — scrollable on mobile, single row on desktop */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 sm:gap-x-8 md:gap-x-10 lg:gap-x-12">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-lg sm:text-xl md:text-2xl font-bold text-gray-300 hover:text-gray-400 transition-colors duration-200 whitespace-nowrap cursor-default select-none"
            >
              {brand}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BrandLogos;