import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';
import { SearchBar } from './SearchBar';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav
      className="sticky top-0 z-40 w-full"
      style={{
        background: 'rgba(2, 12, 27, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="px-6 h-16 flex items-center justify-between gap-6">
        {/* Search bar */}
        {isAuthenticated && (
          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>
        )}

        {/* User menu */}
        {isAuthenticated && user && (
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-white">{user.name}</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {user.career}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0"
                  style={{ background: 'transparent' }}
                >
                  <Avatar
                    className="h-10 w-10 border-2"
                    style={{ borderColor: '#FFD100', boxShadow: '0 0 10px rgba(255,209,0,0.3)' }}
                  >
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-[#003DA5] text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 border"
                align="end"
                forceMount
                style={{
                  background: 'rgba(2, 12, 27, 0.97)',
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                    <p className="text-xs leading-none" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.08)' }} />
                <DropdownMenuItem
                  onClick={() => navigate(`/profile/${user.id}`)}
                  className="cursor-pointer"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  <User className="mr-2 h-4 w-4 text-[#FFD100]" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate('/settings')}
                  className="cursor-pointer"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  <Settings className="mr-2 h-4 w-4 text-[#FFD100]" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator style={{ background: 'rgba(255,255,255,0.08)' }} />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
};
