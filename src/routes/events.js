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

// Edit an event
router.put("/edit-event/:eventId", async (req, res) => {
    const { eventId } = req.params;
    const { startDate, endDate } = req.body;

    const event = await Events.findOne({ _id: eventId });
    if(!event)
    {
        return res.status(404).json({message: "Event does not exist!"});
    }
    else {
        const appendedEvent = await Events.updateOne({ _id: eventId }, {
            $set: {
                startDate: startDate,
                endDate: endDate,
            }
        });
        // Check if the event was successfully updated
        if(appendedEvent.acknowledged)
        {
            return res.status(200).json({message: "Event successfully updated"});
        }
        else {
            return res.status(400).json({message: "Event was not updated"});
        }
    }
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
    res.json(allEvents);
})

// Delete an event
router.delete("/delete-event/:eventId", async (req, res) => {
    const { eventId } = req.params;

    const event = await Events.findOne({ _id: eventId });
    console.log(event.eventName);
    if(!event)
    {
        return res.status(404).json({message: "Event does not exist!"});
    }
    else {
        const deleteEvent = await Events.deleteOne({ _id: eventId });
        res.json({
            message: deleteEvent
        })
    }
})

// Create an artist
router.post("/artist", async (req, res) => {
    const { artistName, src, href, artistId } = req.body;

    const newArtist = new Artists({
        artistName,
        src,
        href,
        artistId
    });
    newArtist.save().then(result => {
        res.json(
            {
                artistName: result.artistName,
                src: result.src,
                href: result.href,
                artistId: result.artistId
            }
        )
    })
    .catch(err => {
        return res.status(400).json({error: err});
    })
})

// Edit an artist
router.put("/edit-artist/:artistId", async (req, res) => {
    const { artistId } = req.params;
    const { artistName, src, href } = req.body;

    const artist = await Artists.findOne({ _id: artistId });
    if(!artist)
    {
        return res.status(404).json({message: "Artist does not exist!"});
    }
    else {
        const appendedArtist = await Artists.updateOne({ _id: artistId }, {
            $set: {
                artistName: artistName,
                src: src,
                href: href
            }
        });
        // Check if the artist was successfully updated
        if(appendedArtist.acknowledged)
        {
            return res.status(200).json({message: "Artist successfully updated"});
        }
        else {
            return res.status(400).json({message: "Artist was not updated"});
        }
    }
})

// Return all artists
router.get("/allartists", async (req, res) => {

    const allArtists = await Artists.find()
    .catch(err => {
        return res.status(404).json({error: err});
    })
    res.json(allArtists);
})

// Return all artists by event
router.get("/allartists/:eventId", async (req, res) => {
    const { eventId } = req.params;
    const event = await Events.findOne({ _id: eventId });
    console.log(event.eventName);
    if(!event)
    {
        return res.status(404).json({message: "Event does not exist!"});
    }
    else {
        return res.json({
            artists: event.artists
        });
    }
})

