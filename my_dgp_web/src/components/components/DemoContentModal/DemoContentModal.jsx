import React, { useState } from 'react';
import Sheet  from 'react-modal-sheet'; // Import the Sheet component
import './DemoContentModal.css'; // Import the CSS file with styles

// Dummy image data for demonstration
const images = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  src: `https://picsum.photos/200?random=${index}`,
}));

const DemoContentModal = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(true); // Bottom sheet initially open
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openImage = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setIsSheetOpen(false); // Close bottom sheet
    setIsFullscreenOpen(true); // Open full-screen modal
  };

  const closeFullscreen = () => {
    setIsFullscreenOpen(false)
    setIsSheetOpen(true)
  };

  const showNextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const showPrevImage = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
    setCurrentIndex(prevIndex);
  };

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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginLeft: 16,
                marginRight: 16,
                alignItems: "center",
              }}
            >
              <h3>Demo Pictures</h3>
              <div className="grid">
                {images.map((image, index) => (
                  <div key={image.id} className="tile" onClick={() => openImage(image, index)}>
                    <img src={image.src} alt={`Tile ${image.id}`} />
                  </div>
                ))}
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>

      {isFullscreenOpen && (
        <div className="fullscreen-overlay">
          <div className="fullscreen-content">
            <button className="close-button" onClick={closeFullscreen}>×</button>
            <button className="prev" onClick={showPrevImage}>&lt;</button>
            {selectedImage && <img src={selectedImage.src} alt="Full-screen" className="fullscreen-image" />}
            <button className="next" onClick={showNextImage}>&gt;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoContentModal;
