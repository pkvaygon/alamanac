"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Icon } from '@iconify/react';
import { Button } from "@nextui-org/react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
      <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} isIconOnly radius="full" variant="light">
        {theme === 'light' ? (
          <Icon className="text-default-500" icon="solar:moon-linear" width={24} />
          ) : (
            <Icon className="text-default-500" icon="solar:sun-linear" width={24} />
        )}
      </Button>
  );
};
