import type { FastifyInstance } from 'fastify';
import { db } from '../db/index.js';
import { links } from '../db/schema.js';

export async function exportLinks(app: FastifyInstance) {
  app.get('/links/export', async (request, reply) => {
    try {
      const allLinks = await db.select().from(links);
      const header = "ID;URL Original;Codigo;Visitas;Criado Em\n";
      const rows = allLinks.map(link => {
        const id = link.id ?? '';
        const url = link.originalUrl ?? '';
        const code = link.shortCode ?? '';
        const visits = link.visitCount ?? 0;
        const date = link.createdAt ? new Date(link.createdAt).toISOString() : '';

        return `${id};${url};${code};${visits};${date}`;
      }).join('\n');

      const csvContent = header + rows;

      const now = new Date();
      const timestamp = now.toISOString()
        .replace(/[-T:]/g, '') // Remove traços, T e dois pontos
        .split('.')[0];        // Remove os ms
      const randomSuffix = Math.random().toString(36).substring(2, 7);

      return reply
        .header('Content-Type', 'text/csv; charset=utf-8')
        .header('Content-Disposition', `attachment; filename=links_${timestamp}_${randomSuffix}.csv`)
        .send(csvContent);

    } catch (error) {
      console.error("Erro na exportação CSV:", error);
      return reply.status(500).send({ 
        error: "Erro ao gerar CSV", 
        message: "Ocorreu um problema ao processar os dados para exportação." 
      });
    }
  });
}