import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookings, updateBooking, deleteBooking } from '../lib/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

export const useBookings = () => {
  const queryClient = useQueryClient();

  // Query to fetch all bookings
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
    select: (response) => response.data,
  });

  // Mutation for updating a booking
  const updateMutation = useMutation({
    mutationFn: updateBooking,
    onSuccess: () => {
      toast.success('Booking updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => {
      toast.error('Failed to update booking. Please try again.');
    },
  });

  // Mutation for deleting a booking
  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      toast.success('Booking has been deleted.');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => {
      toast.error('Failed to delete booking. Please try again.');
    },
  });
  
  const handleDeleteWithConfirmation = (bookingId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(bookingId);
      }
    });
  };

  return {
    bookings: bookings || [],
    isLoading,
    updateBooking: updateMutation.mutate,
    deleteBooking: handleDeleteWithConfirmation,
  };
};