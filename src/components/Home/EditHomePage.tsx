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

type EditHomeProps = {
  setIsEditHome: (isEdit: boolean) => void;
  setHomeData: (data: any) => void;
};

const EditHome = ({ 
  setIsEditHome, 
  setHomeData 
}: EditHomeProps) => {
  const [homeDataLocal, setHomeDataLocal] = useState<any>(null);
  const [editHome, setEditHome] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [images, setImages] = useState<{ [key: string]: File | null }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string | null }>({});
  
  const fileInputRefs = {
    head_image: useRef<HTMLInputElement>(null),
    about_image: useRef<HTMLInputElement>(null),
    contact_image: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      const { data, error } = await supabase
        .from('home')
        .select('*');

      if (error) {
        console.error('Error fetching home data:', error);
        return;
      }

      setHomeDataLocal(data);
      if (data && data.length > 0) {
        setEditHome(data[0]);
        setImagePreviews({
          head_image: data[0].head_image,
          about_image: data[0].about_image,
          contact_image: data[0].contact_image,
        });
      }
    };

    fetchHomeData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditHome({ ...editHome, [e.target.name]: e.target.value });
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
    setEditHome({ ...editHome, [field]: null });
    setIsDirty(true);
  };

  const handleUpdateHome = async () => {
    let updatedHome = { ...editHome };

    for (const field of ['head_image', 'about_image', 'contact_image']) {
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

        updatedHome[field] = publicURL; // Update the URL in the updatedHome object
      }
    }

    // Update the home data in the database
    const { error } = await supabase
      .from('home')
      .update(updatedHome)
      .eq('id', editHome.id);

    if (error) {
      console.error('Error updating home:', error);
      alert('Failed to update home data. Please try again.');
    } else {
      setHomeData((prevData: any) => prevData.map((home: any) => home.id === editHome.id ? updatedHome : home));
      setIsEditHome(false);
      setIsDirty(false);
    }
  };

  const handleCancel = () => {
    setIsEditHome(false);
  };

  const handleBack = () => {
    setIsEditHome(false);
  };

  if (!homeDataLocal) return <div>Loading...</div>;

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-8 border-b pt-4 pb-4 mb-4">
        <button onClick={handleBack} className="flex items-center mb-2 w-8 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white"> 
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        </button>
        <h1 className="text-black text-2xl font-bold mb-2">Edit Home</h1>
      </div>
      {editHome && (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateHome(); }} className="px-15">
          {/* Heading Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="heading" 
              value={editHome.heading} 
              onChange={handleChange} 
            />
          </div>

          {/* Head Content Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Head Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="head_content" 
              value={editHome.head_content} 
              onChange={handleChange} 
            />
          </div>

          {/* Head Image Display */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Head Image</label>
            {imagePreviews.head_image ? (
              <div className="mb-2">
                <Image 
                  src={imagePreviews.head_image} 
                  alt="Head Image" 
                  width={300} 
                  height={200} 
                  className="rounded-md mb-4" 
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage('head_image')} 
                  className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                >
                  Replace Image
                </button>
              </div>
            ) : (
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer`} 
                onClick={() => fileInputRefs.head_image.current?.click()}
              >
                <span className="text-gray-700">Upload Image</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageChange(e, 'head_image')} 
              ref={fileInputRefs.head_image} 
              className="hidden" 
            />
          </div>

          {/* About Title Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">About Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="about_title" 
              value={editHome.about_title} 
              onChange={handleChange} 
            />
          </div>

          {/* About Heading Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">About Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="about_heading" 
              value={editHome.about_heading} 
              onChange={handleChange} 
            />
          </div>

          {/* About Content Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">About Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="about_content" 
              value={editHome.about_content} 
              onChange={handleChange} 
            />
          </div>

          {/* About Image Display */}
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

          {/* Service Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Service</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="service" 
              value={editHome.service} 
              onChange={handleChange} 
            />
          </div>

          {/* Contact Heading Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Contact Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="contact_heading" 
              value={editHome.contact_heading} 
              onChange={handleChange} 
            />
          </div>

          {/* Contact Content Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Contact Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="contact_content" 
              value={editHome.contact_content} 
              onChange={handleChange} 
            />
          </div>

          {/* Contact Image Display */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Contact Image</label>
            {imagePreviews.contact_image ? (
              <div className="mb-2">
                <Image 
                  src={imagePreviews.contact_image} 
                  alt="Contact Image" 
                  width={300} 
                  height={200} 
                  className="rounded-md mb-4" 
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage('contact_image')} 
                  className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                >
                  Replace Image
                </button>
              </div>
            ) : (
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer`} 
                onClick={() => fileInputRefs.contact_image.current?.click()}
              >
                <span className="text-gray-700">Upload Image</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageChange(e, 'contact_image')} 
              ref={fileInputRefs.contact_image} 
              className="hidden" 
            />
          </div>

          <button type="submit" className={`w-20 px-4 py-2 bg-[#609641] text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isDirty}>Update</button>
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded mt-4">Cancel</button>
        </form>
      )}
    </div>
  );
};

export default EditHome;