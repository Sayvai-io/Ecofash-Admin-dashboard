"use client";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import ServiceProvidedForm from "./Service_ProvidedForm";
import ServiceProvidedPagePreview from "./Service_ProvidedPagePreview";
import EditServiceProvidedPage from "./EditService_ProvidedPage"; // Assuming EditServiceProvidedPage is imported from somewhere

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ServiceProvidedSection = () => {
    const [serviceData, setServiceData] = useState<any[]>([]); // Changed state to hold service data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // State to hold error messages
    const [isServiceEmpty, setIsServiceEmpty] = useState(false); // Changed state name
    const [isEditService, setIsEditService] = useState(false); // State for EditService visibility
    const [selectedService, setSelectedService] = useState<any | null>(null); // State to hold the selected service for editing
    const [serviceId, setServiceId] = useState<string | null>(null); // State to hold the service ID

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
            .from("service_provided") // Insert into the 'service_provided' table
            .insert([formData]); // Insert the new service data

        if (error) {
            console.error("Error adding service data:", error);
            setError("Failed to add service data."); // Set error message
        } else {
            setServiceData([...serviceData, formData]); // Update service data state
            setIsServiceEmpty(false); // Show service preview after adding
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

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>{error}</div>; // Display error message if any
    }

    return (
        <div>
            {serviceData.length === 0 ? (
                <ServiceProvidedForm onSubmit={handleServiceFormSubmit} /> // Show ServiceProvidedForm if no service data
            ) : isEditService ? (
                <EditServiceProvidedPage 
                    setIsEditService={setIsEditService}
                    serviceId={serviceId}
                    serviceData={serviceData}/> // Ensure EditServiceProvidedPage accepts 'serviceData' prop
            ) : (
                <ServiceProvidedPagePreview 
                    setIsEditService={setIsEditService}
                    setServiceId={setServiceId}
                    serviceData={serviceData} 
                    onDelete={handleDeleteService} 
                    onEdit={handleEditService} // Pass handleEditService
                />
            )}
        </div>
    );
}

export default ServiceProvidedSection;