import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import classes from '../styles/Navbar.module.css';
import Link from 'next/link';
import Menu from './Menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();
  const { query } = router;

  console.log(query);

  const href = !query.scrollTo ? '/?scrollTo=contact' : '#contact';

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1000);
  }, []);
  return (
    <>
      <div className={classes.bg}>
        <div className={classes.container}>
          <Link href="/" className={classes.logo}>
            El Elyon
          </Link>
          {!isDesktop ? (
            <div
              className={`${classes['menu-icon']} ${isOpen && classes.open}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className={`${classes.line} ${classes.top}`}></div>
              <div className={`${classes.line} ${classes.middle}`}></div>
              <div className={`${classes.line} ${classes.bottom}`}></div>
            </div>
          ) : (
            <div className={classes['links-container']}>
              <Link href="/services" className={classes.link}>
                Services
              </Link>
              <Link href={href} className={classes.link}>
                Contact
              </Link>
              <Link href="/about" className={classes.link}>
                About
              </Link>
            </div>
          )}
        </div>
      </div>
      {!isDesktop && (
        <div
          className={`${classes['mobile-menu-wrapper']} ${
            isOpen && classes.open
          }`}
        >
          <Menu setIsOpen={setIsOpen} />
        </div>
      )}
    </>
  );
};
export default Navbar;
