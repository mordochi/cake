import { Icon, IconProps } from '@chakra-ui/react';

const BaseIcon = (props: IconProps) => (
  <Icon
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_2395_1528)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#0052FF"
      />
      <path
        d="M12.0531 20.339C16.7042 20.339 20.4745 16.5751 20.4745 11.9322C20.4745 7.28923 16.7042 3.52539 12.0531 3.52539C7.64046 3.52539 4.0205 6.91325 3.66098 11.2255H14.7922V12.6388H3.66098C4.0205 16.951 7.64046 20.339 12.0531 20.339Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_2395_1528">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </Icon>
);

export default BaseIcon;
