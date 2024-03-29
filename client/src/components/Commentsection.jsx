import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert, Button, Modal, Textarea } from "flowbite-react";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function Commentsection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();
  console.log(comments);
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/v1/comments/post/${postId}`);
        if (res.status == 200) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getComments();
  }, [postId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 300 || comment.length < 1) {
      setCommentError("comment should have 1 to 300 character");
      return;
    }
    try {
      const res = await fetch("/api/v1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      } else {
        setCommentError(data.message);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };
  const handleLike = async (commentId) => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    try {
      const res = await fetch(`/api/v1/comments/like/${commentId}`, {
        method: "PUT",
      });
      if (res.status === 200) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  noOfLikes: data.noOfLikes,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) => {
        return c._id === comment._id ? { ...c, content: editedContent } : c;
      })
    );
  };
  const handleDelete = async () => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    try {
      const res = await fetch(`/api/v1/comments/${commentToDelete}`, {
        method: "DELETE",
      });
      if (res.status == 200) {
        setComments(comments.filter((comment) => comment._id != commentToDelete));
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as : </p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt={currentUser.username}
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment{" "}
          <Link to={"/sign-in"} className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment ..."
            rows="3"
            maxLength="300"
            onChange={(e) => {
              setComment(e.target.value);
            }}
            value={comment}
          />
          <div className="flex items-center justify-between mt-5">
            <p className="text-gray-500 text-xs">
              {300 - comment.length} character remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet !!!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-500 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h1 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h1>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, I am sure
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
