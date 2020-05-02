const express = require('express')
const bodyParser = require('body-parser')
const graphQlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const app = express()
const PORT = 5000
dotenv.config()

const Event = require('./models/event')

app.use(bodyParser.json())

app.use('/graphql', graphQlHttp({ //graphQl end-point
    //Define
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float
            date: String!
        }

        type RootQuery {
            events: [Event!]! 
        }

        type RootMutation {
             createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: { //Resolver
        //Implement
        events: () => { //resolver for querying events 
            return events;
        },
        createEvent: args => { //resolver for mutating/creating events
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Dtate(args.eventInput.date)
            })
            return event
                .save()
                .then(result => {
                    console.log(result)
                    return { ...result._doc }
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
            return event
        }
    },
    graphiql: true //debug tool
  })
)

//Connect DB
mongoose.connect(process.env.MONGO_CONNECT, 
    { useUnifiedTopology: true , useNewUrlParser: true})
    .then(() => {
        app.listen(PORT, () => console.log(`APP: Server running on port ${PORT}`))
    })
    .catch(err => {
        console.log('APP: Errorr [error starting server, connection to DB error!' + err)
        throw err
    }
);
