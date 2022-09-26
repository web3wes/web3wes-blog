import Link from "next/link"
import { trpc } from "../../utils/trpc"
import Modal from "../../components/Modal"
import { EditPostInput } from "../../schema/post.schema"
import { useContext, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"

function PostListingPage() {
  const { data, isLoading } = trpc.useQuery(["posts.posts"])
  const [showModal, setShowModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState("")
  const [selectedTitle, setSelectedTitle] = useState("")
  const [selectedBody, setSelectedBody] = useState("")
  const { handleSubmit, register } = useForm<EditPostInput>()
  const router = useRouter()

  const { mutate, error } = trpc.useMutation(["posts.edit-post"], {
    onSuccess: ({ id }) => {
      router.push(`/posts/${id}`)
    },
  })

  function onSubmit(values: EditPostInput) {
    mutate({ body: selectedBody, title: selectedTitle, id: selectedPost })
  }

  function onModalOpen(post: EditPostInput) {
    setSelectedPost(post.id)
    setSelectedTitle(post.title)
    setSelectedBody(post.body)

    setShowModal(true)
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <div>
        {data?.map((post) => {
          return (
            <>
              <article key={post.id}>
                <p>{post.title}</p>

                <Link href={`/posts/${post.id}`}>Read post</Link>
                <button onClick={() => onModalOpen(post)}>Edit post</button>
              </article>

              <Modal
                onClose={() => setShowModal(false)}
                show={showModal}
                title={"Edit Post Modal"}
              >
                <form onSubmit={handleSubmit(onSubmit)}>
                  {error && error.message}

                  <h1>Create posts</h1>

                  <input
                    type="text"
                    placeholder="Your post title"
                    value={selectedTitle}
                    onChange={(e) => setSelectedTitle(e.target.value)}
                    // {...register("title")}
                  />
                  <br />
                  <textarea
                    placeholder="Your post title"
                    value={selectedBody}
                    onChange={(e) => setSelectedBody(e.target.value)}
                  />
                  <br />
                  <button>Edit post</button>
                </form>
              </Modal>
            </>
          )
        })}
      </div>
    </>
  )
}

export default PostListingPage
