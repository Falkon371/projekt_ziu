import "../DarkMode.css";
import { ChangeEventHandler, useEffect, useState } from "react";

const DarkMode = () => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDark =
      storedTheme === "dark" || (storedTheme === null && prefersDark);

    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");

    return isDark;
  };

  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme: ChangeEventHandler<HTMLInputElement> = (event) => {
    setIsDark(event.target.checked);
  };

  return (
    <div className="toggle-theme-wrapper">
      <span>☀️</span>
      <label className="toggle-theme" htmlFor="checkbox">
        <input
          type="checkbox"
          id="checkbox"
          onChange={toggleTheme}
          checked={isDark}
        />
        <div className="slider round"></div>
      </label>
      <span>🌒</span>
    </div>
  );
};

export default DarkMode;
