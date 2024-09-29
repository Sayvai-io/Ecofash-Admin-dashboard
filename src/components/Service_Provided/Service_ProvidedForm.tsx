import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';

const ContactServiceForm = ({ onSubmit, onBack }: { onSubmit: (data: any) => void; onBack: () => void; }) => { // Renamed component
    const [formData, setFormData] = useState({
        title: "",              // Changed field
        content: "",            // Changed field
        bg_image: "",           // Changed field
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
                setFormData({ ...formData, bg_image: reader.result as string }); // Update formData with image
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
                    <label htmlFor="bg-image" className="block mb-2">Background Image</label>
                    <input
                        type="file"
                        id="bg-image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required
                    />
                    <button 
                        type="button"
                        onClick={() => document.getElementById('bg-image')?.click()}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Choose Image
                    </button>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                    Upload
                </button>
            </form>
        </>
    );
};

export default ContactServiceForm; // Renamed export