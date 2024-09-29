import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';

const Seperate_ServiceForm = ({ onSubmit, onBack }: { onSubmit: (data: any) => void; onBack: () => void; }) => { // Renamed component
    const [formData, setFormData] = useState({
        title: "",              // Changed field
        heading: "",            // New field
        content: "",            // Changed field
        significance: "",       // New field
        plan_of_action: "",     // New field
        why_content_image: "",  // New field
        significance_title: "",  // New field
        plan_of_action_title: "", // New field
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, why_content_image: reader.result as string }); // Update formData with image
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Contact Service Form Data Submitted:", formData);
        onSubmit(formData); // Call the onSubmit prop with form data
    };

    const handleBack = () => {
        onBack();
    };

    return (
        <>
            <button onClick={handleBack} className="top-4 left-4 flex items-center w-20 px-4 py-2 bg-gray-500 text-white rounded"> {/* Back button */}
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> {/* Left arrow icon */}
                Back
            </button>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded-md shadow-md">
                <h2 className="text-xl font-bold mb-4">Add Contact Service</h2> {/* Updated heading */}
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
                    <label className="block mb-1" htmlFor="heading">Heading</label>
                    <input
                        type="text"
                        name="heading" // New field
                        id="heading"
                        value={formData.heading}
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
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="significance">Significance</label>
                    <input
                        type="text"
                        name="significance" // New field
                        id="significance"
                        value={formData.significance}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="plan_of_action">Plan of Action</label>
                    <input
                        type="text"
                        name="plan_of_action" // New field
                        id="plan_of_action"
                        value={formData.plan_of_action}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="why_content_image" className="block mb-2">Why Content Image</label>
                    <input
                        type="file"
                        id="why_content_image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required
                    />
                    <button 
                        type="button"
                        onClick={() => document.getElementById('why_content_image')?.click()}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Choose Image
                    </button>
                </div>
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="significance_title">Significance Title</label>
                    <input
                        type="text"
                        name="significance_title" // New field
                        id="significance_title"
                        value={formData.significance_title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="plan_of_action_title">Plan of Action Title</label>
                    <input
                        type="text"
                        name="plan_of_action_title" // New field
                        id="plan_of_action_title"
                        value={formData.plan_of_action_title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
               
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                    Upload
                </button>
            </form>
        </>
    );
};

export default Seperate_ServiceForm; // Renamed export