onmessage = async (e) => {

    const readableStream = e.data;
    const reader = readableStream.getReader();

    while (true) {

        const result = await reader.read();

        if (result.done) break;

        console.log(result.value);
        result.value.close();

    }

}