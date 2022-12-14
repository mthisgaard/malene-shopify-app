import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";

const ITEMS = [
  "T-shirt",
  "Dress",
  "Jeans",
  "Shorts",
  "Sneakers",
  "Swimsuit",
]

export default async function titleUpdater(
  session
) {
  const client = new shopify.api.clients.Graphql({ session });

  const products = await client.query({
    data: `query {
      products(first: 10) {
        edges {
          node {
            id
            title
          }
        }
      }
    }`,
  });

  console.log(products, 'logging the product ids yeahhh')

  // try {
  //   productIDs.forEach(pid => {
  //     client.query({
  //       data: `mutation {
  //         productUpdate(input: {id: ${pid}, title: ${randomTitle()}}) {
  //           product {
  //             id
  //           }
  //         }
  //       }`,
  //     });
  //   });
  // } catch (error) {
  //   if (error instanceof GraphqlQueryError) {
  //     throw new Error(
  //       `${error.message}\n${JSON.stringify(error.response, null, 2)}`
  //     );
  //   } else {
  //     throw error;
  //   }
  // }
}

function randomTitle() {
  const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
  const number = Math.round((Math.random() * 10 + Number.EPSILON) * 100) / 100;
  return `${item} ${number}`;
}
