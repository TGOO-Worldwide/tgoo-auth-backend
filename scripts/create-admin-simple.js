const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Uso: node create-admin-simple.js email@example.com senha123 "Nome Completo" dressme SUPER_ADMIN

async function createAdmin() {
  try {
    const [, , email, password, fullName, platformCode, role] = process.argv;
    
    if (!email || !password || !fullName || !platformCode || !role) {
      console.log('❌ Uso incorreto!');
      console.log('\nUso: node create-admin-simple.js <email> <senha> "<nome>" <plataforma> <role>');
      console.log('\nExemplo:');
      console.log('  node create-admin-simple.js admin@tgoo.eu senha123 "Admin TGOO" dressme SUPER_ADMIN');
      console.log('\nRoles disponíveis: USER, ADMIN, SUPER_ADMIN');
      console.log('\nPlataformas disponíveis:');
      
      const platforms = await prisma.platform.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });
      
      platforms.forEach(p => {
        console.log(`  - ${p.code} (${p.name})`);
      });
      
      process.exit(1);
    }
    
    // Validações
    if (password.length < 6) {
      console.error('❌ A senha deve ter no mínimo 6 caracteres!');
      process.exit(1);
    }
    
    const roles = ['USER', 'ADMIN', 'SUPER_ADMIN'];
    if (!roles.includes(role)) {
      console.error(`❌ Role inválida! Use: ${roles.join(', ')}`);
      process.exit(1);
    }
    
    // Buscar plataforma
    const platform = await prisma.platform.findUnique({
      where: { code: platformCode }
    });
    
    if (!platform) {
      console.error(`❌ Plataforma '${platformCode}' não encontrada!`);
      process.exit(1);
    }
    
    if (!platform.isActive) {
      console.error(`❌ Plataforma '${platformCode}' está inativa!`);
      process.exit(1);
    }
    
    // Verificar se já existe
    const existingUser = await prisma.user.findUnique({
      where: { 
        email_platformId: {
          email,
          platformId: platform.id
        }
      }
    });
    
    if (existingUser) {
      console.error(`❌ Já existe um usuário com este email na plataforma ${platform.name}!`);
      process.exit(1);
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role,
        status: 'ACTIVE',
        platformId: platform.id
      },
      include: {
        platform: true
      }
    });
    
    console.log('\n✅ Usuário criado com sucesso!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', user.email);
    console.log('👤 Nome:', user.fullName);
    console.log('👑 Role:', user.role);
    console.log('🟢 Status:', user.status);
    console.log('🏢 Plataforma:', user.platform.name, `(${user.platform.code})`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🎉 Você já pode fazer login no sistema!');
    console.log(`\n💡 Teste: curl -X POST http://localhost:3001/api/auth/login \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d '{"email":"${email}","password":"${password}","platform":"${platform.code}"}'`);
    
  } catch (error) {
    console.error('\n❌ Erro ao criar usuário:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

