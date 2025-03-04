import { Button, Typography, Avatar } from "@mui/material"; // MUI components
import LinkedInIcon from "@mui/icons-material/LinkedIn"; // LinkedIn icon
import InstagramIcon from "@mui/icons-material/Instagram"; // Instagram icon
import { motion } from 'framer-motion'

const About = () => {
  const visitInstagram = () => {
    window.location.href = "https://instagram.com/tahirsultanofficial";
  };

  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <motion.div
      
        className="aboutSectionContainer"
      >
        <Typography component="h1">About Us</Typography>

        <div>
          <motion.div
            
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        
          
          >
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://avatars.githubusercontent.com/u/112794262?v=4"
              alt="Founder"
            />
            <Typography>Muhammad Tahir</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is an Mobile ECommerce Store Build In MERN STACK done by Mohammad
              Tahir. I enjoyed and learned a lot by this project. Feeling Happy
              😉😎🥰.
            </span>
          </motion.div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a href="https://www.linkedin.com/in/ghareebstar" target="blank">
              <LinkedInIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://instagram.com/tahirsultanofficial" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;