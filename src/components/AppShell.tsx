'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';

// Wenn du AuthContext schon hast, nimm das:
// import { useAuth } from '@/context/AuthContext';

const drawerWidthCollapsed = 72;
const drawerWidthExpanded = 240;

type Props = {
  children: ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  isActive: (pathname: string) => boolean;
  requiresAdmin?: boolean;
};

export function AppShell({ children }: Props) {
  const pathname = usePathname();

  // State für ausfahrbare Sidebar
  const [open, setOpen] = useState(false);

  // Später: aus AuthContext holen
  // const { authenticated, hasRole } = useAuth();
  // const isAdmin = authenticated && hasRole('ADMIN');

  const isAdmin = false; // <- solange Auth noch nicht drin ist

  const items = useMemo<NavItem[]>(
    () => [
      {
        href: '/',
        label: 'Home',
        icon: <HomeIcon />,
        isActive: (p) => p === '/',
      },
      {
        href: '/books',
        label: 'Bücher',
        icon: <LibraryBooksIcon />,
        isActive: (p) => p.startsWith('/books'),
      },
      {
        href: '/books/new',
        label: 'Neues Buch',
        icon: <AddCircleOutlineIcon />,
        isActive: (p) => p.startsWith('/books/new'),
        requiresAdmin: true,
      },
    ],
    [],
  );

  // Nur Admin soll "Neues Buch" sehen
  const visibleItems = items.filter((i) => !i.requiresAdmin || isAdmin);

  const drawerWidth = open ? drawerWidthExpanded : drawerWidthCollapsed;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
          },
        }}
      >
        {/* Toolbar oben in der Sidebar */}
        <Toolbar
          sx={{
            justifyContent: open ? 'space-between' : 'center',
            px: 1,
          }}
        >
          {open && (
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Menü
            </Typography>
          )}

          <IconButton
            aria-label="toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>

        <List>
          {visibleItems.map((item) => {
            const selected = item.isActive(pathname);

            const button = (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                selected={selected}
                sx={{
                  py: 1.5,
                  justifyContent: open ? 'flex-start' : 'center',
                  px: open ? 2 : 0,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 0,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {/* Label nur im offenen Zustand */}
                {open && <ListItemText primary={item.label} />}
              </ListItemButton>
            );

            // Wenn geschlossen: Tooltip statt Text, damit UX gut bleibt
            return open ? (
              button
            ) : (
              <Tooltip key={item.href} title={item.label} placement="right">
                {button}
              </Tooltip>
            );
          })}
        </List>
      </Drawer>

      {/* Hauptbereich: Topbar + Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Buch-Web</Typography>

            <IconButton component={Link} href="/login" aria-label="login">
              <LoginIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flex: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
