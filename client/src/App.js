import { useEffect, useRef } from 'react';

const host = 'http://localhost:3001';

function App() {

  /**
   * Refs
   */
  ///
  const videoRef = useRef(null);
  const videoStreamRef = useRef();
  const workerRef = useRef();
  ///

  /**
   * Handlers
   */
  ///
  const handleVideoPlaying = async (e, streamRef) => {
    console.log('PLAYING')
    if (e.target) {

      streamRef.current = e.target.captureStream();
      const videoTrack = streamRef.current.getVideoTracks()[0];
      videoTrack.applyConstraints({
        frameRate: {
          exact: 25,
        }
      });
      console.log('FRAMERATE:', videoTrack.getSettings().frameRate)
      const trackProcessor = new window.MediaStreamTrackProcessor({
        track: videoTrack
      });
      //console.log(videoTrack)
      const readableStream = trackProcessor.readable;
      
      if (workerRef.current) {

        workerRef.current.postMessage({
          action: 'readStream',
          data: readableStream
        }, [readableStream]);

      }

    }

  };

  const handleVideoWaiting = (e) => {

  };

  const handleVideoPause = (e) => {

  };
  ///

  /**
   * Effects
   */
  ///
  useEffect(() => {

    console.log(navigator.mediaDevices.getSupportedConstraints().frameRate ? 'FrameRate constraints supported.' : 'FrameRate constraints NOT supported!');
    workerRef.current = new Worker('worker.js');

    return () => {

      if (workerRef.current) {

        workerRef.current.terminate();

      }

    };

  }, []);
  ///

  return (
    <div className='main'>
      <video crossOrigin='anonymous' 
        controls 
        className='video'
        onPlaying={(e) => handleVideoPlaying(e, videoStreamRef)}
        onWaiting={handleVideoWaiting}
        onPause={handleVideoPause}
        ref={videoRef}>
        <source src={`${host}/videos/1`}></source>
      </video>
    </div>
  );

}

export default App;
