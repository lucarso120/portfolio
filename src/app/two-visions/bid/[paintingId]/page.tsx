'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { X } from 'lucide-react';

// Import painting data
const artists = [
  {
    name: "Luca",
    folder: "luca",
    paintings: [
      { id: 'still_life_3', name: 'Still Life 3', filename: 'still_life_3.jpeg', panel: 'plants_lighters' },
      { id: 'still_life_1', name: 'Still Life 1', filename: 'still_life_1.jpeg', panel: 'plants_lighters' },
      { id: 'coronel_aureliano_buendia', name: 'Coronel Aureliano Buendia', filename: 'coronel_aureliano_buendia.JPG', panel: 'hundred_years' },
      { id: 'ursula_iguaran', name: 'Ursula Iguaran', filename: 'ursula_iguaran.jpg', panel: 'hundred_years' },
      { id: 'melquiades', name: 'Melquiades', filename: 'melquiades.PNG', panel: 'hundred_years' },
      { id: 'morte_de_jose_arcadio', name: 'Morte De Jose Arcadio', filename: 'morte_de_jose_arcadio.jpg', panel: 'hundred_years' },
      { id: 'venus', name: 'Venus', filename: 'venus.JPG' },
      { id: 'calma_fogo_calma', name: 'Calma-Fogo-Calma', filename: 'calma-fogo-calma.jpeg' },
    ]
  },
  {
    name: "Maria Júlia",
    folder: "maria_julia",
    paintings: [
      { id: 'maju_1', name: '1', filename: 'maju_1.png' },
      { id: 'maju_2', name: '2', filename: 'maju_2.png' },
      { id: 'autorretrato', name: 'autorretrato', filename: 'autorretrato.png' },
      { id: 'maju_a_1', name: '1', filename: 'maju_a_1.png', panel: 'a' },
      { id: 'maju_a_2', name: '2', filename: 'maju_a_2.png', panel: 'a' },
      { id: 'maju_a_3', name: '3', filename: 'maju_a_3.png', panel: 'a' },
      { id: 'maju_b_1', name: '1', filename: 'maju_b_1.png', panel: 'b' },
      { id: 'maju_b_2', name: '2', filename: 'maju_b_2.png', panel: 'b' },
      { id: 'maju_b_3', name: '3', filename: 'maju_b_3.png', panel: 'b' },
      { id: 'maju_b_4', name: '4', filename: 'maju_b_4.png', panel: 'b' },
    ]
  }
];

