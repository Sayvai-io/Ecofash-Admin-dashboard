import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';

const TeamsForm = ({ onSubmit, onBack }: { onSubmit: (data: any) => void; onBack: () => void; }) => { // Accept onBack prop
    const [formData, setFormData] = useState({
        name: "",               // Changed field
        role: "",               // Updated field
        profile_image: "",      // Changed field
        profile_content: "",     // Updated field
        rating: "",             // Changed field
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
    const fileInputRef = React.useRef<HTMLInputElement | null>(null); // Ref for file input

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string); // Set image preview
                setFormData({ ...formData, profile_image: reader.result as string }); // Update formData with image
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Team Form Data Submitted:", formData); // Updated log message
        onSubmit(formData); // Call the onSubmit prop with form data
    };

    const handleCancel = () => {
        onBack(); // Call the onBack prop
    };

    const handleBack = () => {
        onBack(); // Call the onBack prop
    };
    
    return (
      
       <div className="bg-white border rounded-lg shadow-lg p-6"> {/* Added classes for styling */}
        <div className="flex items-center gap-8 border-b pt-4 pb-4 mb-4"> {/* Added flex container with gap */}
            <button onClick={handleBack} className="flex items-center mb-2 w-8 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white"> 
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            </button>
            <h1 className="text-black text-2xl font-bold mb-2">Add Team Member</h1> {/* Updated heading */}
        </div>
        <form onSubmit={handleSubmit} className="px-20">
            <h2 className="text-xl font-bold mb-4">Add Team Member</h2> {/* Updated heading */}
            <div className="mb-4">
                <label className="block mb-1" htmlFor="name">Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="role">Role</label> {/* Updated label */}
                <input
                    type="text"
                    name="role"
                    id="role"
                    value={formData.role} // Updated field
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="profile-image" className="block mb-2">Profile Image</label>
                <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                    required
                />
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#609641] text-white rounded"
                >
                    Choose Image
                </button>
                {imagePreview && (
                    <div className="mt-2">
                        <Image src={imagePreview} alt="Preview" className="max-w-xs" width={500} height={300} layout="responsive" />
                    </div>
                )}
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="profile_content">Profile Content</label> {/* Updated label */}
                <textarea
                    name="profile_content"
                    id="profile_content"
                    value={formData.profile_content} // Updated field
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="rating">Rating</label>
                <input
                    type="number"
                    name="rating"
                    id="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    min="1" max="5" // Assuming rating is between 1 and 5
                />
            </div>
            <button type="submit" className="w-20 mr-2 px-4 py-2 bg-[#609641] text-white rounded-md mt-4 mb-8">
                Upload
            </button>
            <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded-md mt-4 mb-8">Cancel</button> {/* Cancel button */}
        </form>
       </div>
    );
};

export default TeamsForm;