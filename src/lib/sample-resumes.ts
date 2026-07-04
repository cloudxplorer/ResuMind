
import type { ResumeData } from "./types";
import { SAMPLE_RESUME_DATA } from "./sample-data";

export interface SampleResume {
  id: string;
  title: string;
  category: string;
  description: string;
  data: ResumeData;
}

const btechEce: ResumeData = {
  contact: { name: "Rahul Sharma", title: "Embedded Systems Engineer", email: "rahul.sharma@example.com", phone: "+91-9876543210", location: "Bengaluru, India", linkedin: "linkedin.com/in/rahulsharma", github: "github.com/rahulsharma" },
  summary: "Embedded Systems Engineer with 4+ years designing firmware for IoT and automotive platforms. Shipped 12+ products with ARM Cortex-M and ESP32, cutting power consumption by 35%.",
  experience: [
    { id: "e1", company: "Tata Elxsi", role: "Embedded Engineer", location: "Bengaluru", startDate: "2021-07", endDate: "Present", current: true, bullets: ["Designed RTOS-based firmware for automotive ECUs deployed in 2M+ vehicles", "Cut boot time from 4.2s to 1.6s by optimizing memory initialization", "Led migration from bare-metal to FreeRTOS, improving task scheduling reliability by 40%"] },
    { id: "e2", company: "Larsen & Toubro", role: "Junior Embedded Developer", location: "Mumbai", startDate: "2019-08", endDate: "2021-06", bullets: ["Developed sensor drivers for industrial monitoring systems", "Implemented MODBUS protocol reducing data latency by 28%"] }
  ],
  projects: [{ id: "p1", name: "SmartHome Hub", description: "IoT home automation controller", tech: ["ESP32", "FreeRTOS", "MQTT", "C"], bullets: ["Built Wi-Fi + BLE hub controlling 50+ devices with sub-100ms response"] }],
  education: [{ id: "ed1", school: "VIT University", degree: "B.Tech", field: "Electronics & Communication", startDate: "2015-08", endDate: "2019-05", gpa: "8.7" }],
  certificates: [{ id: "c1", name: "ARM Accredited Engineer", issuer: "ARM Ltd.", date: "2022-03" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Languages", items: ["C", "C++", "Python", "Assembly"] }, { id: "s2", category: "Platforms", items: ["ARM Cortex-M", "ESP32", "STM32", "Raspberry Pi"] }, { id: "s3", category: "Tools", items: ["Keil", "GDB", "Oscilloscope", "JTAG"] }]
};

const btechMech: ResumeData = {
  contact: { name: "Priya Nair", title: "Mechanical Design Engineer", email: "priya.nair@example.com", phone: "+91-9988776655", location: "Pune, India", linkedin: "linkedin.com/in/priyanair" },
  summary: "Mechanical Design Engineer with 5+ years in automotive and aerospace components. Expert in SolidWorks and ANSYS, delivering cost-optimized designs that reduced material waste by 22%.",
  experience: [
    { id: "e1", company: "Bosch India", role: "Design Engineer", location: "Pune", startDate: "2020-06", endDate: "Present", current: true, bullets: ["Designed 15+ automotive bracket components achieving 18% weight reduction", "Simulated stress profiles in ANSYS, cutting prototype iterations by 40%", "Led DFMEA workshops across 3 cross-functional teams"] },
    { id: "e2", company: "Tata Motors", role: "Graduate Engineer Trainee", location: "Pune", startDate: "2018-07", endDate: "2020-05", bullets: ["Supported drivetrain component design for commercial vehicles", "Created 200+ CAD drawings reducing manufacturing errors by 15%"] }
  ],
  projects: [{ id: "p1", name: "Lightweight EV Chassis", description: "Final-year capstone project", tech: ["SolidWorks", "ANSYS", "CFD"], bullets: ["Achieved 30% weight reduction while maintaining crash safety factor of 2.5"] }],
  education: [{ id: "ed1", school: "COEP Pune", degree: "B.Tech", field: "Mechanical Engineering", startDate: "2014-08", endDate: "2018-05", gpa: "8.9" }],
  certificates: [{ id: "c1", name: "SolidWorks Professional (CSWP)", issuer: "Dassault Systèmes", date: "2021-09" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "CAD/CAE", items: ["SolidWorks", "CATIA", "ANSYS", "AutoCAD"] }, { id: "s2", category: "Manufacturing", items: ["GD&T", "DFM", "DFMEA", "Lean Manufacturing"] }]
};

const bscCs: ResumeData = {
  contact: { name: "Arjun Patel", title: "Junior Software Developer", email: "arjun.patel@example.com", phone: "+91-9123456789", location: "Ahmedabad, India", linkedin: "linkedin.com/in/arjunpatel", github: "github.com/arjunpatel" },
  summary: "B.Sc Computer Science graduate with strong fundamentals in Python and web development. Built 6+ academic projects and interned at a startup, eager to launch a career in backend development.",
  experience: [
    { id: "e1", company: "TechStart India", role: "Backend Developer Intern", location: "Remote", startDate: "2023-06", endDate: "2023-12", bullets: ["Built REST APIs in Django serving 5k+ daily requests", "Wrote unit tests increasing code coverage from 45% to 82%"] }
  ],
  projects: [{ id: "p1", name: "Student Portal", description: "College management system", tech: ["Python", "Django", "PostgreSQL"], bullets: ["Built attendance tracking for 1200+ students", "Implemented role-based access for 3 user types"] }],
  education: [{ id: "ed1", school: "Gujarat University", degree: "B.Sc", field: "Computer Science", startDate: "2020-07", endDate: "2023-05", gpa: "8.2" }],
  certificates: [{ id: "c1", name: "Python Institute PCAP", issuer: "Python Institute", date: "2023-04" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Languages", items: ["Python", "JavaScript", "SQL"] }, { id: "s2", category: "Frameworks", items: ["Django", "Flask", "Bootstrap"] }]
};

const bscPhysics: ResumeData = {
  contact: { name: "Meera Iyer", title: "Data Analyst", email: "meera.iyer@example.com", phone: "+91-9876512340", location: "Chennai, India", linkedin: "linkedin.com/in/meeraiyer" },
  summary: "Physics graduate turned data analyst with strong quantitative skills. Experienced in Python, SQL, and statistical modeling, turning raw data into business insights.",
  experience: [
    { id: "e1", company: "Mu Sigma", role: "Decision Scientist", location: "Bengaluru", startDate: "2022-08", endDate: "Present", current: true, bullets: ["Built churn prediction model achieving 87% accuracy for telecom client", "Automated weekly reporting pipeline saving 12 hours/week", "Created Tableau dashboards used by 30+ stakeholders"] }
  ],
  projects: [{ id: "p1", name: "COVID Trend Analysis", description: "Statistical analysis project", tech: ["Python", "Pandas", "Matplotlib"], bullets: ["Analyzed 2M+ records to identify regional spread patterns"] }],
  education: [{ id: "ed1", school: "Loyola College Chennai", degree: "B.Sc", field: "Physics", startDate: "2019-07", endDate: "2022-05", gpa: "9.1" }],
  certificates: [{ id: "c1", name: "Google Data Analytics", issuer: "Google", date: "2022-11" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Tools", items: ["Python", "SQL", "R", "Excel"] }, { id: "s2", category: "Visualization", items: ["Tableau", "Power BI", "Matplotlib"] }, { id: "s3", category: "Statistics", items: ["Regression", "Hypothesis Testing", "A/B Testing"] }]
};

const bba: ResumeData = {
  contact: { name: "Karan Mehta", title: "Business Analyst", email: "karan.mehta@example.com", phone: "+91-9911223344", location: "Mumbai, India", linkedin: "linkedin.com/in/karanmehta" },
  summary: "BBA graduate with internship experience in business analysis and market research. Skilled in stakeholder management and process optimization, seeking to drive data-informed decisions.",
  experience: [
    { id: "e1", company: "Deloitte India", role: "Business Analyst Intern", location: "Mumbai", startDate: "2023-05", endDate: "2023-08", bullets: ["Conducted market analysis for 3 Fortune-500 clients, identifying ₹4Cr savings opportunity", "Streamlined client onboarding process reducing time by 30%", "Prepared 15+ executive presentations for senior partners"] }
  ],
  projects: [{ id: "p1", name: "Market Entry Strategy", description: "Academic consulting project", tech: ["Excel", "PowerPoint", "SurveyMonkey"], bullets: ["Analyzed entry feasibility for an e-commerce brand in tier-2 cities"] }],
  education: [{ id: "ed1", school: "NMIMS Mumbai", degree: "BBA", field: "Business Administration", startDate: "2020-07", endDate: "2023-05", gpa: "8.5" }],
  certificates: [{ id: "c1", name: "Lean Six Sigma Yellow Belt", issuer: "IASSC", date: "2022-12" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Analysis", items: ["Market Research", "Process Mapping", "Financial Modeling", "SWOT"] }, { id: "s2", category: "Tools", items: ["Excel", "PowerPoint", "Tableau", "Salesforce"] }]
};

const mba: ResumeData = {
  contact: { name: "Sneha Reddy", title: "Product Manager", email: "sneha.reddy@example.com", phone: "+91-9000011223", location: "Hyderabad, India", linkedin: "linkedin.com/in/snehareddy" },
  summary: "MBA graduate with 5+ years in product management across fintech and SaaS. Launched 8 products generating ₹45Cr ARR, with expertise in roadmap planning and cross-functional leadership.",
  experience: [
    { id: "e1", company: "Razorpay", role: "Senior Product Manager", location: "Bengaluru", startDate: "2021-03", endDate: "Present", current: true, bullets: ["Launched payment routing engine processing ₹200Cr/month with 99.99% uptime", "Grew merchant activation rate by 34% through funnel optimization", "Led team of 6 engineers and 2 designers across 4 product cycles"] },
    { id: "e2", company: "Freshworks", role: "Product Manager", location: "Chennai", startDate: "2018-07", endDate: "2021-02", bullets: ["Shipped CRM mobile app adopted by 120k users in first quarter", "Drove NPS from 32 to 58 through UX revamp"] }
  ],
  projects: [{ id: "p1", name: "BNPL Strategy", description: "MBA capstone", tech: ["Excel", "Tableau"], bullets: ["Modeled BNPL market opportunity worth ₹8000Cr in India"] }],
  education: [{ id: "ed1", school: "ISB Hyderabad", degree: "MBA", field: "Product Management", startDate: "2016-06", endDate: "2018-05", gpa: "3.8" }, { id: "ed2", school: "BITS Pilani", degree: "B.E.", field: "Computer Science", startDate: "2012-08", endDate: "2016-05", gpa: "8.4" }],
  certificates: [{ id: "c1", name: "Certified Scrum Product Owner", issuer: "Scrum Alliance", date: "2020-06" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Product", items: ["Roadmapping", "PRDs", "A/B Testing", "User Research"] }, { id: "s2", category: "Analytics", items: ["Amplitude", "Mixpanel", "SQL", "Google Analytics"] }, { id: "s3", category: "Tools", items: ["Jira", "Figma", "Notion", "Miro"] }]
};

const llb: ResumeData = {
  contact: { name: "Aditya Verma", title: "Legal Associate", email: "aditya.verma@example.com", phone: "+91-9333445566", location: "New Delhi, India", linkedin: "linkedin.com/in/adityaverma" },
  summary: "LLB graduate with experience in corporate law and dispute resolution. Drafted 50+ contracts and represented clients in 15+ arbitration proceedings.",
  experience: [
    { id: "e1", company: "Cyril Amarchand Mangaldas", role: "Legal Associate", location: "New Delhi", startDate: "2022-08", endDate: "Present", current: true, bullets: ["Drafted and reviewed 50+ commercial contracts worth ₹500Cr+", "Represented clients in 15+ arbitration proceedings with 80% success rate", "Conducted due diligence for 3 M&A deals valued at ₹2000Cr"] },
    { id: "e2", company: "Supreme Court of India", role: "Legal Intern", location: "New Delhi", startDate: "2021-06", endDate: "2021-08", bullets: ["Assisted in drafting 12 writ petitions and special leave petitions"] }
  ],
  projects: [{ id: "p1", name: "Insolvency Law Research", description: "Publication", tech: [], bullets: ["Published paper on IBC amendments in Indian Bar Review"] }],
  education: [{ id: "ed1", school: "NLSIU Bangalore", degree: "LLB", field: "Law", startDate: "2019-07", endDate: "2022-05", gpa: "7.8" }, { id: "ed2", school: "Delhi University", degree: "B.A.", field: "Political Science", startDate: "2016-07", endDate: "2019-05", gpa: "8.1" }],
  certificates: [{ id: "c1", name: "Diploma in Corporate Law", issuer: "Indian Law Institute", date: "2022-01" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Legal", items: ["Contract Drafting", "Arbitration", "M&A Due Diligence", "Legal Research"] }, { id: "s2", category: "Areas", items: ["Corporate Law", "Commercial Litigation", "Insolvency", "IP Law"] }]
};

const mca: ResumeData = {
  contact: { name: "Vikram Singh", title: "Full Stack Developer", email: "vikram.singh@example.com", phone: "+91-9445566778", location: "Jaipur, India", linkedin: "linkedin.com/in/vikramsingh", github: "github.com/vikramsingh" },
  summary: "MCA graduate with 3+ years building full-stack applications in MERN stack. Shipped 10+ products with 1.4M MAU, specializing in scalable APIs and real-time features.",
  experience: [
    { id: "e1", company: "Postman", role: "Full Stack Engineer", location: "Bengaluru", startDate: "2021-01", endDate: "Present", current: true, bullets: ["Built real-time collaboration feature adopted by 1.4M monthly users", "Migrated monolith to microservices reducing p95 latency by 60%", "Mentored 4 junior developers and led code review culture"] },
    { id: "e2", company: "Zomato", role: "Backend Developer", location: "Gurugram", startDate: "2019-07", endDate: "2020-12", bullets: ["Designed order-tracking system handling 500k events/second"] }
  ],
  projects: [{ id: "p1", name: "DevForum", description: "Open-source developer community", tech: ["Next.js", "Node.js", "MongoDB", "Redis"], bullets: ["2.5k GitHub stars, 40k monthly visitors"] }],
  education: [{ id: "ed1", school: "JNU New Delhi", degree: "MCA", field: "Computer Applications", startDate: "2017-07", endDate: "2020-06", gpa: "8.6" }, { id: "ed2", school: "Rajasthan University", degree: "BCA", field: "Computer Applications", startDate: "2014-07", endDate: "2017-05", gpa: "8.2" }],
  certificates: [{ id: "c1", name: "AWS Developer Associate", issuer: "Amazon Web Services", date: "2022-05" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] }, { id: "s2", category: "Backend", items: ["Node.js", "Express", "GraphQL", "tRPC"] }, { id: "s3", category: "Database", items: ["MongoDB", "PostgreSQL", "Redis"] }, { id: "s4", category: "DevOps", items: ["Docker", "AWS", "GitHub Actions"] }]
};

const bcom: ResumeData = {
  contact: { name: "Anjali Gupta", title: "Accountant", email: "anjali.gupta@example.com", phone: "+91-9665544332", location: "Kolkata, India", linkedin: "linkedin.com/in/anjaligupta" },
  summary: "B.Com graduate with 3 years experience in accounting and taxation. Processed 500+ invoices monthly and reduced reconciliation time by 34% through automation.",
  experience: [
    { id: "e1", company: "KPMG India", role: "Accounting Associate", location: "Kolkata", startDate: "2021-04", endDate: "Present", current: true, bullets: ["Processed 500+ monthly invoices with 99.6% accuracy", "Automated reconciliation in Excel reducing processing time by 34%", "Prepared GST returns for 20+ corporate clients"] }
  ],
  projects: [],
  education: [{ id: "ed1", school: "St. Xavier's College Kolkata", degree: "B.Com", field: "Accounting & Finance", startDate: "2018-07", endDate: "2021-05", gpa: "8.7" }],
  certificates: [{ id: "c1", name: "CA Intermediate", issuer: "ICAI", date: "2022-11" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Accounting", items: ["Tally", "GST", "TDS", "Bank Reconciliation"] }, { id: "s2", category: "Tools", items: ["Advanced Excel", "QuickBooks", "SAP"] }]
};

const barch: ResumeData = {
  contact: { name: "Rohan Desai", title: "Architect", email: "rohan.desai@example.com", phone: "+91-9778899001", location: "Ahmedabad, India", linkedin: "linkedin.com/in/rohandesai" },
  summary: "B.Arch graduate with 4 years experience in residential and commercial architecture. Designed 15+ projects with sustainable materials, winning 2 state-level design awards.",
  experience: [
    { id: "e1", company: "Hafeez Contractor", role: "Junior Architect", location: "Mumbai", startDate: "2020-07", endDate: "Present", current: true, bullets: ["Designed 8 residential projects totaling 250k sq.ft", "Led 3 commercial projects from concept to completion", "Integrated sustainable materials reducing energy cost by 25%"] }
  ],
  projects: [{ id: "p1", name: "Net-Zero Community Center", description: "Award-winning thesis project", tech: ["AutoCAD", "SketchUp", "V-Ray"], bullets: ["Won 2020 IIA National Design Award for sustainable architecture"] }],
  education: [{ id: "ed1", school: "SPA Delhi", degree: "B.Arch", field: "Architecture", startDate: "2015-08", endDate: "2020-06", gpa: "8.3" }],
  certificates: [{ id: "c1", name: "LEED Green Associate", issuer: "USGBC", date: "2021-09" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Design", items: ["AutoCAD", "Revit", "SketchUp", "Rhino"] }, { id: "s2", category: "Rendering", items: ["V-Ray", "Lumion", "Enscape"] }, { id: "s3", category: "Knowledge", items: ["Sustainable Design", "Urban Planning", "Building Codes"] }]
};

const mbbs: ResumeData = {
  contact: { name: "Dr. Fatima Khan", title: "Medical Resident", email: "fatima.khan@example.com", phone: "+91-9556677889", location: "Aligarh, India", linkedin: "linkedin.com/in/dr-fatima-khan" },
  summary: "MBBS graduate pursuing residency in Internal Medicine. Managed 300+ patients during internship with strong diagnostic skills and evidence-based approach.",
  experience: [
    { id: "e1", company: "AIIMS Delhi", role: "Resident Doctor", location: "New Delhi", startDate: "2023-01", endDate: "Present", current: true, bullets: ["Managed 300+ inpatients in Internal Medicine ward", "Presented 8 case reports in departmental grand rounds", "Co-authored 2 research papers in indexed journals"] },
    { id: "e2", company: "JN Medical College", role: "Intern", location: "Aligarh", startDate: "2022-01", endDate: "2022-12", bullets: ["Completed 12-month rotatory internship across 6 departments"] }
  ],
  projects: [],
  education: [{ id: "ed1", school: "JN Medical College, AMU", degree: "MBBS", field: "Medicine", startDate: "2017-08", endDate: "2022-12", gpa: "7.9" }],
  certificates: [{ id: "c1", name: "BLS & ACLS Certified", issuer: "American Heart Association", date: "2022-06" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Clinical", items: ["Patient Assessment", "Emergency Care", "EKG Interpretation", "Procedural Skills"] }, { id: "s2", category: "Research", items: ["Clinical Research", "Evidence-Based Medicine", "Medical Writing"] }]
};

const baEnglish: ResumeData = {
  contact: { name: "Ishita Bose", title: "Content Writer", email: "ishita.bose@example.com", phone: "+91-9887766554", location: "Kolkata, India", linkedin: "linkedin.com/in/ishitabose" },
  summary: "B.A English graduate with 2+ years creating content for digital brands. Wrote 500+ articles generating 2M+ page views, with expertise in SEO and brand storytelling.",
  experience: [
    { id: "e1", company: "CRED", role: "Content Writer", location: "Bengaluru", startDate: "2022-06", endDate: "Present", current: true, bullets: ["Wrote 200+ blog posts generating 2M+ page views", "Grew organic traffic by 145% through SEO-optimized content", "Created brand voice guidelines adopted across 3 product lines"] }
  ],
  projects: [{ id: "p1", name: "Mental Health Blog", description: "Personal publication", tech: ["WordPress", "SEO"], bullets: ["Built audience of 50k monthly readers in first year"] }],
  education: [{ id: "ed1", school: "Presidency University Kolkata", degree: "B.A.", field: "English Literature", startDate: "2018-07", endDate: "2021-05", gpa: "8.8" }],
  certificates: [{ id: "c1", name: "HubSpot Content Marketing", issuer: "HubSpot Academy", date: "2022-08" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Writing", items: ["Blog Writing", "Copywriting", "Editing", "Storytelling"] }, { id: "s2", category: "Marketing", items: ["SEO", "Content Strategy", "Social Media", "Email Marketing"] }]
};

const bca: ResumeData = {
  contact: { name: "Nikhil Joshi", title: "Web Developer", email: "nikhil.joshi@example.com", phone: "+91-9776655443", location: "Indore, India", linkedin: "linkedin.com/in/nikhiljoshi", github: "github.com/nikhiljoshi" },
  summary: "BCA graduate with 2 years building responsive web apps. Shipped 15+ client websites with 95+ Lighthouse scores and strong React fundamentals.",
  experience: [
    { id: "e1", company: "TCS", role: "Web Developer", location: "Indore", startDate: "2022-07", endDate: "Present", current: true, bullets: ["Built 15+ client websites with 95+ Lighthouse scores", "Developed reusable component library used by 3 teams", "Reduced bundle size by 40% through code-splitting"] }
  ],
  projects: [{ id: "p1", name: "DevPortfolio", description: "Open-source portfolio template", tech: ["React", "Tailwind CSS", "Vite"], bullets: ["800+ GitHub stars, used by 5k+ developers"] }],
  education: [{ id: "ed1", school: "DAVV Indore", degree: "BCA", field: "Computer Applications", startDate: "2019-07", endDate: "2022-05", gpa: "8.5" }],
  certificates: [{ id: "c1", name: "Meta Front-End Developer", issuer: "Meta", date: "2023-02" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Frontend", items: ["HTML", "CSS", "JavaScript", "React"] }, { id: "s2", category: "Tools", items: ["Git", "Figma", "Vite", "Tailwind CSS"] }]
};

const bpharma: ResumeData = {
  contact: { name: "Pooja Agarwal", title: "Pharmaceutical Researcher", email: "pooja.agarwal@example.com", phone: "+91-9667788990", location: "Hyderabad, India", linkedin: "linkedin.com/in/poojaagarwal" },
  summary: "B.Pharmacy graduate with 3 years in drug formulation research. Developed 5 patent-pending formulations and contributed to 2 FDA submissions.",
  experience: [
    { id: "e1", company: "Dr. Reddy's Laboratories", role: "Research Associate", location: "Hyderabad", startDate: "2021-06", endDate: "Present", current: true, bullets: ["Developed 5 patent-pending generic formulations", "Contributed to 2 FDA ANDA submissions", "Optimized tablet formulation reducing manufacturing cost by 18%"] }
  ],
  projects: [{ id: "p1", name: "Novel Drug Delivery System", description: "Final year project", tech: ["HPLC", "Dissolution Testing"], bullets: ["Achieved 92% drug release in targeted delivery system"] }],
  education: [{ id: "ed1", school: "NIPER Hyderabad", degree: "B.Pharmacy", field: "Pharmaceutical Sciences", startDate: "2017-08", endDate: "2021-06", gpa: "8.9" }],
  certificates: [{ id: "c1", name: "GMP Certification", issuer: "ISPE", date: "2022-03" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Research", items: ["Formulation Development", "HPLC", "Dissolution Testing", "Stability Studies"] }, { id: "s2", category: "Regulatory", items: ["FDA Submissions", "GMP", "ICH Guidelines"] }]
};

const civil: ResumeData = {
  contact: { name: "Suresh Babu", title: "Structural Engineer", email: "suresh.babu@example.com", phone: "+91-9554433221", location: "Chennai, India", linkedin: "linkedin.com/in/sureshbabu" },
  summary: "Civil Engineering graduate with 6+ years in structural design. Designed 20+ buildings with STAAD.Pro, ensuring seismic compliance and saving ₹2.1Cr in material costs.",
  experience: [
    { id: "e1", company: "L&T Construction", role: "Structural Engineer", location: "Chennai", startDate: "2019-07", endDate: "Present", current: true, bullets: ["Designed 20+ RCC and steel structures up to G+25 floors", "Saved ₹2.1Cr through value engineering on 3 projects", "Ensured seismic compliance per IS 1893 across all designs"] }
  ],
  projects: [{ id: "p1", name: "IT Park Design", description: "Commercial project", tech: ["STAAD.Pro", "ETABS", "AutoCAD"], bullets: ["Designed 1.2M sq.ft IT park with post-tensioned slabs"] }],
  education: [{ id: "ed1", school: "Anna University", degree: "B.E.", field: "Civil Engineering", startDate: "2013-08", endDate: "2017-05", gpa: "8.6" }],
  certificates: [{ id: "c1", name: "STAAD.Pro Certified", issuer: "Bentley Systems", date: "2020-02" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Design", items: ["STAAD.Pro", "ETABS", "AutoCAD", "Revit Structure"] }, { id: "s2", category: "Standards", items: ["IS 456", "IS 1893", "IS 800", "ACI 318"] }]
};

const electrical: ResumeData = {
  contact: { name: "Manish Tiwari", title: "Electrical Engineer", email: "manish.tiwari@example.com", phone: "+91-9445566778", location: "Bhopal, India", linkedin: "linkedin.com/in/manishtiwari" },
  summary: "Electrical Engineer with 5+ years in power systems design. Commissioned 15+ substations and reduced energy losses by 22% through load optimization.",
  experience: [
    { id: "e1", company: "BHEL", role: "Electrical Engineer", location: "Bhopal", startDate: "2019-07", endDate: "Present", current: true, bullets: ["Commissioned 15+ substations up to 220kV", "Reduced energy losses by 22% through load optimization", "Designed protection systems for 8 industrial plants"] }
  ],
  projects: [{ id: "p1", name: "Solar Power Plant", description: "10MW solar farm", tech: ["ETAP", "AutoCAD Electrical"], bullets: ["Designed electrical layout for 10MW solar plant"] }],
  education: [{ id: "ed1", school: "MANIT Bhopal", degree: "B.E.", field: "Electrical Engineering", startDate: "2013-08", endDate: "2017-05", gpa: "8.4" }],
  certificates: [{ id: "c1", name: "Certified Energy Manager", issuer: "BEE India", date: "2021-08" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Design", items: ["ETAP", "AutoCAD Electrical", "MATLAB", "PSCAD"] }, { id: "s2", category: "Systems", items: ["Power Distribution", "Protection", "Substations", "SCADA"] }]
};

const biotech: ResumeData = {
  contact: { name: "Deepa Menon", title: "Research Associate", email: "deepa.menon@example.com", phone: "+91-9887766554", location: "Bengaluru, India", linkedin: "linkedin.com/in/deepamenon" },
  summary: "Biotechnology graduate with 3 years in molecular biology research. Published 4 papers and optimized PCR protocols reducing analysis time by 40%.",
  experience: [
    { id: "e1", company: "Biocon", role: "Research Associate", location: "Bengaluru", startDate: "2021-06", endDate: "Present", current: true, bullets: ["Published 4 papers in peer-reviewed journals", "Optimized PCR protocols reducing analysis time by 40%", "Managed 2 independent research projects on enzyme engineering"] }
  ],
  projects: [{ id: "p1", name: "CRISPR Diagnostics", description: "Research project", tech: ["PCR", "Gel Electrophoresis", "CRISPR"], bullets: ["Developed rapid diagnostic kit prototype"] }],
  education: [{ id: "ed1", school: "IIT Madras", degree: "B.Tech", field: "Biotechnology", startDate: "2017-08", endDate: "2021-05", gpa: "9.0" }],
  certificates: [{ id: "c1", name: "GLP Certified", issuer: "NGCMA", date: "2022-01" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Lab", items: ["PCR", "Gel Electrophoresis", "Cell Culture", "Spectrophotometry"] }, { id: "s2", category: "Bioinformatics", items: ["BLAST", "R", "Python", "GenBank"] }]
};

const bhm: ResumeData = {
  contact: { name: "Joseph Mathew", title: "Hotel Management Professional", email: "joseph.mathew@example.com", phone: "+91-9778899001", location: "Kochi, India", linkedin: "linkedin.com/in/josephmathew" },
  summary: "BHM graduate with 4 years in luxury hospitality. Managed 5-star hotel operations with 98% guest satisfaction and 15% revenue growth.",
  experience: [
    { id: "e1", company: "Taj Hotels", role: "Front Office Manager", location: "Kochi", startDate: "2021-04", endDate: "Present", current: true, bullets: ["Achieved 98% guest satisfaction score across 200 rooms", "Increased room revenue by 15% through dynamic pricing", "Managed team of 25 front office staff"] }
  ],
  projects: [],
  education: [{ id: "ed1", school: "WGSHA Manipal", degree: "BHM", field: "Hotel Management", startDate: "2017-07", endDate: "2021-05", gpa: "8.2" }],
  certificates: [{ id: "c1", name: "Opera PMS Certified", issuer: "Oracle Hospitality", date: "2021-10" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Operations", items: ["Front Office", "Guest Relations", "Revenue Management", "PMS"] }, { id: "s2", category: "Tools", items: ["Opera PMS", "Excel", "Salesforce"] }]
};

const bdes: ResumeData = {
  contact: { name: "Ananya Das", title: "UX/UI Designer", email: "ananya.das@example.com", phone: "+91-9665544332", location: "Bengaluru, India", linkedin: "linkedin.com/in/ananyadas", website: "behance.net/ananyadas" },
  summary: "B.Des graduate with 3 years designing digital products. Led design for 8 apps with 2M+ users, specializing in user research and design systems.",
  experience: [
    { id: "e1", company: "PhonePe", role: "Product Designer", location: "Bengaluru", startDate: "2021-06", endDate: "Present", current: true, bullets: ["Led design for 3 features used by 2M+ users", "Built design system adopted by 4 product teams", "Improved onboarding completion rate by 38%"] }
  ],
  projects: [{ id: "p1", name: "FinTech App Redesign", description: "Case study", tech: ["Figma", "ProtoPie", "Maze"], bullets: ["Redesigned payments app increasing task success rate by 45%"] }],
  education: [{ id: "ed1", school: "NID Ahmedabad", degree: "B.Des", field: "UX Design", startDate: "2017-06", endDate: "2021-05", gpa: "8.7" }],
  certificates: [{ id: "c1", name: "Google UX Design", issuer: "Google", date: "2022-04" }],
  training: [],
  achievements: [],
  skills: [{ id: "s1", category: "Design", items: ["Figma", "ProtoPie", "Adobe XD", "Photoshop"] }, { id: "s2", category: "Research", items: ["User Interviews", "Usability Testing", "Journey Mapping", "Surveys"] }]
};

export const SAMPLE_RESUMES: SampleResume[] = [
  { id: "sample-btech-cse", title: "B.Tech CSE — Software Engineer", category: "Engineering", description: "Computer Science graduate targeting SWE roles", data: SAMPLE_RESUME_DATA },
  { id: "sample-btech-ece", title: "B.Tech ECE — Embedded Systems", category: "Engineering", description: "Electronics engineer for firmware/IoT roles", data: btechEce },
  { id: "sample-btech-mech", title: "B.Tech Mechanical — Design", category: "Engineering", description: "Mechanical design engineer for automotive/aerospace", data: btechMech },
  { id: "sample-bsc-cs", title: "B.Sc CS — Junior Developer", category: "Science", description: "CS graduate starting a dev career", data: bscCs },
  { id: "sample-bsc-physics", title: "B.Sc Physics — Data Analyst", category: "Science", description: "Physics graduate in data analytics", data: bscPhysics },
  { id: "sample-bba", title: "BBA — Business Analyst", category: "Business", description: "Business grad targeting analyst roles", data: bba },
  { id: "sample-mba", title: "MBA — Product Manager", category: "Business", description: "Experienced PM targeting senior roles", data: mba },
  { id: "sample-llb", title: "LLB — Legal Associate", category: "Law", description: "Law graduate for corporate litigation", data: llb },
  { id: "sample-mca", title: "MCA — Full Stack Developer", category: "Engineering", description: "MCA grad for full-stack positions", data: mca },
  { id: "sample-bcom", title: "B.Com — Accountant", category: "Business", description: "Commerce grad in accounting/finance", data: bcom },
  { id: "sample-barch", title: "B.Arch — Architect", category: "Architecture", description: "Architecture graduate for design firms", data: barch },
  { id: "sample-mbbs", title: "MBBS — Medical Resident", category: "Medical", description: "Medical graduate pursuing residency", data: mbbs },
  { id: "sample-ba-english", title: "B.A English — Content Writer", category: "Arts", description: "English grad for content/copywriting", data: baEnglish },
  { id: "sample-bca", title: "BCA — Web Developer", category: "Engineering", description: "BCA grad for frontend/web roles", data: bca },
  { id: "sample-bpharma", title: "B.Pharmacy — Researcher", category: "Science", description: "Pharma grad for R&D positions", data: bpharma },
  { id: "sample-civil", title: "Civil Engineering — Structural", category: "Engineering", description: "Civil engineer for structural design", data: civil },
  { id: "sample-electrical", title: "Electrical Engineering", category: "Engineering", description: "Electrical engineer for power systems", data: electrical },
  { id: "sample-biotech", title: "Biotechnology — Research", category: "Science", description: "Biotech grad for research roles", data: biotech },
  { id: "sample-bhm", title: "BHM — Hotel Management", category: "Hospitality", description: "Hospitality grad for hotel operations", data: bhm },
  { id: "sample-bdes", title: "B.Des — UX/UI Designer", category: "Design", description: "Design grad for product design roles", data: bdes }
];
