import React, { useState } from "react";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import Image from 'next/image'; // Import Image for displaying images
import DOMPurify from 'dompurify';

type HomePagePreviewProps = { // Updated type name
    setIsEditHome: (isEdit: boolean) => void; // Changed function name
    setHomeData: (data: any) => void; // Function to update the home data in the parent component
    homeData?: any[]; // Changed prop name
    onDelete: (id: string) => void; // Changed function name
    onEdit: (home: any) => void; // Changed function name
};

const HomePagePreview = ({     
    setIsEditHome, 
    setHomeData,
    homeData = [], // Changed prop name
    onDelete, 
    onEdit 
}: HomePagePreviewProps) => { // Updated props
    const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null); // State for dropdown
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [homeToDelete, setHomeToDelete] = useState<any>(null); // State for the home to delete

    const handleDelete = () => {
        if (homeToDelete) {
            onDelete(homeToDelete.id); // Call the delete function passed as a prop
            setIsModalOpen(false); // Close the modal
        }
    };

    const handleEdit = (home: any) => {
        setIsEditHome(true); // Show edit form
        setHomeData(home); // Pass the selected home data for editing
    };

    const sanitizeHTML = (html: string) => {
        return {
            __html: DOMPurify.sanitize(html)
        };
    };
    
    return (
        <div className="max-w-5xl mx-auto pb-6 mt-2 bg-white border rounded-lg shadow-lg p-10 "> {/* Adjusted mt-20 for margin-top */}
            {homeData.length === 0 ? (
                <p>No home data available.</p> // Message if no home data
            ) : (
                homeData.map((home, index) => (
                    <>
                     <div className="border-b mb-4"> {/* Added border-bottom class */}
                        <h1 className="text-2xl text-gray-700 font-bold mb-5">Home Page Preview</h1> {/* Updated heading */}
                    </div>
                    <div key={index} className="mb-4 p-4 border-b flex justify-between items-start gap-10"> {/* Added gap-4 for spacing */}
                        
                        <div className="flex-1"> {/* Allow title and content to take available space */}
                            {home.logo_image && ( // Display Head image if it exists
                                <Image 
                                    src={home.logo_image} 
                                    alt="Logo Image" 
                                    width={300}  
                                    height={200} 
                                    className="rounded-md mb-10" 
                                />
                            )}
                            <h3 className="text-2xl text-gray-700 font-semibold mb-4">{home.heading}</h3> {/* Heading */}
                            <h3 className="text-lg text-gray-700 mb-4">{home.head_content}</h3> {/* Heading */}
                            {home.head_image && ( // Display Head image if it exists
                                <Image 
                                    src={home.head_image} 
                                    alt="Head Image" 
                                    width={300}  
                                    height={200} 
                                    className="rounded-md mb-10" 
                                />
                            )}
                            <p className="text-gray-700 text-lg mb-1">{home.about_title}</p> {/* About title */}
                            <p className="text-gray-700 font-semibold text-xl mb-2">{home.about_heading}</p> {/* About heading */}
                            <p className="text-gray-700 mr-50 mb-4"  dangerouslySetInnerHTML={sanitizeHTML(home.about_content)}
></p> {/* About content */}
                            {home.about_image && ( // Display About image if it exists
                                <Image 
                                    src={home.about_image} 
                                    alt="About Image" 
                                    width={300}  
                                    height={200} 
                                    className="rounded-md mb-4" 
                                />
                            )}
                            {home.services_image && ( // Display Ser   vices image if it exists
                                <Image 
                                    src={home.services_image} 
                                    alt="Services Image" 
                                    width={300}  
                                    height={200} 
                                    className="rounded-md mb-10" 
                                />
                            )}
                            <p className="text-gray-700 mb-1">{home.contact_heading}</p> {/* Contact heading */}
                            <p className="text-gray-700 font-semibold text-lg mb-2">{home.contact_content}</p> {/* Contact content */}
                            {home.contact_image && ( // Display Contact image if it exists
                                <Image 
                                    src={home.contact_image} 
                                    alt="Contact Image" 
                                    width={300}  
                                    height={200} 
                                    className="rounded-md mb-4" 
                                />
                            )}
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
                                                setIsEditHome(true); // Changed function call
                                                setDropdownOpenIndex(null);
                                                onEdit(home); // Changed function call
                                            }}
                                        >
                                            <FaEdit className="mr-2" /> <span>Edit</span>
                                        </button>
                                    </li>
                                    <li className="px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-200 cursor-pointer flex"
                                        onClick={() => {
                                            setDropdownOpenIndex(null);
                                            setHomeToDelete(home); // Changed variable name
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

export default HomePagePreview; // Updated export