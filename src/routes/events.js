const express = require("express");
const router = express.Router();
require("dotenv").config();
const Events = require("../models/event");
const Artists = require("../models/artist");
const Stages = require("../models/stage");
const Performances = require("../models/performance");
const Sponsors = require("../models/sponsor");

// Create an event
router.post("/event", (req, res) => {

    const { startDate, endDate, eventName, eventId, stages, artists, performances } = req.body;

    const newEvent = new Events({
        startDate,
        endDate,
        eventName,
        eventId,
        stages,
        artists,
        performances
    });
    newEvent.save().then(result => {
        res.json(
            {
                startDate: result.startDate,
                endDate: result.endDate,
                eventName: result.eventName,
                eventId: result.eventId,
                stages: result.stages,
                artists: result.artists,
                performances: result.performances
            }
        )
    })
    .catch(err => {
        return res.status(400).json({error: err});
    })
})

// Return an event using eventId
router.get("/event/:eventId", async (req, res) => {
    const { eventId } = req.params;

    const event = await Events.findOne({ _id: eventId });
    console.log(event.eventName);
    if(!event)
    {
        return res.status(404).json({message: "Event does not exist!"});
    }
    else {
        return res.json({
            startDate: event.startDate,
            endDate: event.endDate,
            eventName: event.eventName,
            eventId: event.eventId,
            stages: event.stages,
            artists: event.artists,
            performances: event.performances,
            sponsors: event.sponsors
        });
    }
})

// Return all events
router.get("/allevents", async (req, res) => {

    const allEvents = await Events.find()
    .catch(err => {
        return res.status(404).json({error: err});
    })
    res.json({
        eventName: allEvents.eventName,
        eventId: allEvents.eventId,
        startDate: allEvents.startDate,
        endDate: allEvents.endDate
    });
})

// Create an artist
router.post("/artist", async (req, res) => {
    const { artistName, artistId } = req.body;

    const newArtist = new Artists({
        artistName,
        artistId
    });
    newArtist.save().then(result => {
        res.json(
            {
                artistName: result.artistName,
                artistId: result.artistId
            }
        )
    })
    .catch(err => {
        return res.status(400).json({error: err});
    })
})

// Return all artists
router.get("/allartists", async (req, res) => {

    const allArtists = await Artists.find()
    .catch(err => {
        return res.status(404).json({error: err});
    })
    res.json(allArtists);
})

// Create a stage
router.post("/stage", async (req, res) => {
    const { stageName, stageId } = req.body;
    const newStage = new Stages({
        stageName,
        stageId
    });
    newStage.save().then(result => {
        res.json(
            {
                stageName: result.stageName,
                stageId: result.stageId
            }
        )
    })
    .catch(err => {
        return res.status(400).json({error: err});
    })
})

// Return all stages by event
router.get("/allstages/:eventId", async (req, res) => {
    const { eventId } = req.params;
    const event = await Events.findOne({ _id: eventId });
    if(!event)
    {
        return res.status(404).json({message: "Event does not exist!"});
    }
    else {
        return res.json({
            startDate: event.startDate,
            endDate: event.endDate,
            eventName: event.eventName,
            stages: event.stages
        });
    }
})

// Create a performance
router.post("/performance", async (req, res) => {
    const { stage, artist, startTime, endTime } = req.body;
    const newPerformance = new Performances({
        stage,
        artist,
        startTime,
        endTime
    });
    newPerformance.save().then(result => {
        res.json(
            {
                stage: result.stage,
                artist: result.artist,
                startTime: result.startTime,
                endTime: result.endTime
            }
        )
    })
    .catch(err => {
        return res.status(400).json({error: err});
    })
})

// Return all performances by event
router.get("/allperformances/:eventId", async (req, res) => {
    const { eventId } = req.params;
    const event = await Events.findOne({ _id: eventId });
    if(!event)
    {
        return res.status(404).json({message: "Event does not exist!"});
    }
    else {
        return res.json({
            startDate: event.startDate,
            endDate: event.endDate,
            eventName: event.eventName,
            performances: event.performances
        });
    }
})

// Create a sponsor
router.post("/sponsor", async (req, res) => {
    const { category, sponsors } = req.body;
    const newSponsor = new Sponsors({
        category,
        sponsors
    });
    newSponsor.save().then(result => {
        res.json(
            {
                category: result.category,
                sponsors: result.sponsors
            }
        )
    })
    .catch(err => {
        return res.status(400).json({error: err});
    })
})

// Return all sponsors
router.get("/allsponsors", async (req, res) => {

    const allSponsors = await Sponsors.find()
    .catch(err => {
        return res.status(404).json({error: err});
    })
    res.json(allSponsors);
})

// Assign artist to performance
router.put("/performance/artist/:performanceId/:artistId", async (req, res) => {
    const { performanceId, artistId } = req.params;
    // Locate the performance using performanceId
    const performance = await Performances.findOne({ _id: performanceId });
    console.log(performance);
    if(!performance)
    {
        return res.status(404).json({message: "Performance does not exist!"});
    }
    else {
        // Locate the artist using artistId
        const artist = await Artists.findOne({ _id: artistId });
        console.log(artist);
        if(!artist)
        {
            return res.status(404).json({message: "Artist does not exist!"});
        }
        // Add the artistId to the specified performance
        const appendedPerformance = await Performances.updateOne({ _id: performanceId }, {
            $push: {
                artist: artistId
            }
        });
        // Check if the artist was successfully added
        if(appendedPerformance.acknowledged)
        {
            return res.status(200).json({message: "Artist successfully added"});
        }
        else {
            return res.status(400).json({message: "Artist not added"});
        }
    }
})

