import React, { useState } from 'react';
import { FAQDATA } from './faq-data';
import HamburgerMenu from '../../components/components/HamburgerMenu';

const FAQPage = ({ faqDatas }) => {
  const [faqData, setFaqData] = useState(FAQDATA);

  return (
    <>
        <HamburgerMenu />
        <div className='static-page-container'>
        <h1 style={{textAlign:"center"}}>FAQ</h1>

        {faqData.map((section, index) => (
            <div key={index} className="faq-section mb-4">
            <h2>{section.heading}</h2>
            <div className="accordion" id={`accordion-${index}`}>
                {section.content.map((faq, idx) => (
                <div key={idx} className="accordion-item">
                    <h2 className="accordion-header" id={`heading-${index}-${idx}`}>
                    <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${index}-${idx}`}
                        aria-expanded="true"
                        aria-controls={`collapse-${index}-${idx}`}
                    >
                        {faq.question}
                    </button>
                    </h2>
                    <div
                    id={`collapse-${index}-${idx}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading-${index}-${idx}`}
                    data-bs-parent={`#accordion-${index}`}
                    >
                    <div className="accordion-body">
                        {faq.answer}
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        ))}
        </div>
    </>
  );
};

export default FAQPage;
