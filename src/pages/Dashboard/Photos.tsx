import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TextAreaInput from "../../components/form/input/TextArea";
import Input from "../../components/form/input/InputField";
import DropzoneComponent from "../../components/form/form-elements/DropZone";

const Photos: React.FC = () => {
  const [formData, setFormData] = useState({
    image_title: "",
    description: "",
    image_location: "",
    file: null as File | null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, file }));
      setError("");
    } else {
      setError("Please select a valid image file.");
      setFormData((prev) => ({ ...prev, file: null }));
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      handleFileSelect(acceptedFiles[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      setError("Please select an image to upload");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    const data = new FormData();
    data.append("file", formData.file);
    
    const queryParams = new URLSearchParams({
        image_title: formData.image_title,
        description: formData.description,
        image_location: formData.image_location,
    }).toString();

    const url = `https://jbheartfelt-api.onrender.com/photos/upload?${queryParams}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        setSuccess("Image uploaded successfully!");
        setFormData({ image_title: "", description: "", image_location: "", file: null });
        setError("");
      } else {
        const errorText = await response.text();
        setError(`Failed to upload image: ${errorText}`);
      }
    } catch {
      setError("An error occurred while uploading the image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Add Photos"
        description="Add new photos to the gallery."
      />
      <PageBreadcrumb pageTitle="Add Photo" />

      <div className=" mx-auto">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Upload a New Photo
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Share your moments with the world.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DropzoneComponent onDrop={handleDrop} disabled={isUploading} file={formData.file} />

              <div className="space-y-6">
                <div>
                  <label htmlFor="image_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image Title
                  </label>
                  <Input
                    type="text"
                    name="image_title"
                    id="image_title"
                    value={formData.image_title}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="e.g., Sunset over the mountains"
                  />
                </div>
                <div>
                  <label htmlFor="image_location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <Input
                    type="text"
                    name="image_location"
                    id="image_location"
                    value={formData.image_location}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="e.g., Kasese, Uganda"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <TextAreaInput
                    value={formData.description}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, description: value }))
                    }
                    placeholder="A brief description of the image"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-3 rounded-none border border-transparent bg-indigo-600 py-3 px-5 text-base font-semibold text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Upload className="h-6 w-6" />
              )}
              {isUploading ? "Uploading..." : "Upload Image"}
            </button>
            
            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center font-medium">{success}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default Photos;
