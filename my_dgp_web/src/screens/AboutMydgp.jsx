import React from 'react';
import HamburgerMenu from '../components/components/HamburgerMenu';

export default function AboutMydgp() {
    return (
       <div>
            <HamburgerMenu />
            <div className='static-page-container'>
                <iframe src="https://docs.google.com/document/d/e/2PACX-1vSBGraW2KvWorJa8TEspBkLhx98CRMTSfTyj_lAd9y82O4Fycq_tDWTrULPrlP4N5YL44idqaTedLJ6/pub?embedded=true" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 'none' }}>
                </iframe>
            </div>
            </div>
    );
}
