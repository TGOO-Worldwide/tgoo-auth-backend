import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';

// Registrar novo usuário
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, platform } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (!platform) {
      return res.status(400).json({ error: 'Plataforma é obrigatória' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Buscar plataforma
    const platformData = await prisma.platform.findUnique({
      where: { code: platform }
    });

    if (!platformData) {
      return res.status(400).json({ error: 'Plataforma inválida' });
    }

    if (!platformData.isActive) {
      return res.status(400).json({ error: 'Plataforma está inativa' });
    }

    // Verificar se email já existe nesta plataforma
    const existingUser = await prisma.user.findUnique({
      where: { 
        email_platformId: {
          email,
          platformId: platformData.id
        }
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado nesta plataforma' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: fullName || null,
        platformId: platformData.id,
        status: 'PENDING' // Novo usuário começa como pendente
      },
      include: {
        platform: true
      }
    });

    res.status(201).json({
      message: 'Conta criada com sucesso! Aguarde aprovação do administrador.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        status: user.status,
        platform: {
          code: user.platform.code,
          name: user.platform.name
        }
      }
    });
  } catch (error) {
    console.error('Erro no signup:', error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password, platform } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (!platform) {
      return res.status(400).json({ error: 'Plataforma é obrigatória' });
    }

    // Buscar plataforma
    const platformData = await prisma.platform.findUnique({
      where: { code: platform }
    });

    if (!platformData) {
      return res.status(400).json({ error: 'Plataforma inválida' });
    }

    if (!platformData.isActive) {
      return res.status(400).json({ error: 'Plataforma está inativa' });
    }

    // Buscar usuário nesta plataforma
    const user = await prisma.user.findUnique({
      where: { 
        email_platformId: {
          email,
          platformId: platformData.id
        }
      },
      include: {
        platform: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar se conta está ativa
    if (user.status === 'BLOCKED') {
      return res.status(403).json({ error: 'Conta bloqueada. Entre em contato com o administrador.' });
    }

    if (user.status === 'PENDING') {
      return res.status(403).json({ error: 'Conta pendente de aprovação. Aguarde o administrador ativar sua conta.' });
    }

    // Gerar token JWT (incluindo platformId)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        platformId: user.platformId,
        platform: user.platform.code
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        platform: {
          id: user.platform.id,
          code: user.platform.code,
          name: user.platform.name
        }
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Listar plataformas disponíveis (público)
router.get('/platforms', async (req: Request, res: Response) => {
  try {
    const platforms = await prisma.platform.findMany({
      where: { isActive: true },
      select: {
        id: true,
        code: true,
        name: true,
        domain: true,
        description: true
      },
      orderBy: { name: 'asc' }
    });

    res.json(platforms);
  } catch (error) {
    console.error('Erro ao buscar plataformas:', error);
    res.status(500).json({ error: 'Erro ao buscar plataformas' });
  }
});

// Obter perfil do usuário autenticado
router.get('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        createdAt: true,
        platform: {
          select: {
            id: true,
            code: true,
            name: true,
            domain: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

export default router;

