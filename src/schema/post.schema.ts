import z from "zod"

export const createPostSchema = z.object({
  title: z.string().max(256, "Max title length is 356"),
  body: z.string().min(10),
})

export const editPostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(256, "Max title length is 356"),
  body: z.string().min(10),
})

export type EditPostInput = z.TypeOf<typeof editPostSchema>

export type CreatePostInput = z.TypeOf<typeof createPostSchema>

export const getSinglePostSchema = z.object({
  postId: z.string().uuid(),
})
