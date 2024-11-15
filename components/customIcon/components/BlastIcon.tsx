import { Icon, IconProps } from '@chakra-ui/react';

const BlastIcon = (props: IconProps) => (
  <Icon
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12" cy="12" r="11" fill="#171717" />
    <path
      d="M16.479 12.5484L18.9321 11.326L19.7776 8.7307L18.0865 7.5H6.82601L4.22229 9.43395H17.4586L16.7553 11.6107H11.4474L10.9367 13.2014H16.2446L14.7544 17.7809L17.2409 16.5502L18.1283 13.8042L16.4623 12.5819L16.479 12.5484Z"
      fill="#FCFC03"
    />
    <path
      d="M7.9647 15.3447L9.4968 10.5726L7.79726 9.30005L5.24377 17.3121H14.7545L15.3908 15.3447H7.9647Z"
      fill="#FCFC03"
    />
  </Icon>
);

export default BlastIcon;
