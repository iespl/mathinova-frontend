import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="footer-section-v2 text-text-muted text-sm border-b-8 border-brand-primary">
            <div className="container mx-auto px-4 footer-grid-v2">
                <div className="col-span-1 md:col-span-2">
                    <span className="text-lg font-bold text-text-primary block mb-4">Mathinova</span>
                    <p className="max-w-xs">Premium Engineering Mathematics learning platform for VTU and autonomous colleges.</p>
                </div>
                <div>
                    <h4 className="font-bold text-text-primary mb-4">Platform</h4>
                    <ul className="footer-list space-y-2">
                        <li><Link to="/discovery" className="footer-link hover:text-brand-primary">Courses</Link></li>
                        <li><Link to="/blog" className="footer-link hover:text-brand-primary">Blog</Link></li>
                        <li><Link to="/discovery" className="footer-link hover:text-brand-primary">Pricing</Link></li>
                        <li><Link to="/login" className="footer-link hover:text-brand-primary">Login</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-text-primary mb-4">Legal</h4>
                    <ul className="footer-list space-y-2">
                        <li><a href="#" className="footer-link hover:text-brand-primary">Terms of Service</a></li>
                        <li><a href="#" className="footer-link hover:text-brand-primary">Privacy Policy</a></li>
                        <li><a href="#" className="footer-link hover:text-brand-primary">Contact Us</a></li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 footer-copyright-v2">
                &copy; {new Date().getFullYear()} Mathinova. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
