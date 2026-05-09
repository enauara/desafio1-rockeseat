import type { FastifyInstance } from 'fastify';
import { db } from '../db';
import { links } from '../db/schema';

export async function getLinks(app: FastifyInstance) {
  app.get('/links', async (request, reply) => {
    const allLinks = await db.select().from(links);

    return reply.send(allLinks);
  });
}