"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import supabase from "@/utils/supabaseClient";
import { FaEllipsisV, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import DOMPurify from 'dompurify';

type TeamPagePreview = {
  setIsEditTeam: (isEdit: boolean) => void;
  setTeamId: (isTeam: any) => void;
  teamData?: any[];
  onDelete: (id: string) => void;
  onEdit: (contact: any) => void;
  onAddTeamToggle: () => void;
};

const TeamsPagePreview = ({ 
  setIsEditTeam,
  setTeamId,
  teamData,
  onDelete,
  onEdit,
  onAddTeamToggle // Pass the toggle function
}: TeamPagePreview) => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false); // State to manage Add Team form visibility

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase
        .from("teams") // Change to your table name
        .select("*");

      if (error) {
        console.error("Error fetching teams:", error);
      } else {
        setTeams(data);
      }
      setLoading(false);
    };

    fetchTeams();
  }, []);

  const handleDeleteTeam = async () => {
    if (selectedTeamId) {
      const { error } = await supabase
        .from("teams") // Change to your table name
        .delete()
        .eq("id", selectedTeamId);

      if (error) {
        console.error("Error deleting team:", error);
      } else {
        setTeams(teams.filter(team => team.id !== selectedTeamId));
      }
      setIsModalOpen(false);
    }
  };

  const handleAddTeamSubmit = (newTeam: any) => {
    setTeams([...teams, newTeam]); // Add the new team to the list
    setIsAddTeamOpen(false); // Close the Add Team form
  };

  const sanitizeHTML = (html: string) => {
    return {
        __html: DOMPurify.sanitize(html)
    };
};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    
    <div className="max-w-5xl mx-auto pb-6 mt-2 bg-white border rounded-lg shadow-lg p-10 "> {/* Adjusted mt-20 for margin-top */}
      <div className="flex border-b mb-8 mt-4 justify-between items-center">
        <h1 className="text-2xl text-gray-700 font-bold mb-4">Teams Preview</h1>
        <button 
          className="flex items-center bg-[#609641] text-white mb-4 px-2 py-1 rounded-md hover:bg-[#609641] transition duration-200"
          onClick={onAddTeamToggle} // Use the passed toggle function
        >
          <FaPlus className="mr-2" /> Add Team
        </button>
      </div>

    
      <div className="grid gap-4">
        {teams.map((team, index) => (
          <div key={team.id} className="flex p-4 border rounded-md bg-white shadow-md dark:bg-gray-dark dark:shadow-card hover:shadow-lg transition-shadow duration-300">
            <div className="flex-shrink-0">
              {team.profile_image ? (
                <Image
                  src={team.profile_image}
                  alt={team.name}
                  width={150}
                  height={100}
                  className="rounded-md"
                />
              ) : (
                <div className="w-[150px] h-[100px] bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
            <div className="ml-4 flex-grow">
              <h2 className="text-xl text-gray-700 font-semibold" dangerouslySetInnerHTML={sanitizeHTML(team.name)}></h2>
              <p className="text-gray-700 font-semibold" dangerouslySetInnerHTML={sanitizeHTML(team.role)}></p>
              <p className="text-gray-700" dangerouslySetInnerHTML={sanitizeHTML(team.profile_content)}></p>
            </div>
            <div className="relative">
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none hover:bg-gray-200 rounded-md p-2" onClick={() => setDropdownOpenIndex(dropdownOpenIndex === index ? null : index)}>
                <FaEllipsisV className="h-3 w-3" />
              </button>
              <div className={`absolute right-0 mt-2 w-34 bg-gray-100 border rounded-md shadow-lg z-10 ${dropdownOpenIndex === index ? 'block' : 'hidden'}`}>
                <ul className="py-1">
                  <li className="px-3 py-1 text-gray-700 hover:bg-gray-200 cursor-pointer flex">
                    <button
                      className="flex items-center"
                      onClick={() => {
                        setDropdownOpenIndex(null);
                        setTeamId(team.id);
                        setIsEditTeam(true);
                      }}
                    >
                      <FaEdit className="mr-2" /> <span>Edit</span>
                    </button>
                  </li>
                  <li className="px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-200 cursor-pointer flex"
                    onClick={() => {
                      setSelectedTeamId(team.id);
                      setIsModalOpen(true);
                    }}>
                    <FaTrash className="mr-2" /> <span>Delete</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-lg">
            <h2 className="text-lg font-bold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this team member?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setIsModalOpen(false)} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDeleteTeam} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPagePreview;