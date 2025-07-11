import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';

interface Video {
  id: number;
  video_url: string;
  video_title: string;
  video_likes: number;
  tags: string[] | string;
  description: string;
}

interface VideoCardProps {
  video: Video;
  viewMode: 'list' | 'grid';
  onEdit: () => void;
  onDelete: () => void;
}

const VideoCard = ({ video, viewMode, onEdit, onDelete }: VideoCardProps) => {
  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtu.be')) {
      videoId = url.split('/').pop() || '';
    } else if (url.includes('watch?v=')) {
      videoId = new URL(url).searchParams.get('v') || '';
    } else if (url.includes('embed/')) {
      videoId = url.split('/').pop() || '';
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:border-white/[0.05] dark:bg-white/[0.03] rounded-lg shadow-sm overflow-hidden ${
        viewMode === 'grid' ? 'flex flex-col' : 'flex items-center'
      }`}
    >
      <div className={`relative ${viewMode === 'grid' ? 'w-full h-48' : 'w-1/3 h-full'}`}>
        <iframe
          className="w-full h-full"
          src={getYouTubeEmbedUrl(video.video_url)}
          title={video.video_title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className={`p-4 flex flex-col justify-between ${viewMode === 'grid' ? 'flex-1' : 'w-2/3'}`}>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{video.video_title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{video.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {(Array.isArray(video.tags) ? video.tags : (typeof video.tags === 'string' ? video.tags.split(',').map(t => t.trim()) : [])).map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className=" font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">{video.video_likes} likes</span>
          <div className="flex items-center gap-3">
            <button onClick={onEdit} className="text-gray-500 hover:text-primary">
              <Edit size={18} />
            </button>
            <button onClick={onDelete} className="text-gray-500 hover:text-danger">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
