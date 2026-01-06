import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Obter chave API do Gemini do usuário
router.get('/gemini', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        geminiApiKey: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      hasApiKey: !!user.geminiApiKey,
      apiKey: user.geminiApiKey || null
    });
  } catch (error) {
    console.error('Erro ao buscar chave API:', error);
    res.status(500).json({ error: 'Erro ao buscar chave API' });
  }
});

// Salvar/Atualizar chave API do Gemini
router.post('/gemini', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { apiKey } = req.body;

    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(400).json({ error: 'Chave API inválida' });
    }

    // Atualizar chave API do usuário
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { geminiApiKey: apiKey },
      select: {
        id: true,
        email: true,
        geminiApiKey: true
      }
    });

    res.json({
      message: 'Chave API salva com sucesso',
      hasApiKey: !!user.geminiApiKey
    });
  } catch (error) {
    console.error('Erro ao salvar chave API:', error);
    res.status(500).json({ error: 'Erro ao salvar chave API' });
  }
});

// Remover chave API do Gemini
router.delete('/gemini', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { geminiApiKey: null }
    });

    res.json({
      message: 'Chave API removida com sucesso',
      hasApiKey: false
    });
  } catch (error) {
    console.error('Erro ao remover chave API:', error);
    res.status(500).json({ error: 'Erro ao remover chave API' });
  }
});

export default router;

