import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/button/Button';

interface Trip {
  id: number;
  destination: string;
  price: number;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
  ratings: number;
  max_capacity: number;
  required_staff: number;
  status: string;
  gallery: string[];
}

interface TripCardProps {
  trip: Trip;
  onEdit: () => void;
  onDelete: () => void;
  viewMode: 'list' | 'grid';
}

const TripCard: React.FC<TripCardProps> = ({ trip, onEdit, onDelete, viewMode }) => {
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-boxdark rounded shadow-sm border border-stroke dark:border-strokedark overflow-hidden ${
        viewMode === 'list' ? 'flex items-center' : 'max-w-xs mx-auto'
      } group hover:shadow-md transition-shadow duration-300`}
    >
      {/* Image Section (Visible in Grid View) */}
      {viewMode === 'grid' && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={trip.image_url}
            alt={trip.destination}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            ${trip.price.toFixed(2)}
          </span>
        </div>
      )}

      {/* Content Section */}
      <div className={`flex-1 p-4 ${viewMode === 'list' ? 'flex gap-4 items-center' : ''}`}>
        <div className={viewMode === 'list' ? 'flex-1' : ''}>
          <p className="text-sm font-medium text-gray-800 dark:text-white mb-2 line-clamp-1">
            {trip.destination}
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
            {viewMode === 'list' && (
              <>
                <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  ${trip.price.toFixed(2)}
                </span>
                <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2v4M16 2v4M3.5 9h17M21 8v9a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5h8a5 5 0 015 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                </span>
              </>
            )}
            <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.375 2.454a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.375-2.454a1 1 0 00-1.175 0l-3.375 2.454c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.614 9.397c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z" fill="currentColor"/>
              </svg>
              {trip.ratings.toFixed(1)}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full ${
              trip.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
              'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}>
              {trip.status}
            </span>
          </div>
          {viewMode === 'grid' && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {trip.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`flex items-center gap-2 ${viewMode === 'list' ? '' : 'mt-4 pt-4 border-t border-stroke dark:border-strokedark'}`}>
          <Button
            variant="outline"
            className="flex-1 text-sm text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={onEdit}
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={onDelete}
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;