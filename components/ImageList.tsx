import ScrollMenu from "./scrollMenu";
import Slider from "./Slider";

interface image {
    title: string;
    description: string;
    imageUrl: string;
}

interface props {
    images: image[]
}

const ImageList = ({ images }: props) => {
    console.log(images)
    return <Slider title={"이미지 리스트"} children={
        images ? images.map((image) => {
            return (
                <ScrollMenu 
                    title={image.title} 
                    imageUrl={image.imageUrl}  
                    overview={image.description}    
                />
            )
        }) : null}


     />
  
    
    


}

export default ImageList;