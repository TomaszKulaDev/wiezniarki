import { useState, FormEvent } from "react";

interface ProfileFilterProps {
  onFilter: (filters: {
    minAge?: number;
    maxAge?: number;
    facility?: string;
    interests?: string[];
    releaseDate?: { before?: Date; after?: Date };
  }) => void;
}

export default function ProfileFilter({ onFilter }: ProfileFilterProps) {
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [facility, setFacility] = useState<string>("");
  const [interests, setInterests] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const filters: {
      minAge?: number;
      maxAge?: number;
      facility?: string;
      interests?: string[];
      releaseDate?: { before?: Date; after?: Date };
    } = {};

    if (minAge) filters.minAge = parseInt(minAge);
    if (maxAge) filters.maxAge = parseInt(maxAge);
    if (facility) filters.facility = facility;
    if (interests)
      filters.interests = interests.split(",").map((i) => i.trim());

    onFilter(filters);
  };

  const handleReset = () => {
    setMinAge("");
    setMaxAge("");
    setFacility("");
    setInterests("");

    onFilter({});
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filtry</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-500"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="min-age"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Minimalny wiek
            </label>
            <input
              type="number"
              id="min-age"
              min="18"
              max="100"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="max-age"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Maksymalny wiek
            </label>
            <input
              type="number"
              id="max-age"
              min="18"
              max="100"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="facility"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Zakład karny
            </label>
            <input
              type="text"
              id="facility"
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              placeholder="np. Warszawa"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="interests"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Zainteresowania (oddzielone przecinkiem)
            </label>
            <input
              type="text"
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="np. sztuka, literatura, muzyka"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex space-x-4 pt-2">
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              Zastosuj
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Resetuj
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
