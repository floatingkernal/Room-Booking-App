const express = require('express');
const app = express();
const mongoose = require('mongoose');
const validator = require('validator');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const crypto = require('crypto');
// const path = require('path');
const cookie = require('cookie');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');

const server = 'localhost:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'Nappers';
const url = 'mongodb://User:password123@ds163683.mlab.com:63683/heroku_flzwvs1f'; // make sure to create Roomers db on your local first
const sessionStore = new MongoStore({
        mongooseConnection: mongoose.connection,
        touchAfter: 24 * 3600 // time period in seconds
});

let ObjectId = require('mongodb').ObjectID;
let User = require('./models/user');
let Booking = require('./models/bookings')
let Room = require('./models/rooms');
const Grid = require('gridfs-stream');
let gfs;

mongoose.connect(process.env.MONGODB_URI || url, {useNewUrlParser: true}, function (err, db) {
    if(!err) {
        console.log("Database is connected to ", url);

    } else console.log("Database not connected")
});

const conn = mongoose.createConnection(url, { useNewUrlParser: true });
conn.on('open', function() {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('pictures');
})

const multer  = require('multer');
const storage = require('multer-gridfs-storage')({
    url: url,
    file: (req, file) => {
        return {
            bucketName: 'pictures',
            aliases: [req.session.user_id],
            filename: 'file_' + file.originalname + Date.now()
        };
    }
 });
const upload = multer({ storage: storage });



app.use(session({
    secret: 'ZcxanOpTY1HGIPnUMokZLJSBzcyagSyS',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 60 * 24 * 7 },
    sameSite: true,
    store: sessionStore
}));


function generateSalt (){
    return crypto.randomBytes(16).toString('base64');
}

function generateHash (password, salt){
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
}

let checkFirstName = function(req, res, next) {
    if (!validator.isAlphanumeric(req.body.firstname)) return res.status(400).end("bad input for firstname");
    next();
};

let checkLastName = function(req, res, next) {
    if (!validator.isAlphanumeric(req.body.lastname)) return res.status(400).end("bad input for lastname");
    next();
}; 

let checkEmail = function(req, res, next) {
    if (!validator.isEmail(req.body.email)) return res.status(400).end("bad input for email");
    next();
};

let checkPassword = function(req, res, next) {
    if (!validator.isAlphanumeric(req.body.password)) return res.status(400).end("bad input for password");
    if (req.body.password.length < 8) return res.status(400).end("Password too short");
    next();
};

let sanitizeDate = function(req, res, next) {
    if (req.body.birthday)
        req.body.birthday = validator.toDate(req.body.birthday);
    next();
};

let isAuthenticated = function(req, res, next) {
    if (!req.session.user_id) return res.status(401).end("access denied");
    sessionStore.get(req.sessionID, function(err, session) {
        if (err) return res.status(500).end(err);
        if (!session) return res.status(401).end("access denied");
    });
    next();
};

let checkLocation = function(req, res, next) {
    if (req.location)
        if (!validator.isAlphanumeric(req.body.location)) return res.status(400).end("bad input");
    next();
};

let sanitizeContent = function(content) {
    return validator.escape(content);
};

let checkHours = function(req, res, next) {
    let hours = JSON.parse(req.body.hours);
    if (!validator.isNumeric(hours.start)) return res.status(400).end("bad input, exected a number for hour start");
    if (!validator.isNumeric(hours.end)) return res.status(400).end("bad input, exected a number for hour end");
    next();
}

let checkDays = function(content_str) {
    let content = content_str.split(",");
    let valid = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    let result = []
    content.forEach(function(element){
        if (valid.includes(element.toLowerCase())) {
            if (!result.includes(element.toLowerCase())) {
                result.push(element.toLowerCase());
            }
        } else {
            // Invalid entry in the array
            return [];
        }
    });

    return result;
}

