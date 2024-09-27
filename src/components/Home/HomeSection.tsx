"use client";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import HomeForm from "./HomeForm";
import HomePagePreview from "./HomePagePreview";
import EditHomePage from "./EditHomePage";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const HomeSection = () => {
    const [homeData, setHomeData] = useState<any[]>([]); // Changed from contacts to homeData
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // State to hold error messages
    const [isHomeEmpty, setIsHomeEmpty] = useState(false); // Changed from isContact to isHomeEmpty
    const [isEditHome, setIsEditHome] = useState(false); // Changed from isEditContact to isEditHome
    const [selectedHome, setSelectedHome] = useState<any | null>(null); // Changed from selectedContact to selectedHome

    useEffect(() => {
        const fetchHomeData = async () => { // Changed from fetchContacts to fetchHomeData
            setLoading(true); // Set loading to true before fetching
            const { data, error } = await supabase
                .from("home") // Changed from "contact" to "home"
                .select("*"); // Fetch all columns

            if (error) {
                console.error("Error fetching home data:", error);
                setError("Failed to fetch home data."); // Set error message
            } else {
                console.log("Fetched home data:", data); // Log the fetched data to the console
                setHomeData(data); // Set the fetched data to state
            }
            setLoading(false); 
            data?.length === 0 ? setIsHomeEmpty(true) : setIsHomeEmpty(false); // Determine if to show form or preview
        };

        fetchHomeData(); // Call the fetch function
    }, []); // Empty dependency array means this runs once on mount

    const handleFormSubmit = async (formData: any) => {
        const { error } = await supabase
            .from("home") // Changed from "contact" to "home"
            .insert([formData]); // Insert the new home data

        if (error) {
            console.error("Error adding home data:", error);
            setError("Failed to add home data."); // Set error message
        } else {
            setHomeData([...homeData, formData]); // Update homeData state
            setIsHomeEmpty(false); // Show home preview after adding
        }
    };

    const handleDelete = (id: string) => {
        // Logic to delete the home data by id
    };

    const handleEditHome = (home: any) => { // Changed from handleEditContact to handleEditHome
        setSelectedHome(home); // Set the selected home for editing
        setIsEditHome(true); // Show EditHomePage
    };

    const handleSave = () => {
        setIsEditHome(false); // Hide EditHomePage and show preview
        setSelectedHome(null); // Clear selected home
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>{error}</div>; // Display error message if any
    }

    return (
        <div>
            {homeData.length === 0 ? (
                <HomeForm onSubmit={handleFormSubmit} /> // Show HomeForm if no home data
            ) : isEditHome ? (
                <EditHomePage 
                setIsEditHome={setIsEditHome}
                homeData={homeData}/> // Ensure EditHomePage accepts 'homeData' prop
            ) : (
                <HomePagePreview 
                    setIsEditHome={setIsEditHome} // Changed from setIsEditContact to setIsEditHome
                    homeData={homeData} // Changed from contacts to homeData
                    onDelete={handleDelete} 
                    onEdit={handleEditHome} // Pass handleEditHome
                />
            )}
        </div>
    );
}

export default HomeSection;