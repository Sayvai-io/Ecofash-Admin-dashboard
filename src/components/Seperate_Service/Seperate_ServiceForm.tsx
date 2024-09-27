import React, { useState } from "react";

const SeperateServiceForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => { // Accept onSubmit prop
    const [formData, setFormData] = useState({
        title: "",               // Changed field
        heading: "",             // Changed field
        content: "",             // Changed field
        significance: "",        // Changed field
        plan_of_action: "",      // Changed field
        why_content_image: "",    // Changed field
        significance_title: "",   // Changed field
        plan_of_action_title: ""  // Changed field
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Service Form Data Submitted:", formData);
        onSubmit(formData); // Call the onSubmit prop with form data
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Service Form</h2> {/* Updated heading */}
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
                    name="heading"
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
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="significance">Significance</label>
                <textarea
                    name="significance"
                    id="significance"
                    value={formData.significance}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="plan_of_action">Plan of Action</label>
                <textarea
                    name="plan_of_action"
                    id="plan_of_action"
                    value={formData.plan_of_action}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="why_content_image">Why Content Image URL</label>
                <input
                    type="text"
                    name="why_content_image"
                    id="why_content_image"
                    value={formData.why_content_image}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="significance_title">Significance Title</label>
                <input
                    type="text"
                    name="significance_title"
                    id="significance_title"
                    value={formData.significance_title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="plan_of_action_title">Plan of Action Title</label>
                <input
                    type="text"
                    name="plan_of_action_title"
                    id="plan_of_action_title"
                    value={formData.plan_of_action_title}
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

export default SeperateServiceForm;