function search(keyName, searchArray){
    let result = []
    for (let i=0; i < searchArray.length; i++) {
        if (searchArray[i].days.includes(keyName)) {
            result.push(searchArray[i]);
        }
    }
    return result;
}

function checkArrayTime(time, searchArray){
    let startBooking = parseInt(time.start);
    let endBooking = parseInt(time.end);

    for (let i=0; i < searchArray.length; i++) {
        let start = parseInt(searchArray[i].time.start);
        let end = parseInt(searchArray[i].time.end);
        // If the time to book is within a booked time
        if ((startBooking >= start && startBooking < end) || (endBooking > start && endBooking < end)){
            return end;
        }
    }
    return false;
}

function invalidPurposes(purposes_str){
    let purposes = purposes_str;
    if (typeof purposes_str === 'string'){
        purposes = purposes_str.split(",");
    }
    let valid = ["social", "business", "personal"];

    for (let i=0; i < purposes.length; i++) {
        let purpose = purposes[i].toLowerCase();

        if (!valid.includes(purpose)){
            return [];
        }
    }

    // return unique entries only, no duplicates
    return Array.from(new Set(purposes));
}

app.use(function(req, res, next){
    console.log("HTTPS request", req.method, req.url, req.body);
    next();
});

app.post('/api/signup/', checkFirstName, checkLastName, checkEmail, checkPassword, sanitizeDate, checkLocation, function(req, res, next) {
    let salt = generateSalt();
    let hash = generateHash(req.body.password, salt);
    // Check if user is created
    User.findOne({email: req.body.email}, function(err, user) {
        if(err) return res.status(500).end("User with email already exists");
    });
    User.create({firstName: req.body.firstname, lastName: req.body.lastname, salt: salt, hash: hash, 
        email: req.body.email, birthday: req.body.birthday, location: req.body.location}, function(err, user) {
            if (err) return res.status(500).end(err);
            req.session.user_id = user._id;
            sessionStore.set(req.sessionID, req.session, function(error) {
                if (err) return res.status(500).end(err);
            });
            res.setHeader('Set-Cookie', cookie.serialize('u.id', user._id, {
              secure:false,
              sameSite: true, 
              path : '/', 
              maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
            }));
            return res.json("New User signed up"); // should actually redirect home
    });
});

app.post('/api/signin/', checkEmail, checkPassword, function(req, res, next) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) return res.status(500);
        if (!user) return res.status(401).end("Access Denied");
        if (user.hash !== generateHash(req.body.password, user.salt)) return res.status(401).end("access denied");

        req.session.user_id = user._id;

        sessionStore.set(req.sessionID, req.session, function(err) {
            if  (err) res.status(500).end(err);
        });

        res.setHeader('Set-Cookie', cookie.serialize('u.id', user._id, {
              secure:false,
              sameSite: true, 
              path : '/', 
              maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
        }));

        return res.json("User signed in");
    });
});

app.post('/api/rooms/new/', upload.array('images'), isAuthenticated, checkHours, function(req, res, next){
    let title = sanitizeContent(req.body.title);
    let address = sanitizeContent(req.body.address);
    let price = sanitizeContent(req.body.price);
    let city = sanitizeContent(req.body.city).toLowerCase();
    let capacity = sanitizeContent(req.body.capacity);
    let owner = sanitizeContent(req.body.owner);
    let description = sanitizeContent(req.body.description);
    let hours = JSON.parse(req.body.hours);
    let start = parseInt(hours.start);
    let end =  parseInt(hours.end);
    hours = {start: start, end: end};


    // Check if purposes are valid entries
    let purposesInvalid = invalidPurposes(req.body.purposes);

    // check if days is given
    if (req.body.days.length == 0){
        res.status(400).end("Days of week must be given");
    }
    let days = checkDays(req.body.days);

    if (hours.start > hours.end){
        res.status(400).end("End time cannot be before start");
    } else if (days.length == 0){
        res.status(400).end("Invalid day of week given");
    } else if (purposesInvalid.length == 0) {
        res.status(400).end("Invalid purposes");
    } else {
        let images = [];
        for (let i=0; i < req.files.length; i++) {
            images.push({id: req.files[i].id});
        }

        Room.create({title: title, address: address, price: price, city: city, purposes: purposesInvalid, hours: hours, 
            days: days, capacity: capacity, owner: owner, description: description, images: images}, function(err, room) {
                if (err) return res.status(500).end(err);
                if (!room) return res.status(401).end("Unable to create room");

                return res.json("Added room successfully");
        });
    }
});

