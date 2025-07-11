import { useQuery } from '@tanstack/react-query';
import { getTrips, getBookings } from '../lib/api';

// Define the structure for a booking
interface Booking {
  id: string;
  name: string;
  email: string;
  destination: string;
  checkin_date: string;
  created_at: string;
}

// Function to process bookings by destination for the demographic card
const processDemographics = (bookings: Booking[]) => {
  if (!bookings || bookings.length === 0) return [];

  const counts = bookings.reduce((acc, booking) => {
    const destination = booking.destination || "Unknown";
    acc[destination] = (acc[destination] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = bookings.length;

  return Object.entries(counts)
    .map(([destination, count]) => ({
      name: destination,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3); // Return top 3 for display
};


// Function to process data for time-series charts and monthly comparison
const processMonthlyData = (bookings: Booking[], trips: any[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const bookingsByMonth = Array(12).fill(0);
    const tripsByMonth = Array(12).fill(0);
  
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let currentMonthBookings = 0;
    let previousMonthBookings = 0;

    bookings.forEach(booking => {
      const bookingDate = new Date(booking.created_at);
      const month = bookingDate.getMonth();
      const year = bookingDate.getFullYear();

      // Aggregate for yearly charts
      bookingsByMonth[month] += 1;
      
      // Calculate for current vs. previous month
      if (year === currentYear && month === currentMonth) {
        currentMonthBookings++;
      } else if (year === previousMonthYear && month === previousMonth) {
        previousMonthBookings++;
      }
    });
  
    trips.forEach(trip => {
      const month = new Date(trip.created_at).getMonth();
      tripsByMonth[month] += 1;
    });
    
    return {
      labels: months,
      monthlyBookingsData: bookingsByMonth,
      monthlyTripsData: tripsByMonth,
      currentMonthBookings,
      previousMonthBookings,
    };
  };

export const useAnalytics = () => {
  const { data: tripsData, isLoading: isLoadingTrips } = useQuery({
    queryKey: ['trips'],
    queryFn: getTrips,
  });

  const { data: bookingsData, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });

  const bookings = bookingsData?.data || [];
  const trips = tripsData?.data || [];

  const totalCustomers = bookings.length;
  const totalOrders = trips.length;
  
  const demographics = processDemographics(bookings);
  const { 
    labels, 
    monthlyBookingsData, 
    monthlyTripsData, 
    currentMonthBookings, 
    previousMonthBookings 
  } = processMonthlyData(bookings, trips);
  
  // Dynamic target calculation
  const target = previousMonthBookings > 0 ? previousMonthBookings : 30; // Use last month's bookings as target, or a default of 30 if none.
  const targetPercentage = Math.min(100, (currentMonthBookings / target) * 100);

  const recentBookings = bookings.slice(0, 6);

  return {
    totalCustomers,
    totalOrders,
    demographics,
    monthlySales: { labels, data: monthlyBookingsData },
    statistics: { labels, sales: monthlyBookingsData, revenue: monthlyTripsData },
    recentBookings,
    monthlyProgress: {
        percentage: targetPercentage,
        current: currentMonthBookings,
        target: target
    },
    isLoading: isLoadingTrips || isLoadingBookings,
  };
};