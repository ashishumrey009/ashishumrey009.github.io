import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Download, ChevronDown, Code, Briefcase, GraduationCap, Award, User, MessageSquare, ExternalLink } from 'lucide-react';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const skills = [
    'JavaScript', 'React', 'Java Spring Boot', 'REST API', 
    'SAP UI5', 'HTML/CSS', 'AWS', 'Data Structures & Algorithms',
    'JIRA', 'Github', 'Microservices', 'Node.js'
  ];

  const experiences = [
    {
      title: "Senior Member Of Technical Staff",
      company: "Athenahealth",
      period: "Apr 2025–Present",
      location: "Chennai, India",
      description: [
        "Transitioned to backend development, focusing on building scalable microservices using Java Spring Boot",
        "Designed and implemented RESTful APIs for critical healthcare workflows",
        "Collaborated cross-functionally to integrate backend services with React-based frontends"
      ]
    },
    {
      title: "Member Of Technical Staff",
      company: "Athenahealth",
      period: "Mar 2021–Mar 2025",
      location: "Chennai, India",
      description: [
        "Developed Product Authops - an authorization system for medical claims",
        "Revolutionized the user interface by integrating a Z-pattern framework, enhancing BPO agents workflow efficiency by 20% and reducing task completion time by 25%",
        "Implemented various functionalities in UI using React and forge components for agents to process medical claims",
        "Integrated the application with APIs to retrieve data and populate interface screens"
      ]
    },
    {
      title: "Software Engineer",
      company: "Oracle Cerner",
      period: "Nov 2020–Mar 2021",
      location: "Bangalore, India",
      description: [
        "Contributed as a software engineer at Cerner Corporation on the Partogram Project built with React"
      ]
    }
  ];

  const education = [
    {
      degree: "Master of Technology (Software Engineering)",
      institution: "Motilal Nehru National Institute of Technology",
      location: "Allahabad, U.P.",
      grade: "CPI: 8.2/10"
    },
    {
      degree: "Bachelor of Technology (Computer Science and Engineering)",
      institution: "Bhilai Institute of Technology",
      location: "Durg, C.G.",
      grade: "CGPA: 7.92/10"
    }
  ];

  const projects = [
    {
      title: "Pdhantu Classes (Online Test Platform)",
      description: "This website is designed for students where they can give test and see their performance",
      link: "https://github.com/Pdhantu-Classes",
      tech: ["React", "JavaScript", "REST API"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-lg z-50 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ashish Umrey
            </h1>
            <div className="hidden md:flex space-x-8">
              {['about', 'experience', 'education', 'projects', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize transition-all duration-300 ${
                    activeSection === section 
                      ? 'text-blue-400 border-b-2 border-blue-400' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
           <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center p-1">
                <img
                    src={process.env.PUBLIC_URL + "/ashish-pic.jpeg"}
                    alt="Ashish Umrey"
                    className="w-28 h-28 object-cover rounded-full border border-white/20"
                    style={{ width: '98px', height: '98px', objectFit: 'cover' }} // fallback for w-22 h-22
                />
                </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ashish Umrey
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-8">
              Software Engineer
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-gray-400">
              <div className="flex items-center gap-2">
                <Mail size={20} />
                <span>ashishumrey009@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={20} />
                <span>8435389995</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span>Chennai, Tamil Nadu, India</span>
              </div>
            </div>
            <div className="flex justify-center gap-6 mb-12">
              <a href="https://www.linkedin.com/in/ashishumreymnnit" target="_blank" rel="noopener noreferrer" 
                 className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
                <Linkedin size={24} className="text-blue-400" />
              </a>
              <a href="https://github.com/ashishumrey009" target="_blank" rel="noopener noreferrer"
                 className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
                <Github size={24} className="text-gray-300" />
              </a>
              <a href="https://ashishumrey009.github.io/" target="_blank" rel="noopener noreferrer"
                 className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
                <Globe size={24} className="text-green-400" />
              </a>
            </div>
            <button 
              onClick={() => scrollToSection('experience')}
              className="animate-bounce p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300"
            >
              <ChevronDown size={24} className="text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Skills & Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {skills.map((skill, index) => (
              <div key={skill} 
                   className={`p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg text-center backdrop-blur-sm border border-white/10 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                   style={{ transitionDelay: `${index * 100}ms` }}>
                <span className="text-white font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <Briefcase className="mr-4 text-blue-400" size={40} />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Professional Experience
            </h2>
          </div>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                    <p className="text-xl text-blue-400 mb-2">{exp.company}</p>
                    <p className="text-gray-400">{exp.location}</p>
                  </div>
                  <span className="text-purple-400 font-medium mt-2 md:mt-0">{exp.period}</span>
                </div>
                <ul className="space-y-2">
                  {exp.description.map((desc, i) => (
                    <li key={i} className="text-gray-300 flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-16 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <GraduationCap className="mr-4 text-purple-400" size={40} />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Education
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-3">{edu.degree}</h3>
                <p className="text-purple-400 text-lg mb-2">{edu.institution}</p>
                <p className="text-gray-400 mb-2">{edu.location}</p>
                <p className="text-green-400 font-medium">{edu.grade}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <Code className="mr-4 text-green-400" size={40} />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Projects
            </h2>
          </div>
          <div className="grid gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                  <a href={project.link} target="_blank" rel="noopener noreferrer"
                     className="p-2 bg-green-500/20 rounded-lg hover:bg-green-500/30 transition-all duration-300">
                    <ExternalLink size={20} className="text-green-400" />
                  </a>
                </div>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <Award className="mr-4 text-yellow-400" size={40} />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Achievements & Activities
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Professional Achievements</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  Successfully passed CGPSC exam for Lecturer position (2015-2016)
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  GATE Qualified: 2015, 2016, 2017
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  Serving as Scrum Master since November 2024
                </li>
              </ul>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Leadership & Teaching</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Teaching Assistant/Lab Assistant at MNNIT Allahabad
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Thesis: Network Traffic Classification Techniques using ML
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Mentor: Dr. Anil Kumar Singh (HOD CSE Department)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-12">
            <MessageSquare className="mr-4 text-pink-400" size={40} />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
              Let's Connect
            </h2>
          </div>
          <p className="text-xl text-gray-300 mb-8">
            I'm always open to discussing new opportunities and interesting projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:ashishumrey009@gmail.com" 
               className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
              Send Email
            </a>
            <a href="https://www.linkedin.com/in/ashishumreymnnit" target="_blank" rel="noopener noreferrer"
               className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-black/40 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 Ashish Umrey. Built with React and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;