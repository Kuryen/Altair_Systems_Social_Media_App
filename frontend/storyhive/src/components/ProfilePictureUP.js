import React, { useState } from 'react';
import axios from 'axios';

const ProfilePictureUploader = ({ username, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert("Only JPG, PNG, and GIF files are allowed.");
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2 MB limit
        alert("File size exceeds 2MB.");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('profile_picture', selectedFile);
    formData.append('username', username);

    setIsLoading(true);
    try {
      const response = await axios.post('https://storyhive-app.onrender.com/profilepicture/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.profilePicture) {
        alert('Upload successful!');
        onUploadSuccess(response.data.profilePicture);  // Notify parent about the new picture URL
        setSelectedFile(null); // Reset selected file
      }
    } catch (error) {
      console.error('Error uploading the file:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
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
        aria-label="Upload Profile Picture"
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

      {isLoading ? (
        <p className="text-sm text-gray-600 mt-2">Uploading...</p>
      ) : (
        <button
          onClick={handleUpload}
          className="mt-4 px-4 py-2 bg-yellow-400 text-gray-800 rounded shadow-sm hover:bg-yellow-500 hover:shadow-lg transition duration-200 ease-in-out"
        >
          Upload Profile Picture
        </button>
      )}
    </div>
  );
};

export default ProfilePictureUploader;
