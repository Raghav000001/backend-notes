
import z from "zod";

export const userRegistrationValidatorSchema = z.object({
    fullName : z.string().min(5,"min.. 5 letters").max(20,"max is 20"),
    userName :z.string().min(3).max(20),
    email:z.string().email().toLowerCase(),
    password:z.string().min(5).max(50)
})





