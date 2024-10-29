import React, { useState } from 'react';
import CommentForm from './CommentForm';

const Comment = ({ comment, onReply, depth = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // console.log(comment.created_at);
    return `${day}:${month}:${year} в ${hours}:${minutes}`;
    }

  const handleReply = (reply) => {
    const replyWithParent = {
      ...reply,
      parent: comment.id,
      depth: depth + 1,
    };
    onReply(comment.id, replyWithParent);
    setShowReplyForm(false);
  };



  return (
    <div className="comment" style={{ marginLeft: `${depth * 20}px` }}>
      <div className='comment-header'>
        <div className='comment-info'>
          <div className='comment-placeholder'></div>
          <strong>{comment.username}</strong> {formatDate(comment.created_at)}
        </div>
        <button className='comment-reply' onClick={() => setShowReplyForm(!showReplyForm)}>
          {showReplyForm ? 'X' : '>'}
        </button>
      </div>
      <p className="comment-text">{comment.text}</p>
      {comment.image && <img className='comment-img' src={`${comment.image}`} onClick={() => openModal(comment.image)} alt="Comment attachment" />}
      {comment.text_file && <a href={comment.text_file} target='_blank' rel="noopener noreferrer" download>Скачать текстовый файл</a>}

      {showReplyForm && (
        <CommentForm 
          onSubmit={handleReply} 
          replyTo={comment}
          placeholder={`Replying to ${comment.username}`}
        />
      )}
      
      {comment.replies && comment.replies.length > 0 && (
        <button className="toggle-replies" onClick={() => setShowReplies(!showReplies)}>
          {showReplies ? 'Скрыть ответы' : 'Показать ответы'}
        </button>
      )}

      {showReplies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id || `temp-${Math.random()}`}
              comment={reply}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>&times;</span>
            <img src={modalImage} alt="Enlarged Comment Attachment" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
