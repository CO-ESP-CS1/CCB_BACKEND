import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const membres = await prisma.membre.findMany()
  console.log(membres)
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
