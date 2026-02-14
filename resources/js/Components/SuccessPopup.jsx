import React from 'react';

const SuccessPopup = ({
       isOpen,
       onClose,
       message = "Bid Placed Successfully",
       subMessage = "Your bid has been recorded!"
}) => {
       if (!isOpen) return null;

       const handleClose = () => {
              if (onClose) onClose();
       };

       const styles = {
              overlay: {
                     position: 'fixed',
                     top: 0,
                     left: 0,
                     width: '100%',
                     height: '100%',
                     background: 'rgba(0, 0, 0, 0.5)',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     zIndex: 9999,
              },
              popup: {
                     background: 'linear-gradient(135deg, #ffffff, #ffff)',
                     padding: '50px 60px',
                     borderRadius: '16px',
                     textAlign: 'center',
                     position: 'relative',
                     boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                     border: '1px solid #cceeff',
                     maxWidth: '500px',
                     width: '90%',
                     margin: '0 auto',
              },
              closeBtn: {
                     position: 'absolute',
                     top: '10px',
                     right: '20px',
                     border: 'none',
                     background: 'transparent',
                     fontSize: '20px',
                     cursor: 'pointer',
              },
              imageContainer: {
                     marginBottom: '20px',
              },
              successImage: {
                     width: '100px',
                     height: '100px',
              },
              message: {
                     fontSize: '30px',
                     fontWeight: 'bolder',
                     color: '#5cb85c',
                     marginBottom: '10px',
              },
              subMessage: {
                     fontSize: '18px',
                     color: '#555',
                     marginBottom: '10px',
                     lineHeight: 1.5,
                     wordWrap: 'break-word',
                     overflowWrap: 'break-word',
              }
       };

       return (
              <div style={styles.overlay} onClick={handleClose}>
                     <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
                            <button style={styles.closeBtn} onClick={handleClose}>✕</button>
                            <div style={styles.imageContainer}>
                                   <img src="/assets/images/successimg.png" alt="Success" style={styles.successImage} />
                            </div>
                            <div style={styles.message}>{message}</div>
                            <div style={styles.subMessage}>{subMessage}</div>
                     </div>
              </div>
       );
};

export default SuccessPopup;
