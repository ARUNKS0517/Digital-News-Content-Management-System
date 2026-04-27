import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NewsCard.css';

function NewsCard({ news, onEdit, onDelete, showActions = false }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const displayImage = (news.images && news.images.length > 0)
    ? news.images[0]
    : news.image || null;

  return (
    <Link to={`/news/${news._id}`} className="news-card-link">
      <div className="news-card">
        {displayImage && (
          <div className="news-card-image">
            <img src={displayImage} alt={news.title} />
          </div>
        )}
        <div className="news-card-content">
          <h2 className="news-card-title">{news.title}</h2>
          <p className="news-card-meta">
            <span className="news-author">By {news.author}</span>
            <span className="news-date">{formatDate(news.date)}</span>
          </p>
          <p className="news-card-text">{news.content.substring(0, 150)}...</p>
          {showActions && (
            <div className="news-card-actions">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(news);
                }} 
                className="btn-edit"
              >
                Edit
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(news._id);
                }} 
                className="btn-delete"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default NewsCard;
