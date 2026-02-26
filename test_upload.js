const fs = require('fs');

async function testFullPipeline() {
    try {
        // Step 1: Upload PDF to /api/upload
        console.log("Step 1: Uploading PDF...");
        const fileData = fs.readFileSync('test_resume.pdf');
        const blob = new Blob([fileData], { type: 'application/pdf' });
        const formData = new FormData();
        formData.append('file', blob, 'test_resume.pdf');

        const uploadRes = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });
        const uploadData = await uploadRes.json();
        console.log("Upload Status:", uploadRes.status);
        console.log("Extracted text (first 200 chars):", uploadData.text?.substring(0, 200));

        if (!uploadData.success) {
            console.error("Upload failed:", uploadData.error);
            return;
        }

        // Step 2: Send text to /api/parse-resume
        console.log("\nStep 2: Parsing resume with AI...");
        const parseRes = await fetch('http://localhost:3000/api/parse-resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: uploadData.text }),
        });
        const parseData = await parseRes.json();
        console.log("Parse Status:", parseRes.status);
        console.log("Parse Result:", JSON.stringify(parseData, null, 2));

    } catch (error) {
        console.error("Test Error:", error);
    }
}

testFullPipeline();
