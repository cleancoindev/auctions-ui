/** @jsx jsx */

import React, { useState } from 'react';
import {
  Heading,
  Text,
  jsx,
  Button,
  Grid,
  Box,
  Styled,
  Label,
  Input,
  Flex
} from 'theme-ui';
import BigNumber from 'bignumber.js';
import Moment from 'react-moment';
import EventsList from './AuctionEventsList';
import MiniFormLayout from './MiniFormLayout';

const AuctionEvent = ({ type, ilk, lot, bid, currentBid, timestamp, tx, sender }) => {
  const fields = [
    ['Event Type', type],
    ['Lot Size', lot],
    ['Current Bid Price', currentBid],
    ['Bid Value', bid],
    ['Timestamp', timestamp],
    [
      'Tx',
      <a href={`https://etherscan.io/tx/${tx}`} target="_blank">
        {' '}
        {tx.slice(0, 7) + '...' + tx.slice(-4)}
      </a>
    ],
    [
      'Sender',
      <a href={`https://etherscan.io/address/${sender}`} target="_blank">
        {' '}
        {sender.slice(0, 7) + '...' + sender.slice(-4)}
      </a>
    ]
  ];
  return (
    <Grid
      gap={2}
      columns={[2, 4, 7]}
      sx={{
        bg: 'background',
        p: 5,
        borderRadius: 5
      }}
    >
      {fields.map(([title, value]) => {
        return (
          <Box key={title}>
            <Text
              variant="caps"
              sx={{
                fontSize: '10px',
                mb: 2
              }}
            >
              {title}
            </Text>
            <Text
              sx={{
                fontSize: 1
              }}
            >
              {value}
            </Text>
          </Box>
        );
      })}
    </Grid>
  );
};

export default ({ events, id: auctionId }) => {
  const [state, setState] = useState({ amount: undefined, error: undefined });

  const maxBid = new BigNumber(100); // This should be taken from somewhere?

  const handleBidAmountInput = event => {
    const value = event.target.value;
    const state = { amount: undefined, error: undefined };

    if (value) {
      state.amount = new BigNumber(value);

      if (state.amount.gt(maxBid)) {
        state.error =
          'Your bid exceeds the max bid, you will need to decrease.';
      }
    }

    setState(state);
  };

  const bidDisabled = state.error || !state.amount;

  return (
    <Grid
      gap={5}
      sx={{
        bg: '#fff',
        p: 6,
        borderRadius: 5,
        border: '1px solid',
        borderColor: 'border'
      }}
    >
      <Flex
        sx={{
          flexDirection: ['column', 'row'],
          justifyContent: 'space-between'
        }}
      >
        <Heading as="h5" variant="h2">
          Auction ID: {auctionId}
        </Heading>
        <Heading
          as="h5"
          variant="h2"
          sx={{
            pt: [2, 0]
          }}
        >
          Time remaining: 1h 20m 20s
        </Heading>
      </Flex>
      <Box>
        <EventsList
          events={events.map(({ type, ilk, lot, bid, timestamp, hash, fromAddress }, index) => {
            const currentBid = new BigNumber(lot).eq(new BigNumber(0))
              ? new BigNumber(lot)
              : new BigNumber(bid).div(new BigNumber(lot));

            return (
              <AuctionEvent
                key={`${timestamp}-${index}`}
                type={type}
                ilk={ilk}
                tx={hash}
                sender={fromAddress}
                lot={new BigNumber(lot).toFormat(5, 4)}
                bid={new BigNumber(bid).toFormat(5, 4)}
                currentBid={`${currentBid.toFormat(5, 4)} MKR`}
                timestamp={
                  <Text title={new Date(timestamp)}>
                    <Moment fromNow ago>
                      {timestamp}
                    </Moment>{' '}
                    ago
                  </Text>
                }
              />
            );
          })}
        />
      </Box>
      <MiniFormLayout
        text={'Enter your bid in MKR for this Auction'}
        disabled={bidDisabled}
        inputUnit="MKR"
        onSubmit={() => {}}
        small={'Price 1 MKR = 300 DAI'}
        actionText={'Bid Now'}
      />
      {/* <Grid gap={2}>
        <Text variant="boldBody"></Text>
        <Flex
          sx={{
            flexDirection: ['column', 'row']
          }}
        >
          <Flex
            sx={{
              maxWidth: ['100%', '224px'],
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              fontSize: 4,
              // lineHeight: '24px',
              py: 3,
              px: 5
            }}
          >
            <Input
              sx={{
                border: 'none',
                outline: 'none',
                p: 0,
                marginRight: '2'
              }}
              id="big-amount"
              type="number"
              step="0.01"
              placeholder="0"
              onChange={handleBidAmountInput}
            />
            <Label sx={{ p: 0, width: 'auto' }} htmlFor="bid-amount">
              MKR
            </Label>
          </Flex>
          <Button
            sx={{ ml: [0, 2], mt: [2, 0] }}
            variant="primary"
            disabled={bidDisabled}
          >
            Bid Now
          </Button>
        </Flex>
        {state.error && <Text variant="smallDanger">{state.error} </Text>}
        <Text variant="small"></Text>
      </Grid> */}
    </Grid>
  );
};
