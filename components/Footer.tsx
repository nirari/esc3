import styles from './footer.module.css';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.cr}>
        Author：
        <Link href="/about">Chidori Ninokura</Link>
      </p>
      <p className={styles.cr}>
        Except Where Otherwise Noted, Content on This Site is Licensed Under a <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
      </p>
    </footer>
  );
};