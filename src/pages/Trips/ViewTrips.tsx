import { useEffect, useState } from "react";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TripCard from "../../components/cards/TripCard";
import InputField from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";
import ComponentCard from "../../components/common/ComponentCard";

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

const ViewTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://jbheartfelt-api.onrender.com/books/trips/")
      .then((response) => response.json())
      .then((data) => {
        setTrips(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trips:", error);
        setIsLoading(false);
      });
  }, []);

  const handleEdit = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsPanelOpen(true);
  };

  const handleDelete = (trip: Trip) => {
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
        fetch(`https://jbheartfelt-api.onrender.com/books/trips/${trip.id}`, {
          method: "DELETE",
        })
          .then(() => {
            setTrips(trips.filter((t) => t.id !== trip.id));
            Swal.fire("Deleted!", "The trip has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting trip:", error);
            Swal.fire(
              "Error!",
              "There was an error deleting the trip.",
              "error"
            );
          });
      }
    });
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setSelectedTrip(null);
  };

  const handleSaveChanges = () => {
    if (selectedTrip) {
      fetch(
        `https://jbheartfelt-api.onrender.com/books/trips/${selectedTrip.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedTrip),
        }
      )
        .then((response) => response.json())
        .then((updatedTrip) => {
          setTrips(
            trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
          );
          handlePanelClose();
          Swal.fire("Saved!", "The trip has been updated.", "success");
        })
        .catch((error) => {
          console.error("Error updating trip:", error);
          Swal.fire("Error!", "There was an error updating the trip.", "error");
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
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onEdit={() => handleEdit(trip)}
                onDelete={() => handleDelete(trip)}
              />
            ))}
          </div>
        )}
      </ComponentCard>

      {isPanelOpen && selectedTrip && (
        <div className="fixed z-50 top-0 right-0 h-full w-2/5 bg-white p-8 shadow-lg dark:bg-boxdark overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Edit Trip
            </h2>
            <Button onClick={handlePanelClose} variant="outline" size="sm">
              Close
            </Button>
          </div>
          <form>
            <div className="space-y-4">
              <div>
                <Label htmlFor="destination">Destination</Label>
                <InputField
                  id="destination"
                  name="destination"
                  value={selectedTrip.destination}
                  onChange={(e) =>
                    setSelectedTrip({
                      ...selectedTrip,
                      destination: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <InputField
                  id="price"
                  name="price"
                  type="number"
                  value={selectedTrip.price}
                  onChange={(e) =>
                    setSelectedTrip({
                      ...selectedTrip,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <TextArea
                  rows={4}
                  value={selectedTrip.description}
                  onChange={(value) =>
                    setSelectedTrip({ ...selectedTrip, description: value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <InputField
                  id="image_url"
                  name="image_url"
                  value={selectedTrip.image_url}
                  onChange={(e) =>
                    setSelectedTrip({
                      ...selectedTrip,
                      image_url: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <InputField
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={selectedTrip.start_date.split("T")[0]}
                  onChange={(e) =>
                    setSelectedTrip({
                      ...selectedTrip,
                      start_date: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <InputField
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={selectedTrip.end_date.split("T")[0]}
                  onChange={(e) =>
                    setSelectedTrip({
                      ...selectedTrip,
                      end_date: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ratings">Ratings</Label>
                <InputField
                  id="ratings"
                  name="ratings"
                  type="number"
                  value={selectedTrip.ratings}
                  onChange={(e) =>
                    setSelectedTrip({
                      ...selectedTrip,
                      ratings: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="max_capacity">Max Capacity</Label>
                <InputField
                  id="max_capacity"
                  name="max_capacity"
                  type="number"
                  value={selectedTrip.max_capacity}
                  onChange={(e) =>
                    setSelectedTrip({
                      ...selectedTrip,
                      max_capacity: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="required_staff">Required Staff</Label>
                <InputField
                  id="required_staff"
                  name="required_staff"
                  type="number"
                  value={selectedTrip.required_staff}
                  onChange={(e) =>
                    setSelectedTrip({
                      ...selectedTrip,
                      required_staff: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <InputField
                  id="status"
                  name="status"
                  value={selectedTrip.status}
                  onChange={(e) =>
                    setSelectedTrip({ ...selectedTrip, status: e.target.value })
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

export default ViewTrips;
