"use client";
import React, { useState } from "react";
import supabase from "@/utils/supabaseClient";
import Image from 'next/image'; // Import Image component for profile picture

const ProfileBox = () => {
  const [currentPassword, setCurrentPassword] = useState(""); // New state for current password
  const [newPassword, setNewPassword] = useState(""); // New state for new password
  const [error, setError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [showChangePassword, setShowChangePassword] = useState(false); // New state for toggling change password visibility

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) { // Check if new password and confirm password match
      setError('New password and confirm password do not match');
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('user_credentials')
        .select('password_hash')
        .eq('password_hash', currentPassword) // Fetch current password hash directly
        .single();

      if (fetchError || !data) {
        setError('Current password is incorrect');
        return;
      }

      // Store the current password in old_password_hash before updating
      const { error: updateOldPasswordError } = await supabase
        .from('user_credentials')
        .update({ old_password_hash: currentPassword }) // Store the old password
        .eq('password_hash', currentPassword); // Ensure you update the correct user

      if (updateOldPasswordError) {
        setError(updateOldPasswordError.message);
        return;
      }

      const { error: updateError } = await supabase
        .from('user_credentials')
        .update({ password_hash: newPassword }) // Update with the new password
        .eq('password_hash', currentPassword); // Ensure you update the correct user

      if (updateError) {
        setError(updateError.message);
      } else {
        // Password updated successfully
        setError(null);
        alert('Password updated successfully!');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Update error:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-6 mt-2 bg-white border rounded-lg shadow-lg p-10">
      <div className="flex border-b justify-between items-center mb-12"> {/* Flex container for header */}
        <h1 className="text-4xl font-bold ml-10 mb-4">Profile</h1> {/* Bold 4xl heading */}
        <div className="relative w-25 h-20 mb-4"> {/* Profile picture container */}
          <Image
            src="/images/logo/logo.jpg" // Replace with your profile picture path
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
            className="w-160 h-160 " // Make it circular
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
         
            <div className="mx-auto max-w-[720px]">
              <h4 className="font-medium text-dark dark:text-white">About Me</h4>
              <p className="mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque posuere fermentum urna, eu condimentum mauris
                tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus
                ultricies. Sed vel aliquet libero. Nunc a augue fermentum,
                pharetra ligula sed, aliquam lacus.
              </p>
            </div>
            <div className="mt-4.5">
              <div className="flex items-center justify-center gap-3.5">
                {/* Social media icons here */}
              </div>
            </div>
          
        </div>
      </div>
      {/* Added contact information section */}
      <div className="mt-8 mb-6 ">
        <h2 className="text-2xl font-bold text-gray-700">Contact Information</h2>
        <div className="px-10 mt-5">
        <p className="font-bold text-xl text-gray-500 mt-2 mb-4">
          <span className=" pr-10">Email address</span>: mohan@ecofash.life
        </p>
        <p className="font-bold text-xl text-gray-500 mt-2 mb-4">
          <span className=" pr-3">Contact Number</span>: +91 9872325297
        </p>
        <p className="font-bold text-xl text-gray-500 mt-2 mb-4">
          <span className=" pr-20">Password</span>  
          <button 
            className="text-blue-500 " 
            onClick={() => setShowChangePassword(!showChangePassword)} // Toggle change password visibility
          >
           : Change Password
          </button>
        </p>
        </div>
      </div>
      {/* Change Password Section with Box */}
      {showChangePassword && ( // Conditionally render the change password section
         <div className="mt-8 mb-6 p-4 border rounded-lg bg-white shadow-md max-w-md mx-auto"> {/* Changed to white background, added shadow and max width */}
         <h2 className="text-2xl font-bold mb-4">Change Password</h2>
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="mb-4"> {/* Removed flex */}
             <label className="block mb-2 pr-2">Current Password:</label> {/* Changed to block for full width */}
             <input
               className="border p-2 w-full" // Changed to full width
               type="password"
               value={currentPassword}
               onChange={(e) => setCurrentPassword(e.target.value)}
               required
             />
           </div>
           <div className="mb-4"> {/* Removed flex */}
             <label className="block mb-2 pr-2">New Password:</label> {/* Changed to block for full width */}
             <input
               className="border p-2 w-full" // Changed to full width
               type="password"
               value={newPassword}
               onChange={(e) => setNewPassword(e.target.value)}
               required
             />
           </div>
           <div className="mb-4"> {/* Removed flex */}
             <label className="block mb-2 pr-2">Confirm Password:</label> {/* Changed to block for full width */}
             <input
               className="border p-2 w-full" // Changed to full width
               type="password"
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               required
             />
           </div>
           {error && (
             <div className="text-red-500 mb-4">
               {error}
             </div>
           )}
           
           <button
             className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
             type="submit"
           >
             Change Password
           </button>
           
         </form>
       </div>
      )}
    </div>
  );
};

export default ProfileBox;