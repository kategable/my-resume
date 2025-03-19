import * as React from "react"
import * as styles from "./footer.module.css"

const Footer = () => {
  return (
    <footer id="footer" className={styles.footer}>
      <ul className={styles.icons}>
        <li>
          <a href="https://github.com/kategable" rel="noopener" aria-label="GitHub">
            <i className="fab fa-github"></i>
          </a>
        </li>
        <li>
          <a href="https://twitter.com/katesky8" rel="noopener" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
        </li>
        <li>
          <a href="http://shorturl.at/iBJLO" rel="noopener" aria-label="YouTube">
            <i className="fab fa-youtube"></i>
          </a>
        </li>
        <li>
          <a href="mailto:kate+site@csa-technologies.com" aria-label="Email">
            <i className="fas fa-envelope"></i>
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/kategable/" rel="noopener" aria-label="LinkedIn">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </li>
      </ul>
      <ul className={styles.copyright}>
        <li>© Kate Gable</li>
      </ul>
    </footer>
  )
}

export default Footer 