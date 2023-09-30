import Link from 'next/link';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import { Button } from '~/components/ui/button';

export const Header = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      return;
    }

    setTheme('light');
  };

  return (
    <div className="mb-20 flex justify-between p-6">
      <Button variant="link" className="font-heading text-xl font-extrabold">
        <Link href="/">Mabar.Fun</Link>
      </Button>
      <div className="flex justify-end">
        <Button onClick={toggleTheme} variant="secondary">
          {theme === 'light' ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
    </div>
  );
};
