import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { Heart, MapPin } from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PhotoDetailPanel from "../../components/photos/PhotoDetailPanel";

interface GalleryPhoto {
  id: string;
  image_url: string;
  image_title: string | null;
  description: string | null;
  image_location: string | null;
  image_likes: number;
  created_at: string;
}

const ViewPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("https://jbheartfelt-api.onrender.com/photos/gallery");
        if (!response.ok) {
          throw new Error("Failed to fetch photos");
        }
        const data: GalleryPhoto[] = await response.json();
        setPhotos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handlePhotoClick = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedPhoto(null);
  };

  const handleLikePhoto = async (photoId: string) => {
    try {
      const response = await fetch(`https://jbheartfelt-api.onrender.com/photos/photos/${photoId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const updatedPhoto = await response.json();
        setPhotos((prevPhotos) =>
          prevPhotos.map((p) =>
            p.id === photoId ? { ...p, image_likes: updatedPhoto.likes } : p
          )
        );
        setSelectedPhoto((prev) => prev && { ...prev, image_likes: updatedPhoto.likes });
      } else {
        console.error("Failed to like the photo");
      }
    } catch (error) {
      console.error("An error occurred while liking the photo:", error);
    }
  };

  return (
    <>
      <PageMeta
        title="View Photos"
        description="View all photos in the gallery."
      />
      <PageBreadcrumb pageTitle="View Photos" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-7.5">
        <h2 className="text-2xl font-extralight text-gray-800 dark:text-white mb-6">
          Gallery
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color={"#4A90E2"} loading={loading} size={80} />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="grid -z-50 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group z-10 cursor-pointer border overflow-hidden transform hover:scale-105 transition-transform duration-300"
                onClick={() => handlePhotoClick(photo)}
              >
                <img
                  src={photo.image_url}
                  alt={photo.image_title || ""}
                  className="w-full h-48 object-cover -z-10"
                />
                <div className="p-4 bg-white dark:bg-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {photo.image_title || "Untitled"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                    {photo.description || "No description"}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin size={16} />
                      <span>{photo.image_location || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-red-500">
                      <Heart size={16} />
                      <span>{photo.image_likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isPanelOpen && (
        <PhotoDetailPanel
          photo={selectedPhoto}
          onClose={handleClosePanel}
          onLike={handleLikePhoto}
        />
      )}
    </>
  );
};

export default ViewPhotos;
