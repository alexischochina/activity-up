"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addActivite } from "./AddActivite";
import { ActiviteError } from "@/types/ActiviteError";

const ActiviteSchema = z.object({
    rowid: z.number(),
    activite_name: z.string().min(1).max(255),
    activite_level: z.enum(["1", "2", "3", "4", "5"]),
    user: z.number(),
});

const ZodCreateActivite = ActiviteSchema.omit({ rowid: true, user: true });

export async function CreateActivite(prevState: ActiviteError, formData: FormData) {
    try {
        const validatedFields = ZodCreateActivite.safeParse({
            activite_name: formData.get("activite_name"),
            activite_level: formData.get("activite_level"),
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Error, failed to add activite",
            };
        }

        const { activite_name, activite_level } = validatedFields.data;

        const add = await addActivite(activite_name, activite_level);

        if (!add.ok || add.status >= 300) {
            const { message } = await add.json();
            return {
                errors: { activite_name: [message] },
                message: message,
            };
        }
    } catch (error) {
        console.error(error);
        return {
            message: "An error occured",
        };
    }

    revalidatePath("/mon-compte/profil");
    redirect("/mon-compte/profil");
}