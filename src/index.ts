import { Post, prisma, User } from "@prisma/client";
import { ApolloServer } from "apollo-server";
import { DateTimeResolver } from "graphql-scalars";
import { title } from "process";
import { Context, context } from "./context";

const typeDefs = `
type Query {
  allUsers: [User!]!
  postById(id: Int!): Post
  feed(searchString: String, skip: Int, take: Int): [Post!]!
  draftsByUser(id: Int!): [Post]
}

type Mutation {
  signupUser(name: String, email: String!): User!
  createDraft(title: String!, content: String, authorEmail: String): Post
  incrementPostViewCount(id: Int!): Post
  deletePost(id: Int!): Post
}

type User {
  id: Int!
  email: String!
  name: String
  posts: [Post!]!
}

type Post {
  id: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  title: String!
  content: String
  published: Boolean!
  viewCount: Int!
  author: User
}

scalar DateTime
`;

const resolvers = {
  Query: {
    //Busca todos os objetos do tipo User
    allUsers: (_parent, _args, context: Context) => {
      return context.prisma.user.findMany();
    },
    //Busca uma postagem por ID
    postById: (_parent, args: { id: number }, context: Context) => {
      return context.prisma.post.findUnique({
        where: {
          id: args.id
        }
      })
    },
    //Busca todas as postagens publicadas. Quando receber os parâmetros skip e take, faça paginação. 
    //Quando receber o parâmetro searchString, pesquise a string no título ou conteúdo da postagem.
    feed: (
      _parent,
      args: {
        searchString: string | undefined;
        skip: number | undefined;
        take: number | undefined;
      },
      context: Context
    ) => {
      return context.prisma.post.findMany({
        where: {
          published: true,
          OR: [
            { title:   { contains: args.searchString as string } },
            { content: { contains: args.searchString as string } }
          ]
        },
        skip: Number(args.skip) || undefined,
        take: Number(args.take) || undefined,
      })
    },
    //Busca as postagens não publicadas de uma pessoa específica
    draftsByUser: (_parent, args: { id: number }, context: Context) => {
      return context.prisma.post.findMany({
        where: {
          published: false,
          authorId: args.id,
        }
      })
    },
  },
  Mutation: {
    //Cria um objeto do tipo User
    signupUser: (
      _parent,
      args: { name: string | undefined; email: string },
      context: Context
    ) => {
      return context.prisma.user.create({
        data: {
          email: args.email,
          name: args.name,
        }
      })
    },
    //Cria um objeto do tipo Post
    createDraft: (
      _parent,
      args: { title: string; content: string | undefined; authorEmail: string },
      context: Context
    ) => {
      return context.prisma.post.create({
        data: {
          title:   args.title,
          content: args.content,
          author: {
            connect: {
              email: args.authorEmail,
            }
          }
        }
      })
    },
    //Aumenta as visualizações de uma postagem em 1
    incrementPostViewCount: (
      _parent,
      args: { id: number },
      context: Context
    ) => {
      return context.prisma.post.update({
        data: {
          viewCount: {
            increment: 1
          }
        },
        where: { id: Number(args.id) }
      })
    },
    //Deleta uma postagem
    deletePost: (_parent, args: { id: number }, context: Context) => {
      return context.prisma.post.delete({
        where: { id: args.id }
      })
    },
  },
  Post: {
    author: (parent: Post, _args, context: Context) => {
      return context.prisma.user.findUnique({
        where: {
          id: Number(parent.authorId)
        }
      });
    },
  },
  User: {
    posts: (parent: User, _args, context: Context) => {
      return context.prisma.post.findMany({
        where: {
          authorId: parent.id,
        }
      })
    },
  },
  DateTime: DateTimeResolver,
};

const server = new ApolloServer({ typeDefs, resolvers, context });
server.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at: http://localhost:4000`)
);
