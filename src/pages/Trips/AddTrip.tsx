import { useState } from 'react';
import { motion } from 'framer-motion';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import InputField from '../../components/form/input/InputField';
import Label from '../../components/form/Label';
import TextArea from '../../components/form/input/TextArea';
import Select from '../../components/form/Select';
import Button from '../../components/ui/button/Button';
import Alert from '../../components/ui/alert/Alert';
import { X } from 'lucide-react';

interface Trip {
  id: string;
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

const AddTrip = () => {
  const [trip, setTrip] = useState({
    destination: '',
    price: 0,
    description: '',
    image_url: '',
    start_date: '',
    end_date: '',
    ratings: 0,
    max_capacity: 0,
    required_staff: 0,
    status: 'active',
    gallery: [] as string[],
  });
  const [galleryInput, setGalleryInput] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [previewTrip, setPreviewTrip] = useState<Trip | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTrip((prevTrip) => ({
      ...prevTrip,
      [name]: name === 'price' || name === 'ratings' || name === 'max_capacity' || name === 'required_staff' ? Number(value) : value,
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setTrip((prevTrip) => ({
      ...prevTrip,
      description: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setTrip((prevTrip) => ({
      ...prevTrip,
      status: value,
    }));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGalleryInput(e.target.value);
    const urls = e.target.value.split(',').map((url) => url.trim()).filter((url) => url);
    setTrip((prevTrip) => ({
      ...prevTrip,
      gallery: urls,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://jbheartfelt-api.onrender.com/books/trips/', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...trip,
          start_date: new Date(trip.start_date).toISOString(),
          end_date: new Date(trip.end_date).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add trip');
      }

      const newTrip = await response.json();
      setPreviewTrip(newTrip);
      setIsPreviewOpen(true);
      setAlert({ type: 'success', message: 'Trip added successfully!' });
      setTrip({
        destination: '',
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
      });
      setGalleryInput('');
    } catch (error) {
      setAlert({ type: 'error', message: `Error adding trip: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <PageMeta title="Add Trip" description="Create a new travel destination" />
      <PageBreadCrumb pageTitle="Add Trip" />

      <div className="max-w-8xl px-4 py-8">
        {alert && (
          <div className="mb-4">
            <Alert
              variant={alert.type}
              title={alert.type === 'success' ? 'Success' : 'Error'}
              message={alert.message}
            />
          </div>
        )}

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Add New Trip</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6.5">
            <div className="mb-4.5">
              <Label htmlFor="destination">Destination</Label>
              <InputField
                type="text"
                id="destination"
                name="destination"
                placeholder="Enter destination"
                value={trip.destination}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4.5">
              <Label htmlFor="price">Price</Label>
              <InputField
                type="number"
                id="price"
                name="price"
                placeholder="Enter price"
                value={trip.price}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4.5">
              <Label>Description</Label>
              <TextArea
                rows={4}
                value={trip.description}
                onChange={handleDescriptionChange}
                placeholder="Enter description"
              />
            </div>

            <div className="mb-4.5">
              <Label htmlFor="image_url">Main Image URL</Label>
              <InputField
                type="text"
                id="image_url"
                name="image_url"
                placeholder="Enter main image URL"
                value={trip.image_url}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4.5">
              <Label htmlFor="gallery">Gallery Image URLs (comma-separated)</Label>
              <InputField
                type="text"
                id="gallery"
                name="gallery"
                placeholder="Enter gallery image URLs, e.g., url1, url2"
                value={galleryInput}
                onChange={handleGalleryChange}
              />
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <Label htmlFor="start_date">Start Date</Label>
                <InputField
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={trip.start_date}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full xl:w-1/2">
                <Label htmlFor="end_date">End Date</Label>
                <InputField
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={trip.end_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <Label htmlFor="ratings">Ratings (0-5)</Label>
                <InputField
                  type="number"
                  id="ratings"
                  name="ratings"
                  // step="0.1"
                  min="0"
                  max="5"
                  placeholder="Enter ratings"
                  value={trip.ratings}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full xl:w-1/2">
                <Label htmlFor="max_capacity">Max Capacity</Label>
                <InputField
                  type="number"
                  id="max_capacity"
                  name="max_capacity"
                  min="0"
                  placeholder="Enter max capacity"
                  value={trip.max_capacity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4.5">
              <Label htmlFor="required_staff">Required Staff</Label>
              <InputField
                type="number"
                id="required_staff"
                name="required_staff"
                min="0"
                placeholder="Enter required staff"
                value={trip.required_staff}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <Label>Status</Label>
              <Select
                defaultValue={trip.status}
                onChange={handleSelectChange}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
              />
            </div>

            <Button
              variant="primary"
              className="flex w-full justify-center rounded-none bg-primary p-3 font-medium text-gray"
            >
              Add Trip
            </Button>
          </form>
        </div>

        {isPreviewOpen && previewTrip && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed z-100 top-0 right-0 h-full w-full md:w-1/3 bg-white dark:bg-boxdark p-8 shadow-lg overflow-y-auto"
          >
            <Button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X />
            </Button>
            <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">Trip Preview</h2>
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm border border-stroke dark:border-strokedark p-4">
              <img
                src={previewTrip.image_url}
                alt={previewTrip.destination}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {previewTrip.destination}
              </h3>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  ${previewTrip.price.toFixed(2)}
                </span>
                <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2v4M16 2v4M3.5 9h17M21 8v9a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5h8a5 5 0 015 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {formatDate(previewTrip.start_date)} - {formatDate(previewTrip.end_date)}
                </span>
                <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.375 2.454a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.375-2.454a1 1 0 00-1.175 0l-3.375 2.454c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.614 9.397c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z" fill="currentColor"/>
                  </svg>
                  {previewTrip.ratings.toFixed(1)}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full ${
                  previewTrip.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {previewTrip.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-3">
                {previewTrip.description}
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p><strong>Max Capacity:</strong> {previewTrip.max_capacity}</p>
                <p><strong>Required Staff:</strong> {previewTrip.required_staff}</p>
                {previewTrip.gallery.length > 0 && (
                  <div className="mt-3">
                    <p><strong>Gallery:</strong></p>
                    <div className="flex flex-wrap gap-2">
                      {previewTrip.gallery.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Gallery image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default AddTrip;