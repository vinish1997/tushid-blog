import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateError, setUpdateError] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const {currentUser} = useSelector(state => state.user);
  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/v1/posts?postId=${postId}`);
        const data = await res.json();
        if (res.status === 200) {
          setFormData(data.posts[0]);
        } else {
          console.log(data.message);
          setUpdateError(error.message);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error.message);
      setUpdateError(error.message);
    }
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({ ...formData, image: downloadUrl });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
    }
    setImageUploadProgress(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/v1/posts/${formData._id}/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        setUpdateError(data.message);
      }
      if (res.status == 200) {
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setUpdateError("Something went wrong...");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => {
              setFormData((prev)=>({ ...prev, title: e.target.value }));
            }}
            value={formData.title}
          />
          <Select
            onChange={(e) => {
              setFormData((prev)=>({ ...prev, category: e.target.value }));
            }}
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="java">Java</option>
            <option value="frontend">Front-End</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="other">Others</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            outline
            size="sm"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="h-16 w-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="uploaded image for post"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write Something ..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData((prev)=>({ ...prev, content: value }));
          }}
          value={formData.content}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update
        </Button>
        {updateError && (
          <Alert className="mt-5" color="failure">
            {updateError}
          </Alert>
        )}
      </form>
    </div>
  );
}
