import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import supabase from "@/utils/supabaseClient"; // Ensure you have the supabase client set up

import DOMPurify from 'dompurify';

const Country_Address_Form = ({ onSubmitCountry, onSubmitAddress, onBack }: { onSubmitCountry: (data: any) => void; onSubmitAddress: (data: any) => void; onBack: () => void; }) => {
    const [countryName, setCountryName] = useState("");
    const [newCountryName, setNewCountryName] = useState(""); // State for new country input
    const [formData, setFormData] = useState({
        full_address: "",
        email: "",
        contact_no: "",
        country_id: "", // This will be set after country is selected
    });
    const [countries, setCountries] = useState<any[]>([]); // State to hold countries
    const [isAddressVisible, setIsAddressVisible] = useState(false); // State to manage address form visibility
    const [isAddAddressDisabled, setIsAddAddressDisabled] = useState(false); // State to manage button disable
    const [isNewCountryInputVisible, setIsNewCountryInputVisible] = useState(false); // State to manage visibility of new country input

    useEffect(() => {
        const fetchCountries = async () => {
            const { data, error } = await supabase
                .from("country")
                .select("id, country_name");

            if (error) {
                console.error("Error fetching countries:", error);
            } else {
                setCountries(data); // Set the fetched countries to state
            }
        };

        fetchCountries();
    }, []);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCountry = countries.find(country => country.id === e.target.value);
        setCountryName(selectedCountry?.country_name || "");
        setFormData({ ...formData, country_id: selectedCountry?.id || "" }); // Set country_id in formData
        setIsAddressVisible(false); // Reset address visibility when changing country
        setIsNewCountryInputVisible(false); // Hide new country input when a country is selected
    };

    const handleNewCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCountryName(e.target.value); // Update new country name
        setIsAddAddressDisabled(e.target.value.trim() === ""); // Enable/disable button based on input
    };


    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCountrySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Submit new country to the database
        const { error } = await supabase
            .from("country")
            .insert([{ country_name: newCountryName }]);

        if (error) {
            console.error("Error adding country:", error);
        } else {
            // Fetch updated countries after adding
            const { data } = await supabase
                .from("country")
                .select("id, country_name");
            if (data) {
                setCountries(data); // Update country list
                const newCountry = data.find(country => country.country_name === newCountryName);
                if (newCountry) {
                    setFormData({ ...formData, country_id: newCountry.id }); // Set country_id in formData
                    setCountryName(newCountry.country_name); // Set the selected country name
                    setIsAddressVisible(true); // Show address fields after adding new country
                }
            }
            setNewCountryName(""); // Clear new country input
            setIsNewCountryInputVisible(false); // Hide the new country input section after submission
        }
    };

    const handleAddAddressClick = () => {
        setIsAddressVisible(true); // Show address fields when "Add Address" is clicked
        setIsAddAddressDisabled(true); // Disable the "Add Address" button
    };

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmitAddress(formData);
        setFormData({ full_address: "", email: "", contact_no: "", country_id: "" }); // Clear address form after submission
        setIsAddressVisible(false); // Hide address fields after submission
        setIsAddAddressDisabled(false); // Re-enable the "Add Address" button
    };

    const handleCancel = () => {
        onBack(); // Call the onBack prop
    };

    const sanitizeHTML = (html: string) => {
        return {
            __html: DOMPurify.sanitize(html)
        };
    };
  

    return (
        <div className="bg-white border rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-8 border-b pt-4 pb-4 mb-4">
                <button onClick={onBack} className="flex items-center mb-2 w-8 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white"> 
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                </button>
                <h1 className="text-black text-2xl font-bold mb-2">Add Country and Address</h1>
            </div>
            <form onSubmit={handleCountrySubmit} className="mb-4">
                <div className="flex items-center mb-4"> {/* Flex container for alignment */}
                    <div className="flex-grow mr-2"> {/* Allow the dropdown to take available space */}
                        <label className="block mb-2 font-bold text-gray-600" htmlFor="country_name">Existing Country</label>
                        <select
                            name="country_name"
                            id="country_name"
                            value={formData.country_id}
                            onChange={handleCountryChange}
                            className="w-3/4 p-2 border rounded"
                            required
                        >
                            <option value="">Select a country</option>
                            {countries.map(country => (
                                <option key={country.id} value={country.id} dangerouslySetInnerHTML={sanitizeHTML(country.country_name)}></option>
                            ))}
                        </select>
                    </div>
                    <button 
                        type="button" 
                        onClick={handleAddAddressClick} 
                        className="w-32 mt-4 px-4 py-2 bg-[#609641] text-white rounded-md hover:bg-[#5cb85c]" // Change hover color here
                        disabled={isAddAddressDisabled || !formData.country_id} // Disable if address section is open or no country selected
                    >
                        Add Address
                    </button>
                </div>
            </form>
            {/* Conditionally render the Add New Country button only if no country is selected */}
            {!formData.country_id && (
                <button 
                    type="button" 
                    onClick={() => setIsNewCountryInputVisible(!isNewCountryInputVisible)} // Toggle new country input visibility
                    className={`w-42 mt-4 mb-4 px-4 py-2 rounded-md ${isNewCountryInputVisible ? 'bg-red-500' : 'bg-[#609641]'} text-white`}
                >
                    {isNewCountryInputVisible ? "Cancel New Country" : "Add New Country" }
                </button>
            )}
            {isNewCountryInputVisible && ( // Conditionally render the new country input section
                <form onSubmit={handleCountrySubmit} className="mb-4">
                    <div className="flex items-center mb-4"> {/* Flex container for alignment */}
                        <div className="flex-grow mr-2"> 
                            <label className="block mb-1" htmlFor="new_country_name">New Country Name</label>
                            <input
                                type="text"
                                name="new_country_name"
                                id="new_country_name"
                                value={newCountryName}
                                onChange={handleNewCountryChange}
                                className="w-3/4 p-2 border rounded"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-42 mt-4 px-4 py-2 bg-[#609641] text-white rounded-md"
                            disabled={!newCountryName.trim()} // Disable if new country name is empty
                        >
                            Save New Country
                        </button>
                    </div>
                </form>
            )}
            {isAddressVisible && (
                <form onSubmit={handleAddressSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1" htmlFor="full_address">Full Address</label>
                        <input
                            type="text"
                            name="full_address"
                            id="full_address"
                            value={formData.full_address}
                            onChange={handleAddressChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1" htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleAddressChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1" htmlFor="contact_no">Contact No</label>
                        <input
                            type="text"
                            name="contact_no"
                            id="contact_no"
                            value={formData.contact_no}
                            onChange={handleAddressChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button type="submit" className="w-20 mr-2 px-4 py-2 bg-[#609641] text-white rounded-md mt-4 mb-8">
                        Save
                    </button>
                    <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded-md mt-4 mb-8">Cancel</button> {/* Cancel button */}
                </form>
            )}
        </div>
    );
};


export default Country_Address_Form;