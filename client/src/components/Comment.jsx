import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/v1/users/${comment.userId}`);
        const data = await res.json();
        if (res.status === 200) {
          setUser(data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [comment]);
  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };
  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/v1/comments/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.status === 200) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="h-10 w-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span>{moment(comment.createdAt).fromNow()}</span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleUpdate}
              >
                Update
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.noOfLikes > 0 &&
                  comment.noOfLikes +
                    " " +
                    (comment.noOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-blue-500"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => onDelete(comment._id)}
                  >
                    Delete
                  </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
