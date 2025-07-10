import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import Button from '../../components/ui/button/Button';
import InputField from '../../components/form/input/InputField';
import Label from '../../components/form/Label';
import TextArea from '../../components/form/input/TextArea';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import Badge from '../../components/ui/badge/Badge';
import Swal from 'sweetalert2';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  guest_capcity: number;
  checkin_date: string;
  checkout_date: string;
  special_requests: string;
  activites: string;
  destination: string;
  message: string;
  created_at: string;
}

const BookForms = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewPanelOpen, setIsViewPanelOpen] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://jbheartfelt-api.onrender.com/bookform/')
      .then((response) => response.json())
      .then((data) => {
        setBookings(data);
        setFilteredBookings(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const results = bookings.filter((booking) =>
      booking.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBookings(results);
  }, [searchTerm, bookings]);

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewPanelOpen(true);
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditPanelOpen(true);
  };

  const handleDelete = (bookingId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://jbheartfelt-api.onrender.com/bookform/${bookingId}`, {
          method: 'DELETE',
        })
        .then(() => {
          setBookings(bookings.filter((booking) => booking.id !== bookingId));
          Swal.fire('Deleted!', 'The booking has been deleted.', 'success');
        })
        .catch((error) => {
          console.error('Error deleting booking:', error);
          Swal.fire('Error!', 'There was an error deleting the booking.', 'error');
        });
      }
    });
  };

  const handlePanelClose = () => {
    setIsViewPanelOpen(false);
    setIsEditPanelOpen(false);
    setSelectedBooking(null);
  };

  const handleSaveChanges = () => {
    if (selectedBooking) {
      fetch(`https://jbheartfelt-api.onrender.com/bookform/${selectedBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedBooking),
      })
      .then(response => response.json())
      .then(updatedBooking => {
        setBookings(bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b));
        handlePanelClose();
        Swal.fire('Saved!', 'The booking has been updated.', 'success');
      })
      .catch(error => {
        console.error('Error updating booking:', error);
        Swal.fire('Error!', 'There was an error updating the booking.', 'error');
      });
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Booking Forms" />

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="mb-4">
          <InputField
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">User</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Destination</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{booking.name}</span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{booking.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{booking.destination}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color="success">Active</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleView(booking)}>View</Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(booking)}>Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(booking.id)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* View Panel */}
      {isViewPanelOpen && selectedBooking && (
        <div className="fixed z-50 top-0 right-0 h-full w-2/5 bg-white p-8 shadow-lg dark:bg-boxdark overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Booking Details</h2>
            <Button onClick={handlePanelClose} variant="outline" size="sm">Close</Button>
          </div>
          <div className="space-y-4">
            <div><Label>Name:</Label><p className="text-gray-800 dark:text-white">{selectedBooking.name}</p></div>
            <div><Label>Email:</Label><p className="text-gray-800 dark:text-white">{selectedBooking.email}</p></div>
            <div><Label>Phone:</Label><p className="text-gray-800 dark:text-white">{selectedBooking.phone}</p></div>
            <div><Label>Destination:</Label><p className="text-gray-800 dark:text-white">{selectedBooking.destination}</p></div>
            <div><Label>Check-in:</Label><p className="text-gray-800 dark:text-white">{new Date(selectedBooking.checkin_date).toLocaleString()}</p></div>
            <div><Label>Check-out:</Label><p className="text-gray-800 dark:text-white">{new Date(selectedBooking.checkout_date).toLocaleString()}</p></div>
            <div><Label>Guests:</Label><p className="text-gray-800 dark:text-white">{selectedBooking.guest_capcity}</p></div>
            <div><Label>Special Requests:</Label><p className="text-gray-800 dark:text-white">{selectedBooking.special_requests}</p></div>
            <div><Label>Activities:</Label><p className="text-gray-800 dark:text-white">{selectedBooking.activites}</p></div>
            <div><Label>Message:</Label><p className="text-gray-800 dark:text-white">{selectedBooking.message}</p></div>
            <div><Label>Created At:</Label><p className="text-gray-800 dark:text-white">{new Date(selectedBooking.created_at).toLocaleString()}</p></div>
          </div>
        </div>
      )}

      {/* Edit Panel */}
      {isEditPanelOpen && selectedBooking && (
        <div className="fixed z-50 top-0 right-0 h-full w-2/5 bg-white p-8 shadow-lg dark:bg-boxdark overflow-y-auto">
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Booking</h2>
            <Button onClick={handlePanelClose} variant="outline" size="sm">Close</Button>
          </div>
          <form>
            <div className="space-y-4">
              <div><Label htmlFor="name">Name</Label><InputField id="name" name="name" value={selectedBooking.name} onChange={(e) => setSelectedBooking({ ...selectedBooking, name: e.target.value })} /></div>
              <div><Label htmlFor="email">Email</Label><InputField id="email" name="email" value={selectedBooking.email} onChange={(e) => setSelectedBooking({ ...selectedBooking, email: e.target.value })} /></div>
              <div><Label htmlFor="phone">Phone</Label><InputField id="phone" name="phone" value={selectedBooking.phone} onChange={(e) => setSelectedBooking({ ...selectedBooking, phone: e.target.value })} /></div>
              <div><Label>Message</Label><TextArea rows={6} value={selectedBooking.message} onChange={(value) => setSelectedBooking({ ...selectedBooking, message: value })} /></div>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default BookForms;
