import { Folder, Video } from "lucide-react";

const StorageInfo = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      {/* Image Storage Card */}
      <div className="flex items-center p-5 rounded-lg bg-white dark:bg-gray-800 shadow-md">
        <div className="flex-shrink-0 mr-4">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50">
            <Folder className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Image</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">17% Used</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">245 files</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">26.40 GB</p>
        </div>
      </div>

      {/* Video Storage Card */}
      <div className="flex items-center p-5 rounded-lg bg-white dark:bg-gray-800 shadow-md">
        <div className="flex-shrink-0 mr-4">
          <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/50">
            <Video className="h-6 w-6 text-pink-600 dark:text-pink-400" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Videos</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">22% Used</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">245 files</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">26.40 GB</p>
        </div>
      </div>
    </div>
  );
};

export default StorageInfo;
