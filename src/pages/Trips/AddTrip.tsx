import { useState } from 'react';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import InputField from '../../components/form/input/InputField';
import Label from '../../components/form/Label';
import TextArea from '../../components/form/input/TextArea';
import Select from '../../components/form/Select';
import Button from '../../components/ui/button/Button';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTrip as apiAddTrip } from '../../lib/api';
import { Loader2 } from 'lucide-react';

const initialTripState = {
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
};

// ** UPDATED: Status options to match ViewTrips **
const statusOptions = [
    { value: "active", label: "Active" },
    { value: "progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];


const AddTrip = () => {
  const queryClient = useQueryClient();
  const [trip, setTrip] = useState(initialTripState);
  const [galleryInput, setGalleryInput] = useState('');

  const addTripMutation = useMutation({
    mutationFn: apiAddTrip,
    onSuccess: () => {
      toast.success('Trip added successfully!');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setTrip(initialTripState);
      setGalleryInput('');
    },
    onError: (error) => {
      toast.error('Failed to add trip.', {
        description: error.message || 'An unknown error occurred.',
      });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTrip((prevTrip) => ({
      ...prevTrip,
      [name]: ['price', 'ratings', 'max_capacity', 'required_staff'].includes(name) 
        ? Number(value) 
        : value,
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setTrip((prevTrip) => ({ ...prevTrip, description: value }));
  };

  const handleSelectChange = (value: string) => {
    setTrip((prevTrip) => ({ ...prevTrip, status: value }));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGalleryInput(value);
    
    // Process gallery URLs - split by comma and trim whitespace
    const urls = value
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    setTrip((prevTrip) => ({ ...prevTrip, gallery: urls }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!trip.destination || !trip.image_url || !trip.start_date || !trip.end_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate at least one gallery image
    if (trip.gallery.length === 0) {
      toast.error('Please add at least one gallery image URL');
      return;
    }

    // Validate main image is included in gallery
    // if (!trip.gallery.includes(trip.image_url)) {
    //   toast.warning('Main image should also be included in the gallery');
    //   return;
    // }

    const payload = {
      ...trip,
      start_date: new Date(trip.start_date).toISOString(),
      end_date: new Date(trip.end_date).toISOString(),
      // Ensure gallery is an array of strings
      gallery: trip.gallery.filter(url => url.length > 0),
    };

    try {
      await addTripMutation.mutateAsync(payload);
    } catch (error) {
      console.error('Error adding trip:', error);
    }
  };

  return (
    <>
      <PageMeta title="Add Trip" description="Create a new travel destination" />
      <PageBreadCrumb pageTitle="Add Trip" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Add New Trip</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6.5">
            <div className="mb-4.5">
              <Label htmlFor="destination">Destination*</Label>
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
              <Label htmlFor="price">Price*</Label>
              <InputField 
                type="number" 
                id="price" 
                name="price" 
                placeholder="Enter price" 
                value={trip.price} 
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="mb-4.5">
              <Label>Description*</Label>
              <TextArea 
                rows={4} 
                value={trip.description} 
                onChange={handleDescriptionChange} 
                placeholder="Enter description"
              />
            </div>

            <div className="mb-4.5">
              <Label htmlFor="image_url">Main Image URL*</Label>
              <InputField 
                type="text" 
                id="image_url" 
                name="image_url" 
                placeholder="Enter main image URL (e.g., https://example.com/image.jpg)" 
                value={trip.image_url} 
                onChange={handleChange}
              />
            </div>

            <div className="mb-4.5">
              <Label htmlFor="gallery">Gallery Image URLs* (comma-separated)</Label>
              <InputField 
                type="text" 
                id="gallery" 
                name="gallery" 
                placeholder="Enter gallery image URLs, e.g., https://example.com/image1.jpg, https://example.com/image2.jpg" 
                value={galleryInput} 
                onChange={handleGalleryChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                {trip.gallery.length} image(s) added
              </p>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <Label htmlFor="start_date">Start Date*</Label>
                <InputField 
                  type="date" 
                  id="start_date" 
                  name="start_date" 
                  value={trip.start_date} 
                  onChange={handleChange}
                />
              </div>
              <div className="w-full xl:w-1/2">
                <Label htmlFor="end_date">End Date*</Label>
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
                  min="0" 
                  max="5" 
                  placeholder="Enter ratings" 
                  value={trip.ratings} 
                  onChange={handleChange}
                />
              </div>
              <div className="w-full xl:w-1/2">
                <Label htmlFor="max_capacity">Max Capacity*</Label>
                <InputField 
                  type="number" 
                  id="max_capacity" 
                  name="max_capacity" 
                  min="1" 
                  placeholder="Enter max capacity" 
                  value={trip.max_capacity} 
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4.5">
              <Label htmlFor="required_staff">Required Staff*</Label>
              <InputField 
                type="number" 
                id="required_staff" 
                name="required_staff" 
                min="1" 
                placeholder="Enter required staff" 
                value={trip.required_staff} 
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <Label>Status*</Label>
              <Select
                defaultValue={trip.status}
                onChange={handleSelectChange}
                options={statusOptions}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={addTripMutation.isPending}
              className="flex w-full justify-center rounded-md p-3 font-medium text-gray disabled:opacity-60"
            >
              {addTripMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Trip"
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddTrip;