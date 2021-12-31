import { useState } from 'react';
import Link from 'next/link';
import styles from './navbar.module.css';
import Image from 'next/image';

export const Navbar: React.FC = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.logo}>
          <Link href="/">
            Escapism
          </Link>
        </h1>
        <button className={styles.menuBtn} onClick={() => setOpen(!isOpen)}>
          <Image src="/images/menu.svg" width="10" height="10" alt="menu" />
        </button>
        {isOpen && <div className={styles.mask} onClick={() => setOpen(false)}></div>}

        <div className={isOpen ? `${styles.menu} ${styles.isOpen}` : styles.menu}>
          <ul className={styles.lists}>
            <li className={styles.list}>
              <Link href="/blog/">Blog</Link>
            </li>
            <li className={styles.list}>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </div>
      </header>
      <div className={styles.empty}></div>
    </div>
  );
};