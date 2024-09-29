"use client";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import AboutForm from "./AboutForm";
import AboutPagePreview from "./AboutPagePreview";
import EditAboutPage from "./EditAboutPage"; // Assuming EditAboutPage is imported from somewhere

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const AboutSection = () => {
    const [aboutData, setAboutData] = useState<any[]>([]); // State to hold about data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // State to hold error messages
    const [isAboutEmpty, setIsAboutEmpty] = useState(false);
    const [isEditAbout, setIsEditAbout] = useState(false); // State for EditAbout visibility
    const [selectedAbout, setSelectedAbout] = useState<any | null>(null); // State to hold the selected about for editing

    useEffect(() => {
        const fetchAboutData = async () => {
            setLoading(true); // Set loading to true before fetching
            const { data, error } = await supabase
                .from("about") // Fetch from the 'about' table
                .select("*"); // Fetch all columns

            if (error) {
                console.error("Error fetching about data:", error);
                setError("Failed to fetch about data."); // Set error message
            } else {
                console.log("Fetched about data:", data); // Log the fetched data to the console
                setAboutData(data); // Set the fetched data to state
            }
            setLoading(false); 
            data?.length === 0 ? setIsAboutEmpty(true) : setIsAboutEmpty(false); // Determine if to show form or preview
        };

        fetchAboutData();
    }, []); // Empty dependency array means this runs once on mount

    const handleAboutFormSubmit = async (formData: any) => {
        const { error } = await supabase
            .from("about") // Insert into the 'about' table
            .insert([formData]); // Insert the new about data

        if (error) {
            console.error("Error adding about data:", error);
            setError("Failed to add about data."); // Set error message
        } else {
            setAboutData([...aboutData, formData]); // Update about data state
            setIsAboutEmpty(false); // Show about preview after adding
        }
    };

    const handleDeleteAbout = (id: string) => {
        // Logic to delete the about data by id
    };

    const handleEditAbout = (about: any) => {
        setSelectedAbout(about); // Set the selected about for editing
        setIsEditAbout(true); // Show EditAbout
        setAboutData((prevData) => prevData.map((item) => item.id === about.id ? about : item)); // Update local state if needed
    };

    const handleSaveAbout = () => {
        setIsEditAbout(false); // Hide EditAbout and show preview
        setSelectedAbout(null); // Clear selected about
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>{error}</div>; // Display error message if any
    }

    return (
        <div>
            {aboutData.length === 0 ? (
                <AboutForm onSubmit={handleAboutFormSubmit} /> // Show AboutForm if no about data
            ) : isEditAbout ? (
                <EditAboutPage 
                setIsEditAbout={setIsEditAbout}
                setAboutData={setAboutData} // Pass the setAboutData function
                />
            ) : (
                <AboutPagePreview 
                    setIsEditAbout={setIsEditAbout}
                    aboutData={aboutData} 
                    onDelete={handleDeleteAbout} 
                    setAboutData={setAboutData}
                    onEdit={handleEditAbout} // Pass handleEditAbout
                />
            )}
        </div>
    );
}

export default AboutSection;