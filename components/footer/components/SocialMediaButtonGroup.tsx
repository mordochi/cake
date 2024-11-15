import { track } from '@amplitude/analytics-browser';
import { Link } from '@chakra-ui/next-js';
import { Grid } from '@chakra-ui/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocialMedias: any[] = [];

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
