import react from 'react';
import ReactHlsPlayer from 'react-hls-player';

const Video = () => {

    return (
        <ReactHlsPlayer url="http://rtsp.n-person.com/main/index.m3u8" />
    );

}

export default Video;