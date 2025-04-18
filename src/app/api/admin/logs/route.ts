import { NextRequest, NextResponse } from "next/server";
import {
  AuthenticatedRequest,
  roleMiddleware,
} from "@/backend/middlewares/authMiddleware";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);
const readDirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

// Ścieżka do katalogu z logami
const logsDirectory =
  process.env.LOGS_DIRECTORY || path.join(process.cwd(), "logs");

// Handler pobierający listę plików z logami
async function getLogsHandler(
  req: AuthenticatedRequest
): Promise<NextResponse> {
  try {
    // Sprawdź parametr - nazwę pliku
    const searchParams = new URL(req.url).searchParams;
    const filename = searchParams.get("filename");

    // Jeśli podano nazwę pliku, zwróć jego zawartość
    if (filename) {
      const sanitizedFilename = filename.replace(/\.\./g, ""); // Zapobieganie atakom typu path traversal
      const filePath = path.join(logsDirectory, sanitizedFilename);

      try {
        // Sprawdź czy plik istnieje
        await statAsync(filePath);

        // Odczytaj zawartość pliku
        const fileContent = await readFileAsync(filePath, "utf8");

        // Limit do ostatnich X linii, aby uniknąć zbyt dużych odpowiedzi
        const lines = fileContent.split("\n");
        const maxLines = 1000;
        const limitedContent = lines
          .slice(Math.max(0, lines.length - maxLines))
          .join("\n");

        return NextResponse.json({
          filename: sanitizedFilename,
          content: limitedContent,
        });
      } catch (error) {
        return NextResponse.json(
          { message: "Nie można odczytać pliku z logami" },
          { status: 404 }
        );
      }
    }

    // W przeciwnym razie zwróć listę dostępnych plików z logami
    try {
      // Sprawdź czy katalog istnieje
      await statAsync(logsDirectory);

      // Odczytaj zawartość katalogu
      const files = await readDirAsync(logsDirectory);

      // Pobierz informacje o każdym pliku
      const fileInfo = await Promise.all(
        files
          .filter((file) => file.endsWith(".log")) // Filtruj tylko pliki logów
          .map(async (file) => {
            const filePath = path.join(logsDirectory, file);
            const stats = await statAsync(filePath);
            return {
              name: file,
              size: stats.size,
              modified: stats.mtime,
            };
          })
      );

      // Sortuj pliki według daty modyfikacji (najnowsze na górze)
      fileInfo.sort((a, b) => b.modified.getTime() - a.modified.getTime());

      return NextResponse.json(fileInfo);
    } catch (error) {
      return NextResponse.json(
        { message: "Nie można odczytać katalogu z logami" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Błąd podczas pobierania logów:", error);
    return NextResponse.json(
      { message: "Wystąpił błąd podczas pobierania logów" },
      { status: 500 }
    );
  }
}

// Pobierz listę plików z logami
export function GET(request: NextRequest) {
  return roleMiddleware(request as AuthenticatedRequest, getLogsHandler, [
    "admin",
  ]);
}
