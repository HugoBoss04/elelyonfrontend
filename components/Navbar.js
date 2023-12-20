import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import classes from '../styles/Navbar.module.css';
import Link from 'next/link';
import Menu from './Menu';
import AuthContext from '@/utils/AuthContext';

const Navbar = () => {
  const { user, adminUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();
  const { query } = router;

  const href = !query.scrollTo ? '/?scrollTo=contact' : '#contact';

  let destination;

  if (user.username !== '' && user.username !== 'admin') {
    destination = '/account/dashboard';
  } else if (adminUser.username !== '' && adminUser.username === 'admin') {
    destination = '/account/admin/dashboard';
  } else {
    destination = '/account/login';
  }

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
              <Link href={destination} className={classes.link}>
                {user.username !== ''
                  ? user.firstName
                  : adminUser.username !== ''
                  ? adminUser.username
                  : 'Login'}
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
