import React, { useState } from "react";

const AboutForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => { // Accept onSubmit prop
    const [formData, setFormData] = useState({
        title: "",
        bg_image: "",
        about_title: "",
        about_heading: "",
        about_content: "",
        about_image: "",
        mv_title: "",
        mv_heading: "",
        mv_content: "",
        mv_image: "",
        tc_title: "",
        tc_heading: "",
        tc_content: "",
        tc_image: "",
        review_heading: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAboutSubmit = (e: React.FormEvent) => { // Renamed function
        e.preventDefault();
        console.log("About Form Data Submitted:", formData);
        onSubmit(formData); // Call the onSubmit prop with form data
    };

    return (
        <form onSubmit={handleAboutSubmit} className="max-w-lg mx-auto p-4 border rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">About Form</h2>
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
                <label className="block mb-1" htmlFor="mv_title">MV Title</label>
                <input
                    type="text"
                    name="mv_title"
                    id="mv_title"
                    value={formData.mv_title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="mv_heading">MV Heading</label>
                <input
                    type="text"
                    name="mv_heading"
                    id="mv_heading"
                    value={formData.mv_heading}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="mv_content">MV Content</label>
                <textarea
                    name="mv_content"
                    id="mv_content"
                    value={formData.mv_content}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="mv_image">MV Image URL</label>
                <input
                    type="text"
                    name="mv_image"
                    id="mv_image"
                    value={formData.mv_image}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="tc_title">TC Title</label>
                <input
                    type="text"
                    name="tc_title"
                    id="tc_title"
                    value={formData.tc_title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="tc_heading">TC Heading</label>
                <input
                    type="text"
                    name="tc_heading"
                    id="tc_heading"
                    value={formData.tc_heading}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="tc_content">TC Content</label>
                <textarea
                    name="tc_content"
                    id="tc_content"
                    value={formData.tc_content}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="tc_image">TC Image URL</label>
                <input
                    type="text"
                    name="tc_image"
                    id="tc_image"
                    value={formData.tc_image}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="review_heading">Review Heading</label>
                <input
                    type="text"
                    name="review_heading"
                    id="review_heading"
                    value={formData.review_heading}
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

export default AboutForm;