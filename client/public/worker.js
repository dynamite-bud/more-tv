const decodeWorker = new Worker('decode-worker.js');

let paused = false,
    reader = undefined,
    offscreenCanvas = undefined,
    renderingContext = undefined,
    videoHeight = 0,
    videoWidth = 0;

let processingFrame = 0;
const frames = [];

decodeWorker.onmessage = (e) => {

    const { action, data } = e.data;

    switch (action) {

        case 'requestFrame': {

            const frameBuffer = frames[processingFrame].data.buffer;

            decodeWorker.postMessage({
                action: 'detectWatermark',
                data: {
                    frame: frameBuffer,
                    index: processingFrame,
                },
            }, [frameBuffer]);

            processingFrame++;

            break;
        }

        default: {
            break;
        }

    }

};

const readFrame = async (reader) => {

    const result = await reader.read();
    
    if (!result.done && result.value) {

        renderingContext.drawImage(result.value, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
        result.value.close();

        const imageData = renderingContext.getImageData(0, 0, videoWidth, videoHeight);
        
        frames.push(imageData);
        console.log(frames.length)
        
        if (frames.length === 1) {

            const frameBuffer = frames[processingFrame].data.buffer;

            decodeWorker.postMessage({
                action: 'detectWatermark',
                data: {
                    frame: frameBuffer,
                    index: processingFrame,
                },
            }, [frameBuffer]);

            processingFrame++;

        }

    }

    if (!result.done && !paused) {

        readFrame(reader);

    }
}

onmessage = async (e) => {
    
    const { action, data } = e.data;

    switch (action) {

        case 'playing': {

            paused = false;

            if (!reader && data) {

                reader = data.getReader();

            }
            
            let frames = 0;

            readFrame(reader);

            break;
        }

        case 'waiting':
        case 'pause': {

            paused = true;

            break;
        }

        case 'videoMetadata': {

            videoHeight = data.videoHeight;
            videoWidth = data.videoWidth;
            offscreenCanvas = new OffscreenCanvas(videoWidth, videoHeight);
            renderingContext = offscreenCanvas.getContext('2d');

            break;
        }

        case 'offscreenCanvas': {

            //offscreenCanvas = data;
            //renderingContext = offscreenCanvas.getContext('2d');

            break;
        }

        default: {
            break;
        }

    }

}