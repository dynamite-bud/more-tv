import { useEffect, useRef } from 'react';

const host = 'http://localhost:3001';

function App() {

  /**
   * Refs
   */
  ///
  const videoRef = useRef(null);
  const videoStreamRef = useRef(null);
  const workerRef = useRef();
  const canvasRef = useRef(null);
  ///

  /**
   * Handlers
   */
  ///
  const handleVideoMetadataLoaded = (e) => {
    

    if (videoRef.current && canvasRef.current) {

      const updatedHeight = videoRef.current.getBoundingClientRect().height.toFixed(2);
      
      canvasRef.current.style.height = `${updatedHeight}px`;

      if (workerRef.current) {
        
        workerRef.current.postMessage({
          action: 'videoMetadata',
          data: {
            videoHeight: videoRef.current.videoHeight,
            videoWidth: videoRef.current.videoWidth,
          }
        });

      }

    }

  }

  const handleVideoPlaying = async (e, streamRef) => {
    
    if (e.target && !videoStreamRef.current) {

      streamRef.current = e.target.captureStream();
      const videoTrack = streamRef.current.getVideoTracks()[0];
      videoTrack.applyConstraints({
        frameRate: {
          exact: 25,
        }
      });
      
      const trackProcessor = new window.MediaStreamTrackProcessor({
        track: videoTrack
      });
      //console.log(videoTrack)
      const readableStream = trackProcessor.readable;
      
      if (workerRef.current) {

        workerRef.current.postMessage({
          action: 'playing',
          data: readableStream
        }, [readableStream]);

      }

    } else {

      if (workerRef.current) {

        workerRef.current.postMessage({
          action: 'playing',
          data: null,
        });

      }

    }

  };

  const handleVideoWaiting = (e) => {

    if (workerRef.current) {

      workerRef.current.postMessage({
        action: 'waiting',
        data: null,
      });

    }

  };

  const handleVideoPause = (e) => {

    if (workerRef.current) {

      workerRef.current.postMessage({
        action: 'pause',
        data: null,
      });

    }

  };
  ///

  /**
   * Effects
   */
  ///
  useEffect(() => {

    console.log(navigator.mediaDevices.getSupportedConstraints().frameRate ? 'FrameRate constraints supported.' : 'FrameRate constraints NOT supported!');
    workerRef.current = new Worker('worker.js');

    if (canvasRef.current && workerRef.current) {

      const offscreenCanvas = canvasRef.current.transferControlToOffscreen();

      workerRef.current.postMessage({
        action: 'offscreenCanvas',
        data: offscreenCanvas,
      }, [offscreenCanvas]);

    }

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
        onLoadedMetadata={handleVideoMetadataLoaded}
        onPlaying={(e) => handleVideoPlaying(e, videoStreamRef)}
        onWaiting={handleVideoWaiting}
        onPause={handleVideoPause}
        ref={videoRef}>
        <source src={`${host}/videos/1`}></source>
      </video>
      <canvas className='canvas' 
        ref={canvasRef}>

      </canvas>
    </div>
  );

}

export default App;
