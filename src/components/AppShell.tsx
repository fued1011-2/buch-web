'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Box,
  Button,
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
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Person2 } from '@mui/icons-material';

import { useAuth } from '../context/AuthContext';

const drawerWidthCollapsed = 72;
const drawerWidthExpanded = 240;

const sidebarBg = '#044878';

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  const pathname = usePathname();
  const { authenticated, user, logout, isAdmin } = useAuth();

  const [open, setOpen] = useState(false);

  const drawerWidth = open ? drawerWidthExpanded : drawerWidthCollapsed;

  const isHomeSelected = pathname === '/';
  const isNewSelected = pathname.startsWith('/books/new');
  // "Suche" soll /books* selektieren, aber nicht /books/new (damit nicht beide gleichzeitig "aktiv" sind)
  const isSearchSelected = pathname.startsWith('/books') && !isNewSelected;

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
            bgcolor: sidebarBg,
            color: 'white',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
          },
        }}
      >
        <Toolbar
          sx={{
            justifyContent: open ? 'space-between' : 'center',
            px: 1,
          }}
        >
          {open && (
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white' }}>
              Menü
            </Typography>
          )}

          <IconButton
            aria-label="toggle menu"
            onClick={() => setOpen((v) => !v)}
            sx={{ color: 'white' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>

        <List
          sx={{
            '& .MuiListItemIcon-root': { color: 'white' },
            '& .MuiListItemText-primary': { color: 'white', fontWeight: 600 },

            '& .MuiListItemButton-root.Mui-selected': {
              bgcolor: 'rgba(255,255,255,0.16)',
            },
            '& .MuiListItemButton-root.Mui-selected:hover': {
              bgcolor: 'rgba(255,255,255,0.22)',
            },
            '& .MuiListItemButton-root:hover': {
              bgcolor: 'rgba(255,255,255,0.10)',
            },
          }}
        >
          {/* Home */}
          {open ? (
            <ListItemButton component={Link} href="/" selected={isHomeSelected} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          ) : (
            <Tooltip title="Home" placement="right">
              <ListItemButton
                component={Link}
                href="/"
                selected={isHomeSelected}
                sx={{ justifyContent: 'center', py: 1.8 }}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <HomeIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          )}

          {/* Suche */}
          {open ? (
            <ListItemButton component={Link} href="/books" selected={isSearchSelected} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Suche" />
            </ListItemButton>
          ) : (
            <Tooltip title="Suche" placement="right">
              <ListItemButton
                component={Link}
                href="/books"
                selected={isSearchSelected}
                sx={{ justifyContent: 'center', py: 1.8 }}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <SearchIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          )}

          {authenticated && isAdmin ? (
            open ? (
              <ListItemButton
                component={Link}
                href="/books/new"
                selected={isNewSelected}
                sx={{ py: 1.5, px: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                  <AddCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Neu anlegen" />
              </ListItemButton>
            ) : (
              <Tooltip title="Neu anlegen" placement="right">
                <ListItemButton
                  component={Link}
                  href="/books/new"
                  selected={isNewSelected}
                  sx={{ justifyContent: 'center', py: 1.8 }}
                >
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    <AddCircleOutlineIcon />
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            )
          ) : null}
        </List>
      </Drawer>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: 'white',
            color: 'black',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            zIndex: (theme) => theme.zIndex.drawer + 1,

            ml: `${drawerWidth}px`,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: (theme) =>
              theme.transitions.create(['width', 'margin-left'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MenuBookIcon sx={{ color: '#044878' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Buch-Web
              </Typography>
            </Box>

            {authenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person2/>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  Hallo, {user?.username}
                </Typography>
                <Button
                  onClick={logout}
                  startIcon={<LogoutIcon />}
                  sx={{ textTransform: 'none', fontWeight: 700, color: 'black' }}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <Button
                component={Link}
                href="/login"
                startIcon={<LoginIcon />}
                sx={{ textTransform: 'none', fontWeight: 700, color: 'black' }}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Toolbar />

        <Box component="main" sx={{ flex: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
