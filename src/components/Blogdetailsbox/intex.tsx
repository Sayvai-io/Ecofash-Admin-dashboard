"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import supabase from "@/utils/supabaseClient"; // Ensure you have this import
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa'; // Add this import for the ellipsis ic
import { useRouter } from 'next/navigation'; // Import useRouter

const BlogDetails = () => {
  const router = useRouter(); // Initialize router
  const [blogs, setBlogs] = useState<any[]>([]); // State to hold blog data
  const [loading, setLoading] = useState(true); // Loading state
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null); // Change state to track which dropdown is open

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs") // Replace with your table name
        .select("*"); // Fetch all columns

      if (error) {
        console.error("Error fetching blogs:", error);
      } else {
        setBlogs(data); // Set the fetched data to state
      }
      setLoading(false); // Set loading to false after fetching
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <>
      <div className="mb-4"> {/* Margin bottom for spacing */}
        <a href="/blog" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200">
          Create Blog
        </a>
      </div>
      <div className="grid gap-4"> {/* Grid container with gap */}
        {blogs.map((blog, index) => ( // Add index parameter to map
          <div key={blog.id} className="flex p-4 border rounded-md bg-white shadow-md dark:bg-gray-dark dark:shadow-card"> {/* Flex container for each blog */}
            <div className="flex-shrink-0"> {/* Image container */}
              {blog.image_url ? (
                <Image
                  src={blog.image_url} // Assuming your image URL is stored in this field
                  alt={blog.title}
                  width={150} // Set appropriate width
                  height={100} // Set appropriate height
                  className="rounded-md"
                />
              ) : (
                <div className="w-[150px] h-[100px] bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
            <div className="ml-4 flex-grow"> {/* Content container */}
              <h2 className="text-xl font-bold">{blog.title}</h2>
              <p className="text-gray-700">{blog.content}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {blog.tags.map((tag: string) => (
                  <span key={tag} className="bg-gray-200 rounded-full px-2 py-1 text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative"> {/* Dropdown container */}
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none hover:bg-gray-200 rounded-md p-2" onClick={() => setDropdownOpenIndex(dropdownOpenIndex === index ? null : index)}>
                <FaEllipsisV className="h-3 w-3" /> {/* Replace SVG with the ellipsis icon */}
              </button>
              <div className={`absolute right-0 mt-2 w-34 bg-gray-100 border rounded-md shadow-lg z-10 ${dropdownOpenIndex === index ? 'bg-gray-100' : 'hidden'}`}> {/* Dropdown menu */}
                <ul className="py-1">
                  <li className="px-3 py-1 text-gray-700 hover:bg-gray-200 cursor-pointer flex">
                      <button
                        className="flex items-center"
                        onClick={() => {
                          setDropdownOpenIndex(null); // Close dropdown
                          router.push(`/editblog/${blog.id}`); // Navigate to edit page with blog ID
                          console.log('Navigating to edit blog with ID:', blog.id);
                        }}
                        
                      >
                        <FaEdit className="mr-2" /> <span>Edit</span> {/* Edit link with icon on the left */}
                      </button>
                      
                  </li>
                  <li className="px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-200 cursor-pointer flex">
                      <FaTrash className="mr-2" /> <span>Delete</span> {/* Delete link with icon on the left */}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BlogDetails;

