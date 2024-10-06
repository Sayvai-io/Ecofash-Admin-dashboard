import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';

const BlogForm = ({ onSubmit, onBack }: { onSubmit: (data: any) => void; onBack: () => void; }) => { // Accept onBack prop
    const [formData, setFormData] = useState({
        title: "",              // New field for title
        content: "",            // New field for content
        tags: [],               // Change to an array
        image_url: "",          // New field for image_url
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
    const fileInputRef = React.useRef<HTMLInputElement | null>(null); // Ref for file input
    const [tags, setTags] = useState<string[]>([]); // State for tags
    const [inputValue, setInputValue] = useState(""); // State for input value

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag); // Split and trim tags
        setFormData({ ...formData, tags: tagsArray as never[] }); // Update tags as an array
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string); // Set image preview
                setFormData({ ...formData, image_url: reader.result as string }); // Update formData with image
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddTag = () => {
        if (inputValue.trim()) {
            setTags([...tags, inputValue.trim()]); // Add tag to the list
            setInputValue(""); // Clear input
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag)); // Remove tag from the list
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSubmit = { ...formData, tags }; // Include tags in submitted data
        console.log("Blog Form Data Submitted:", dataToSubmit);
        onSubmit(dataToSubmit);
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
                <h1 className="text-black text-2xl font-bold mb-2">Add Review</h1> {/* Removed margin-top since gap is applied */}
            </div>
        <form onSubmit={handleSubmit} className="px-20">
            <h2 className="text-xl font-bold mb-4">Add Blog</h2> {/* Updated heading */}
            <div className="mb-4">
                <label className="block mb-1" htmlFor="title">Title</label> {/* New field for title */}
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
                <label className="block mb-1" htmlFor="content">Content</label> {/* New field for content */}
                <textarea
                    name="content"
                    id="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            
            <div className="tag-input mb-4">
                <label htmlFor="blog-tag" className="block mb-2">Tags</label>
                <div className="flex mb-2">
                    <input
                        id="blog-tag"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Add a tag"
                        className="flex-grow px-4 py-2 border rounded-l"
                    />
                    <button 
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-[#609641] text-white rounded-r"
                    >
                        Add
                    </button>
                </div>
                <div className="tags-list flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span key={tag} className="tag bg-gray-200 px-2 py-1 rounded flex items-center">
                            {tag}
                            <button 
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 text-red-500"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="blog-image" className="block mb-2">Image</label> {/* Updated label */}
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
            <button type="submit" className="w-20 mr-2 px-4 py-2 bg-[#609641] text-white rounded-md ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''} mt-4 mb-8">
                   Upload
                </button>
                <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded-md mt-4 mb-8">Cancel</button> {/* Cancel button */}
        </form>
       </div>
    );
};

export default BlogForm;