import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Criar plataformas
  const dressme = await prisma.platform.upsert({
    where: { code: 'dressme' },
    update: {},
    create: {
      code: 'dressme',
      name: 'DressMe',
      domain: 'dressme.tgoo.eu',
      description: 'Plataforma de geração de looks com IA',
      isActive: true,
    },
  });

  console.log('✅ Plataforma criada:', dressme.name);

  // Você pode adicionar mais plataformas aqui no futuro
  // const project2 = await prisma.platform.upsert({...});

  console.log('🎉 Seed concluído!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erro no seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

