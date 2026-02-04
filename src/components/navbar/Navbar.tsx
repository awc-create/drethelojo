'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.scss';
import { NAV_LINKS } from '@/config/menu.config';

function toHref(slug: string) {
  return slug ? `/${slug}` : '/';
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const isLinkActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href + '/'));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} onClick={closeMenu} aria-label="Home">
          <span className={styles.wordmark}>Dr Ethel Ojo</span>
          <span className={styles.submark}>Future Dermatologist</span>
        </Link>

        <div className={styles.desktopLinks} aria-label="Primary navigation">
          {NAV_LINKS.map(({ slug, label }) => {
            const href = toHref(slug);
            return (
              <Link
                key={slug || 'home'}
                href={href}
                onClick={closeMenu}
                className={`${styles.navLink} ${isLinkActive(href) ? styles.active : ''}`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className={styles.right}>
          <Link href="/cv" className={styles.cta} onClick={closeMenu}>
            Download CV
          </Link>

          <button
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <Icon icon={menuOpen ? 'mdi:close' : 'mdi:menu'} />
          </button>
        </div>
      </div>

      {/* Micro-detail line (appears on scroll) */}
      <div className={`${styles.microBar} ${scrolled ? styles.microBarOpen : ''}`}>
        <span>Dermatology · Research · AI · Education</span>
      </div>

      {/* Mobile menu + overlay */}
      <div className={`${styles.overlay} ${menuOpen ? styles.open : ''}`} onClick={closeMenu} />
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        <div className={styles.mobileHeader}>
          <span className={styles.mobileTitle}>Menu</span>
          <button className={styles.closeBtn} onClick={closeMenu} aria-label="Close menu">
            <Icon icon="mdi:close" />
          </button>
        </div>

        <div className={styles.mobileLinks}>
          {NAV_LINKS.map(({ slug, label }) => {
            const href = toHref(slug);
            return (
              <Link
                key={slug || 'home-mobile'}
                href={href}
                onClick={closeMenu}
                className={`${styles.mobileLink} ${isLinkActive(href) ? styles.activeMobile : ''}`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <Link href="/cv" className={styles.mobileCta} onClick={closeMenu}>
          Download CV
        </Link>
      </div>
    </nav>
  );
}
