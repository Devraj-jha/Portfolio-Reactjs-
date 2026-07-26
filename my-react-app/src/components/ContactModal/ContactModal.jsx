import "./ContactModal.css";

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Get In Touch</h2>
          <button className="close-button" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <div className="contact-info">
          <p className="contact-text">
            You can reach me directly via email or message me on X.
          </p>

          <div className="contact-links">
            <a href="mailto:forwork.dj100806@gmail.com" className="contact-link-item" target="_blank" rel="noopener noreferrer">
              <span className="contact-icon">📧</span>
              <span>forwork.dj100806@gmail.com</span>
            </a>

            <a href="https://x.com/djjha_" className="contact-link-item" target="_blank" rel="noopener noreferrer">
              <span className="contact-icon">🐦</span>
              <span>Message me on X</span>
            </a>

            <a href="https://github.com/Devraj-jha" className="contact-link-item" target="_blank" rel="noopener noreferrer">
              <span className="contact-icon">💻</span>
              <span>GitHub Profile</span>
            </a>

            <a href="https://www.linkedin.com/in/devraj-jha-4ba7a2342/" className="contact-link-item" target="_blank" rel="noopener noreferrer">
              <span className="contact-icon">💼</span>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
