var express = require("express");
var router = express.Router();
const Place = require('../models/places');
const {checkBody} = require('../modules/checkBody')

router.post('/', (req, res) => {

  if(!checkBody(req.body,["nickname", "name", "latitude", "longitude"])){
    res.json({result: false, error: "Missing or empty fields"})
      return;
    }
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
   
  
    Place.find({ nickname:{ $regex: new RegExp(req.params.nickname, "i")} })
      .then(data => res.json({ result: true, places: data }))
      .catch(err => res.json({ result: false, error: err.message }));
  });

  router.delete('/', (req, res) => {
    if(!checkBody(req.body,["nickname", "name"])){
      res.json({result: false, error: "Missing or empty fields"})
      return;
    }
    const { nickname, name } = req.body;

    Place.deleteOne({ nickname, name })
      .then(deletedDoc => {
        if (deletedDoc.deletedCount > 0) {
          res.json({ result: true });
        } else {
          res.json({ result: false, error: "No place found to delete" });
        }
      })
      .catch(err => res.json({ result: false, error: err.message }));
  });
  
  module.exports = router;