'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { X } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
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
      setError(`Your bid must be higher than the current bid of $${currentBid}`);
      return;
    }

    setLoading(true);

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
              Painting ID: {paintingId}
            </p>

            {currentBid !== null && (
              <div className="mb-6 p-4 bg-gray-50 baroque-border">
                <p className="text-sm text-gray-700">Current Highest Bid:</p>
                <p className="text-2xl font-light text-black">${currentBid}</p>
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
                    Your Bid Amount ($)
                  </label>
                  <input
                    type="number"
                    id="bidAmount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-4 py-3 baroque-border focus:outline-none focus:ring-2 focus:ring-black text-black"
                    placeholder={currentBid ? `Minimum: $${currentBid + 1}` : 'Enter amount'}
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

                <p className="text-xs text-gray-600 text-center">
                  By submitting, you agree to be contacted regarding your bid.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
