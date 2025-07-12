import { useState } from "react";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TripCard from "../../components/cards/TripCard";
import Button from "../../components/ui/button/Button";
import ClipLoader from "react-spinners/ClipLoader";
import ComponentCard from "../../components/common/ComponentCard";
import { useTrips } from "../../hooks/useTrips";
import Select from "../../components/form/Select";
import Label from "../../components/form/Label";

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

const statusOptions = [
    { value: "active", label: "Active" },
    { value: "progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

const ViewTrips = () => {
  const { trips, isLoading, updateStatus, deleteTrip } = useTrips();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleEdit = (trip: Trip) => {
    setSelectedTrip(trip);
    setNewStatus(trip.status); // Pre-fill with current status
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setSelectedTrip(null);
    setNewStatus("");
  };

  const handleStatusUpdate = () => {
    if (selectedTrip && newStatus) {
      updateStatus({ tripId: selectedTrip.id.toString(), status: newStatus }, {
        onSuccess: handlePanelClose,
      });
    }
  };

  return (
    <>
      <PageMeta
        title="View Trips"
        description="Explore and manage your travel destinations"
      />
      <PageBreadCrumb pageTitle="View Trips" />
      <ComponentCard title="View Trips" desc="Manage your trips effectively">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color={"#4A90E2"} loading={isLoading} size={80} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip: any) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onEdit={() => handleEdit(trip)}
                onDelete={() => deleteTrip(trip.id.toString())}
              />
            ))}
          </div>
        )}
      </ComponentCard>

      {isPanelOpen && selectedTrip && (
        <div className="fixed z-50 top-0 right-0 h-full w-full md:w-1/3 bg-white p-8 shadow-lg dark:bg-boxdark overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Update Trip Status
            </h2>
            <Button onClick={handlePanelClose} variant="outline" size="sm">
              Close
            </Button>
          </div>
            <div className="space-y-6">
                <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">{selectedTrip.destination}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Status: <span className="font-semibold">{selectedTrip.status}</span></p>
                </div>
                <div>
                    <Label htmlFor="status">New Status</Label>
                    <Select
                        defaultValue={newStatus}
                        onChange={(value) => setNewStatus(value)}
                        options={statusOptions}
                        placeholder="Select a new status"
                    />
                </div>
              <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={handlePanelClose}>Cancel</Button>
                    <Button onClick={handleStatusUpdate}>Save Changes</Button>
              </div>
            </div>
        </div>
      )}
    </>
  );
};

export default ViewTrips;