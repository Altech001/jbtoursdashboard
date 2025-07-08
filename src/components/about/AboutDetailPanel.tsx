import React from "react";
import { X, Edit, Trash2 } from "lucide-react";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import { FormDataState } from "../../pages/Dashboard/Aboutus";

interface AboutDetailPanelProps {
  formData: FormDataState;
  onClose: () => void;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onTextAreaChange: (value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  previewUrl: string | null;
  error: string;
  success: string;
}

const AboutDetailPanel: React.FC<AboutDetailPanelProps> = ({
  formData,
  onClose,
  onInputChange,
  onTextAreaChange,
  onFileChange,
  onSubmit,
  previewUrl,
  error,
  success,
}) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 z-40" onClick={onClose}>
      <div
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
            Edit About Us
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Title
              </label>
              <Input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={onInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
                placeholder="Enter About Us title"
              />
            </div>
            <div>
              <label
                htmlFor="story"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Story
              </label>
              <TextArea
                value={formData.story}
                onChange={onTextAreaChange}
                rows={6}
                placeholder="Enter the about us story"
              />
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Upload Image
              </label>
              <div className="mt-2 border px-2 p-2 py-2 rounded">
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={onFileChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-gray-700 dark:file:text-indigo-200 dark:hover:file:bg-gray-600"
                />
              </div>
              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
          </form>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex gap-4 mb-4">
            <button
              onClick={onSubmit}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-100 text-blue-700 px-4 py-2.5 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900"
            >
              <Edit size={18} />
              Save Changes
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

export default AboutDetailPanel;
