
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import supabase from "@/utils/supabaseClient";
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const About_ReviewPagePreview = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="grid gap-4">
        {reviews.map((review, index) => (
          <div key={review.id} className="flex p-4 border rounded-md bg-white shadow-md dark:bg-gray-dark dark:shadow-card">
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
              <h2 className="text-xl font-bold">{review.name}</h2>
              <p className="text-gray-700">{review.designation}</p>
              <p className="text-gray-700">{review.comments}</p>
              <p className="text-gray-500">Rating: {review.rating}</p>
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
                        router.push(`/editreview/${review.id}`); // Adjust the route for editing
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
    </>
  );
};

export default About_ReviewPagePreview;