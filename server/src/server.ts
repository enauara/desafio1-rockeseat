import fastify from 'fastify';
import cors from '@fastify/cors';
import { getLinks } from './routes/get-links';
import { createLink } from './routes/create-link';
import { redirectLink } from './routes/redirect.js';
import { deleteLink } from './routes/delete-link.js';
import { exportLinks } from './routes/export-links.js';

const app = fastify();

app.register(cors, { 
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
});

app.register(getLinks);
app.register(createLink);
app.register(redirectLink);
app.register(deleteLink);
app.register(exportLinks);
app.listen({ port: 3333 }).then(() => {
  console.log('🔥 Servidor online em http://localhost:3333');
});