import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const PUBLICATIONS = [
  {
    id: "pub-budding-sprouts-2026",
    title: "The Budding Sprouts - Annual School Magazine",
    category: "Magazine & Newsletter",
    edition: "Vol. XIX, 2025-26",
    publishedDate: "January 15, 2026",
    academicYear: "2025-2026",
    pages: 36,
    fileSize: "14.2 MB",
    editorOrAuthor: "School Editorial Board & Literary Guild",
    fileName: "Kids_Foundation_The_Budding_Sprouts_2025_26.pdf",
    description: "The flagship annual publication of Kids' Foundation School celebrating student creativity, original poetry, creative essays, artwork, faculty reflections, and school achievements across sports, academics, and performing arts.",
    highlights: [
      "Founder's & Principal's Annual Keynote",
      "Student Literary Section: 40+ Original Poems & Short Stories",
      "Visual Arts Showcase: Paintings from Fine Arts Guild",
      "CBSE Board Achievers & Merit Roll of Honour",
      "Annual Sports & Cultural Meet Photo Journal",
      "Alumni Reflections & Faculty Contributions",
    ],
  },
  {
    id: "pub-academic-handbook-2026-27",
    title: "Curriculum & Academic Assessment Handbook",
    category: "Academic Handbook",
    edition: "Session 2026-27",
    publishedDate: "February 01, 2026",
    academicYear: "2026-2027",
    pages: 24,
    fileSize: "4.8 MB",
    editorOrAuthor: "Academic Council & Curriculum Committee",
    fileName: "Kids_Foundation_Curriculum_Handbook_2026_27.pdf",
    description: "An in-depth guide detailing CBSE curriculum structures, competency-based learning modules, continuous assessment blueprints, examination schedules, and subject weightages across Foundational, Preparatory, Middle, and Secondary stages.",
    highlights: [
      "NEP 2020 Pedagogical Framework Alignment",
      "Subject-wise Term Blueprint & Grading Criteria",
      "Internal Assessment & Project Work Guidelines",
      "Co-Scholastic & Skill Development Pathways",
      "Academic Calendar with Key Assessment Dates",
    ],
  },
  {
    id: "pub-green-chronicle-vol4",
    title: "The Green Chronicle - Science & Eco-Club Bulletin",
    category: "Magazine & Newsletter",
    edition: "Issue 4, Winter 2025",
    publishedDate: "December 20, 2025",
    academicYear: "2025-2026",
    pages: 18,
    fileSize: "6.5 MB",
    editorOrAuthor: "Eco Warriors Club & Dept. of Science",
    fileName: "Kids_Foundation_Green_Chronicle_Vol4.pdf",
    description: "A student-edited science and environmental newsletter spotlighting campus green initiatives, biodiversity preservation studies in Manipur, renewable energy projects, and tips for zero-waste living.",
    highlights: [
      "Campus Herbal Garden Flora Documentation",
      "Student Innovations at Regional Science Fair",
      "Loktak Lake Ecosystem Awareness Article",
      "DIY Sustainable Composting for Households",
      "Young Environmentalist Awards & Interviews",
    ],
  },
  {
    id: "pub-annual-sports-souvenir-2026",
    title: "Annual Sports & Cultural Meet Souvenir",
    category: "Annual Report",
    edition: "20th Annual Meet Edition",
    publishedDate: "November 28, 2025",
    academicYear: "2025-2026",
    pages: 28,
    fileSize: "18.1 MB",
    editorOrAuthor: "Physical Education Dept. & Cultural Cell",
    fileName: "Kids_Foundation_Sports_Souvenir_2025_26.pdf",
    description: "A commemorative photo-rich publication documenting the thrilling 20th Annual Sports & Cultural Meet. Contains complete medal tallies, record-breaking performances, Taekwondo demonstrations, and traditional dance performances.",
    highlights: [
      "Complete House-wise Points Table & Champions Trophy",
      "Track & Field New School Records",
      "Martial Arts (Taekwondo & Karate) Medal Winners",
      "Traditional Manipuri Folk Dance Extravaganza",
      "Parent & Teacher Exhibition Matches",
    ],
  },
  {
    id: "pub-parent-student-guide-2026",
    title: "Parent & Student Information Handbook",
    category: "Parent & Student Guide",
    edition: "Updated 2026-27 Edition",
    publishedDate: "January 05, 2026",
    academicYear: "2026-2027",
    pages: 20,
    fileSize: "3.2 MB",
    editorOrAuthor: "School Administration & Student Welfare Cell",
    fileName: "Kids_Foundation_Parent_Student_Handbook_2026.pdf",
    description: "Essential institutional guide outlining school timings, code of conduct, uniform guidelines, transport routes, healthcare facilities, digital portal access, and parent-teacher communication protocols.",
    highlights: [
      "School Timing, Bell Schedule & Attendance Norms",
      "School Uniform & Dress Code Specifications",
      "Bus Routes, Pickup Nodes & Fleet Safety Norms",
      "Infirmary & Emergency Healthcare Guidelines",
      "Parent-School Communication Protocol & Visiting Hours",
    ],
  },
  {
    id: "pub-foundational-learning-framework",
    title: "Foundational Stage Pedagogical Framework (Pre-Nursery to Grade II)",
    category: "Academic Handbook",
    edition: "NEP 2020 NCF-FS Aligned",
    publishedDate: "October 14, 2025",
    academicYear: "2025-2026",
    pages: 22,
    fileSize: "5.1 MB",
    editorOrAuthor: "Early Childhood Care & Education (ECCE) Faculty",
    fileName: "Kids_Foundation_Foundational_Stage_Framework.pdf",
    description: "A comprehensive guide on play-way and toy-based learning methodologies practiced at Kids' Foundation for developing foundational literacy, numeracy, social-emotional development, and physical motor skills in early learners.",
    highlights: [
      "Panchakosha Holistic Child Development Model",
      "Play-Based Numeracy & Early Literacy Modules",
      "Sensory Play & Fine Motor Coordination Activities",
      "Assessment Without Exam Stress: Observation Rubrics",
      "Guidance for Parents on Home Learning Environments",
    ],
  },
  {
    id: "pub-young-voices-anthology",
    title: "Young Voices - Literary Guild Anthology",
    category: "Magazine & Newsletter",
    edition: "Spring Edition 2026",
    publishedDate: "February 20, 2026",
    academicYear: "2025-2026",
    pages: 26,
    fileSize: "7.8 MB",
    editorOrAuthor: "The Kids' Foundation Literary & Debate Society",
    fileName: "Kids_Foundation_Young_Voices_Anthology_2026.pdf",
    description: "A curated collection of short fiction, haikus, reflective prose, and argumentative essays penned exclusively by students from Grades VI to X, celebrating adolescent expression and critical thinking.",
    highlights: [
      "Winning Entries from the Inter-School Creative Writing Fest",
      "Bilingual Poetry Section (English & Meiteilon)",
      "Book Reviews & Cinematic Critiques by Students",
      "Debate Transcripts on Youth & Artificial Intelligence",
      "Illustrations and Sketches by Student Artists",
    ],
  },
  {
    id: "pub-annual-governance-report-2025",
    title: "Annual Institutional & Academic Progress Report",
    category: "Annual Report",
    edition: "Annual Review 2024-25",
    publishedDate: "September 30, 2025",
    academicYear: "2024-2025",
    pages: 32,
    fileSize: "8.9 MB",
    editorOrAuthor: "School Managing Committee (SMC)",
    fileName: "Kids_Foundation_Annual_Institutional_Report_2025.pdf",
    description: "Official institutional report presented to the School Managing Committee and stakeholders, detailing academic board results, infrastructure upgrades, faculty professional development programs, and future developmental horizons.",
    highlights: [
      "CBSE Secondary School Examination Performance Summary",
      "Campus Infrastructure Upgrades: New STEM Lab & Library Wing",
      "Faculty Capacity Building & Pedagogical Workshops",
      "Community Outreach Initiatives & Scholarships Conferred",
      "Financial Prudence & Development Plan 2025-2030",
    ],
  },
];

