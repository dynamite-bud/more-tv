const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const assetsDir = path.join(__dirname, '../assets');

const getVideoMetadata = (id) => {

  if (undefined !== id && null !== id) {

    const videoFilePath = path.join(assetsDir, id);

  } 

}



/* GET specific video */
router.get('/:id', function(req, res, next) {

  const { id } = req.params;



});

module.exports = router;

