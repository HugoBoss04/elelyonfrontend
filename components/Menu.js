import Link from 'next/link';
import classes from '../styles/Menu.module.css';
import { BsChevronRight } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import AuthContext from '@/utils/AuthContext';

const Menu = () => {
  const { user, adminUser } = useContext(AuthContext);
  const router = useRouter();
  const { query } = router;

  const href = !query.scrollTo ? '/?scrollTo=contact' : '#contact';

  const handleNavigation = (path, isContact) => {
    const href = !query.scrollTo ? '/?scrollTo=contact' : '/#contact';
    if (!isContact) {
      router.push(path);
    } else {
      router.push(href);
    }
  };

  let destination;
  if (user.username !== '' && user.username !== 'admin') {
    destination = '/account/dashboard';
  } else if (adminUser.username !== '' && adminUser.username === 'admin') {
    destination = '/account/admin/dashboard';
  } else {
    destination = '/account/login';
  }

  return (
    <div className={classes.bg}>
      <div className={classes.container}>
        <div
          className={classes['option-container']}
          onClick={() => router.push('/')}
        >
          <Link href="/" className={classes.value}>
            Home
          </Link>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
        <div
          className={classes['option-container']}
          onClick={() => handleNavigation('/services', false)}
        >
          <Link href="/services" className={classes.value}>
            Services
          </Link>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
        <div
          className={classes['option-container']}
          onClick={() => handleNavigation('/about', false)}
        >
          <Link href="/about" className={classes.value}>
            About
          </Link>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
        <div
          className={classes['option-container']}
          onClick={() => handleNavigation('', true)}
        >
          <Link href={href} className={classes.value}>
            Contact
          </Link>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
        <div
          className={classes['option-container']}
          onClick={() => handleNavigation('/account/login', false)}
        >
          <Link href={destination} className={classes.value}>
            {user.username !== ''
              ? user.firstName
              : adminUser.username !== ''
              ? adminUser.username
              : 'Login'}
          </Link>
          <BsChevronRight size={18} className={classes.icon} />
        </div>
      </div>
    </div>
  );
};
export default Menu;
