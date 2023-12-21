const Express = require('express');
const CORS = require('cors');
const UserModel = require('./models/UserSchema');
const ExerciseModel = require('./models/ExerciseSchema');
const LogModel = require('./models/LogSchema');
require('dotenv').config()
require('./config/db.config').connectDB();

const App = Express();

App.use(CORS());
App.use(Express.urlencoded(
    {
        extended: false
    }
));
App.use(Express.json());
App.use(Express.static('public'));

App.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

// saving a user in the database
App.post('/api/users', async (req, res) => {
    const user_obj = new UserModel({
        username: req.body.username
    });

    try {
        const new_user = await user_obj.save();
        res.json(new_user);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// get all users
App.get('/api/users', async (req, res) => {
    try {
        const all_users = await UserModel.find();
        res.json(all_users);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// save exercises for the specified user
App.post('/api/users/:_id/exercises', async (req, res) => {
    const user_id = req.params._id;

    try {
        const user = await UserModel.findById(user_id);
        if (!user) {
            res.status(404).send('User Not Found!');
            return;
        }

        let date_input;

        if (req.body.date === "") { 
            date_input = new Date(Date.now());
        }
        else { 
            date_input = new Date(req.body.date);
        }

        const exercise_obj = new ExerciseModel({
            user_id: user._id,
            username: user.username,
            description: req.body.description,
            duration: req.body.duration,
            date: date_input
        });

        const new_exercise = await exercise_obj.save();

        const log = await LogModel.findById(new_exercise.user_id);

        if (!log) {
            let old_count = 0;

            const log_obj = new LogModel({
                _id: new_exercise.user_id,
                username: new_exercise.username,
                count: ++old_count,
                log: [{
                    description: new_exercise.description,
                    duration: new_exercise.duration,
                    date: new_exercise.date
                }]
            });

            await log_obj.save();
        }
        else {
            const docs = await ExerciseModel.find({ user_id: new_exercise.user_id });

            const log_arr = docs.map((exerciseObj) => {
                return {
                    description: exerciseObj.description,
                    duration: exerciseObj.duration,
                    date: exerciseObj.date
                }
            });

            const new_count = log_arr.length;

            await LogModel.findByIdAndUpdate(new_exercise.user_id, {
                count: new_count,
                log: log_arr
            });
        }

        res.json({
            _id: new_exercise.user_id,
            username: new_exercise.username,
            description: new_exercise.description,
            duration: new_exercise.duration,
            date: new Date(new_exercise.date).toDateString()
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// access all logs of any user
App.get('/api/users/:_id/logs', async (req, res) => {
    try {
        const user_log = await LogModel.findById(req.params._id);

        if (!user_log) {
            res.status(404).send('User Log Not Found!');
            return;
        }

        let log_obj = user_log.log.map((obj) => {
            return {
                description: obj.description,
                duration: obj.duration,
                date: new Date(obj.date).toDateString()
            }
        });

        // Apply from, to and limit parameters
        if (req.query.from || req.query.to) {
            let fromDate = req.query.from ? new Date(req.query.from) : new Date(0);
            let toDate = req.query.to ? new Date(req.query.to) : new Date();

            log_obj = log_obj.filter((session) => {
                let sessionDate = new Date(session.date);
                return sessionDate >= fromDate && sessionDate <= toDate;
            });
        }

        if (req.query.limit) {
            log_obj = log_obj.slice(0, req.query.limit);
        }

        res.json({
            _id: user_log._id,
            username: user_log.username,
            count: user_log.count,
            log: log_obj
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

const CONN_PORT = process.env.PORT || 3358;
App.listen(CONN_PORT,
    () => console.log(`Your App is Listening at http://localhost:${CONN_PORT}`)
);
