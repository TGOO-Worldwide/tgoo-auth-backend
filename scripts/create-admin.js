const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const prisma = new PrismaClient();

async function createAdmin() {
  const rl = readline.createInterface({ input, output });

  try {
    console.log('🔐 Criar Usuário Admin/Super Admin\n');
    
    // Listar plataformas disponíveis
    const platforms = await prisma.platform.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    
    if (platforms.length === 0) {
      console.error('❌ Nenhuma plataforma encontrada! Execute o seed primeiro.');
      process.exit(1);
    }
    
    console.log('Plataformas disponíveis:');
    platforms.forEach((p, index) => {
      console.log(`  ${index + 1}. ${p.name} (${p.code})`);
    });
    console.log();
    
    const email = await rl.question('Email: ');
    const password = await rl.question('Senha (mínimo 6 caracteres): ');
    const fullName = await rl.question('Nome Completo: ');
    const platformChoice = await rl.question(`Plataforma (1-${platforms.length}): `);
    const roleChoice = await rl.question('Role (1=USER, 2=ADMIN, 3=SUPER_ADMIN): ');
    
    rl.close();
    
    if (!email || !password || !fullName) {
      console.error('❌ Email, senha e nome completo são obrigatórios!');
      process.exit(1);
    }
    
    if (password.length < 6) {
      console.error('❌ A senha deve ter no mínimo 6 caracteres!');
      process.exit(1);
    }
    
    const platformIndex = parseInt(platformChoice) - 1;
    if (platformIndex < 0 || platformIndex >= platforms.length) {
      console.error('❌ Plataforma inválida!');
      process.exit(1);
    }
    
    const selectedPlatform = platforms[platformIndex];
    
    const roles = ['USER', 'ADMIN', 'SUPER_ADMIN'];
    const roleIndex = parseInt(roleChoice) - 1;
    if (roleIndex < 0 || roleIndex >= roles.length) {
      console.error('❌ Role inválida!');
      process.exit(1);
    }
    
    const selectedRole = roles[roleIndex];
    
    // Verificar se já existe nesta plataforma
    const existingUser = await prisma.user.findUnique({
      where: { 
        email_platformId: {
          email,
          platformId: selectedPlatform.id
        }
      }
    });
    
    if (existingUser) {
      console.error(`❌ Já existe um usuário com este email na plataforma ${selectedPlatform.name}!`);
      process.exit(1);
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Criar admin
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: selectedRole,
        status: 'ACTIVE',
        platformId: selectedPlatform.id
      },
      include: {
        platform: true
      }
    });
    
    console.log('\n✅ Usuário criado com sucesso!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Nome:', admin.fullName);
    console.log('👑 Role:', admin.role);
    console.log('🟢 Status:', admin.status);
    console.log('🏢 Plataforma:', admin.platform.name);
    console.log('\n🎉 Você já pode fazer login no sistema!');
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin().catch(console.error);
