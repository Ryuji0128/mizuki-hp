// 型を拡張
declare module "@mui/material/styles" {
  interface SimplePaletteColorOptions {
    pale?: string;
  }
  interface TypeBackground {
    dark?: string;
  }
  interface Theme {
    custom: {
      subTitle: {
        height: string;
        widthXs: number;
        widthSm: number;
        widthMd: number;
        widthLg: number;
      };
      header: {
        height: {
          mobile: number;
          desktop: number;
        };
      };
    };
  }

  // Themeの拡張でcustom項目が利用可能に
  interface ThemeOptions {
    custom?: {
      subTitle: {
        height: string;
        widthXs: number;
        widthSm: number;
        widthMd: number;
        widthLg: number;
      };
      header: {
        height: {
          mobile: number;
          desktop: number;
        };
      };
    };
  }
}

export const themeConstants = {
  palette: {
    primary: {
      pale: "#E5F0FF",
      light: "#A8C9F5",
      main: "#47D45A", //メインテーマの色
      dark: "#034092",
      contrastText: "#FFFFFF",
    },
    secondary: {
      pale: "#CDEBD3",
      light: "#61D5A8",
      main: "#14A37D",
      dark: "#0B5155",
      contrastText: "#FFFFFF",
    },
    info: {
      pale: "#FFFFFF",
      light: "#9D9D9D",
      main: "#4F4F4F",
      dark: "#121212",
    },
    warning: {
      pale: "#FFFAEA",
      light: "#FFEDB5",
      main: "#F2C94C",
      dark: "#BE9109",
    },
    error: {
      pale: "#FFEBEB",
      light: "#FFABAB",
      main: "#E15757",
      dark: "#A81A1A",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FAFAFA",
      dark: "#000000",
    },
  },


  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },
  },
  custom: {
    header: {
      // AppBarのデフォルトの高さを採用しているため、明示的に指定
      height: {
        mobile: 56,
        desktop: 64,
      },
    },
    subTitle: {
      height: "1rem",
      widthXs: 100,
      widthSm: 30,
      widthMd: 30,
      widthLg: 30,
    },
  },
};
