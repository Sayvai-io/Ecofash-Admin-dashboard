"use client";
import React, { useState } from "react";
import supabase from "@/utils/supabaseClient";
import Image from 'next/image'; // Import Image component for profile picture

const ProfileBox = () => {
  const [currentPassword, setCurrentPassword] = useState(""); // New state for current password
  const [newPassword, setNewPassword] = useState(""); // New state for new password
  const [error, setError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password

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
      <h2 className="text-2xl font-bold mt-8 mb-6">Change Password</h2> {/* Added heading for Change Password */}
      <form onSubmit={handleSubmit} className="space-y-4 mt-6 mb-10">
        <div className="flex mb-4">
          <label className="w-1/5 mb-2 pr-2">Current Password:</label>
          <input
            className="border p-2 w-1/3 -ml-2"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex mb-4">
          <label className="w-1/5 mb-2 pr-2">New Password:</label>
          <input
            className="border p-2 w-1/3 -ml-2"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex mb-4">
          <label className="w-1/5 mb-2 ">Confirm Password:</label>
          <input
            className="border p-2 w-1/3 -ml-2"
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
          className="ml-40 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          type="submit"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ProfileBox;