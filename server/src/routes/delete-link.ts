import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { links } from '../db/schema.js';

export async function deleteLink(app: FastifyInstance) {
  app.delete('/links/:id', async (request, reply) => {
    const deleteParamsSchema = z.object({
      id: z.string().uuid({ message: "ID inválido" })
    });

    const { id } = deleteParamsSchema.parse(request.params);

    const [deletedLink] = await db
      .delete(links)
      .where(eq(links.id, id))
      .returning();

    if (!deletedLink) {
      return reply.status(404).send({ 
        message: "Link não encontrado. Talvez já tenha sido removido." 
      });
    }

    return reply.status(200).send({ 
      message: "Link removido com sucesso!",
      deletedCode: deletedLink.shortCode 
    });
  });
}