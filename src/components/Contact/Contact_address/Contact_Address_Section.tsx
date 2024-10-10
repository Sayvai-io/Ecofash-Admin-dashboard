"use client";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import Contact_Address_Form from "./Contact_Address_Form";
import Contact_Address_PagePreview from "./Contact_Address_PagePreview";
import EditContact_Address from "./EditContact_Address"; // Assuming EditContact_Address is imported from somewhere

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Contact_Address_Section = () => {
    const [addressData, setAddressData] = useState<any[]>([]); // State to hold address data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // State to hold error messages
    const [isAddressEmpty, setIsAddressEmpty] = useState(false); // State to check if address data is empty
    const [isEditAddress, setIsEditAddress] = useState(false); // State for EditAddress visibility
    const [selectedAddress, setSelectedAddress] = useState<any | null>(null); // State to hold the selected address for editing
    const [addressId, setAddressId] = useState(); // State to hold the address ID
    const [isAddAddressOpen, setIsAddAddressOpen] = useState(false); // State to control Add Address form visibility

    useEffect(() => {
        const fetchAddressData = async () => {
            setLoading(true); // Set loading to true before fetching
            const { data, error } = await supabase
                .from("address") // Fetch from the 'address' table
                .select(`
                    id,
                    full_address,
                    email,
                    contact_no,
                    country_id,
                    country:country_id (country_name) // Fetch country name based on country_id
                `); // Fetch all columns and join with country table

            if (error) {
                console.error("Error fetching address data:", error);
                setError("Failed to fetch address data."); // Set error message
            } else {
                console.log("Fetched address data:", data); // Log the fetched data to the console
                setAddressData(data); // Set the fetched data to state
            }
            setLoading(false); 
            setIsAddressEmpty(data?.length === 0); // Determine if to show form or preview
        };

        fetchAddressData();
    }, []); // Empty dependency array means this runs once on mount

    const handleAddressFormSubmit = async (formData: any) => {
        const { full_address, email, contact_no, country_id } = formData; // Destructure the form data

        const { error } = await supabase
            .from("address") // Ensure this matches your address table name
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
            setAddressData(prev => [...prev, { ...formData, id: error?.message }]); // Update address data state
            setIsAddressEmpty(false); // Show address preview after adding
            setIsAddAddressOpen(false); // Close the Add Address form
        }
    };

    const handleDeleteAddress = async (id: string) => {
        const { error } = await supabase
            .from("address") // Ensure this matches your address table name
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting address:", error);
        } else {
            setAddressData(prev => prev.filter(address => address.id !== id)); // Update state to remove deleted address
        }
    };

    const handleEditAddress = (address: any) => {
        setSelectedAddress(address); // Set the selected address for editing
        setIsEditAddress(true); // Show EditAddress
    };

    const handleSaveAddress = () => {
        setIsEditAddress(false); // Hide EditAddress and show preview
        setSelectedAddress(null); // Clear selected address
    };

    const handleAddAddressToggle = () => {
        setIsAddAddressOpen(prev => !prev); // Toggle the Add Address form
        if (isAddAddressOpen) {
            setIsEditAddress(false); // Close edit mode if opening add address
        }
    };

    const handleBack = () => {
        setIsAddAddressOpen(false); // Close Add Address form
        setIsEditAddress(false); // Ensure Edit mode is closed
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
                <Contact_Address_Form 
                    onSubmit={handleAddressFormSubmit} 
                    onBack={handleBack} // Pass the handleBack function
                />
            ) : isEditAddress ? (
                <EditContact_Address 
                    setIsEditAddress={setIsEditAddress}
                    addressId={addressId || ''} // Ensure addressId is a string, even if undefined
                    setAddressData={(data: any) => setAddressData(data)} // Correctly pass the setAddressData function
                />
            ) : (
                <Contact_Address_PagePreview 
                    setIsEditAddress={setIsEditAddress}
                    addressId={addressId || ''} // Ensure addressId is a string, even if undefined
                    addressData={addressData} 
                    onDelete={handleDeleteAddress} 
                    onEdit={handleEditAddress} // Pass handleEditAddress
                    onAddAddressToggle={handleAddAddressToggle}
                />
            )}
        </div>
    );
}

export default Contact_Address_Section;