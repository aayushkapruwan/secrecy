import { string, z } from "zod"

export const messageSchema = z.object({
    content: z.string()
        .min(10, {
            message: "message must be atleast of 10 characters"
        })
        .max(100,
            {
                message: "message can be of atmost 100 characters"
            }
        )
})    