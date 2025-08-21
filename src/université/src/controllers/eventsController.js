class EventsController {
    constructor(eventModel) {
        this.eventModel = eventModel;
    }

    async getAllEvents(req, res) {
        try {
            const events = await this.eventModel.find({});
            res.render('events', { events });
        } catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async createEvent(req, res) {
        const { title, date, description } = req.body;
        const newEvent = new this.eventModel({ title, date, description });

        try {
            await newEvent.save();
            res.status(201).json({ message: 'Event created successfully', event: newEvent });
        } catch (error) {
            console.error('Error creating event:', error);
            res.status(400).json({ error: 'Error creating event' });
        }
    }
}

module.exports = EventsController;