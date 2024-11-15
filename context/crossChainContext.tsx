import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { useChainId } from 'wagmi';
import useCase from '@/hooks/useCase';
import crossChainService from '@/services/corssChain/CrossChainService';

type StateType = {
  isCrossChainZapInOpened: boolean;
  selectedChainId: number;
  destTokenSymbol: string | undefined;
  /**
   * This variable is used to determine if the current chain supports the corresponding token's cross chain zap in function.
   *
   * When the variable is false, a switchChain action should be performed first before operating the cross chain zap in function.
   */
  isInTokenSupportedChains: boolean;
  /**
   * Determines if switching to the case's default chain is necessary
   *
   * shouldSwitchToDefaultChainWhenCaseLoaded is used to check whether a switch to the case's default chain
   * is required each time a case is entered. Since the initialization of case.inputs
   * needs to occur on the case's default chain
   */
  shouldSwitchToDefaultChainWhenCaseLoaded: boolean;
};

const DEFAULT_STATE: StateType = {
  isCrossChainZapInOpened: false,
  selectedChainId: 0,
  destTokenSymbol: undefined,
  isInTokenSupportedChains: false,
  // When case is loaded, it should switch to the default chain specified for the case.
  shouldSwitchToDefaultChainWhenCaseLoaded: false,
};

const DEFAULT_VALUE = {
  ...DEFAULT_STATE,
  updateCrossChain: (_payload: Partial<StateType>) => {},
};

export const crossChainContext = createContext(DEFAULT_VALUE);
const { Provider } = crossChainContext;

type Action = {
  type: 'update_cross_chain';
  payload: Partial<StateType>;
};

function reducer(state: StateType, action: Action) {
  switch (action.type) {
    case 'update_cross_chain':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return DEFAULT_STATE;
  }
}

export const CrossChainContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { batchCase } = useCase();
  const chainId = useChainId();
  const [state, dispatch] = useReducer(reducer, {
    ...DEFAULT_STATE,
    selectedChainId: batchCase?.networkId ?? chainId,
    destTokenSymbol: batchCase?.inputs?.find(
      (input) => input.isCrossChainZapInAllowed
    )?.symbol,
    shouldSwitchToDefaultChainWhenCaseLoaded: batchCase?.networkId !== chainId,
  });

  const updateCrossChain = useCallback(
    (payload: Partial<StateType>) =>
      dispatch({ type: 'update_cross_chain', payload }),
    []
  );

  const isCrossChainZapInOpened = useMemo(
    () =>
      // TODO: remove this after crosschain zapIn is ready
      process.env.NEXT_PUBLIC_CROSSCHAIN_ZAP_IN_READY === 'true' &&
      (batchCase?.inputs?.some((input) => input.isCrossChainZapInAllowed) ??
        false),
    [batchCase?.inputs]
  );

  const isInTokenSupportedChains = useMemo(() => {
    if (state.destTokenSymbol === undefined) return false;
    return (
      (
        crossChainService.getAvailablePoolsChainIdsByDestSymbol(
          state.destTokenSymbol
        ) ?? []
      ).findIndex((x) => x === chainId) !== -1
    );
  }, [chainId, state.destTokenSymbol]);

  const value = useMemo(
    () => ({
      ...state,
      isCrossChainZapInOpened,
      updateCrossChain,
      isInTokenSupportedChains,
    }),
    [isCrossChainZapInOpened, state, updateCrossChain, isInTokenSupportedChains]
  );

  return <Provider value={value}>{children}</Provider>;
};

const useCrossChainContext = () => useContext(crossChainContext);

export default useCrossChainContext;
