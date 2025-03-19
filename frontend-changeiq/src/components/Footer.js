import React from 'react';
import { Box, Typography, Link, IconButton, Stack } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = ({ 
  companyName = "Change.AI - Microsoft Innovation Challenge March 2025",
  founders = ["Chrissa De Gomez", "Bryan Yue", "Raylan Liang"],
  logo = null, 
  linkedinLinks = {
    chrissa: "https://www.linkedin.com/in/chrissadagomez/", 
    bryan: "https://www.linkedin.com/in/bryanyue322/", 
    raylan: "https://www.linkedin.com/in/bigcachemoney/"
  } 
}) => {
  const currentYear = "2025";
  const linkedinColor = "#0077b5";

  const founderLinks = {
    "Chrissa De Gomez": linkedinLinks.chrissa,
    "Bryan Yue": linkedinLinks.bryan,
    "Raylan Liang": linkedinLinks.raylan
  };
  
  return (
    <Box 
      component="footer" 
      sx={{
        // mt: 4,
        pt: 3,
        // borderTop: '1px solid',
        // borderColor: 'divider',
        textAlign: 'center',
        color: 'text.secondary',
        fontSize: '0.875rem',
        px: 2,
        pb: 3
      }}
    >
      <Stack spacing={2} alignItems="center">
        {logo && (
          <Box sx={{ mb: 1 }}>
            <img src={logo} alt={`${companyName} logo`} height="40" />
          </Box>
        )}
        
        <Typography variant="body2">
          &copy; {currentYear} {companyName}.
        </Typography>
        
        {founders.length > 0 && (
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" justifyContent="center">
            <Typography variant="caption">
              Founded by
            </Typography>
            {founders.map((founder, index) => (
              <Stack 
                key={founder} 
                direction="row" 
                spacing={0.5} 
                alignItems="center"
                sx={{ '&:not(:last-child):after': { content: '"•"', ml: 1 } }}
              >
                <Typography variant="caption" component="span">
                  {founder}
                </Typography>
                {founderLinks[founder] && (
                  <IconButton 
                  component={Link} 
                  href={founderLinks[founder]} 
                  target="_blank" 
                  aria-label={`${founder}'s LinkedIn`} 
                  size="small" 
                  sx={{ 
                    // p: 0.25,
                    color: linkedinColor,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: linkedinColor,
                      color: 'white',
                    }
                  }}
                >
                  <LinkedInIcon fontSize="small" />
                </IconButton>
                )}
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default Footer;
