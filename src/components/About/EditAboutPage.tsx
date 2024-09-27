"use client";
import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router'; // Import useRouter
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AboutPagePreviewProps = {
  setIsEditAbout: (isEdit: boolean) => void;
  aboutData?: any[];
};

const EditAboutPage = ({ 
  setIsEditAbout, 

}: AboutPagePreviewProps) => { // Removed contacts prop
  const [aboutData, setAboutData] = useState<any>(null); // Initialize aboutData as null
  const [editAbout, setEditAbout] = useState<any>(null); // State for the about section being edited
  const [isDirty, setIsDirty] = useState(false); // Track if the form is dirty
  const [originalAbout, setOriginalAbout] = useState<any>(null); // State to store original about data

  useEffect(() => {
    const fetchAboutData = async () => { // Fetch about data directly
      const { data, error } = await supabase
        .from('about')
        .select('*'); // Fetch all about data

      if (error) {
        console.error('Error fetching about data:', error);
        return;
      }

      setAboutData(data); // Set the fetched data
      if (data && data.length > 0) {
        setEditAbout(data[0]); // Automatically set the first about section for editing
        setOriginalAbout(data[0]); // Store original about data
      }
    };

    fetchAboutData(); // Call the fetch function
  }, []); // Empty dependency array to run only once

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditAbout({ ...editAbout, [e.target.name]: e.target.value }); // Update the editAbout state
    setIsDirty(true); // Mark the form as dirty
  };

  const handleUpdateAbout = async () => { // Renamed function to handleUpdateAbout
    const { error } = await supabase
      .from('about')
      .update(editAbout) // Update the about section in Supabase
      .eq('id', editAbout.id); // Match by ID

    if (error) {
      console.error('Error updating about:', error);
    } else {
      setAboutData((prevData: any) => prevData.map((about: any) => about.id === editAbout.id ? editAbout : about)); // Update local state
      setEditAbout(null); // Clear the edit form
      setIsDirty(false); // Reset dirty state after update
    }
  };

  const handleCancel = () => {
    setIsEditAbout(false); // Reset to original about data
    // setEditAbout(originalAbout); // Reset to original about data
    // setIsDirty(false); // Reset dirty state
  };

  const handleBack = () => {
    setIsEditAbout(false); // Navigate back to the previous state
  };  

  if (!aboutData) return <div>Loading...</div>; // Show loading state

  return (
    <div>
      <button onClick={handleBack} className="top-4 left-4 flex items-center w-20 px-4 py-2 bg-gray-500 text-white rounded"> {/* Back button */}
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> {/* Left arrow icon */}
        Back
      </button>
      {editAbout && ( // Display the form directly for the first about section
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateAbout(); }} className="px-30"> {/* Add padding left and right */}
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Title</label> {/* Label for Title */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="title" 
              value={editAbout.title} 
              onChange={handleChange} 
            /> {/* Title input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Background Image</label> {/* Label for Background Image */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="bg_image" 
              value={editAbout.bg_image} 
              onChange={handleChange} 
            /> {/* Background Image input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">About Title</label> {/* Label for About Title */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="about_title" 
              value={editAbout.about_title} 
              onChange={handleChange} 
            /> {/* About Title input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">About Heading</label> {/* Label for About Heading */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="about_heading" 
              value={editAbout.about_heading} 
              onChange={handleChange} 
            /> {/* About Heading input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">About Content</label> {/* Label for About Content */}
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="about_content" 
              value={editAbout.about_content} 
              onChange={handleChange} 
            /> {/* About Content input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">About Image</label> {/* Label for About Image */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="about_image" 
              value={editAbout.about_image} 
              onChange={handleChange} 
            /> {/* About Image input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">MV Title</label> {/* Label for MV Title */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="mv_title" 
              value={editAbout.mv_title} 
              onChange={handleChange} 
            /> {/* MV Title input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">MV Heading</label> {/* Label for MV Heading */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="mv_heading" 
              value={editAbout.mv_heading} 
              onChange={handleChange} 
            /> {/* MV Heading input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">MV Content</label> {/* Label for MV Content */}
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="mv_content" 
              value={editAbout.mv_content} 
              onChange={handleChange} 
            /> {/* MV Content input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">MV Image</label> {/* Label for MV Image */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="mv_image" 
              value={editAbout.mv_image} 
              onChange={handleChange} 
            /> {/* MV Image input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">TC Title</label> {/* Label for TC Title */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="tc_title" 
              value={editAbout.tc_title} 
              onChange={handleChange} 
            /> {/* TC Title input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">TC Heading</label> {/* Label for TC Heading */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="tc_heading" 
              value={editAbout.tc_heading} 
              onChange={handleChange} 
            /> {/* TC Heading input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">TC Content</label> {/* Label for TC Content */}
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="tc_content" 
              value={editAbout.tc_content} 
              onChange={handleChange} 
            /> {/* TC Content input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">TC Image</label> {/* Label for TC Image */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="tc_image" 
              value={editAbout.tc_image} 
              onChange={handleChange} 
            /> {/* TC Image input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Review Heading</label> {/* Label for Review Heading */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="review_heading" 
              value={editAbout.review_heading} 
              onChange={handleChange} 
            /> {/* Review Heading input */}
          </div>
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button> {/* Cancel button */}
          <button type="submit" className={`w-20 px-4 py-2 bg-blue-500 text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isDirty}>Update</button> {/* Update button */}
        </form>
      )}
    </div>
  ); // Only display the form when editing
};

export default EditAboutPage;