// Delete an artist
router.delete("/delete-artist/:artistId", async (req, res) => {
    console.log("hit endpoint");
    const { artistId } = req.params;
    const artist = await Artists.findOne({ _id: artistId });
    console.log(artist);
    if(!artist)
    {
        return res.status(404).json({message: "Artist does not exist!"});
    }
    else {
        const deleteArtist = await Artists.deleteOne({ _id: artistId });
        res.json({
            message: deleteArtist
        })
    }
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

// Edit an stage
router.put("/edit-stage/:stageId", async (req, res) => {
    const { stageId } = req.params;
    const { stageName } = req.body;

    const stage = await Stages.findOne({ _id: stageId });
    if(!stage)
    {
        return res.status(404).json({message: "Stage does not exist!"});
    }
    else {
        const appendedStage = await Stages.updateOne({ _id: stageId }, {
            $set: {
                stageName: stageName
            }
        });
        // Check if the stage was successfully updated
        if(appendedStage.acknowledged)
        {
            return res.status(200).json({message: "Stage successfully updated"});
        }
        else {
            return res.status(400).json({message: "Stage was not updated"});
        }
    }
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

// Delete a stage
router.delete("/delete-stage/:stageId", async (req, res) => {
    const { stageId } = req.params;

    const stage = await Stages.findOne({ _id: stageId });
    console.log(stage.stageName);
    if(!stage)
    {
        return res.status(404).json({message: "Stage does not exist!"});
    }
    else {
        const stageEvent = await Stages.deleteOne({ _id: stageId });
        res.json({
            message: stageEvent
        })
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

// Edit an performance
router.put("/edit-performance/:performanceId", async (req, res) => {
    const { performanceId } = req.params;
    const { startTime, endTime } = req.body;

    const performance = await Performances.findOne({ _id: performanceId });
    if(!performance)
    {
        return res.status(404).json({message: "Performance does not exist!"});
    }
    else {
        const appendedPerformance = await Performances.updateOne({ _id: performanceId }, {
            $set: {
                startTime: startTime,
                endTime: endTime,
            }
        });
        // Check if the performance was successfully updated
        if(appendedPerformance.acknowledged)
        {
            return res.status(200).json({message: "Performance successfully updated"});
        }
        else {
            return res.status(400).json({message: "Performance was not updated"});
        }
    }
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

// Delete a performance
router.delete("/delete-performance/:performanceId", async (req, res) => {
    const { performanceId } = req.params;
    const performance = await Performances.findOne({ _id: performanceId });
    if(!performance)
    {
        return res.status(404).json({message: "Performance does not exist!"});
    }
    else {
        const performanceEvent = await Performances.deleteOne({ _id: performanceId });
        res.json({
            message: performanceEvent
        })
    }
})

// Create a sponsor
router.post("/sponsor", async (req, res) => {
    const { category, name, src, href } = req.body;
    const newSponsor = new Sponsors({
        category,
        name,
        src,
        href
    });
    newSponsor.save().then(result => {
        res.json(
            {
                category: result.category,
                name: result.name,
                src: result.src,
                href: result.href,
            }
        )
    })
    .catch(err => {
        return res.status(400).json({error: err});
    })
})

// Edit an sponsor
router.put("/edit-sponsor/:sponsorId", async (req, res) => {
    const { sponsorId } = req.params;
    const { category, name, src, href } = req.body;

    const sponsor = await Sponsors.findOne({ _id: sponsorId });
    if(!sponsor)
    {
        return res.status(404).json({message: "Sponsor does not exist!"});
    }
    else {
        const appendedSponsor = await Sponsors.updateOne({ _id: sponsorId }, {
            $set: {
                category: category,
                name: name,
                src: src,
                href: href
            }
        });
        // Check if the sponsor was successfully updated
        if(appendedSponsor.acknowledged)
        {
            return res.status(200).json({message: "Sponsor successfully updated"});
        }
        else {
            return res.status(400).json({message: "Sponsor was not updated"});
        }
    }
})

// Return all sponsors
router.get("/allsponsors", async (req, res) => {

    const allSponsors = await Sponsors.find()
    .catch(err => {
        return res.status(404).json({error: err});
    })
    res.json(allSponsors);
})

// Delete a sponsor
router.delete("/delete-sponsor/:sponsorId", async (req, res) => {
    const { sponsorId } = req.params;

    const sponsor = await Sponsors.findOne({ _id: sponsorId });
    if(!sponsor)
    {
        return res.status(404).json({message: "Sponsor does not exist!"});
    }
    else {
        const sponsorEvent = await Sponsors.deleteOne({ _id: sponsorId });
        res.json({
            message: sponsorEvent
        })
    }
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

// Remove artist from performance
router.put("/remove-artist/:performanceId/:artistId", async (req, res) => {
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
        // Remove the artist from the specified performance
        const appendedPerformance = await Performances.updateOne({ _id: performanceId }, {
            $pull: {
                artist: artistId
            }
        });
        // Check if the artist was successfully removed
        if(appendedPerformance.acknowledged)
        {
            return res.status(200).json({message: "Artist successfully removed from performance"});
        }
        else {
            return res.status(400).json({message: "Artist not removed"});
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

// Remove stage from performance
router.put("/remove-stage/:performanceId/:stageId", async (req, res) => {
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
        // Remove the stage from the specified performance
        const appendedPerformance = await Performances.updateOne({ _id: performanceId }, {
            $pull: {
                stage: stageId
            }
        });
        // Check if the stage was successfully removed
        if(appendedPerformance.acknowledged)
        {
            return res.status(200).json({message: "Stage successfully removed from performance"});
        }
        else {
            return res.status(400).json({message: "Stage not removed"});
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

// Remove performance from event
router.put("/remove-performance/performance/:eventId/:performanceId", async (req, res) => {
    const { eventId, performanceId } = req.params;
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
        // Remove the performance from the specified event
        const appendedEvent = await Events.updateOne({ _id: eventId }, {
            $pull: {
                performances: {
                    _id: performanceId
                }
            }
        });
        // Check if the performance was successfully removed
        if(appendedEvent.acknowledged)
        {
            return res.status(200).json({message: "Performance successfully removed from Event"});
        }
        else {
            return res.status(400).json({message: "Performance not removed"});
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

// Remove artist from event
router.put("/remove-artist/artist/:eventId/:artistId", async (req, res) => {
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
        // Remove the artist from the specified event
        const appendedEvent = await Events.updateOne({ _id: eventId }, {
            $pull: {
                artists: {
                    _id: artistId
                }
            }
        });
        // Check if the artist was successfully removed
        if(appendedEvent.acknowledged)
        {
            return res.status(200).json({message: "Artist successfully removed from Event"});
        }
        else {
            return res.status(400).json({message: "Artist not removed"});
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

// Remove stage from event
router.put("/remove-stage/stage/:eventId/:stageId", async (req, res) => {
    const { eventId, stageId } = req.params;
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
        // Remove the stage from the specified event
        const appendedEvent = await Events.updateOne({ _id: eventId }, {
            $pull: {
                stages: {
                    _id: stageId
                }
            }
        });
        // Check if the stage was successfully removed
        if(appendedEvent.acknowledged)
        {
            return res.status(200).json({message: "Stage successfully removed from Event"});
        }
        else {
            return res.status(400).json({message: "Stage not removed"});
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

// Remove sponsor from event
router.put("/remove-sponsor/sponsor/:eventId/:sponsorId", async (req, res) => {
    const { eventId, sponsorId } = req.params;
    // Locate the event using eventId
    const event = await Events.findOne({ _id: eventId });
    console.log(event);
    if(!event)
    {
        return res.status(404).json({message: "Event does not exist!"});
    }
    else {
        // Locate the sponsor using sponsorId
        const sponsor = await Sponsors.findOne({ _id: sponsorId });
        if(!sponsor)
        {
            return res.status(404).json({message: "sponsor does not exist!"});
        }
        // Remove the sponsor from the specified event
        const appendedEvent = await Events.updateOne({ _id: eventId }, {
            $pull: {
                sponsors: {
                    _id: sponsorId
                }
            }
        });
        // Check if the sponsor was successfully removed
        if(appendedEvent.acknowledged)
        {
            return res.status(200).json({message: "Sponsor successfully removed from Event"});
        }
        else {
            return res.status(400).json({message: "Sponsor not removed"});
        }
    }
})


module.exports = router;