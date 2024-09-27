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

type EditSeperateServicePageProps = {
  setIsEditService: (isEdit: boolean) => void; // Function to set edit state
  serviceId: string; // ID of the service to edit
};

const EditSeperateServicePage = ({ 
  setIsEditService, 
  serviceId 
}: EditSeperateServicePageProps) => {
  const [serviceData, setServiceData] = useState<any>(null); // Initialize serviceData as null
  const [editService, setEditService] = useState<any>(null); // State for the service being edited
  const [isDirty, setIsDirty] = useState(false); // Track if the form is dirty

  useEffect(() => {
    const fetchServiceData = async () => {
      const { data, error } = await supabase
        .from('seperate_service') // Fetch from the seperate_service table
        .select('*')
        .eq('id', serviceId) // Fetch the specific service by ID
        .single(); // Get a single record

      if (error) {
        console.error('Error fetching service data:', error);
        return;
      }

      setServiceData(data); // Set the fetched data
      setEditService(data); // Set the service for editing
    };

    fetchServiceData(); // Call the fetch function
  }, [serviceId]); // Run effect when serviceId changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditService({ ...editService, [e.target.name]: e.target.value }); // Update the editService state
    setIsDirty(true); // Mark the form as dirty
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('seperate_service') // Update the seperate_service table
      .update(editService) // Update the service in Supabase
      .eq('id', editService.id); // Match by ID

    if (error) {
      console.error('Error updating service:', error);
    } else {
      setIsEditService(false); // Exit edit mode
    }
  };

  const handleCancel = () => {
    setIsEditService(false); // Exit edit mode
  };

  const handleBack = () => {
    setIsEditService(false); // Navigate back to the previous state
  };

  if (!serviceData) return <div>Loading...</div>; // Show loading state

  return (
    <div>
      <button onClick={handleBack} className="top-4 left-4 flex items-center w-20 px-4 py-2 bg-gray-500 text-white rounded"> {/* Back button */}
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> {/* Left arrow icon */}
        Back
      </button>
      {editService && ( // Display the form for the service
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="px-30"> {/* Add padding left and right */}
          <div className="mb-4"> {/* Title Input */}
            <label className="block mb-1">Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="title" 
              value={editService.title} 
              onChange={handleChange} 
              required
            /> {/* Title input */}
          </div>
          <div className="mb-4"> {/* Heading Input */}
            <label className="block mb-1">Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="heading" 
              value={editService.heading} 
              onChange={handleChange} 
              required
            /> {/* Heading input */}
          </div>
          <div className="mb-4"> {/* Content Input */}
            <label className="block mb-1">Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="content" 
              value={editService.content} 
              onChange={handleChange} 
              required
            /> {/* Content input */}
          </div>
          <div className="mb-4"> {/* Significance Input */}
            <label className="block mb-1">Significance</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="significance" 
              value={editService.significance} 
              onChange={handleChange} 
              required
            /> {/* Significance input */}
          </div>
          <div className="mb-4"> {/* Plan of Action Input */}
            <label className="block mb-1">Plan of Action</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="plan_of_action" 
              value={editService.plan_of_action} 
              onChange={handleChange} 
              required
            /> {/* Plan of Action input */}
          </div>
          <div className="mb-4"> {/* Why Content Image Input */}
            <label className="block mb-1">Why Content Image URL</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="why_content_image" 
              value={editService.why_content_image} 
              onChange={handleChange} 
            /> {/* Why Content Image input */}
          </div>
          <div className="mb-4"> {/* Significance Title Input */}
            <label className="block mb-1">Significance Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="significance_title" 
              value={editService.significance_title} 
              onChange={handleChange} 
            /> {/* Significance Title input */}
          </div>
          <div className="mb-4"> {/* Plan of Action Title Input */}
            <label className="block mb-1">Plan of Action Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="plan_of_action_title" 
              value={editService.plan_of_action_title} 
              onChange={handleChange} 
            /> {/* Plan of Action Title input */}
          </div>
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button> {/* Cancel button */}
          <button type="submit" className={`w-20 px-4 py-2 bg-blue-500 text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isDirty}>Update</button> {/* Update button */}
        </form>
      )}
    </div>
  ); // Only display the form when editing
};

export default EditSeperateServicePage;
