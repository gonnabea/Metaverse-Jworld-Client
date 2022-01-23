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
    return <Slider title={"업로드한 이미지"}>{
        images ? images.map((image, key) => {
            return (
                <div key={key}>
                <ScrollMenu 
                    title={image.title} 
                    imageUrl={image.imageUrl}  
                    overview={image.description}    
                />
                </div>
            )
        }) : null}</Slider>


     
  
    
    


}

export default ImageList;