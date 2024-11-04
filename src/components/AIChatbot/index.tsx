"use client"
import React, { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash, FaCopy } from 'react-icons/fa'; // Import icons for visibility toggle and copy
import { createClient } from '@supabase/supabase-js'; // Import Supabase client

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const AIChatbot = () => {
    const [apiKey, setApiKey] = useState(""); // State to hold the API key
    const [isVisible, setIsVisible] = useState(false); // State to toggle visibility
    const [customPrompt, setCustomPrompt] = useState(""); // State to hold the custom prompt
    const [isDirty, setIsDirty] = useState(false); // State to track if changes are made
    const [modalMessage, setModalMessage] = useState(""); // State for modal message
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const modalRef = useRef<HTMLDivElement>(null); // Ref for the modal

    // Replace with the actual ID you want to fetch and update
    const chatbotId = '2d083b0f-6359-4647-b813-77481a08b3b9'; // Example: '2d083b0f-6359-4647-b813-77481a08b3b9'

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('aichatbot') // Your actual table name
                .select('apikey, custom_prompt')
                .limit(1) // Limit to 1 row
                .single(); // Fetch a single row

            if (error) {
                console.error('Error fetching data:', error);
            } else if (data) {
                setApiKey(data.apikey);
                setCustomPrompt(data.custom_prompt);
            }
        };

        fetchData();
    }, []);

    const toggleVisibility = () => {
        setIsVisible(!isVisible); // Toggle the visibility state
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey); // Copy API key to clipboard
        setModalMessage("API key is copied!"); // Set modal message
        setIsModalOpen(true); // Open the modal

        // Automatically close the modal after 3 seconds
        setTimeout(() => {
            setIsModalOpen(false);
        }, 1500);
    };

    const handleSave = async () => {
        const { error } = await supabase
            .from('aichatbot') // Your actual table name
            .update({ apikey: apiKey, custom_prompt: customPrompt }) // Update the API key and custom prompt
            .eq('id', chatbotId); // Update the specific row by ID

        if (error) {
            console.error('Error updating data:', error);
            setModalMessage('Failed to save changes.');
            setIsModalOpen(true);
        } else {
            setModalMessage('Changes saved successfully!');
            setIsModalOpen(true);
            setIsDirty(false); // Reset dirty state after saving
        }

        // Automatically close the modal after 3 seconds
        setTimeout(() => {
            setIsModalOpen(false);
        }, 1500);
    };

    // Close modal when clicking outside of it
    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    return (
        <div className="max-w-5xl mx-auto pb-6 mt-2 bg-white border rounded-lg shadow-lg p-10 ">
            <h2 className="text-lg font-bold mb-4">OpenAI API Key</h2>
            <div className="flex items-center border rounded-lg p-2 w-full md:w-3/4">
                <input
                    type={isVisible ? "text" : "password"} // Toggle input type based on visibility
                    value={apiKey}
                    onChange={(e) => {
                        setApiKey(e.target.value);
                        setIsDirty(true); // Mark as dirty when changes are made
                    }}
                    className="flex-grow outline-none"
                    placeholder="Enter your API key"
                />
                <button onClick={toggleVisibility} className="ml-2">
                    {isVisible ? <FaEye /> : <FaEyeSlash />}
                </button>
                <button onClick={handleCopy} className="ml-2">
                    <FaCopy />
                </button>
            </div>

            <h2 className="text-lg font-bold mt-6 mb-4">AI Chatbot Custom Prompt</h2>
            <textarea
                value={customPrompt}
                onChange={(e) => {
                    setCustomPrompt(e.target.value);
                    setIsDirty(true); // Mark as dirty when changes are made
                }}
                className="w-full border rounded-lg p-2 resize-y"
                placeholder="Enter your custom prompt"
                rows={12}
            />

            <button onClick={handleSave} className={`mt-4 bg-[#609641] text-white rounded px-4 py-2 ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isDirty}>
                Save Changes
            </button>

            {/* Inline Modal for displaying messages */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div ref={modalRef} className="bg-white rounded-lg p-4 shadow-lg">
                        <p>{modalMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIChatbot;
