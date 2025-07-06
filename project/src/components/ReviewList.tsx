import React, { useState } from 'react';
import { Star, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ReviewForm from './ReviewForm';

interface Review {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  courseId: string;
  onReviewUpdate: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, courseId, onReviewUpdate }) => {
  const { user } = useAuth();
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    setIsDeleting(reviewId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete review');
      }

      onReviewUpdate();
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUpdate = async (reviewId: string, rating: number, comment: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rating, comment })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update review');
      }

      setEditingReviewId(null);
      onReviewUpdate();
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="bg-white rounded-lg shadow-sm p-6">
          {editingReviewId === review._id ? (
            <ReviewForm
              courseId={courseId}
              initialRating={review.rating}
              initialComment={review.comment}
              isEditing
              onSubmit={(rating, comment) => handleUpdate(review._id, rating, comment)}
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {review.user?.name?.[0]?.toUpperCase() || review.user?.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {review.user?.name || review.user?.email || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {user?.id === review.userId && (
                    <>
                      <button
                        onClick={() => setEditingReviewId(review._id)}
                        className="text-gray-500 hover:text-blue-600"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-gray-500 hover:text-red-600"
                        disabled={isDeleting === review._id}
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList; 