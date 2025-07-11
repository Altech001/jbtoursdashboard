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
}

const TripCard: React.FC<TripCardProps> = ({ trip, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 max-w-md mx-auto overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={trip.image_url}
          alt={trip.destination}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">{trip.destination}</h3>
          <span className="text-lg font-bold text-primary">${trip.price}</span>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-yellow-500">{Array(Math.round(trip.ratings)).fill('★').join('')}</span>
          <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">({trip.ratings} ratings)</span>
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {trip.description}
        </p>
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Dates:</span> {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Status:</span> <span className={`capitalize ${trip.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>{trip.status}</span>
          </p>
        </div>
        {trip.gallery && trip.gallery.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Gallery</h4>
            <div className="grid grid-cols-3 gap-2">
              {trip.gallery.map((image, index) => (
                <img key={index} src={image} alt={`Gallery image ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
              ))}
            </div>
          </div>
        )}
        <div className="mt-5 flex items-center gap-3 justify-between">
          <Button onClick={onEdit} className="flex-1">Edit</Button>
          <Button onClick={onDelete} className="flex-1" variant="outline">Delete</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;
