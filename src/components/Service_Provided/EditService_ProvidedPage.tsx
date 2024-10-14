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


const EditService_ProvidedPage = ({ 
  setIsEditService, 
  serviceId,
  setServiceData = () => {} // Default to a no-op function
}: EditServiceProvidedPageProps) => {
  const [serviceData, setServiceDataLocal] = useState<any>(null);
  const [editService, setEditService] = useState<any>({
    title: '',
    content: '',
    heading: '',
    heading_content: '',
    significance: '',
    plan_of_action: '',
    significance_title: '',
    plan_of_action_title: '',
    bg_image: null,
    why_content_image: null,
  });
  const [isDirty, setIsDirty] = useState(false);
  const [bgImage, setBgImage] = useState<File | null>(null);
  const [bgImagePreview, setBgImagePreview] = useState<string | null>(null);
  const [whyContentImage, setWhyContentImage] = useState<File | null>(null);
  const [whyContentImagePreview, setWhyContentImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const whyContentImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      const { data, error } = await supabase
        .from('service_provided') // Updated table name
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) {
        console.error('Error fetching service data:', error);
        return;
      }

      setServiceDataLocal(data);
      setEditService(data);
      setBgImagePreview(data.bg_image); // Updated field name
      setWhyContentImagePreview(data.why_content_image); // Updated field name
    };

    fetchServiceData();
  }, [serviceId]);

  const handleQuillChange = (value: string, field: string) => {
    setEditService((prevEditService: any) => ({ ...prevEditService, [field]: value })); // Specify type for prevEditAbout
    setIsDirty(true);
  };

  const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setBgImage(file);
      setBgImagePreview(URL.createObjectURL(file));
      setIsDirty(true);
    }
  };

  const handleWhyContentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setWhyContentImage(file);
      setWhyContentImagePreview(URL.createObjectURL(file));
      setIsDirty(true);
    }
  };

  const handleRemoveBgImage = () => {
    setBgImage(null);
    setBgImagePreview(null);
    setEditService({ ...editService, bg_image: null }); // Updated field name
    setIsDirty(true);
  };

  const handleRemoveWhyContentImage = () => {
    setWhyContentImage(null);
    setWhyContentImagePreview(null);
    setEditService({ ...editService, why_content_image: null }); // Updated field name
    setIsDirty(true);
  };

  const handleUpdate = async () => {
    // Check if setServiceData is a function
    if (typeof setServiceData !== 'function') {
        console.error('setServiceData is not a function');
        return;
    }

    let updatedService = { ...editService };
    let bgImageUrl = editService.bg_image; // Default to existing image
    let whyContentImageUrl = editService.why_content_image; // Default to existing image

    // Handle background image upload
    if (bgImage) {
      const uniqueBgFileName = `${Date.now()}_${bgImage.name}`; // Append timestamp for uniqueness
      const { data: bgData, error: bgError } = await supabase.storage
        .from('blog-images') // Updated storage bucket name
        .upload(`public/${uniqueBgFileName}`, bgImage);

      if (bgError) {
        console.error('Error uploading background image:', bgError);
        return;
      }

      const { data: bgPublicData } = supabase.storage
        .from('blog-images') // Updated storage bucket name
        .getPublicUrl(bgData.path);
      bgImageUrl = bgPublicData.publicUrl; // Update bgImageUrl to new image URL
    }

    // Handle why content image upload
    if (whyContentImage) {
      const uniqueWhyFileName = `${Date.now()}_${whyContentImage.name}`; // Append timestamp for uniqueness
      const { data: whyData, error: whyError } = await supabase.storage
        .from('blog-images') // Updated storage bucket name
        .upload(`public/${uniqueWhyFileName}`, whyContentImage);

      if (whyError) {
        console.error('Error uploading why content image:', whyError);
        return;
      }

      const { data: whyPublicData } = supabase.storage
        .from('blog-images') // Updated storage bucket name
        .getPublicUrl(whyData.path);
      whyContentImageUrl = whyPublicData.publicUrl; // Update whyContentImageUrl to new image URL
    }

    updatedService.bg_image = bgImageUrl; // Update the bg_image in the updatedService object
    updatedService.why_content_image = whyContentImageUrl; // Update the why_content_image in the updatedService object

    const { error } = await supabase
      .from('service_provided') // Updated table name
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

  const handleBack = () => {
    setIsEditService(false);
  };

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
            <ReactQuill
              value={editService.title}
              onChange={(content) =>
                handleQuillChange(content, "title")
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
          <div className="mb-4"> {/* Background Image Display */}
            <label className="block mb-2 text-gray-500 font-semibold">Background Image</label>
            {bgImagePreview ? ( // Check if the image preview exists
              <div className="mb-2">
                <Image 
                  src={bgImagePreview} 
                  alt="Background Image" 
                  width={300} 
                  height={200} 
                  style={{ width: "300px", height: "200px" }} // Maintain aspect ratio
                  className="rounded-md mb-4" 
                />
                <div className="flex gap-2 mt-2"> {/* Flex container for icons */}
                  <button 
                    type="button" 
                    onClick={handleRemoveBgImage} 
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
              onChange={handleBgImageChange} 
              ref={fileInputRef} 
              className="hidden" 
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
            <label className="block mb-2 text-gray-500 font-semibold">Heading Content</label>
            <ReactQuill
              value={editService.heading_content}
              onChange={(content) =>
                handleQuillChange(content, "heading_content")
              }
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
            <label className="block mb-2 text-gray-500 font-semibold">Significance</label>
            <ReactQuill
              value={editService.significance}
              onChange={(content) =>
                handleQuillChange(content, "significance")
              }
            />
          </div>
          <div className="mb-4"> {/* Why Content Image Display */}
            <label className="block mb-2 text-gray-500 font-semibold">Why Content Image</label>
            {whyContentImagePreview ? ( // Check if the image preview exists
              <div className="mb-2">
                <Image 
                  src={whyContentImagePreview} 
                  alt="Why Content Image" 
                  width={300} 
                  height={200} 
                  style={{ width: "300px", height: "200px" }} // Maintain aspect ratio
                  className="rounded-md mb-4" 
                />
                <div className="flex gap-2 mt-2"> {/* Flex container for icons */}
                  <button 
                    type="button" 
                    onClick={handleRemoveWhyContentImage} 
                    className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                  >
                   Replace Image {/* Button text */}
                  </button>
                </div>
              </div>
            ) : ( // No image box
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer`} 
                onClick={() => whyContentImageInputRef.current?.click()} // Clickable area
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
              onChange={handleWhyContentImageChange} 
              ref={whyContentImageInputRef} 
              className="hidden" 
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
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Plan of Action</label>
            <ReactQuill
              value={editService.plan_of_action}
              onChange={(content) =>
                handleQuillChange(content, "plan_of_action")
              }
            />
          </div>
         
        
          
          
          <button type="submit" className={`w-20 px-4 py-2 bg-[#609641] text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''} mt-4 mb-8`} disabled={!isDirty}>Update</button> {/* Update button */}
          <button type="button" onClick={() => setIsEditService(false)} className="w-20 px-4 py-2 bg-gray-500 text-white rounded mt-4 mb-8">Cancel</button>
        </form>
      )}
    </div>
  );
};


export default EditService_ProvidedPage;