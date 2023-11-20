import classes from '../styles/ClientGallery.module.css';
import Image from 'next/image';

const ClientGallery = ({ clientPictures }) => {
  console.log(clientPictures);

  return (
    <div className={classes.container}>
      <div className={classes['title-container']}>
        <div className={classes.line}></div>
        <div className={classes.title}>Client Gallery</div>
        <div className={classes.line}></div>
      </div>
      <div className={classes['imgs-container']}>
        {clientPictures.data.attributes.clientPictures.data.map(
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
