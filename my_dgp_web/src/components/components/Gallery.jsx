import React, { useState } from 'react';
import ReactPlayer from 'react-player'; 

const Gallery = ({images}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Inline styles
  const galleryStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    padding: '10px',
    alignItems:'center',
    marginBottom:20,
    //can be removed vv
    display:'flex',
    justifyContent:'space-evenly',
    flexWrap:'wrap',
  };

  const imageStyle = {
    width: '110px',
    height: '110px',
    objectFit: 'cover', 
    cursor: 'pointer',
    transition: 'transform 0.2s',
  };

  const lightboxStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const carouselContainerStyle = {
    display: 'flex',
    overflow: 'hidden',
    width: '90%',
    height: '90%',
    position: 'relative',
  };

  const carouselInnerStyle = {
    display: 'flex',
    transition: 'transform 0.5s ease-in-out',
    transform: `translateX(-${currentImageIndex * 100}%)`,
    width: `${images.length * 100}%`,
  };

  const carouselItemStyle = {
    flex: '0 0 100%',
    maxHeight: '100%',
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',  // Ensures the full image fits within the container
  };

  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    bottom: '20px',
    width: '100%',
    padding: '0 20px',
    justifyContent: 'space-between',
  };

  const buttonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    fontSize: '20px',
    width:'40px',
    height:'40px',
    fontWeight:'500'
  };

  const closeButtonStyle = {
    ...buttonStyle,
    position: 'absolute',
    top: '20px',
    right: '20px',
  };

  const infoStyle = {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
  };

  // https://drive.google.com/thumbnail?id=1IJ-DpfKUy8QBw7z34oCmxuVVlYTI714e
  return (
    <div>
      <div style={galleryStyle}>
        {images.map((src, index) => (
           <div key={index} >
           {typeof src === 'string' && src.endsWith('.mp4') ? (
             <ReactPlayer key={currentImageIndex} url={src} width={'110px'} height={'110px'}playing={false}   onClick={() => openLightbox(index)}   />
           ) : (
            <img
            key={index}
            src={src}
            alt={`Image ${index + 1}`}
            style={imageStyle}
            onClick={() => openLightbox(index)}
          />           )}
         </div> 
         
        ))}
      </div>

      {isOpen && (
        <div style={lightboxStyle}>
          <div style={carouselContainerStyle}>
            <div style={carouselInnerStyle}>
              {images.map((src, index) => (
                <div key={index} style={carouselItemStyle}>
                  {typeof src === 'string' && src.endsWith('.mp4') ? (
                    <ReactPlayer key={currentImageIndex} url={src} width="100%" height="100%" controls={false} 
                      playing={currentImageIndex === index}  />
                  ) : (
                    <img src={src} alt={`Media ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  )}
                </div>
              ))}
            </div>
          </div> 
          <div style={buttonContainerStyle}>
            <button style={buttonStyle} onClick={goToPrevious}>
              &lt;
            </button>
            <div style={infoStyle}>
              {currentImageIndex + 1}/{images.length}
            </div>
            <button style={buttonStyle} onClick={goToNext}>
              &gt;
            </button>
          </div>
          <button style={closeButtonStyle} onClick={closeLightbox}>
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
