import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTrips, updateTripStatus, deleteTrip } from '../lib/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

export const useTrips = () => {
  const queryClient = useQueryClient();

  // Query to fetch all trips
  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: getTrips,
    select: (response) => response.data,
  });

  // Mutation for updating a trip's status
  const updateStatusMutation = useMutation({
    mutationFn: updateTripStatus,
    onSuccess: () => {
      toast.success('Trip status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
    onError: (error) => {
      toast.error('Failed to update status.', {
          description: error.message
      });
    },
  });

  // Mutation for deleting a trip
  const deleteTripMutation = useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      toast.success('The trip has been deleted.');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
    onError: (error) => {
      toast.error('Failed to delete the trip.', {
        description: error.message
      });
    },
  });
  
  // Wrapper for delete to include a confirmation dialog
  const handleDeleteWithConfirmation = (tripId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: '#fff',
      customClass: {
        title: 'text-gray-800',
        htmlContainer: 'text-gray-600', // Changed from 'content' to 'htmlContainer'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTripMutation.mutate(tripId);
      }
    });
  };

  return {
    trips: trips || [],
    isLoading,
    updateStatus: updateStatusMutation.mutate,
    deleteTrip: handleDeleteWithConfirmation,
  };
};