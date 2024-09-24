import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("supabaseSession"); // Clear session from local storage
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      {/* ... existing code ... */}
      <div className="p-2.5">
        <button
          onClick={handleLogout} // Update this line to call handleLogout
          className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
        >
          {/* ... existing code ... */}
        </button>
      </div>
    </ClickOutside>
  );
};

export default DropdownUser;
