import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import TripCard from '../../components/cards/TripCard';
import InputField from '../../components/form/input/InputField';
import Label from '../../components/form/Label';
import TextArea from '../../components/form/input/TextArea';
import { X } from 'lucide-react';
import Button from '../../components/ui/button/Button';

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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
    const savedView = localStorage.getItem('tripsViewMode');
    return savedView === 'list' ? 'list' : 'grid';
  });

  useEffect(() => {
    fetch('https://jbheartfelt-api.onrender.com/books/trips/')
      .then((response) => response.json())
      .then((data) => setTrips(data));
  }, []);

  useEffect(() => {
    localStorage.setItem('tripsViewMode', viewMode);
  }, [viewMode]);

  const handleEdit = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsPanelOpen(true);
  };

  const handleDelete = (trip: Trip) => {
    // Handle delete logic
    console.log('Deleting trip:', trip);
    setTrips(trips.filter((t) => t.id !== trip.id));
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setSelectedTrip(null);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTrip) {
      setTrips(trips.map((t) => (t.id === selectedTrip.id ? selectedTrip : t)));
      handlePanelClose();
    }
  };

  return (
    <>
      <PageMeta title="View Trips" description="Explore and manage your travel destinations" />
      <PageBreadCrumb pageTitle="View Trips" />

      <div className=" max-w-8xl px-4 py-8">
        <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Available Trips</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h7v7H3V3zM14 3h7v7h-7V3zM14 14h7v7h-7v-7zM3 14h7v7H3v-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <Button
                variant="primary"
                onClick={() => setIsPanelOpen(true)}
                className="flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                New Trip
              </Button>
            </div>
          </div>

          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2' : 'space-y-4'}>
            {trips.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2v4M16 2v4M3.5 9h17M21 8v9a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5h8a5 5 0 015 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No trips available</p>
                <Button
                  variant="primary"
                  onClick={() => setIsPanelOpen(true)}
                  className="flex items-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Add Trip
                </Button>
              </div>
            ) : (
              trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  viewMode={viewMode}
                  onEdit={() => handleEdit(trip)}
                  onDelete={() => handleDelete(trip)}
                />
              ))
            )}
          </div>
        </div>

        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed z-100 top-0 right-0 h-full w-full md:w-1/3 bg-white dark:bg-boxdark p-8 shadow-lg overflow-y-auto"
          >
            <Button onClick={handlePanelClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X />
            </Button>
            <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">
              {selectedTrip ? 'Edit Trip' : 'Add New Trip'}
            </h2>
            <form onSubmit={handleSaveChanges}>
              <div className="mb-4.5">
                <Label htmlFor="destination">Destination</Label>
                <InputField
                  type="text"
                  id="destination"
                  name="destination"
                  placeholder="Enter destination"
                  value={selectedTrip?.destination || ''}
                  onChange={(e) =>
                    setSelectedTrip(
                      selectedTrip
                        ? { ...selectedTrip, destination: e.target.value }
                        : {
                            id: Date.now(),
                            destination: e.target.value,
                            price: 0,
                            description: '',
                            image_url: '',
                            start_date: '',
                            end_date: '',
                            ratings: 0,
                            max_capacity: 0,
                            required_staff: 0,
                            status: 'active',
                            gallery: [],
                          }
                    )
                  }
                />
              </div>

              <div className="mb-4.5">
                <Label htmlFor="price">Price</Label>
                <InputField
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Enter price"
                  value={selectedTrip?.price || 0}
                  onChange={(e) =>
                    setSelectedTrip(
                      selectedTrip
                        ? { ...selectedTrip, price: Number(e.target.value) }
                        : { ...selectedTrip!, price: Number(e.target.value) }
                    )
                  }
                />
              </div>

              <div className="mb-4.5">
                <Label>Description</Label>
                <TextArea
                  rows={4}
                  value={selectedTrip?.description || ''}
                  onChange={(value) =>
                    setSelectedTrip(
                      selectedTrip
                        ? { ...selectedTrip, description: value }
                        : { ...selectedTrip!, description: value }
                    )
                  }
                  placeholder="Enter description"
                />
              </div>

              <div className="mb-4.5">
                <Label htmlFor="image_url">Image URL</Label>
                <InputField
                  type="text"
                  id="image_url"
                  name="image_url"
                  placeholder="Enter image URL"
                  value={selectedTrip?.image_url || ''}
                  onChange={(e) =>
                    setSelectedTrip(
                      selectedTrip
                        ? { ...selectedTrip, image_url: e.target.value }
                        : { ...selectedTrip!, image_url: e.target.value }
                    )
                  }
                />
              </div>

              <div className="mb-4.5">
                <Label htmlFor="start_date">Start Date</Label>
                <InputField
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={selectedTrip?.start_date.split('T')[0] || ''}
                  onChange={(e) =>
                    setSelectedTrip(
                      selectedTrip
                        ? { ...selectedTrip, start_date: e.target.value }
                        : { ...selectedTrip!, start_date: e.target.value }
                    )
                  }
                />
              </div>

              <div className="mb-4.5">
                <Label htmlFor="end_date">End Date</Label>
                <InputField
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={selectedTrip?.end_date.split('T')[0] || ''}
                  onChange={(e) =>
                    setSelectedTrip(
                      selectedTrip
                        ? { ...selectedTrip, end_date: e.target.value }
                        : { ...selectedTrip!, end_date: e.target.value }
                    )
                  }
                />
              </div>

              <div className="mb-4.5">
                <Label htmlFor="ratings">Ratings</Label>
                <InputField
                  type="number"
                  id="ratings"
                  name="ratings"
                  // step="0.1"
                  placeholder="Enter ratings (0-5)"
                  value={selectedTrip?.ratings || 0}
                  onChange={(e) =>
                    setSelectedTrip(
                      selectedTrip
                        ? { ...selectedTrip, ratings: Number(e.target.value) }
                        : { ...selectedTrip!, ratings: Number(e.target.value) }
                    )
                  }
                />
              </div>

              <div className="mb-4.5">
                <Label htmlFor="max_capacity">Max Capacity</Label>
                <InputField
                  type="number"
                  id="max_capacity"
                  name="max_capacity"
                  placeholder="Enter max capacity"
                  value={selectedTrip?.max_capacity || 0}
                  onChange={(e) =>
                    setSelectedTrip(
                      selectedTrip
                        ? { ...selectedTrip, max_capacity: Number(e.target.value) }
                        : { ...selectedTrip!, max_capacity: Number(e.target.value) }
                    )
                  }
                />
              </div>

              <div className="mb-4.5">
                <Label htmlFor="required_staff">Required Staff</Label>
                <InputField
                  type="number"
                  id="required_staff"
                  name="required_staff"
                  placeholder="Enter required staff"
                  value={selectedTrip?.required_staff || 0}
                  onChange={(e) =>
                    setSelectedTrip(
                      selectedTrip
                        ? { ...selectedTrip, required_staff: Number(e.target.value) }
                        : { ...selectedTrip!, required_staff: Number(e.target.value) }
                    )
                  }
                />
              </div>

              <div className="mb-4.5">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={selectedTrip?.status || 'active'}
                  onChange={(e) =>
                    setSelectedTrip(
                      selectedTrip
                        ? { ...selectedTrip, status: e.target.value }
                        : { ...selectedTrip!, status: e.target.value }
                    )
                  }
                  className="w-full rounded-lg border border-stroke dark:border-strokedark p-3 text-sm dark:bg-boxdark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handlePanelClose}
                  className="px-4"
                >
                  Cancel
                </Button>
                <Button
                  // type="submit"
                  variant="primary"
                  className="px-4 bg-primary text-gray"
                >
                  {selectedTrip ? 'Save Changes' : 'Add Trip'}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ViewTrips;