import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Search, X, User as UserIcon, BookOpen } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { MOCK_USERS, CAREERS } from '../data/mockData';
import { User } from '../types';

interface SearchResult {
  type: 'user' | 'career';
  data: User | string;
}

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const userResults: SearchResult[] = MOCK_USERS.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery) ||
        user.career.toLowerCase().includes(searchQuery),
    ).map((user) => ({ type: 'user' as const, data: user }));

    const careerResults: SearchResult[] = CAREERS.filter((career) =>
      career.toLowerCase().includes(searchQuery),
    ).map((career) => ({ type: 'career' as const, data: career }));

    setResults([...userResults, ...careerResults].slice(0, 8));
    setShowResults(true);
  }, [query]);

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    setQuery('');
    setShowResults(false);
  };

  const handleCareerClick = (career: string) => {
    navigate('/', { state: { selectedCareer: career } });
    setQuery('');
    setShowResults(false);
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-xl" ref={searchRef}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        />
        <input
          type="text"
          placeholder="Buscar usuarios, carreras..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-10 rounded-xl text-sm outline-none transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'white',
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'rgba(255,209,0,0.5)';
            (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.08)';
            if (query.length > 0) setShowResults(true);
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.12)';
            (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.06)';
          }}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {showResults && results.length > 0 && (
        <div
          className="absolute top-full mt-2 w-full rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50"
          style={{
            background: 'rgba(2, 12, 27, 0.97)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div className="p-2">
            {results.map((result, index) => (
              <React.Fragment key={index}>
                {result.type === 'user' ? (
                  <button
                    onClick={() => handleUserClick((result.data as User).id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left"
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        'rgba(255,255,255,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = '';
                    }}
                  >
                    <Avatar
                      className="h-10 w-10 border-2 flex-shrink-0"
                      style={{ borderColor: 'rgba(255,209,0,0.4)' }}
                    >
                      <AvatarImage
                        src={(result.data as User).avatar}
                        alt={(result.data as User).name}
                      />
                      <AvatarFallback className="bg-[#003DA5] text-white text-sm">
                        {getInitials((result.data as User).name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {(result.data as User).name}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                      >
                        {(result.data as User).career}
                      </p>
                    </div>
                    <UserIcon
                      className="h-4 w-4 flex-shrink-0"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => handleCareerClick(result.data as string)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        'rgba(255,255,255,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = '';
                    }}
                  >
                    <div className="h-10 w-10 bg-[#003DA5]/40 rounded-full flex items-center justify-center flex-shrink-0 border border-[#003DA5]/60">
                      <BookOpen className="h-5 w-5 text-[#FFD100]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {result.data as string}
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Filtrar por carrera
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs font-semibold flex-shrink-0"
                      style={{ background: '#FFD100', color: '#003DA5' }}
                    >
                      Carrera
                    </Badge>
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
