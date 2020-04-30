const express = require('express')
const bodyParser = require('body-parser')
const graphQlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const app = express()
const events = [];

const PORT = 3000

dotenv.config()

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
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date().toISOString()
            }
            events.push(event)
            return event
        }
    },
    graphiql: true //debug tool
  })
)

//Connect DB
mongoose.connect(process.env.MONGO_CONNECT, 
    { useUnifiedTopology: true , useNewUrlParser: true})
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
    });


// mongoose.connect(``)
//                 .then(() => {
//                     app.listen(PORT, () => console.log(`APP: Server running on port ${PORT}`))
//                 }).catch(err => {
//                     console.log('APP: Errorr [error starting server, connection to DB error!')
//                 })
