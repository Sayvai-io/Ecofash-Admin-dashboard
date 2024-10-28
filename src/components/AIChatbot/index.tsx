"use client"
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaCopy } from 'react-icons/fa'; // Import icons for visibility toggle and copy

const AIChatbot = () => {
    const [apiKey, setApiKey] = useState(""); // State to hold the API key
    const [isVisible, setIsVisible] = useState(false); // State to toggle visibility
    const [customPrompt, setCustomPrompt] = useState(""); // State to hold the custom prompt

    const toggleVisibility = () => {
        setIsVisible(!isVisible); // Toggle the visibility state
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey); // Copy API key to clipboard
        alert("API key is copied!"); // Show alert message
    };

    return (
        <div className="max-w-5xl mx-auto pb-6 mt-2 bg-white border rounded-lg shadow-lg p-10 "> {/* Adjusted mt-20 for margin-top */}
            <h2 className="text-lg font-bold mb-4">API Key</h2> {/* Added heading for API Key */}
            <div className="flex items-center border rounded-lg p-2 w-full md:w-3/4"> {/* Box for API Key input with responsive width */}
                <input
                    type={isVisible ? "text" : "password"} // Toggle input type based on visibility
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-grow outline-none" // Set a maximum width for the input
                    placeholder="Enter your API key" // Optional placeholder
                />
                <button onClick={toggleVisibility} className="ml-2"> {/* Button to toggle visibility */}
                    {isVisible ? <FaEye /> : <FaEyeSlash />} {/* Show/hide icon based on visibility state */}
                </button>
                <button onClick={handleCopy} className="ml-2"> {/* Button to copy API key */}
                    <FaCopy /> {/* Copy icon */}
                </button>
            </div>

            {/* Custom Prompt Section */}
            <h2 className="text-lg font-bold mt-6 mb-4">AI Chat Custom Prompt</h2> {/* Heading for custom prompt */}
            <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full border rounded-lg p-2 resize-y" // Make it resizable
                placeholder="Enter your custom prompt" // Placeholder for custom prompt
                rows={12} // Initial number of rows
            />
        </div>
    );
};

export default AIChatbot;
