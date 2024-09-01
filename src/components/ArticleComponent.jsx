// ArticleComponent.jsx
import React from 'react';
import './css/articleComponent.css';

function ArticleComponent({ article, onClick, type = 'regular' }) {
  // Prepare different resolutions of the image URL (adjust based on your image source setup)
  const image300 = `${article.imageLink}?w=300`; // Low resolution
  const image600 = `${article.imageLink}?w=600`; // Medium resolution
  const image900 = `${article.imageLink}?w=900`; // High resolution

  return (
    <div className={`article-component ${type}`} onClick={() => onClick(article)}>
      <div className="article-image">
        <img
          src={image600} // Fallback for older browsers that don't support srcset
          srcSet={`${image300} 300w, ${image600} 600w, ${image900} 900w`} // Define image sources with resolutions
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" // Guide the browser on which size to use
          alt={article.title}
          loading="lazy" // Enable lazy loading for better performance
          className="responsive-article-image"
        />
        <div className="article-overlay">
          <div className="article-text-overlay">
            <h3>{article.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: article.body.substring(0, 150) }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleComponent;
