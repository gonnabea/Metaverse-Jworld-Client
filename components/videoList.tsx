import ScrollMenu from "./scrollMenu";
import Slider from "./Slider";

interface video {
    title: string;
    description: string;
    videoUrl: string;
}

interface props {
    videos: video[]
}

const VideoList = ({ videos }: props) => {
    console.log(videos)
    return <Slider title={"업로드한 비디오"}>  
    {videos ? videos.map((video, key) => {
        return (
            <div key={key}>
            <ScrollMenu 
                title={video.title} 
                videoUrl={video.videoUrl}  
                overview={video.description}    
            />
            </div>
        )
    }) : null}</Slider>
    


     
  
    
    


}

export default VideoList;