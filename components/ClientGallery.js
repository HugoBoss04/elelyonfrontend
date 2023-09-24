import classes from '../styles/ClientGallery.module.css';
import Image from 'next/image';
import ClientGalleryOne from '../public/images/client-gallery-1.jpg';
import ClientGalleryTwo from '../public/images/client-gallery-2.jpg';
import ClientGalleryThree from '../public/images/client-gallery-3.jpg';

const ClientGallery = ({ clientPictures }) => {
  const clientPhotos = [ClientGalleryOne, ClientGalleryTwo, ClientGalleryThree];

  return (
    <div className={classes.container}>
      <div className={classes['title-container']}>
        <div className={classes.line}></div>
        <div className={classes.title}>Client Gallery</div>
        <div className={classes.line}></div>
      </div>
      <div className={classes['imgs-container']}>
        {clientPictures.data[0].attributes.clientPictures.data.map(
          (photo, index) => {
            return (
              <div className={classes['img-container']} key={index}>
                <Image
                  src={photo.attributes.url}
                  fill
                  alt="Client 1"
                  className={classes.img}
                />
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};
export default ClientGallery;
