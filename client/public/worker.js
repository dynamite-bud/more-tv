onmessage = async (e) => {
    console.log(e)
    const { action, data } = e.data;

    switch (action) {

        case 'readStream': {

            const reader = data.getReader();
            let frames = 0;

            while (true) {

                const result = await reader.read();

                if (result.done) break;

                console.log(frames++);
                result.value.close();

            }

            break;
        }

        case 'waiting':
        case 'pause': {

            break;
        }

        default: {
            break;
        }

    }
    const reader = readableStream.getReader();
    let frames = 0;
    while (true) {

        const result = await reader.read();

        if (result.done) break;

        //console.log(frames++);
        result.value.close();

    }

}