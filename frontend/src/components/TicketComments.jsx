import { useState, useEffect } from 'react';
import { getTicketComments, createComment, deleteComment, updateComment } from '../api/axios';
import { Send, Trash2, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TicketComments({ ticketId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const fetchComments = async () => {
    try {
      const response = await getTicketComments(ticketId);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setLoading(true);
      await createComment({
        ticketId,
        text: newComment.trim(),
      });

      toast.success('Comment added!');
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await deleteComment(commentId);
      toast.success('Comment deleted!');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleStartEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await updateComment(commentId, { text: editText.trim() });
      toast.success('Comment updated!');
      setEditingId(null);
      setEditText('');
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Comments ({comments.length})
      </h3>

      {/* Comment Input */}
      <form onSubmit={handleAddComment} className="mb-6">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>

          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  loading || !newComment.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Send size={16} />
                {loading ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3 bg-gray-50 p-4 rounded-lg">
              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {comment.userId?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {comment.userId?.name || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                      {comment.createdAt !== comment.updatedAt && ' (edited)'}
                    </p>
                  </div>

                  {/* Actions (only for comment owner) */}
                  {comment.userId?._id === user?.id && (
                    <div className="flex gap-2">
                      {editingId !== comment._id && (
                        <>
                          <button
                            onClick={() => handleStartEdit(comment)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(comment._id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Edit Mode */}
                {editingId === comment._id ? (
                  <div>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(comment._id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}