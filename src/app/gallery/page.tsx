'use client';

import Image from 'next/image';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface Painting {
  id: number;
  title: string;
  year: number;
  size: string;
  technique: string;
  filename: string;
  category: 'still_life' | 'human_figure' | 'others';
}

const paintings: Painting[] = [
  // Still Life
  { id: 1, title: "Still Life 1", year: 2025, size: "", technique: "Oil on canvas", filename: "still_life_1.jpeg", category: "still_life" },
  { id: 6, title: "Coronel Aureliano Buendia", year: 2022, size: "", technique: "Oil on canvas", filename: "coronel_aureliano_buendia.JPG", category: "human_figure" },
  { id: 3, title: "Still Life 3", year: 2024, size: "", technique: "Oil on canvas", filename: "still_life_3.jpeg", category: "still_life" },

  { id: 10, title: "Ursula Iguaran", year: 2022, size: "", technique: "Oil on canvas", filename: "ursula_iguaran.jpg", category: "human_figure" },

  { id: 11, title: "Venus", year: 2024, size: "", technique: "Oil on canvas", filename: "venus.JPG", category: "human_figure" },

  { id: 5, title: "Cangaceiro", year: 2022, size: "", technique: "Digital Art", filename: "cangaceiro.jpeg", category: "human_figure" },
  { id: 7, title: "Homem Que Vi Na Praca", year: 2022, size: "", technique: "Oil on canvas", filename: "homem_que_vi_na_praca.jpeg", category: "human_figure" },
  { id: 8, title: "Melquiades", year: 2024, size: "", technique: "Oil on canvas", filename: "melquiades.PNG", category: "human_figure" },
  { id: 2, title: "Still Life 2", year: 2024, size: "", technique: "Oil on canvas", filename: "still_life_2.jpeg", category: "still_life" },

  { id: 9, title: "Morte De Jose Arcadio", year: 2022, size: "", technique: "Oil on canvas", filename: "morte_de_jose_arcadio.jpg", category: "human_figure" },
  { id: 17, title: "Derretimento", year: 2021, size: "", technique: "Oil on canvas", filename: "rosto.jpg", category: "human_figure" },
  { id: 18, title: "Sangue", year: 2021, size: "", technique: "Oil on canvas", filename: "sangue.jpg", category: "human_figure" },
  { id: 4, title: "MBGA", year: 2022, size: "", technique: "Mixed Media", filename: "MBGA.jpeg", category: "human_figure" },
  
  // Others
  { id: 12, title: "Brabo", year: 2021, size: "", technique: "Digital Art", filename: "brabo.jpeg", category: "others" },
  { id: 13, title: "Cinema Sao Luiz", year: 2021, size: "", technique: "Oil on canvas", filename: "cinema_sao_luiz.jpeg", category: "others" },
  { id: 14, title: "I Dont Like Rain", year: 2020, size: "", technique: "Mixed Media", filename: "i_dont_like_rain.jpeg", category: "others" },
  { id: 15, title: "Lisboa", year: 2020, size: "", technique: "Oil on canvas", filename: "lisboa.jpeg", category: "others" },
  { id: 16, title: "Pathetic", year: 2021, size: "", technique: "Mixed Media", filename: "pathetic.jpeg", category: "others" },
  { id: 19, title: "Santa", year: 2021, size: "", technique: "Digital Art", filename: "santa.jpg", category: "others" },
];

const categoryLabels = {
  still_life: "Still Life",
  human_figure: "Human Figure", 
  others: "Other Works"
};

const techniqueLabels = {
  "Oil on canvas": "Oil on Canvas",
  "Digital Art": "Digital Art",
  "Mixed Media": "Mixed Media"
};

