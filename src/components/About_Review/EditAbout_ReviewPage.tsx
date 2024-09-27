"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router'; // Import useRouter
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import left arrow icon
import Image from 'next/image'; // Import Image for displaying images

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type EditAboutReviewPageProps = {
  setIsEditReview: (isEdit: boolean) => void; // Function to set edit state
  reviewId: string; // ID of the review to edit
};

const EditAboutReviewPage = ({ 
  setIsEditReview, 
  reviewId 
}: EditAboutReviewPageProps) => {
  const [reviewData, setReviewData] = useState<any>(null); // Initialize reviewData as null
  const [editReview, setEditReview] = useState<any>(null); // State for the review being edited
  const [isDirty, setIsDirty] = useState(false); // Track if the form is dirty
  const [image, setImage] = useState<File | null>(null); // State for the selected image
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference for file input

  useEffect(() => {
    const fetchReviewData = async () => {
      const { data, error } = await supabase
        .from('about_review') // Fetch from the about_review table
        .select('*')
        .eq('id', reviewId) // Fetch the specific review by ID
        .single(); // Get a single record

      if (error) {
        console.error('Error fetching review data:', error);
        return;
      }

      setReviewData(data); // Set the fetched data
      setEditReview(data); // Set the review for editing
      setImagePreview(data.profile_image); // Set the image preview from fetched data
    };

    fetchReviewData(); // Call the fetch function
  }, [reviewId]); // Run effect when reviewId changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditReview({ ...editReview, [e.target.name]: e.target.value }); // Update the editReview state
    setIsDirty(true); // Mark the form as dirty
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file); // Set the selected image
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL for the image
      setIsDirty(true); // Mark the form as dirty
    }
  };

  const handleRemoveImage = () => {
    setImage(null); // Clear the image state
    setImagePreview(null); // Clear the image preview
    setEditReview({ ...editReview, profile_image: null }); // Update editReview to remove image
    setIsDirty(true); // Mark the form as dirty
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

      const { data: publicUrl } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path);

      imageUrl = publicUrl.publicUrl; // Update imageUrl to new image URL
    } else if (editReview.profile_image === null) {
      // If the image was removed, set imageUrl to null
      imageUrl = null;
    }

    const { error } = await supabase
      .from('about_review') // Update the about_review table
      .update({ ...editReview, profile_image: imageUrl }) // Include updated review data
      .eq('id', editReview.id); // Match by ID

    if (error) {
      console.error('Error updating review:', error);
    } else {
      setIsEditReview(false); // Exit edit mode
    }
  };

  const handleCancel = () => {
    setIsEditReview(false); // Exit edit mode
  };

  const handleBack = () => {
    setIsEditReview(false); // Navigate back to the previous state
  };

  if (!reviewData) return <div>Loading...</div>; // Show loading state

  return (
    <div>
      <button onClick={handleBack} className="top-4 left-4 flex items-center w-20 px-4 py-2 bg-gray-500 text-white rounded"> {/* Back button */}
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> {/* Left arrow icon */}
        Back
      </button>
      {editReview && ( // Display the form for the review
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="px-30"> {/* Add padding left and right */}
          <div className="mb-4"> {/* Name Input */}
            <label className="block mb-1">Name</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="name" 
              value={editReview.name} 
              onChange={handleChange} 
              required
            /> {/* Name input */}
          </div>
          <div className="mb-4"> {/* Designation Input */}
            <label className="block mb-1">Designation</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="designation" 
              value={editReview.designation} 
              onChange={handleChange} 
              required
            /> {/* Designation input */}
          </div>
          <div className="mb-4"> {/* Profile Image Display */}
            <label className="block mb-1">Profile Image</label>
            {imagePreview && ( // Check if the image preview exists
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
          <div className="mb-4"> {/* Comments Input */}
            <label className="block mb-1">Comments</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="comments" 
              value={editReview.comments} 
              onChange={handleChange} 
              required
            /> {/* Comments input */}
          </div>
          <div className="mb-4"> {/* Rating Input */}
            <label className="block mb-1">Rating</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 border rounded" 
              name="rating" 
              value={editReview.rating} 
              onChange={handleChange} 
              min="1" max="5" // Assuming rating is between 1 and 5
              required
            /> {/* Rating input */}
          </div>
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button> {/* Cancel button */}
          <button type="submit" className={`w-20 px-4 py-2 bg-blue-500 text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isDirty}>Update</button> {/* Update button */}
        </form>
      )}
    </div>
  ); // Only display the form when editing
};


export default EditAboutReviewPage;
