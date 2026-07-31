import z from "zod";

export const logOutSchema={
    body:z.object({
        logoutOptions:z.enum(["all","single"])
    })
}