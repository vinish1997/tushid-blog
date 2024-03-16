import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert, Button, Textarea } from "flowbite-react";

export default function Commentsection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 300 || comment.length < 1) {
      setCommentError("comment should have 1 to 300 character")
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
        setCommentError(null)
      } else {
        setCommentError(data.message);
      }
    } catch (error) {
      setCommentError(error.message);
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
            <Alert color='failure' className="mt-5">{commentError}</Alert>
          )}
        </form>
      )}
    </div>
  );
}
