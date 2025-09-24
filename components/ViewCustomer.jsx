'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaUsers, FaUser, FaStar, FaComment, FaIceCream, FaRegClock, FaBox } from 'react-icons/fa';

export default function ViewCustomers() {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/reviews');
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(data.data || []);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaUsers className="mr-2 text-blue-600" /> Customer Reviews
        </h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-[600px] w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 max-w-xs">
                    <FaUser className="inline mr-1" /> Customer Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 max-w-xs">
                    <FaBox className="inline mr-1" /> Product Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    <FaStar className="inline mr-1" /> Rating
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    <FaIceCream className="inline mr-1" /> Favorite Flavor
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    <FaComment className="inline mr-1" /> Feedback
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    <FaRegClock className="inline mr-1" /> Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800 max-w-xs truncate">{review.customerName}</td>
                    <td className="py-3 px-4 text-gray-800 max-w-xs truncate">{review.productName}</td>
                    <td className="py-3 px-4 text-gray-800 flex items-center">
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 mr-1" />
                      ))}
                      {[...Array(5 - review.rating)].map((_, i) => (
                        <FaStar key={i} className="text-gray-300 mr-1" />
                      ))}
                      <span className="ml-1 text-gray-600">({review.rating}/5)</span>
                    </td>
                    <td className="py-3 px-4 text-gray-800">{review.favoriteFlavor}</td>
                    <td className="py-3 px-4 text-gray-800 break-words max-w-sm">{review.feedback}</td>
                    <td className="py-3 px-4 text-gray-800 break-words max-w-sm">
                      {new Intl.DateTimeFormat("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }).format(new Date(review.createdAt))}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
