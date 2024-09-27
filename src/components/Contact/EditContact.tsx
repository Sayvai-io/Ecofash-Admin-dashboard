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
type ContactPagePreviewProps = {
  setIsEditContact: (isEdit: boolean) => void;
  contacts?: any[];
};

const EditContact = ({ 
  setIsEditContact, 
  contacts = [], 
}: ContactPagePreviewProps) => { // Removed contacts prop
  const [contactData, setContactData] = useState<any>(null); // Initialize contactData as null
  const [editContact, setEditContact] = useState<any>(null); // State for the contact being edited
  const [isDirty, setIsDirty] = useState(false); // Track if the form is dirty
  const [originalContact, setOriginalContact] = useState<any>(null); // State to store original contact data

  useEffect(() => {
    const fetchContactData = async () => { // Fetch contact data directly
      const { data, error } = await supabase
        .from('contact')
        .select('*'); // Fetch all contacts

      if (error) {
        console.error('Error fetching contact data:', error);
        return;
      }

      setContactData(data); // Set the fetched data
      if (data && data.length > 0) {
        setEditContact(data[0]); // Automatically set the first contact for editing
        setOriginalContact(data[0]); // Store original contact data
      }
    };

    fetchContactData(); // Call the fetch function
  }, []); // Empty dependency array to run only once

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditContact({ ...editContact, [e.target.name]: e.target.value }); // Update the editContact state
    setIsDirty(true); // Mark the form as dirty
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('contact')
      .update(editContact) // Update the contact in Supabase
      .eq('id', editContact.id); // Match by ID

    if (error) {
      console.error('Error updating contact:', error);
    } else {
      setContactData((prevData: any) => prevData.map((contact: any) => contact.id === editContact.id ? editContact : contact)); // Update local state
      setEditContact(null); // Clear the edit form
      setIsDirty(false); // Reset dirty state after update
    }
  };

  const handleCancel = () => {
    setIsEditContact(false);
    // setEditContact(originalContact); // Reset to original contact data
    // setIsDirty(false); // Reset dirty state
  };

  const handleBack = () => {
    setIsEditContact(false); // Navigate back to the previous state
  };

  if (!contactData) return <div>Loading...</div>; // Show loading state

  return (
    <div>
      <button onClick={handleBack} className="top-4 left-4 flex items-center w-20 px-4 py-2 bg-gray-500 text-white rounded"> {/* Back button */}
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> {/* Left arrow icon */}
        Back
      </button>
      {editContact && ( // Display the form directly for the first contact
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="px-30"> {/* Add padding left and right */}
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Title</label> {/* Label for Title */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="title" 
              value={editContact.title} 
              onChange={handleChange} 
            /> {/* Title input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Subquotes</label> {/* Label for Subquotes */}
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="subquotes" 
              value={editContact.subquotes} 
              onChange={handleChange} 
            /> {/* Subquotes input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Contact Title</label> {/* Label for Contact Title */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="contact_title" 
              value={editContact.contact_title} 
              onChange={handleChange} 
            /> {/* Contact Title input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Contact Content</label> {/* Label for Contact Content */}
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="contact_content" 
              value={editContact.contact_content} 
              onChange={handleChange} 
            /> {/* Contact Content input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Contact Phone</label> {/* Label for Contact Phone */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="contact_phone" 
              value={editContact.contact_phone} 
              onChange={handleChange} 
            /> {/* Contact Phone input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Email Title</label> {/* Label for Email Title */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="email_title" 
              value={editContact.email_title} 
              onChange={handleChange} 
            /> {/* Email Title input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Email Contact</label> {/* Label for Email Contact */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="email_contact" 
              value={editContact.email_contact} 
              onChange={handleChange} 
            /> {/* Email Contact input */}
          </div>
          <div className="mb-4"> {/* Add margin bottom for spacing */}
            <label className="block mb-1">Email</label> {/* Label for Email */}
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="email" 
              value={editContact.email} 
              onChange={handleChange} 
            /> {/* Email input */}
          </div>
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button> {/* Cancel button */}
          <button type="submit" className={`w-20 px-4 py-2 bg-blue-500 text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isDirty}>Update</button> {/* Update button */}
        </form>
      )}
    </div>
  ); // Only display the form when editing
};

export default EditContact;
