import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// A `main` function so that you can use async/await
async function main() {
  /* TAREFA 01: Escreva uma consulta para retornar todos os registros da tabela User
  const resultado = await prisma.user.findMany();
  */
 /* TAREFA 02: Escreva uma consulta para criar um novo registro na tabela User
  const resultado = await prisma.user.create({
    data: {
      email: 'adrielboy1@gmail.com',
      name: 'Adriel Outro Teste'
    }
  })
  */

  /* TAREFA 03: Escreva uma consulta para atualizar um registro existente na tabela User
  const resultado = await prisma.user.update({
    where: {email: 'adrielboy1@gmail.com'},
    data: {
      name: 'Outro Adrielzin',
    }
  })
  */
  /* TAREFA 05: Escreva uma consulta para criar um novo registro na tabela Post
  const resultado = await prisma.post.create({
    data: {
      title: 'Helo World',
    }
  });
  */
  
  /* TAREFA 06: Escreva uma consulta para conectar os registros User ePost
  const resultado = await prisma.post.update({
    where: {id: 1},
    data: {
      author: {
        connect: {
          email: 'adrielboy1@gmail.com',
        }
      }
    }
  })
  */

  /* TAREFA 07: Escreva uma consulta para buscar um único registro da tabela User pelo email
  const resultado = await prisma.user.findUnique({
    where: {
      email: 'adrielboy1@gmail.com'
    }
  })
  */

  /* TAREFA 08: Escreva uma consulta que selecione apenas alguns campos
  const resultado = await prisma.user.findMany({
    select: {name: true}
  })
  */

  /* TAREFA 09: Escreva uma subconsulta para incluir um relacionamento no resultado
  const resultado = await prisma.user.findUnique({
    where: {email: 'adrielboy1@gmail.com'},
    include: {posts: true},
  })
  */

  /* TAREFA 10: Escreva uma subconsulta para criar um novo registro na tabela User e Post ao mesmo tempo
  const resultado = await prisma.user.create({
    data: {
      email: 'dev2@dixhealth.com.br',
      name:  'Fulano teste',
      posts: {
        create: {
          title: 'Welcome Adriel',
          content: 'None',
        }
      }
    }
  })
  */

  /* TAREFA 11: Escreva uma consulta que filtre os usuários cujos nomes começam com “A”
  const resultado = await prisma.user.findMany({
    where: {
      name: {
        startsWith: 'A'
      }
    }
  })
  */

  // TAREFA 12: Escreva uma consulta de paginação
  const resultado = await prisma.user.findMany({
    skip: 2,
    take: 2,
  })


  console.log(resultado);
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
