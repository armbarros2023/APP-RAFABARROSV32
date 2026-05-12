import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { NavItemType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useBranch } from '@/contexts/BranchContext';
import { useTheme } from '@/contexts/ThemeContext';
import BrandLogo from '../branding/BrandLogo';
import {
  ArrowLeftOnRectangleIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  MoonIcon,
  QuestionMarkCircleIcon,
  SunIcon,
  XMarkIcon,
} from '../icons/HeroIcons';

interface SidebarProps {
  navItems: NavItemType[];
  isOpen: boolean;
  onClose: () => void;
}

interface NavMenuItemProps {
  item: NavItemType;
  isSubItem?: boolean;
  onNavigate: () => void;
}

const NavMenuItem: React.FC<NavMenuItemProps> = ({ item, isSubItem = false, onNavigate }) => {
  const location = useLocation();
  const isActive = item.path ? location.pathname.startsWith(item.path) : false;

  return (
    <NavLink
      to={item.path!}
      onClick={onNavigate}
      className={`group flex items-center gap-3 rounded-2xl border transition-all duration-200 ${
        isSubItem
          ? `px-3 py-2 text-sm ${
              isActive
                ? 'border-white/20 bg-white/14 text-white shadow-lg'
                : 'border-transparent text-slate-300/90 hover:border-white/10 hover:bg-white/7 hover:text-white'
            }`
          : `px-4 py-3 ${
              isActive
                ? 'border-white/20 bg-white/14 text-white shadow-lg'
                : 'border-transparent text-slate-200/90 hover:border-white/10 hover:bg-white/7 hover:text-white'
            }`
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-xl ${
          isSubItem
            ? 'h-8 w-8 bg-white/6 text-slate-100'
            : isActive
              ? 'h-10 w-10 bg-gradient-to-br from-secondary/70 to-accent/70 text-white'
              : 'h-10 w-10 bg-white/6 text-slate-200'
        }`}
      >
        <item.icon className={isSubItem ? 'h-4 w-4' : 'h-5 w-5'} />
      </span>
      <span className="min-w-0 flex-1 font-medium">{item.label}</span>
    </NavLink>
  );
};

interface CollapsibleNavMenuProps {
  item: NavItemType;
  openMenus: Record<string, boolean>;
  toggleMenu: (label: string) => void;
  onNavigate: () => void;
}

const CollapsibleNavMenu: React.FC<CollapsibleNavMenuProps> = ({ item, openMenus, toggleMenu, onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isChildActive = item.children?.some(child => child.path && location.pathname.startsWith(child.path)) ?? false;
  const isOpen = openMenus[item.label] === true;
  const defaultPath = item.path ?? item.children?.find(child => child.path)?.path;

  const handleOpenDefault = () => {
    if (!defaultPath) {
      toggleMenu(item.label);
      return;
    }

    if (!isOpen) {
      toggleMenu(item.label);
    }
    navigate(defaultPath);
    onNavigate();
  };

  return (
    <div className="space-y-1">
      <div
        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
          isChildActive
            ? 'border-white/18 bg-white/10 text-white'
            : 'border-transparent text-slate-200/90 hover:border-white/10 hover:bg-white/6 hover:text-white'
        }`}
      >
        <button
          type="button"
          onClick={handleOpenDefault}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/6 text-slate-100">
            <item.icon className="h-5 w-5" />
          </span>
          <span className="truncate font-medium">{item.label}</span>
        </button>
        <button
          type="button"
          onClick={() => toggleMenu(item.label)}
          className="ml-2 rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-expanded={isOpen}
          aria-label={`${isOpen ? 'Recolher' : 'Expandir'} ${item.label}`}
        >
          <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {isOpen && (
        <div className="space-y-1 pl-3">
          {item.children?.map(child => (
            <NavMenuItem key={child.label} item={child} isSubItem={true} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ navItems, isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { branches, selectedBranch, selectBranch, loading: branchesLoading } = useBranch();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const activeMenu = navItems.find(item =>
      item.children?.some(child => child.path && location.pathname.startsWith(child.path))
    );
    if (activeMenu && !openMenus[activeMenu.label]) {
      setOpenMenus(prev => ({ ...prev, [activeMenu.label]: true }));
    }
  }, [location.pathname, navItems, openMenus]);

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = e.target.value;
    const branch = branches.find(item => item.id === branchId);
    if (branch) {
      selectBranch(branch);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-4 left-4 z-40 flex w-[288px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[30px] border border-white/12 bg-slate-950/92 p-3 text-white shadow-[0_30px_80px_-28px_rgba(2,8,23,0.95)] backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-[120%]'
        }`}
      >
        <div className="flex items-start justify-between rounded-[24px] border border-white/10 bg-gradient-to-br from-primary/30 via-primary-dark/35 to-slate-950 p-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary-light/90">
              Plataforma Clinica
            </p>
            <BrandLogo className="mt-3 h-20 w-auto max-w-[220px]" />
            <div>
              <p className="mt-3 text-sm text-slate-300">Operacao premium com leitura simples e rapida.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/12 hover:text-white lg:hidden"
            aria-label="Fechar menu"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {user?.role === 'ADMIN' && !branchesLoading && branches.length > 0 && (
          <div className="mt-4 rounded-[24px] border border-white/10 bg-white/5 p-4">
            <label htmlFor="branch-selector" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Unidade ativa
            </label>
            <div className="relative">
              <BuildingOfficeIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-light" />
              <select
                id="branch-selector"
                value={selectedBranch?.id || ''}
                onChange={handleBranchChange}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900/85 py-3 pl-11 pr-10 text-sm text-white outline-none transition focus:border-secondary-light/60 focus:ring-4 focus:ring-secondary-light/10"
                aria-label="Selecionar filial"
              >
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id} className="bg-slate-900 text-white">
                    {branch.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        )}

        <div className="mt-5 flex-1 overflow-y-auto pr-1">
          <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Navegacao
          </div>
          <nav className="space-y-1.5">
            {navItems.map(item =>
              item.children ? (
                <CollapsibleNavMenu
                  key={item.label}
                  item={item}
                  openMenus={openMenus}
                  toggleMenu={toggleMenu}
                  onNavigate={onClose}
                />
              ) : (
                <NavMenuItem key={item.label} item={item} onNavigate={onClose} />
              )
            )}
          </nav>
        </div>

        {user && (
          <div className="mt-4 space-y-3 rounded-[24px] border border-white/10 bg-white/5 p-4">
            <NavLink
              to="/manual"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                  isActive
                    ? 'border-white/18 bg-white/14 text-white'
                    : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/6 hover:text-white'
                }`
              }
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/6">
                <QuestionMarkCircleIcon className="h-5 w-5" />
              </span>
              <span className="font-medium">Manual do sistema</span>
            </NavLink>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/55 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                  {user.role === 'ADMIN' ? 'Administrador' : 'Terapeuta'}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:border-white/16 hover:bg-white/10 hover:text-white"
                aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
              >
                {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-gradient-to-r from-white/10 to-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-red-400/40 hover:bg-red-500/15"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              Sair
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
