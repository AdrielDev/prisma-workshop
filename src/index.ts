import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Busca todos os objetos do tipo User
app.get("/users", async (req, res) => {
  const result = await prisma.user.findMany();
  res.json(result);
});

// Cria um objeto do tipo User
app.post(`/signup`, async (req, res) => {
  const { name, email } = req.body;

  const result = await prisma.user.create({
    data: {
      email: email,
      name: name,
    }
  });

  res.json(result);
});

// Cria um objeto do tipo Post
app.post(`/post`, async (req, res) => {
  const { title, authorEmail, content, published } = req.body;

  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      published: published,
      author: {
        connect: {
          email: authorEmail,
        }
      }
    }
  })

  res.json(result);

});

// Aumenta as visualizações de uma postagem em 1
app.put("/post/:id/views", async (req, res) => {
  const { id } = req.params;

  const result = await prisma.post.update({
    where: {
      id: Number(id),
    },
    data: {
      viewCount: {
        increment: 1,
      }
    }
  })

  res.json(result);

});

// Publica uma postagem
app.put("/publish/:id", async (req, res) => {
  const { id } = req.params;

  const result = await prisma.post.update({
    data: {
      published: true,
    },
    where: {
      id: Number(id)
    }
  })

  res.json(result);

});

// Busca as postagens não publicadas de uma pessoa específica
app.get("/user/:id/drafts", async (req, res) => {
  const { id } = req.params;

  const result = await prisma.user
    // .findUnique({
    //   where: { id: Number(id) },
    //   include: {
    //     posts: {
    //       where: {
    //         authorId: Number(id),
    //         published: false
    //       }
    //     }
    //   }
    // })
    .findUnique({
      where: {
        id: Number(id)
      }
    })
    .posts({
      where: {
        published: false,
      }
    })

  res.json(result);

});

//Busca uma postagem por ID.
app.get(`/post/:id`, async (req, res) => {
  const { id } = req.params;

  const result = await prisma.post.findUnique({
    where: {
      id: Number(id),
    }
  })

  res.json(result)
});

//
app.get("/feed", async (req, res) => {
  const { searchString, skip, take } = req.query;

  const or = searchString
    ? {
      OR: [
        {
          title: { contains: searchString as string },
        },
        {
          content: { contains: searchString as string },
        }
      ]
    }
    : {};

  const result = await prisma.post.findMany({
    where: {
      published: true,
      ...or,
    },
    skip: Number(skip) || undefined,
    take: Number(take) || undefined,
  })

  res.json(result)
});

app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
);
