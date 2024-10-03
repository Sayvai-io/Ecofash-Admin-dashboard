"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrashAlt, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AboutPagePreviewProps = {
  setIsEditAbout: (isEdit: boolean) => void;
  setAboutData: (data: any) => void; // Function to update the about data in the parent component
};



const EditAboutPage = ({ 
  setIsEditAbout, 
  setAboutData 
}: AboutPagePreviewProps) => {
  const [aboutData, setAboutDataLocal] = useState<any>(null);
  const [editAbout, setEditAbout] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [images, setImages] = useState<{ [key: string]: File | null }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string | null }>({});
  const [imageUploadActive, setImageUploadActive] = useState<{ [key: string]: boolean }>({
    bg_image: false,
    about_image: false,
    mv_image: false,
    tc_image: false,
  });
  
  const fileInputRefs = {
    about_image: useRef<HTMLInputElement>(null),
    mv_image: useRef<HTMLInputElement>(null),
    tc_image: useRef<HTMLInputElement>(null),
    bg_image: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const fetchAboutData = async () => {
      const { data, error } = await supabase
        .from('about')
        .select('*');

      if (error) {
        console.error('Error fetching about data:', error);
        return;
      }

      setAboutDataLocal(data);
      if (data && data.length > 0) {
        setEditAbout(data[0]);
        setImagePreviews({
          bg_image: data[0].bg_image,
          about_image: data[0].about_image,
          mv_image: data[0].mv_image,
          tc_image: data[0].tc_image,
        });
      }
    };

    fetchAboutData();
  }, []);

  const handleQuillChange = (value: string, field: string) => {
    setEditAbout((prevEditAbout: any) => ({ ...prevEditAbout, [field]: value })); // Specify type for prevEditAbout
    setIsDirty(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditAbout({ ...editAbout, [e.target.name]: e.target.value });
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
    setEditAbout({ ...editAbout, [field]: null });
    setIsDirty(true);
    setImageUploadActive({ ...imageUploadActive, [field]: true }); // Activate upload button on delete
  };

  const handleUpdateAbout = async () => {
    let updatedAbout = { ...editAbout };

    for (const field of ['bg_image', 'about_image', 'mv_image', 'tc_image']) {
      if (images[field]) {
        const uniqueFileName = `${Date.now()}_${images[field].name}`; // Append timestamp for uniqueness
        const { data, error } = await supabase.storage
          .from('blog-images')
          .upload(`public/${uniqueFileName}`, images[field]);

        if (error) {
          console.error(`Error uploading ${field}:`, error);
          return;
        }

        const { data: publicData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(data.path);
        const publicURL = publicData.publicUrl;

        updatedAbout[field] = publicURL; // Update the URL in the updatedAbout object
      }
    }

    const { error } = await supabase
      .from('about')
      .update(updatedAbout)
      .eq('id', editAbout.id);

    if (error) {
      console.error('Error updating about:', error);
    } else {
      setAboutData((prevData: any) => prevData.map((about: any) => about.id === editAbout.id ? updatedAbout : about)); // Update local state
      setIsEditAbout(false); // Close the edit form
      setIsDirty(false);
    }
  };

  const handleCancel = () => {
    setIsEditAbout(false);
  };

  const handleBack = () => {
    setIsEditAbout(false);
  };

  if (!aboutData) return <div>Loading...</div>;

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6"> {/* Added classes for styling */}
      <div className="flex items-center gap-8 border-b pt-4 pb-4 mb-4"> {/* Added flex container with gap */}
        <button onClick={handleBack} className="flex items-center mb-2 w-8 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white"> 
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        </button>
        <h1 className="text-black text-2xl font-bold mb-2">Edit About Page</h1> {/* Removed margin-top since gap is applied */}
      </div>
      {editAbout && (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateAbout(); }} className="px-15">
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Title</label>
            <ReactQuill
              value={editAbout.title}
              onChange={(content) =>
                handleQuillChange(content, "title")
              }
              
            />{/* Title input */}
          </div>
          
          <div className="mb-4"> {/* Background Image Display */}
            <label className="block mb-2 text-gray-500 font-semibold">Background Image</label>
            {imagePreviews.bg_image ? ( // Check if the background image preview exists
              <div className="mb-2">
                <Image 
                  src={imagePreviews.bg_image} 
                  alt="Background Image" 
                  width={300} 
                  height={200} 
                  className="rounded-md mb-4" 
                />
                <div className="flex gap-2 mt-2"> {/* Flex container for icons */}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage('bg_image')} 
                    className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                  >
                   Replace Image {/* Trash icon without margin */}
                  </button>
                 
                  
                </div>
              </div>
            ) : ( // No image box
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer ${imageUploadActive.bg_image ? '' : 'opacity-50 cursor-not-allowed'}`} 
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
              onChange={(e) => handleImageChange(e, 'bg_image')} 
              ref={fileInputRefs.bg_image} 
              className="hidden" 
            />
          </div>
          
          <div className="mb-4"> {/* About Image Display */}
          <label className="block mb-2 text-gray-500 font-semibold">About Image</label>
            {imagePreviews.about_image ? ( // Check if the background image preview exists
              <div className="mb-2">
                <Image 
                  src={imagePreviews.about_image} 
                  alt="About Image" 
                  width={300} 
                  height={200} 
                  className="rounded-md mb-4" 
                />
                <div className="flex gap-2 mt-2"> {/* Flex container for icons */}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage('about_image')} 
                    className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                  >
                   Replace Image {/* Trash icon without margin */}
                  </button>
                 
                  
                </div>
              </div>
            ) : ( // No image box
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer ${imageUploadActive.bg_image ? '' : 'opacity-50 cursor-not-allowed'}`} 
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
              onChange={(e) => handleImageChange(e, 'bg_image')} 
              ref={fileInputRefs.bg_image} 
              className="hidden" 
            />
          </div>
          <div className="mb-4"> {/* About Title Input */}
            <label className="block mb-2 text-gray-500 font-semibold">About Title</label>
            <ReactQuill
              value={editAbout.about_title}
              onChange={(content) =>
                handleQuillChange(content, "about_title")
              }
              
            /> {/* About Title input */}
          </div>
          <div className="mb-4"> {/* About Heading Input */}
            <label className="block mb-2 text-gray-500 font-semibold">About Heading</label>
            <ReactQuill
              value={editAbout.about_heading}
              onChange={(content) =>
                handleQuillChange(content, "about_heading")
              }
              
            /> {/* About Heading input */}
          </div>
          <div className="mb-4"> {/* About Content Input */}
            <label className="block mb-2 text-gray-500 font-semibold  ">About Content</label>
            <ReactQuill
              value={editAbout.about_content}
              onChange={(content) =>
                handleQuillChange(content, "about_content")
              }
              
            />{/* About Content input */}
          </div>
          <div className="mb-4"> {/* MV Title Input */}
            <label className="block mb-2 text-gray-500 font-semibold  ">MV Title</label>
            <ReactQuill
              value={editAbout.mv_title}
              onChange={(content) =>
                handleQuillChange(content, "mv_title")
              }
              
            />{/* MV Title input */}
          </div>
          <div className="mb-4"> {/* MV Heading Input */}
            <label className="block mb-2 text-gray-500 font-semibold">MV Image</label>
            {imagePreviews.mv_image ? ( // Check if the background image preview exists
              <div className="mb-2">
                <Image 
                  src={imagePreviews.mv_image} 
                  alt="MV Image" 
                  width={300} 
                  height={200} 
                  className="rounded-md mb-4" 
                />
                <div className="flex gap-2 mt-2"> {/* Flex container for icons */}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage('mv_image')} 
                    className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                  >
                   Replace Image {/* Trash icon without margin */}
                  </button>
                 
                  
                </div>
              </div>
            ) : ( // No image box
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer ${imageUploadActive.bg_image ? '' : 'opacity-50 cursor-not-allowed'}`} 
                onClick={() => imageUploadActive.mv_image && fileInputRefs.mv_image.current?.click()} // Clickable area
              >
                <span className="text-gray-700">Upload Image</span>
                <button 
                  type="button" 
                  className="flex items-center px-3 py-2 text-gray-700 rounded ml-2" // Added margin-left for spacing
                  disabled={!imageUploadActive.mv_image}
                >
                  <FontAwesomeIcon icon={faFileUpload} /> {/* File upload icon without margin */}
                </button>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageChange(e, 'mv_image')} 
              ref={fileInputRefs.mv_image} 
              className="hidden" 
            />
          </div>

          <div className="mb-4"> {/* TC Title Input */}
            <label className="block mb-2 text-gray-500 font-semibold">TC Title</label>
            <ReactQuill
              value={editAbout.tc_title}
              onChange={(content) =>
                handleQuillChange(content, "tc_title")
              }
              
            />{/* TC Title input */}
          </div>
          <div className="mb-4"> {/* TC Heading Input */}
            <label className="block mb-1">TC Heading</label>
            <ReactQuill
              value={editAbout.tc_heading}
              onChange={(content) =>
                handleQuillChange(content, "tc_heading")
              }
              
            /> {/* TC Heading input */}
          </div>
          <div className="mb-4"> {/* TC Content Input */}
            <label className="block mb-2 text-gray-500 font-semibold">TC Content</label>
            <ReactQuill
              value={editAbout.tc_content}
              onChange={(content) =>
                handleQuillChange(content, "tc_content")
              }
              
            /> {/* TC Content input */}
          </div>
          
          <div className="mb-4"> {/* TC Image Display */}
          <label className="block mb-2 text-gray-500 font-semibold">TC Image</label>
            {imagePreviews.tc_image ? ( // Check if the background image preview exists
              <div className="mb-2">
                <Image 
                  src={imagePreviews.tc_image} 
                  alt="TC Image" 
                  width={300} 
                  height={200} 
                  className="rounded-md mb-4" 
                />
                <div className="flex gap-2 mt-2"> {/* Flex container for icons */}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage('tc_image')} 
                    className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                  >
                   Replace Image {/* Trash icon without margin */}
                  </button>
                 
                  
                </div>
              </div>
            ) : ( // No image box
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer ${imageUploadActive.tc_image ? '' : 'opacity-50 cursor-not-allowed'}`} 
                onClick={() => imageUploadActive.tc_image && fileInputRefs.tc_image.current?.click()} // Clickable area
              >
                <span className="text-gray-700">Upload Image</span>
                <button 
                  type="button" 
                  className="flex items-center px-3 py-2 text-gray-700 rounded ml-2" // Added margin-left for spacing
                  disabled={!imageUploadActive.tc_image}
                >
                  <FontAwesomeIcon icon={faFileUpload} /> {/* File upload icon without margin */}
                </button>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageChange(e, 'tc_image')} 
              ref={fileInputRefs.tc_image} 
              className="hidden" 
            />
          </div>

          <div className="mb-4  pb-4"> {/* Review Heading Input */}
            <label className="block mb-2 text-gray-500 font-semibold">Review Heading</label>
            <ReactQuill
              value={editAbout.review_heading}
              onChange={(content) =>
                handleQuillChange(content, "review_heading")
              }
              
            />{/* Review Heading input */}
          </div>
          <button type="submit" className={`w-20 mr-2 px-4 py-2 bg-[#609641] text-white rounded-md ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''} mt-4 mb-8`} disabled={!isDirty}>Update</button> {/* Update button */}
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded-md mt-4 mb-8">Cancel</button> {/* Cancel button */}
        </form>
      )}
    </div>
  );
};

export default EditAboutPage;