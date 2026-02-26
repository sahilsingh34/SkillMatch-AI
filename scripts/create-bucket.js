const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function createBucket() {
    console.log("Creating 'resumes' bucket...");
    const { data, error } = await supabaseAdmin.storage.createBucket('resumes', {
        public: true,
        allowedMimeTypes: ['application/pdf'],
        fileSizeLimit: 10485760 // 10MB
    });

    if (error) {
        if (error.message.includes('already exists')) {
            console.log("Bucket 'resumes' already exists. Skipping creation.");
        } else {
            console.error("Error creating bucket:", error.message);
        }
    } else {
        console.log("Successfully created 'resumes' bucket!");
    }
}

createBucket();
