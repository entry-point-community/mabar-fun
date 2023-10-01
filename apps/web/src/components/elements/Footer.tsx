import { FaDiscord, FaGithub, FaYoutube } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="flex flex-col items-center gap-3 bg-gradient-to-t from-violet-100 to-transparent to-90% py-20 text-center dark:from-violet-900">
      <p className="text-sm">
        Nemu bug? Mau ikutan kontribusi ngoding? <br />
        <a
          className="text-blue-400 hover:underline"
          href="https://github.com/entry-point-community/mabar-fun"
        >
          Gas ke repo web app ini di github
        </a>
      </p>
      <div className="flex gap-4">
        <a href="https://www.youtube.com/@voidfnc" className="text-2xl">
          <FaYoutube />
        </a>
        <a
          href="https://github.com/entry-point-community/mabar-fun"
          className="text-2xl"
        >
          <FaGithub />
        </a>
        <a href="https://discord.gg/dA2QKaHHjD" className="text-2xl">
          <FaDiscord />
        </a>
      </div>
      <p className="text-xs">Copyright © 2023 VoidFnc</p>
    </footer>
  );
};
