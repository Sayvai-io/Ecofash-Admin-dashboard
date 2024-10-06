"use client";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import TeamsForm from "./TeamsForm";
import EditTeamsPage from "./EditTeamsPage";
import TeamsPagePreview from "./TeamsPagePreview";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TeamsSection = () => {
    const [teamData, setTeamData] = useState<any[]>([]); // Changed state to hold team data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // State to hold error messages
    const [isTeamEmpty, setIsTeamEmpty] = useState(false); // Changed state name
    const [isEditTeam, setIsEditTeam] = useState(false); // State for EditTeam visibility
    const [selectedTeam, setSelectedTeam] = useState<any | null>(null); // State to hold the selected team for editing
    const [teamId, setTeamId] = useState(); // State for team ID
    const [isAddTeamOpen, setIsAddTeamOpen] = useState(false); // State for Add Team form visibility

    useEffect(() => {
        const fetchTeamData = async () => {
            setLoading(true); // Set loading to true before fetching
            const { data, error } = await supabase
                .from("teams") // Fetch from the 'teams' table
                .select("*"); // Fetch all columns

            if (error) {
                console.error("Error fetching team data:", error);
                setError("Failed to fetch team data."); // Set error message
            } else {
                console.log("Fetched team data:", data); // Log the fetched data to the console
                setTeamData(data); // Set the fetched data to state
            }
            setLoading(false); 
            data?.length === 0 ? setIsTeamEmpty(true) : setIsTeamEmpty(false); // Determine if to show form or preview
        };

        fetchTeamData();
    }, []); // Empty dependency array means this runs once on mount

    const handleTeamFormSubmit = async (formData: any) => {
        const { error } = await supabase
            .from("teams") // Ensure this matches your table name
            .insert([formData]); // Insert the new team data

        if (error) {
            console.error("Error adding team data:", error);
            setError("Failed to add team data."); // Set error message
        } else {
            setTeamData([...teamData, formData]); // Update team data state
            setIsTeamEmpty(false); // Show team preview after adding
            setIsAddTeamOpen(false); // Close the Add Team form
        }
    };

    const handleDeleteTeam = (id: string) => {
        // Logic to delete the team data by id
    };

    const handleEditTeam = (team: any) => {
        setSelectedTeam(team); // Set the selected team for editing
        setIsEditTeam(true); // Show EditTeam
    };

    const handleSaveTeam = () => {
        setIsEditTeam(false); // Hide EditTeam and show preview
        setSelectedTeam(null); // Clear selected team
    };

    const handleAddTeamToggle = () => {
        setIsAddTeamOpen(prev => !prev); // Toggle the Add Team form
        if (isAddTeamOpen) {
            setIsEditTeam(false); // Close edit mode if opening add team
        }
    };

    const handleBack = () => {
        setIsAddTeamOpen(false); // Close Add Team form
        setIsEditTeam(false); // Ensure Edit mode is closed
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>{error}</div>; // Display error message if any
    }

    return (
        <div>
            {isAddTeamOpen ? (
                <TeamsForm 
                    onSubmit={handleTeamFormSubmit} 
                    onBack={handleBack} // Pass the handleBack function
                />
            ) : isEditTeam ? (
                <EditTeamsPage
                    setIsEditTeam={setIsEditTeam}
                    teamId={teamId || ''} // Ensure teamId is a string, even if undefined
                    setTeamData={(data) => setTeamData(data)} // Correctly pass the setTeamData function
                />
            ) : (
                <TeamsPagePreview 
                    setIsEditTeam={setIsEditTeam}
                    setTeamId={setTeamId}
                    teamData={teamData} 
                    onDelete={handleDeleteTeam} 
                    onEdit={handleEditTeam} // Pass handleEditTeam
                    onAddTeamToggle={handleAddTeamToggle} // Pass the toggle function
                />
            )}
        </div>
    );
}

export default TeamsSection;