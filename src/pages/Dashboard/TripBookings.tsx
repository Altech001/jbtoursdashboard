import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import ComponentCard from '../../components/common/ComponentCard';
import Button from '../../components/ui/button/Button';

interface Trip {
  id: string;
  destination: string;
}

interface BookedUser {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  is_admin: boolean;
  trip_id: string;
  created_at: string;
  updated_at: string | null;
}

const TripBookings = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string>('all');
  const [bookedUsers, setBookedUsers] = useState<BookedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<BookedUser | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    fetch('https://jbheartfelt-api.onrender.com/books/trips/')
      .then((response) => response.json())
      .then((data) => {
        setTrips(data);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (selectedTrip === 'all') {
      Promise.all(
        trips.map(trip =>
          fetch(`https://jbheartfelt-api.onrender.com/books/trips/${trip.id}/users/full`).then(res => res.json())
        )
      ).then(results => {
        const allBookedUsers = results.flat();
        setBookedUsers(allBookedUsers);
        setIsLoading(false);
      }).catch(() => setIsLoading(false));
    } else {
      fetch(`https://jbheartfelt-api.onrender.com/books/trips/${selectedTrip}/users/full`)
        .then((response) => response.json())
        .then((data) => {
          setBookedUsers(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [selectedTrip, trips]);

  const handleRowClick = (user: BookedUser) => {
    setSelectedUser(user);
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Trip Bookings" />

      <ComponentCard
        title="Trip Bookings"
        desc="View all the bookings for your trips"
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-white/[0.05] dark:bg-white/[0.03]"
      >
        <div className="mb-4">
          <select
            value={selectedTrip}
            onChange={(e) => setSelectedTrip(e.target.value)}
            className="w-full rounded-lg border border-stroke dark:border-strokedark p-3 text-sm dark:bg-boxdark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Trips</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.destination}
              </option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color={"#4A90E2"} loading={isLoading} size={80} />
          </div>
        ) : (
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">User</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Phone</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Trip Booked</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Booked At</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {bookedUsers.map((user) => (
                  <TableRow key={user.user_id} onClick={() => handleRowClick(user)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{user.name}</span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{user.phone}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {trips.find(trip => trip.id === user.trip_id)?.destination}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </ComponentCard>

      {isPanelOpen && selectedUser && (
        <div className="fixed top-0 z-50 right-0 h-full w-2/5 bg-white p-8 shadow-lg dark:bg-boxdark overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Booking Receipt</h2>
            <Button onClick={handlePanelClose} variant="outline" size="sm">Close</Button>
          </div>
          <div className="space-y-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">User Details</h3>
                <div className="mt-2 text-gray-600 dark:text-gray-300">
                    <p><strong className="font-semibold">Name:</strong> {selectedUser.name}</p>
                    <p><strong className="font-semibold">Email:</strong> {selectedUser.email}</p>
                    <p><strong className="font-semibold">Phone:</strong> {selectedUser.phone}</p>
                </div>
            </div>
            <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Trip Details</h3>
                <div className="mt-2 text-gray-600 dark:text-gray-300">
                    <p><strong className="font-semibold">Destination:</strong> {trips.find(trip => trip.id === selectedUser.trip_id)?.destination}</p>
                    <p><strong className="font-semibold">Booked At:</strong> {new Date(selectedUser.created_at).toLocaleString()}</p>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TripBookings;
