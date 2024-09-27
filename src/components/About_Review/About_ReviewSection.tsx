"use client";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import About_ReviewForm from "./About_ReviewForm";
import About_ReviewPagePreview from "./About_ReviewPagePreview";
import EditAbout_ReviewPage from "./EditAbout_ReviewPage"; // Assuming EditAboutPage is imported from somewhere

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const About_ReviewSection = () => {
    const [reviewData, setReviewData] = useState<any[]>([]); // Changed state to hold review data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // State to hold error messages
    const [isReviewEmpty, setIsReviewEmpty] = useState(false); // Changed state name
    const [isEditReview, setIsEditReview] = useState(false); // State for EditReview visibility
    const [selectedReview, setSelectedReview] = useState<any | null>(null); // State to hold the selected review for editing

    useEffect(() => {
        const fetchReviewData = async () => {
            setLoading(true); // Set loading to true before fetching
            const { data, error } = await supabase
                .from("about_review") // Fetch from the 'reviews' table
                .select("*"); // Fetch all columns

            if (error) {
                console.error("Error fetching review data:", error);
                setError("Failed to fetch review data."); // Set error message
            } else {
                console.log("Fetched review data:", data); // Log the fetched data to the console
                setReviewData(data); // Set the fetched data to state
            }
            setLoading(false); 
            data?.length === 0 ? setIsReviewEmpty(true) : setIsReviewEmpty(false); // Determine if to show form or preview
        };

        fetchReviewData();
    }, []); // Empty dependency array means this runs once on mount

    const handleReviewFormSubmit = async (formData: any) => {
        const { error } = await supabase
            .from("reviews") // Insert into the 'reviews' table
            .insert([formData]); // Insert the new review data

        if (error) {
            console.error("Error adding review data:", error);
            setError("Failed to add review data."); // Set error message
        } else {
            setReviewData([...reviewData, formData]); // Update review data state
            setIsReviewEmpty(false); // Show review preview after adding
        }
    };

    const handleDeleteReview = (id: string) => {
        // Logic to delete the review data by id
    };

    const handleEditReview = (review: any) => {
        setSelectedReview(review); // Set the selected review for editing
        setIsEditReview(true); // Show EditReview
    };

    const handleSaveReview = () => {
        setIsEditReview(false); // Hide EditReview and show preview
        setSelectedReview(null); // Clear selected review
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>{error}</div>; // Display error message if any
    }

    return (
        <div>
            {reviewData.length === 0 ? (
                <About_ReviewForm onSubmit={handleReviewFormSubmit} /> // Show AboutForm if no review data
            ) : isEditReview ? (
                <EditAbout_ReviewPage 
                setIsEditReview={setIsEditReview}
                reviewData={reviewData}/> // Ensure EditAboutPage accepts 'reviewData' prop
            ) : (
                <About_ReviewPagePreview 
                    setIsEditReview={setIsEditReview}
                    reviewData={reviewData} 
                    onDeleteReview={handleDeleteReview} 
                    onEditReview={handleEditReview} // Pass handleEditReview
                />
            )}
        </div>
    );
}

export default About_ReviewSection;