
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { NavItemType } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useBranch } from '../../contexts/BranchContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ClinicLogo, ArrowLeftOnRectangleIcon, ChevronDownIcon, BuildingOfficeIcon, SunIcon, MoonIcon, QuestionMarkCircleIcon } from '../icons/HeroIcons';

interface SidebarProps {
  navItems: NavItemType[];
}

const NavMenuItem: React.FC<{ item: NavItemType; isSubItem?: boolean }> = ({ item, isSubItem = false }) => {
  const location = useLocation();
  const isActive = item.path ? location.pathname.startsWith(item.path) : false;

  const navLinkClasses = `flex items-center space-x-3 rounded-md transition-colors duration-150 ease-in-out dark:text-slate-200 ${isSubItem
    ? `p-2 text-sm ${isActive ? 'bg-primary-light bg-opacity-90 font-medium text-white' : 'hover:bg-primary-light hover:bg-opacity-20 dark:hover:bg-slate-700'}`
    : `p-3 ${isActive ? 'bg-primary-light bg-opacity-90 font-medium text-white' : 'hover:bg-primary-light hover:bg-opacity-20 dark:hover:bg-slate-700'}`
    }`;

  return (
    <NavLink to={item.path!} className={navLinkClasses}>
      <item.icon className={isSubItem ? 'h-4 w-4' : 'h-5 w-5'} />
      <span>{item.label}</span>
    </NavLink>
  );
};

const CollapsibleNavMenu: React.FC<{ item: NavItemType, openMenus: Record<string, boolean>, toggleMenu: (label: string) => void }> = ({ item, openMenus, toggleMenu }) => {
  const location = useLocation();
  const isChildActive = item.children?.some(child => child.path && location.pathname.startsWith(child.path)) ?? false;
  const isOpen = openMenus[item.label] === true;

  return (
    <div>
      <button
        onClick={() => toggleMenu(item.label)}
        className={`w-full flex items-center justify-between p-3 rounded-md transition-colors duration-150 ease-in-out hover:bg-primary-light hover:bg-opacity-20 dark:text-slate-200 dark:hover:bg-slate-700 ${isChildActive && !isOpen ? 'bg-primary-light bg-opacity-40' : ''
          }`}
      >
        <div className="flex items-center space-x-3">
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </div>
        <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pl-6 pt-1 pb-1 space-y-1 mt-1">
          {item.children?.map(child => (
            <NavMenuItem key={child.label} item={child} isSubItem={true} />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
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
  }, [location, navItems]);

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = e.target.value;
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      selectBranch(branch);
    }
  };

  return (
    <aside className="w-64 bg-primary-dark text-white flex flex-col shadow-lg print:hidden dark:bg-slate-800 dark:border-r dark:border-slate-700">
      <div className="p-6 flex items-center space-x-2 border-b border-primary-light border-opacity-30 dark:border-slate-700">
        <ClinicLogo className="h-10 w-10 text-white" />
        <h1 className="text-xl font-semibold">Equipe Rafael Barros</h1>
      </div>

      {user?.role === 'ADMIN' && !branchesLoading && (
        <div className="p-4 border-b border-primary-light border-opacity-30 dark:border-slate-700">
          <label htmlFor="branch-selector" className="text-xs font-semibold text-primary-light dark:text-slate-400 opacity-80 mb-1 block uppercase">
            Filial Ativa
          </label>
          <div className="relative">
            <BuildingOfficeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-primary-light dark:text-slate-400 pointer-events-none" />
            <select
              id="branch-selector"
              value={selectedBranch?.id || ''}
              onChange={handleBranchChange}
              className="w-full bg-primary dark:bg-slate-700 text-white pl-10 pr-8 py-2 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary-light text-sm"
              aria-label="Selecionar filial"
            >
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-primary-light dark:text-slate-400 pointer-events-none" />
          </div>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) =>
          item.children ? (
            <CollapsibleNavMenu key={item.label} item={item} openMenus={openMenus} toggleMenu={toggleMenu} />
          ) : (
            <NavMenuItem key={item.label} item={item} />
          )
        )}
      </nav>

      {user && (
        <div className="p-3 border-t border-primary-light border-opacity-30 dark:border-slate-700">
          {/* Help/Manual Link */}
          <NavLink
            to="/manual"
            className={({ isActive }) => `flex items-center space-x-3 p-3 mb-2 rounded-md transition-colors duration-150 ease-in-out ${isActive ? 'bg-primary-light bg-opacity-90 text-white' : 'text-primary-light hover:bg-primary-light hover:bg-opacity-20 dark:text-slate-400 dark:hover:bg-slate-700'}`}
          >
            <QuestionMarkCircleIcon className="h-5 w-5" />
            <span>Manual do Sistema</span>
          </NavLink>

          <div className="flex justify-between items-center px-2 py-1 mb-2">
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-primary-light opacity-80 dark:text-slate-400">{user.role === 'ADMIN' ? 'Administrador' : 'Terapeuta'}</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-primary-light hover:bg-opacity-20 dark:hover:bg-slate-600 transition-colors"
              aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 p-3 rounded-md transition-colors duration-150 ease-in-out bg-primary-dark dark:bg-slate-700 hover:bg-red-600"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      )}

      <div className="p-4 border-t border-primary-light border-opacity-30 dark:border-slate-700">
        <p className="text-xs text-center text-primary-light opacity-70 dark:text-slate-400">© 2024 Equipe Rafael Barros</p>
      </div>
    </aside>
  );
};

export default Sidebar;
