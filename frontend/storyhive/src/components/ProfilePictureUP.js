import React, { useState } from 'react';
import axios from 'axios';

const ProfilePictureUploader = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Retrieve the loggedInUser from localStorage
  const loggedInUser = localStorage.getItem("elementData");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    if (!loggedInUser) {
      console.error("No logged in user found in localStorage.");
      alert("Please login to upload a profile picture.");
      return;
    }

    const formData = new FormData();
    formData.append('profile_picture', selectedFile);

    try {
        //http://localhost:10000/profilepicture/upload-profile-picture testing
        //https://storyhive-app.onrender.com/profilepicture/upload-profile-picture deployment
      const response = await axios.post('https://storyhive-app.onrender.com/profilepicture/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.profilePicture) {
        // Store the uploaded file path in localStorage associated with the user
        localStorage.setItem(`${loggedInUser}_profilePicture`, response.data.profilePicture);
        alert('Profile picture uploaded successfully!');
        onUploadSuccess(response.data.profilePicture); // Notify parent about the new picture URL
      }
    } catch (error) {
      console.error('Error uploading the file:', error);
      alert('Failed to upload profile picture. Please try again.');
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="absolute bottom-0 right-0 w-[40px] h-[40px] bg-gradient-to-b from-[#6c49f8] via-[#ff0064] to-[#ff6c02] rounded-full flex items-center justify-center text-white text-[24px] font-bold cursor-pointer"
      >
        +
      </label>

      {selectedFile && (
        <p className="text-sm text-gray-600 mt-2">
          Selected File: {selectedFile.name}
        </p>
      )}

      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-yellow-400 text-gray-800 rounded shadow-sm hover:bg-yellow-500 hover:shadow-lg transition duration-200 ease-in-out"
      >
        Upload Profile Picture
      </button>
    </div>
  );
};

export default ProfilePictureUploader;
