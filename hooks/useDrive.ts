import { useState } from "react";
import { signIn } from "next-auth/react";
import { StatusCodes } from "http-status-codes";

export const useDrive = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readData = async () => {
    setIsSyncing(true);
    setError(null);
    try {
      const response = await fetch("/api/drive");

      if (response.status === StatusCodes.UNAUTHORIZED) {
        console.warn("Session expired");
        return;
      }

      if (response.status === StatusCodes.NOT_FOUND) {
        return null;
      }

      if (!response.ok) throw new Error("Failed to read from Drive");

      const result = await response.json();

      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsSyncing(false);
    }
  };

  const saveData = async (data: any) => {
    setIsSyncing(true);
    setError(null);

    try {
      const response = await fetch("/api/drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        setError("Session expired. Redirecting to login...");
        signIn("google");
        return;
      }

      if (!response.ok) throw new Error("Failed to save to Drive");

      const body = await response.json();
      console.log(body);
      return body;
    } catch (error) {
      console.error(error);
      setError(error as string);
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteData = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch("/api/drive", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete file");

      return true;
    } catch (err: any) {
      console.error(err.message);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  return { saveData, readData, deleteData, isSyncing, error };
};
