import * as React from "react"
import { Link } from "gatsby"
import * as styles from "./header.module.css"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <header className={`${styles.header} ${isMenuOpen ? styles.menuOpen : ''}`}>
      <nav className={styles.nav}>
        {/* Logo/Name */}
        <Link to="/" className={styles.logo}>
        
        </Link>

        {/* Hamburger Menu Button */}
        <button 
          className={styles.hamburger}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.active : ''}`}></span>
        </button>

        {/* Navigation Links */}
        <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <a href="https://katesky.com/blog" className={styles.navLink} rel="noopener">Blog</a>
          <Link to="https://github.com/kategable/my-resume" className={styles.resumeButton}>Resume</Link>
        </div>
      </nav>
    </header>   
  )
}

export default Header
