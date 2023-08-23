import classes from '../styles/ClientGallery.module.css'
import Image from 'next/image'
import ClientGalleryOne from '../../images/client-gallery-1.jpg'
import ClientGalleryTwo from '../../images/client-gallery-2.jpg'
import ClientGalleryThree from '../../images/client-gallery-3.jpg'

const ClientGallery = () => {
  const clientPhotos = [ClientGalleryOne, ClientGalleryTwo, ClientGalleryThree]
  return (
    <div className={classes.container}>
      <div className={classes['title-container']}>
        <div className={classes.line}></div>
        <div className={classes.title}>Client Gallery</div>
        <div className={classes.line}></div>
      </div>
      <div className={classes['imgs-container']}>
        {clientPhotos.map((photo) => {
          return (
            <div className={classes['img-container']}>
              <Image
                src={photo}
                width={180}
                height={250}
                alt='Client 1'
                className={classes.img}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default ClientGallery
