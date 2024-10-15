import React, { useState } from "react";

const HomeForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => { // Accept onSubmit prop
    const [formData, setFormData] = useState({
        heading: "", // Changed from title to heading
        head_content: "", // Changed from subquote to head_content
        head_image: "", // Changed from bgImage to head_image
        about_title: "", // Added about_title
        about_heading: "", // Added about_heading
        about_content: "", // Added about_content
        about_image: "", // Added about_image
        service: "", // Added service
        services_image: "", // Added services_image
        service_image1: "", // Added service_image1
        service_image2: "", // Added service_image2
        service_image3: "", // Added service_image3
        contact_heading: "", // Added contact_heading
        contact_content: "", // Added contact_content
        contact_image: "", // Added contact_image
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        onSubmit(formData); // Call the onSubmit prop with form data
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Home Form</h2>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="heading">Heading</label>
                <input
                    type="text"
                    name="heading"
                    id="heading"
                    value={formData.heading}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            
            <div className="mb-4">
                <label className="block mb-1" htmlFor="head_content">Head Content</label>
                <textarea
                    name="head_content"
                    id="head_content"
                    value={formData.head_content}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="head_image">Head Image URL</label>
                <input
                    type="text"
                    name="head_image"
                    id="head_image"
                    value={formData.head_image}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="about_title">About Title</label>
                <input
                    type="text"
                    name="about_title"
                    id="about_title"
                    value={formData.about_title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="about_heading">About Heading</label>
                <input
                    type="text"
                    name="about_heading"
                    id="about_heading"
                    value={formData.about_heading}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="about_content">About Content</label>
                <textarea
                    name="about_content"
                    id="about_content"
                    value={formData.about_content}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="about_image">About Image URL</label>
                <input
                    type="text"
                    name="about_image"
                    id="about_image"
                    value={formData.about_image}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
           
            <div className="mb-4">
                <label className="block mb-1" htmlFor="services_image">Service Image URL</label>
                <input
                    type="text"
                    name="services_image"
                    id="services_image"
                    value={formData.services_image}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1" htmlFor="service_image1">Service Image URL</label>
                <input
                    type="text"
                    name="service_image1"
                    id="service_image1"
                    value={formData.service_image1}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1" htmlFor="service_image2">Service Image URL</label>
                <input
                    type="text"
                    name="service_image2"    
                    id="service_image2"
                    value={formData.service_image2}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1" htmlFor="service_image3">Service Image URL</label>
                <input
                    type="text"
                    name="service_image3"    
                    id="service_image3"
                    value={formData.service_image3}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1" htmlFor="contact_heading">Contact Heading</label>
                <input
                    type="text"
                    name="contact_heading"
                    id="contact_heading"
                    value={formData.contact_heading}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="contact_content">Contact Content</label>
                <textarea
                    name="contact_content"
                    id="contact_content"
                    value={formData.contact_content}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="contact_image">Contact Image URL</label>
                <input
                    type="text"
                    name="contact_image"
                    id="contact_image"
                    value={formData.contact_image}
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

export default HomeForm;