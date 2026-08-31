import { useState } from 'react';
import { IoImage, IoClose } from 'react-icons/io5';
import Avatar from '../ui/Avatar.jsx';
import Button from '../ui/Button.jsx';
import Dropdown from '../ui/Dropdown.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import postApi from '../../api/postApi.js';
import uploadApi from '../../api/uploadApi.js';

const PostComposer = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [privacy, setPrivacy] = useState('PUBLIC');
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const privacyOptions = [
    { value: 'PUBLIC', label: 'Public' },
    { value: 'CAMPUS_ONLY', label: 'Campus Only' },
    { value: 'DEPARTMENT_ONLY', label: 'Department Only' },
    { value: 'FRIENDS_ONLY', label: 'Friends Only' },
  ];

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const imageUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, imageUrl]);
      setImageFiles((prev) => [...prev, file]);
    });

    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!text.trim() && imageFiles.length === 0) return;

    setLoading(true);
    setError('');

    try {
      let uploadedImages = [];

      if (imageFiles.length > 0) {
        const uploadResponse = await uploadApi.uploadMultiple(imageFiles);
        if (uploadResponse.data.success) {
          uploadedImages = uploadResponse.data.data.map((img) => img.url);
        }
      }

      const payload = {
        content: {
          text: text.trim(),
          images: uploadedImages,
        },
        privacy,
      };

      const response = await postApi.createPost(payload);

      if (response.data.success) {
        setText('');
        setImages([]);
        setImageFiles([]);
        onPostCreated?.(response.data.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Post creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-primary border border-border-color rounded-xl p-3 sm:p-4 w-full overflow-hidden">
      <div className="flex gap-2 sm:gap-3 w-full">
        <div className="shrink-0">
          <Avatar src={user?.avatarUrl} name={user?.fullName} size="sm" />
        </div>

        <div className="flex-1 min-w-0 w-full">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            rows={2}
            maxLength={500}
            className="w-full max-w-full bg-bg-secondary text-text-primary rounded-lg p-2 sm:p-3 resize-none focus:outline-none placeholder:text-text-muted text-sm sm:text-base box-border"
          />

          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}

          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt="Upload"
                    className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-bg-tertiary text-text-secondary shadow"
                  >
                    <IoClose size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-2 sm:mt-3 gap-2 flex-wrap">
            <label className="p-2 rounded-lg hover:bg-bg-secondary text-text-muted cursor-pointer shrink-0">
              <IoImage size={20} />
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
            </label>

            <div className="flex items-center gap-2 shrink-0">
              <div className="w-24 sm:w-28">
                <Dropdown
                  options={privacyOptions}
                  value={privacy}
                  onChange={setPrivacy}
                  placeholder="Privacy"
                />
              </div>
              <Button size="sm" onClick={handleSubmit} loading={loading}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComposer;