import { useState, FormEvent } from "react";
import PasswordInput from "@/frontend/components/common/PasswordInput";

interface LoginFormProps {
  onSubmit: (formData: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => void;
  isSubmitting: boolean;
}

export default function LoginForm({ onSubmit, isSubmitting }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, rememberMe });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Adres email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="twoj@email.com"
        />
      </div>

      <PasswordInput
        id="password"
        label="Hasło"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Twoje hasło"
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span className="ml-2 block text-sm text-gray-700">
            Zapamiętaj mnie
          </span>
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-primary text-white py-2 px-4 rounded-md transition-colors ${
            isSubmitting
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-primary/90"
          }`}
          style={{ backgroundColor: "#1e50a0" }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Logowanie...
            </span>
          ) : (
            "Zaloguj się"
          )}
        </button>
      </div>
    </form>
  );
}
