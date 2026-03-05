// ============================================
// FILE: src/components/layout/Footer.jsx
// ============================================
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", path: "/about" },
      { name: "Courses", path: "/courses" },
      { name: "Contact", path: "/contact" },
      { name: "Blog", path: "/blog" },
    ],
    programs: [
      { name: "Job Readiness Masterclass", path: "/courses" },
      { name: "LinkedIn Optimisation", path: "/courses" },
      { name: "Career Resilience", path: "/courses" },
      { name: "Career Insights", path: "/blog" },
    ],
    support: [
      { name: "Help Center", path: "/contact", key: "help-center" },
      { name: "FAQs", path: "/contact", key: "faqs" },
      { name: "Privacy Policy", path: "/privacy", key: "privacy-policy" },
      { name: "Terms of Service", path: "/privacy", key: "terms-of-service" },
    ],
  };

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://facebook.com/jobladda",
      label: "Facebook",
    },
    {
      icon: FaTwitter,
      href: "https://twitter.com/jobladda",
      label: "Twitter",
    },
    {
      icon: FaInstagram,
      href: "https://instagram.com/jobladda",
      label: "Instagram",
    },
    {
      icon: FaLinkedinIn,
      href: "https://linkedin.com/company/jobladda",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="bg-[#010916] border-t border-[#081422] mt-auto">
      <div className="container-custom py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-secondary-400 to-secondary-600">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">
                Jobladda
              </span>
            </Link>
            <p className="text-sm text-blue-50 mb-3 max-w-sm">
              Stop wondering why you’re not getting hired. Jobladda helps you
              discover the truth and gives you a clear path to fix it.
            </p>

            {/* Contact Info */}
            <div className="space-y-1.5 text-sm text-blue-50">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:support@jobladda.io"
                  className="hover:text-white transition-colors"
                >
                  support@jobladda.io
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+234 XXX XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-blue-700 mb-3">Company</h3>
            <ul className="space-y-1.5">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-blue-50 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Links */}
          <div>
            <h3 className="font-semibold text-blue-700 mb-3">Programs</h3>
            <ul className="space-y-1.5">
              {footerLinks.programs.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-blue-50 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-blue-700 mb-3">Support</h3>
            <ul className="space-y-1.5">
              {footerLinks.support.map((link) => (
                <li key={link.key || link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-blue-50 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-[#1a3a5c]">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            {/* Copyright */}
            <p className="text-sm text-blue-500">
              © {currentYear} Jobladda. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
