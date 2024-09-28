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

type EditAboutReviewPageProps = {
  setIsEditReview: (isEdit: boolean) => void; // Function to set edit state
  reviewId: string; // ID of the review to edit
  setReviewData: (data: any) => void; // Function to update the review data in the parent component
};

const EditAboutReviewPage = ({ 
  setIsEditReview, 
  reviewId,
  setReviewData // Add this prop to update the review data in the parent component
}: EditAboutReviewPageProps) => {
  const [reviewData, setReviewDataLocal] = useState<any>(null);
  const [editReview, setEditReview] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchReviewData = async () => {
      const { data, error } = await supabase
        .from('about_review')
        .select('*')
        .eq('id', reviewId)
        .single();

      if (error) {
        console.error('Error fetching review data:', error);
        return;
      }

      setReviewDataLocal(data);
      setEditReview(data);
      setImagePreview(data.profile_image);
    };

    fetchReviewData();
  }, [reviewId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditReview({ ...editReview, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsDirty(true);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setEditReview({ ...editReview, profile_image: null });
    setIsDirty(true);
  };

  const handleUpdate = async () => {
    let imageUrl = editReview.profile_image; // Default to existing image

    if (image) {
      // Upload new image if selected
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(`public/${image.name}`, image);

      if (error) {
        console.error('Error uploading image:', error);
        return;
      }

      const { data: publicData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path);

      imageUrl = publicData.publicUrl; // Update imageUrl to new image URL
    } else if (editReview.profile_image === null) {
      // If the image was removed, set imageUrl to null
      imageUrl = null;
    }

    const { error } = await supabase
      .from('about_review')
      .update({ ...editReview, profile_image: imageUrl })
      .eq('id', editReview.id);

    if (error) {
      console.error('Error updating review:', error);
    } else {
      setReviewData((prevData: any) => prevData.map((review: any) => review.id === editReview.id ? { ...editReview, profile_image: imageUrl } : review)); // Update local state
      setIsEditReview(false); // Exit edit mode
    }
  };

  const handleCancel = () => {
    setIsEditReview(false);
  };

  const handleBack = () => {
    setIsEditReview(false);
  };

  if (!reviewData) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleBack} className="top-4 left-4 flex items-center w-20 px-4 py-2 bg-gray-500 text-white rounded">
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back
      </button>
      {editReview && (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="px-30">
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="name" 
              value={editReview.name} 
              onChange={handleChange} 
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Designation</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="designation" 
              value={editReview.designation} 
              onChange={handleChange} 
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Profile Image</label>
            {imagePreview && (
              <div className="relative mb-2">
                <Image 
                  src={imagePreview} 
                  alt="Profile Image" 
                  width={150} 
                  height={100} 
                  className="rounded-md" 
                />
                <button 
                  type="button" 
                  onClick={handleRemoveImage} 
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Remove Image
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
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Choose Image
            </button>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Comments</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="comments" 
              value={editReview.comments} 
              onChange={handleChange} 
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Rating</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 border rounded" 
              name="rating" 
              value={editReview.rating} 
              onChange={handleChange} 
              min="1" max="5" 
              required
            />
          </div>
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
          <button type="submit" className={`w-20 px-4 py-2 bg-blue-500 text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isDirty}>Update</button>
        </form>
      )}
    </div>
  );
};

export default EditAboutReviewPage;