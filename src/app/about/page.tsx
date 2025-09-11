import Image from 'next/image';

export default function About() {
  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Header */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-black">
            About
          </h1>
        </div>
      </section>

      {/* About Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* Artist Photo */}
            <div className="w-full max-w-sm mx-auto lg:mx-0 mb-6 lg:mb-0">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/images/artist/artist-photo.jpg"
                  alt="Artist portrait"
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 400px"
                  className="object-cover baroque-border baroque-shadow"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
            </div>

            {/* Bio Content */}
            <div className="space-y-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg font-light mb-6">
                  Painting is for me a spontaneous expression of what I am and what I find beautiful. Sometimes ugly, too.
                </p>
                
                <p className="text-gray-700 leading-relaxed text-lg font-light mb-6">
                  I greatly enjoy the experience of painting with oil, for it is my favoritte technique. But experimenting other means is very important to me.
                  I am attentive to detail, although finding not being super academic or orthodox a key element of my style.
                </p>

                <p className="text-gray-700 leading-relaxed text-lg font-light">
                  Born and raised in Brazil, I have learned to love art from my Mom. Love that I keep feeding with all the artistic expressions I am privileged to come accross.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}