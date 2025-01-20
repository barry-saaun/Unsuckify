"use client"
import { FieldErrors, useForm } from "react-hook-form"

import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "./ui/card"
import { Form, FormControl, FormField, FormItem } from "./ui/form"
import { Input } from "./ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Bounce, toast, ToastContainer } from "react-toastify"
import useDynamicBreakpointValue from "@/hooks/useDynamicBreakpointValue"
import { TOAST_BREAKPOINT_VALUES } from "@/constants/dynamicBreakpointValues"

const FormSchema = z.object({
  url: z
    .string()
    .regex(
      /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+(\?si=[a-zA-Z0-9]+)?$|^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+$/,
      { message: "Invalid Spotify Playlist URL." }
    )
})

function PulbicPlaylistTabContent() {
  const router = useRouter()
  const { value: toastWidth } = useDynamicBreakpointValue(
    TOAST_BREAKPOINT_VALUES
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: ""
    }
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const playlistUrlObject = FormSchema.safeParse(data)

    const playlistUrl = playlistUrlObject.data?.url
    const playlist_id = playlistUrl?.split("?si")[0].split("playlist/")[1]
    router.push(`/dashboard/${playlist_id}`)
  }

  const errorOnSubmit = (errors: FieldErrors<z.infer<typeof FormSchema>>) => {
    const errorMessage = errors?.url
    if (errorMessage) {
      toast.error(` 😩 ${errorMessage.message}`, {
        position: "top-center",
        theme: "colored",
        closeOnClick: true,
        transition: Bounce,
        autoClose: 2000
      })
    }
  }

  return (
    <div className="container flex flex-grow justify-center md:justify-start items-center w-full md:w-2/3  rounded-lg  ">
      <Card className="flex-grow">
        <CardHeader>
          <CardTitle className="text-2xl">
            Recommendation of a Public Playlist
          </CardTitle>
          <CardDescription>
            Enter a public Spotify playlist URL to get songs recommendation and
            JSON data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) =>
                errorOnSubmit(errors)
              )}
              className="flex  justify-between items-center space-x-5 "
            >
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="w-[90%]">
                    <FormControl>
                      <Input
                        placeholder="https://open.spotify.com/playlist/..."
                        className="font-medium text-sm"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="font-bold">
                UNSUCKify
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ToastContainer toastStyle={{ width: toastWidth }} />
    </div>
  )
}

export default PulbicPlaylistTabContent
