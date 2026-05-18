import { createContext, useContext } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Doc, Id } from '../../convex/_generated/dataModel';

export type Review = Doc<"reviews">;

interface ReviewsContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, '_id' | '_creationTime' | 'date'>) => void;
  deleteReview: (id: Id<"reviews">) => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: reviews } = useSuspenseQuery(convexQuery(api.reviews.getReviews, {}));
  const add = useMutation(api.reviews.addReview);
  const del = useMutation(api.reviews.deleteReview);

  const addReview = (review: any) => {
    add({
      ...review,
      date: new Date().toLocaleDateString()
    });
  };

  const deleteReview = (id: Id<"reviews">) => {
    del({ id });
  };

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, deleteReview }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error('useReviews must be used within a ReviewsProvider');
  return context;
};
