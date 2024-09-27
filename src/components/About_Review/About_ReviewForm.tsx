import React, { useState } from "react";

const About_ReviewForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => { // Accept onSubmit prop
    const [formData, setFormData] = useState({
        name: "",               // Changed field
        designation: "",        // Changed field
        profile_image: "",      // Changed field
        comments: "",           // Changed field
        rating: "",             // Changed field
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Review Form Data Submitted:", formData);
        onSubmit(formData); // Call the onSubmit prop with form data
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Review Form</h2> {/* Updated heading */}
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
                <label className="block mb-1" htmlFor="profile_image">Profile Image URL</label>
                <input
                    type="text"
                    name="profile_image"
                    id="profile_image"
                    value={formData.profile_image}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
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
                Submit
            </button>
        </form>
    );
};

export default About_ReviewForm;