app.get('/api/image/:imageId', function(req, res, next) {
    gfs.files.findOne({_id: ObjectId(req.params.imageId)}, function(err, file) {
        if (err) return res.status(500).end(err);
        if(file === null || file.length === 0) return res.status(404).end("File does not exist");

        if (file && file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            return res.status(404).end("Not an image");
        }
    })
});

app.post('/api/rooms/book/', isAuthenticated, function(req, res, next){
    let roomId = sanitizeContent(req.body.roomId);
    let day = sanitizeContent(req.body.day);
    let userId = sanitizeContent(req.session.user_id);

    let purposesInvalid = invalidPurposes(req.body.purposes);

    if (purposesInvalid.length == 0){
        res.status(400).end("Invalid purposes");
    }

    // Check if there are bookings for this time already
    Booking.find({roomId: roomId, day: day}, function(err, bookings){
        if (bookings){
            let booked = checkArrayTime(req.body.time, bookings);
            if (booked){
                let time = Math.floor(parseInt(booked)/60).toString() + ":" + (parseInt(booked)%60).toString();

                return res.status(400).end("Room is unavailable to be booked for this time and day. Next available time for this day is " + time);
            };
        }
        Booking.create({roomId: roomId, day: day, time: req.body.time, userId: userId, purposes: req.body.purposes}, function(err, booking) {
            if (err) return res.status(500);
            if (!booking) return res.status(401).end("Access Denied");

            return res.json("Added room booking successfully");
        });
    });


});

app.get('/api/signout/', function (req, res, next) {
    req.session.destroy();
    res.setHeader('Set-Cookie', cookie.serialize('u.id', '', {
          secure:false,
          sameSite: true, 
          path : '/', 
          maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    res.redirect('/');
});

//this is just a test route to see if authentication works
app.get('/api/private/', isAuthenticated, function(req, res, next) {
    sessionStore.get(req.sessionID, function(err, session) {
        if (err) return res.status(500).end(err);
        if (!session) return res.status(401).end("access denied");
        if (session) return res.json("private webpage, you're in!");
    });
});

app.get('/api/search', function(req, res, next){
    let location = sanitizeContent(req.query.location);
    // Get the first element (a city) in case the user used autocomplete
    location = location.split(",")[0];
    let date = sanitizeContent(req.query.date);
    let weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    if (!location || !date){
        res.status(400).end("Invalid location or date");
    }
    let split = date.split("-");
    let dateObj = new Date(parseInt(split[0]), parseInt(split[1]) - 1, parseInt(split[2]));
    let dayOfWeek = weekdays[dateObj.getDay()];

    Room.find({ city: location.toLowerCase() }, function (err, rooms) {
        let result = search(dayOfWeek, rooms);
        res.json(result);
    });

});

app.get('/api/room=:id', function(req, res, next){
    Room.findOne({_id: ObjectId(req.params.id)}, function(err, room) {
        if (err) return res.status(500);
        if (!room) return res.status(401).end("Room does not exist");

        return res.json(room);
    });
});

const http = require('http');
const PORT = process.env.PORT || 5000;
const fs = require('fs');
var privateKey = fs.readFileSync( 'server.key' );
var certificate = fs.readFileSync( 'server.crt' );
var config = {
    key: privateKey,
    cert: certificate
};

if (process.env.NODE_ENV === "production"){
    app.use(express.static("client/build"));
    app.get('*', function(req, res){
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});