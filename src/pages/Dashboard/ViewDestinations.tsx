import { useEffect, useState } from 'react';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import Button from '../../components/ui/button/Button';
import InputField from '../../components/form/input/InputField';
import Label from '../../components/form/Label';
import TextArea from '../../components/form/input/TextArea';
import Swal from 'sweetalert2';
import ClipLoader from 'react-spinners/ClipLoader';

interface Destination {
  id: string;
  title: string;
  description: string;
  key_highlights: string[];
  ratings: number;
  d_images: {
    thumbnail: string;
    gallery?: string[];
  };
}

const ViewDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://jbheartfelt-api.onrender.com/places/')
      .then((response) => response.json())
      .then((data) => {
        setDestinations(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching destinations:', error);
        setIsLoading(false);
      });
  }, []);

  const handleEdit = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsEditPanelOpen(true);
  };

  const handleDelete = (destinationId: string) => {
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
        fetch(`https://jbheartfelt-api.onrender.com/places/${destinationId}`, {
          method: 'DELETE',
        })
        .then(() => {
          setDestinations(destinations.filter((dest) => dest.id !== destinationId));
          Swal.fire('Deleted!', 'The destination has been deleted.', 'success');
        })
        .catch((error) => {
          console.error('Error deleting destination:', error);
          Swal.fire('Error!', 'There was an error deleting the destination.', 'error');
        });
      }
    });
  };

  const handlePanelClose = () => {
    setIsEditPanelOpen(false);
    setSelectedDestination(null);
  };

  const handleSaveChanges = () => {
    if (selectedDestination) {
      const highlightsArray = Array.isArray(selectedDestination.key_highlights)
        ? selectedDestination.key_highlights
        : (selectedDestination.key_highlights as string).split(',').map((item: string) => item.trim());

      const data = {
        ...selectedDestination,
        key_highlights: highlightsArray,
      };

      fetch(`https://jbheartfelt-api.onrender.com/places/${selectedDestination.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(updatedDestination => {
        setDestinations(destinations.map(d => d.id === updatedDestination.id ? updatedDestination : d));
        handlePanelClose();
        Swal.fire('Saved!', 'The destination has been updated.', 'success');
      })
      .catch(error => {
        console.error('Error updating destination:', error);
        Swal.fire('Error!', 'There was an error updating the destination.', 'error');
      });
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="View Destinations" />
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color={"#4A90E2"} loading={isLoading} size={80} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <div key={destination.id} className="group relative bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 max-w-md mx-auto overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={destination.d_images.thumbnail}
                  alt={destination.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">{destination.title}</h3>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {destination.description}
                </p>
                <div className="mt-5 flex items-center gap-3 justify-between">
                  <Button onClick={() => handleEdit(destination)} className="flex-1">Edit</Button>
                  <Button onClick={() => handleDelete(destination.id)} className="flex-1" variant="outline">Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditPanelOpen && selectedDestination && (
        <div className="fixed top-0 z-50 right-0 h-full w-2/5 bg-white p-8 shadow-lg dark:bg-boxdark overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Destination</h2>
            <Button onClick={handlePanelClose} variant="outline" size="sm">Close</Button>
          </div>
          <form>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <InputField
                  id="title"
                  name="title"
                  value={selectedDestination.title}
                  onChange={(e) => setSelectedDestination({ ...selectedDestination, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <TextArea
                  rows={4}
                  value={selectedDestination.description}
                  onChange={(value) => setSelectedDestination({ ...selectedDestination, description: value })}
                />
              </div>
              <div>
                <Label htmlFor="key_highlights">Key Highlights (comma separated)</Label>
                <TextArea
                  rows={4}
                  value={Array.isArray(selectedDestination.key_highlights) ? selectedDestination.key_highlights.join(', ') : ''}
                  onChange={(value) => setSelectedDestination({ ...selectedDestination, key_highlights: value.split(',').map((item: string) => item.trim()) })}
                />
              </div>
              <div>
                <Label htmlFor="image_urls">Image URLs (comma separated)</Label>
                <TextArea
                  rows={4}
                  value={selectedDestination.d_images.thumbnail + (selectedDestination.d_images.gallery ? ', ' + selectedDestination.d_images.gallery.join(', ') : '')}
                  onChange={(value) => {
                    const urls = value.split(',').map(item => item.trim());
                    setSelectedDestination({
                      ...selectedDestination,
                      d_images: {
                        thumbnail: urls[0],
                        gallery: urls.slice(1),
                      },
                    });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="ratings">Ratings</Label>
                <InputField
                  id="ratings"
                  name="ratings"
                  type="number"
                  value={selectedDestination.ratings}
                  onChange={(e) => setSelectedDestination({ ...selectedDestination, ratings: Number(e.target.value) })}
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

export default ViewDestinations;
