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

type ServicePagePreviewProps = { // Renamed type
  setIsEditService: (isEdit: boolean) => void; // Updated prop name
  serviceData?: any[]; // Updated prop type
};

const EditServicePage = ({ 
  setIsEditService, // Updated prop name
}: ServicePagePreviewProps) => { // Updated type
  const [serviceData, setServiceData] = useState<any>(null); // Initialize serviceData as null
  const [editService, setEditService] = useState<any>(null); // State for the service section being edited
  const [isDirty, setIsDirty] = useState(false); // Track if the form is dirty
  const [originalService, setOriginalService] = useState<any>(null); // State to store original service data

  useEffect(() => {
    const fetchServiceData = async () => { // Fetch service data directly
      const { data, error } = await supabase
        .from('service') // Updated table name
        .select('*'); // Fetch all service data

      if (error) {
        console.error('Error fetching service data:', error);
        return;
      }

      setServiceData(data); // Set the fetched data
      if (data && data.length > 0) {
        setEditService(data[0]); // Automatically set the first service section for editing
        setOriginalService(data[0]); // Store original service data
      }
    };

    fetchServiceData(); // Call the fetch function
  }, []); // Empty dependency array to run only once

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditService({ ...editService, [e.target.name]: e.target.value }); // Update the editService state
    setIsDirty(true); // Mark the form as dirty
  };

  const handleUpdateService = async () => { // Renamed function to handleUpdateService
    const { error } = await supabase
      .from('service') // Updated table name
      .update(editService) // Update the service section in Supabase
      .eq('id', editService.id); // Match by ID

    if (error) {
      console.error('Error updating service:', error);
    } else {
      setServiceData((prevData: any) => prevData.map((service: any) => service.id === editService.id ? editService : service)); // Update local state
      setEditService(null); // Clear the edit form
      setIsDirty(false); // Reset dirty state after update
    }
  };

  const handleCancel = () => {
    setIsEditService(false); // Reset to original service data
    // setEditService(originalService); // Reset to original service data
    // setIsDirty(false); // Reset dirty state
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
      {editService && ( // Display the form directly for the first service section
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateService(); }} className="px-30"> {/* Add padding left and right */}
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Service Heading</label> {/* Label for Service Heading */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="service_heading" 
              value={editService.service_heading} 
              onChange={handleChange} 
            /> {/* Service Heading input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Service Content</label> {/* Label for Service Content */}
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="service_content" 
              value={editService.service_content} 
              onChange={handleChange} 
            /> {/* Service Content input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Service Image</label> {/* Label for Service Image */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="service_image" 
              value={editService.service_image} 
              onChange={handleChange} 
            /> {/* Service Image input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Years of Experience Title</label> {/* Label for Years of Experience Title */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="years_of_experience_title" 
              value={editService.years_of_experience_title} 
              onChange={handleChange} 
            /> {/* Years of Experience Title input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Years of Experience</label> {/* Label for Years of Experience */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="years_of_experience" 
              value={editService.years_of_experience} 
              onChange={handleChange} 
            /> {/* Years of Experience input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Satisfied Clients Title</label> {/* Label for Satisfied Clients Title */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="satisfied_clients_title" 
              value={editService.satisfied_clients_title} 
              onChange={handleChange} 
            /> {/* Satisfied Clients Title input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Satisfied Clients</label> {/* Label for Satisfied Clients */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="satisfied_clients" 
              value={editService.satisfied_clients} 
              onChange={handleChange} 
            /> {/* Satisfied Clients input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Services Provided Title</label> {/* Label for Services Provided Title */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="services_provided_title" 
              value={editService.services_provided_title} 
              onChange={handleChange} 
            /> {/* Services Provided Title input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Services Provided</label> {/* Label for Services Provided */}
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="services_provided" 
              value={editService.services_provided} 
              onChange={handleChange} 
            /> {/* Services Provided input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Business Portfolios Title</label> {/* Label for Business Portfolios Title */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="business_portfolios_title" 
              value={editService.business_portfolios_title} 
              onChange={handleChange} 
            /> {/* Business Portfolios Title input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Business Portfolios</label> {/* Label for Business Portfolios */}
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="business_portfolios" 
              value={editService.business_portfolios} 
              onChange={handleChange} 
            /> {/* Business Portfolios input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Collection Heading</label> {/* Label for Collection Heading */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="collection_heading" 
              value={editService.collection_heading} 
              onChange={handleChange} 
            /> {/* Collection Heading input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Collection Content</label> {/* Label for Collection Content */}
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="collection_content" 
              value={editService.collection_content} 
              onChange={handleChange} 
            /> {/* Collection Content input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Collection Image</label> {/* Label for Collection Image */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="collection_image" 
              value={editService.collection_image} 
              onChange={handleChange} 
            /> {/* Collection Image input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Service Provided Heading</label> {/* Label for Service Provided Heading */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="service_provided_heading" 
              value={editService.service_provided_heading} 
              onChange={handleChange} 
            /> {/* Service Provided Heading input */}
          </div>
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button> {/* Cancel button */}
          <button type="submit" className={`w-20 px-4 py-2 bg-blue-500 text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isDirty}>Update</button> {/* Update button */}
        </form>
      )}
    </div>
  ); // Only display the form when editing
};

export default EditServicePage;
