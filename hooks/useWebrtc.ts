
const useWebRtc = () => {
    const getVideoFromCam = () => {
        try{
          const openMediaDevices = async (constraints) => {
            return await navigator.mediaDevices.getUserMedia(constraints);
          }
    
          const stream = openMediaDevices({'video': true, 'audio': true})
          console.log('미디어 스트림 수신 성공: ', stream);
        }
        catch(error) {
          console.error('미디어 장치 접근 오류: ', error)
        }
        
      }
}

export default useWebRtc;