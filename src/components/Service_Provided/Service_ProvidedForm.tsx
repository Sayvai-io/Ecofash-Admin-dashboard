import React, { useState } from "react";

const ServiceProvidedForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => { // Accept onSubmit prop
    const [formData, setFormData] = useState({
        title: "",         // Changed field
        content: "",       // Changed field
        bg_image: "",      // Changed field
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Service Provided Form Data Submitted:", formData);
        onSubmit(formData); // Call the onSubmit prop with form data
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Service Provided Form</h2> {/* Updated heading */}
            <div className="mb-4">
                <label className="block mb-1" htmlFor="title">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="content">Content</label>
                <textarea
                    name="content"
                    id="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="bg_image">Background Image URL</label>
                <input
                    type="text"
                    name="bg_image"
                    id="bg_image"
                    value={formData.bg_image}
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

export default ServiceProvidedForm;