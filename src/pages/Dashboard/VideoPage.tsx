import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import InputField from '../../components/form/input/InputField';
import Label from '../../components/form/Label';
import TextArea from '../../components/form/input/TextArea';
import { X } from 'lucide-react';
import Button from '../../components/ui/button/Button';
import VideoCard from '../../components/cards/VideoCard';
import Swal from 'sweetalert2';
import ComponentCard from '../../components/common/ComponentCard';
// import VideoCard from '../../components/cards/VideoCard';

interface Video {
  id: number;
  video_url: string;
  video_title: string;
  video_likes: number;
  tags: string[] | string;
  description: string;
}

const VideoPage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
    const savedView = localStorage.getItem('videosViewMode');
    return savedView === 'list' ? 'list' : 'grid';
  });

  useEffect(() => {
    fetch('https://jbheartfelt-api.onrender.com/videos/list')
      .then((response) => response.json())
      .then((data) => setVideos(data));
  }, []);

  useEffect(() => {
    localStorage.setItem('videosViewMode', viewMode);
  }, [viewMode]);

  const handleEdit = (video: Video) => {
    setSelectedVideo(video);
    setIsPanelOpen(true);
  };

  const handleDelete = (video: Video) => {
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
        setIsLoading(true);
        fetch(`https://jbheartfelt-api.onrender.com/videos/${video.id}`, {
          method: 'DELETE',
        })
          .then((response) => {
            if (response.ok) {
              setVideos(videos.filter((v) => v.id !== video.id));
              Swal.fire('Deleted!', 'The video has been deleted.', 'success');
            } else {
              Swal.fire('Error!', 'There was an error deleting the video.', 'error');
            }
          })
          .finally(() => setIsLoading(false));
      }
    });
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setSelectedVideo(null);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVideo) {
      setIsLoading(true);
      const isNewVideo = !selectedVideo.id;
      const url = isNewVideo
        ? 'https://jbheartfelt-api.onrender.com/videos/upload'
        : `https://jbheartfelt-api.onrender.com/videos/${selectedVideo.id}`;
      const method = isNewVideo ? 'POST' : 'PUT';

      const videoData = isNewVideo
        ? {
            video_title: selectedVideo.video_title,
            video_url: selectedVideo.video_url,
            video_likes: selectedVideo.video_likes,
            tags: selectedVideo.tags,
            description: selectedVideo.description,
          }
        : selectedVideo;

      fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (isNewVideo) {
            setVideos([...videos, data]);
            Swal.fire('Created!', 'The video has been created.', 'success');
          } else {
            setVideos(videos.map((v) => (v.id === data.id ? data : v)));
            Swal.fire('Saved!', 'The video has been updated.', 'success');
          }
          handlePanelClose();
        })
        .catch(() => {
          Swal.fire('Error!', 'There was an error saving the video.', 'error');
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <>
      <PageMeta title="Video Page" description="Explore and manage your videos" />
      <PageBreadCrumb pageTitle="Videos" />

      <ComponentCard title='Available Videos' className=" max-w-8xl px-4 py-8">
        <div className="dark:bg-boxdark rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">View Videos</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center border  dark:bg-gray-700 rounded">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h7v7H3V3zM14 3h7v7h-7V3zM14 14h7v7h-7v-7zM3 14h7v7H3v-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedVideo({
                    id: 0,
                    video_title: '',
                    video_url: '',
                    video_likes: 0,
                    tags: [],
                    description: '',
                  });
                  setIsPanelOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                New Video
              </Button>
            </div>
          </div>

          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2' : 'space-y-4'}>
            {videos.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2v4M16 2v4M3.5 9h17M21 8v9a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5h8a5 5 0 015 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No videos available</p>
                <Button
                  variant="primary"
                  onClick={() => setIsPanelOpen(true)}
                  className="flex items-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Add Video
                </Button>
              </div>
            ) : (
              videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  viewMode={viewMode}
                  onEdit={() => handleEdit(video)}
                  onDelete={() => handleDelete(video)}
                />
              ))
            )}
          </div>
        </div>

        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed z-100 top-0 right-0 h-full w-full md:w-1/3 p-8 shadow-lg overflow-y-auto bg-white dark:border-white/[0.05] dark:bg-white/[0.05]"
          >
            <Button onClick={handlePanelClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X />
            </Button>
            <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">
              {selectedVideo ? 'Edit Video' : 'Add New Video'}
            </h2>
            <form onSubmit={handleSaveChanges}>
              <div className="mb-4.5">
                <Label htmlFor="video_title">Video Title</Label>
                <InputField
                  type="text"
                  id="video_title"
                  name="video_title"
                  placeholder="Enter video title"
                  value={selectedVideo?.video_title || ''}
                  onChange={(e) =>
                    setSelectedVideo(
                      selectedVideo
                        ? { ...selectedVideo, video_title: e.target.value }
                        : {
                            id: 0,
                            video_title: e.target.value,
                            video_url: '',
                            video_likes: 0,
                            tags: [],
                            description: '',
                          }
                    )
                  }
                />
              </div>

              <div className="mb-4.5">
                <Label htmlFor="video_url">Video URL</Label>
                <InputField
                  type="text"
                  id="video_url"
                  name="video_url"
                  placeholder="Enter video URL"
                  value={selectedVideo?.video_url || ''}
                  onChange={(e) =>
                    setSelectedVideo(
                      selectedVideo
                        ? { ...selectedVideo, video_url: e.target.value }
                        : { ...selectedVideo!, video_url: e.target.value }
                    )
                  }
                />
              </div>

              <div className="mb-4.5">
                <Label>Description</Label>
                <TextArea
                  rows={4}
                  value={selectedVideo?.description || ''}
                  onChange={(value) =>
                    setSelectedVideo(
                      selectedVideo
                        ? { ...selectedVideo, description: value }
                        : { ...selectedVideo!, description: value }
                    )
                  }
                  placeholder="Enter description"
                />
              </div>

              <div className="mb-4.5">
                <Label htmlFor="video_likes">Likes</Label>
                <InputField
                  type="number"
                  id="video_likes"
                  name="video_likes"
                  placeholder="Enter likes"
                  value={selectedVideo?.video_likes || 0}
                  onChange={(e) =>
                    setSelectedVideo(
                      selectedVideo
                        ? { ...selectedVideo, video_likes: Number(e.target.value) }
                        : { ...selectedVideo!, video_likes: Number(e.target.value) }
                    )
                  }
                />
              </div>

              <div className="mb-4.5">
                <Label htmlFor="tags">Tags</Label>
                <InputField
                  type="text"
                  id="tags"
                  name="tags"
                  placeholder="Enter tags (comma separated)"
                  value={Array.isArray(selectedVideo?.tags) ? selectedVideo.tags.join(', ') : selectedVideo?.tags || ''}
                  onChange={(e) =>
                    setSelectedVideo(
                      selectedVideo
                        ? { ...selectedVideo, tags: e.target.value.split(',').map(tag => tag.trim()) }
                        : { ...selectedVideo!, tags: e.target.value.split(',').map(tag => tag.trim()) }
                    )
                  }
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handlePanelClose}
                  className="px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="px-4 bg-primary text-gray"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : (selectedVideo ? 'Save Changes' : 'Add Video')}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </ComponentCard>
    </>
  );
};

export default VideoPage;
