import { Edit2, ScanEye } from "lucide-react";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import InputField from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Label from "../../components/form/Label";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { TrashBinIcon } from "../../icons";
import ComponentCard from "../../components/common/ComponentCard";

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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://jbheartfelt-api.onrender.com/bookform/")
      .then((response) => response.json())
      .then((data) => {
        setBookings(data);
        setFilteredBookings(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
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
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://jbheartfelt-api.onrender.com/bookform/${bookingId}`, {
          method: "DELETE",
        })
          .then(() => {
            setBookings(bookings.filter((booking) => booking.id !== bookingId));
            Swal.fire("Deleted!", "The booking has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting booking:", error);
            Swal.fire(
              "Error!",
              "There was an error deleting the booking.",
              "error"
            );
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
      fetch(
        `https://jbheartfelt-api.onrender.com/bookform/${selectedBooking.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedBooking),
        }
      )
        .then((response) => response.json())
        .then((updatedBooking) => {
          setBookings(
            bookings.map((b) =>
              b.id === updatedBooking.id ? updatedBooking : b
            )
          );
          handlePanelClose();
          Swal.fire("Saved!", "The booking has been updated.", "success");
        })
        .catch((error) => {
          console.error("Error updating booking:", error);
          Swal.fire(
            "Error!",
            "There was an error updating the booking.",
            "error"
          );
        });
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Booking Forms" />

      <ComponentCard
        title="Custom Order Bookings"
        desc="View your custom the bookings from the form on the site"
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-white/[0.05] dark:bg-white/[0.03]"
      >
        <div className="mb-4">
          <InputField
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    User
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Destination
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Capacity
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {booking.name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {booking.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {booking.destination}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color="success">
                        {booking.guest_capcity} Guests
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          startIcon={<ScanEye className="size-5" />}
                          className="border-blue-500 border   text-blue-500"
                          onClick={() => handleView(booking)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          startIcon={<Edit2 className="size-5" />}
                          className="border-green-500 border   text-green-500"
                          onClick={() => handleEdit(booking)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 border  text-red-500"
                          startIcon={<TrashBinIcon className="size-5" />}
                          onClick={() => handleDelete(booking.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </ComponentCard>

      {/* View Panel */}
      {isViewPanelOpen && selectedBooking && (
        <div className="fixed z-50 top-0 right-0 h-full w-2/5 bg-white p-8 shadow-lg dark:bg-boxdark overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Booking Receipt
            </h2>
            <Button onClick={handlePanelClose} variant="outline" size="sm">
              Close
            </Button>
          </div>
          <div className="printable-receipt bg-gray-50 dark:bg-gray-800 p-6 rounded-lg font-mono">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold">
                JB Heartfelt Tours and Tarvels
              </h3>
              <p className="text-sm text-gray-500">Booking Confirmation</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Booking ID:</span>
                <span>{selectedBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Name:</span>
                <span>{selectedBooking.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span>{selectedBooking.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span>{selectedBooking.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Destination:</span>
                <span>{selectedBooking.destination}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span>
                  {new Date(selectedBooking.checkin_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <span>
                  {new Date(selectedBooking.checkout_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Guests:</span>
                <span>{selectedBooking.guest_capcity}</span>
              </div>
            </div>
            <hr className="my-4 border-dashed" />
            <div className="space-y-2 text-sm">
              <h4 className="font-semibold">Additional Information</h4>
              <p>
                <span className="font-semibold">Special Requests:</span>{" "}
                {selectedBooking.special_requests}
              </p>
              <p>
                <span className="font-semibold">Activities:</span>{" "}
                {selectedBooking.activites}
              </p>
              <p>
                <span className="font-semibold">Message:</span>{" "}
                {selectedBooking.message}
              </p>
            </div>
            <div className="text-center mt-6 text-xs text-gray-500">
              <p>Thank you for booking with us!</p>
              <p>
                Date of issue:{" "}
                {new Date(selectedBooking.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-6 text-right">
            <Button onClick={() => window.print()}>Print Receipt</Button>
          </div>
        </div>
      )}

      {/* Edit Panel */}
      {isEditPanelOpen && selectedBooking && (
        <div className="fixed z-50 top-0 right-0 h-full w-2/5 bg-white p-8 shadow-lg dark:bg-boxdark overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Edit Booking
            </h2>
            <Button onClick={handlePanelClose} variant="outline" size="sm">
              Close
            </Button>
          </div>
          <form>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <InputField
                  id="name"
                  name="name"
                  value={selectedBooking.name}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <InputField
                  id="email"
                  name="email"
                  value={selectedBooking.email}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <InputField
                  id="phone"
                  name="phone"
                  value={selectedBooking.phone}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <InputField
                  id="destination"
                  name="destination"
                  value={selectedBooking.destination}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      destination: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="guest_capcity">Guest Capacity</Label>
                <InputField
                  id="guest_capcity"
                  name="guest_capcity"
                  type="number"
                  value={selectedBooking.guest_capcity}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      guest_capcity: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="checkin_date">Check-in Date</Label>
                <InputField
                  id="checkin_date"
                  name="checkin_date"
                  type="date"
                  value={selectedBooking.checkin_date.split("T")[0]}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      checkin_date: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="checkout_date">Check-out Date</Label>
                <InputField
                  id="checkout_date"
                  name="checkout_date"
                  type="date"
                  value={selectedBooking.checkout_date.split("T")[0]}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      checkout_date: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Special Requests</Label>
                <TextArea
                  rows={4}
                  value={selectedBooking.special_requests}
                  onChange={(value) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      special_requests: value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Activities</Label>
                <TextArea
                  rows={4}
                  value={selectedBooking.activites}
                  onChange={(value) =>
                    setSelectedBooking({ ...selectedBooking, activites: value })
                  }
                />
              </div>
              <div>
                <Label>Message</Label>
                <TextArea
                  rows={6}
                  value={selectedBooking.message}
                  onChange={(value) =>
                    setSelectedBooking({ ...selectedBooking, message: value })
                  }
                />
              </div>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default BookForms;
