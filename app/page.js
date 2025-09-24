import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Button from "../components/UI/Button/Button";
import Card, { CardBody } from "../components/UI/Card/Card";

export default function Home() {
  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Connecting <span className={styles.highlight}>Talent</span> with <span className={styles.highlight}>Opportunity</span>
            </h1>
            <p className={styles.heroSubtitle}>
              GCCCS CareerLink is your gateway to career success. Find jobs, build your portfolio, and connect with employers.
            </p>
            <div className={styles.heroCtas}>
              <Button href="/register" variant="primary" size="large">
                Get Started
              </Button>
              <Button href="/login" variant="secondary" size="large">
                Login
              </Button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <Image 
              src="/GCLOGO.png" 
              alt="Career opportunities" 
              width={400} 
              height={400} 
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What We Offer</h2>
          <div className={styles.featuresGrid}>
            <Card className={styles.featureCard}>
              <CardBody>
                <div className={styles.featureIcon}>
                  <Image src="/file.svg" alt="Find Jobs" width={40} height={40} />
                </div>
                <h3 className={styles.featureTitle}>Find Jobs</h3>
                <p className={styles.featureDescription}>
                  Access exclusive job opportunities posted by the Career Office specifically for GCCCS students and graduates.
                </p>
              </CardBody>
            </Card>

            <Card className={styles.featureCard}>
              <CardBody>
                <div className={styles.featureIcon}>
                  <Image src="/window.svg" alt="Upload Resume" width={40} height={40} />
                </div>
                <h3 className={styles.featureTitle}>Upload Resume</h3>
                <p className={styles.featureDescription}>
                  Create and manage your professional profile, upload your resume, and showcase your skills to potential employers.
                </p>
              </CardBody>
            </Card>

            <Card className={styles.featureCard}>
              <CardBody>
                <div className={styles.featureIcon}>
                  <Image src="/globe.svg" alt="Career Tips" width={40} height={40} />
                </div>
                <h3 className={styles.featureTitle}>Career Tips</h3>
                <p className={styles.featureDescription}>
                  Access valuable resources, tips, and advice to help you navigate your career path and professional development.
                </p>
              </CardBody>
            </Card>

            <Card className={styles.featureCard}>
              <CardBody>
                <div className={styles.featureIcon}>
                  <Image src="/file.svg" alt="Attend Events" width={40} height={40} />
                </div>
                <h3 className={styles.featureTitle}>Attend Events</h3>
                <p className={styles.featureDescription}>
                  Stay informed about upcoming career events, workshops, job fairs, and training opportunities.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* About/Mission Section */}
      <section className={styles.aboutSection}>
        <div className="container">
          <div className={styles.aboutContent}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p className={styles.aboutText}>
              The GCCCS Career Office is dedicated to empowering students and graduates with the resources, connections, and opportunities they need to succeed in their professional journeys. We bridge the gap between academic excellence and career achievement.
            </p>
            <p className={styles.aboutText}>
              Through CareerLink, we provide personalized career guidance, job placement assistance, and professional development resources tailored to the unique needs of our community.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Success Stories</h2>
          <div className={styles.testimonialsGrid}>
            <Card className={styles.testimonialCard}>
              <CardBody>
                <p className={styles.testimonialText}>
                  "CareerLink helped me land my dream job at a top tech company just two months after graduation. The career guidance and job listings were invaluable!"
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}></div>
                  <div>
                    <p className={styles.testimonialName}>Maria Santos</p>
                    <p className={styles.testimonialRole}>Software Developer, Class of 2023</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className={styles.testimonialCard}>
              <CardBody>
                <p className={styles.testimonialText}>
                  "The career events and workshops organized through CareerLink gave me the confidence and skills I needed to ace my interviews and start my career journey."
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}></div>
                  <div>
                    <p className={styles.testimonialName}>John Reyes</p>
                    <p className={styles.testimonialRole}>Network Engineer, Class of 2022</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className={styles.testimonialCard}>
              <CardBody>
                <p className={styles.testimonialText}>
                  "As a student, the OJT opportunities available through CareerLink gave me real-world experience that made all the difference when applying for full-time positions."
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}></div>
                  <div>
                    <p className={styles.testimonialName}>Ana Lim</p>
                    <p className={styles.testimonialRole}>Data Analyst, Current Student</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to take the next step in your career?</h2>
            <p className={styles.ctaText}>Join CareerLink today and connect with opportunities tailored for GCCCS students and graduates.</p>
            <Button href="/register" variant="primary" size="large">
              Register Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
