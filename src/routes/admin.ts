import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticate, requireAdmin, requireSuperAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Todas as rotas admin requerem autenticação e role de ADMIN ou SUPER_ADMIN
router.use(authenticate);
router.use(requireAdmin);

// Listar usuários (filtrado por plataforma para ADMIN, todos para SUPER_ADMIN)
router.get('/users', async (req: Request, res: Response) => {
  try {
    const isSuperAdmin = req.user?.role === 'SUPER_ADMIN';
    const platformFilter = req.query.platform as string | undefined;

    // Construir filtro de plataforma
    const whereClause: any = {};
    
    if (isSuperAdmin) {
      // SUPER_ADMIN pode filtrar por plataforma específica ou ver todas
      if (platformFilter) {
        const platform = await prisma.platform.findUnique({
          where: { code: platformFilter }
        });
        if (platform) {
          whereClause.platformId = platform.id;
        }
      }
      // Se não especificar plataforma, vê todas
    } else {
      // ADMIN vê apenas usuários de sua plataforma
      whereClause.platformId = req.user?.platformId;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        platform: {
          select: {
            id: true,
            code: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// Atualizar status ou role de um usuário
router.patch('/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { status, role } = req.body;
    const isSuperAdmin = req.user?.role === 'SUPER_ADMIN';

    // Validar se pelo menos um campo foi enviado
    if (!status && !role) {
      return res.status(400).json({ error: 'É necessário fornecer status ou role' });
    }

    // Validar valores permitidos
    if (status && !['PENDING', 'ACTIVE', 'BLOCKED'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido. Use: PENDING, ACTIVE ou BLOCKED' });
    }

    const allowedRoles = isSuperAdmin ? ['USER', 'ADMIN', 'SUPER_ADMIN'] : ['USER', 'ADMIN'];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ error: `Role inválida. Use: ${allowedRoles.join(', ')}` });
    }

    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { platform: true }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // ADMIN só pode editar usuários de sua plataforma
    if (!isSuperAdmin && existingUser.platformId !== req.user?.platformId) {
      return res.status(403).json({ error: 'Você não pode editar usuários de outra plataforma' });
    }

    // ADMIN não pode modificar SUPER_ADMIN
    if (!isSuperAdmin && existingUser.role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Apenas SUPER_ADMIN pode gerenciar outros SUPER_ADMIN' });
    }

    // Prevenir que admin se remova de admin ou se bloqueie
    if (req.user?.id === userId && role && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return res.status(400).json({ error: 'Você não pode remover seu próprio privilégio de admin' });
    }

    if (req.user?.id === userId && status === 'BLOCKED') {
      return res.status(400).json({ error: 'Você não pode bloquear sua própria conta' });
    }

    // ADMIN não pode promover para SUPER_ADMIN
    if (!isSuperAdmin && role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Apenas SUPER_ADMIN pode promover para SUPER_ADMIN' });
    }

    // Atualizar usuário
    const updateData: any = {};
    if (status) updateData.status = status;
    if (role) updateData.role = role;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        platform: {
          select: {
            id: true,
            code: true,
            name: true
          }
        }
      }
    });

    res.json({
      message: 'Usuário atualizado com sucesso',
      user: updatedUser
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Criar novo usuário (Admin)
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, role, status, platform } = req.body;
    const isSuperAdmin = req.user?.role === 'SUPER_ADMIN';

    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Determinar plataforma
    let platformId: number;
    
    if (isSuperAdmin && platform) {
      // SUPER_ADMIN pode especificar plataforma
      const platformData = await prisma.platform.findUnique({
        where: { code: platform }
      });
      
      if (!platformData) {
        return res.status(400).json({ error: 'Plataforma inválida' });
      }
      
      platformId = platformData.id;
    } else {
      // ADMIN cria usuário em sua própria plataforma
      platformId = req.user!.platformId;
    }

    // Validar valores permitidos
    const allowedRoles = isSuperAdmin ? ['USER', 'ADMIN', 'SUPER_ADMIN'] : ['USER', 'ADMIN'];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ error: `Role inválida. Use: ${allowedRoles.join(', ')}` });
    }

    if (status && !['PENDING', 'ACTIVE', 'BLOCKED'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido. Use: PENDING, ACTIVE ou BLOCKED' });
    }

    // Verificar se email já existe nesta plataforma
    const existingUser = await prisma.user.findUnique({
      where: { 
        email_platformId: {
          email,
          platformId
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
        role: role || 'USER',
        status: status || 'ACTIVE', // Admin pode criar usuário já ativo
        platformId
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        platform: {
          select: {
            id: true,
            code: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Resetar senha de um usuário (Admin)
router.post('/users/:id/reset-password', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { newPassword } = req.body;
    const isSuperAdmin = req.user?.role === 'SUPER_ADMIN';

    // Validações
    if (!newPassword) {
      return res.status(400).json({ error: 'Nova senha é obrigatória' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // ADMIN só pode resetar senha de usuários de sua plataforma
    if (!isSuperAdmin && existingUser.platformId !== req.user?.platformId) {
      return res.status(403).json({ error: 'Você não pode resetar senha de usuários de outra plataforma' });
    }

    // ADMIN não pode resetar senha de SUPER_ADMIN
    if (!isSuperAdmin && existingUser.role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Apenas SUPER_ADMIN pode resetar senha de outros SUPER_ADMIN' });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Senha resetada com sucesso' });
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    res.status(500).json({ error: 'Erro ao resetar senha' });
  }
});

// ========== ROTAS EXCLUSIVAS PARA SUPER_ADMIN ==========

// Listar todas as plataformas
router.get('/platforms', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const platforms = await prisma.platform.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(platforms);
  } catch (error) {
    console.error('Erro ao listar plataformas:', error);
    res.status(500).json({ error: 'Erro ao listar plataformas' });
  }
});

// Criar nova plataforma
router.post('/platforms', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const { code, name, domain, description } = req.body;

    // Validações
    if (!code || !name) {
      return res.status(400).json({ error: 'Code e name são obrigatórios' });
    }

    // Verificar se code já existe
    const existingPlatform = await prisma.platform.findUnique({
      where: { code }
    });

    if (existingPlatform) {
      return res.status(400).json({ error: 'Code já existe' });
    }

    // Criar plataforma
    const platform = await prisma.platform.create({
      data: {
        code,
        name,
        domain: domain || null,
        description: description || null,
        isActive: true
      }
    });

    res.status(201).json({
      message: 'Plataforma criada com sucesso',
      platform
    });
  } catch (error) {
    console.error('Erro ao criar plataforma:', error);
    res.status(500).json({ error: 'Erro ao criar plataforma' });
  }
});

// Atualizar plataforma
router.patch('/platforms/:id', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const platformId = parseInt(req.params.id);
    const { name, domain, description, isActive } = req.body;

    // Verificar se plataforma existe
    const existingPlatform = await prisma.platform.findUnique({
      where: { id: platformId }
    });

    if (!existingPlatform) {
      return res.status(404).json({ error: 'Plataforma não encontrada' });
    }

    // Atualizar plataforma
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (domain !== undefined) updateData.domain = domain;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedPlatform = await prisma.platform.update({
      where: { id: platformId },
      data: updateData
    });

    res.json({
      message: 'Plataforma atualizada com sucesso',
      platform: updatedPlatform
    });
  } catch (error) {
    console.error('Erro ao atualizar plataforma:', error);
    res.status(500).json({ error: 'Erro ao atualizar plataforma' });
  }
});

export default router;

