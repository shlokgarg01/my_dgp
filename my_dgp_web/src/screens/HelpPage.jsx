import React from 'react';
import HamburgerMenu from '../components/components/HamburgerMenu';
import Colors from '../utils/Colors';

const HelpPage = () => {
  const imageUrl =
    'https://cdni.iconscout.com/illustration/premium/thumb/customer-help-centre-4488109-3738501.png?f=webp';

  // Function to handle calling functionality
  const handleCall = () => {
    window.open('tel:+918595703734');
  };

  // Function to handle opening WhatsApp
  const handleWhatsApp = () => {
    window.open('https://wa.me/+918076255278');
  };

  // Inline styles
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
    },
    helpContent: {
      textAlign: 'center',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
    },
    helpImage: {
      width: '300px',
      height: '300px',
      objectFit: 'contain',
      marginBottom: '20px',
    },
    contactInfo: {
      textAlign: 'center',
    },
    title: {
      fontSize: '24px',
      marginBottom: '10px',
    },
    tabs: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '10px',
    },
    button: {
      backgroundColor: Colors.PRIMARY,
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '6px',
      margin: '0 10px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div>
        <HamburgerMenu />
    <div style={styles.container}>
      <div style={styles.helpContent}>
        <img
          src={imageUrl}
          alt="Help"
          style={styles.helpImage}
        />
        <div style={styles.contactInfo}>
          <h1 style={styles.title}>Need Help?</h1>
          <p>If you have any questions, feel free to contact us:</p>
          <div style={styles.tabs}>
            <button
              style={styles.button}
              onClick={handleCall}
            >
              Call: 8076255278
            </button>
            <button
              style={styles.button}
              onClick={handleWhatsApp}
            >
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HelpPage;
