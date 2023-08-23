import classes from '../styles/Services.module.css'
import Image from 'next/image'
import HeroOne from '../../images/services-hero.jpg'
import Service from '@/components/Service'
import Layout from '@/components/Layout'
import { BsChevronDown } from 'react-icons/bs'
import { useState } from 'react'

const ServicesPage = () => {
  const [activeServices, setActiveServices] = useState('cuts')
  const services = [
    {
      name: "Men's Haircut",
      additional: '',
      category: 'cuts',
      price: 35,
      duration: '30 min.',
    },
    {
      name: 'Haircut & Beard',
      additional: '',
      category: 'cuts',
      price: 65,
      duration: '1 hr.',
    },
    {
      name: "Boy's Haircut",
      additional: '10 & under',
      category: 'cuts',
      price: 25,
      duration: '30 min.',
    },
    {
      name: 'Elite Treatment',
      additional: '',
      category: 'royal-treatments',
      price: 49,
      duration: '1 hr.',
    },
    {
      name: 'Royal Treatment',
      additional: '',
      category: 'royal-treatments',
      price: 49,
      duration: '1 min.',
    },
  ]

  return (
    <Layout>
      <div className='first-bg'>
        <div className={classes['services-hero-container']}>
          <Image
            src={HeroOne}
            fill
            alt='Services Image'
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
              id='servicesSelect'
              name='services'
              className={classes['services-select']}
              onChange={(e) => setActiveServices(e.target.value)}
            >
              <option value='cuts'>Cuts</option>
              <option value='waxing'>Waxing</option>
              <option value='coloring'>Coloring</option>
              <option value='royal-treatments'>Royal Treatments</option>
              <option value='facials'>Facials</option>
            </select>
            <BsChevronDown className={classes.icon} />
          </div>
          <ul className={classes['services-container']}>
            {services
              .filter((service) => service.category === activeServices)
              .map((service, index) => {
                const { name, price, duration, additional } = service
                return (
                  <li className={classes.service} key={index}>
                    <Service
                      name={name}
                      price={price}
                      duration={duration}
                      additional={additional}
                    />
                  </li>
                )
              })}
          </ul>
        </div>
        <div className={classes['services-hero-two-container']}>
          <div className={classes.overlay}></div>
        </div>
      </div>
    </Layout>
  )
}
export default ServicesPage
