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

    if (e.target) {

      streamRef.current = e.target.captureStream();
      const videoTrack = streamRef.current.getVideoTracks()[0];
      const trackProcessor = new window.MediaStreamTrackProcessor({
        track: videoTrack
      });
      const readableStream = trackProcessor.readable;
      
      if (workerRef.current) {

        workerRef.current.postMessage(readableStream, [readableStream]);

      }

    }

  };
  ///

  /**
   * Effects
   */
  ///
  useEffect(() => {

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
        ref={videoRef}>
        <source src={`${host}/videos/1`}></source>
      </video>
    </div>
  );

}

export default App;
