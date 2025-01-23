"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type EditServiceProvidedPageProps = {
  setIsEditService: (isEdit: boolean) => void; // Function to set edit state
  serviceId: string; // ID of the service to edit
  setServiceData: (data: any) => void; // This should be a function
};

const EditSeperate_ServicePage = ({ 
  setIsEditService, 
  serviceId,
  setServiceData = () => {} // Default to a no-op function
}: EditServiceProvidedPageProps) => {
  const [serviceData, setServiceDataLocal] = useState<any>(null);
  const [editService, setEditService] = useState<any>({
    title: '',
    heading: '',
    content: '',
    significance: '',
    plan_of_action: '',
    why_content_image: '',
    significance_title: '',
    plan_of_action_title: '',
  });
  const [isDirty, setIsDirty] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploadActive, setImageUploadActive] = useState<{ [key: string]: boolean }>({
    why_content_image: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      const { data, error } = await supabase
        .from('seperate_service') // Updated table name
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) {
        console.error('Error fetching service data:', error);
        return;
      }

      setServiceDataLocal(data);
      setEditService(data);
      setImagePreview(data.why_content_image); // Updated field name
    };

    fetchServiceData();
  }, [serviceId]);

  const handleQuillChange = (value: string, field: string) => {
    setEditService((prevEditService: any) => ({ ...prevEditService, [field]: value })); // Specify type for prevEditAbout
    setIsDirty(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditService({ ...editService, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsDirty(true);
      setImageUploadActive({ ...imageUploadActive, why_content_image: true }); // Activate upload button
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setEditService({ ...editService, why_content_image: null }); // Updated field name
    setIsDirty(true);
    setImageUploadActive({ ...imageUploadActive, why_content_image: false }); // Deactivate upload button
  };

  const handleUpdate = async () => {
    // Check if setServiceData is a function
    if (typeof setServiceData !== 'function') {
        console.error('setServiceData is not a function');
        return;
    }

    let updatedService = { ...editService };
    let imageUrl = editService.why_content_image; // Default to existing image

    if (image) {
      const uniqueFileName = `${Date.now()}_${image.name}`; // Append timestamp for uniqueness
      const { data, error } = await supabase.storage
        .from('blog-images') // Updated storage bucket name
        .upload(`public/${uniqueFileName}`, image);

      if (error) {
        if (error.message === "The resource already exists") {
          console.error('Image already exists. Please choose a different image.');
          return; // Handle the duplicate error
        }
        console.error('Error uploading image:', error);
        return;
      }

      const { data: publicData } = supabase.storage
        .from('blog-images') // Updated storage bucket name
        .getPublicUrl(data.path);
      imageUrl = publicData.publicUrl; // Update imageUrl to new image URL
    } else if (editService.why_content_image === null) {
      // If the image was removed, set imageUrl to null
      imageUrl = null;
    }

   updatedService.why_content_image = imageUrl; // Update the bg_image in the updatedService object

    const { error } = await supabase
      .from('seperate_service') // Updated table name
      .update(updatedService)
      .eq('id', serviceId); // Ensure you are using serviceId here

    if (error) {
      console.error('Error updating service:', error);
    } else {
      setServiceData((prevData: any) => 
        prevData.map((service: any) => service.id === updatedService.id ? updatedService : service)
      ); // Update local state
      setIsEditService(false); // Exit edit mode
    }
  };

  const handleCancel = () => {
    setIsEditService(false);
  };

  const handleBack = () => {
    setIsEditService(false);
  };

  if (!serviceData) return <div>Loading...</div>;

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6"> {/* Added classes for styling */}
      <div className="flex items-center gap-8 border-b pt-4 pb-4 mb-4"> {/* Added flex container with gap */}
        <button onClick={handleBack} className="flex items-center mb-2 w-8 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white"> 
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        </button>
        <h1 className="text-black text-2xl font-bold mb-2">Edit Service Provided</h1> {/* Updated heading */}
      </div>
      {editService && (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="px-20">
          <div className="mb-4">
         

            <label className="block mb-2 text-gray-500 font-semibold">Title</label>
            <input
              type="text"
              value={editService.title}
              onChange={(e) => handleQuillChange(e.target.value, "title")}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Heading</label>
            <ReactQuill
              value={editService.heading}
              onChange={(content) =>
                handleQuillChange(content, "heading")
              }
              
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Content</label>
            <ReactQuill
              value={editService.content}
              onChange={(content) =>
                handleQuillChange(content, "content")
              }
              
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Significance</label>
            <ReactQuill
              value={editService.significance}
              onChange={(content) =>
                handleQuillChange(content, "significance")
              }
              
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Plan of Action</label>
            <ReactQuill
              value={editService.plan_of_action}
              onChange={(content) =>
                handleQuillChange(content, "plan_of_action")
              }
              
            />
          </div>
          <div className="mb-4"> {/* Background Image Display */}
            <label className="block mb-2 text-gray-500 font-semibold">Why Content Image</label>
            {imagePreview ? ( // Check if the image preview exists
              <div className="mb-2">
                <Image 
                  src={imagePreview} 
                  alt="why_content_image" 
                  width={300} 
                  height={200} 
                  style={{ width: "300px", height: "200px" }} // Maintain aspect ratio
                  className="rounded-md mb-4" 
                />
                <div className="flex gap-2 mt-2"> {/* Flex container for icons */}
                  <button 
                    type="button" 
                    onClick={handleRemoveImage} 
                    className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                  >
                   Replace Image {/* Button text */}
                  </button>
                </div>
              </div>
            ) : ( // No image box
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer`} 
                onClick={() => fileInputRef.current?.click()} // Clickable area
              >
                <span className="text-gray-700">Upload Image</span>
                <button 
                  type="button" 
                  className="flex items-center px-3 py-2 text-gray-700 rounded ml-2" // Added margin-left for spacing
                >
                  <FontAwesomeIcon icon={faFileUpload} /> {/* File upload icon without margin */}
                </button>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              ref={fileInputRef} 
              className="hidden" 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Significance Title</label>
            <ReactQuill
              value={editService.significance_title}
              onChange={(content) =>
                handleQuillChange(content, "significance_title")
              }
              
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Plan of Action Title</label>
            <ReactQuill
              value={editService.plan_of_action_title}
              onChange={(content) =>
                handleQuillChange(content, "plan_of_action_title")
              }
              
            />
          </div>
          
          <button type="submit" className={`w-20 px-4 py-2 bg-[#609641] text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''} mt-4 mb-8`} disabled={!isDirty}>Update</button> {/* Update button */}
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded mt-4 mb-8">Cancel</button>
        </form>
      )}
    </div>
  );
};

export default EditSeperate_ServicePage;