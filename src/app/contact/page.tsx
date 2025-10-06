'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Instagram, Video} from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // EmailJS configuration - you'll need to replace these with your actual values
      // Import the config at the top level for easy configuration
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }
      );

      console.log('Email sent successfully:', result);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Email sending failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Header */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-black mb-4 sm:mb-6">
            Contact
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Interested in commissioning a piece or purchasing existing work? I&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-xl sm:text-2xl font-light text-black mb-6 sm:mb-8">
                Send a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-black mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 baroque-border focus:ring-2 focus:ring-black focus:border-black outline-none elegant-transition text-sm sm:text-base"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-black mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 baroque-border focus:ring-2 focus:ring-black focus:border-black outline-none elegant-transition text-sm sm:text-base"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs sm:text-sm font-medium text-black mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 baroque-border focus:ring-2 focus:ring-black focus:border-black outline-none elegant-transition text-sm sm:text-base"
                  >
                    <option value="">Select a subject</option>
                    <option value="commission">Commission Inquiry</option>
                    <option value="purchase">Purchase Existing Work</option>
                    <option value="exhibition">Exhibition Opportunity</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-black mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 baroque-border focus:ring-2 focus:ring-black focus:border-black outline-none elegant-transition resize-vertical text-sm sm:text-base"
                    placeholder="Please describe your inquiry in detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 sm:px-8 py-2 sm:py-3 bg-black text-white font-light hover:bg-gray-800 disabled:bg-gray-400 elegant-transition baroque-border text-sm sm:text-base"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {submitStatus === 'success' && (
                  <div className="p-3 sm:p-4 bg-white baroque-border text-black text-sm sm:text-base">
                    Thank you for your message! I&apos;ll get back to you as soon as possible.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-3 sm:p-4 bg-white baroque-border text-black text-sm sm:text-base">
                    There was an error sending your message. Please try again or contact me directly.
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl sm:text-2xl font-light text-black mb-6 sm:mb-8">
                Get in Touch
              </h2>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-black mt-1" />
                  <div>
                    <h3 className="font-medium text-black text-sm sm:text-base">Email</h3>
                    <p className="text-gray-700 text-xs sm:text-sm">lucarrsousa@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-black mt-1" />
                  <div>
                    <h3 className="font-medium text-black text-sm sm:text-base">Phone</h3>
                    <p className="text-gray-700 text-xs sm:text-sm">+351 933 942 679</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-black mt-1" />
                  <div>
                    <h3 className="font-medium text-black text-sm sm:text-base"> Currently in</h3>
                    <p className="text-gray-700 text-xs sm:text-sm">Lisbon, PT</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 sm:mt-12">
                <h3 className="text-base sm:text-lg font-light text-black mb-3 sm:mb-4">
                  Follow My Work
                </h3>
                <div className="flex space-x-3 sm:space-x-4">
                  <a
                    href="https://instagram.com/luca__rt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 sm:p-3 bg-white baroque-border hover:bg-black hover:text-white elegant-transition"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                  <a
                    href="https://tiktok.com/@lica0011"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 sm:p-3 bg-white baroque-border hover:bg-black hover:text-white elegant-transition"
                    aria-label="Twitter"
                  >
                    <Video className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>

                </div>
              </div>

              {/* Commission Info */}
              <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-white baroque-border">
                <h3 className="text-base sm:text-lg font-light text-black mb-2 sm:mb-3">
                  Commission Information
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                  I accept a limited number of commissions each year. Portrait commissions typically range from 
                  €300-€3,000 depending on size and complexity. Landscape and still life commissions start at 
                  €100. Please allow 2-3 months for completion. A 50% deposit is required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}