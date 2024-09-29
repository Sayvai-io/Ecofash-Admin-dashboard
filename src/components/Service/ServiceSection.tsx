"use client";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import ServiceForm from "./ServiceForm"; // Updated import
import ServicePagePreview from "./ServicePagePreview"; // Updated import
import EditServicePage from "./EditServicePage"; // Updated import

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ServiceSection = () => {
    const [serviceData, setServiceData] = useState<any[]>([]); // Updated state name
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // State to hold error messages
    const [isServiceEmpty, setIsServiceEmpty] = useState(false); // Updated state name
    const [isEditService, setIsEditService] = useState(false); // Updated state name
    const [selectedService, setSelectedService] = useState<any | null>(null); // Updated state name

    useEffect(() => {
        const fetchServiceData = async () => { // Updated function name
            setLoading(true); // Set loading to true before fetching
            const { data, error } = await supabase
                .from("service") // Fetch from the 'service' table
                .select("*"); // Fetch all columns

            if (error) {
                console.error("Error fetching service data:", error); // Updated log message
                setError("Failed to fetch service data."); // Updated error message
            } else {
                console.log("Fetched service data:", data); // Updated log message
                setServiceData(data); // Set the fetched data to state
            }
            setLoading(false); 
            data?.length === 0 ? setIsServiceEmpty(true) : setIsServiceEmpty(false); // Determine if to show form or preview
        };

        fetchServiceData();
    }, []); // Empty dependency array means this runs once on mount

    const handleServiceFormSubmit = async (formData: any) => { // Updated function name
        const { error } = await supabase
            .from("service") // Insert into the 'service' table
            .insert([formData]); // Insert the new service data

        if (error) {
            console.error("Error adding service data:", error); // Updated log message
            setError("Failed to add service data."); // Updated error message
        } else {
            setServiceData([...serviceData, formData]); // Update service data state
            setIsServiceEmpty(false); // Show service preview after adding
        }
    };

    const handleDeleteService = (id: string) => { // Updated function name
        // Logic to delete the service data by id
    };

    const handleEditService = (service: any) => { // Updated function name
        setSelectedService(service); // Set the selected service for editing
        setIsEditService(true); // Show EditService
        setServiceData((prevData) => prevData.map((item) => item.id === service.id ? service : item)); // Update local state if needed
    };

    const handleSaveService = () => { // Updated function name
        setIsEditService(false); // Hide EditService and show preview
        setSelectedService(null); // Clear selected service
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>{error}</div>; // Display error message if any
    }

    return (
        <div>
            {serviceData.length === 0 ? (
                <ServiceForm onSubmit={handleServiceFormSubmit} /> // Show ServiceForm if no service data
            ) : isEditService ? (
                <EditServicePage 
                setIsEditService={setIsEditService}
                setServiceData={setServiceData} // Pass the setServiceData function
                />
            ) : (
                <ServicePagePreview 
                    setIsEditService={setIsEditService}
                    serviceData={serviceData} 
                    onDelete={handleDeleteService} 
                    setServiceData={setServiceData}
                    onEdit={handleEditService} // Pass handleEditService
                />
            )}
        </div>
    );
}

export default ServiceSection; // Updated export