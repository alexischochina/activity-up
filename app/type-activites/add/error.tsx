"use client";

import { useEffect } from "react";

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <>
            <h1>Erreur :</h1>
            <p>{error.message}</p>
            <button onClick={reset}>Retour</button>
        </>
    );
}