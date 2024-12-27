import { ScrollArea } from "@radix-ui/react-scroll-area"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "./ui/card"
import CodeGenerationEffect, {
  CodeGenerationProps
} from "./CodeGenSyntaxHighlight"
import { Fragment } from "react"

type PlaylistJsonDataScrollProps = CodeGenerationProps & {
  customButton?: React.ReactNode
}

const PlaylistJsonDataScroll = ({
  fullCode,
  renderMsPerBatch,
  batchSize,
  customButton
}: PlaylistJsonDataScrollProps) => {
  return (
    <Card>
      <CardHeader>
        {" "}
        <CardTitle>JSON Playlist Data</CardTitle>
        <CardDescription>
          Copy the JSON data with a predefined prompt to manually use it in your
          preferred AI chatbox, in case our recommendation feature is not
          needed.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-start space-y-5">
        <ScrollArea
          className="h-[400px] w-full rounded-md border p-4"
          style={{
            overflowY: "auto",
            maxHeight: "400px"
          }}
        >
          <div className="h-full">
            <CodeGenerationEffect
              fullCode={fullCode}
              renderMsPerBatch={renderMsPerBatch}
              batchSize={batchSize}
            />
          </div>
        </ScrollArea>
        {customButton && <Fragment>{customButton}</Fragment>}
      </CardContent>
    </Card>
  )
}

export default PlaylistJsonDataScroll
