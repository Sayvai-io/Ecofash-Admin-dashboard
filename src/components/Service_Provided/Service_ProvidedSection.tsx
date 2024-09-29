"use client";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import Service_ProvidedForm from "./Service_ProvidedForm"; // Updated import
import Service_ProvidedPagePreview from "./Service_ProvidedPagePreview"; // Updated import
import EditService_ProvidedPage from "./EditService_ProvidedPage"; // Updated import

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Service_ProvidedSection = () => {
    const [serviceData, setServiceData] = useState<any[]>([]); // Changed state to hold service data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // State to hold error messages
    const [isServiceEmpty, setIsServiceEmpty] = useState(false); // Changed state name
    const [isEditService, setIsEditService] = useState(false); // State for EditService visibility
    const [selectedService, setSelectedService] = useState<any | null>(null); // State to hold the selected service for editing
    const [serviceId, setServiceId] = useState(); // State to hold the service ID
    const [showServiceForm, setShowServiceForm] = useState(false); // State to manage form visibility
    const [isAddServiceOpen, setIsAddServiceOpen] = useState(false); // State for Add Service form visibility

    useEffect(() => {
        const fetchServiceData = async () => {
            setLoading(true); // Set loading to true before fetching
            const { data, error } = await supabase
                .from("service_provided") // Fetch from the 'service_provided' table
                .select("*"); // Fetch all columns

            if (error) {
                console.error("Error fetching service data:", error);
                setError("Failed to fetch service data."); // Set error message
            } else {
                console.log("Fetched service data:", data); // Log the fetched data to the console
                setServiceData(data); // Set the fetched data to state
            }
            setLoading(false); 
            data?.length === 0 ? setIsServiceEmpty(true) : setIsServiceEmpty(false); // Determine if to show form or preview
        };

        fetchServiceData();
    }, []); // Empty dependency array means this runs once on mount

    const handleServiceFormSubmit = async (formData: any) => {
        const { error } = await supabase
            .from("service_provided") // Ensure this matches your table name
            .insert([formData]); // Insert the new service data

        if (error) {
            console.error("Error adding service data:", error);
            setError("Failed to add service data."); // Set error message
        } else {
            setServiceData([...serviceData, formData]); // Update service data state
            setIsServiceEmpty(false); // Show service preview after adding
            setIsAddServiceOpen(false); // Close the Add Service form
        }
    };

    const handleDeleteService = (id: string) => {
        // Logic to delete the service data by id
    };

    const handleEditService = (service: any) => {
        setSelectedService(service); // Set the selected service for editing
        setIsEditService(true); // Show EditService
    };

    const handleSaveService = () => {
        setIsEditService(false); // Hide EditService and show preview
        setSelectedService(null); // Clear selected service
    };

    const handleAddServiceToggle = () => {
        setIsAddServiceOpen(prev => !prev); // Toggle the Add Service form
        if (isAddServiceOpen) {
            setIsEditService(false); // Close edit mode if opening add service
        }
    };

    const handleBack = () => {
        setIsAddServiceOpen(false); // Close Add Service form
        setIsEditService(false); // Ensure Edit mode is closed
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>{error}</div>; // Display error message if any
    }

    return (
        <div>
            {isAddServiceOpen ? (
                <Service_ProvidedForm 
                    onSubmit={handleServiceFormSubmit} 
                    onBack={handleBack} // Pass the handleBack function
                />
            ) : isEditService ? (
                <EditService_ProvidedPage 
                    setIsEditService={setIsEditService}
                    serviceId={serviceId || ''} // Ensure serviceId is a string or an empty string if undefined
                    setServiceData={(data) => setServiceData(data)}// Ensure EditServiceProvidedPage accepts 'setServiceData' prop
                />
            ) : (
                <Service_ProvidedPagePreview 
                    setIsEditService={setIsEditService}
                    setServiceId={setServiceId}
                    serviceData={serviceData} 
                    onDelete={handleDeleteService} 
                    onEdit={handleEditService} // Pass handleEditService
                    onAddServiceToggle={handleAddServiceToggle} // Pass the toggle function
                />
            )}
        </div>
    );
}

export default Service_ProvidedSection;