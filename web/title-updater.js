import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";
import cron from "node-cron";


const key = process.env.SHOPIFY_API_KEY


cron.schedule('1 * * * *', async () => {
  console.log('running a task every hour');

  // Calling the titleUpdater function every hour to update product titles. 
  //    Issue - Getting an offline session to use for the instatiating the client.
  //titleUpdater(session);
});

const ADJECTIVES = [
  "Awesome",
  "Beautiful",
  "Cool",
  "Great",
  "Fantastic",
  "Wonderful",
]

export default async function titleUpdater(session) {

  const client = new shopify.api.clients.Graphql({session});

  // Getting the product ID's to iterate title changes 
  //    Issue - Even though the query works in Shopifys GraphQL IDE and returns the products there, it does not work here.
  try {
    const data = await client.query({
      data: `query {
        products(first: 5) {
          edges {
            node {
              id
              title
            }
          }
        }
      }`,
    });

    console.log(data, 'logging the product ids')
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }

  // Hardcoded product ID's to demonstrate that the titleMutation function works as intended.
  const productIDs = ["gid://shopify/Product/8040304148763", "gid://shopify/Product/8040304279835", "gid://shopify/Product/8040304312603", "gid://shopify/Product/8040304378139", "gid://shopify/Product/8040304443675"]

  productIDs.forEach(id => {
    titleMutation(client, id)
  });
}

async function titleMutation(client, id) {

  const query = `mutation {
    productUpdate(input: {id: "${id}", title: "${randomTitle()}"}) {
      product {
        id
      }
    }
  }`

  try {
    await client.query({
      data: query,
    });
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}

function randomTitle() {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const number = Math.floor(1000 + Math.random() * 9000);
  return `${adjective} T-shirt ${number}`;
}
