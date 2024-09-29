"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import supabase from "@/utils/supabaseClient";
import { FaEllipsisV, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

type ReviewPagePreview = {
  setIsEditReview: (isEdit: boolean) => void;
  setReviewId: (isReview: any) => void;
  reviewData?: any[];
  onDelete: (id: string) => void;
  onEdit: (contact: any) => void;
  onAddReviewToggle: () => void;
};

const About_ReviewPagePreview = ({ 
  setIsEditReview,
  setReviewId,
  reviewData,
  onDelete,
  onEdit,
  onAddReviewToggle // Pass the toggle function
}: ReviewPagePreview) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false); // State to manage Add Review form visibility

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("about_review") // Change to your table name
        .select("*");

      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        setReviews(data);
      }
      setLoading(false);
    };

    fetchReviews();
  }, []);

  const handleDelete = async () => {
    if (selectedReviewId) {
      const { error } = await supabase
        .from("about_review") // Change to your table name
        .delete()
        .eq("id", selectedReviewId);

      if (error) {
        console.error("Error deleting review:", error);
      } else {
        setReviews(reviews.filter(review => review.id !== selectedReviewId));
      }
      setIsModalOpen(false);
    }
  };



  const handleAddReviewSubmit = (newReview: any) => {
    setReviews([...reviews, newReview]); // Add the new review to the list
    setIsAddReviewOpen(false); // Close the Add Review form
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    
    <div className="max-w-5xl mx-auto pb-6 mt-2 bg-white border rounded-lg shadow-lg p-10 "> {/* Adjusted mt-20 for margin-top */}
      <div className="flex border-b mb-8 mt-4 justify-between items-center">
        <h1 className="text-2xl text-gray-700 font-bold mb-4">Reviews Preview</h1>
        <button 
          className="flex items-center bg-[#609641] text-white mb-4 px-2 py-1 rounded-md hover:bg-[#609641] transition duration-200"
          onClick={onAddReviewToggle} // Use the passed toggle function
        >
          <FaPlus className="mr-2" /> Add Review
        </button>
      </div>

    
      <div className="grid gap-4">
        {reviews.map((review, index) => (
          <div key={review.id} className="flex p-4 border rounded-md bg-white shadow-md dark:bg-gray-dark dark:shadow-card hover:shadow-lg transition-shadow duration-300">
            <div className="flex-shrink-0">
              {review.profile_image ? (
                <Image
                  src={review.profile_image}
                  alt={review.name}
                  width={150}
                  height={100}
                  className="rounded-md"
                />
              ) : (
                <div className="w-[150px] h-[100px] bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
            <div className="ml-4 flex-grow">
              <h2 className="text-xl text-gray-700 font-semibold">{review.name}</h2>
              <p className="text-gray-700 font-semibold">{review.designation}</p>
              <p className="text-gray-700">{review.comments}</p>
              <p className="text-gray-700">Rating: {review.rating}</p>
            </div>
            <div className="relative">
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none hover:bg-gray-200 rounded-md p-2" onClick={() => setDropdownOpenIndex(dropdownOpenIndex === index ? null : index)}>
                <FaEllipsisV className="h-3 w-3" />
              </button>
              <div className={`absolute right-0 mt-2 w-34 bg-gray-100 border rounded-md shadow-lg z-10 ${dropdownOpenIndex === index ? 'block' : 'hidden'}`}>
                <ul className="py-1">
                  <li className="px-3 py-1 text-gray-700 hover:bg-gray-200 cursor-pointer flex">
                    <button
                      className="flex items-center"
                      onClick={() => {
                        setDropdownOpenIndex(null);
                        setReviewId(review.id);
                        setIsEditReview(true);
                      }}
                    >
                      <FaEdit className="mr-2" /> <span>Edit</span>
                    </button>
                  </li>
                  <li className="px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-200 cursor-pointer flex"
                    onClick={() => {
                      setSelectedReviewId(review.id);
                      setIsModalOpen(true);
                    }}>
                    <FaTrash className="mr-2" /> <span>Delete</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-lg">
            <h2 className="text-lg font-bold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this review?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setIsModalOpen(false)} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About_ReviewPagePreview;