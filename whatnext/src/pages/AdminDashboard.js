import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import { getNews, createNews, updateNews, deleteNews } from '../api/newsApi';
import '../styles/Dashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/admin-login');
    } else {
      fetchNews();
    }
  }, [navigate]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getNews();
      setNews(data);
      setError(null);
    } catch (err) {
      setError('Failed to load news');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
    const readFileAsDataURL = (file) =>
      new Promise((resolve, reject) => {
        if (!file.type || !file.type.startsWith('image/')) {
          return reject(new Error(`${file.name} is not an image file`));
        }
        if (file.size > MAX_FILE_SIZE) {
          return reject(new Error(`${file.name} exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB`));
        }
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

    const fileArr = Array.from(files);
    const readPromises = fileArr.map((f) => readFileAsDataURL(f));

    Promise.allSettled(readPromises).then((results) => {
      const successes = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);
      const failures = results.filter((r) => r.status === 'rejected');

      if (failures.length > 0) {
        const msgs = failures.map((f) => (f.reason && f.reason.message) || 'Failed to read file');
        setError(msgs.join('; '));
      } else {
        setError(null);
      }

      if (successes.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...successes],
        }));
        setImagePreviews((prev) => ([...(prev || []), ...successes]));
      }
    });
  };

  const handleDeleteImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: updatedImages,
    });
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.content || !formData.author) {
      setError('Title, content, and author are required');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');

      if (editingNews) {
        // Update existing news
        await updateNews(editingNews._id, formData, token);
      } else {
        // Create new news
        await createNews(formData, token);
      }

      // Reset form
      setFormData({ title: '', content: '', author: '', images: [] });
      setEditingNews(null);
      setShowForm(false);

      // Refresh news list
      fetchNews();
    } catch (err) {
      setError(err.message || 'Failed to save news');
      console.error('Error saving news:', err);
    }
  };

  const handleEdit = (newsItem) => {
    const legacyImage = newsItem.image ? [newsItem.image] : [];
    const imagesFromItem = Array.isArray(newsItem.images)
      ? newsItem.images
      : legacyImage;

    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      author: newsItem.author,
      images: imagesFromItem || [],
    });
    setImagePreviews(imagesFromItem || []);
    setShowForm(true);
  };

  const handleDelete = async (newsId) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        const token = localStorage.getItem('authToken');
        await deleteNews(newsId, token);
        fetchNews();
      } catch (err) {
        setError('Failed to delete news');
        console.error('Error deleting news:', err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNews(null);
    setImagePreviews([]);
    setFormData({ title: '', content: '', author: '', images: [] });
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-new-news"
        >
          {showForm ? 'Cancel' : '➕ Create New News'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h2>{editingNews ? 'Edit News' : 'Create New News'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Enter news title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author:</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleFormChange}
                placeholder="Enter author name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image-upload">Upload Images:</label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                placeholder="Choose images"
              />
              {imagePreviews.length > 0 && (
                <div className="images-preview">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button 
                        type="button" 
                        onClick={() => handleDeleteImage(index)}
                        className="btn-delete-image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="content">Content:</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleFormChange}
                placeholder="Enter news content"
                rows="8"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingNews ? 'Update News' : 'Create News'}
              </button>
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="news-section">
        <h2>All News Articles ({news.length})</h2>
        {news.length === 0 ? (
          <div className="no-news">
            <p>No news articles yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="news-grid">
            {news.map((article) => (
              <NewsCard
                key={article._id}
                news={article}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
