"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

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
    }
  };

  const handleRemoveImage = (field: string) => {
    setImages({ ...images, [field]: null });
    setImagePreviews({ ...imagePreviews, [field]: null });
    setEditAbout({ ...editAbout, [field]: null });
    setIsDirty(true);
  };

  const handleUpdateAbout = async () => {
    let updatedAbout = { ...editAbout };

    for (const field of ['bg_image', 'about_image', 'mv_image', 'tc_image']) {
      if (images[field]) {
        const { data, error } = await supabase.storage
          .from('blog-images')
          .upload(`public/${images[field].name}`, images[field]);

        if (error) {
          console.error(`Error uploading ${field}:`, error);
          return;
        }

        const { data: publicData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(data.path);
        const publicURL = publicData.publicUrl;

        updatedAbout[field] = publicURL;
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
    <div>
      <button onClick={handleBack} className="top-4 left-4 flex items-center w-20 px-4 py-2 bg-gray-500 text-white rounded">
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back
      </button>
      {editAbout && (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateAbout(); }} className="px-30">
          <div className="mb-4">
            <label className="block mb-1">Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="title" 
              value={editAbout.title} 
              onChange={handleChange} 
            /> {/* Title input */}
          </div>
          <div className="mb-4"> {/* Background Image Display */}
            <label className="block mb-1">Background Image</label>
            {imagePreviews.bg_image && ( // Check if the background image preview exists
              <div className="relative mb-2">
                <Image 
                  src={imagePreviews.bg_image} 
                  alt="Background Image" 
                  width={150} 
                  height={100} 
                  className="rounded-md" 
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage('bg_image')} 
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Remove Image
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
            <button 
              type="button" 
              onClick={() => fileInputRefs.bg_image.current?.click()} 
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Choose Background Image
            </button>
          </div>
          <div className="mb-4"> {/* About Image Display */}
            <label className="block mb-1">About Image</label>
            {imagePreviews.about_image && ( // Check if the image preview exists
              <div className="relative mb-2">
                <Image 
                  src={imagePreviews.about_image} 
                  alt="About Image" 
                  width={150} 
                  height={100} 
                  className="rounded-md" 
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage('about_image')} 
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Remove Image
                </button>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageChange(e, 'about_image')} 
              ref={fileInputRefs.about_image} 
              className="hidden" 
            />
            <button 
              type="button" 
              onClick={() => fileInputRefs.about_image.current?.click()} 
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Choose Image
            </button>
          </div>
          <div className="mb-4"> {/* About Title Input */}
            <label className="block mb-1">About Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="about_title" 
              value={editAbout.about_title} 
              onChange={handleChange} 
            /> {/* About Title input */}
          </div>
          <div className="mb-4"> {/* About Heading Input */}
            <label className="block mb-1">About Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="about_heading" 
              value={editAbout.about_heading} 
              onChange={handleChange} 
            /> {/* About Heading input */}
          </div>
          <div className="mb-4"> {/* About Content Input */}
            <label className="block mb-1">About Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="about_content" 
              value={editAbout.about_content} 
              onChange={handleChange} 
            /> {/* About Content input */}
          </div>
          <div className="mb-4"> {/* MV Title Input */}
            <label className="block mb-1">MV Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="mv_title" 
              value={editAbout.mv_title} 
              onChange={handleChange} 
            /> {/* MV Title input */}
          </div>
          <div className="mb-4"> {/* MV Heading Input */}
            <label className="block mb-1">MV Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="mv_heading" 
              value={editAbout.mv_heading} 
              onChange={handleChange} 
            /> {/* MV Heading input */}
          </div>
          <div className="mb-4"> {/* MV Content Input */}
            <label className="block mb-1">MV Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="mv_content" 
              value={editAbout.mv_content} 
              onChange={handleChange} 
            /> {/* MV Content input */}
          </div>
          <div className="mb-4"> {/* MV Image Display */}
            <label className="block mb-1">MV Image</label>
            {imagePreviews.mv_image && ( // Check if the image preview exists
              <div className="relative mb-2">
                <Image 
                  src={imagePreviews.mv_image} 
                  alt="MV Image" 
                  width={150} 
                  height={100} 
                  className="rounded-md" 
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage('mv_image')} 
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Remove Image
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
            <button 
              type="button" 
              onClick={() => fileInputRefs.mv_image.current?.click()} 
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Choose Image
            </button>
          </div>
          <div className="mb-4"> {/* TC Title Input */}
            <label className="block mb-1">TC Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="tc_title" 
              value={editAbout.tc_title} 
              onChange={handleChange} 
            /> {/* TC Title input */}
          </div>
          <div className="mb-4"> {/* TC Heading Input */}
            <label className="block mb-1">TC Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="tc_heading" 
              value={editAbout.tc_heading} 
              onChange={handleChange} 
            /> {/* TC Heading input */}
          </div>
          <div className="mb-4"> {/* TC Content Input */}
            <label className="block mb-1">TC Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="tc_content" 
              value={editAbout.tc_content} 
              onChange={handleChange} 
            /> {/* TC Content input */}
          </div>
          <div className="mb-4"> {/* TC Image Display */}
            <label className="block mb-1">TC Image</label>
            {imagePreviews.tc_image && ( // Check if the image preview exists
              <div className="relative mb-2">
                <Image 
                  src={imagePreviews.tc_image} 
                  alt="TC Image" 
                  width={150} 
                  height={100} 
                  className="rounded-md" 
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage('tc_image')} 
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Remove Image
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
            <button 
              type="button" 
              onClick={() => fileInputRefs.tc_image.current?.click()} 
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Choose Image
            </button>
          </div>
          <div className="mb-4"> {/* Review Heading Input */}
            <label className="block mb-1">Review Heading</label>
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
  );
};

export default EditAboutPage;