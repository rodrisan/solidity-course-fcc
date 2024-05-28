import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3Contract, useMoralis } from 'react-moralis';
import { useNotification } from 'web3uikit';

import { abi, contractAddresses } from '../constants';

export default function LotteryEntrance() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex, web3 } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const dispatch = useNotification();

    // useStates
    const [entranceFee, setEntranceFee] = useState('0');
    const [numberOfPlayers, setNumberOfPlayers] = useState('0');
    const [recentWinner, setRecentWinner] = useState('0');
    const [raffleState, setRaffleState] = useState(0);
    const [userEntered, setUserEntered] = useState(0);

    // Transactions
    const {
        runContractFunction: enterRaffle,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: 'enterRaffle',
        msgValue: entranceFee,
        params: {},
    });

    /* View Functions */

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: 'getEntranceFee',
        params: {},
    });

    const { runContractFunction: getPlayersNumber } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: 'getNumberOfPlayers',
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: 'getRecentWinner',
        params: {},
    });

    const { runContractFunction: getRaffleState } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: 'getRaffleState',
        params: {},
    });

    // Event listeners
    async function listenForEvent(eventName, callback) {
        const lottery = new ethers.Contract(raffleAddress, abi, web3);
        console.log(`Listening for ${eventName} ...`);
        await new Promise((resolve, reject) => {
            lottery.once(eventName, async () => {
                console.log(`${eventName} event triggered!`);
                try {
                    await callback();
                    resolve();
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }

    async function listenForWinnerToBePicked() {
        await listenForEvent('WinnerPicked', updateUIValues);
    }

    async function listenForLotteryEntrance() {
        await listenForEvent('RaffleEnter', () => {});
    }

    // useEffects
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues();
            listenForWinnerToBePicked();
        }
    }, [isWeb3Enabled, numberOfPlayers]);

    async function updateUIValues() {
        // Another way we could make a contract call:
        // const options = { abi, contractAddress: raffleAddress }
        // const fee = await Moralis.executeFunction({
        //     functionName: "getEntranceFee",
        //     ...options,
        // })
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        const numPlayersFromCall = (await getPlayersNumber()).toString();
        const recentWinnerFromCall = await getRecentWinner();
        const contractState = await getRaffleState();
        setEntranceFee(entranceFeeFromCall);
        setNumberOfPlayers(numPlayersFromCall);
        setRecentWinner(recentWinnerFromCall);
        setRaffleState(contractState);
    }

    const handleEnterLottery = async () => {
        setUserEntered(true);
        await enterRaffle({ onError: handleMetamaskError });
        await listenForLotteryEntrance()
            .then(() =>
                dispatch({
                    type: 'info',
                    message: 'Transaction Complete!',
                    title: 'Transaction Notification',
                    position: 'topR',
                    icon: 'bell',
                })
            )
            .catch((error) => {
                console.log(error);
            });
        setUserEntered(false);
    };

    const handleMetamaskError = async () => {
        setUserEntered(false);
    };

    // Render
    const renderValidChainComponent = () => {
        return (
            <div className="py-3">
                <div className="flex justify-start">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleEnterLottery}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div>
                        {userEntered ? (
                            <div className="bg-orange-200 italic py-4 px-4 rounded ml-2">
                                Pending...
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
                <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, 'ether')} ETH</div>
                <div>Number Of Players: {numberOfPlayers}</div>
                <div>Recent Winner: {recentWinner}</div>
                <div>Current State: {raffleState}</div>
            </div>
        );
    };

    const renderUnvalidChainComponent = () => {
        return <div>No Lottery Address Detetched!</div>;
    };

    return (
        <div>{raffleAddress ? renderValidChainComponent() : renderUnvalidChainComponent()}</div>
    );
}
