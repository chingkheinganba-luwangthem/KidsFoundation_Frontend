export interface DisclosureTableRow {
  slNo: number;
  information: string;
  details: string;
}

export interface DisclosureDocument {
  slNo: number;
  title: string;
  badge: string;
  description: string;
  officialName: string;
  refNo: string;
  issueDate: string;
  authority: string;
  validity: string;
  category: "documents" | "academics";
  hasDoc: boolean;
  documentLink: string;
  fileSize?: string;
}

export const DISCLOSURE_DOCUMENTS: DisclosureDocument[] = [
  {
    slNo: 1,
    title: "Academic Calendar 2026–27",
    badge: "Session 2026–27",
    description:
      "Annual academic schedule, examination windows, holiday list, and activity dates for Session 2026–27.",
    officialName: "ANNUAL ACADEMIC CALENDAR & ACTIVITY PLANNER",
    refNo: "KF/ACAD/CAL/2026-27",
    issueDate: "01 April 2026",
    authority: "Academic Council, Kids' Foundation",
    validity: "Session 2026–27",
    category: "academics",
    hasDoc: true,
    documentLink: "#",
    fileSize: "1.4 MB",
  },
  {
    slNo: 2,
    title: "Building Safety Certificate",
    badge: "Issued 2026",
    description:
      "Official building structural safety and fitness certificate issued by authorized civil authority.",
    officialName:
      "CERTIFICATE OF STRUCTURAL SOUNDNESS & BUILDING SAFETY (NBC COMPLIANT)",
    refNo: "PWD/BLD-SAF/2026/041",
    issueDate: "15 January 2026",
    authority: "Public Works Department (PWD), Govt. of Manipur",
    validity: "Valid through 2028",
    category: "documents",
    hasDoc: true,
    documentLink: "#",
    fileSize: "840 KB",
  },
  {
    slNo: 3,
    title: "Fee Structure for 2026–27",
    badge: "Session 2026–27",
    description:
      "Transparent breakdown of monthly tuition fees, admission charges, and activity dues for Pre-Primary to Class X.",
    officialName: "FEE STRUCTURE AND PAYMENT REGULATION SCHEDULE",
    refNo: "KF/FEE/STR/2026-27",
    issueDate: "10 March 2026",
    authority: "Management Committee, Kids' Foundation",
    validity: "Academic Year 2026–27",
    category: "academics",
    hasDoc: true,
    documentLink: "/admission",
    fileSize: "620 KB",
  },
  {
    slNo: 4,
    title: "Fire Safety Certificate",
    badge: "Valid 2026–27",
    description:
      "Fire prevention and fire safety compliance certificate issued by the Fire Service Department.",
    officialName: "NO OBJECTION CERTIFICATE FOR FIRE PREVENTION AND SAFETY",
    refNo: "FS/IMP/NOC/2026/89",
    issueDate: "05 February 2026",
    authority: "Manipur Fire Service Department, Imphal",
    validity: "Valid through February 2027",
    category: "documents",
    hasDoc: true,
    documentLink: "#",
    fileSize: "750 KB",
  },
  {
    slNo: 5,
    title: "Parents Teachers Association (PTA)",
    badge: "Active 2026",
    description:
      "Constitution, executive members list, and meeting guidelines of the Parent-Teacher Association (PTA).",
    officialName: "LIST OF PARENTS TEACHERS ASSOCIATION (PTA) MEMBERS & BYLAWS",
    refNo: "KF/PTA/EXEC/2026-01",
    issueDate: "18 January 2026",
    authority: "PTA General Body, Kids' Foundation",
    validity: "Executive Term 2026–2027",
    category: "academics",
    hasDoc: true,
    documentLink: "#",
    fileSize: "980 KB",
  },
  {
    slNo: 6,
    title: "Provisional Recognition (RTE Act)",
    badge: "Recognized",
    description:
      "Official provisional recognition and registration certificate under RTE Act, 2009 issued by Directorate of Education.",
    officialName:
      "CERTIFICATE OF RECOGNITION UNDER THE RIGHT TO EDUCATION ACT, 2009",
    refNo: "EDN/RTE/RECOG/2024-29",
    issueDate: "22 August 2024",
    authority: "Directorate of Education (Schools), Govt. of Manipur",
    validity: "Recognized through 2029",
    category: "documents",
    hasDoc: true,
    documentLink: "#",
    fileSize: "1.1 MB",
  },
  {
    slNo: 7,
    title: "School Management Committee (SMC)",
    badge: "Constituted 2026",
    description:
      "Composition, designation, and member details of the Kids' Foundation Management Committee (SMC).",
    officialName:
      "CONSTITUTION AND LIST OF SCHOOL MANAGEMENT COMMITTEE (SMC) MEMBERS",
    refNo: "KF/SMC/GA/2026/03",
    issueDate: "12 January 2026",
    authority: "Governing Body, Kids' Foundation",
    validity: "Term 2026–2028",
    category: "academics",
    hasDoc: true,
    documentLink: "#",
    fileSize: "590 KB",
  },
  {
    slNo: 8,
    title: "Certificates of DEO (Self Certification)",
    badge: "DEO Verified",
    description:
      "Self-declaration certificate submitted to and verified by the District Education Officer (DEO) for CBSE affiliation.",
    officialName:
      "DISTRICT EDUCATION OFFICER (DEO) VERIFICATION & SELF-DECLARATION FORM",
    refNo: "DEO/IW/CERT/2024/112",
    issueDate: "14 October 2024",
    authority: "District Education Office, Imphal West",
    validity: "Affiliation Cycle 2024–2029",
    category: "documents",
    hasDoc: true,
    documentLink: "#",
    fileSize: "1.8 MB",
  },
  {
    slNo: 9,
    title: "Trust Registration Certificate",
    badge: "Registered",
    description:
      "Legal registration certificate of the governing educational trust (Kids' Foundation Educational Trust).",
    officialName:
      "CERTIFICATE OF REGISTRATION UNDER SOCIETIES REGISTRATION ACT",
    refNo: "REG/SOC/MNP/2005/782",
    issueDate: "04 May 2005",
    authority: "Registrar of Societies, Govt. of Manipur",
    validity: "Permanent / Active Renewal",
    category: "documents",
    hasDoc: true,
    documentLink: "#",
    fileSize: "1.3 MB",
  },
  {
    slNo: 10,
    title: "CBSE Affiliation & Extension Letter",
    badge: "CBSE Affiliated",
    description:
      "Official grant of CBSE affiliation (Affiliation No. 1230049) and recent extension of provisional affiliation.",
    officialName:
      "GRANT OF PROVISIONAL AFFILIATION AND EXTENSION ORDER (CBSE/AFF)",
    refNo: "CBSE/AFF/1230049/2023-28",
    issueDate: "30 March 2023",
    authority: "Central Board of Secondary Education, New Delhi",
    validity: "Valid through 31 March 2028",
    category: "documents",
    hasDoc: true,
    documentLink: "#",
    fileSize: "1.6 MB",
  },
  {
    slNo: 11,
    title: "No Objection Certificate (NOC)",
    badge: "State Approved",
    description:
      "Formal No Objection Certificate issued by the State Government of Manipur for CBSE affiliation.",
    officialName: "STATE GOVERNMENT NO OBJECTION CERTIFICATE (NOC)",
    refNo: "SEC/EDN/NOC/2018/14",
    issueDate: "19 July 2018",
    authority: "Secretariat Education Department, Govt. of Manipur",
    validity: "Permanent",
    category: "documents",
    hasDoc: true,
    documentLink: "#",
    fileSize: "910 KB",
  },
  {
    slNo: 12,
    title: "Water, Health & Sanitation Certificate",
    badge: "Certified",
    description:
      "Laboratory water testing report and sanitary fitness certificate issued by the Public Health Engineering Department.",
    officialName: "DRINKING WATER PURITY & SANITARY CONDITION CERTIFICATE",
    refNo: "PHED/LAB/SAN/2026/304",
    issueDate: "12 February 2026",
    authority: "Public Health Engineering Department (PHED), Manipur",
    validity: "Valid through February 2027",
    category: "documents",
    hasDoc: true,
    documentLink: "#",
    fileSize: "720 KB",
  },
  {
    slNo: 13,
    title: "Land & Campus Ownership Certificate",
    badge: "Registered",
    description:
      "Certified revenue authority documentation proving more than 2 acres of continuous school campus ownership.",
    officialName:
      "LAND TITLE DEED, POSSESSION & CAMPUS AREA CERTIFICATE (2+ ACRES)",
    refNo: "REV/SUB-REG/IW/2012/55",
    issueDate: "08 September 2012",
    authority: "Sub-Registrar Office, Imphal West",
    validity: "Permanent Institutional Ownership",
    category: "documents",
    hasDoc: true,
    documentLink: "#",
    fileSize: "2.1 MB",
  },
  {
    slNo: 14,
    title: "Three-Year Board Examination Results",
    badge: "Board Certified",
    description:
      "Comprehensive academic outcomes, pass percentages, and subject-wise distinction summary for the last three years.",
    officialName:
      "LAST THREE-YEAR RESULT OF THE BOARD EXAMINATION AS PER APPLICABILITY",
    refNo: "KF/EXAM/CBSE/2023-25",
    issueDate: "28 May 2025",
    authority: "Examination Cell, Kids' Foundation",
    validity: "Official Archival Record",
    category: "academics",
    hasDoc: true,
    documentLink: "#",
    fileSize: "860 KB",
  },
];

