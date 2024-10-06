"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type EditContactProps = {
  setIsEditContact: (isEdit: boolean) => void;
  setContactData: (data: any) => void;
};

const EditContact = ({ 
  setIsEditContact, 
  setContactData 
}: EditContactProps) => {
  const [contactDataLocal, setContactDataLocal] = useState<any>(null);
  const [editContact, setEditContact] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [images, setImages] = useState<{ [key: string]: File | null }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string | null }>({});
  
  const fileInputRefs = {
    bg_image: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const fetchContactData = async () => {
      const { data, error } = await supabase
        .from('contact')
        .select('*');

      if (error) {
        console.error('Error fetching contact data:', error);
        return;
      }

      setContactDataLocal(data);
      if (data && data.length > 0) {
        setEditContact(data[0]);
        setImagePreviews({
          bg_image: data[0].bg_image,
        });
      }
    };

    fetchContactData();
  }, []);

   const handleQuillChange = (value: string, field: string) => {
    setEditContact((prevEditContact: any) => ({ ...prevEditContact, [field]: value })); // Specify type for prevEditAbout
    setIsDirty(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditContact({ ...editContact, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImages({ ...images, [field]: file });
      setImagePreviews({ ...imagePreviews, [field]: URL.createObjectURL(file) });
      setIsDirty(true);
    }
  };

  const handleRemoveImage = (field: string) => {
    setImages({ ...images, [field]: null });
    setImagePreviews({ ...imagePreviews, [field]: null });
    setEditContact({ ...editContact, [field]: null });
    setIsDirty(true);
  };

  const handleUpdateContact = async () => {
    let updatedContact = { ...editContact };

    for (const field of ['bg_image']) {
      const file = images[field];
      if (file) {
        const uniqueFileName = `${Date.now()}_${file.name}`;
        
        // Upload the image
        const { data, error } = await supabase.storage
          .from('blog-images')
          .upload(`public/${uniqueFileName}`, file);

        if (error) {
          console.error(`Error uploading ${field}:`, error);
          alert(`Failed to upload ${field}. Please try again.`);
          return;
        }

        const { data: publicData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(data.path);
        const publicURL = publicData.publicUrl;

        updatedContact[field] = publicURL; // Update the URL in the updatedContact object
      }
    }

    // Update the contact data in the database
    const { error } = await supabase
      .from('contact')
      .update(updatedContact)
      .eq('id', editContact.id);

    if (error) {
      console.error('Error updating contact:', error);
      alert('Failed to update contact data. Please try again.');
    } else {
      setContactData((prevData: any) => prevData.map((contact: any) => contact.id === editContact.id ? updatedContact : contact));
      setIsEditContact(false);
      setIsDirty(false);
    }
  };

  const handleCancel = () => {
    setIsEditContact(false);
  };

  const handleBack = () => {
    setIsEditContact(false);
  };

  if (!contactDataLocal) return <div>Loading...</div>;

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-8 border-b pt-4 pb-4 mb-4">
        <button onClick={handleBack} className="flex items-center mb-2 w-8 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white"> 
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        </button>
        <h1 className="text-black text-2xl font-bold mb-2">Edit Contact</h1>
      </div>
      {editContact && (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateContact(); }} className="px-15">
          {/* Title Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Title</label>
            <ReactQuill
              value={editContact.title}
              onChange={(content) =>
                handleQuillChange(content, "title")
              }
            />
          </div>

          {/* Subquote Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Subquote</label>
            <ReactQuill
              value={editContact.subquotes}
              onChange={(content) =>
                handleQuillChange(content, "subquotes")
              }
            />
          </div>

          {/* Background Image Display */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Background Image</label>
            {imagePreviews.bg_image ? (
              <div className="mb-2">
                <Image 
                  src={imagePreviews.bg_image} 
                  alt="Background Image" 
                  width={300} 
                  height={200} 
                  className="rounded-md mb-4" 
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage('bg_image')} 
                  className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                >
                  Replace Image
                </button>
              </div>
            ) : (
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer`} 
                onClick={() => fileInputRefs.bg_image.current?.click()}
              >
                <span className="text-gray-700">Upload Image</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageChange(e, 'bg_image')} 
              ref={fileInputRefs.bg_image} 
              className="hidden" 
            />
          </div>

          {/* Contact Title Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Contact Title</label>
            <ReactQuill
              value={editContact.contact_title}
              onChange={(content) =>
                handleQuillChange(content, "contact_title")
              }
            />
          </div>

          {/* Contact Content Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Contact Content</label>
            <ReactQuill
              value={editContact.contact_content}
              onChange={(content) =>
                handleQuillChange(content, "contact_content")
              }
            />
          </div>

          {/* Contact Phone Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Contact Phone</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="phone" 
              value={editContact.contact_phone} 
              onChange={handleChange} 
            />
          </div>

          {/* Email Title Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Email Title</label>
            <ReactQuill
              value={editContact.email_title}
              onChange={(content) =>
                handleQuillChange(content, "email_title")
              }
            />
          </div>

          {/* Email Content Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Email Content</label>
            <ReactQuill
              value={editContact.email_content}
              onChange={(content) =>
                handleQuillChange(content, "email_content")
              }
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Email</label>
            <ReactQuill
              value={editContact.email}
              onChange={(content) =>
                handleQuillChange(content, "email")
              }
            />
          </div>

          <button type="submit" className={`w-20 px-4 py-2 mr-2 bg-[#609641] text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isDirty}>Update</button>
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded mt-4">Cancel</button>
        </form>
      )}
    </div>
  );
};

export default EditContact; 