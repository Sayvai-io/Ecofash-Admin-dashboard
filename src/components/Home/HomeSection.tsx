"use client";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import HomeForm from "./HomeForm"; // Updated import
import HomePagePreview from "./HomePagePreview"; // Updated import
import EditHomePage from "./EditHomePage"; // Updated import

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const HomeSection = () => {
    const [homeData, setHomeData] = useState<any[]>([]); // Updated state name
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // State to hold error messages
    const [isHomeEmpty, setIsHomeEmpty] = useState(false); // Updated state name
    const [isEditHome, setIsEditHome] = useState(false); // Updated state name
    const [selectedHome, setSelectedHome] = useState<any | null>(null); // Updated state name

    useEffect(() => {
        const fetchHomeData = async () => { // Updated function name
            setLoading(true); // Set loading to true before fetching
            const { data, error } = await supabase
                .from("home") // Fetch from the 'home' table
                .select("*"); // Fetch all columns

            if (error) {
                console.error("Error fetching home data:", error); // Updated log message
                setError("Failed to fetch home data."); // Updated error message
            } else {
                console.log("Fetched home data:", data); // Updated log message
                setHomeData(data); // Set the fetched data to state
            }
            setLoading(false); 
            data?.length === 0 ? setIsHomeEmpty(true) : setIsHomeEmpty(false); // Determine if to show form or preview
        };

        fetchHomeData();
    }, []); // Empty dependency array means this runs once on mount

    const handleHomeFormSubmit = async (formData: any) => { // Updated function name
        const { error } = await supabase
            .from("home") // Insert into the 'home' table
            .insert([formData]); // Insert the new home data

        if (error) {
            console.error("Error adding home data:", error); // Updated log message
            setError("Failed to add home data."); // Updated error message
        } else {
            setHomeData([...homeData, formData]); // Update home data state
            setIsHomeEmpty(false); // Show home preview after adding
        }
    };

    const handleDeleteHome = (id: string) => { // Updated function name
        // Logic to delete the home data by id
    };

    const handleEditHome = (home: any) => { // Updated function name
        setSelectedHome(home); // Set the selected home for editing
        setIsEditHome(true); // Show EditHome
        setHomeData((prevData) => prevData.map((item) => item.id === home.id ? home : item)); // Update local state if needed
    };

    const handleSaveHome = () => { // Updated function name
        setIsEditHome(false); // Hide EditHome and show preview
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
                <HomeForm onSubmit={handleHomeFormSubmit} /> // Show HomeForm if no home data
            ) : isEditHome ? (
                <EditHomePage 
                setIsEditHome={setIsEditHome}
                setHomeData={setHomeData} // Pass the setHomeData function
                />
            ) : (
                <HomePagePreview 
                    setIsEditHome={setIsEditHome}
                    homeData={homeData} 
                    onDelete={handleDeleteHome} 
                    setHomeData={setHomeData}
                    onEdit={handleEditHome} // Pass handleEditHome
                />
            )}
        </div>
    );
}

export default HomeSection; // Updated export