import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db/index.js';
import { links } from '../db/schema.js';

export async function createLink(app: FastifyInstance) {
  app.post('/links', async (request, reply) => {
    const createLinkSchema = z.object({
      original_url: z.string().url({ message: "Formato de URL inválido" }),
      short_code: z.string().min(1),
    });

    const { original_url, short_code } = createLinkSchema.parse(request.body);

    try {
    const [result] = await db.insert(links).values({
      originalUrl: original_url,
      shortCode: short_code,
    }).returning();

    return reply.status(201).send({
      id: result!.id,
      shortCode: result!.shortCode,
      originalUrl: result!.originalUrl,
      shortUrl: `http://localhost:3333/${result!.shortCode}`
    });

  } catch (error: any) {
      if (error.cause.code === '23505') {
        return reply.status(409).send({ 
          error: "Conflito", 
          message: `O código '${short_code}' já está a ser utilizado. Escolha outro.` 
        });
      }

      console.error(error);
      return reply.status(500).send({ message: "Erro interno no servidor." });
    }
  });
}