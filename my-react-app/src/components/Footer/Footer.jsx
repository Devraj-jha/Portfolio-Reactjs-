import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-links">
          <a href="https://x.com/djjhacodes" target="_blank" rel="noopener noreferrer">X</a>
          <span className="footer-sep">·</span>
          <a href="https://github.com/Devraj-jha" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span className="footer-sep">·</span>
          <a href="https://www.youtube.com/@djjhaTech" target="_blank" rel="noopener noreferrer">YouTube</a>
          <span className="footer-sep">·</span>
          <a href="https://www.linkedin.com/in/devraj-jha-4ba7a2342/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
        <p className="footer-copy">&copy; {currentYear} Devraj Jha</p>
      </div>
    </footer>
  )
}

export default Footer