// Assign stage to performance
router.put("/performance/stage/:performanceId/:stageId", async (req, res) => {
    const { performanceId, stageId } = req.params;
    // Locate the performance using performanceId
    const performance = await Performances.findOne({ _id: performanceId });
    console.log(performance);
    if(!performance)
    {
        return res.status(404).json({message: "Performance does not exist!"});
    }
    else {
        // Locate the stage using stageId
        const stage = await Stages.findOne({ _id: stageId });
        console.log(stage);
        if(!stage)
        {
            return res.status(404).json({message: "Stage does not exist!"});
        }
        // Add the stageId to the specified performance
        const appendedPerformance = await Performances.updateOne({ _id: performanceId }, {
            $push: {
                stage: stageId
            }
        });
        // Check if the stage was successfully added
        if(appendedPerformance.acknowledged)
        {
            return res.status(200).json({message: "Stage successfully added"});
        }
        else {
            return res.status(400).json({message: "Stage not added"});
        }
    }
})

// Add performance to event
router.put("/event/performance/:eventId/:performanceId", async (req, res) => {
    const { performanceId, eventId } = req.params;
    
    // Locate the event using eventId
    const event = await Events.findOne({ _id: eventId });
    console.log(event);
    if(!event)
    {
        return res.status(404).json({message: "Event does not exist!"});
    }
    else {
        // Locate the performance using performanceId
        const performance = await Performances.findOne({ _id: performanceId });
        if(!performance)
        {
            return res.status(404).json({message: "Performance does not exist!"});
        }
        console.log(performance);
        // Add the performance array to the specified event
        const appendedEvent = await Events.updateOne({ _id: eventId }, {
            $push: {
                performances: performance
            }
        });
        // Check if the performance was successfully added
        if(appendedEvent.acknowledged)
        {
            return res.status(200).json({message: "Performance successfully added"});
        }
        else {
            return res.status(400).json({message: "Performance not added"});
        }
    }
})

// Add an artist to an event
router.put("/event/artist/:eventId/:artistId", async (req, res) => {
    const { eventId, artistId } = req.params;

    // Locate the event using eventId
    const event = await Events.findOne({ _id: eventId });
    console.log(event);
    if(!event)
    {
        return res.status(404).json({message: "Event does not exist!"});
    }
    else {
        // Locate the artist using artistId
        const artist = await Artists.findOne({ _id: artistId });
        if(!artist)
        {
            return res.status(404).json({message: "Artist does not exist!"});
        }
        console.log(artist);
        // Add the artist array to the specified event
        const appendedEvent = await Events.updateOne({ _id: eventId }, {
            $push: {
                artists: artist
            }
        });
        // Check if the artist was successfully added
        if(appendedEvent.acknowledged)
        {
            return res.status(200).json({message: "Artist successfully added"});
        }
        else {
            return res.status(400).json({message: "Artist not added"});
        }
    }
})

// Add a stage to an event
router.put("/event/stage/:eventId/:stageId", async (req, res) => {
    const { eventId, stageId } = req.params;
    console.log(stageId);
    // Locate the event using eventId
    const event = await Events.findOne({ _id: eventId });
    console.log(event);
    if(!event)
    {
        return res.status(404).json({message: "Event does not exist!"});
    }
    else {
        // Locate the stage using stageId
        const stage = await Stages.findOne({ _id: stageId });
        if(!stage)
        {
            return res.status(404).json({message: "Stage does not exist!"});
        }
        console.log(stage);
        // Add the stage array to the specified event
        const appendedEvent = await Events.updateOne({ _id: eventId }, {
            $push: {
                stages: stage
            }
        });
        // Check if the stage was successfully added
        if(appendedEvent.acknowledged)
        {
            return res.status(200).json({message: "Stage successfully added"});
        }
        else {
            return res.status(400).json({message: "Stage not added"});
        }
    }
})

// Add a sponsor to an event
router.put("/event/sponsor/:eventId/:sponsorId", async (req, res) => {
    const { eventId, sponsorId } = req.params;
    console.log(sponsorId);
    // Locate the event using eventId
    const event = await Events.findOne({ _id: eventId });
    console.log(event);
    if(!event)
    {
        return res.status(404).json({message: "Event does not exist!"});
    }
    else {
        // Locate the stage using stageId
        const sponsor = await Sponsors.findOne({ _id: sponsorId });
        if(!sponsor)
        {
            return res.status(404).json({message: "Sponsor does not exist!"});
        }
        console.log(sponsor);
        // Add the sponsor array to the specified event
        const appendedEvent = await Events.updateOne({ _id: eventId }, {
            $push: {
                sponsors: sponsor
            }
        });
        // Check if the sponsor was successfully added
        if(appendedEvent.acknowledged)
        {
            return res.status(200).json({message: "Sponsor successfully added"});
        }
        else {
            return res.status(400).json({message: "Sponsor not added"});
        }
    }
})

module.exports = router;