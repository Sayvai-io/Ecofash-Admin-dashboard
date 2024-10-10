"use client";
import React, { useEffect, useState } from "react";

import supabase from "@/utils/supabaseClient";

import { FaEllipsisV, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';


const Country_PagePreview = ({ onAddAddressToggle, onEditAddress }: { onAddAddressToggle: () => void; onEditAddress: (addressId: string) => void; }) => {

    const [countries, setCountries] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

    const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null); // Change to store address ID

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false); // For address deletion modal

    const [isCountryModalOpen, setIsCountryModalOpen] = useState(false); // For country deletion modal

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null); // New state for selected country


    useEffect(() => {
        const fetchCountries = async () => {

            const { data: countriesData, error: countriesError } = await supabase

                .from("country")

                .select(`id, country_name, addresses:address (id, full_address, email, contact_no)`);


            if (countriesError) {

                console.error("Error fetching countries:", countriesError);

            } else {

                setCountries(countriesData);

            }

            setLoading(false);

        };

        fetchCountries();

    }, []);


    const handleDeleteAddress = async () => {
        if (selectedAddressId) {
            const { error } = await supabase
                .from("address")  

                .delete()

                .eq("id", selectedAddressId);


            if (error) {

                console.error("Error deleting address:", error);

            } else {

                setCountries(countries.map(country => ({
                    ...country,
                    addresses: country.addresses.filter((address: any) => address.id !== selectedAddressId)

                })));

            }

            setIsAddressModalOpen(false);
        }

    };


    const handleDeleteCountry = async () => {
        if (selectedCountryId) {
            // Delete all addresses associated with the country first

            const { error: deleteAddressesError } = await supabase

                .from("address")

                .delete()

                .eq("country_id", selectedCountryId); // Assuming there's a foreign key reference


            if (deleteAddressesError) {

                console.error("Error deleting addresses:", deleteAddressesError);

            } else {
                // Now delete the country

                const { error } = await supabase

                    .from("country")

                    .delete()

                    .eq("id", selectedCountryId);

                if (error) {

                    console.error("Error deleting country:", error);

                } else {

                    setCountries(countries.filter(c => c.id !== selectedCountryId));

                }

            }

            setIsCountryModalOpen(false); // Close the modal after deletion

        }

    };

    if (loading) {

        return <div>Loading...</div>;

    }


    return (
        <div className="max-w-5xl mx-auto pb-6 mt-2 bg-white border rounded-lg shadow-lg p-10">

            <div className="flex border-b mb-8 mt-4 justify-between items-center">

                <h1 className="text-2xl text-gray-700 font-bold mb-8">Countries and Addresses</h1>

                <button 
                    className="flex items-center bg-[#609641] text-white mb-4 px-2 py-1 rounded-md hover:bg-[#609641] transition duration-200"

                    onClick={onAddAddressToggle}

                >

                    <FaPlus className="mr-2 " /> Add Address

                </button>

            </div>


            <div className="grid gap-4">

                {countries.map((country) => (

                    <div key={country.id} className="border rounded-md bg-gray-100 p-4 mb-4">

                        <div className="flex justify-between items-center">
                            <h2 className="text-lg mb-4 font-bold">{country.country_name}</h2>

                            <button className="text-gray-500 mb-4 hover:text-gray-700 focus:outline-none hover:bg-gray-200 rounded-md p-2" onClick={() => {

                                // Toggle dropdown for the clicked country
                                setDropdownOpenId(dropdownOpenId === country.id ? null : country.id);

                            }}>
                                <FaTrash className="h-3 w-3 hover:text-red-500" />

                            </button>

                        </div>

                        <div className="relative">

                            <div className={`absolute right-0 mt-2 w-34 bg-gray-100 border rounded-md shadow-lg z-10 ${dropdownOpenId === country.id ? 'block' : 'hidden'}`}>
                                <ul className="py-1">

                                    <li className="px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-200 cursor-pointer flex"

                                        onClick={() => {
                                            setSelectedCountryId(country.id); // Set the selected country ID

                                            setIsCountryModalOpen(true); // Open the confirmation modal for country deletion

                                        }}>

                                        <FaTrash className="mr-2" /> <span>Delete</span>

                                    </li>

                                </ul>

                            </div>

                        </div>
                        {country.addresses.length > 0 ? (

                            country.addresses.map((address: any) => (

                                <div key={address.id} className="flex p-4 border mb-2 rounded-md bg-white shadow-md hover:shadow-lg transition-shadow duration-300">

                                    <div className="ml-4  flex-grow">

                                        <p className="text-gray-700">Full Address: {address.full_address}</p>

                                        <p className="text-gray-700">Email: {address.email}</p>
                                        <p className="text-gray-700">Contact No: {address.contact_no}</p>
                                    </div>

                                    <div className="relative">

                                        <button className="text-gray-500 hover:text-gray-700 focus:outline-none hover:bg-gray-200 rounded-md p-2" onClick={() => {

                                            // Toggle dropdown for the clicked address

                                            setDropdownOpenId(dropdownOpenId === address.id ? null : address.id);
                                        }}>

                                            <FaEllipsisV className="h-3 w-3" />

                                        </button>

                                        <div className={`absolute right-0 mt-2 w-34 bg-gray-100 border rounded-md shadow-lg z-10 ${dropdownOpenId === address.id ? 'block' : 'hidden'}`}>

                                            <ul className="py-1">

                                                <li className="px-3 py-1 text-gray-700 hover:bg-gray-200 cursor-pointer flex">

                                                    <button

                                                        className="flex items-center"

                                                        onClick={() => {

                                                            setDropdownOpenId(null); // Close dropdown

                                                            onEditAddress(address.id); // Trigger edit functionality here
                                                        }}
                                                    >
                                                        <FaEdit className="mr-2" /> <span>Edit</span>
                                                    </button>
                                                </li>
                                                <li className="px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-200 cursor-pointer flex"

                                                    onClick={() => {
                                                        setSelectedAddressId(address.id);

                                                        setIsAddressModalOpen(true);

                                                    }}>

                                                    <FaTrash className="mr-2" /> <span>Delete</span>
                                                </li>

                                            </ul>

                                        </div>

                                    </div>

                                </div>

                            ))
                        ) : (
                            <p className="text-gray-700">No addresses available for this country.</p>

                        )}

                    </div>

                ))}

            </div>


            {/* Address Deletion Modal */}

            {isAddressModalOpen && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-md shadow-lg">

                        <h2 className="text-lg font-bold">Confirm Deletion</h2>

                        <p>Are you sure you want to delete this address?</p>

                        <div className="flex justify-end mt-4">
                            <button onClick={() => setIsAddressModalOpen(false)} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>

                            <button onClick={handleDeleteAddress} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>

                        </div>

                    </div>

                </div>

            )}


            {/* Country Deletion Modal */}

            {isCountryModalOpen && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

                    <div className="bg-white p-4 rounded-md shadow-lg">

                        <h2 className="text-lg font-bold">Confirm Deletion</h2>

                        <p>Are you sure you want to delete this overall country and its associated addresses?</p>
                        <div className="flex justify-end mt-4">

                            <button onClick={() => setIsCountryModalOpen(false)} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>

                            <button onClick={handleDeleteCountry} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );

};


export default Country_PagePreview;