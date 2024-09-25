import React from "react";
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
 
const ContactSection=()=>{

    

    
    return(
        <div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                Add Contact
            </button>
        </div>
    )
}

export default ContactSection;