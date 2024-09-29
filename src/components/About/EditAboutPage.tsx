"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AboutPagePreviewProps = {
  setIsEditAbout: (isEdit: boolean) => void;
  setAboutData: (data: any) => void;
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

        updatedAbout[field] = publicURL; // Update the URL in the updatedAbout object
      }
    }

    // Update the about data in the database
    const { error } = await supabase
      .from('about')
      .update(updatedAbout)
      .eq('id', editAbout.id);

    if (error) {
      console.error('Error updating about:', error);
      alert('Failed to update about data. Please try again.');
    } else {
      setAboutData((prevData: any) => prevData.map((about: any) => about.id === editAbout.id ? updatedAbout : about));
      setIsEditAbout(false);
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
    <div className="bg-white border rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-8 border-b pt-4 pb-4 mb-4">
        <button onClick={handleBack} className="flex items-center mb-2 w-8 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white"> 
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        </button>
        <h1 className="text-black text-2xl font-bold mb-2">Edit About Page</h1>
      </div>
      {editAbout && (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateAbout(); }} className="px-15">
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="title" 
              value={editAbout.title} 
              onChange={handleChange} 
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

          {/* About Title Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">About Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="about_title" 
              value={editAbout.about_title} 
              onChange={handleChange} 
            />
          </div>

          {/* About Heading Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">About Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="about_heading" 
              value={editAbout.about_heading} 
              onChange={handleChange} 
            />
          </div>

          {/* About Content Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">About Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="about_content" 
              value={editAbout.about_content} 
              onChange={handleChange} 
            />
          </div>

          {/* About Image Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">About Image</label>
            {imagePreviews.about_image ? (
              <div className="mb-2">
                <Image 
                  src={imagePreviews.about_image} 
                  alt="About Image" 
                  width={300} 
                  height={200} 
                  className="rounded-md mb-4" 
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage('about_image')} 
                  className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                >
                  Replace Image
                </button>
              </div>
            ) : (
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer`} 
                onClick={() => fileInputRefs.about_image.current?.click()}
              >
                <span className="text-gray-700">Upload Image</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageChange(e, 'about_image')} 
              ref={fileInputRefs.about_image} 
              className="hidden" 
            />
          </div>

          {/* MV Title Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">MV Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="mv_title" 
              value={editAbout.mv_title} 
              onChange={handleChange} 
            />
          </div>

          {/* MV Heading Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">MV Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="mv_heading" 
              value={editAbout.mv_heading} 
              onChange={handleChange} 
            />
          </div>

          {/* MV Content Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">MV Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="mv_content" 
              value={editAbout.mv_content} 
              onChange={handleChange} 
            />
          </div>

          {/* MV Image Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">MV Image</label>
            {imagePreviews.mv_image ? (
              <div className="mb-2">
                <Image 
                  src={imagePreviews.mv_image} 
                  alt="MV Image" 
                  width={300} 
                  height={200} 
                  className="rounded-md mb-4" 
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage('mv_image')} 
                  className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                >
                  Replace Image
                </button>
              </div>
            ) : (
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer`} 
                onClick={() => fileInputRefs.mv_image.current?.click()}
              >
                <span className="text-gray-700">Upload Image</span>
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

          {/* TC Title Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">TC Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="tc_title" 
              value={editAbout.tc_title} 
              onChange={handleChange} 
            />
          </div>

          {/* TC Heading Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">TC Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="tc_heading" 
              value={editAbout.tc_heading} 
              onChange={handleChange} 
            />
          </div>

          {/* TC Content Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">TC Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="tc_content" 
              value={editAbout.tc_content} 
              onChange={handleChange} 
            />
          </div>

          {/* TC Image Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">TC Image</label>
            {imagePreviews.tc_image ? (
              <div className="mb-2">
                <Image 
                  src={imagePreviews.tc_image} 
                  alt="TC Image" 
                  width={300} 
                  height={200} 
                  className="rounded-md mb-4" 
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage('tc_image')} 
                  className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                >
                  Replace Image
                </button>
              </div>
            ) : (
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer`} 
                onClick={() => fileInputRefs.tc_image.current?.click()}
              >
                <span className="text-gray-700">Upload Image</span>
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

          {/* Review Heading Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Review Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="review_heading" 
              value={editAbout.review_heading} 
              onChange={handleChange} 
            />
          </div>

          <button type="submit" className={`w-20 px-4 py-2 bg-[#609641] text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''} mt-4 mb-8`} disabled={!isDirty}>Update</button> {/* Update button */}
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded mt-4 mb-8">Cancel</button>
        </form>
      )}
    </div>
  );
};

export default EditAboutPage;