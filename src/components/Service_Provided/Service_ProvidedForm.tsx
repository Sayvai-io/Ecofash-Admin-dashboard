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

    const handleCancel = () => {
        onBack();
    };

    const handleBack = () => {
        onBack();
    };

    return (
        <div className="bg-white border rounded-lg shadow-lg p-6"> {/* Added classes for styling */}
            <div className="flex items-center gap-8 border-b pt-4 pb-4 mb-4"> {/* Added flex container with gap */}
                <button onClick={handleBack} className="flex items-center mb-2 w-8 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white"> 
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                </button>
                <h1 className="text-black text-2xl font-bold mb-2">Add Review</h1> {/* Removed margin-top since gap is applied */}
            </div>
            <form onSubmit={handleSubmit} className="px-20">
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
                    <label htmlFor="bg-image" className="block mb-2 ">Background Image</label>
                    <input
                        type="file"
                        id="bg-image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden "
                        required
                    />
                    <button 
                        type="button"
                        onClick={() => document.getElementById('bg-image')?.click()}
                        className="px-4 py-2 bg-[#609641] text-white rounded"
                    >
                        Choose Image
                    </button>
                </div>
                <button type="submit" className="w-20 mr-2 px-4 py-2 bg-[#609641] text-white rounded-md ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''} mt-4 mb-8">
                   Upload
                </button>
                <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded-md mt-4 mb-8">Cancel</button> {/* Cancel button */}
            </form>
        </div >
    );
};

export default ContactServiceForm; // Renamed export