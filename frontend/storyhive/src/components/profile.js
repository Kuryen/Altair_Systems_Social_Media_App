import React from 'react';
import beeLogo from './bee.png'; // Replace with your actual logo path
import UserTabs from './UserTabs';
import { useNavigate, useLocation } from 'react-router-dom';  // Import the useNavigate hook

export default function Profile(){
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-[#373638]">
      {/* Profile container */}
      <div className="relative w-[80%] h-screen bg-[#d9d9d9] rounded-[55px] p-10">
        
        {/* Top Navbar */}
        <div className="relative flex items-center justify-between w-full h-[65px] bg-black rounded-lg mb-10">
          <div className="text-white text-2xl font-['Catamaran'] pl-5">Storyhive</div>
          <div className="flex items-center pr-5 space-x-8">
            <div className="text-[#e1dcdc] text-sm font-light">Hello, User</div>
            <div className="text-white text-[11px] font-light">HIVE</div>
            <div className="text-white text-[11px] font-light">BUZZ</div>
            <div className="text-white text-[11px] font-light">BLOOM</div>
            <div className="text-white text-[11px] font-light">Settings</div>
          </div>
        </div>

        {/* Main Profile Section */}
        <div className="flex items-start space-x-10">
          {/* Avatar & Info */}
          <div className="flex flex-col items-center w-[250px]">
            <div className="relative">
              <img
                className="w-[150px] h-[150px] rounded-full"
                src="https://via.placeholder.com/150"
                alt="User Avatar"
              />
              <div className="absolute bottom-0 right-0 w-[40px] h-[40px] bg-gradient-to-b from-[#6c49f8] via-[#ff0064] to-[#ff6c02] rounded-full flex items-center justify-center text-white text-[24px] font-bold">+</div>
            </div>
            <div className="mt-4 text-white text-4xl font-semibold">Jenna Tolls</div>
            <div className="text-[#e1dcdc] text-sm">@username</div>
            <div className="flex space-x-4 mt-4">
              <button className="text-white text-[10px] bg-black px-4 py-2 rounded">Edit Profile</button>
              <button className="text-white text-[10px] bg-black px-4 py-2 rounded">Share Profile</button>
            </div>
          </div>

          {/* Stats and Bio */}
          <div className="flex flex-col justify-between w-full h-full">
            <div>
              <p className="text-white text-lg">Hello everyone! Welcome to my profile. I'm excited to connect with you all.</p>
            </div>
            <div className="flex justify-between mt-6">
              <div className="text-white text-base">
                <div className="font-bold">210</div>
                <div className="text-sm">Followers</div>
              </div>
              <div className="text-white text-base">
                <div className="font-bold">200</div>
                <div className="text-sm">Following</div>
              </div>
              <div className="text-white text-base">
                <button type="button" onClick = {(event) => {
                  navigate('/Chat');
                }}>
                  Chat with me!
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <UserTabs />
        </div>
      </div>

      {/* Bottom Logo 
      <div className="absolute bottom-10">
        <img className="w-[178px] h-[90px]" src={beeLogo} alt="Logo" />
      </div>*/}
    </div>
  );
}