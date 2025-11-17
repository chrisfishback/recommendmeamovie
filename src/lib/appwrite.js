import { Client } from 'appwrite';

const client = new Client();

client
  .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID);

export { client };