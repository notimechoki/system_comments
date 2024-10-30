import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import CommentForm from './CommentForm';

const SORT_OPTIONS = {
  LIFO: 'LIFO',
  USERNAME: 'USERNAME',
  EMAIL: 'EMAIL',
  DATE: 'DATE',
};

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [socket, setSocket] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.LIFO);

  const loadComments = async (pageNum = 1) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/comments/?page=${pageNum}`);
      const data = await response.json();

      setHasNextPage(data.next !== null);

      const formattedData = data.results.map((comment) => ({
        ...comment,
        replies: comment.replies || [],
      }));

      setComments(
        sortComments(formattedData.filter((comment) => !comment.parent), sortOption)
      );
      setPage(pageNum);
    } catch (error) {
      // console.error('Ошибка загрузки комментариев:', error);
    }
  };

  const sortComments = (comments, option) => {
    let sorted = [...comments];
    
    switch (option) {
      case SORT_OPTIONS.USERNAME:
        sorted.sort((a, b) => a.username.localeCompare(b.username));
        break;
      case SORT_OPTIONS.EMAIL:
        sorted.sort((a, b) => a.email.localeCompare(b.email));
        break;
      case SORT_OPTIONS.DATE:
        sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case SORT_OPTIONS.LIFO:
      default:
        sorted.reverse();
        break;
    }

    return sorted;
  }

  useEffect(() => {
    setComments((prev) => sortComments(prev, sortOption));
  }, [sortOption]);

  useEffect(() => {
    loadComments(page);

    const ws = new WebSocket('ws://127.0.0.1:8000/ws/comments/');
    setSocket(ws);

    // ws.onopen = () => console.log("WebSocket connection opened");

    ws.onmessage = (event) => {
      const newComment = JSON.parse(event.data);

      setComments((prevComments) => {
        const isDuplicate = prevComments.some(
          (comment) => comment.id === newComment.id ||
          (comment.replies && comment.replies.some((reply) => reply.id === newComment.id))
        );

        if (!isDuplicate) {
          if (newComment.parent) {
            return prevComments.map((comment) => {
              if (comment.id === newComment.parent) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []).filter(r => r.id !== newComment.id), newComment],
                };
              }
              return comment;
            });
          } else {
            return sortComments([...prevComments, { ...newComment, replies: [] }], sortOption);
          }
        }

        return prevComments;
      });
    };

    // ws.onclose = (event) => console.log("WebSocket connection closed:", event);

    return () => ws.close();
  }, [page]);

  const addReply = (parentId, reply) => {
    const tempId = `temp-${Math.random()}`;
    const replyWithParent = { ...reply, parent: parentId, id: tempId };

    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, replyWithParent],
          };
        }
        return comment;
      })
    );
    
  };

  const handleNewComment = (comment) => {
    setComments((prevComments) => sortComments([...prevComments, { ...comment, replies: [] }], sortOption)  );
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      loadComments(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1){
      loadComments(page - 1);
    }
  };

  return (
    <div>
      <CommentForm onSubmit={handleNewComment} />

      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value={SORT_OPTIONS.LIFO}>Последние (LIFO)</option>
        <option value={SORT_OPTIONS.USERNAME}>По имени пользователя</option>
        <option value={SORT_OPTIONS.EMAIL}>По EMAIL</option>
        <option value={SORT_OPTIONS.DATE}>По дате добавления</option>
      </select>

      <div className='commentslist'>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onReply={addReply}
        />
      ))}
      </div>
      
      <div className='pagination'>
        <button onClick={handlePrevPage} disabled={page === 1}>Назад</button>
        <span>Страница {page}</span>
        <button onClick={handleNextPage} disabled={!hasNextPage}>Вперед</button>
      </div>
    </div>
  );
};

export default CommentList;
