"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import supabase from "@/utils/supabaseClient";
import { FaEllipsisV, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import DOMPurify from 'dompurify';

type BlogPagePreviewProps = {
  setIsEditBlog: (isEdit: boolean) => void; // Updated function name
  setBlogId: (isBlog: any) => void; // Updated function name
  blogData?: any[]; // Updated type name
  onDelete: (id: string) => void;
  onEdit: (blog: any) => void; // Updated parameter name
  onAddBlogToggle: () => void; // Updated function name
};

const BlogPagePreview = ({ 
  setIsEditBlog,
  setBlogId,
  blogData,
  onDelete,
  onEdit,
  onAddBlogToggle // Pass the toggle function
}: BlogPagePreviewProps) => {
  const [blogs, setBlogs] = useState<any[]>([]); // Updated state name
  const [loading, setLoading] = useState(true);
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null); // Updated state name
  const [isAddBlogOpen, setIsAddBlogOpen] = useState(false); // Updated state name

  useEffect(() => {
    const fetchBlogs = async () => { // Updated function name
      const { data, error } = await supabase
        .from("blogs") // Change to your table name
        .select("*");

      if (error) {
        console.error("Error fetching blogs:", error); // Updated log message
      } else {
        setBlogs(data); // Updated state name
      }
      setLoading(false);
    };

    fetchBlogs(); // Updated function name
  }, []);

  const handleDelete = async () => {
    if (selectedBlogId) { // Updated state name
      const { error } = await supabase
        .from("blogs") // Change to your table name
        .delete()
        .eq("id", selectedBlogId); // Updated state name

      if (error) {
        console.error("Error deleting blog:", error); // Updated log message
      } else {
        setBlogs(blogs.filter(blog => blog.id !== selectedBlogId)); // Updated state name
      }
      setIsModalOpen(false);
    }
  };

  const handleAddBlogSubmit = (newBlog: any) => { // Updated function name
    setBlogs([...blogs, newBlog]); // Updated state name
    setIsAddBlogOpen(false); // Close the Add Blog form
  };

  const sanitizeHTML = (html: string) => {
    return {
        __html: DOMPurify.sanitize(html)
    };
};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    
    <div className="max-w-5xl mx-auto pb-6 mt-2 bg-white border rounded-lg shadow-lg p-10 "> {/* Adjusted mt-20 for margin-top */}
      <div className="flex border-b mb-8 mt-4 justify-between items-center">
        <h1 className="text-2xl text-gray-700 font-bold mb-4">Blogs Preview</h1> {/* Updated heading */}
        <button 
          className="flex items-center bg-[#609641] text-white mb-4 px-2 py-1 rounded-md hover:bg-[#609641] transition duration-200"
          onClick={onAddBlogToggle} // Use the passed toggle function
        >
          <FaPlus className="mr-2" /> Add Blog
        </button>
      </div>

    
      <div className="grid gap-4">
        {blogs.map((blog, index) => ( // Updated state name
          <div key={blog.id} className="flex p-4 border rounded-md bg-white shadow-md dark:bg-gray-dark dark:shadow-card hover:shadow-lg transition-shadow duration-300">
            <div className="flex-shrink-0">
              {blog.image_url ? ( // Updated field name
                <Image
                  src={blog.image_url} // Updated field name
                  alt={blog.title} // Updated field name
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
              <h2 className="text-xl text-gray-700 font-semibold" dangerouslySetInnerHTML={sanitizeHTML(blog.title)}></h2> {/* Updated field name */}
              <p className="text-gray-700">
              {blog.content.split(' ').slice(0, 30).join(' ') + (blog.content.split(' ').length > 10 ? '...' : '')}  
              </p> {/* Updated to limit to first 20 lines and display normally */}
              <p className="text-gray-700 mt-2">Tags: 
                {blog.tags.map((tag: string) => (
                  <span key={tag} className="bg-gray-200 rounded-lg mx-1 px-2 py-1 text-sm">
                    {tag}
                  </span>
                ))}
              </p> {/* Updated to render tags as individual spans */}
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
                        setBlogId(blog.id); // Updated field name
                        setIsEditBlog(true); // Updated function name
                      }}
                    >
                      <FaEdit className="mr-2" /> <span>Edit</span>
                    </button>
                  </li>
                  <li className="px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-200 cursor-pointer flex"
                    onClick={() => {
                      setSelectedBlogId(blog.id); // Updated field name
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
            <p>Are you sure you want to delete this blog?</p> {/* Updated message */}
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

export default BlogPagePreview;