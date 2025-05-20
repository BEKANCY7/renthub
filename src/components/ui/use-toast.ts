import { useCallback } from "react";

// Minimal toast implementation using window.alert as a placeholder
// Replace with a real toast library or your own UI as needed
export function useToast() {
    const toast = useCallback(({ title, description, variant }: { title: string; description?: string; variant?: string }) => {
        // You can replace this with a real toast UI
        window.alert(`${title}${description ? ": " + description : ""}`);
    }, []);

    return { toast };
} 