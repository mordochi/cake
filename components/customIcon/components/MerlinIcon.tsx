import { Icon, IconProps } from '@chakra-ui/react';
import { useId } from 'react';

const MerlinIcon = (props: IconProps) => {
  const id = useId();
  return (
    <Icon
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_2690_1701)">
        <circle cx="12" cy="12" r="12" fill="white" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 23.9531C18.6015 23.9531 23.9531 18.6015 23.9531 12C23.9531 5.39845 18.6015 0.046875 12 0.046875C5.39845 0.046875 0.046875 5.39845 0.046875 12C0.046875 15.0085 1.15837 17.7575 2.99312 19.8586L9.38962 13.9275C9.46008 13.8093 9.51422 13.6816 9.55013 13.5477L9.66347 13.1247L6.19214 12.6088C5.78517 12.5483 5.78517 11.9613 6.19214 11.9009L9.29259 11.44L5.7037 6.59798C5.45869 6.26742 5.87372 5.85244 6.20428 6.09741L11.0473 9.68705L11.5084 6.58463C11.5688 6.17766 12.1558 6.17766 12.2163 6.58463L12.6772 9.6855L17.5181 6.09741C17.8486 5.85244 18.2637 6.26742 18.0187 6.59798L14.43 11.4397L17.5325 11.9009C17.9395 11.9613 17.9395 12.5483 17.5325 12.6088L14.4299 13.0699L18.0187 17.9118C18.2637 18.2424 17.8486 18.6574 17.5181 18.4124L12.6772 14.8243L12.2163 17.925C12.1558 18.332 11.5688 18.332 11.5084 17.925L10.9922 14.4524L10.5002 14.5842C10.4343 14.6018 10.3711 14.6274 10.312 14.6603L4.31167 21.1528C6.39 22.9004 9.07205 23.9531 12 23.9531Z"
          fill={`url(#paint0_linear_2690_1701_${id})`}
        />
      </g>
      <defs>
        <linearGradient
          id={`paint0_linear_2690_1701_${id}`}
          x1="-3.89642"
          y1="1.3916"
          x2="28.515"
          y2="18.8438"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2A2CBF" />
          <stop offset="0.515625" stopColor="#6335FF" />
          <stop offset="1" stopColor="#BD89FF" />
        </linearGradient>
        <clipPath id="clip0_2690_1701">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </Icon>
  );
};

export default MerlinIcon;
