import { Client } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject('YOUR_PROJECT_ID'); // Your project ID

  export { client };