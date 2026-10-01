import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import SkeletonImage from "../Components/SkeletonImage";

const team = [
  {
    name: 'Anand Singh Chouhan',
    role: 'Founder & Visionary ',
    image: 'https://res.cloudinary.com/dyvccryuz/image/upload/v1746259324/nandu_lfx39s.png',
    email: 'ankeshbarahdiya05112002@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ankesh-barahdiya-8704142b6',
  },
    {
    name: 'Ankesh Barhadiya',
    role: 'Co-Founder & Tech Lead',
    image: 'https://res.cloudinary.com/dyvccryuz/image/upload/v1746259326/Anku_so4got.jpg',
    email: 'ankeshbarahdiya05112002@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ankesh-barhadiya05112002/',
  },
  {
    name: 'Vikram Rana',
    role: 'Co-Founder & Tech Lead',
    image: 'https://res.cloudinary.com/dc2geexnf/image/upload/v1790873822/WhatsApp_Image_2026-10-01_at_10.08.28_PM_ptsw8n.jpg',
    email: 'Vikramrana224400.com@gmail.com',
    linkedin: '',
  },  
  {
    name: 'Sameer khan',
    role: ' Co-Founder  & Tech Lead',
    image:
      'https://res.cloudinary.com/dc2geexnf/image/upload/v1775130745/1742237649179.jpg_c0lfze.jpg',
    email: 'sameerkhan27560@gmail.com',
    linkedin: 'https://www.linkedin.com/in/sameer-khan2210/',
  },


  {
    name: 'Deepti Lodhi',
    role: 'Co-Founder & Tech Lead',
    image: 'https://res.cloudinary.com/dyvccryuz/image/upload/v1746259323/deep_y2fnz6.jpg',
    email: 'lodhideepti@gmail.com',
    linkedin: 'https://www.linkedin.com/in/deeptee-lodhi-0881a0260',
  },
];

const MotionDiv = motion.div;

const Credits = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6ebf5] to-[#ffffff] text-[#1d2d44] font-sans overflow-x-hidden">

      {/* Hero Section */}
      <MotionDiv
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center pt-28 px-6"
      >
        <h1 className="text-5xl md:text-6xl font-bold tracking-wide mb-4">
          Credits & Collaborations
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Honoring the driving force behind <span className="text-[#4b61d1] font-semibold">Aviyukt NGO</span> — our visionary minds, creators, and tech heroes.
        </p>
      </MotionDiv>

      {/* Divider */}
      <div className="my-12 w-24 h-1 bg-[#4b61d1] mx-auto rounded-full"></div>

      {/* Team Section (Responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 md:px-12 xl:px-24">
        {team.map((member, index) => (
          <MotionDiv
            key={index}
            className="w-full bg-white bg-opacity-70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center transform hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {/* Hexagonal Image Frame */}
            <div className="mx-auto relative w-32 h-32 mb-6 hexagon-clip">
              <SkeletonImage
                src={member.image}
                alt={member.name}
                className="object-cover w-full h-full object-top"
              />
            </div>

            <h3 className="text-2xl font-bold text-[#1d2d44]">{member.name}</h3>
            <p className="text-md text-gray-600 mb-3">{member.role}</p>

            {/* Links */}
            <div className="flex justify-center gap-6 text-xl mt-4">
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0077b5] transition"
              >
                <FaLinkedin />
              </a>
              <a
                href={`mailto:${member.email}`}
                className="hover:text-red-500 transition"
              >
                <FaEnvelope />
              </a>
            </div>
          </MotionDiv>
        ))}
      </div>

      {/* Acknowledgement Marquee */}
      <div className="mt-20 overflow-hidden">
        <motion.div
          className="flex gap-8 px-6 py-6 animate-scroll text-sm md:text-md text-gray-700 whitespace-nowrap"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          {[
            "Design inspiration from Pinterest, Awwwards",
            "Photos from Unsplash & Pexels",
            "Fonts powered by Google Fonts",
            "Icons by Lucide & Feather",
            "Crafted with React, Tailwind CSS & Framer Motion",
          ].map((text, i) => (
            <span
              key={i}
              className="inline-block px-5 py-3 bg-white bg-opacity-90 rounded-xl shadow hover:bg-opacity-100 transition"
            >
              {text}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="mt-16 text-center text-sm text-gray-500 pb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Made with ❤️ by the <span className="font-semibold text-[#1d2d44]">Aviyukt Team</span>. ©{" "}
        {new Date().getFullYear()} All rights reserved.
      </motion.div>

      {/* Custom Styles for Hexagon */}
      <style>{`
        .hexagon-clip {
          clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%);
          background-color: #fff;
          border: 4px solid #1d2d44;
          padding: 4px;
        }
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Credits;

