import React, { useState } from "react";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AboutDetailPanel from "../../components/about/AboutDetailPanel";

export interface FormDataState {
  title: string;
  story: string;
  image: File | null | string;
}

export default function AboutUs() {
  const [formData, setFormData] = useState<FormDataState>({
    title: "Welcome to JB HeartFelt Tours",
    story:
      "At JB HeartFelt Tours, we craft unforgettable travel experiences filled with warmth, adventure, and connection. Our passion is to share the beauty of the world with you, one heartfelt journey at a time.",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false); // Right panel is closed by default

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleTextAreaChange = (value: string) => {
    setFormData((prev) => ({ ...prev, story: value }));
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setFormData((prev) => ({ ...prev, image: file }));
        setPreviewUrl(URL.createObjectURL(file));
        setError("");
      } else {
        setError("Please select a valid image file");
        setPreviewUrl(null);
        setFormData((prev) => ({ ...prev, image: null }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("story", formData.story);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const response = await fetch("/aboutus/update", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        setSuccess("About Us content updated successfully!");
        setError("");
      } else {
        setError("Failed to update content. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating the content.");
    }
  };

  return (
    <>
      <PageMeta
        title="About JB HeartFelt Tours"
        description="Manage the About Us content for JB HeartFelt Tours."
      />
      <PageBreadcrumb pageTitle="About Us" />
      <div className="min-h-screen flex rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-7.5">
        {/* Main Content: Preview */}
        <div className="flex-1 p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extralight text-gray-800 dark:text-white sm:text-3xl">
              About Us Preview
            </h2>
            <button
              onClick={() => setIsPanelOpen(true)}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Edit Content
            </button>
          </div>
          <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-extralight text-gray-800 dark:text-white mb-4">
              {formData.title || "Preview Title"}
            </h2>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            ) : (
              typeof formData.image === 'string' && (
                <img
                  src={formData.image}
                  alt="Current"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )
            )}
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {formData.story || "Preview story content will appear here."}
            </p>
          </div>
        </div>

        {isPanelOpen && (
          <AboutDetailPanel
            formData={formData}
            onClose={() => setIsPanelOpen(false)}
            onInputChange={handleInputChange}
            onTextAreaChange={handleTextAreaChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
            previewUrl={previewUrl}
            error={error}
            success={success}
          />
        )}
      </div>
    </>
  );
}
