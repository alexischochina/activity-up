"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addTypeActivite } from "./AddTypeActivite";
import {TypeActiviteError} from "@/types/TypeActiviteError";
import {log} from "node:util";

const TypeActiviteSchema = z.object({
    rowid: z.number(),
    type_name: z.string().min(1).max(255),
});

const ZodCreateTypeActivite = TypeActiviteSchema.omit({ rowid: true });

export async function CreateTypeActivite(prevState: TypeActiviteError, formData: FormData) {
    try {
        const validatedFields = ZodCreateTypeActivite.safeParse({
            type_name: formData.get("type_name"),
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Error, failed to add activite type",
            };
        }

        const { type_name } = validatedFields.data;

        const add = await addTypeActivite(type_name);

        if (!add.ok || add.status >= 300) {
            const { message } = await add.json();
            return {
                errors: { type_name: [message] },
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