import { useContext } from 'react';
import classes from '@/styles/Barbers.module.css';
import AuthContext from '@/utils/AuthContext';

const Barbers = ({ barbers, setActiveStep }) => {
  const { setApptInfo, apptInfo } = useContext(AuthContext);

  const handleSelection = (e) => {
    setApptInfo({
      ...apptInfo,
      barber: e.currentTarget.getAttribute('data-name'),
    });
    setActiveStep(3);
  };

  return (
    <ul className={classes['barbers-container']}>
      {barbers.data.map((barber, index) => {
        const { name } = barber.attributes;
        return (
          <li
            className={classes.barber}
            onClick={handleSelection}
            data-name={name}
            key={index}
          >
            <p className={classes.text}>{name}</p>
          </li>
        );
      })}
    </ul>
  );
};
export default Barbers;
