
let paused = false,
    reader = undefined,
    offscreenCanvas = undefined,
    renderingContext = undefined;

const readFrame = async (timeoutId, reader) => {

    const result = await reader.read();

    renderingContext.drawImage(result.value, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

    result.value.close();

    clearInterval(timeoutId);

    if (!result.done && !paused) {

        timeoutId = setTimeout(() => {

            readFrame(timeoutId, reader);

        }, 0);

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
            console.log(reader)
            let frames = 0;

            //while (true) {
            let timeoutId = setTimeout(() => {

                readFrame(timeoutId, reader);

            }, 0);
            //}

            break;
        }

        case 'waiting':
        case 'pause': {

            paused = true;

            break;
        }

        case 'offscreenCanvas': {

            offscreenCanvas = data;
            renderingContext = offscreenCanvas.getContext('2d');

            break;
        }

        default: {
            break;
        }

    }

}