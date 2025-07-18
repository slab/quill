import Quill from '@/main';
import BubbleTheme from '@/themes/bubble';
import SnowTheme from '@/themes/snow';

export default function registerDefaultThemes() {
  Quill.register(
    {
      'themes/bubble': BubbleTheme,
      'themes/snow': SnowTheme,
    },
    true,
  );
}
