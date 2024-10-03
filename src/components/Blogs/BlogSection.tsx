"use client";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import BlogForm from "./BlogForm"; // Updated import
import BlogPagePreview from "./BlogPagePreview"; // Updated import
import EditBlogPage from "./EditBlogPage"; // Updated import

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BlogSection = () => {
    const [blogData, setBlogData] = useState<any[]>([]); // Changed state to hold blog data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // State to hold error messages
    const [isBlogEmpty, setIsBlogEmpty] = useState(false); // Changed state name
    const [isEditBlog, setIsEditBlog] = useState(false); // State for EditBlog visibility
    const [selectedBlog, setSelectedBlog] = useState<any | null>(null); // State to hold the selected blog for editing
    const [blogId, setBlogId] = useState(); // State for blog ID
    const [isAddBlogOpen, setIsAddBlogOpen] = useState(false); // State for Add Blog visibility

    useEffect(() => {
        const fetchBlogData = async () => {
            setLoading(true); // Set loading to true before fetching
            const { data, error } = await supabase
                .from("blogs") // Fetch from the 'blogs' table
                .select("*"); // Fetch all columns

            if (error) {
                console.error("Error fetching blog data:", error);
                setError("Failed to fetch blog data."); // Set error message
            } else {
                console.log("Fetched blog data:", data); // Log the fetched data to the console
                setBlogData(data); // Set the fetched data to state
            }
            setLoading(false); 
            data?.length === 0 ? setIsBlogEmpty(true) : setIsBlogEmpty(false); // Determine if to show form or preview
        };

        fetchBlogData();
    }, []); // Empty dependency array means this runs once on mount

    const handleBlogFormSubmit = async (formData: any) => {
        // Ensure tags are formatted correctly as an array
        const formattedData = {
            ...formData,
            tags: formData.tags || [], // Ensure tags is an array
        };

        const { error } = await supabase
            .from("blogs") // Ensure this matches your table name
            .insert([formattedData]); // Insert the new blog data

        if (error) {
            console.error("Error adding blog data:", error);
            setError("Failed to add blog data."); // Set error message
        } else {
            setBlogData([...blogData, formattedData]); // Update blog data state
            setIsBlogEmpty(false); // Show blog preview after adding
            setIsAddBlogOpen(false); // Close the Add Blog form
        }
    };

    const handleDeleteBlog = (id: string) => {
        // Logic to delete the blog data by id
    };

    const handleEditBlog = (blog: any) => {
        setSelectedBlog(blog); // Set the selected blog for editing
        setIsEditBlog(true); // Show EditBlog
    };

    const handleSaveBlog = () => {
        setIsEditBlog(false); // Hide EditBlog and show preview
        setSelectedBlog(null); // Clear selected blog
    };

    const handleAddBlogToggle = () => {
        setIsAddBlogOpen(prev => !prev); // Toggle the Add Blog form
        if (isAddBlogOpen) {
            setIsEditBlog(false); // Close edit mode if opening add blog
        }
    };

    const handleBack = () => {
        setIsAddBlogOpen(false); // Close Add Blog form
        setIsEditBlog(false); // Ensure Edit mode is closed
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>{error}</div>; // Display error message if any
    }

    return (
        <div>
            {isAddBlogOpen ? (
                <BlogForm 
                    onSubmit={handleBlogFormSubmit} 
                    onBack={handleBack} // Pass the handleBack function
                />
            ) : isEditBlog ? (
                <EditBlogPage 
                    setIsEditBlog={setIsEditBlog}
                    blogId={blogId || ''} // Ensure blogId is a string, even if undefined
                    setBlogData={(data) => setBlogData(data)} // Correctly pass the setBlogData function
                />
            ) : (
                <BlogPagePreview 
                    setIsEditBlog={setIsEditBlog}
                    setBlogId={setBlogId}
                    blogData={blogData} 
                    onDelete={handleDeleteBlog} 
                    onEdit={handleEditBlog} // Pass handleEditBlog
                    onAddBlogToggle={handleAddBlogToggle} // Pass the toggle function
                />
            )}
        </div>
    );
}

export default BlogSection;