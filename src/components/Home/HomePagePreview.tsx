import React, { useState } from "react";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa"; // Import icons

type HomePagePreviewProps = {
    setIsEditHome: (isEdit: boolean) => void; // Changed from setIsEditContact to setIsEditHome
    homeData?: any[]; // Changed from contacts to homeData
    onDelete: (id: string) => void;
    onEdit: (home: any) => void; // Changed from contact to home
};

const HomePagePreview = ({ 
    setIsEditHome, 
    homeData = [], // Changed from contacts to homeData
    onDelete, 
    onEdit 
}: HomePagePreviewProps) => { // Accept homeData prop and onDelete function
    const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null); // State for dropdown
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [homeToDelete, setHomeToDelete] = useState<any>(null); // Changed from contactToDelete to homeToDelete

    const handleDelete = () => {
        if (homeToDelete) {
            onDelete(homeToDelete.id); // Call the delete function passed as a prop
            setIsModalOpen(false); // Close the modal
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 border rounded-md shadow-md pb-6"> {/* Increased width */}
            {homeData.length === 0 ? (
                <p>No home data available.</p> // Message if no home data
            ) : (
                homeData.map((home, index) => ( // Changed from contact to home
                    <div key={index} className="mb-4 p-4 border-b relative"> {/* Add bottom margin and padding */}
                        <h3 className="text-lg font-semibold mb-2">{home.heading}</h3> {/* Changed from contact.title to home.heading */}
                        <p className="text-gray-700 mb-1">{home.head_content}</p> {/* Changed from contact.subquotes to home.head_content */}
                        <p className="text-gray-500 mb-1">{home.head_image}</p> {/* Changed from contact.bg_image to home.head_image */}
                        <p className="text-gray-700 mb-1">{home.email}</p> {/* Changed from contact.email to home.email */}
                        <p className="text-gray-700 mb-1">{home.contact_heading}</p> {/* Changed from contact.contact_title to home.contact_heading */}
                        <p className="text-gray-700 mb-1">{home.contact_content}</p> {/* Changed from contact.contact_content to home.contact_content */}
                        <p className="text-gray-700 mb-1">{home.contact_image}</p> {/* Changed from contact.contact_phone to home.contact_image */}
                        <p className="text-gray-700 mb-1">{home.about_title}</p> {/* Added about_title */}
                        <p className="text-gray-700 mb-1">{home.about_heading}</p> {/* Added about_heading */}
                        <p className="text-gray-700 mb-1">{home.about_content}</p> {/* Added about_content */}
                        <p className="text-gray-700 mb-1">{home.about_image}</p> {/* Added about_image */}
                        <p className="text-gray-700 mb-1">{home.service}</p> {/* Added service */}

                        {/* Dropdown Button */}
                        <div className="absolute top-2 right-2">
                            <button 
                                className="text-gray-500 hover:text-gray-700 focus:outline-none hover:bg-gray-200 rounded-md p-2" 
                                onClick={() => setDropdownOpenIndex(dropdownOpenIndex === index ? null : index)}
                            >
                                <FaEllipsisV className="h-3 w-3" />
                            </button>
                            {/* Dropdown Menu */}
                            <div className={`absolute right-0 mt-2 w-34 bg-gray-100 border rounded-md shadow-lg z-10 ${dropdownOpenIndex === index ? 'block' : 'hidden'}`}>
                                <ul className="py-1">
                                    <li className="px-3 py-1 text-gray-700 hover:bg-gray-200 cursor-pointer flex">
                                        <button
                                            className="flex items-center"
                                            onClick={() => {
                                                setIsEditHome(true); // Changed from setIsEditContact to setIsEditHome
                                                setDropdownOpenIndex(null);
                                                onEdit(home); // Pass the home to onEdit
                                            }}
                                        >
                                            <FaEdit className="mr-2" /> <span>Edit</span>
                                        </button>
                                    </li>
                                    <li className="px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-200 cursor-pointer flex"
                                        onClick={() => {
                                            setDropdownOpenIndex(null);
                                            setHomeToDelete(home); // Set the home to delete
                                            setIsModalOpen(true); // Open the modal
                                        }}
                                    >
                                        <FaTrash className="mr-2" /> <span>Delete</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-md shadow-lg">
                        <h2 className="text-lg font-bold">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this home data?</p> {/* Updated message */}
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setIsModalOpen(false)} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
                            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePagePreview;