"use client";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import Country_Address_Form from "./Contact_Address_Form";
import Country_PagePreview from "./Contact_Address_PagePreview";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Country_Address_Section = () => {
    const [countries, setCountries] = useState<any[]>([]); // State to hold country data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // State to hold error messages
    const [isAddAddressOpen, setIsAddAddressOpen] = useState(false); // State to control Add Address form visibility

    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(true); // Set loading to true before fetching
            const { data, error } = await supabase
                .from("country")
                .select(`id, country_name, addresses:address (id, full_address, email, contact_no)`);

            if (error) {
                console.error("Error fetching countries:", error);
                setError("Failed to fetch countries."); // Set error message
            } else {
                setCountries(data); // Set the fetched data to state
            }
            setLoading(false);
        };

        fetchCountries();
    }, []); // Empty dependency array means this runs once on mount

    const handleCountrySubmit = async (formData: any) => {
        const { country_name } = formData; // Destructure the form data

        const { error } = await supabase
            .from("country")
            .insert([{ country_name }]); // Insert new country

        if (error) {
            console.error("Error adding country:", error);
            setError("Failed to add country."); // Set error message
        } else {
            // Fetch updated countries after adding
            const { data } = await supabase
                .from("country")
                .select(`id, country_name, addresses:address (id, full_address, email, contact_no)`);
            if (data) {
                setCountries(data); // Update country data state
            }
            setIsAddAddressOpen(false); // Close the Add Address form
        }
    };

    const handleAddressSubmit = async (formData: any) => {
        const { full_address, email, contact_no, country_id } = formData; // Destructure the form data

        const { error } = await supabase
            .from("address")
            .insert([{ 
                full_address, 
                email, 
                contact_no, 
                country_id // Include country_id in the insert
            }]); 

        if (error) {
            console.error("Error adding address data:", error);
            setError("Failed to add address data."); // Set error message
        } else {
            // Fetch updated countries after adding address
            const { data } = await supabase
                .from("country")
                .select(`id, country_name, addresses:address (id, full_address, email, contact_no)`);
            if (data) {
                setCountries(data); // Update country data state
            }
            setIsAddAddressOpen(false); // Close the Add Address form
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>{error}</div>; // Display error message if any
    }

    return (
        <div>
            {isAddAddressOpen ? (
                <Country_Address_Form 
                    onSubmitCountry={handleCountrySubmit} 
                    onSubmitAddress={handleAddressSubmit} 
                    onBack={() => setIsAddAddressOpen(false)} // Pass the handleBack function
                />
            ) : (
                <Country_PagePreview 
                    onAddAddressToggle={() => setIsAddAddressOpen(true)} // Toggle the Add Address form
                />
            )}
        </div>
    );
}

export default Country_Address_Section;