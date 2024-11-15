import { track } from '@amplitude/analytics-browser';
import { Link } from '@chakra-ui/next-js';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import ChevronDownIcon from '@icons/chevron-down.svg';
import { usePathname } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';

export type PageInfo = {
  title: string;
  href: string;
  eventName: string;
  shouldActivate: boolean;
};

const checkIsInPages = (pathname: string, pages: PageInfo[]) =>
  pages.some(
    ({ href, shouldActivate }) => shouldActivate && pathname.includes(href)
  );

const DropDownMenuItem = ({
  page,
  setIsOpen,
  isCurrent,
}: {
  page: PageInfo;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isCurrent: boolean;
}) => {
  const handleOnClick = useCallback(() => {
    track(page.eventName);
    setIsOpen(false);
  }, [page.eventName, setIsOpen]);

  return (
    <MenuItem
      as={Link}
      href={page.href}
      onClick={handleOnClick}
      fontSize="16px"
      fontWeight="700"
      lineHeight="24px"
      color={isCurrent ? '#FFFFFF' : '#757575'}
      bg={isCurrent ? '#2A2D3A' : '#22242B'}
      _hover={{ bg: '#2A2D3A', color: '#FFFFFF' }}
      _focusVisible={{ boxShadow: 'none' }}
    >
      {page.title}
    </MenuItem>
  );
};

export const DesktopDropdown = ({
  children,
  pages,
  clickEventName,
}: {
  children: React.ReactNode;
  pages: PageInfo[];
  clickEventName: string;
}) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = useCallback(() => {
    track(clickEventName);
    setIsOpen(true);
  }, [clickEventName]);

  const handleMouseLeave = useCallback(() => {
    setIsOpen(false);
  }, []);

  const isInPages = useMemo(
    () => checkIsInPages(pathname, pages),
    [pathname, pages]
  );

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      position="relative"
      _hover={{ button: { color: '#E5E8F7' } }}
    >
      <Menu isOpen={isOpen} offset={[0, 8]}>
        <MenuButton
          as={Button}
          rightIcon={
            <Center width="16px" height="16px">
              <ChevronDownIcon />
            </Center>
          }
          variant="plain"
          p={{
            base: '8px 0px',
            md: '8px 16px',
          }}
          fontSize="16px"
          fontWeight="700"
          lineHeight="24px"
          color={isInPages ? '#E5E8F7' : '#828282'}
          _focusVisible={{}}
          sx={{ 'svg path': { stroke: '#828282' } }}
        >
          {children}
        </MenuButton>
        {/* This empty box is for keeping the hover status there */}
        <Box width="100%" height="8px" position="absolute" cursor="pointer" />
        <MenuList bg="#22242B" boxShadow="0px 0px 10px 0px #191D26">
          {pages.map((page) => {
            const isCurrent =
              page.shouldActivate && pathname.startsWith(page.href);
            return (
              <DropDownMenuItem
                key={page.title}
                page={page}
                isCurrent={isCurrent}
                setIsOpen={setIsOpen}
              />
            );
          })}
        </MenuList>
      </Menu>
    </Box>
  );
};

const DropDownLink = ({
  onClose,
  page,
  isCurrent,
}: {
  onClose: () => void;
  page: PageInfo;
  isCurrent: boolean;
}) => {
  const handleOnClick = useCallback(() => {
    track(page.eventName);
    onClose();
  }, [page.eventName, onClose]);

  return (
    <Box p="16px 0">
      <Link
        href={page.href}
        color={isCurrent ? '#FFFFFF' : '#757575'}
        onClick={handleOnClick}
      >
        {page.title}
      </Link>
    </Box>
  );
};

export const MobileDropDown = ({
  onClose,
  children,
  pages,
  clickEventName,
}: {
  onClose: () => void;
  children: React.ReactNode;
  pages: PageInfo[];
  clickEventName: string;
}) => {
  const pathname = usePathname();
  const isInPages = useMemo(
    () => checkIsInPages(pathname, pages),
    [pathname, pages]
  );
  const handleOnClick = useCallback(() => {
    track(clickEventName);
  }, [clickEventName]);

  return (
    <Accordion allowToggle>
      <AccordionItem
        borderWidth="0"
        _last={{ borderWidth: '0' }}
        lineHeight="28px"
      >
        <AccordionButton
          p="16px 0"
          fontSize="20px"
          fontWeight="700"
          textAlign="left"
          color={isInPages ? '#E5E8F7' : '#828282'}
          _focusVisible={{}}
          _expanded={{ svg: { transform: 'rotate(180deg)' } }}
          sx={{ svg: { transition: 'transform 0.3s' } }}
          onClick={handleOnClick}
        >
          <Text as="span" flex="1">
            {children}
          </Text>
          <Center width="16px" height="16px">
            <ChevronDownIcon />
          </Center>
        </AccordionButton>
        <AccordionPanel pb={4} fontSize="20px">
          {pages.map((page) => {
            const isCurrent = pathname.startsWith(page.href);
            return (
              <DropDownLink
                key={page.title}
                page={page}
                isCurrent={isCurrent}
                onClose={onClose}
              />
            );
          })}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
