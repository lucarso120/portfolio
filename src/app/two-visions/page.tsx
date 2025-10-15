'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Instagram, Link } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { FaTiktok } from 'react-icons/fa';

interface PaintingDetails {
  id: string;
  name: string;
  filename: string;
  panel?: string;
  dimensions?: string;
  year?: string;
  technique?: string;
  place?: string;
  forSale?: boolean;
  aspectRatio?: string;
  details?: string;
}

interface Artist {
  name: string;
  folder: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
  paintings: PaintingDetails[];
}

const artists: Artist[] = [
  {
    name: "Luca",
    folder: "luca",
    instagram: "https://instagram.com/luca__rt",
    tiktok: "https://tiktok.com/@lica0011",
    paintings: [
      // Panel: plants, lighters
      { id: 'still_life_3', name: 'Still Life 3', filename: 'still_life_3.jpeg', panel: 'plants_lighters', forSale: false, details: 'Oil on canvas (20x30)' },
      { id: 'still_life_1', name: 'Still Life 1', filename: 'still_life_1.jpeg', panel: 'plants_lighters', forSale: true, details: 'Oil on canvas (20x30)' },
      // Panel: Hundred Years of Solitude collection
      { id: 'coronel_aureliano_buendia', name: 'Coronel Aureliano Buendia', filename: 'coronel_aureliano_buendia.JPG', panel: 'hundred_years', forSale: true, details: 'Oil on canvas (20x25)' },
      { id: 'ursula_iguaran', name: 'Ursula Iguaran', filename: 'ursula_iguaran.jpg', panel: 'hundred_years', forSale: true, details: 'Oil on canvas (20x25)' },
      { id: 'melquiades', name: 'Melquiades', filename: 'melquiades.PNG', panel: 'hundred_years', forSale: true, details: 'Oil on canvas (20x25)' },
      { id: 'jose_arcadio_buendia', name: 'Jose Arcadio Buendia', filename: 'jose_arcadio_buendia.jpg', panel: 'hundred_years', forSale: true, details: 'Oil on canvas (20x25)' },
      // Single paintings
      { id: 'venus', name: 'Venus', filename: 'venus.JPG', forSale: true, aspectRatio: '3/2', details: 'Oil on canvas (60x50)' },
      { id: 'calma_fogo_calma', name: 'Calma-Fogo-Calma', filename: 'calma-fogo-calma.jpeg', forSale: true, aspectRatio: '2/1', details: 'Oil on wood (70x40)' },
    ]
  },
  {
    name: "Maria Júlia",
    folder: "maria_julia",
    instagram: "https://www.instagram.com/mariajulia.rds/",
    tiktok: "https://tiktok.com/@mariajulia.rd",
    website: "https://mariajulia.figma.site/",
    paintings: [
      // Single paintings
      { id: 'maju_1', name: '1', filename: 'maju_1.png', forSale: true,details: 'Oil on canvas (60x70)' },
      { id: 'maju_2', name: '2', filename: 'maju_2.png', forSale: true, aspectRatio: "2/3", details: 'Oil on canvas (60x80)' },
      // Panel A
      { id: 'maju_a_2', name: '1', filename: 'maju_a_2.png', panel: 'a', forSale: true, details: 'Oil on canvas (30x30)' },
      { id: 'maju_a_3', name: '2', filename: 'maju_a_3.png', panel: 'a', forSale: true, details: 'Oil on canvas (40x50)' },
      // Panel B
      { id: 'maju_b_1', name: 'Cavalo', filename: 'maju_b_1.png', panel: 'b', forSale: true, details: 'Oil on canvas (30x30)' },
      { id: 'maju_b_2', name: 'Camarão', filename: 'maju_b_2.png', panel: 'b', forSale: true, details: 'Oil on canvas (20x20)' },
      { id: 'maju_b_3', name: 'Tangerina', filename: 'maju_b_3.png', panel: 'b', forSale: true, details: 'Oil on canvas (18x24)' },
      { id: 'maju_b_4', name: 'Galinha', filename: 'maju_b_4.png', panel: 'b', forSale: true, details: 'Oil on canvas (20x20)' },
    ]
  }
];

