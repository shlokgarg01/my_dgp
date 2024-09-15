import React, { useState } from 'react';
import Sheet from 'react-modal-sheet';
import './DemoContentModal.css';
import Gallery from '../Gallery';
import { IoIosClose } from "react-icons/io";

// Dummy image data for demonstration
const images = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  src: `https://picsum.photos/200?random=${index}`,
}));

const DemoContentModal = ({ excessCharge, onClose,price,packageName,description,images }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(true); // Bottom sheet initially open

  return (
    <div className="DemoContentModal">
      <Sheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        detent="content-height"
        disableDrag={true}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
          <IoIosClose onClick={onClose} size={40} style={{position:'absolute',left:'45%',top:-90,background:'white',borderRadius:20}} />
          <div style={{overflowY: 'scroll',maxHeight:'70vh' }}>
            <div style = {{fontSize:20} }className='heading bold-text' >{packageName}
              <div style={{ fontSize:12,fontWeight:'normal'}}>
                {description}
              </div>
            </div>
            <div className='estimated-container'>
              <div className='bold-text' style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
              <div>
                Estimated Charges
              </div>
              <div>
              ₹{price}
              </div>
              </div>
              <div className='excessChargeText'>
              Charges of ₹{excessCharge}/Min. will be incurred for any time exceeding the selected duration
              </div>
            </div>
           {images?.length >1 && <div style={{marginLeft:'20px'}} className='bold-text'>Our Past Work</div>}
            <Gallery images={images} />
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </div>
  );
};

export default DemoContentModal;
