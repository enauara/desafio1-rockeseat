import type { FastifyInstance } from 'fastify';
import { eq, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { links } from '../db/schema.js';

export async function redirectLink(app: FastifyInstance) {

  app.get('/:code', async (request, reply) => {
    const { code } = request.params as { code: string };

    const [result] = await db
      .update(links)
      .set({ 
        visitCount: sql`${links.visitCount} + 1` 
      })
      .where(eq(links.shortCode, code))
      .returning();

    if (!result) {
      return reply.status(404).send({ 
        message: "Link encurtado não encontrado ou expirado." 
      });
    }

    return reply.redirect(result.originalUrl);
  });
}