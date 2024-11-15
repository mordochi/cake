import { track } from '@amplitude/analytics-browser';
import { Link } from '@chakra-ui/next-js';
import { Grid } from '@chakra-ui/react';
import FarcasterIcon from '@icons/farcaster.svg';
import ParagraphIcon from '@icons/paragraph.svg';
import TelegramIcon from '@icons/telegram.svg';
import TwitterIcon from '@icons/twitter.svg';

const SocialMedias = [
  {
    href: 'https://x.com/bentobatch',
    name: 'Twitter',
    icon: <TwitterIcon />,
  },
  {
    href: 'https://t.me/bentobatch',
    name: 'Telegram',
    icon: <TelegramIcon />,
  },
  {
    href: 'https://warpcast.com/bentobatch',
    name: 'Farcaster',
    icon: <FarcasterIcon />,
  },
  {
    href: 'https://paragraph.xyz/@bentobatch',
    name: 'Paragraph',
    icon: <ParagraphIcon />,
  },
];

const SocialMediaButtonGroup = () => {
  return (
    <Grid gap="9px" gridAutoFlow="column">
      {SocialMedias.map(({ href, name, icon }) => (
        <Link
          key={name}
          href={href}
          isExternal
          w="22px"
          h="22px"
          onClick={() => {
            track('footer_click_social', { link: href });
          }}
        >
          {icon}
        </Link>
      ))}
    </Grid>
  );
};

export default SocialMediaButtonGroup;
