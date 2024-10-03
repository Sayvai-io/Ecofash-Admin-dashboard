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

type EditBlogPageProps = {
  setIsEditBlog: (isEdit: boolean) => void; // Function to set edit state
  blogId: string; // ID of the blog to edit
  setBlogData: (data: any) => void; // This should be a function
};

const EditBlogPage = ({ 
  setIsEditBlog, 
  blogId,
  setBlogData = () => {} // Default to a no-op function
}: EditBlogPageProps) => {
  const [blogData, setBlogDataLocal] = useState<any>(null);
  const [editBlog, setEditBlog] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploadActive, setImageUploadActive] = useState<{ [key: string]: boolean }>({
    image_url: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', blogId)
        .single();

      if (error) {
        console.error('Error fetching blog data:', error);
        return;
      }

      setBlogDataLocal(data);
      setEditBlog(data);
      setImagePreview(data.image_url);
    };

    fetchBlogData();
  }, [blogId]);

  const handleQuillChange = (value: string, field: string) => {
    setEditBlog((prevEditBlog: any) => ({ ...prevEditBlog, [field]: value }));
    setIsDirty(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditBlog({ ...editBlog, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsDirty(true);
      setImageUploadActive({ ...imageUploadActive, image_url: true });
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setEditBlog({ ...editBlog, image_url: null });
    setIsDirty(true);
    setImageUploadActive({ ...imageUploadActive, image_url: false });
  };

  const handleUpdate = async () => {
    if (typeof setBlogData !== 'function') {
        console.error('setBlogData is not a function');
        return;
    }

    let updatedBlog = { ...editBlog };
    let imageUrl = editBlog.image_url;

    if (image) {
      const uniqueFileName = `${Date.now()}_${image.name}`;
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(`public/${uniqueFileName}`, image);

      if (error) {
        if (error.message === "The resource already exists") {
          console.error('Image already exists. Please choose a different image.');
          return;
        }
        console.error('Error uploading image:', error);
        return;
      }

      const { data: publicData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path);
      imageUrl = publicData.publicUrl;
    } else if (editBlog.image_url === null) {
      imageUrl = null;
    }

    updatedBlog.image_url = imageUrl;

    const { error } = await supabase
      .from('blogs')
      .update(updatedBlog)
      .eq('id', blogId);

    if (error) {
      console.error('Error updating blog:', error);
    } else {
      setBlogData((prevData: any) => 
        prevData.map((blog: any) => blog.id === updatedBlog.id ? updatedBlog : blog)
      );
      setIsEditBlog(false);
    }
  };

  const handleCancel = () => {
    setIsEditBlog(false);
  };

  const handleBack = () => {
    setIsEditBlog(false);
  };

  if (!blogData) return <div>Loading...</div>;

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-8 border-b pt-4 pb-4 mb-4">
        <button onClick={handleBack} className="flex items-center mb-2 w-8 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white"> 
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        </button>
        <h1 className="text-black text-2xl font-bold mb-2">Edit Blog</h1>
      </div>
      {editBlog && (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="px-20">
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Title</label>
            <ReactQuill
              value={editBlog.title}
              onChange={(content) => handleQuillChange(content, "title")}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Content</label>
            <ReactQuill
              value={editBlog.content}
              onChange={(content) => handleQuillChange(content, "content")}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Tags</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border rounded" 
              name="tags" 
              value={editBlog.tags} 
              onChange={handleChange} 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Image</label>
            {imagePreview ? (
              <div className="mb-2">
                <Image 
                  src={imagePreview} 
                  alt="Blog Image" 
                  width={150} 
                  height={100} 
                  className="rounded-md mb-4" 
                />
                <div className="flex gap-2 mt-2">
                  <button 
                    type="button" 
                    onClick={handleRemoveImage} 
                    className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                  >
                   Replace Image
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer`} 
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-gray-700">Upload Image</span>
                <button 
                  type="button" 
                  className="flex items-center px-3 py-2 text-gray-700 rounded ml-2"
                >
                  <FontAwesomeIcon icon={faFileUpload} />
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
          <button type="submit" className={`w-20 px-4 py-2 bg-[#609641] text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''} mt-4 mb-8`} disabled={!isDirty}>Update</button>
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded mt-4 mb-8">Cancel</button>
        </form>
      )}
    </div>
  );
};

export default EditBlogPage;