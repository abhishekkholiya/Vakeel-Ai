import { useState } from 'react';
import styles from '../styles/Enterprise.module.css';

export default function Enterprise() {
  const [metrics] = useState({
    sharedKnowledge: 98,
    timeSaved: 120,
    totalResearch: 100,
    totalDrafts: 12
  });

  const [members] = useState([
    { name: 'Harvey Specter', timeSpent: '20hrs spent', avatar: '/Hervey-Specter-Suit.jpg' },
    { name: 'Mike Ross', timeSpent: '10hrs spent', avatar: '/Mike-ross.jpg' },
    { name: 'Walter White', timeSpent: '15hrs spent', avatar: '/walter-white.png' },
    { name: 'Saul Goodman', timeSpent: '8hrs spent', avatar: '/saul-goodman.webp' }
    
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <img src="/profilepicture.png" alt="Profile" className={styles.profilePic} />
          <div className={styles.welcomeText}>
            <h1>Welcome, Abhishek</h1>
            <p>Pearson Specter&apos;s Dashboard</p>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.iconContainer}>
            <img src="/google-docs.png" alt="Documents" />
          </div>
          <div className={styles.metricContent}>
            <h3>Total shared knowledge</h3>
            <p><span className={styles.number}>{metrics.sharedKnowledge}</span> docs</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.iconContainer}>
            <img src="/time.png" alt="Time" />
          </div>
          <div className={styles.metricContent}>
            <h3>Time saved</h3>
            <p><span className={styles.number}>{metrics.timeSaved}</span> hrs</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.iconContainer}>
            <img src="/loupe.png" alt="Research" />
          </div>
          <div className={styles.metricContent}>
            <h3>Total research</h3>
            <p><span className={styles.number}>{metrics.totalResearch}</span> sessions</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.iconContainer}>
            <img src="/draft.png" alt="Drafts" />
          </div>
          <div className={styles.metricContent}>
            <h3>Total drafts</h3>
            <p><span className={styles.number}>{metrics.totalDrafts}</span> generated</p>
          </div>
        </div>
        </div>

        <div className={styles.membersSection}>
        <h2>View Members</h2>
        <div className={styles.membersList}>
          {members.map((member, index) => (
            <div key={index} className={styles.memberCard}>
              <img src={member.avatar} alt={member.name} className={styles.memberAvatar} />
              <div className={styles.memberInfo}>
                <h3>{member.name}</h3>
                <p>{member.timeSpent}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}