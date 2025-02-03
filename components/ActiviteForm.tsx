"use client";

import { CreateActivite } from "@/actions/CreateActivite";
import { useActionState } from 'react';
import {ActiviteError} from "@/types/ActiviteError";

export default function ActiviteForm() {
    const initialState: ActiviteError = { message: null, errors: {} };
    const [state, formAction] = useActionState<ActiviteError, FormData>(CreateActivite, initialState);

    return (
        <form action={formAction}>
        <label htmlFor="activite_name">Compétence : </label>
            <input
                type="text"
                name="activite_name"
                id="activite_name"
                placeholder="NextJS"
            />
            {/* show activite_name errors */}
            {state.errors?.activite_name &&
                state.errors.activite_name.map((error: string) => (
                    <p style={{ color: "red" }} key={error}>
                        {error}
                    </p>
                ))}
            <br />
            <label htmlFor="activite_level">Niveau : </label>
            <br />
            <input
                type="range"
                name="activite_level"
                id="activite_level"
                min="1"
                max="5"
                step="1"
            />
            {/* show activite_level errors */}
            {state.errors?.activite_level &&
                state.errors.activite_level.map((error: string) => (
                    <p style={{ color: "red" }} key={error}>
                        {error}
                    </p>
                ))}
            <br />
            <input type="submit" name="activite_add" value="Ajouter" />
            {/* show others errors */}
            {!state.errors && state.message && (
                <p style={{ color: "red" }} key={state.message}>
                    {state.message}
                </p>
            )}
        </form>
    );
}