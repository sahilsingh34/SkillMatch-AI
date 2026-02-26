const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function createTestResume() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    page.drawText(`
Jane Doe
Senior React Engineer

Experience
- 4+ years building scalable UIs with React and Next.js.
- Strong knowledge of TypeScript, Node.js, and Tailwind CSS.
- Developed backend architectures using PostgreSQL and AWS.

Skills
React, Next.js, TypeScript, Node.js, Tailwind CSS, PostgreSQL, AWS, Figma
  `);

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('test_resume.pdf', pdfBytes);
    console.log("Created test_resume.pdf");
}

createTestResume();
