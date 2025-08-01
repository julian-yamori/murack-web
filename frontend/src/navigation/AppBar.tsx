import { useState } from "react";
import {
  AppBar as MuiAppBar,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import { NavigationMenu } from "./NavigationMenu.tsx";

export const AppBar: React.FC = () => {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <MuiAppBar position="sticky">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => setMenuOpened(true)}
        >
          <MenuIcon />
        </IconButton>

        <IconButton
          size="large"
          color="inherit"
          aria-label="back"
          sx={{ mr: 2 }}
          onClick={() => {}}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h4">Murack Web</Typography>

        <Drawer open={menuOpened} onClose={() => setMenuOpened(false)}>
          <NavigationMenu />
        </Drawer>
      </Toolbar>
    </MuiAppBar>
  );
};
