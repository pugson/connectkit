import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { BigNumber } from 'ethers';

import {
  Types,
  ConnectKitButton,
  Avatar,
  SIWEButton,
  ChainIcon,
  SIWESession,
  useChains,
  useModal,
  useSIWE,
} from 'connectkit';

import {
  useAccount,
  useBalance,
  useSendTransaction,
  useNetwork,
  useSignMessage,
  useSignTypedData,
  usePrepareSendTransaction,
  useConnect,
  useDisconnect,
} from 'wagmi';
import { Chain } from 'wagmi/chains';

import { useTestBench } from '../TestbenchProvider';
import { Checkbox, Textbox, Select, SelectProps } from '../components/inputs';
import CustomAvatar from '../components/CustomAvatar';
import CustomSIWEButton from '../components/CustomSIWEButton';

/** TODO: import this data from the connectkit module */
const themes: SelectProps[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Web95', value: 'web95' },
  { label: 'Retro', value: 'retro' },
  { label: 'Soft', value: 'soft' },
  { label: 'Minimal', value: 'minimal' },
  { label: 'Rounded', value: 'rounded' },
  { label: 'Midnight', value: 'midnight' },
  { label: 'Nouns', value: 'nouns' },
];
const modes: SelectProps[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];
const languages: SelectProps[] = [
  { label: 'English (US)', value: 'en-US' },
  { label: 'French', value: 'fr-FR' },
  { label: 'Spanish', value: 'es-ES' },
  { label: 'Japanese', value: 'ja-JP' },
  { label: 'Chinese', value: 'zh-CN' },
];

const AccountInfo = () => {
  const {
    address,
    connector,
    isConnected,
    isConnecting,
    isDisconnected,
    isReconnecting,
  } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { chain } = useNetwork();
  const { isSignedIn, signOut } = useSIWE();

  return (
    <div className="panel">
      <h2>Wallet Info</h2>
      {isConnecting && <p>Connecting...</p>}
      {isReconnecting && <p>Reconnecting...</p>}
      {isDisconnected && <p>Disconnected</p>}
      {isConnected && (
        <table>
          <tbody>
            <tr>
              <td>Chain ID</td>
              <td>{chain?.id}</td>
            </tr>
            <tr>
              <td>Chain Name</td>
              <td>{chain?.name}</td>
            </tr>
            <tr>
              <td>Chain Supported</td>
              <td>{!chain || chain?.unsupported ? 'No' : 'Yes'}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{address}</td>
            </tr>
            <tr>
              <td>Balance</td>
              <td>{balanceData?.formatted}</td>
            </tr>
            <tr>
              <td>Connector</td>
              <td>{connector?.id}</td>
            </tr>
            <tr>
              <td>SIWE session</td>
              <td>
                {isSignedIn ? 'yes' : 'no'}{' '}
                {isSignedIn && <button onClick={signOut}>sign out</button>}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

const Actions = () => {
  const { isConnected, address } = useAccount();

  const {
    signMessage,
    isLoading: signMessageIsLoading,
    isError: signMessageIsError,
  } = useSignMessage({
    message: 'fam token wen',
  });
  const {
    signTypedData,
    isLoading: signTypedDataIsLoading,
    isError: signTypedDataIsError,
  } = useSignTypedData({
    // All properties on a domain are optional
    domain: {
      name: 'Ether Mail',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    },
    // The named list of all type definitions
    types: {
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
      ],
    },
    value: {
      from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      },
      to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: 'Hello, Bob!',
    },
  });
  const { config } = usePrepareSendTransaction({
    request: {
      to: address?.toString() ?? '',
      value: BigNumber.from('0'),
    },
  });
  const {
    sendTransaction,
    isLoading: sendTransactionIsLoading,
    isError: sendTransactionIsError,
  } = useSendTransaction(config);

  const testSignMessage = () => {
    signMessage();
  };
  const testSignTypedData = () => {
    signTypedData();
  };
  const testSendTransaction = () => {
    sendTransaction?.();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flexWrap: 'wrap',
      }}
    >
      <h2>Actions {!isConnected && `(connect to test)`}</h2>
      <button disabled={!isConnected} onClick={testSignMessage}>
        {signMessageIsError
          ? 'Error. Check console'
          : signMessageIsLoading
          ? 'Waiting...'
          : 'Sign message'}
      </button>
      <button disabled={!isConnected} onClick={testSignTypedData}>
        {signTypedDataIsError
          ? 'Error. Check console'
          : signTypedDataIsLoading
          ? 'Waiting...'
          : 'Sign typed data'}
      </button>
      <button disabled={!isConnected} onClick={testSendTransaction}>
        {sendTransactionIsError
          ? 'Error. Check console'
          : sendTransactionIsLoading
          ? 'Waiting...'
          : 'Send transaction'}
      </button>
    </div>
  );
};

