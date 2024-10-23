var express = require("express");
var router = express.Router();
const Place = require('../models/places');


router.post('/', (req, res) => {
    const { nickname, name, latitude, longitude } = req.body;
  
    
    Place.findOne({ nickname, name })
      .then(existingPlace => {
        if (existingPlace) {
          res.json({ result: false, error: 'City already exists' });
        } else {
          const newPlace = new Place({ nickname, name, latitude, longitude });
  
          newPlace.save()
            .then(() => res.json({ result: true }))
            .catch(err => res.json({ result: false, error: err.message }));
        }
      })
      .catch(err => res.json({ result: false, error: err.message }));
  });

  router.get('/:nickname', (req, res) => {
    const { nickname } = req.params;
  
    Place.find({ nickname })
      .then(places => res.json({ result: true, places }))
      .catch(err => res.json({ result: false, error: err.message }));
  });

  router.delete('/', (req, res) => {
    const { nickname, name } = req.body;
  
    Place.findOneAndDelete({ nickname, name })
      .then(() => res.json({ result: true }))
      .catch(err => res.json({ result: false, error: err.message }));
  });

  module.exports = router;