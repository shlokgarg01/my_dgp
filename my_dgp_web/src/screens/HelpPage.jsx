import React from 'react';
import HamburgerMenu from '../components/components/HamburgerMenu';

const HelpPage = () => {
    return (
        <>
        <HamburgerMenu />
            <div className='static-page-container'>
                <h1>Help & Support</h1>
                <p>Last updated: July 21, 2024</p>
                
                <p>Welcome to the Help & Support page. Here you can find answers to common questions and learn how to use our services.</p>
                
                <h2>Frequently Asked Questions (FAQs)</h2>
                
                <h3>Account Management</h3>
                <ul>
                    <li>
                        <strong>How do I create an account?</strong>
                        <p>To create an account, click on the 'Sign Up' button at the top right corner of the homepage and follow the instructions.</p>
                    </li>
                    <li>
                        <strong>How do I reset my password?</strong>
                        <p>If you've forgotten your password, click on the 'Forgot Password' link on the login page and follow the instructions to reset it.</p>
                    </li>
                </ul>
                
                <h3>Orders and Payments</h3>
                <ul>
                    <li>
                        <strong>How can I track my order?</strong>
                        <p>To track your order, go to 'My Orders' in your account dashboard and click on the order you want to track.</p>
                    </li>
                    <li>
                        <strong>What payment methods do you accept?</strong>
                        <p>We accept all major credit cards, PayPal, and other payment methods as indicated during the checkout process.</p>
                    </li>
                </ul>
                
                <h3>Shipping and Delivery</h3>
                <ul>
                    <li>
                        <strong>What are the shipping options?</strong>
                        <p>We offer standard, expedited, and overnight shipping options. You can select your preferred shipping method at checkout.</p>
                    </li>
                    <li>
                        <strong>Can I change my shipping address after placing an order?</strong>
                        <p>If you need to change your shipping address, please contact our support team as soon as possible. We will do our best to accommodate your request.</p>
                    </li>
                </ul>
                
                <h2>Contact Us</h2>
                <p>If you need further assistance, please contact our support team:</p>
                <ul>
                    <li>By email: support@yourcompany.com</li>
                    <li>By phone number: YourCompanyPhoneNumber</li>
                    <li>By visiting this page on our website: YourWebsiteURL/contact</li>
                </ul>
                
                <h2>Live Chat Support</h2>
                <p>For immediate assistance, you can use our live chat support available on our website during business hours.</p>
                
                <h2>Community Forum</h2>
                <p>Join our community forum to discuss and find solutions to common issues with other users. Visit: YourWebsiteURL/forum</p>
                
                <h2>Documentation</h2>
                <p>Explore our detailed documentation and tutorials to help you get the most out of our services. Visit: YourWebsiteURL/docs</p>
            </div>
        </>
    );
}

export default HelpPage;
