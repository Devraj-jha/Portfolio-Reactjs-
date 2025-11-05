// // src/components/ContactModal/ContactModal.jsx
// import { useState } from 'react'
// import './ContactModal.css'

// const ContactModal = ({ isOpen, onClose }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: ''
//   })

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     const mailtoLink = `mailto:forwork.dj100806@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage: ${formData.message}`)}`
//     window.location.href = mailtoLink
//     onClose()
//   }

//   if (!isOpen) return null

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content scale-in" onClick={(e) => e.stopPropagation()}>
//         <div className="modal-header">
//           <h2 className="modal-title">Get In Touch</h2>
//           <button className="close-button" onClick={onClose}>
//             <svg viewBox="0 0 24 24" fill="currentColor">
//               <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
//             </svg>
//           </button>
//         </div>
        
//         <form className="contact-form" onSubmit={handleSubmit}>
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="name" className="form-label">Name</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="form-input"
//                 required
//                 placeholder="Your full name"
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="email" className="form-label">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="form-input"
//                 required
//                 placeholder="your.email@example.com"
//               />
//             </div>
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="subject" className="form-label">Subject</label>
//             <input
//               type="text"
//               id="subject"
//               name="subject"
//               value={formData.subject}
//               onChange={handleChange}
//               className="form-input"
//               required
//               placeholder="What's this about?"
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="message" className="form-label">Message</label>
//             <textarea
//               id="message"
//               name="message"
//               rows="6"
//               value={formData.message}
//               onChange={handleChange}
//               className="form-textarea"
//               required
//               placeholder="Your message here..."
//             ></textarea>
//           </div>
          
//           <button type="submit" className="submit-button">
//             <span>Send Message</span>
//             <svg viewBox="0 0 24 24" fill="currentColor">
//               <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
//             </svg>
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default ContactModal


// src/components/ContactModal/ContactModal.jsx
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

        <div className="contact-info text-center">
          <p className="contact-text">
            You can reach me directly via email or message me on X.
          </p>

          <p className="contact-link">
            📧 <a href="mailto:forwork.dj100806@gmail.com" target="_blank" rel="noopener noreferrer">
              forwork.dj100806@gmail.com
            </a>
          </p>

          <p className="contact-link">
            🕊️ <a href="https://x.com/djjha_" target="_blank" rel="noopener noreferrer">
              Message me on X
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;


