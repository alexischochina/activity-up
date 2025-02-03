"use client";

import { CreateTypeActivite } from "@/actions/CreateTypeActivite";
import { useActionState } from 'react';
import {TypeActiviteError} from "@/types/TypeActiviteError";

export default function TypeActiviteForm() {
    const initialState: TypeActiviteError = { message: null, errors: {} };
    const [state, formAction] = useActionState<TypeActiviteError, FormData>(CreateTypeActivite, initialState);

    return (
        <form action={formAction}>
        <label htmlFor="type_name">Type d'activité : </label>
            <input
                type="text"
                name="type_name"
                id="type_name"
                placeholder="NextJS"
            />
            {/* show type_name errors */}
            {state.errors?.type_name &&
                state.errors.type_name.map((error: string) => (
                    <p style={{ color: "red" }} key={error}>
                        {error}
                    </p>
                ))}
            <br />
            <input type="submit" name="type_activite_add" value="Ajouter" />
            {/* show others errors */}
            {!state.errors && state.message && (
                <p style={{ color: "red" }} key={state.message}>
                    {state.message}
                </p>
            )}
        </form>
    );
}