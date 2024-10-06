import React, { useState } from "react";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import Image from 'next/image'; // Import Image for displaying images
import DOMPurify from 'dompurify';

type AboutPagePreviewProps = {
    setIsEditAbout: (isEdit: boolean) => void; // Changed function name
    setAboutData: (data: any) => void; // Function to update the about data in the parent component
    aboutData?: any[]; // Changed prop name
    onDelete: (id: string) => void; // Changed function name
    onEdit: (about: any) => void; // Changed function name
};

const AboutPagePreview = ({ 
    setIsEditAbout, 
    setAboutData,
    aboutData = [], 
    onDelete, 
    onEdit 
}: AboutPagePreviewProps) => {
    const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null); // State for dropdown
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [aboutToDelete, setAboutToDelete] = useState<any>(null); // State for the about to delete

    const handleDelete = () => {
        if (aboutToDelete) {
            onDelete(aboutToDelete.id); // Call the delete function passed as a prop
            setIsModalOpen(false); // Close the modal
        }
    };

    const handleEdit = (about: any) => {
        setIsEditAbout(true); // Show edit form
        setAboutData(about); // Pass the selected about data for editing
    };

    const sanitizeHTML = (html: string) => {
        return {
            __html: DOMPurify.sanitize(html)
        };
    };

    return (
        <div className="max-w-5xl mx-auto pb-6 mt-2 bg-white border rounded-lg shadow-lg p-10 "> {/* Adjusted mt-20 for margin-top */}
            {aboutData.length === 0 ? (
                <p>No about data available.</p> // Message if no about data
            ) : (
                aboutData.map((about, index) => (
                    <>
                     <div className="border-b mb-4"> {/* Added border-bottom class */}
                        <h1 className="text-2xl text-gray-700 font-bold mb-5">About Page Preview</h1> {/* Updated heading */}
                    </div>
                    <div key={index} className="mb-4 p-4 border-b flex justify-between items-start gap-10"> {/* Added gap-4 for spacing */}
                        
                        <div className="flex-1"> {/* Allow title and content to take available space */}
                            <h3 className="text-xl text-gray-700 font-semibold mb-4" dangerouslySetInnerHTML={sanitizeHTML(about.title)}></h3> {/* Title */}
                            {about.bg_image && ( // Display About image if it exists
                                <Image 
                                    src={about.bg_image} 
                                    alt="Background Image" 
                                    width={300}  // Increased width
                                    height={200} // Increased height
                                    className="rounded-md mb-4" 
                                />
                            )}
                            <p className="text-gray-700 text-lg mb-1" dangerouslySetInnerHTML={sanitizeHTML(about.about_title)}></p> {/* About title */}
                            <p className="text-gray-700 font-semibold text-xl mb-2" dangerouslySetInnerHTML={sanitizeHTML(about.about_heading)}></p> {/* About heading */}
                            <p className="text-gray-700 mr-50 mb-4" dangerouslySetInnerHTML={sanitizeHTML(about.about_content)}></p> {/* About content */}
                            {about.about_image && ( // Display About image if it exists
                                <Image 
                                    src={about.about_image} 
                                    alt="About Image" 
                                    width={300}  // Increased width
                                    height={200} // Increased height
                                    className="rounded-md mb-4" 
                                />
                            )}
                            <p className="text-gray-700 mb-1" dangerouslySetInnerHTML={sanitizeHTML(about.mv_title)}></p> {/* MV title */}
                            <p className="text-gray-700 font-semibold text-xl mb-2" dangerouslySetInnerHTML={sanitizeHTML(about.mv_heading)}></p> {/* MV heading */}
                            <p className="text-gray-700 mr-50 mb-4" dangerouslySetInnerHTML={sanitizeHTML(about.mv_content)}></p> {/* MV content */}
                            {about.mv_image && ( // Display MV image if it exists
                                <Image 
                                    src={about.mv_image} 
                                    alt="MV Image" 
                                    width={300}  // Increased width
                                    height={200} // Increased height
                                    className="rounded-md mb-4" 
                                />
                            )}
                            <p className="text-gray-700 mb-1" dangerouslySetInnerHTML={sanitizeHTML(about.tc_title)}></p> {/* TC title */}
                            <p className="text-gray-700 font-semibold text-xl mb-2" dangerouslySetInnerHTML={sanitizeHTML(about.tc_heading)}></p> {/* TC heading */}
                            <p className="text-gray-700 mr-50 mb-4" dangerouslySetInnerHTML={sanitizeHTML(about.tc_content)}></p> {/* TC content */}
                            {about.tc_image && ( // Display TC image if it exists
                                <Image 
                                    src={about.tc_image} 
                                    alt="TC Image" 
                                    width={300}  // Increased width
                                    height={200} // Increased height
                                    className="rounded-md mb-4" 
                                />
                            )}
                            <p className="text-gray-700 font-semibold text-xl mb-2" dangerouslySetInnerHTML={sanitizeHTML(about.review_heading)}></p> {/* Review heading */}
                        </div>

                        {/* Dropdown Button */}
                        <div className="flex flex-col items-end"> {/* Align dropdown button to the right */}
                            <button 
                                className="text-gray-500 hover:text-gray-700 focus:outline-none hover:bg-gray-200 rounded-md p-2" 
                                onClick={(e) => {
                                    // Toggle dropdown without preventing scroll
                                    setDropdownOpenIndex(dropdownOpenIndex === index ? null : index);
                                }}
                            >
                                <FaEllipsisV className="h-3 w-3" />
                            </button>
                            {/* Dropdown Menu */}
                            <div className={`mt-2 w-34 bg-gray-100 border rounded-md shadow-lg z-10 ${dropdownOpenIndex === index ? 'block' : 'hidden'}`}>
                                <ul className="py-1">
                                    <li className="px-3 py-1 text-gray-700 hover:bg-gray-200 cursor-pointer flex">
                                        <button
                                            className="flex items-center"
                                            onClick={() => {
                                                setIsEditAbout(true); // Changed function call
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
                   </>
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