export default function TwoVisionsPage() {
  const [activeTab, setActiveTab] = useState<'luca' | 'maria_julia'>('luca');
  const [currentBids, setCurrentBids] = useState<Record<string, number>>({});
  const [selectedPaintingId, setSelectedPaintingId] = useState<string | null>(null);

  const currentArtist = artists.find(a => a.folder === activeTab)!;

  // Panel name mapping
  const panelNames: Record<string, string> = {
    'plants_lighters': 'Plants, Lighters',
    'hundred_years': 'Hundred Years of Solitude Collection',
    'a': 'Panel A',
    'b': 'Panel B',
  };

  // Fetch current bids for all paintings
  useEffect(() => {
    const fetchBids = async () => {
      const allPaintingIds = artists.flatMap(artist => artist.paintings.map(p => p.id));
      const bidsMap: Record<string, number> = {};

      for (const paintingId of allPaintingIds) {
        try {
          const bidsRef = collection(db, 'bids');
          const q = query(
            bidsRef,
            where('paintingId', '==', paintingId),
            orderBy('amount', 'desc'),
            limit(1)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const highestBid = querySnapshot.docs[0].data();
            bidsMap[paintingId] = highestBid.amount;
          }
        } catch (err) {
          console.error(`Error fetching bid for ${paintingId}:`, err);
        }
      }

      setCurrentBids(bidsMap);
    };

    fetchBids();
  }, []);

  // Group paintings by panel
  const groupedPaintings = currentArtist.paintings.reduce((acc, painting) => {
    if (painting.panel) {
      if (!acc[painting.panel]) {
        acc[painting.panel] = [];
      }
      acc[painting.panel].push(painting);
    } else {
      if (!acc['single']) {
        acc['single'] = [];
      }
      acc['single'].push(painting);
    }
    return acc;
  }, {} as Record<string, PaintingDetails[]>);

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Header */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-black mb-4 sm:mb-6">
            Two Visions
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto mb-8 sm:mb-5">
            Brings together the artistic perspectives of two siblings who share a passion for painting, but express
            it in distinct, complementary ways. A collaborative exhibition exploring diverse perspectives through art.

          </p>
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto mb-8 sm:mb-5">
            We invite you to experience the contrasts, resonances and dialogues between our works.
          </p>
        </div>
      </section>

      {/* Artist Tabs */}
      <section className="pb-4 sm:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-4">
            {artists.map((artist) => (
              <button
                key={artist.folder}
                onClick={() => setActiveTab(artist.folder as 'luca' | 'maria_julia')}
                className={`px-6 sm:px-8 py-3 text-base sm:text-lg font-light elegant-transition ${
                  activeTab === artist.folder
                    ? 'bg-black text-white'
                    : 'baroque-border text-black hover:bg-black hover:text-white'
                }`}
              >
                {artist.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Follow Us Section */}
      <section className="pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-light text-gray-600 mb-3">Follow {currentArtist.name}</p>
            <div className="flex justify-center gap-4">
              {currentArtist.instagram && (
                <a
                  href={currentArtist.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 baroque-border text-black hover:bg-black hover:text-white elegant-transition"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              )}
              {currentArtist.tiktok && (
                <a
                  href={currentArtist.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 baroque-border text-black hover:bg-black hover:text-white elegant-transition"
                  aria-label="TikTok"
                >
                  <FaTiktok className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              )}
              {currentArtist.website && (
                <a
                  href={currentArtist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 baroque-border text-black hover:bg-black hover:text-white elegant-transition"
                  aria-label="Website"
                >
                  <Link className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:gap-8">
            {/* Render panels */}
            {Object.entries(groupedPaintings)
              .filter(([key]) => key !== 'single')
              .map(([panelId, paintings]) => (
                <div key={panelId} className="col-span-2">
                  {/* Panel Grid - Always visible */}
                  <div className="mb-4">
                    <h3 className="text-base sm:text-lg font-light text-black mb-4 text-center">
                      {panelNames[panelId] || `Panel ${panelId.toUpperCase()}`}
                    </h3>
                    <div className="p-4 baroque-border bg-white">
                      <div className={`grid ${paintings.length === 2 ? 'grid-cols-2' : paintings.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
                        {paintings.map((painting) => (
                          <div
                            key={painting.id}
                            className="group relative"
                          >
                            <div
                              className="relative aspect-[4/5] mb-2 overflow-hidden baroque-border"
                              onClick={() => setSelectedPaintingId(selectedPaintingId === painting.id ? null : painting.id)}
                            >
                              <Image
                                src={`/images/two_visions/${currentArtist.folder}/${painting.filename}`}
                                alt={painting.name}
                                fill
                                sizes="(max-width: 640px) 50vw, 25vw"
                                className="object-cover"
                              />
                              {/* Current Bid Badge */}
                              {currentBids[painting.id] && (
                                <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 text-xs">
                                  €{currentBids[painting.id]}
                                </div>
                              )}
                              {/* Hover/Touch Overlay */}
                              <div className={`absolute inset-0 bg-black elegant-transition flex items-center justify-center
                                ${selectedPaintingId === painting.id ? 'bg-opacity-60 opacity-100' : 'bg-opacity-0 group-hover:bg-opacity-60 opacity-0 group-hover:opacity-100'}`}>
                                {painting.forSale ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (selectedPaintingId === painting.id || (typeof window !== 'undefined' && window.innerWidth >= 640)) {
                                        window.location.href = `/two-visions/bid/${painting.id}`;
                                      }
                                    }}
                                    className={`px-3 py-2 bg-white text-black text-xs font-light hover:bg-gray-200 elegant-transition
                                      ${selectedPaintingId === painting.id ? '' : 'sm:block hidden'}`}
                                  >
                                    Buy
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className={`px-3 py-2 bg-gray-600 text-gray-400 text-xs font-light cursor-not-allowed
                                      ${selectedPaintingId === painting.id ? '' : 'sm:block hidden'}`}
                                    title="Not for sale"
                                  >
                                    Buy
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-black">{painting.name}</p>
                              {painting.details && (
                                <p className="text-[10px] text-gray-600 mt-1">{painting.details}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {/* Render single paintings */}
            {groupedPaintings['single']?.map((painting) => (
              <div
                key={painting.id}
                className={`group relative ${
                  painting.aspectRatio === '2/1' || painting.aspectRatio === '3/2' ? 'col-span-2' :
                  (painting.id === 'maju_1' || painting.id === 'maju_2' || painting.id === 'autorretrato') ? 'col-span-2' :
                  'col-span-1'
                }`}
              >
                <div
                  className="relative mb-4 overflow-hidden baroque-border"
                  style={{ aspectRatio: painting.aspectRatio || '4/5' }}
                  onClick={() => setSelectedPaintingId(selectedPaintingId === painting.id ? null : painting.id)}
                >
                  <Image
                    src={`/images/two_visions/${currentArtist.folder}/${painting.filename}`}
                    alt={painting.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  {/* Current Bid Badge */}
                  {currentBids[painting.id] && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 text-xs sm:text-sm">
                      €{currentBids[painting.id]}
                    </div>
                  )}
                  {/* Hover/Touch Overlay */}
                  <div className={`absolute inset-0 bg-black elegant-transition flex items-center justify-center
                    ${selectedPaintingId === painting.id ? 'bg-opacity-60 opacity-100' : 'bg-opacity-0 group-hover:bg-opacity-60 opacity-0 group-hover:opacity-100'}`}>
                    {painting.forSale ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedPaintingId === painting.id || (typeof window !== 'undefined' && window.innerWidth >= 640)) {
                            window.location.href = `/two-visions/bid/${painting.id}`;
                          }
                        }}
                        className={`px-4 py-2 bg-white text-black text-sm font-light hover:bg-gray-200 elegant-transition
                          ${selectedPaintingId === painting.id ? '' : 'sm:block hidden'}`}
                      >
                        Buy
                      </button>
                    ) : (
                      <button
                        disabled
                        className={`px-4 py-2 bg-gray-600 text-gray-400 text-sm font-light cursor-not-allowed
                          ${selectedPaintingId === painting.id ? '' : 'sm:block hidden'}`}
                        title="Not for sale"
                      >
                        Buy
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-base sm:text-lg font-light text-black mb-1">
                    {painting.name}
                  </h3>
                  {painting.details && (
                    <p className="text-xs sm:text-sm text-gray-600">{painting.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
