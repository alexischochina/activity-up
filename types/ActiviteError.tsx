export type ActiviteError = {
    errors?: {
        activite_name?: string[];
        activite_level?: string[];
    };
    message?: string | null;
};