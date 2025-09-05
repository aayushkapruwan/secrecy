import { boolean, string, z } from "zod"

export const acceptingMessageInSchema = z.object({
    isAcceptingMessage:z.boolean()
})    