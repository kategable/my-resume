import React from "react"
import { StaticImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"

const IndexPage = () => {
  const scrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <StaticImage
            src="../images/katesky.jpeg"
            alt="Background"
            className="hero-bg-image"
            layout="fullWidth"
            placeholder="blurred"
            loading="eager"
            priority={true}
            quality={90}
            formats={["auto", "webp"]}
          />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Kate Gable</h1>
          <p>Code, Creativity, and a Little Bit of Magic</p>
          <a href="#about" onClick={scrollToAbout} className="cta-button">Learn More...</a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-content">
          <h2>A Little More <strong>About</strong> Me</h2>
          <p>
            Hi, I'm Kate—<strong>a full-stack developer, tech consultant, speaker, and mentor</strong> with over two decades of experience crafting exceptional web applications. My expertise lies in <strong>front-end development</strong>, particularly <strong>Angular</strong>, where I've spent years perfecting the art of creating seamless user experiences.
          </p>
          
          <p>
            I'm also the <strong>founder of CSA Technologies Inc.</strong>, where I've helped businesses build <strong>powerful, functional, and scalable web applications</strong>. Beyond the code, I'm deeply passionate about <strong>mentorship and education</strong>, helping aspiring developers navigate their careers with confidence.
          </p>
          
          <p>
            But my story isn't just about tech. I'm also a <strong>mother of five</strong> and a <strong>dedicated tennis mom</strong>, cheering on my kids from the sidelines as they compete and grow in the sport. Balancing the fast-paced world of software development with family life has been an incredible journey, and I firmly believe women don't have to choose between career success and personal fulfillment—we can have both, and I love helping others find that balance.
          </p>
          
          <p>
            When I'm not coding, consulting, or mentoring, you'll find me <strong>at the tennis courts supporting my kids, exploring new places, and embracing new challenges</strong>. I thrive on <strong>growth, resilience, and empowering others to achieve their dreams—because if I can do it, so can you.</strong> 🚀
          </p>
          
          <p>
            Let's build something amazing together! 💡🎾💻
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="service-card">
        <h3>Software Development</h3>
        <p>
          I design and build scalable, high-performance web applications with a focus on full-stack development to create efficient, maintainable, and future-proof solutions. 
          </p>
          <p>My expertise spans Angular (NgRx, RxJS, signals), TypeScript, JavaScript, React, Node.js, .NET Core, APIs, and Microservices, with deep knowledge of SQL, MongoDB, Firebase, and Azure. 
          </p>
          <p>I specialize in performance optimization through caching, lazy loading, and code splitting, while ensuring robust quality with Karma, Jest, Cypress, and Playwright.
          </p>
          <p> From responsive UIs to scalable back-end systems, I create seamless and engaging digital experiences. 🚀
        </p>
      
          
        </div>
        <div className="service-card">
        <h3>Consulting</h3>
          <p>
          I provide Corp-to-Corp (C2C) consulting focused on hands-on development, technical leadership, and architectural guidance to help businesses build scalable, high-performance applications. 
          </p>
          <p>My expertise includes mentoring development teams, designing custom software solutions, optimizing performance, conducting code reviews, and integrating third-party services or modernizing legacy systems. 
          </p>
          <p>Whether you need an architect, developer, or strategic advisor, I bring deep industry knowledge to drive innovation and business success.</p>
         
        </div>
        <div className="service-card">
        <h3>Technical Evangelizing</h3>
          <p>
          I am passionate about sharing knowledge, mentoring developers, and shaping the future of technology through public speaking, writing, and community engagement. 
          </p>  <p>Whether presenting at conferences, creating technical content, or guiding engineers in their careers, I strive to make complex topics accessible and actionable. 
          </p>  <p>My focus is on advocating best practices in Angular, Nx, and modern development, while actively contributing to developer communities and open-source projects.
          </p>  <p>I believe that knowledge drives innovation, and I love helping others stay ahead in the ever-evolving tech landscape.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills">
        <h2>What I Do</h2>
        <div className="skills-grid">
          {['Consulting', 'Speaking', 'Mentoring', 'Writing'].map((skill) => (
            <div key={skill} className="skill-item">
              <h3>{skill}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <h2>Let's Chat</h2>
        <p>Have a question or need help with your next project? 
        </p>  <p>Have a question about best career move for you? </p>  <p>Either way reach out...</p>
       
      </section>
    </Layout>
  )
} 

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export default IndexPage
