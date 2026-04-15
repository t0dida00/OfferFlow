import { useState, useRef } from 'react';
import { Download, Loader2, Save } from 'lucide-react';
import styles from './CoverLetter.module.scss';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface CoverLetterDetails {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  portfolio: string;
  date: string;
  company: string;
  position: string;
}

const initialDetails: CoverLetterDetails = {
  name: 'Khoa Dinh',
  phone: '0401997250',
  email: 'dinhkhoa.work@gmail.com',
  linkedin: 'https://www.linkedin.com/in/dangkhoadinh/',
  portfolio: 'https://www.callmekhoa.com/',
  date: '2026-04-14',
  company: 'Veriff',
  position: 'Frontend Engineer',
};

export function CoverLetterPage() {
  const [formDetails, setFormDetails] = useState<CoverLetterDetails>(initialDetails);
  const [appliedDetails, setAppliedDetails] = useState<CoverLetterDetails>(initialDetails);
  const [bodyHtml, setBodyHtml] = useState<string>(
    `<p><span ><strong style="font-size: 16px;">[Name]</strong></span></p>
    <p>[Phone]</p>
    <p>[Email]</p>
    <p>[LinkedIn]</p>
    <p>[Portfolio]</p>
    <br/>
    <p>[Company]</p>
    <p>[Date]</p>
    <p>Dear HR,</p>
    <br/>
    <p>I am currently a Master’s student in Information Processing Science at the University of Oulu, and I am seeking a [Position] position at [Company]. With over 2 years of experience building scalable web applications using React and modern JavaScript, I am excited about the opportunity to contribute to a platform that operates at such a large data scale and meaningful global impact.</p>
    <br/>
    <p>In my current role at EPIXLIFE, I have delivered multiple features and production-ready pages using React and Next.js. I have worked on refining a legacy codebase (5+ years old), applying modern architectural approaches to optimize data fetching and improve maintainability, scalability, and testing. I leverage modern libraries such as TanStack Table for handling complex data tables and TanStack Query for efficient state management and caching.</p>
    <br/>
    <p>Beyond development, I have also contributed to UI design, ensuring pixel-perfect and seamless user interfaces. I use Storybook to document and maintain UI components, improving consistency and collaboration within the team. In addition to my frontend expertise, I also have a solid foundation in Node.js, Docker, and SQL.</p>
    <br/>
    <p>While I value my current role, I am driven by a “challenge me” mindset. I actively seek opportunities to learn, grow, and apply new technologies in production environments rather than staying within comfort zones. This is why I am motivated to join [Company], where I can take on more complex challenges and continue developing as an engineer.</p>
    <br/>
    <p>Enclosed you will find my resume and portfolio. I would welcome the opportunity to discuss how I can contribute to [Company].</p>
    <br/>
    <p>I look forward to the opportunity to speak with you.</p>
    <br/>
    <p>Sincerely,</p>
    <p><span style="font-size: 16px;">[Name]</span></p>`
  );
  
  const [isExporting, setIsExporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const wordContainerRef = useRef<HTMLDivElement>(null);

  const handleApplyChanges = () => {
    setIsSyncing(true);
    
    // Simulate professional processing delay
    setTimeout(() => {
      let newHtml = bodyHtml;
      const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const syncTags = (curr: CoverLetterDetails, prev: CoverLetterDetails) => {
        const fields: (keyof CoverLetterDetails)[] = ['name', 'phone', 'email', 'linkedin', 'portfolio', 'company', 'position', 'date'];
        const tags: Record<string, string> = {
          name: '[Name]', phone: '[Phone]', email: '[Email]', 
          linkedin: '[LinkedIn]', portfolio: '[Portfolio]', 
          company: '[Company]', position: '[Position]', date: '[Date]'
        };

        const formatDate = (dateStr: string) => {
          if (!dateStr) return '';
          try {
            return new Date(dateStr).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          } catch {
            return dateStr;
          }
        };

        fields.forEach(field => {
          let val = curr[field];
          let prevVal = prev[field];
          const tag = tags[field];

          // Format date for the document
          if (field === 'date') {
            val = formatDate(val);
            prevVal = formatDate(prevVal);
          }

          // Auto-link Email, LinkedIn, and Portfolio
          const isLinkField = ['email', 'linkedin', 'portfolio'].includes(field);
          const formatAsLink = (v: string, f: string) => {
            if (!v) return '';
            const href = f === 'email' ? `mailto:${v}` : v;
            return `<a href="${href}" target="_blank" style="color: #2563eb; text-decoration: underline;">${v}</a>`;
          };

          if (isLinkField) {
            val = formatAsLink(val, field);
            prevVal = formatAsLink(prevVal, field);
          }

          // 1. Initial tag replacement
          if (val && newHtml.includes(tag)) {
            newHtml = newHtml.replace(new RegExp(escapeRegExp(tag), 'g'), val);
          } 
          // 2. Subsequent update
          else if (val !== prevVal && prevVal.length > 5 && newHtml.includes(prevVal)) {
            newHtml = newHtml.replace(new RegExp(escapeRegExp(prevVal), 'g'), val);
          }
        });
      };

      syncTags(formDetails, appliedDetails);
      setBodyHtml(newHtml);
      setAppliedDetails(formDetails);
      setIsSyncing(false);
    }, 800);
  };

  const downloadAsPdf = async () => {
    const editorContent = wordContainerRef.current?.querySelector('.ql-editor');
    if (!editorContent) return;

    setIsExporting(true);
    try {
      // Prepare a full HTML document with necessary styles for Puppeteer
      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
            body {
              font-family: 'Times New Roman', Times, serif;
              font-size: 11.5pt; /* More standard size for PDF to match screen feel */
              line-height: 1.5;
              color: #000;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
            }
            .document-content {
              width: 100%;
              max-width: 750px; /* Aligns with standard A4 text area */
              margin: 0 auto;
              padding: 0;
            }
            p { margin: 0; padding: 0; }
            a {
              color: #2563eb;
              text-decoration: underline;
            }
            strong { font-weight: bold; }
            
            /* Quill Formatting Support */
            .ql-size-small { font-size: 0.75em; }
            .ql-size-large { font-size: 1.5em; }
            .ql-size-huge { font-size: 2.5em; }
            .ql-font-serif { font-family: 'Times New Roman', Times, serif; }
            .ql-font-monospace { font-family: monospace; }
            .ql-align-center { text-align: center; }
            .ql-align-right { text-align: right; }
            .ql-align-justify { text-align: justify; }
          </style>
        </head>
        <body>
          <div class="document-content">
            ${editorContent.innerHTML}
          </div>
        </body>
        </html>
      `;

      const fileName = `${appliedDetails.name.replace(/\s+/g, '_') || 'FullName'}_Coverletter_${appliedDetails.company.replace(/\s+/g, '_') || 'CompanyName'}`;

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/pdf/generate`, 
        { 
          html: fullHtml,
          filename: fileName
        },
        { responseType: 'blob' }
      );

      // Create a link to download the file
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please ensure the backend is running.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>My Cover Letter</h2>
        <p>Draft professional letters and apply changes from your profile data.</p>
      </header>

      <div className={styles.contentWrapper}>
        <div className={styles.previewColumn}>
          <div className={styles.editorWrapper}>
            <div ref={wordContainerRef}>
              <ReactQuill 
                theme="snow" 
                value={bodyHtml} 
                onChange={setBodyHtml}
                modules={{
                  toolbar: [
                    [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'link'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['clean']
                  ],
                }}
                className={styles.editor}
              />
            </div>
            
            {isSyncing && (
              <div className={styles.editorOverlay}>
                <div className={styles.loadingSpinner}>
                  <Loader2 className={styles.spin} size={32} />
                  <span>Syncing data...</span>
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.editorActions}>
            <button 
              onClick={downloadAsPdf}
              className={styles.downloadBtn}
              disabled={isExporting || isSyncing}
            >
              {isExporting ? <Loader2 size={18} className={styles.spin} /> : <Download size={18} />}
              <span>Download as PDF</span>
            </button>
          </div>
        </div>

        <aside className={styles.detailsSidebar}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h3>Application Details</h3>
              <button className={styles.saveBtn} onClick={handleApplyChanges} disabled={isSyncing}>
                <Save size={16} />
                <span>Save</span>
              </button>
            </div>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label>Date</label>
                <input 
                  type="date" 
                  value={formDetails.date} 
                  onChange={e => setFormDetails(prev => ({...prev, date: e.target.value}))}
                />
              </div>
              <div className={styles.field}>
                <label>Company Name</label>
                <input 
                  type="text" 
                  value={formDetails.company} 
                  onChange={e => setFormDetails(prev => ({...prev, company: e.target.value}))}
                  placeholder="Target Company" 
                />
              </div>
              <div className={styles.field}>
                <label>Applying Position</label>
                <input 
                  type="text" 
                  value={formDetails.position} 
                  onChange={e => setFormDetails(prev => ({...prev, position: e.target.value}))}
                  placeholder="Target Position" 
                />
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h3>Personal Info</h3>
              <button className={styles.saveBtn} onClick={handleApplyChanges} disabled={isSyncing}>
                <Save size={16} />
                <span>Save</span>
              </button>
            </div>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={formDetails.name} 
                  onChange={e => setFormDetails(prev => ({...prev, name: e.target.value}))}
                  placeholder="e.g. Khoa Dinh" 
                />
              </div>
              <div className={styles.field}>
                <label>Phone Number</label>
                <input 
                  type="text" 
                  value={formDetails.phone} 
                  onChange={e => setFormDetails(prev => ({...prev, phone: e.target.value}))}
                  placeholder="e.g. +358..." 
                />
              </div>
              <div className={styles.field}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={formDetails.email} 
                  onChange={e => setFormDetails(prev => ({...prev, email: e.target.value}))}
                  placeholder="e.g. hello@example.com" 
                />
              </div>
              <div className={styles.field}>
                <label>LinkedIn</label>
                <input 
                  type="text" 
                  value={formDetails.linkedin} 
                  onChange={e => setFormDetails(prev => ({...prev, linkedin: e.target.value}))}
                  placeholder="LinkedIn URL" 
                />
              </div>
              <div className={styles.field}>
                <label>Portfolio</label>
                <input 
                  type="text" 
                  value={formDetails.portfolio} 
                  onChange={e => setFormDetails(prev => ({...prev, portfolio: e.target.value}))}
                  placeholder="Portfolio/Website URL" 
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
