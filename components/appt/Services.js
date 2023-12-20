import classes from '@/styles/ScheduleServices.module.css';
import AuthContext from '@/utils/AuthContext';
import { useContext, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';

const Services = ({ services, setActiveStep }) => {
  const { setApptInfo, apptInfo } = useContext(AuthContext);
  const [activeServices, setActiveServices] = useState(services.data);

  const setCategory = (e) => {
    if (e.target.value === 'all') {
      setActiveServices(services.data);
    } else {
      const filteredCategory = services.data.filter((service) => {
        return service.attributes.category === e.target.value;
      });
      setActiveServices(filteredCategory);
    }
  };
  const handleSelection = (e) => {
    setApptInfo({
      ...apptInfo,
      service: e.currentTarget.getAttribute('data-name'),
      price: e.currentTarget.getAttribute('data-price'),
    });
    setActiveStep(2);
  };
  return (
    <>
      <div className={classes['selection-container']}>
        <select
          id="servicesSelect"
          name="services"
          className={classes['services-select']}
          onChange={(e) => setCategory(e)}
        >
          <option value="all">All Services</option>
          <option value="cuts">Cuts</option>
          <option value="waxing">Waxing</option>
          <option value="coloring">Coloring</option>
          <option value="royal-treatments">Royal Treatments</option>
          <option value="facials">Facials</option>
        </select>
        <BsChevronDown className={classes.icon} />
      </div>
      <ul className={classes['services-container']}>
        {activeServices.map((service, index) => {
          const { name, price, duration, additionalDetails } =
            service.attributes;
          return (
            <li
              className={classes.service}
              data-name={name}
              data-price={price}
              onClick={handleSelection}
              key={index}
            >
              <p className={classes.heading}>
                {name} {additionalDetails !== null && `(${additionalDetails})`}
              </p>
              <div className={classes['info-container']}>
                <p className={classes['info-text']}>Price: ${price}</p>
                <p className={classes['info-text']}>Duration: {duration}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};
export default Services;
