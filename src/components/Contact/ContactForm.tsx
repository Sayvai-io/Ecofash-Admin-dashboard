import React, { useState } from "react";

const ContactForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => { // Accept onSubmit prop
    const [formData, setFormData] = useState({
        title: "",
        subquote: "",
        bgImage: "",
        contactTitle: "",
        contactContent: "",
        contactPhone: "",
        emailTitle: "",
        emailContact: "",
        email: ""
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
            <h2 className="text-xl font-bold mb-4">Contact Form</h2>
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
                <label className="block mb-1" htmlFor="subquote">Subquote</label>
                <textarea
                    name="subquote"
                    id="subquote"
                    value={formData.subquote}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="bgImage">Background Image URL</label>
                <input
                    type="text"
                    name="bgImage"
                    id="bgImage"
                    value={formData.bgImage}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="contactTitle">Contact Title</label>
                <input
                    type="text"
                    name="contactTitle"
                    id="contactTitle"
                    value={formData.contactTitle}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="contactContent">Contact Content</label>
                <textarea
                    name="contactContent"
                    id="contactContent"
                    value={formData.contactContent}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="contactPhone">Contact Phone</label>
                <input
                    type="tel"
                    name="contactPhone"
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="emailTitle">Email Title</label>
                <input
                    type="text"
                    name="emailTitle"
                    id="emailTitle"
                    value={formData.emailTitle}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="emailContact">Email Contact</label>
                <input
                    type="text"
                    name="emailContact"
                    id="emailContact"
                    value={formData.emailContact}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1" htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                Submit
            </button>
        </form>
    );
};

export default ContactForm;