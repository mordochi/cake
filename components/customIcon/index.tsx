import { IconProps } from '@chakra-ui/react';
import Arbitrum from './components/ArbitrumIcon';
import Base from './components/BaseIcon';
import Blast from './components/BlastIcon';
import Bsc from './components/BscIcon';
import Merlin from './components/MerlinIcon';
import Optimism from './components/OptimismIcon';
import Polygon from './components/PolygonIcon';
import Scroll from './components/ScrollIcon';
import Zora from './components/ZoraIcon';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomIcons: Record<string, any> = {
  Blast: (props: IconProps) => <Blast {...props} />,
  Scroll: (props: IconProps) => <Scroll {...props} />,
  Base: (props: IconProps) => <Base {...props} />,
  Arbitrum: (props: IconProps) => <Arbitrum {...props} />,
  Optimism: (props: IconProps) => <Optimism {...props} />,
  Zora: (props: IconProps) => <Zora {...props} />,
  Bsc: (props: IconProps) => <Bsc {...props} />,
  Merlin: (props: IconProps) => <Merlin {...props} />,
  Pol: (props: IconProps) => <Polygon {...props} />,
};
export default CustomIcons;
