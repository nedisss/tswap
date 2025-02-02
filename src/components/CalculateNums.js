import React, { useState, useEffect } from "react";
import { selectUser } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCalculated } from "../features/calculateSlice";

// Skaičiavimo funkcijos
const calculateProgress = (miningStartedTime) => {
    const totalMiningTime = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    const now = Date.now();
    const elapsedTime = now - miningStartedTime;
    if (elapsedTime >= totalMiningTime) {
        return 100; // Mining is complete
    }
    return (elapsedTime / totalMiningTime) * 100;
};

const calculateMinedValue = (miningStartedTime, mineRate) => {
    const totalMiningTime = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    let elapsedTime = Date.now() - miningStartedTime;
    elapsedTime = Math.round(elapsedTime / 1000) * 1000;

    if (elapsedTime >= totalMiningTime) {
        return mineRate * (totalMiningTime / 1000);
    }

    return mineRate * (elapsedTime / 1000);
};

const calculateRemainingTime = (miningStartedTime) => {
    const totalMiningTime = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    const now = Date.now();
    const endTime = miningStartedTime + totalMiningTime;
    const remainingTime = Math.max(endTime - now, 0);

    if (remainingTime === 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(remainingTime / (60 * 60 * 1000));
    const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

    return { hours, minutes, seconds };
};

// Sukuriame Worker'į naudojant Blob
const createWorker = () => {
    const workerCode = `
        onmessage = function(event) {
            const { miningStartedTime, mineRate } = event.data;

            const calculateProgress = ${calculateProgress.toString()};
            const calculateMinedValue = ${calculateMinedValue.toString()};
            const calculateRemainingTime = ${calculateRemainingTime.toString()};

            const progress = calculateProgress(miningStartedTime);
            const mined = calculateMinedValue(miningStartedTime, mineRate);
            const remainingTime = calculateRemainingTime(miningStartedTime);

            const canClaim = progress === 100;

            postMessage({ progress, mined, remainingTime, canClaim });
        };
    `;

    // Sukuriame Blob iš Worker kodo
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    return new Worker(URL.createObjectURL(blob));
};

// Naudoti Worker'į komponente
const startMining = (miningStartedTime, mineRate) => {
    const worker = createWorker();
    return new Promise((resolve) => {
        worker.onmessage = (event) => {
            const { progress, mined, remainingTime, canClaim } = event.data;
            resolve({ progress, mined, remainingTime, canClaim });
            worker.terminate(); // Baigus darbą užbaigiame Worker'į
        };

        // Siunčiame pradines reikšmes Worker'ui
        worker.postMessage({ miningStartedTime, mineRate });
    });
};

function CalculateNums() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const [waiting, setWaiting] = useState(true);
    const [mined, setMined] = useState(0);
    const [reminingTime, setReminingTime] = useState({
        hours: 6,
        minutes: 0,
        seconds: 0,
    });
    const [progress, setProgress] = useState(0);
    const [canClaim, setCanClaim] = useState(false);

    const MAX_MINE_RATE = 100.0;

    // Start mining funkcija
    const startMiningProcess = () => {
        setWaiting(false);
        const miningStartedTime = Date.now();
        dispatch(setCalculated({ miningStartedTime }));

        // Pasikviečiame Worker'į
        startMining(miningStartedTime, user.mineRate).then(({ progress, mined, remainingTime, canClaim }) => {
            setProgress(progress);
            setMined(mined);
            setReminingTime(remainingTime);
            setCanClaim(canClaim);
        });
    };

    const claimReward = () => {
        dispatch(setCalculated({ balance: user.balance + mined }));
        setCanClaim(false);
    };

    const getUpgradeStep = (rate) => {
        if (rate < 0.01) return 0.001;
        if (rate < 0.1) return 0.01;
        if (rate < 1) return 0.1;
        return Math.pow(10, Math.floor(Math.log10(rate)));
    };

    const getUpgradePrice = (nextRate) => {
        return nextRate * 100000;
    };

    const getNextUpgradeRate = () => {
        const step = getUpgradeStep(user.mineRate);
        return Math.min(user.mineRate + step, MAX_MINE_RATE);
    };

    const canUpgrade =
        user.balance >= getUpgradePrice(getNextUpgradeRate()) &&
        user.mineRate < MAX_MINE_RATE;

    useEffect(() => {
        if (!waiting) {
            dispatch(
                setCalculated({
                    mined: mined,
                    reminingTime: reminingTime,
                    progress: progress,
                    canClaim: canClaim,
                    canUpgrade: canUpgrade,
                })
            );
        }
    }, [waiting, mined, reminingTime, progress, canClaim, canUpgrade, dispatch]);

    return (
        <div>
            <h2>Mining Progress</h2>
            {waiting ? (
                <button onClick={startMiningProcess}>Start Mining</button>
            ) : (
                <>
                    <p>Progress: {progress}%</p>
                    <p>Mined: {mined} units</p>
                    <p>Time remaining: {reminingTime.hours}h {reminingTime.minutes}m {reminingTime.seconds}s</p>
                    {canClaim && <button onClick={claimReward}>Claim Reward</button>}
                </>
            )}

            <div>
                <h3>Upgrade Info</h3>
                <p>Next Upgrade Rate: {getNextUpgradeRate()}</p>
                <p>Upgrade Cost: {getUpgradePrice(getNextUpgradeRate())}</p>
                {canUpgrade && (
                    <button onClick={() => dispatch(setCalculated({ mineRate: getNextUpgradeRate() }))}>
                        Upgrade
                    </button>
                )}
            </div>
        </div>
    );
}

export default CalculateNums;
