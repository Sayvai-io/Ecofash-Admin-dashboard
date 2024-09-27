import React, { useState } from "react";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa"; // Import icons

type AboutPagePreviewProps = {
    setIsEditAbout: (isEdit: boolean) => void; // Changed function name
    aboutData?: any[]; // Changed prop name
    onDelete: (id: string) => void; // Changed function name
    onEdit: (about: any) => void; // Changed function name
  };
  
  const AboutPagePreview = ({ 
    setIsEditAbout, 
    aboutData = [], // Changed prop name
    onDelete, 
    onEdit 
  }: AboutPagePreviewProps) => { // Accept aboutData prop and onDeleteAbout function
    const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null); // State for dropdown
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [aboutToDelete, setAboutToDelete] = useState<any>(null); // State for the about to delete

    const handleDelete = () => {
        if (aboutToDelete) {
            onDelete(aboutToDelete.id); // Call the delete function passed as a prop
            setIsModalOpen(false); // Close the modal
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 border rounded-md shadow-md pb-6"> {/* Increased width */}
            {aboutData.length === 0 ? (
                <p>No about data available.</p> // Message if no about data
            ) : (
                aboutData.map((about, index) => (
                    <div key={index} className="mb-4 p-4 border-b relative"> {/* Add bottom margin and padding */}
                        <h3 className="text-lg font-semibold mb-2">{about.title}</h3> {/* Title */}
                        <p className="text-gray-500 mb-1">{about.bg_image}</p> {/* Background image */}
                        <p className="text-gray-700 mb-1">{about.about_title}</p> {/* About title */}
                        <p className="text-gray-700 mb-1">{about.about_heading}</p> {/* About heading */}
                        <p className="text-gray-700 mb-1">{about.about_content}</p> {/* About content */}
                        <p className="text-gray-500 mb-1">{about.about_image}</p> {/* About image */}
                        <p className="text-gray-700 mb-1">{about.mv_title}</p> {/* MV title */}
                        <p className="text-gray-700 mb-1">{about.mv_heading}</p> {/* MV heading */}
                        <p className="text-gray-700 mb-1">{about.mv_content}</p> {/* MV content */}
                        <p className="text-gray-500 mb-1">{about.mv_image}</p> {/* MV image */}
                        <p className="text-gray-700 mb-1">{about.tc_title}</p> {/* TC title */}
                        <p className="text-gray-700 mb-1">{about.tc_heading}</p> {/* TC heading */}
                        <p className="text-gray-700 mb-1">{about.tc_content}</p> {/* TC content */}
                        <p className="text-gray-500 mb-1">{about.tc_image}</p> {/* TC image */}
                        <p className="text-gray-700 mb-1">{about.review_heading}</p> {/* Review heading */}

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
                                                setIsEditAbout(true) // Changed function call
                                                setDropdownOpenIndex(null);
                                                onEdit(about); // Changed function call
                                            }}
                                        >
                                            <FaEdit className="mr-2" /> <span>Edit</span>
                                        </button>
                                    </li>
                                    <li className="px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-200 cursor-pointer flex"
                                        onClick={() => {
                                            setDropdownOpenIndex(null);
                                            setAboutToDelete(about); // Changed variable name
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
                        <p>Are you sure you want to delete this about data?</p> {/* Updated message */}
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

export default AboutPagePreview;