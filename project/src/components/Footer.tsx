import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold">Gurukul</span>
            </Link>
            <p className="mt-4 text-gray-600">
              Transforming education through innovative technology and a learner-centered approach.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/courses" className="text-gray-600 hover:text-blue-600">Courses</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-blue-600">About Us</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-blue-600">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-600">
              <li>contact@gurukul.com</li>
              <li>+91 123 456 7890</li>
              <li>Telangana, India</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600"><Facebook size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-blue-600"><Twitter size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-blue-600"><Instagram size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-blue-600"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Gurukul. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;