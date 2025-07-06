import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  course: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Software Developer",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    content: "The course structure and teaching methodology at Gurukul are exceptional. I went from being a complete beginner to landing my dream job in tech.",
    rating: 5,
    course: "Full Stack Web Development"
  },
  {
    id: 2,
    name: "Rahul Patel",
    role: "Data Scientist",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    content: "I completed the Data Science course, and it was transformative. The practical projects helped me understand complex concepts easily.",
    rating: 5,
    course: "Data Science & Analytics"
  },
  {
    id: 3,
    name: "Ananya Gupta",
    role: "UX Designer",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    content: "The UI/UX Design course exceeded my expectations. The curriculum is up-to-date with industry standards.",
    rating: 5,
    course: "UI/UX Design"
  },
  {
    id: 4,
    name: "Arjun Reddy",
    role: "Cloud Engineer",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    content: "The Cloud Computing certification program gave me the confidence to transition into cloud technologies.",
    rating: 5,
    course: "Cloud Computing"
  },
  {
    id: 5,
    name: "Neha Verma",
    role: "Mobile Developer",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    content: "The mobile development course was comprehensive and practical. I learned to build real-world apps.",
    rating: 5,
    course: "Mobile App Development"
  },
  {
    id: 6,
    name: "Karthik Raja",
    role: "DevOps Engineer",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    content: "The DevOps course helped me master modern deployment practices and CI/CD pipelines.",
    rating: 5,
    course: "DevOps & Cloud"
  }
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg mx-4 my-8 w-[350px] flex-shrink-0">
    <div className="flex items-center mb-4">
      <img
        src={testimonial.image}
        alt={testimonial.name}
        className="w-12 h-12 rounded-full object-cover mr-4"
      />
      <div>
        <h3 className="font-semibold text-lg">{testimonial.name}</h3>
        <p className="text-gray-600 text-sm">{testimonial.role}</p>
      </div>
    </div>
    <div className="flex mb-3">
      {[...Array(testimonial.rating)].map((_, index) => (
        <Star key={index} className="w-4 h-4 fill-current text-yellow-400" />
      ))}
    </div>
    <p className="text-gray-600 text-sm italic mb-3">"{testimonial.content}"</p>
    <p className="text-blue-600 text-sm font-medium">{testimonial.course}</p>
  </div>
);

const Testimonials: React.FC = () => {
  // Double the testimonials array for seamless looping
  const doubledTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from our successful students who have transformed their careers through our courses
          </p>
        </div>

        <div className="relative">
          {/* First row - scrolling left */}
          <motion.div
            className="flex"
            animate={{
              x: [0, -1750],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {doubledTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`row1-${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </motion.div>

          {/* Second row - scrolling right */}
          <motion.div
            className="flex mt-8"
            animate={{
              x: [-1750, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {doubledTestimonials.reverse().map((testimonial, index) => (
              <TestimonialCard key={`row2-${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </motion.div>

          {/* Gradient overlays */}
          <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 