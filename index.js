const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { default: axios } = require('axios');


// query getAllTodos($getUserByIdId: ID!) {
//     getUserById(id: $getUserByIdId) {
//         name
//         username
//     }
// }

// query getAllTodos($getUserByIdId: ID!) {
//     getTodos {
//       completed
//       id
//       user {
//         name
//       }
//     }
 
//  }

async function startServer() {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    const server = new ApolloServer({
        typeDefs: `
        type User {   
            id: ID!
            name: String
            username:String
            email: String
            phone: String
            website: String
        }
        type Todo {
            id: ID!
            title: String!
            completed: Boolean
            userId:ID!
            user: User
        }
        type Query {
            getTodos: [Todo]
            getAllUser: [User]
            getUserById(id: ID!) : User
        }
      `,
        resolvers: {
            Todo: {
                user: async (todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`)).data
            },
            Query: {
                getTodos: async () => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
                getAllUser: async () => (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
                getUserById: async (parent, { id }) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
            }
        }
    });

    await server.start();

    app.use('/graphql', expressMiddleware(server));

    app.listen('8080', () => console.log(`app is running to the port 8080`))
}
startServer()


