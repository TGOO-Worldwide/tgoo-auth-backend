#!/usr/bin/env node

/**
 * Script para configurar a plataforma principal (master) e criar o SUPER_ADMIN
 * 
 * Uso:
 *   node scripts/setup-master-platform.js
 * 
 * Variáveis de ambiente (opcionais):
 *   MASTER_PLATFORM_CODE - Código da plataforma (padrão: auth_tgoo)
 *   MASTER_PLATFORM_NAME - Nome da plataforma (padrão: TGOO Auth)
 *   MASTER_ADMIN_EMAIL - Email do SUPER_ADMIN (padrão: admin@tgoo.eu)
 *   MASTER_ADMIN_PASSWORD - Senha do SUPER_ADMIN (padrão: Senha@123)
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupMasterPlatform() {
  try {
    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║  🔐 Configuração da Plataforma Principal e SUPER_ADMIN      ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    // Valores padrão
    const defaultPlatformCode = process.env.MASTER_PLATFORM_CODE || 'auth_tgoo';
    const defaultPlatformName = process.env.MASTER_PLATFORM_NAME || 'TGOO Auth';
    const defaultAdminEmail = process.env.MASTER_ADMIN_EMAIL || 'admin@tgoo.eu';
    const defaultAdminPassword = process.env.MASTER_ADMIN_PASSWORD || 'Senha@123';

    // Perguntar dados da plataforma
    console.log('📋 Dados da Plataforma Principal:\n');
    
    const platformCode = (await question(`Código da plataforma (${defaultPlatformCode}): `)) || defaultPlatformCode;
    const platformName = (await question(`Nome da plataforma (${defaultPlatformName}): `)) || defaultPlatformName;
    const platformDomain = await question('Domínio da plataforma (opcional): ');
    const platformDescription = await question('Descrição da plataforma (opcional): ');

    console.log('\n👤 Dados do SUPER_ADMIN:\n');
    
    const adminEmail = (await question(`Email do SUPER_ADMIN (${defaultAdminEmail}): `)) || defaultAdminEmail;
    const adminPassword = (await question(`Senha do SUPER_ADMIN (${defaultAdminPassword}): `)) || defaultAdminPassword;
    const adminFullName = await question('Nome completo do SUPER_ADMIN (opcional): ');

    console.log('\n⚙️  Processando...\n');

    // Verificar se já existe uma plataforma master
    const existingMaster = await prisma.platform.findFirst({
      where: { isMaster: true }
    });

    if (existingMaster && existingMaster.code !== platformCode) {
      const confirm = await question(
        `⚠️  Já existe uma plataforma master (${existingMaster.code}). Deseja substituir? (s/N): `
      );
      
      if (confirm.toLowerCase() !== 's') {
        console.log('\n❌ Operação cancelada.\n');
        rl.close();
        await prisma.$disconnect();
        process.exit(0);
      }

      // Remover status master da plataforma antiga
      await prisma.platform.update({
        where: { id: existingMaster.id },
        data: { isMaster: false }
      });

      console.log(`✓ Plataforma ${existingMaster.code} não é mais a plataforma master`);
    }

    // Criar ou atualizar plataforma
    const platform = await prisma.platform.upsert({
      where: { code: platformCode },
      update: {
        name: platformName,
        domain: platformDomain || null,
        description: platformDescription || null,
        isMaster: true,
        isActive: true
      },
      create: {
        code: platformCode,
        name: platformName,
        domain: platformDomain || null,
        description: platformDescription || null,
        isMaster: true,
        isActive: true
      }
    });

    console.log(`✓ Plataforma master criada/atualizada: ${platform.code} (ID: ${platform.id})`);

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: {
        email_platformId: {
          email: adminEmail,
          platformId: platform.id
        }
      }
    });

    if (existingUser) {
      // Atualizar usuário existente
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          fullName: adminFullName || existingUser.fullName,
          role: 'SUPER_ADMIN',
          status: 'ACTIVE'
        }
      });

      console.log(`✓ Usuário SUPER_ADMIN atualizado: ${user.email} (ID: ${user.id})`);
    } else {
      // Criar novo usuário
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const user = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          fullName: adminFullName || null,
          role: 'SUPER_ADMIN',
          status: 'ACTIVE',
          platformId: platform.id
        }
      });

      console.log(`✓ Usuário SUPER_ADMIN criado: ${user.email} (ID: ${user.id})`);
    }

    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ Configuração concluída com sucesso!                      ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    console.log('📝 Resumo da Configuração:\n');
    console.log(`   Plataforma Master: ${platform.name} (${platform.code})`);
    console.log(`   ID da Plataforma: ${platform.id}`);
    console.log(`   SUPER_ADMIN: ${adminEmail}`);
    console.log(`   Role: SUPER_ADMIN`);
    console.log(`   Status: ACTIVE\n`);

    console.log('🎉 O SUPER_ADMIN pode agora autenticar-se em TODAS as plataformas!\n');

  } catch (error) {
    console.error('\n❌ Erro ao configurar plataforma master:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Executar script
setupMasterPlatform();
