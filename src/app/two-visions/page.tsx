'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { X, Instagram } from 'lucide-react';
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
}

interface Artist {
  name: string;
  folder: string;
  instagram?: string;
  tiktok?: string;
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
      { id: 'still_life_3', name: 'Still Life 3', filename: 'still_life_3.jpeg', panel: 'plants_lighters', forSale: true },
      { id: 'still_life_1', name: 'Still Life 1', filename: 'still_life_1.jpeg', panel: 'plants_lighters', forSale: true },
      // Panel: Hundred Years of Solitude collection
      { id: 'coronel_aureliano_buendia', name: 'Coronel Aureliano Buendia', filename: 'coronel_aureliano_buendia.JPG', panel: 'hundred_years', forSale: true },
      { id: 'ursula_iguaran', name: 'Ursula Iguaran', filename: 'ursula_iguaran.jpg', panel: 'hundred_years', forSale: true },
      { id: 'melquiades', name: 'Melquiades', filename: 'melquiades.PNG', panel: 'hundred_years', forSale: true },
      { id: 'morte_de_jose_arcadio', name: 'Morte De Jose Arcadio', filename: 'morte_de_jose_arcadio.jpg', panel: 'hundred_years', forSale: true },
      // Single paintings
      { id: 'venus', name: 'Venus', filename: 'venus.JPG', forSale: true, aspectRatio: '3/2' },
      { id: 'calma_fogo_calma', name: 'Calma-Fogo-Calma', filename: 'calma-fogo-calma.jpeg', forSale: true, aspectRatio: '2/1' },
    ]
  },
  {
    name: "Maria Júlia",
    folder: "maria_julia",
    instagram: "https://www.instagram.com/mariajulia.rds/",
    tiktok: "https://tiktok.com/@mariajulia.rd",
    paintings: [
      // Single paintings
      { id: 'maju_1', name: '1', filename: 'maju_1.png', forSale: true },
      { id: 'maju_2', name: '2', filename: 'maju_2.png', forSale: true },
      { id: 'autorretrato', name: 'autorretrato', filename: 'autorretrato.png', forSale: false },
      // Panel A
      { id: 'maju_a_1', name: '1', filename: 'maju_a_1.png', panel: 'a', forSale: true },
      { id: 'maju_a_2', name: '2', filename: 'maju_a_2.png', panel: 'a', forSale: true },
      { id: 'maju_a_3', name: '3', filename: 'maju_a_3.png', panel: 'a', forSale: true },
      // Panel B
      { id: 'maju_b_1', name: '1', filename: 'maju_b_1.png', panel: 'b', forSale: true },
      { id: 'maju_b_2', name: '2', filename: 'maju_b_2.png', panel: 'b', forSale: true },
      { id: 'maju_b_3', name: '3', filename: 'maju_b_3.png', panel: 'b', forSale: true },
      { id: 'maju_b_4', name: '4', filename: 'maju_b_4.png', panel: 'b', forSale: true },
    ]
  }
];

interface SelectedPainting extends PaintingDetails {
  artistFolder: string;
}

export default function TwoVisionsPage() {
  const [activeTab, setActiveTab] = useState<'luca' | 'maria_julia'>('luca');
  const [selectedPaintingInfo, setSelectedPaintingInfo] = useState<SelectedPainting | null>(null);
  const [currentBids, setCurrentBids] = useState<Record<string, number>>({});

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

  const openInfo = (painting: PaintingDetails) => {
    setSelectedPaintingInfo({ ...painting, artistFolder: currentArtist.folder });
  };

  const closeInfo = () => {
    setSelectedPaintingInfo(null);
  };

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
                            <div className="relative aspect-[4/5] mb-2 overflow-hidden baroque-border">
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
                                  ${currentBids[painting.id]}
                                </div>
                              )}
                              {/* Hover/Touch Overlay */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 elegant-transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                <button
                                  onClick={() => openInfo(painting)}
                                  className="px-3 py-2 bg-white text-black text-xs font-light hover:bg-gray-200 elegant-transition"
                                >
                                  Info
                                </button>
                                {painting.forSale ? (
                                  <button
                                    onClick={() => {
                                      window.location.href = `/two-visions/bid/${painting.id}`;
                                    }}
                                    className="px-3 py-2 bg-white text-black text-xs font-light hover:bg-gray-200 elegant-transition"
                                  >
                                    Buy
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="px-3 py-2 bg-gray-600 text-gray-400 text-xs font-light cursor-not-allowed"
                                    title="Not for sale"
                                  >
                                    Buy
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-black text-center">{painting.name}</p>
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
                className={`group relative ${painting.aspectRatio === '2/1' || painting.aspectRatio === '3/2' ? 'col-span-2' : 'col-span-1'}`}
              >
                <div
                  className="relative mb-4 overflow-hidden baroque-border"
                  style={{ aspectRatio: painting.aspectRatio || '4/5' }}
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
                      ${currentBids[painting.id]}
                    </div>
                  )}
                  {/* Hover/Touch Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 elegant-transition flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => openInfo(painting)}
                      className="px-4 py-2 bg-white text-black text-sm font-light hover:bg-gray-200 elegant-transition"
                    >
                      Info
                    </button>
                    {painting.forSale ? (
                      <button
                        onClick={() => {
                          window.location.href = `/two-visions/bid/${painting.id}`;
                        }}
                        className="px-4 py-2 bg-white text-black text-sm font-light hover:bg-gray-200 elegant-transition"
                      >
                        Buy
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-600 text-gray-400 text-sm font-light cursor-not-allowed"
                        title="Not for sale"
                      >
                        Buy
                      </button>
                    )}
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-light text-black mb-1">
                  {painting.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Modal */}
      {selectedPaintingInfo && (
        <div
          className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={closeInfo}
        >
          <div
            className="relative max-w-md w-full bg-white p-6 baroque-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl sm:text-2xl font-light text-black mb-4">
              {selectedPaintingInfo.name}
              {selectedPaintingInfo.panel && ` (${panelNames[selectedPaintingInfo.panel] || selectedPaintingInfo.panel})`}
            </h3>
            <div className="text-sm sm:text-base text-gray-700 space-y-2 mb-6">
              {selectedPaintingInfo.dimensions && <p><strong>Dimensions:</strong> {selectedPaintingInfo.dimensions}</p>}
              {selectedPaintingInfo.year && <p><strong>Year:</strong> {selectedPaintingInfo.year}</p>}
              {selectedPaintingInfo.technique && <p><strong>Technique:</strong> {selectedPaintingInfo.technique}</p>}
              {selectedPaintingInfo.place && <p><strong>Place:</strong> {selectedPaintingInfo.place}</p>}
            </div>

            {/* Buy Button */}
            {selectedPaintingInfo.forSale ? (
              <button
                onClick={() => {
                  window.location.href = `/two-visions/bid/${selectedPaintingInfo.id}`;
                }}
                className="w-full px-4 sm:px-6 py-3 bg-black text-white font-light hover:bg-gray-800 elegant-transition text-sm sm:text-base mb-3"
              >
                I want to buy this painting
              </button>
            ) : (
              <div className="mb-3">
                <button
                  disabled
                  className="w-full px-4 sm:px-6 py-3 bg-gray-300 text-gray-500 font-light cursor-not-allowed text-sm sm:text-base"
                >
                  Not for sale
                </button>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={closeInfo}
              className="absolute top-4 right-4 text-black hover:text-gray-600 elegant-transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