async function generateAllPdfs() {
  const targetDir = path.resolve("./public/documents/publications");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const pub of PUBLICATIONS) {
    const doc = await PDFDocument.create();
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

    // Color definitions
    const navy = rgb(0.09, 0.204, 0.373); // #17345F
    const coral = rgb(0.957, 0.486, 0.38); // #F47C61
    const gold = rgb(0.984, 0.749, 0.141); // #FBBF24
    const darkGray = rgb(0.2, 0.25, 0.3);
    const lightGray = rgb(0.96, 0.97, 0.98);
    const borderGray = rgb(0.85, 0.88, 0.91);

    // ================= PAGE 1: COVER PAGE =================
    const cover = doc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = cover.getSize();

    // Top Header Banner
    cover.drawRectangle({
      x: 0,
      y: height - 160,
      width: width,
      height: 160,
      color: navy,
    });

    // Decorative Coral Accent Stripe
    cover.drawRectangle({
      x: 0,
      y: height - 166,
      width: width,
      height: 6,
      color: coral,
    });

    // School Name & CBSE details
    cover.drawText("KIDS' FOUNDATION SCHOOL", {
      x: 40,
      y: height - 55,
      size: 24,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    cover.drawText("Affiliated to CBSE, New Delhi | Affiliation No: 1230049 | Estd. 2005", {
      x: 40,
      y: height - 80,
      size: 11,
      font: fontRegular,
      color: gold,
    });

    cover.drawText("Airport Road, Ghari, Imphal-West, Manipur - 795001", {
      x: 40,
      y: height - 100,
      size: 10,
      font: fontRegular,
      color: rgb(0.85, 0.9, 0.98),
    });

    cover.drawText("OFFICIAL INSTITUTIONAL PUBLICATION", {
      x: 40,
      y: height - 130,
      size: 10,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    // Category Badge
    cover.drawRectangle({
      x: 40,
      y: height - 230,
      width: 220,
      height: 30,
      color: rgb(0.93, 0.95, 0.99),
      borderColor: borderGray,
      borderWidth: 1,
    });
    cover.drawText(pub.category.toUpperCase(), {
      x: 52,
      y: height - 219,
      size: 10,
      font: fontBold,
      color: navy,
    });

    // Publication Title (wrapped)
    let yPos = height - 280;
    const words = pub.title.split(" ");
    let line = "";
    for (const w of words) {
      const testLine = line ? `${line} ${w}` : w;
      if (testLine.length > 36) {
        cover.drawText(line, {
          x: 40,
          y: yPos,
          size: 22,
          font: fontBold,
          color: navy,
        });
        line = w;
        yPos -= 28;
      } else {
        line = testLine;
      }
    }
    if (line) {
      cover.drawText(line, {
        x: 40,
        y: yPos,
        size: 22,
        font: fontBold,
        color: navy,
      });
      yPos -= 28;
    }

    // Edition & Academic Year Subheading
    cover.drawText(`${pub.edition}  •  Academic Year ${pub.academicYear}`, {
      x: 40,
      y: yPos - 10,
      size: 13,
      font: fontBold,
      color: coral,
    });

    // Description Container Box
    const descBoxY = yPos - 170;
    cover.drawRectangle({
      x: 40,
      y: descBoxY,
      width: width - 80,
      height: 120,
      color: lightGray,
      borderColor: borderGray,
      borderWidth: 1,
    });

    cover.drawText("EXECUTIVE OVERVIEW", {
      x: 55,
      y: descBoxY + 95,
      size: 10,
      font: fontBold,
      color: navy,
    });

    // Wrap description text
    const descWords = pub.description.split(" ");
    let dLine = "";
    let dY = descBoxY + 75;
    for (const dw of descWords) {
      const testLine = dLine ? `${dLine} ${dw}` : dw;
      if (testLine.length > 70) {
        cover.drawText(dLine, {
          x: 55,
          y: dY,
          size: 10,
          font: fontRegular,
          color: darkGray,
        });
        dLine = dw;
        dY -= 15;
      } else {
        dLine = testLine;
      }
    }
    if (dLine) {
      cover.drawText(dLine, {
        x: 55,
        y: dY,
        size: 10,
        font: fontRegular,
        color: darkGray,
      });
    }

    // Highlights Section
    cover.drawText("DOCUMENT HIGHLIGHTS & INCLUDED SECTIONS", {
      x: 40,
      y: descBoxY - 30,
      size: 12,
      font: fontBold,
      color: navy,
    });

    let hY = descBoxY - 55;
    pub.highlights.forEach((h, idx) => {
      cover.drawText(`[${idx + 1}]  ${h}`, {
        x: 50,
        y: hY,
        size: 10,
        font: fontRegular,
        color: darkGray,
      });
      hY -= 20;
    });

    // Bottom Metadata Footer
    cover.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: 70,
      color: lightGray,
      borderColor: borderGray,
      borderWidth: 1,
    });

    cover.drawText(`Published: ${pub.publishedDate}  |  Editor: ${pub.editorOrAuthor}`, {
      x: 40,
      y: 42,
      size: 9.5,
      font: fontBold,
      color: darkGray,
    });

    cover.drawText("© 2026 Kids' Foundation School. All rights reserved. • kidsfoundation.edu.in", {
      x: 40,
      y: 25,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.5, 0.55, 0.6),
    });

    cover.drawText("Page 1 of 2", {
      x: width - 90,
      y: 25,
      size: 9,
      font: fontBold,
      color: darkGray,
    });

    // ================= PAGE 2: DETAILED RECORD & CODE =================
    const page2 = doc.addPage([595.28, 841.89]);
    
    // Page 2 top header bar
    page2.drawRectangle({
      x: 0,
      y: height - 50,
      width: width,
      height: 50,
      color: navy,
    });

    page2.drawText("KIDS' FOUNDATION SCHOOL, IMPHAL — OFFICIAL PUBLICATION ARCHIVE", {
      x: 40,
      y: height - 32,
      size: 10,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page2.drawText("Institutional Governance & Academic Transparency", {
      x: 40,
      y: height - 80,
      size: 16,
      font: fontBold,
      color: navy,
    });

    page2.drawText(
      "Kids' Foundation School is dedicated to holistic student development, academic transparency, and",
      { x: 40, y: height - 105, size: 10, font: fontRegular, color: darkGray }
    );
    page2.drawText(
      "pedagogical innovation adhering strictly to NEP 2020 guidelines and CBSE quality benchmarks.",
      { x: 40, y: height - 120, size: 10, font: fontRegular, color: darkGray }
    );

    // Metadata Table
    const tableY = height - 160;
    page2.drawRectangle({
      x: 40,
      y: tableY - 140,
      width: width - 80,
      height: 140,
      color: rgb(1, 1, 1),
      borderColor: borderGray,
      borderWidth: 1,
    });

    const metaItems = [
      ["Publication Identifier", pub.id.toUpperCase()],
      ["Academic Session", pub.academicYear],
      ["Official Edition", pub.edition],
      ["Date of Issue", pub.publishedDate],
      ["Authoring Authority", pub.editorOrAuthor],
      ["Format & Document Size", `${pub.format || "PDF"} (${pub.fileSize})`],
    ];

    let rowY = tableY - 20;
    metaItems.forEach(([label, value]) => {
      page2.drawText(label, { x: 55, y: rowY, size: 9.5, font: fontBold, color: navy });
      page2.drawText(value, { x: 230, y: rowY, size: 9.5, font: fontRegular, color: darkGray });
      rowY -= 20;
    });

    // Verification Seal box
    page2.drawRectangle({
      x: 40,
      y: tableY - 260,
      width: width - 80,
      height: 90,
      color: rgb(0.96, 0.98, 1),
      borderColor: rgb(0.7, 0.8, 0.95),
      borderWidth: 1,
    });

    page2.drawText("AUTHENTICATION & CERTIFICATION NOTICE", {
      x: 55,
      y: tableY - 190,
      size: 10,
      font: fontBold,
      color: navy,
    });

    page2.drawText(
      "This digital publication is issued under the authority of the School Managing Committee (SMC),",
      { x: 55, y: tableY - 210, size: 9, font: fontRegular, color: darkGray }
    );
    page2.drawText(
      "Kids' Foundation School, Airport Road, Ghari, Imphal-West, Manipur. For official inquiries,",
      { x: 55, y: tableY - 225, size: 9, font: fontRegular, color: darkGray }
    );
    page2.drawText(
      "contact the administration office at kidsfoundationghari@gmail.com or call +91 98621 23456.",
      { x: 55, y: tableY - 240, size: 9, font: fontRegular, color: darkGray }
    );

    // Page 2 Footer
    page2.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: 50,
      color: lightGray,
      borderColor: borderGray,
      borderWidth: 1,
    });

    page2.drawText("Kids' Foundation School, Imphal • Official Documentation Cell", {
      x: 40,
      y: 20,
      size: 9,
      font: fontRegular,
      color: rgb(0.4, 0.45, 0.5),
    });

    page2.drawText("Page 2 of 2", {
      x: width - 90,
      y: 20,
      size: 9,
      font: fontBold,
      color: darkGray,
    });

    const pdfBytes = await doc.save();
    const filePath = path.join(targetDir, pub.fileName);
    fs.writeFileSync(filePath, pdfBytes);
    console.log(`Generated: ${filePath}`);
  }
  console.log("All PDFs generated successfully!");
}

generateAllPdfs().catch(console.error);
