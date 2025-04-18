"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/frontend/components/admin/AdminLayout";
import { useGetCurrentUserQuery } from "@/frontend/store/apis/authApi";

// Interfejs dla plików logów
interface LogFile {
  name: string;
  size: number;
  modified: string;
}

export default function AdminLogsPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();

  const [logFiles, setLogFiles] = useState<LogFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [logContent, setLogContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Przekieruj, jeśli użytkownik nie jest administratorem
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Pobierz listę plików logów
  useEffect(() => {
    const fetchLogFiles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/admin/logs");

        if (!response.ok) {
          throw new Error("Błąd podczas pobierania listy plików logów");
        }

        const data = await response.json();
        setLogFiles(data);
      } catch (error) {
        console.error("Błąd pobierania listy plików logów:", error);
        setError(
          "Wystąpił błąd podczas pobierania listy plików logów. Spróbuj odświeżyć stronę."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchLogFiles();
    }
  }, [user]);

  // Pobierz zawartość wybranego pliku logów
  useEffect(() => {
    const fetchLogContent = async () => {
      if (!selectedFile) {
        setLogContent("");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/admin/logs?filename=${selectedFile}`
        );

        if (!response.ok) {
          throw new Error("Błąd podczas pobierania zawartości pliku logów");
        }

        const data = await response.json();
        setLogContent(data.content);
      } catch (error) {
        console.error("Błąd pobierania zawartości pliku logów:", error);
        setError(
          "Wystąpił błąd podczas pobierania zawartości pliku logów. Spróbuj ponownie."
        );
        setLogContent("");
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === "admin" && selectedFile) {
      fetchLogContent();
    }
  }, [user, selectedFile]);

  // Formatuj rozmiar pliku
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Wybierz plik logów
  const handleSelectFile = (fileName: string) => {
    setSelectedFile(fileName);
  };

  if (userLoading || (isLoading && !logFiles.length)) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (user && user.role !== "admin") {
    return null; // Zabezpieczenie przed renderowaniem strony dla nie-administratorów
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Logi systemowe</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lista plików logów */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-3">Pliki logów</h2>

              {logFiles.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Brak dostępnych plików logów
                </p>
              ) : (
                <ul className="space-y-2">
                  {logFiles.map((file) => (
                    <li key={file.name}>
                      <button
                        onClick={() => handleSelectFile(file.name)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedFile === file.name
                            ? "bg-blue-50 text-blue-700"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="font-medium">{file.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatFileSize(file.size)} •{" "}
                          {new Date(file.modified).toLocaleString()}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Zawartość pliku logów */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4 h-[70vh] flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">
                  {selectedFile ? selectedFile : "Zawartość logów"}
                </h2>
                {selectedFile && (
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Zamknij
                  </button>
                )}
              </div>

              <div className="overflow-auto flex-grow font-mono text-xs bg-gray-50 p-3 rounded">
                {isLoading && selectedFile ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : !selectedFile ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Wybierz plik logów z listy po lewej stronie
                  </div>
                ) : logContent ? (
                  <pre className="whitespace-pre-wrap break-words">
                    {logContent}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Brak zawartości w wybranym pliku logów
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
