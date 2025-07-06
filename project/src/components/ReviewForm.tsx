import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ReviewFormProps {
  courseId: string;
  onSubmit: (rating: number, comment: string) => void;
  initialRating?: number;
  initialComment?: string;
  isEditing?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  courseId,
  onSubmit,
  initialRating = 0,
  initialComment = '',
  isEditing = false
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      if (!isEditing) {
        setRating(0);
        setComment('');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            {(hoverRating || rating) >= star ? (
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
            ) : (
              <Star className="w-6 h-6 text-gray-300" />
            )}
          </button>
        ))}
      </div>

      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this course..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm; 