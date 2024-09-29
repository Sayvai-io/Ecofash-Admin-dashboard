import React, { useState } from "react";

const ServiceForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => { // Accept onSubmit prop
    const [formData, setFormData] = useState({
        service_heading: "",
        service_content: "",
        service_image: "",
        years_of_experience_title: "",
        years_of_experience: "",
        satisfied_clients_title: "",
        satisfied_clients: "",
        services_provided_title: "",
        services_provided: "",
        business_portfolios_title: "",
        business_portfolios: "",
        collection_heading: "",
        collection_content: "",
        collection_image: "",
        service_provided_heading: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleServiceSubmit = (e: React.FormEvent) => { // Renamed function
        e.preventDefault();
        console.log("Service Form Data Submitted:", formData);
        onSubmit(formData); // Call the onSubmit prop with form data
    };

    return (
        <form onSubmit={handleServiceSubmit} className="max-w-lg mx-auto p-4 border rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Service Form</h2>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="service_heading">Service Heading</label>
                <input
                    type="text"
                    name="service_heading"
                    id="service_heading"
                    value={formData.service_heading}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="service_content">Service Content</label>
                <textarea
                    name="service_content"
                    id="service_content"
                    value={formData.service_content}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="service_image">Service Image URL</label>
                <input
                    type="text"
                    name="service_image"
                    id="service_image"
                    value={formData.service_image}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="years_of_experience_title">Years of Experience Title</label>
                <input
                    type="text"
                    name="years_of_experience_title"
                    id="years_of_experience_title"
                    value={formData.years_of_experience_title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="years_of_experience">Years of Experience</label>
                <input
                    type="text"
                    name="years_of_experience"
                    id="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="satisfied_clients_title">Satisfied Clients Title</label>
                <input
                    type="text"
                    name="satisfied_clients_title"
                    id="satisfied_clients_title"
                    value={formData.satisfied_clients_title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="satisfied_clients">Satisfied Clients</label>
                <input
                    type="text"
                    name="satisfied_clients"
                    id="satisfied_clients"
                    value={formData.satisfied_clients}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="services_provided_title">Services Provided Title</label>
                <input
                    type="text"
                    name="services_provided_title"
                    id="services_provided_title"
                    value={formData.services_provided_title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="services_provided">Services Provided</label>
                <textarea
                    name="services_provided"
                    id="services_provided"
                    value={formData.services_provided}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="business_portfolios_title">Business Portfolios Title</label>
                <input
                    type="text"
                    name="business_portfolios_title"
                    id="business_portfolios_title"
                    value={formData.business_portfolios_title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="business_portfolios">Business Portfolios</label>
                <textarea
                    name="business_portfolios"
                    id="business_portfolios"
                    value={formData.business_portfolios}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="collection_heading">Collection Heading</label>
                <input
                    type="text"
                    name="collection_heading"
                    id="collection_heading"
                    value={formData.collection_heading}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="collection_content">Collection Content</label>
                <textarea
                    name="collection_content"
                    id="collection_content"
                    value={formData.collection_content}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="collection_image">Collection Image URL</label>
                <input
                    type="text"
                    name="collection_image"
                    id="collection_image"
                    value={formData.collection_image}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="service_provided_heading">Service Provided Heading</label>
                <input
                    type="text"
                    name="service_provided_heading"
                    id="service_provided_heading"
                    value={formData.service_provided_heading}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                Submit
            </button>
        </form>
    );
};

export default ServiceForm;