export default function BidPage() {
  const params = useParams();
  const router = useRouter();
  const paintingId = params.paintingId as string;

  const [currentBid, setCurrentBid] = useState<number | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Find painting details
  const painting = artists
    .flatMap(artist => artist.paintings.map(p => ({ ...p, artist: artist.name })))
    .find(p => p.id === paintingId);

  const paintingName = painting ? `${painting.name} by ${painting.artist}` : paintingId;

  // Fetch current highest bid
  useEffect(() => {
    const fetchCurrentBid = async () => {
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
          setCurrentBid(highestBid.amount);
        }
      } catch (err) {
        console.error('Error fetching current bid:', err);
      }
    };

    fetchCurrentBid();
  }, [paintingId]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[\d\s\-\+\(\)]+$/.test(phone);
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!contact.trim()) {
      setError('Please enter your contact information');
      return;
    }

    if (contactType === 'email' && !validateEmail(contact)) {
      setError('Please enter a valid email address');
      return;
    }

    if (contactType === 'phone' && !validatePhone(contact)) {
      setError('Please enter a valid phone number');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid bid amount');
      return;
    }

    if (currentBid && amount <= currentBid) {
      setError(`Your bid must be higher than the current bid of €${currentBid}`);
      return;
    }

    // Show confirmation popup
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmation(false);
    setLoading(true);

    const amount = parseFloat(bidAmount);

    try {
      // Add bid to Firestore
      await addDoc(collection(db, 'bids'), {
        paintingId,
        amount,
        name: name.trim(),
        contact: contact.trim(),
        contactType,
        timestamp: new Date().toISOString(),
      });

      setSuccess(true);
      setCurrentBid(amount);

      // Reset form
      setBidAmount('');
      setName('');
      setContact('');

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/two-visions');
      }, 2000);
    } catch (err) {
      console.error('Error submitting bid:', err);
      setError('Failed to submit bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-white">
      <section className="py-12 sm:py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          {/* Close button */}
          <button
            onClick={() => router.push('/two-visions')}
            className="mb-6 text-black hover:text-gray-600 elegant-transition flex items-center gap-2"
          >
            <X size={20} />
            <span className="text-sm">Back to gallery</span>
          </button>

          <div className="bg-white p-6 sm:p-8 baroque-border">
            <h1 className="text-2xl sm:text-3xl font-light text-black mb-2">
              Place Your Bid
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              {paintingName}
            </p>

            {currentBid !== null && (
              <div className="mb-6 p-4 bg-gray-50 baroque-border">
                <p className="text-sm text-gray-700">Current Highest Bid:</p>
                <p className="text-2xl font-light text-black">€{currentBid}</p>
              </div>
            )}

            {success ? (
              <div className="p-4 bg-green-50 baroque-border text-green-800 mb-4">
                <p className="font-light">Bid submitted successfully!</p>
                <p className="text-sm mt-1">Redirecting you back to the gallery...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 baroque-border text-red-800 text-sm">
                    {error}
                  </div>
                )}

                {/* Bid Amount */}
                <div>
                  <label htmlFor="bidAmount" className="block text-sm font-light text-black mb-2">
                    Your Bid Amount (€)
                  </label>
                  <input
                    type="number"
                    id="bidAmount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-4 py-3 baroque-border focus:outline-none focus:ring-2 focus:ring-black text-black"
                    placeholder={currentBid ? `Minimum: €${currentBid + 1}` : 'Enter amount'}
                    min={currentBid ? currentBid + 1 : 1}
                    step="0.01"
                    required
                  />
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-light text-black mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 baroque-border focus:outline-none focus:ring-2 focus:ring-black text-black"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Contact Type */}
                <div>
                  <label className="block text-sm font-light text-black mb-2">
                    Contact Method
                  </label>
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="email"
                        checked={contactType === 'email'}
                        onChange={(e) => setContactType(e.target.value as 'email' | 'phone')}
                        className="cursor-pointer"
                      />
                      <span className="text-sm text-black">Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="phone"
                        checked={contactType === 'phone'}
                        onChange={(e) => setContactType(e.target.value as 'email' | 'phone')}
                        className="cursor-pointer"
                      />
                      <span className="text-sm text-black">Phone</span>
                    </label>
                  </div>
                  <input
                    type={contactType === 'email' ? 'email' : 'tel'}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-4 py-3 baroque-border focus:outline-none focus:ring-2 focus:ring-black text-black"
                    placeholder={contactType === 'email' ? 'your@email.com' : '+1 (555) 123-4567'}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-black text-white font-light hover:bg-gray-800 elegant-transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Bid'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div
          className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setShowConfirmation(false)}
        >
          <div
            className="relative max-w-lg w-full bg-white p-6 sm:p-8 baroque-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl sm:text-3xl font-light text-black mb-6">
              Confirm Your Bid
            </h3>

            <div className="text-sm sm:text-base text-gray-800 space-y-4 mb-8 leading-relaxed">
              <p className="font-medium text-black">
                Important Notice:
              </p>
              <p>
                Please only submit a bid if you are genuinely interested in purchasing this artwork. Your bid will remain valid until <strong>October 19, 2025 at 00:00</strong>.
              </p>
              <p>
                If your bid is the highest at the deadline, you will be contacted to complete the purchase. Please note that your bid may influence the pricing decisions of other interested parties.
              </p>
              <p className="text-sm text-gray-600 border-t pt-4 mt-4">
                By confirming, you agree to be contacted regarding your bid and understand the commitment involved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-6 py-3 baroque-border text-black font-light hover:bg-gray-100 elegant-transition text-center"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 px-6 py-3 bg-black text-white font-light hover:bg-gray-800 elegant-transition text-center"
              >
                Confirm Bid
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowConfirmation(false)}
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
