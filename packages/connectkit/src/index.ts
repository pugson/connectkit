export * as Types from './types';
export { default as getDefaultClient } from './defaultClient';

export { useModal } from './hooks/useModal';
export { SIWEProvider, useSIWE, SIWEConfig, SIWESession } from './siwe';

export { ConnectKitProvider, Context } from './components/ConnectKit';
export { ConnectKitButton } from './components/ConnectButton';
export { default as SIWEButton } from './components/Standard/SIWE';

//export { default as NetworkButton } from './components/NetworkButton';
//export { default as BalanceButton, Balance } from './components/BalanceButton';
export { default as Avatar } from './components/Common/Avatar';
export { default as ChainIcon } from './components/Common/Chain';

// Hooks
export { default as useIsMounted } from './hooks/useIsMounted'; // Useful for apps that use SSR
export { useChains } from './hooks/useChains';

// TODO: Make this private
export { default as supportedConnectors } from './constants/supportedConnectors';
export { default as ConnectKitModalDemo } from './components/ConnectModal/demo';
