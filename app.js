const express = require("express");
const app = express();
const cors = require("cors");
const elasticsearch = require("elasticsearch");
let client = elasticsearch.Client({
    host: 'localhost:9200',
    // log: 'trace'
})

app.use(cors());

let workouts = [
    {
        id: 1,
        type: "Weights",
        duration: 45,
        date: "02/09/2019"
    },
    {
        id: 2,
        type: "Rum",
        duration: 30,
        date: "02/10/2019"
    }
]


app.get('/api', (req, res) => {
    return res.status(200).send({
        message: "Api active",
        workouts: workouts
    })
})


app.get("/api/:id", (req, res) => {
    // let workout = workouts.find(data => data.id == req.params.id);

    let option = {
        index: 'workout',
        type: 'mytype',
        id: req.params.id
    };

    let workout;
    client.search(option, (err, resp, status) => {
        if (err)
            console.log(err);
        else {
            workout = resp.source;
            console.log(workout);
            if (!workout)
                return res.status(400).send({
                    message: `Workout is not found for id ${req.params.id}`
                })
            return res.status(200).send({
                message: req.params.id,
                workout: workout
            })
        }
    })

    res.send(`ID search is ${req.params.id}`);

    // if (!workout)
    //     return res.status(400).send({
    //         message: `ID ${req.params.id} is not define`
    //     })
    // return res.status(200).send({
    //     message: req.params.id,
    //     workout: workout
    // })


})

app.post('/workout', (req, res) => {
    if (!req.body.id) {
        return res.status(400).send({
            message: "Id is required"
        });

    }

    client.index({
        index: 'workout',
        type: 'mytype',
        id: req.body.id,
        body: req.body
    }, (err, resp, status) => {
        if (err)
            console.log(err);
        else {
            return res.status(200).send({ message: "POST workout call success" });
        }
    })
})

app.listen(3000, () => {
    console.log("Server start");
})