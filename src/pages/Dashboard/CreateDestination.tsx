import { useState } from 'react';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import InputField from '../../components/form/input/InputField';
import Label from '../../components/form/Label';
import TextArea from '../../components/form/input/TextArea';
import Button from '../../components/ui/button/Button';
import Swal from 'sweetalert2';

const CreateDestination = () => {
  const [destination, setDestination] = useState({
    title: '',
    description: '',
    key_highlights: '',
    ratings: 0,
    image_urls: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDestination((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHighlightsChange = (value: string) => {
    setDestination((prev) => ({
      ...prev,
      key_highlights: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const highlightsArray = destination.key_highlights.split(',').map(item => item.trim());
    const imageUrls = destination.image_urls.split(',').map(item => item.trim());
    const d_images = {
      thumbnail: imageUrls[0],
      gallery: imageUrls.slice(1),
    };

    const data = {
      title: destination.title,
      description: destination.description,
      key_highlights: highlightsArray,
      ratings: destination.ratings,
      d_images: d_images,
    };

    fetch('https://jbheartfelt-api.onrender.com/places/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      if (data.id) {
        Swal.fire('Success!', 'Destination created successfully.', 'success');
        setDestination({
          title: '',
          description: '',
          key_highlights: '',
          ratings: 0,
          image_urls: '',
        });
      } else {
        Swal.fire('Error!', 'There was an error creating the destination.', 'error');
      }
    })
    .catch(error => {
      console.error('Error creating destination:', error);
      Swal.fire('Error!', 'There was an error creating the destination.', 'error');
    });
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Create Destination" />
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-white/[0.05] dark:bg-white/[0.03]">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <InputField
                id="title"
                name="title"
                value={destination.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <TextArea
                rows={4}
                value={destination.description}
                onChange={(value) => setDestination(prev => ({...prev, description: value}))}
              />
            </div>
            <div>
              <Label htmlFor="key_highlights">Key Highlights (comma separated)</Label>
              <TextArea
                rows={4}
                value={destination.key_highlights}
                onChange={handleHighlightsChange}
              />
            </div>
            <div>
              <Label htmlFor="ratings">Ratings</Label>
              <InputField
                id="ratings"
                name="ratings"
                type="number"
                value={destination.ratings}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="image_urls">Image URLs (comma separated)</Label>
              <TextArea
                rows={4}
                value={destination.image_urls}
                onChange={(value) => setDestination(prev => ({...prev, image_urls: value}))}
              />
            </div>
            <Button type="submit">Create Destination</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateDestination;
