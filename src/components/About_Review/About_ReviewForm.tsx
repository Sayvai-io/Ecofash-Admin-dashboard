import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';

const About_ReviewForm = ({ onSubmit, onBack }: { onSubmit: (data: any) => void; onBack: () => void; }) => { // Accept onBack prop
    const [formData, setFormData] = useState({
        name: "",               // Changed field
        designation: "",        // Changed field
        profile_image: "",      // Changed field
        comments: "",           // Changed field
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
        console.log("Review Form Data Submitted:", formData);
        onSubmit(formData); // Call the onSubmit prop with form data
    };
    const handleBack = () => {
        onBack(); // Call the onBack prop
    };
    
    return (
        <>
       <button onClick={handleBack} className="top-4 left-4 flex items-center w-20 px-4 py-2 bg-gray-500 text-white rounded"> {/* Back button */}
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> {/* Left arrow icon */}
        Back
      </button>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">AddReview</h2> {/* Updated heading */}
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
                <label className="block mb-1" htmlFor="designation">Designation</label>
                <input
                    type="text"
                    name="designation"
                    id="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="blog-image" className="block mb-2">Profile Image</label>
                <input
                    type="file"
                    id="blog-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                    required
                />
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
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
                <label className="block mb-1" htmlFor="comments">Comments</label>
                <textarea
                    name="comments"
                    id="comments"
                    value={formData.comments}
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
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                Upload
            </button>
        </form>
        </>
    );
};

export default About_ReviewForm;