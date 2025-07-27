
import React from 'react';

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-foreground text-background py-8 relative ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Zynx Data</h3>
            <p className="text-background/80">
              Leading the way in culturally aware artificial general intelligence.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-agi-yellow transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-agi-yellow transition-colors">Research</a></li>
              <li><a href="#" className="hover:text-agi-yellow transition-colors">Products</a></li>
              <li><a href="#" className="hover:text-agi-yellow transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-agi-yellow transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-agi-yellow transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-agi-yellow transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60">
          <p>&copy; 2024 Zynx Data. All rights reserved.</p>
        </div>
      </div>
      
      {/* Zynx Logo in bottom right corner */}
      <div className="absolute bottom-4 right-4">
        <div className="text-2xl font-bold text-background/60 hover:text-agi-yellow transition-colors duration-300 cursor-pointer">
          Zynx
        </div>
      </div>
    </footer>
  );
};

export default Footer;
