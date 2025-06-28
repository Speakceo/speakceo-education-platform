import React from 'react';
import ComingSoon from '../components/common/ComingSoon';
import SEO from '../components/SEO';

const Blog: React.FC = () => {
  return (
    <>
      <SEO 
        title="Blog | Young CEO Program"
        description="Read our latest articles on entrepreneurship, business tips, and success stories."
        keywords={["entrepreneurship blog", "business tips", "young entrepreneurs", "success stories"]}
      />
      <ComingSoon 
        title="Blog Coming Soon!"
        description="We're crafting valuable content to help you on your entrepreneurial journey. Check back soon!"
      />
    </>
  );
};

export default Blog; 