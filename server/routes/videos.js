const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const assetsDir = path.join(__dirname, '../assets');

const getVideoMetadata = (id) => {

  if (undefined !== id && null !== id) {

    const videoFilePath = path.join(assetsDir, `/${id}.mp4`);
    const stat = fs.statSync(videoFilePath);
    
    return {
      fileSize: stat.size,
      filePath: videoFilePath,
    };

  }

  return {
    fileSize: undefined,
    filePath: undefined,
  };

}

const getChunkProperties = (range, fileSize) => {

  const parts = range.replace(/bytes=/, '').split('-');

  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunkSize = end - start + 1;

  return {
    start, 
    end, 
    chunkSize
  }

}



/* GET specific video */
router.get('/:id', function(req, res, next) {

  const { id } = req.params;
  const { range } = req.headers;

  const { fileSize, filePath } = getVideoMetadata(id);

  if (!range) {

    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    });

    if (fileSize && filePath) {

      fs.createReadStream(filePath).pipe(res);

    } else {

      res.status(404).send();

    }

  } else {

    const { start, end, chunkSize } = getChunkProperties(range, fileSize);

    const readStream = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });

    readStream.pipe(res);

  }


});

module.exports = router;

