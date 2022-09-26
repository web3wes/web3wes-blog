import {
  createPostSchema,
  getSinglePostSchema,
  editPostSchema,
} from "../../schema/post.schema"
import * as trpc from "@trpc/server"
import { createRouter } from "../createRouter"

export const postRouter = createRouter()
  .mutation("create-post", {
    input: createPostSchema,
    async resolve({ ctx, input }) {
      if (!ctx.user) {
        new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Can not create a post while logged out",
        })
      }

      const post = await ctx.prisma.post.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.user?.id,
            },
          },
        },
      })

      return post
    },
  })
  .mutation("edit-post", {
    input: editPostSchema,
    async resolve({ ctx, input }) {
      if (!ctx.user) {
        new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Can not create a post while logged out",
        })
      }

      const post = await ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.user?.id,
            },
          },
        },
      })

      return post
    },
  })
  .query("posts", {
    resolve({ ctx }) {
      return ctx.prisma.post.findMany({
        orderBy: {
          createdAt: "asc",
        },
      })
    },
  })
  .query("single-post", {
    input: getSinglePostSchema,
    resolve({ input, ctx }) {
      return ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
      })
    },
  })
