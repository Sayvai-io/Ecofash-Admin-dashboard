"use client";
import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type EditContact_Address_PageProps = {
  setIsEditReview: (isEdit: boolean) => void; // Function to set edit state
  reviewId: string; // ID of the review to edit
  setReviewData: (data: any) => void; // This should be a function
};

const EditContact_Address_Page = ({ 
  setIsEditReview, 
  reviewId,
  setReviewData = () => {} // Default to a no-op function
}: EditContact_Address_PageProps) => {
  const [reviewData, setReviewDataLocal] = useState<any>(null);
  const [editReview, setEditReview] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [countryName, setCountryName] = useState<string | null>(null); // State for country name

  useEffect(() => {
    const fetchReviewData = async () => {
      const { data, error } = await supabase
        .from('address') // Fetch from address table
        .select('full_address, email, contact_no, country_name') // Select necessary fields
        .eq('id', reviewId) // Assuming reviewId corresponds to address ID
        .single();

      if (error) {
        console.error('Error fetching address data:', error);
        return;
      }

      setReviewDataLocal(data);
      setEditReview(data);
      setCountryName(data.country_name); // Set country name
    };

    fetchReviewData();
  }, [reviewId]);

  const handleQuillChange = (value: string, field: string) => {
    setEditReview((prevEditReview: any) => ({ ...prevEditReview, [field]: value })); // Specify type for prevEditAbout
    setIsDirty(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditReview({ ...editReview, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleUpdate = async () => {
    // Check if setReviewData is a function
    if (typeof setReviewData !== 'function') {
        console.error('setReviewData is not a function');
        return;
    }

    let updatedReview = { ...editReview };
    updatedReview.country_name = countryName; // Include country name in update

    const { error } = await supabase
      .from('address') // Update address table
      .update(updatedReview)
      .eq('id', reviewId); // Ensure you are using reviewId here

    if (error) {
      console.error('Error updating review:', error);
    } else {
      setReviewData((prevData: any) => 
        prevData.map((review: any) => review.id === updatedReview.id ? updatedReview : review)
      ); // Update local state
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
    <div className="bg-white border rounded-lg shadow-lg p-6"> {/* Added classes for styling */}
      <div className="flex items-center gap-8 border-b pt-4 pb-4 mb-4"> {/* Added flex container with gap */}
        <button onClick={handleBack} className="flex items-center mb-2 w-8 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white"> 
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        </button>
        <h1 className="text-black text-2xl font-bold mb-2">Edit About Page</h1> {/* Removed margin-top since gap is applied */}
      </div>
      {editReview && (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="px-20">
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Name</label>
            <ReactQuill
              value={editReview.name}
              onChange={(content) =>
                handleQuillChange(content, "name")
              }
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Designation</label>
            <ReactQuill
              value={editReview.designation}
              onChange={(content) =>
                handleQuillChange(content, "designation")
              }
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Comments</label>
            <ReactQuill
              value={editReview.comments}
              onChange={(content) =>
                handleQuillChange(content, "comments")
              }
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Rating</label>
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
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Country</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border rounded" 
              value={countryName || ''} 
              onChange={(e) => setCountryName(e.target.value)} // Handle country name change
              required
            />
          </div>
          <button type="submit" className={`w-20 px-4 py-2 bg-[#609641] text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''} mt-4 mb-8`} disabled={!isDirty}>Update</button> {/* Update button */}
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded mt-4 mb-8">Cancel</button>
        </form>
      )}
    </div>
  );
};

export default EditContact_Address_Page;