import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
    const { mode, setMode } = useTheme();

    const toggleMode = () => {
        const modes = ['light', 'dark', 'auto'] as const;
        const currentIndex = modes.indexOf(mode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setMode(modes[nextIndex]);
    };

    const getIcon = () => {
        switch (mode) {
            case 'light':
                return <Sun size={16} />;
            case 'dark':
                return <Moon size={16} />;
            case 'auto':
                return <Monitor size={16} />;
            default:
                return <Sun size={16} />;
        }
    };

    return (
        <button
            onClick={toggleMode}
            className="p-2 rounded-lg bg-nouns-grey dark:bg-dark-surface hover:bg-nouns-red hover:text-white dark:hover:bg-nouns-red transition-all duration-200"
            title={`Current: ${mode} mode`}
        >
            {getIcon()}
        </button>
    );
};

export default ThemeToggle;
