"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrashAlt, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type EditContactProps = { // Updated type name
  setIsEditContact: (isEdit: boolean) => void; // Updated function name
  setContactData: (data: any) => void; // Updated function name
};

const EditContact = ({ // Updated component name
  setIsEditContact,
  setContactData
}: EditContactProps) => {
  const [contactData, setContactDataLocal] = useState<any>(null); // Updated state name
  const [editContact, setEditContact] = useState<any>(null); // Updated state name
  const [isDirty, setIsDirty] = useState(false);
  const [images, setImages] = useState<{ [key: string]: File | null }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string | null }>({});
  const [imageUploadActive, setImageUploadActive] = useState<{ [key: string]: boolean }>({
    bg_image: false, // Updated field name
     // Updated field name
  });
  
  const fileInputRefs = {
   // Updated field name
    bg_image: useRef<HTMLInputElement>(null), // Updated field name
  };

  useEffect(() => {
    const fetchContactData = async () => { // Updated function name
      const { data, error } = await supabase
        .from('contact') // Updated table name
        .select('*');

      if (error) {
        console.error('Error fetching contact data:', error); // Updated log message
        return;
      }

      setContactDataLocal(data);
      if (data && data.length > 0) {
        setEditContact(data[0]); // Updated state name
        setImagePreviews({
          bg_image: data[0].bg_image, // Updated field name
          // Updated field name
        });
      }
    };

    fetchContactData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditContact({ ...editContact, [e.target.name]: e.target.value }); // Updated state name
    setIsDirty(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImages({ ...images, [field]: file });
      setImagePreviews({ ...imagePreviews, [field]: URL.createObjectURL(file) });
      setIsDirty(true);
      setImageUploadActive({ ...imageUploadActive, [field]: false }); // Deactivate upload button on image change
    }
  };

  const handleRemoveImage = (field: string) => {
    setImages({ ...images, [field]: null });
    setImagePreviews({ ...imagePreviews, [field]: null });
    setEditContact({ ...editContact, [field]: null }); // Updated state name
    setIsDirty(true);
    setImageUploadActive({ ...imageUploadActive, [field]: true }); // Activate upload button on delete
  };

  const handleUpdateContact = async () => { // Updated function name
    let updatedContact = { ...editContact }; // Updated state name

    for (const field of ['bg_image']) { // Updated field names
      if (images[field]) {
        const uniqueFileName = `${Date.now()}_${images[field].name}`; // Append timestamp for uniqueness
        const { data, error } = await supabase.storage
          .from('contact-images') // Updated storage name
          .upload(`public/${uniqueFileName}`, images[field]);

        if (error) {
          console.error(`Error uploading ${field}:`, error);
          return;
        }

        const { data: publicData } = supabase.storage
          .from('contact-images') // Updated storage name
          .getPublicUrl(data.path);
        const publicURL = publicData.publicUrl;

        updatedContact[field] = publicURL; // Update the URL in the updatedContact object
      }
    }

    const { error } = await supabase
      .from('contact') // Updated table name
      .update(updatedContact)
      .eq('id', editContact.id); // Updated state name

    if (error) {
      console.error('Error updating contact:', error);
    } else {
      setContactData((prevData: any) => prevData.map((contact: any) => contact.id === editContact.id ? updatedContact : contact)); // Update local state
      setIsEditContact(false); // Close the edit form
      setIsDirty(false);
    }
  };

  const handleCancel = () => {
    setIsEditContact(false);
  };

  const handleBack = () => {
    setIsEditContact(false);
  };

  if (!contactData) return <div>Loading...</div>; // Updated loading message

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6"> {/* Added classes for styling */}
      <div className="flex items-center gap-8 border-b pt-4 pb-4 mb-4"> {/* Added flex container with gap */}
        <button onClick={handleBack} className="flex items-center mb-2 w-8 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white"> 
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        </button>
        <h1 className="text-black text-2xl font-bold mb-2">Edit Contact Page</h1> {/* Updated heading */}
      </div>
      {editContact && (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateContact(); }} className="px-15">
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="title" 
              value={editContact.title} // Updated state name
              onChange={handleChange} 
            /> {/* Title input */}
          </div>
          <div className="mb-4"> {/* Contact Title Input */}
            <label className="block mb-2 text-gray-500 font-semibold">Contact Subquotes</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="subquotes" 
              value={editContact.subquotes} // Updated state name
              onChange={handleChange} 
            /> {/* Contact Title input */}
          </div>
          
          <div className="mb-4"> {/* Background Image Display */}
            <label className="block mb-2 text-gray-500 font-semibold">Background Image</label>
            {imagePreviews.bg_image ? ( // Check if the background image preview exists
              <div className="mb-2">
                <Image 
                  src={imagePreviews.bg_image} // Updated field name
                  alt="Background Image" 
                  width={300} 
                  height={200} 
                  className="rounded-md mb-4" 
                />
                <div className="flex gap-2 mt-2"> {/* Flex container for icons */}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage('bg_image')} // Updated field name
                    className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                  >
                   Replace Image {/* Trash icon without margin */}
                  </button>
                </div>
              </div>
            ) : ( // No image box
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer ${imageUploadActive.bg_image ? '' : 'opacity-50 cursor-not-allowed'}`} // Updated field name
                onClick={() => imageUploadActive.bg_image && fileInputRefs.bg_image.current?.click()} // Clickable area
              >
                <span className="text-gray-700">Upload Image</span>
                <button 
                  type="button" 
                  className="flex items-center px-3 py-2 text-gray-700 rounded ml-2" // Added margin-left for spacing
                  disabled={!imageUploadActive.bg_image}
                >
                  <FontAwesomeIcon icon={faFileUpload} /> {/* File upload icon without margin */}
                </button>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageChange(e, 'bg_image')} // Updated field name
              ref={fileInputRefs.bg_image} // Updated field name
              className="hidden" 
            />
          </div>
          
          
          {/* Additional fields for contact data */}
          <div className="mb-4"> {/* Contact Title Input */}
            <label className="block mb-2 text-gray-500 font-semibold">Contact Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="contact_title" 
              value={editContact.contact_title} // Updated state name
              onChange={handleChange} 
            /> {/* Contact Title input */}
          </div>
          <div className="mb-4"> {/* Contact Content Input */}
            <label className="block mb-2 text-gray-500 font-semibold">Contact Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="contact_content" 
                value={editContact.contact_content} // Updated state name
              onChange={handleChange} 
            /> {/* Contact Content input */}
          </div>
          <div className="mb-4"> {/* Contact Phone Input */}
            <label className="block mb-2 text-gray-500 font-semibold">Contact Phone</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="contact_phone" 
                value={editContact.contact_phone} // Updated state name
              onChange={handleChange} 
            /> {/* Contact Phone input */}
          </div>
          <div className="mb-4"> {/* Email Title Input */}
            <label className="block mb-2 text-gray-500 font-semibold">Email Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="email_title" 
                value={editContact.email_title} // Updated state name
              onChange={handleChange} 
            /> {/* Email Title input */}
          </div>
          <div className="mb-4"> {/* Email Content Input */}
            <label className="block mb-2 text-gray-500 font-semibold">Email Content</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="email_content" 
              value={editContact.email_content} // Updated state name
              onChange={handleChange} 
            /> {/* Email Content input */}
          </div>
          <div className="mb-4"> {/* Email Input */}
            <label className="block mb-2 text-gray-500 font-semibold">Email</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="email" 
              value={editContact.email} // Updated state name
              onChange={handleChange} 
            /> {/* Email input */}
          </div>

          <button type="submit" className={`w-20 px-4 py-2 bg-[#609641] text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''} mt-4 mb-8`} disabled={!isDirty}>Update</button> {/* Update button */}
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded mt-4 mb-8">Cancel</button> {/* Cancel button */}
        </form>
      )}
    </div>
  );
};

export default EditContact; // Updated export