import { useEffect, useState } from "react";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { Button, Menu, MenuItem, ListItemIcon, Tooltip } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useDispatch, useSelector } from "react-redux";
import { selectTranslationLanguage, updateTranslation } from "@/reducers/translation/translation";
import { theme } from "@/theme";

const COOKIE_NAME = "googtrans";

interface LanguageDescriptor {
  name: string;
  title: string;
}

interface LanguageSwitcherProps {
  mobile?: boolean;
}

const LanguageConfig = {
  languages: [
      { title: "english", name: "en" },
      { title: "deutsch", name: "de" },
      { title: "español", name: "es" },
      { title: "हिन्दी", name: "hi" },
      { title: "français", name: "fr" },
      { title: "italiano", name: "it" },
      { title: "português", name: "pt" },
      { title: "română", name: "ro" },
      { title: "русский", name: "ru" },
      { title: "türkçe", name: "tr" },
      { title: "tiếng việt", name: "vi" },
      { title: "中文 (简体)", name: "zh-CN" },
      { title: "中文 (繁體)", name: "zh-TW" },
      { title: "日本語", name: "ja" },
      { title: "한국어", name: "ko" },
      { title: "العربية", name: "ar" },
      { title: "বাংলা", name: "bn" },
      { title: "українська", name: "uk" },
  ],
  defaultLanguage: "en",
}

const LanguageSwitcher = ({ mobile }: LanguageSwitcherProps) => {
  const dispatch = useDispatch()
  const currentLanguage = useSelector(selectTranslationLanguage)

  const setCookieSafe = (lang: string) => {
    // remove any existing googtrans cookies
    destroyCookie(null, COOKIE_NAME, { path: '/' });
    destroyCookie(null, COOKIE_NAME, { domain: '.gigo.dev', path: '/' });

    // set the new cookie
    setCookie(null, COOKIE_NAME, `/auto/${lang}`, {
      path: '/',
      domain: '.gigo.dev',
      secure: true,
      sameSite: 'strict'
    });
  }

  useEffect(() => {
    const cookies = parseCookies()
    const existingLanguageCookieValue = cookies[COOKIE_NAME];

    let languageValue = currentLanguage;
    let existingCookieLanguage = null;
    if (existingLanguageCookieValue) {
      const sp = existingLanguageCookieValue.split("/");
      if (sp.length > 2) {
        existingCookieLanguage = sp[2];
      }
    }

    if (existingCookieLanguage && !languageValue) {
      languageValue = existingCookieLanguage
    }

    if (!languageValue) {
      // only set browser language if no language value is currently set
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs = LanguageConfig.languages.map((l: LanguageDescriptor) => l.name);

      if (supportedLangs.includes(browserLang)) {
        languageValue = browserLang;
      } else {
        // if not supported, fall back to the default language
        languageValue = LanguageConfig.defaultLanguage;
      }
    }

    if (languageValue && languageValue !== existingCookieLanguage) {
      dispatch(updateTranslation({ language: languageValue }))
      setCookieSafe(languageValue);
    }
  }, []);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    switchLanguage(lang);
    handleClose();
  };

  const switchLanguage = (lang: string) => {
    dispatch(updateTranslation({ language: lang }));
    setCookieSafe(lang);
    // reload the page after a short delay to allow the cookie to be set
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <>
      {mobile ? (
        <MenuItem
          // @ts-ignore
          onClick={(event: React.MouseEvent<HTMLLIElement>) => handleClick(event as React.MouseEvent<HTMLButtonElement>)}
        >
          Change Language
        </MenuItem>
      ) : (
        <Tooltip title="Change Website language">
          <Button
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            <LanguageIcon />
          </Button>
        </Tooltip>
      )}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {LanguageConfig.languages.map((ld: LanguageDescriptor) => (
          <MenuItem
            key={`l_s_${ld.name}`}
            onClick={() => handleLanguageChange(ld.name)}
            selected={currentLanguage === ld.name}
            className="notranslate"
            sx={{
              textTransform: "capitalize",
            }}
          >
            {ld.title}
            {currentLanguage === ld.name && (
              <ListItemIcon>
                <CheckIcon fontSize="small" className="text-green-500" />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export { LanguageSwitcher, COOKIE_NAME };