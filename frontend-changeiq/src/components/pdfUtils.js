// Create a new file pdfUtils.js
import html2pdf from 'html2pdf.js';

export const generatePDF = async (resultsRef) => {
  if (!resultsRef.current) {
    console.error('Results component reference not available');
    return;
  }
  
  try {
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
      margin: [0.75, 0.75, 0.75, 0.75],
      filename: 'survey-analysis.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        logging: false,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait' 
      }
    };
    
    // Wait for the changes to be applied in the DOM
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          // Generate PDF
          await html2pdf()
            .from(element)
            .set(opt)
            .save();
            
          // Hide PDF-specific sections
          if (titleSection) titleSection.style.display = 'none';
          if (footerSection) footerSection.style.display = 'none';
          
          // Restore original panel state
          resultsRef.current.restorePanelState(originalState);
          
          resolve('PDF generated successfully');
        } catch (err) {
          reject(err);
        }
      }, 300);
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Make sure we clean up even if there's an error
    const element = resultsRef.current?.getContentElement();
    if (element) {
      const titleSection = element.querySelector('#pdf-title-section');
      const footerSection = element.querySelector('#pdf-footer-section');
      
      if (titleSection) titleSection.style.display = 'none';
      if (footerSection) footerSection.style.display = 'none';
    }
    
    throw error;
  }
};
