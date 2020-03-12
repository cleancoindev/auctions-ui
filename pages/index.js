import React, { useState } from "react";
import Head from "next/head";
import useMaker from "../hooks/useMaker";
import { Text, Input, Grid, Button } from "@makerdao/ui-components-core";
import BigNumber from "bignumber.js";

const Index = () => {
  const { maker } = useMaker();
  const [daiBalance, setDaiBalance] = useState(null);
  const [web3Connected, setWeb3Connected] = useState(false);

  async function connectBrowserWallet() {
    try {
      if (maker) {
        await maker.authenticate();
        setWeb3Connected(true);
        const daiBalance = await maker
          .getToken("MDAI")
          .balanceOf(maker.currentAddress());
        setDaiBalance(daiBalance);
      }
    } catch (err) {
      window.alert(err);
    }
  }

  const [tendAmount, setTendAmount] = useState(0);
  const [joinAmount, setJoinAmount] = useState("");

  async function joinDaiToAdapter() {
    const ethAJoinAdapter = maker
      .service("smartContract")
      .getContract("MCD_JOIN_ETH_A");
    console.log("Joining", BigNumber(joinAmount).toNumber());
    ethAJoinAdapter.join(
      maker.currentAddress(),
      BigNumber(joinAmount).toNumber()
    );
  }

  /**.
 *
 * <Input
          type="number"
          min="0"
          value={amount}
          onChange={onAmountChange}
          placeholder={`0.00 ${symbol}`}
          failureMessage={amountErrors}
          data-testid="deposit-input"
        />
 */
  // console.log('tendAmount', tendAmount);
  return (
    <div className="wrap">
      <Head>
        <title>Next.js Dai.js Example</title>
      </Head>

      <h1>Next.js Dai.js Example</h1>
      {!maker ? (
        <div>
          <h3>Loading...</h3>
        </div>
      ) : !web3Connected ? (
        <button onClick={connectBrowserWallet}>Connect Wallet</button>
      ) : (
        <div>
          <h3>Connected Account</h3>
          <p>{maker.currentAddress()}</p>

          <div>
            {daiBalance ? (
              <p>{daiBalance.toNumber()} DAI in your wallet</p>
            ) : (
              <p>Loading your DAI balance...</p>
            )}
          </div>
          <Input
            type="number"
            min="0"
            value={joinAmount}
            placeholder={"0.00 DAI"}
            onChange={e => setJoinAmount(e.target.value)}
            // placeholder={`0.00 ${symbol}`}
            // failureMessage={amountErrors}
            data-testid="deposit-input"
          />
          <p>Insert amount in wei</p>
          <br />
          <button onClick={() => joinDaiToAdapter()}>Send To Adapter</button>

          <Input
            type="number"
            min="0"
            value={tendAmount}
            onChange={setTendAmount}
            // placeholder={`0.00 ${symbol}`}
            // failureMessage={amountErrors}
            data-testid="deposit-input"
          />
          <button onClick={() => null}>Call Tend</button>
        </div>
      )}
    </div>
  );
};

export default Index;