const Home: NextPage = () => {
  const {
    theme,
    setTheme,
    customTheme,
    setCustomTheme,
    mode,
    setMode,
    options,
    setOptions,
    label,
    setLabel,
    hideAvatar,
    setHideAvatar,
    hideBalance,
    setHideBalance,
  } = useTestBench();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { chain } = useNetwork();
  const chains = useChains();

  const { open, setOpen, openSIWE, openAbout } = useModal();

  const { reset } = useConnect();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();
    reset();
  };

  if (!mounted) return null;

  return (
    <>
      <main>
        <div className="panel">
          <h2>Connect Button</h2>
          <ConnectKitButton label={label} />
          {isConnected && (
            <button onClick={handleDisconnect}>Disconnect</button>
          )}
        </div>

        <div className="panel">
          <h2>Sign In With Ethereum</h2>
          <SIWEButton
            showSignOutButton
            onSignIn={(data?: SIWESession) => {
              console.log('onSignIn SIWEButton', data);
            }}
            onSignOut={() => {
              console.log('onSignOut SIWEButton');
            }}
          />
          <CustomSIWEButton />
          <Link href="/siwe/token-gated">Token-gated page &rarr;</Link>
        </div>

        <div className="panel">
          <h2>useModal Hook</h2>
          <p>open: {open.toString()}</p>
          <button onClick={() => setOpen(true)}>Open modal</button>
          <button onClick={() => openAbout()}>Open to About</button>
          <button onClick={() => openSIWE(true)}>Open to SIWE</button>
        </div>

        <AccountInfo />

        <div className="panel">
          <h2>Chains</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <ChainIcon id={chain?.id} unsupported={chain?.unsupported} />
            <ChainIcon id={1} size={64} radius={6} />
            <ChainIcon id={1337} size={32} radius={0} />
            <ChainIcon id={2} unsupported />
          </div>
          <h2>dApps configured chains</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {chains.map((chain: Chain) => (
              <ChainIcon key={chain.id} id={chain.id} />
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Avatars</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <Avatar name="lochie.eth" />
            <Avatar name="pugson.eth" size={64} radius={6} />
            <Avatar name="benjitaylor.eth" size={32} radius={0} />
            <Avatar
              address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
              size={12}
            />
          </div>
        </div>
      </main>
      <aside>
        <ConnectKitButton.Custom>
          {({ isConnected, isConnecting, show, address, ensName, chain }) => {
            return (
              <button onClick={show}>
                {isConnected ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {chain?.name}
                    <ChainIcon
                      id={chain?.id}
                      unsupported={chain?.unsupported}
                    />
                    <Avatar address={address} size={12} />
                    {ensName ?? address}
                  </div>
                ) : (
                  <div>
                    Custom Connect {isConnecting ? 'connecting...' : ''}
                  </div>
                )}
              </button>
            );
          }}
        </ConnectKitButton.Custom>

        <Actions />
        <h2>ConnectKitButton props</h2>
        <Textbox
          label="ConnectKitButton Label"
          value={label}
          onChange={(e: any) => {
            setLabel(e.target.value);
          }}
        />
        <Checkbox
          label="hideAvatar"
          value="hideAvatar"
          checked={hideAvatar}
          onChange={() => setHideAvatar(!hideAvatar)}
        />
        <Checkbox
          label="hideBalance"
          value="hideBalance"
          checked={hideBalance}
          onChange={() => setHideBalance(!hideBalance)}
        />
        <h2>ConnectKitProvider props</h2>
        <Select
          label="Theme"
          value={theme ?? themes[0].value}
          options={themes}
          onChange={(e) => setTheme(e.target.value as Types.Theme)}
        />
        <Select
          label="Mode"
          value={mode ?? modes[0].value}
          options={modes}
          onChange={(e) => setMode(e.target.value as Types.Mode)}
        />
        <Select
          label="Language"
          value={options.language ?? languages[0].value}
          options={languages}
          onChange={(e) =>
            setOptions({
              ...options,
              language: e.target.value as Types.Languages,
            })
          }
        />
        <h3>options</h3>
        <Textbox
          label="disclaimer"
          value={options.disclaimer as string}
          onChange={(e: any) => {
            setOptions({ ...options, disclaimer: e.target.value });
          }}
        />
        <Textbox
          label="walletConnectName"
          value={options.walletConnectName as string}
          onChange={(e: any) => {
            setOptions({ ...options, walletConnectName: e.target.value });
          }}
        />
        <Checkbox
          label="customAvatar"
          value="customAvatar"
          checked={options.customAvatar !== undefined}
          onChange={() =>
            setOptions({
              ...options,
              customAvatar: options.customAvatar ? undefined : CustomAvatar,
            })
          }
        />
        <Checkbox
          label="Custom Font"
          value="customTheme"
          checked={customTheme['--ck-font-family'] !== undefined}
          onChange={() => {
            setCustomTheme(
              customTheme['--ck-font-family'] !== undefined
                ? {}
                : { '--ck-font-family': 'monospace' }
            );
          }}
        />
        <Checkbox
          label="reduceMotion"
          value="reduceMotion"
          checked={options.reducedMotion as boolean}
          onChange={() =>
            setOptions({ ...options, reducedMotion: !options.reducedMotion })
          }
        />
        <Checkbox
          label="truncateLongENSAddress"
          value="truncateLongENSAddress"
          checked={options.truncateLongENSAddress as boolean}
          onChange={() =>
            setOptions({
              ...options,
              truncateLongENSAddress: !options.truncateLongENSAddress,
            })
          }
        />
        <Checkbox
          label="hideBalance"
          value="hideBalance"
          checked={options.hideBalance as boolean}
          onChange={() =>
            setOptions({
              ...options,
              hideBalance: !options.hideBalance,
            })
          }
        />
        <Checkbox
          label="hideTooltips"
          value="hideTooltips"
          checked={options.hideTooltips as boolean}
          onChange={() =>
            setOptions({ ...options, hideTooltips: !options.hideTooltips })
          }
        />
        <Checkbox
          label="hideQuestionMarkCTA"
          value="hideQuestionMarkCTA"
          checked={options.hideQuestionMarkCTA as boolean}
          onChange={() =>
            setOptions({
              ...options,
              hideQuestionMarkCTA: !options.hideQuestionMarkCTA,
            })
          }
        />
        <Checkbox
          label="hideNoWalletCTA"
          value="hideNoWalletCTA"
          checked={options.hideNoWalletCTA as boolean}
          onChange={() =>
            setOptions({
              ...options,
              hideNoWalletCTA: !options.hideNoWalletCTA,
            })
          }
        />
        <Checkbox
          label="avoidLayoutShift"
          value="avoidLayoutShift"
          checked={options.avoidLayoutShift as boolean}
          onChange={() =>
            setOptions({
              ...options,
              avoidLayoutShift: !options.avoidLayoutShift,
            })
          }
        />
        <Checkbox
          label="disableSiweRedirect"
          value="disableSiweRedirect"
          checked={options.disableSiweRedirect as boolean}
          onChange={() =>
            setOptions({
              ...options,
              disableSiweRedirect: !options.disableSiweRedirect,
            })
          }
        />
        <Checkbox
          disabled
          label="embedGoogleFonts"
          value="embedGoogleFonts"
          checked={options.embedGoogleFonts as boolean}
          onChange={() =>
            setOptions({
              ...options,
              embedGoogleFonts: !options.embedGoogleFonts,
            })
          }
        />
        <Checkbox
          disabled
          label="bufferPolyfill"
          value="bufferPolyfill"
          checked={options.bufferPolyfill as boolean}
          onChange={() =>
            setOptions({
              ...options,
              bufferPolyfill: !options.bufferPolyfill,
            })
          }
        />
        <Select
          label="walletConnectCTA"
          value={options.walletConnectCTA as string}
          options={[
            { label: 'modal', value: 'modal' },
            { label: 'link', value: 'link' },
            { label: 'both', value: 'both' },
          ]}
          onChange={(e) =>
            setOptions({
              ...options,
              walletConnectCTA: e.target.value as any,
            })
          }
        />
      </aside>
    </>
  );
};

export default Home;
