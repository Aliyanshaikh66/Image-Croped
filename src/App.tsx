import "./App.css"
import { useRef, useState } from 'react'
import Cropper from 'react-easy-crop'

const Home = () => {

  const [isCropping, setIsCropping] = useState(false)
  const [croppingImage, setCroppingImage] = useState<any>(null)
  const [croppedImage, setCroppedImage] = useState<any>(null)
  const [userImage, setUserImage] = useState<any>(null)

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const fileRef: any = useRef()

  const onCropComplete = async (croppedArea: any, croppedAreaPixels: any) => {
    console.log("croppedArea", croppedArea)
    try {
      const croppedImageBlob = await getCroppedImg(userImage, croppedAreaPixels);
      setCroppedImage(URL.createObjectURL(croppedImageBlob as Blob));
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const getCroppedImg = async (image: any, croppedAreaPixels: any) => {
    const canvas = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');

    const imageBitmap = await createImageBitmap(image);
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      imageBitmap,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob); // this is the cropped image
        } else {
          reject(new Error('Error creating cropped image blob'));
        }
      }, 'image/jpeg'); // You can change the format if needed
    });
  };

  const cropImage = (e: any) => {
    if (e.target.files[0]) {
      setIsCropping(true)
      setUserImage(e.target.files[0])
      setCroppingImage(URL.createObjectURL(e.target.files[0]))
    } else {
      setIsCropping(false)
    }
  }

  const handleSelect = () => {
    setIsCropping(false); // Close the cropping view
  };

  return (
    <>
      {
        isCropping ?
          <div className="mainCropper">
            <div className="cropCont">
              <div className='cropperCont'>
                <Cropper
                  image={croppingImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={3 / 2}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className='cropControls'>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e: any) => {
                    setZoom(parseFloat(e.target.value))
                  }}
                  className="zoom-range"
                />
                <button className='cropBtn' onClick={handleSelect}>Select</button>
              </div>
            </div>
          </div>
          : (
            <>
              <input type="file" accept='image/*' ref={fileRef} id='file' onChange={(e) => cropImage(e)} />
              {croppedImage && <img src={croppedImage} alt="Cropped" />}
            </>
          )
      }
    </>
  )
}

export default Home;
