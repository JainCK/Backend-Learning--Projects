const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const { Schema } = mongoose;
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    exercises: [{
        description: String,
        duration: Number,
        date: Date
    }]
}, { versionKey: false });

const User = mongoose.model('User', userSchema);
const ERROR = { error: "There was an error while getting the users." };

app.get('/api/users', (req, res) => {
    User.find({})
        .then(data => {
            const users = data.map(user => ({ username: user.username, _id: user._id }));
            res.json(users);
        })
        .catch(err => res.send(ERROR));
});

app.get('/api/users/:id/logs', async (req, res) => {
  try {
      const id = req.params.id;
      const dateFrom = new Date(req.query.from);
      const dateTo = new Date(req.query.to);
      const limit = parseInt(req.query.limit);

      const user = await User.findOne({ _id: new ObjectId(id) });

      if (!user) {
          return res.json({ error: 'User not found.' });
      }

      let log = user.exercises.filter(exercise =>
          new Date(exercise.date).getTime() >= dateFrom.getTime() &&
          new Date(exercise.date).getTime() <= dateTo.getTime()
      );

      log = log.map(exercise => ({
          description: exercise.description,
          duration: exercise.duration,
          date: new Date(exercise.date).toDateString()
      }));

      if (limit) {
          log = log.slice(0, limit);
      }

      const logCount = log.length;

      res.json({
          _id: user._id,
          username: user.username,
          count: logCount,
          log: logCount > 0 ? log : undefined
      });
  } catch (err) {
      console.error(err);
      res.status(500).json(ERROR);
  }
});


app.post('/api/users', async (req, res) => {
    const username = req.body.username;

    try {
        const data = await User.create({ username: username });
        res.json({ _id: data._id, username: data.username });
    } catch (err) {
        console.error(err);
        res.status(500).json(ERROR);
    }
});

app.post('/api/users/:id/exercises', async (req, res) => {
    const id = req.params.id;
    const { description, duration, date } = req.body;

    const newExercise = {
        description: description,
        duration: parseInt(duration),
        date: date ? new Date(date).toDateString() : new Date().toDateString()
    };

    try {
        const data = await User.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $push: { exercises: newExercise } },
            { new: true }
        );

        const response = {
            username: data.username,
            description: newExercise.description,
            duration: newExercise.duration,
            date: newExercise.date,
            _id: data._id
        };

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json(ERROR);
    }
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});
