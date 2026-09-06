import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Star, 
  CheckCircle2, 
  HeartHandshake, 
  Building2, 
  ThumbsUp, 
  Sparkles 
} from 'lucide-react';
import { Booking } from '../types';
import { apiService } from '../services/apiService';

export const RatingReviewModal: React.FC = () => {
  const { 
    activeReviewBooking, 
    closeReview, 
    openInvoice, 
    addToast, 
    triggerCelebration,
    refreshData 
  } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['On time', 'Skilled', 'Professional']);
  const [comment, setComment] = useState<string>('Ravi arrived promptly, did neat plumbing work and charged exactly per society rates!');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!activeReviewBooking) return null;
  const booking = activeReviewBooking;

  const availableTags = [
    'On time',
    'Professional',
    'Skilled',
    'Friendly',
    'Good value',
    'Clean workspace',
    'Safety compliant',
    'Fair pricing'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try {
      await apiService.submitReview(booking.id, rating, selectedTags, comment);
      await refreshData();
      setIsSubmitting(false);
      closeReview();
      triggerCelebration();
      addToast({
        type: 'success',
        title: 'Review Submitted!',
        message: `Thank you for supporting cooperative worker ${booking.workerName}!`
      });
      openInvoice(booking);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
              Post-Service Feedback
            </span>
            <h3 className="text-xl font-bold font-serif text-white mt-0.5">
              How was your experience?
            </h3>
          </div>
          <button
            onClick={closeReview}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Worker Identity Card */}
          <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <img
              src={booking.workerPhoto}
              alt={booking.workerName}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover border border-slate-300"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{booking.workerName}</h4>
              <p className="text-emerald-700 text-xs font-semibold">{booking.serviceName}</p>
              <p className="text-[11px] text-slate-500">{booking.cooperativeName}</p>
            </div>
          </div>

          {/* Interactive Star Rating */}
          <div className="text-center space-y-2 py-2">
            <span className="font-bold text-slate-800 text-xs block uppercase tracking-wider text-slate-400">
              Rate Worker Performance
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(rating)}
                  className="p-1 text-slate-300 hover:scale-110 transition duration-150 focus:outline-hidden"
                >
                  <Star
                    className={`w-8 h-8 transition ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700 block">
              {rating === 5 && '🌟 Outstanding & Courteous'}
              {rating === 4 && '👍 Very Good Service'}
              {rating === 3 && '👌 Satisfactory'}
              {rating === 2 && '👎 Needs Improvement'}
              {rating === 1 && '⚠️ Poor Experience'}
            </span>
          </div>

          {/* Suggested Simple Tags */}
          <div>
            <label className="font-bold text-slate-800 text-xs block mb-2">
              What went well? (Select tags)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Review Field */}
          <div>
            <label className="font-bold text-slate-800 text-xs block mb-1">
              Tell us about your experience
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share honest feedback to help this cooperative worker build their reputation..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-5 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={closeReview}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white transition"
          >
            Skip
          </button>

          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting}
            className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving Review...' : 'Submit Rating & View Invoice'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
