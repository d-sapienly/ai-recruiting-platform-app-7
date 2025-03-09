import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    content: "I found my dream job within two weeks of signing up. The AI matching technology is incredibly accurate!",
    author: "Sarah Johnson",
    role: "Software Engineer",
    company: "TechCorp",
    image: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    content: "As a hiring manager, this platform has cut our recruitment time in half. The quality of candidates is outstanding.",
    author: "Michael Chen",
    role: "HR Director",
    company: "Innovate Inc.",
    image: "https://randomuser.me/api/portraits/men/46.jpg"
  },
  {
    content: "The platform's intuitive design and powerful features make recruiting top talent easier than ever before.",
    author: "Emily Rodriguez",
    role: "Talent Acquisition",
    company: "Global Solutions",
    image: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

const TestimonialSection: React.FC = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Success Stories
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Hear from users who have transformed their hiring process and career journey with our platform.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md overflow-hidden p-6 relative"
              >
                <div className="absolute top-0 right-0 -mt-3 -mr-3 h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                  </svg>
                </div>
                <div className="h-full flex flex-col">
                  <div className="flex-grow">
                    <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={testimonial.image}
                        alt={testimonial.author}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                      <div className="text-sm text-gray-500">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
