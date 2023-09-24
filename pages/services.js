import classes from '../styles/Services.module.css';
import Image from 'next/image';
import HeroOne from '../public/images/services-hero-img-1920x1280.jpg';
import HeroTwo from '../public/images/services-hero-2.jpg';
import Service from '@/components/Service';
import Layout from '@/components/Layout';
import { BsChevronDown } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { API_URL } from '../config';

const ServicesPage = ({ services }) => {
  const [activeServices, setActiveServices] = useState(services.data);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1000);
  }, []);
  // const services = [
  //   {
  //     name: "Men's Haircut",
  //     additional: '',
  //     category: 'cuts',
  //     price: 35,
  //     duration: '30 min.',
  //   },
  //   ]

  const setCategory = (e) => {
    const filteredCategory = services.data.filter((service) => {
      return service.attributes.category === e.target.value;
    });
    setActiveServices(filteredCategory);
  };

  return (
    <Layout>
      <div className="first-bg">
        <div className={classes['services-hero-container']}>
          <Image
            src={HeroOne}
            fill
            alt="Services Image"
            className={classes['img-1']}
          />
          <div className={classes.overlay}></div>
          <h2 className={classes['hero-msg']}>Services</h2>
        </div>
        <div className={classes['content-container']}>
          <div className={classes['title-container']}>
            <div className={classes.line}></div>
            <div className={classes.title}>All Services</div>
            <div className={classes.line}></div>
          </div>
          <div className={classes['selection-container']}>
            <select
              id="servicesSelect"
              name="services"
              className={classes['services-select']}
              onChange={(e) => setCategory(e)}
            >
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
                <li className={classes.service} key={index}>
                  <Service
                    name={name}
                    price={price}
                    duration={duration}
                    additionalDetails={additionalDetails}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        {isDesktop ? (
          <div className={classes['services-hero-two-container']}>
            <div className={classes.overlay}></div>
          </div>
        ) : (
          <div className={classes['services-hero-two-img-container-mobile']}>
            <div className={classes.overlay}></div>

            <Image
              src={HeroTwo}
              fill
              alt="Services Image"
              className={classes['services-hero-img-two']}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};
export default ServicesPage;

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/services?$populate=*`);
  const services = await res.json();

  return {
    props: { services },
  };
}