export default function Gallery() {
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<'all' | 'still_life' | 'human_figure' | 'others'>('all');
  const [activeTechnique, setActiveTechnique] = useState<'all' | 'Oil on canvas' | 'Digital Art' | 'Mixed Media'>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredPaintings = paintings.filter(painting => {
    const categoryMatch = activeCategory === 'all' || painting.category === activeCategory;
    const techniqueMatch = activeTechnique === 'all' || painting.technique === activeTechnique;
    return categoryMatch && techniqueMatch;
  });

  const openLightbox = (painting: Painting) => {
    console.log('Opening lightbox for:', painting.title);
    setSelectedPainting(painting);
    setCurrentIndex(filteredPaintings.findIndex(p => p.id === painting.id));
  };

  const closeLightbox = () => {
    setSelectedPainting(null);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredPaintings.length - 1;
    setCurrentIndex(newIndex);
    setSelectedPainting(filteredPaintings[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex < filteredPaintings.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedPainting(filteredPaintings[newIndex]);
  };

  const categories = ['all', 'still_life', 'human_figure', 'others'] as const;

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Header */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-black mb-4 sm:mb-6">
            Gallery
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto mb-8 sm:mb-12">
            A collection of Artworks, showcasing my journey through oil, acrylic, and digital painting.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Toggle Button */}
          <div className="text-center mb-6">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 baroque-border text-black font-light hover:bg-black hover:text-white elegant-transition text-sm sm:text-base"
            >
              <Filter size={16} className="sm:w-5 sm:h-5" />
              <span>Filters</span>
              {filtersOpen ? (
                <ChevronUp size={16} className="sm:w-5 sm:h-5" />
              ) : (
                <ChevronDown size={16} className="sm:w-5 sm:h-5" />
              )}
            </button>
          </div>

          {/* Collapsible Filter Content */}
          {filtersOpen && (
            <div className="space-y-6 sm:space-y-8">
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-medium text-black mb-3 text-center">Filter by Category</h3>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-light elegant-transition ${
                        activeCategory === category
                          ? 'bg-black text-white'
                          : 'baroque-border text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : categoryLabels[category as keyof typeof categoryLabels]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technique Filter */}
              <div>
                <h3 className="text-sm font-medium text-black mb-3 text-center">Filter by Technique</h3>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {(['all', 'Oil on canvas', 'Digital Art', 'Mixed Media'] as const).map((technique) => (
                    <button
                      key={technique}
                      onClick={() => setActiveTechnique(technique)}
                      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-light elegant-transition ${
                        activeTechnique === technique
                          ? 'bg-black text-white'
                          : 'baroque-border text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      {technique === 'all' ? 'All Techniques' : techniqueLabels[technique as keyof typeof techniqueLabels]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPaintings.map((painting) => (
              <div key={painting.id} className="group cursor-pointer" onClick={() => openLightbox(painting)}>
                <div className="relative aspect-[4/5] mb-4 overflow-hidden baroque-border">
                  <Image
                    src={`/images/gallery/${painting.category}/${painting.filename}`}
                    alt={painting.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 elegant-transition"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                </div>
                <h3 className="text-base sm:text-lg font-light text-black mb-1">
                  {painting.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700">
                  {painting.technique}, {painting.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedPainting && (
        <div
          className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl max-h-full w-full"
            onClick={(e) => e.stopPropagation()}
          >
              <div className="relative aspect-[4/5] w-full max-h-[80vh] baroque-border">
                <Image
                  src={`/images/gallery/${selectedPainting.category}/${selectedPainting.filename}`}
                  alt={selectedPainting.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h3 className="text-lg sm:text-xl font-light text-white mb-2">
                  {selectedPainting.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300">
                  {selectedPainting.technique}, {selectedPainting.year}
                </p>
              </div>

              {/* Navigation buttons */}
              <button
                onClick={goToPrevious}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-2 elegant-transition"
              >
                <ChevronLeft size={24} className="sm:w-8 sm:h-8" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-2 elegant-transition"
              >
                <ChevronRight size={24} className="sm:w-8 sm:h-8" />
              </button>

              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white hover:text-gray-300 p-2 elegant-transition"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
          </div>
        </div>
      )}
    </div>
  );
}