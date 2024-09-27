"use client";
import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router'; // Import useRouter
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import left arrow icon

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type HomePagePreviewProps = {
  setIsEditHome: (isEdit: boolean) => void; // Changed from setIsEditContact to setIsEditHome
  homeData?: any[]; // Changed from contacts to homeData
  onDelete: (id: string) => void;
  onEdit: (home: any) => void; // Changed from contact to home
};

const EditHomePage = ({ 
  setIsEditHome, 

}: HomePagePreviewProps) => { // Updated component name
  const [homeData, setHomeData] = useState<any>(null); // Renamed contactData to homeData
  const [editHome, setEditHome] = useState<any>(null); // Renamed editContact to editHome
  const [isDirty, setIsDirty] = useState(false); // Track if the form is dirty
  const [originalHome, setOriginalHome] = useState<any>(null); // Renamed originalContact to originalHome

  useEffect(() => {
    const fetchHomeData = async () => { // Renamed fetchContactData to fetchHomeData
      const { data, error } = await supabase
        .from('home') // Changed from 'contact' to 'home'
        .select('*'); // Fetch all home data

      if (error) {
        console.error('Error fetching home data:', error);
        return;
      }

      setHomeData(data); // Set the fetched data
      if (data && data.length > 0) {
        setEditHome(data[0]); // Automatically set the first home data for editing
        setOriginalHome(data[0]); // Store original home data
      }
    };

    fetchHomeData(); // Call the fetch function
  }, []); // Empty dependency array to run only once

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditHome({ ...editHome, [e.target.name]: e.target.value }); // Update the editHome state
    setIsDirty(true); // Mark the form as dirty
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('home') // Changed from 'contact' to 'home'
      .update(editHome) // Update the home data in Supabase
      .eq('id', editHome.id); // Match by ID

    if (error) {
      console.error('Error updating home data:', error);
    } else {
      setHomeData((prevData: any) => prevData.map((home: any) => home.id === editHome.id ? editHome : home)); // Update local state
      setEditHome(null); // Clear the edit form
      setIsDirty(false); // Reset dirty state after update
    }
  };

  const handleCancel = () => {
    setIsEditHome(false);
    // setEditHome(originalHome); // Reset to original home data
    // setIsDirty(false); // Reset dirty state
  };

  const handleBack = () => {
    setIsEditHome(false);// Navigate back to the previous state
  };

  if (!homeData) return <div>Loading...</div>; // Show loading state

  return (
    <div>
      <button onClick={handleBack} className="top-4 left-4 flex items-center w-20 px-4 py-2 bg-gray-500 text-white rounded"> {/* Back button */}
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> {/* Left arrow icon */}
        Back
      </button>
      {editHome && ( // Display the form directly for the first home data
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="px-30"> {/* Add padding left and right */}
          <div className="mb-4">
            <label className="block mb-1">Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="heading" 
              value={editHome.heading} 
              onChange={handleChange} 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Head Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="head_content" 
              value={editHome.head_content} 
              onChange={handleChange} 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Head Image</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="head_image" 
              value={editHome.head_image} 
              onChange={handleChange} 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">About Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="about_title" 
              value={editHome.about_title} 
              onChange={handleChange} 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">About Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="about_heading" 
              value={editHome.about_heading} 
              onChange={handleChange} 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">About Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="about_content" 
              value={editHome.about_content} 
              onChange={handleChange} 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">About Image</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="about_image" 
              value={editHome.about_image} 
              onChange={handleChange} 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Service</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="service" 
              value={editHome.service} 
              onChange={handleChange} 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Contact Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="contact_heading" 
              value={editHome.contact_heading} 
              onChange={handleChange} 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Contact Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="contact_content" 
              value={editHome.contact_content} 
              onChange={handleChange} 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Contact Image</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="contact_image" 
              value={editHome.contact_image} 
              onChange={handleChange} 
            />
          </div>
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
          <button type="submit" className={`w-20 px-4 py-2 bg-blue-500 text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isDirty}>Update</button>
        </form>
      )}
    </div>
  ); // Only display the form when editing
};

export default EditHomePage; // Export updated component
