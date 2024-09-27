
"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const EditAbout_ReviewPage: React.FC = () => {
  const { id } = useParams(); // Get the ID from the URL parameters

  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchReviewDetails = async () => {
      if (id) {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('about_review')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching review details:', error);
          setError('Review not found');
        } else {
          // Log the fetched data for debugging
          console.log('Fetched review data:', data);
          setName(data.name);
          setDesignation(data.designation);
          setComments(data.comments);
          setRating(data.rating);
          setImagePreview(data.profile_image);
        }
        setIsLoading(false);
      }
    };

    fetchReviewDetails();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setRemoveExistingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    setRemoveExistingImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File) => {
    const { data, error } = await supabase.storage
      .from('profile-images') // Change to your storage bucket
      .upload(`public/${file.name}`, file);

    if (error) {
      throw error;
    }

    const { data: publicUrl } = supabase.storage
      .from('profile-images')
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  };

  const updateReview = async () => {
    const { data, error } = await supabase
      .from('about_review')
      .update({
        name,
        designation,
        profile_image: removeExistingImage ? null : imagePreview,
        comments,
        rating
      })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return data;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let imageUrl = removeExistingImage ? null : imagePreview;

      if (profileImage) {
        imageUrl = await uploadImage(profileImage);
      }

      await updateReview();
      
      alert('Review updated successfully!');
      window.location.reload(); // Refresh the page to show updated content
    } catch (error) {
      console.error('Error updating review:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
      <div className="col-span-12 xl:col-span-8">
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          {/* Designation Input */}
          <div className="mb-4">
            <label htmlFor="designation" className="block mb-2">Designation</label>
            <input
              id="designation"
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Enter your designation"
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label htmlFor="profile-image" className="block mb-2">Profile Image</label>
            <input
              type="file"
              id="profile-image"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
            >
              Choose Image
            </button>
            {(imagePreview || profileImage) && (
              <button 
                type="button"
                onClick={handleRemoveImage}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Remove Image
              </button>
            )}
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="max-w-xs" />
              </div>
            )}
          </div>

          {/* Comments Input */}
          <div className="mb-4">
            <label htmlFor="comments" className="block mb-2">Comments</label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Write your comments here..."
              rows={4}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          {/* Rating Input */}
          <div className="mb-4">
            <label htmlFor="rating" className="block mb-2">Rating</label>
            <input 
              type="number"
              id="rating"
              value={rating || ''}
              onChange={(e) => setRating(Number(e.target.value))}
              placeholder="Enter your rating (1-5)"
              min="1" max="5"
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          {/* Update Button */}
          <button 
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAbout_ReviewPage;