import React from 'react';
import CoursesComponent from '../components/Courses';
import SEO from '../components/SEO';

const Courses = () => {
  return (
    <>
      <SEO 
        title="Courses | Young CEO Program"
        description="Explore our comprehensive 12-week program designed to develop young entrepreneurs with hands-on learning and real projects."
        keywords={["courses", "entrepreneurship", "business education", "young ceo", "learning path"]}
      />
      <div className="pt-16">
        <CoursesComponent />
      </div>
    </>
  );
};

export default Courses; 