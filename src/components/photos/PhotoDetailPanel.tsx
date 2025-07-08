import { X, Edit, Trash2, Heart } from "lucide-react";

interface GalleryPhoto {
  id: string;
  image_url: string;
  image_title: string | null;
  description: string | null;
  image_likes: number;
  created_at: string;
}

interface PhotoDetailPanelProps {
  photo: GalleryPhoto | null;
  onClose: () => void;
  onLike: (photoId: string) => void;
}

const PhotoDetailPanel: React.FC<PhotoDetailPanelProps> = ({ photo, onClose, onLike }) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 z-40" onClick={onClose}>
      <div
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {photo.image_title || "Image Details"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          <img
            src={photo.image_url}
            alt={photo.image_title || "Gallery image"}
            className="w-full rounded-xl mb-6 shadow-md"
          />
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {photo.description || "No description available."}
              </p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">Likes</h3>
                    <p className="text-gray-600 dark:text-gray-400">{photo.image_likes}</p>
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">Created At</h3>
                    <p className="text-gray-600 dark:text-gray-400">{new Date(photo.created_at).toLocaleDateString()}</p>
                </div>
            </div>
          </div>
        </div>

        {/* Footer with actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => photo && onLike(photo.id)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-100 text-green-700 px-4 py-2.5 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900"
                >
                    <Heart size={18} />
                    Like
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-100 text-blue-700 px-4 py-2.5 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900">
                    <Edit size={18} />
                    Edit
                </button>
            </div>
            <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-100 text-red-700 px-4 py-2.5 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900">
                <Trash2 size={18} />
                Delete
            </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailPanel;
