import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="pt-14 sm:pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-white py-12 sm:py-16 lg:py-20">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Hero Image */}
          <div className="w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg lg:mx-0 mb-8 lg:mb-0">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/images/gallery/still_life/still_life_1.jpeg"
                alt="Featured oil painting"
                fill
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 400px"
                className="object-cover baroque-border baroque-shadow"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center lg:text-left px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-black mb-3 sm:mb-4 lg:mb-6">
              Luca
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-light mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
              Oil, Acrylic, Digital Painter
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-6 sm:mb-8 max-w-xs sm:max-w-sm lg:max-w-md mx-auto lg:mx-0 leading-relaxed">
              I find beauty in turning senses into colors, shape and shadows.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                href="/gallery"
                className="px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 bg-black text-white font-light hover:bg-gray-800 elegant-transition text-center text-sm sm:text-base rounded-sm"
              >
                View Gallery
              </Link>
              <Link
                href="/contact"
                className="px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 baroque-border text-black font-light hover:bg-black hover:text-white elegant-transition text-center text-sm sm:text-base"
              >
                Commission Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Works Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-black mb-3 sm:mb-4">
              Featured Works
            </h2>
          </div>

          {/* Horizontal scrollable gallery */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-4 sm:space-x-6 pb-4 min-w-max">
              {[
                { id: 1, image: "/images/gallery/still_life/still_life_1.jpeg", title: "Still Life 1" },
                { id: 2, image: "/images/gallery/human_figure/venus.JPG", title: "Venus" },
                { id: 3, image: "/images/gallery/others/brabo.jpeg", title: "Brabo" },
                { id: 4, image: "/images/gallery/still_life/still_life_2.jpeg", title: "Still Life 2" },
                { id: 5, image: "/images/gallery/human_figure/cangaceiro.jpeg", title: "Cangaceiro" },
                { id: 6, image: "/images/gallery/others/cinema_sao_luiz.jpeg", title: "Cinema Sao Luiz" },
                { id: 7, image: "/images/gallery/still_life/still_life_3.jpeg", title: "Still Life 3" },
                { id: 8, image: "/images/gallery/human_figure/coronel_aureliano_buendia.JPG", title: "Coronel Aureliano Buendia" },
                { id: 9, image: "/images/gallery/others/i_dont_like_rain.jpeg", title: "I Dont Like Rain" },
                { id: 10, image: "/images/gallery/human_figure/melquiades.PNG", title: "Melquiades" }
              ].map((item) => (
                <div key={item.id} className="group cursor-pointer flex-shrink-0 w-48 sm:w-56 lg:w-64">
                  <div className="relative aspect-[4/5] mb-3 sm:mb-4 overflow-hidden baroque-border">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 256px"
                      className="object-cover group-hover:scale-105 elegant-transition"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </div>
                  <h3 className="text-sm sm:text-base font-light text-black mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Oil on canvas, 2024
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-10 lg:mt-12">
            <Link
              href="/gallery"
              className="inline-block px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 baroque-border text-black font-light hover:bg-black hover:text-white elegant-transition text-sm sm:text-base"
            >
              View All Works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