export const DISCLOSURE_PAGE_DATA = {
  banner: {
    title: "Mandatory Public Disclosure",
    breadcrumb: ["Mandatory Public Disclosure"],
  },

  documents: DISCLOSURE_DOCUMENTS,

  sections: {
    generalInformation: {
      title: "A. GENERAL INFORMATION",
      rows: [
        { slNo: 1, information: "NAME OF THE SCHOOL", details: "Kids' Foundation" },
        { slNo: 2, information: "AFFILIATION NO. (IF APPLICABLE)", details: "1230049" },
        { slNo: 3, information: "SCHOOL CODE (IF APPLICABLE)", details: "13579" },
        {
          slNo: 4,
          information: "COMPLETE ADDRESS WITH PIN CODE",
          details: "Airport Road, Ghari, Imphal West, Manipur – 795001",
        },
        { slNo: 5, information: "PRINCIPAL/VICE", details: "Ch. Sunitibala Devi" },
        { slNo: 6, information: "PRINCIPAL QUALIFICATION", details: "MA English, B.Ed." },
        { slNo: 7, information: "SCHOOL EMAIL ID", details: "kidsfoundationghari@gmail.com" },
        { slNo: 8, information: "CONTACT DETAILS (LANDLINE/MOBILE)", details: "0385-2456231" },
      ] satisfies DisclosureTableRow[],
    },

    staffTeaching: {
      title: "D. STAFF (TEACHING)",
      rows: [
        { slNo: 1, information: "PRINCIPAL", details: "Ch. Sunitibala Devi" },
        { slNo: 2, information: "TOTAL NO. OF TEACHERS", details: "38" },
        { slNo: 3, information: "PGT", details: "6" },
        { slNo: 4, information: "TGT", details: "14" },
        { slNo: 5, information: "PRT", details: "18" },
        { slNo: 6, information: "TEACHER SECTION RATIO", details: "1.5 : 1" },
        { slNo: 7, information: "DETAILS OF SPECIAL EDUCATOR", details: "Qualified Special Educator on campus" },
        {
          slNo: 8,
          information: "DETAILS OF COUNSELLOR AND WELLNESS TEACHER",
          details: "Radheshyam Leishangbam, Clinical Psychologist",
        },
      ] satisfies DisclosureTableRow[],
    },

    resultClassX: {
      title: "RESULT CLASS: X",
      headers: [
        "SL.NO",
        "YEAR",
        "NO. OF REGISTERED STUDENTS",
        "NO. OF STUDENTS PASSED",
        "PASS PERCENTAGE",
        "REMARKS",
      ],
      rows: [
        ["1", "2023", "48", "48", "100%", "Exemplary Academic Performance"],
        ["2", "2024", "52", "52", "100%", "All First Division"],
        ["3", "2025", "56", "56", "100%", "Subject Distinctions across Board"],
      ],
    },

    resultClassXII: {
      title: "RESULT CLASS: XII",
      headers: [
        "SL.NO",
        "YEAR",
        "NO. OF REGISTERED STUDENTS",
        "NO. OF STUDENTS PASSED",
        "PASS PERCENTAGE",
        "REMARKS",
      ],
      rows: [] as string[][],
    },

    schoolInfrastructure: {
      title: "E. SCHOOL INFRASTRUCTURE",
      rows: [
        {
          slNo: 1,
          information: "TOTAL CAMPUS AREA OF THE SCHOOL (IN SQ. MTR.)",
          details: "8,093.71 Sq. Mtrs. (Over 2 Acres)",
        },
        {
          slNo: 2,
          information: "NO. AND SIZE OF THE CLASS ROOMS (IN SQ. FT.)",
          details: "32 Rooms (500 Sq. Ft. each, NBC compliant)",
        },
        {
          slNo: 3,
          information: "NO. AND SIZE OF LABORATORIES INCLUDING COMPUTER LAB (IN SQ. FT.)",
          details: "4 Labs (Physics, Chemistry, Biology, Computer — 800+ Sq. Ft. each)",
        },
        { slNo: 4, information: "INTERNET FACILITY", details: "YES (High-Speed Fiber 100 Mbps)" },
        { slNo: 5, information: "NO. OF GIRLS' TOILETS", details: "12 Dedicated Units" },
        { slNo: 6, information: "NO. OF BOYS' TOILETS", details: "12 Dedicated Units" },
        {
          slNo: 7,
          information: "LINK OF YOUTUBE VIDEO OF THE INSPECTION OF SCHOOL COVERING INFRASTRUCTURE",
          details: "Click Here",
        },
        { slNo: 8, information: "Kids' Foundation Physical Infrastructure Manual", details: "Click Here" },
        { slNo: 9, information: "Kids' Foundation Upgradation Docs", details: "Download" },
      ] satisfies DisclosureTableRow[],
    },
  },

  note: "NOTE: THE SCHOOLS NEED TO UPLOAD THE SELF-ATTESTED COPIES OF ABOVE LISTED DOCUMENTS BY CHAIRMAN/MANAGER/SECRETARY AND PRINCIPAL. SCHOOLS THAT ARE UNABLE TO UPLOAD DOCUMENTS CAN GET IN TOUCH WITH THEIR SCHOOL CBSE LIAISON OFFICER.",
};
