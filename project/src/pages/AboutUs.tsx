import React from 'react';
import { Users, Target, Book, Award, Lightbulb, Heart, Shield, Zap } from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Embracing cutting-edge technology and modern teaching methods to provide the best learning experience."
    },
    {
      icon: Heart,
      title: "Student-Centric",
      description: "Putting our students first with personalized learning paths and dedicated support."
    },
    {
      icon: Shield,
      title: "Quality",
      description: "Maintaining high standards in our course content and teaching methodology."
    },
    {
      icon: Zap,
      title: "Impact",
      description: "Creating real-world impact through practical, industry-relevant education."
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Founder & CEO",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      description: "Former Professor at IIT with 20+ years of experience in education technology."
    },
    {
      name: "Priya Mehta",
      role: "Head of Academics",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      description: "PhD in Educational Psychology, focused on online learning methodologies."
    },
    {
      name: "Arun Sharma",
      role: "Technical Director",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      description: "15+ years of experience in building educational technology platforms."
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Gurukul</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming education through innovative technology and a learner-centered approach.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              At Gurukul, we believe that education has the power to transform lives. Our mission is 
              to make high-quality education accessible to everyone, breaking down barriers and 
              empowering individuals to reach their full potential.
            </p>
            <p className="text-gray-600">
              Founded in 2018, Gurukul has grown from a small startup to a leading edutech platform 
              serving thousands of students across India. We combine cutting-edge technology with 
              expert-led instruction to create an engaging and effective learning experience.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
              alt="Our mission"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
            <p className="text-gray-600">Milestones that mark our journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">10,000+</h3>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div className="text-center">
              <Book className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">100+</h3>
              <p className="text-gray-600">Courses</p>
            </div>
            <div className="text-center">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">95%</h3>
              <p className="text-gray-600">Completion Rate</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">50+</h3>
              <p className="text-gray-600">Industry Partners</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
            <p className="text-gray-600">Meet the people behind Gurukul</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-center mb-2">{member.name}</h3>
                <p className="text-blue-600 text-center mb-4">{member.role}</p>
                <p className="text-gray-600 text-center">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Teaching Methodology */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Teaching Methodology</h2>
            <p className="text-gray-600">What makes our education system unique</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Book className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
                  <p className="text-gray-600">
                    Engaging content with real-time feedback and interactive exercises to ensure better understanding.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Peer Learning</h3>
                  <p className="text-gray-600">
                    Collaborative learning environment where students can learn from and support each other.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Practical Approach</h3>
                  <p className="text-gray-600">
                    Focus on hands-on projects and real-world applications to build practical skills.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Industry Recognition</h3>
                  <p className="text-gray-600">
                    Courses designed in collaboration with industry experts to ensure relevance and quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;