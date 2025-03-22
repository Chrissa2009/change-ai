// pdfUtils.js
import html2pdf from 'html2pdf.js';

// Function to inject PDF-specific styles for better rendering
export const injectPDFPageStyles = () => {
  let styleEl = document.getElementById('pdf-page-styles');
  
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'pdf-page-styles';
    document.head.appendChild(styleEl);
  }
  
  // Add PDF-specific styles
  styleEl.textContent = `
    @media print {
      #pdf-survey-info {
        page-break-after: avoid !important;
        margin-bottom: 20px !important;
      }
        
      #pdf-survey-info .MuiTypography-h5 {
        color: #023047 !important;
        font-size: 20pt !important;
        font-weight: bold !important;
      }

      /* Logo and header styling */
      #pdf-title-section {
        background-color: #023047 !important;
        padding: 20px !important;
        margin: -20px -20px 30px -20px !important;
        text-align: center !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
        

      .pdf-logo-container {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin-bottom: 10px !important;
      }

      .pdf-logo-text {
        font-family: "Space Grotesk", sans-serif !important;
        font-size: 28px !important;
        color: #FB8500 !important;
        margin-left: 8px !important;
      }

      .pdf-logo-subtext {
        font-size: 14px !important;
        color: #8ecae6 !important;
        letter-spacing: 0.5px !important;
      }

      /* Content styling */
      .pdf-page {
        page-break-after: always;
        margin-bottom: 0;
      }
      .pdf-page:last-child {
        page-break-after: auto;
      }
      
      .no-break {
        page-break-inside: avoid !important;
      }
      
      /* Improve text wrapping */
      p, span, div {
        word-break: break-word;
        overflow-wrap: break-word;
      }
      
      /* Flexbox and Grid styles */
      .MuiGrid-container, .MuiBox-root {
        display: block !important;
      }
      .MuiGrid-item {
        width: 100% !important;
        max-width: 100% !important;
      }
      
      /* Fix for icons in PDFs */
      .MuiSvgIcon-root {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }
  `;
};

export const removePDFPageStyles = () => {
  const styleEl = document.getElementById('pdf-page-styles');
  if (styleEl) {
    document.head.removeChild(styleEl);
  }
};

// Alternative implementation using html2pdf.js if the jsPDF approach has issues
export const generatePDFWithHtml2Pdf = async (resultsRef, surveyName) => {
  if (!resultsRef.current) {
    console.error('Results component reference not available');
    return;
  }
  
  try {
    // Inject PDF-specific styles
    injectPDFPageStyles();
    
    // Save current panel state
    const originalState = resultsRef.current.getCurrentPanelState();
    
    // Expand all panels for the PDF
    resultsRef.current.expandAllPanels();
    
    // Get the content element
    const element = resultsRef.current.getContentElement();
    
    if (!element) {
      throw new Error('Content element not found');
    }
    
    // Show the special PDF sections 
    const titleSection = element.querySelector('#pdf-title-section');
    const footerSection = element.querySelector('#pdf-footer-section');
    
    if (titleSection) titleSection.style.display = 'block';
    if (footerSection) footerSection.style.display = 'block';
    
    // Set options for PDF generation
    const opt = {
      margin: [0.75, 0.75, 0.75, 0.75], // inches for html2pdf
      filename: `${surveyName.replace(/ /g, '_')}-analysis.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      enableLinks: true,
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        logging: false,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    // Wait for the changes to be applied in the DOM
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          // Generate PDF with html2pdf.js
          await html2pdf()
            .set(opt)
            .from(element)
            .save();
            
          // Hide PDF-specific sections
          if (titleSection) titleSection.style.display = 'none';
          if (footerSection) footerSection.style.display = 'none';
          
          // Restore original panel state
          resultsRef.current.restorePanelState(originalState);
          
          // Remove the PDF-specific styles
          removePDFPageStyles();
          
          resolve('PDF generated successfully');
        } catch (err) {
          console.error("PDF generation error:", err);
          
          // Clean up even if there's an error
          if (titleSection) titleSection.style.display = 'none';
          if (footerSection) footerSection.style.display = 'none';
          
          // Restore original panel state
          resultsRef.current.restorePanelState(originalState);
          
          // Remove the PDF-specific styles
          removePDFPageStyles();
          
          reject(err);
        }
      }, 300);
    });
  } catch (error) {
    console.error('Error preparing PDF generation:', error);
    
    // Make sure we clean up even if there's an error
    removePDFPageStyles();
    
    throw error;
  }
};
