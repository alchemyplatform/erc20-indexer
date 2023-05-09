import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useState } from 'react';

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getTokenBalance() {
    const config = {
      apiKey: 'import.meta.env.ALCHEMY_API_KEY',
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);
    const data = await alchemy.core.getTokenBalances(userAddress);

    setResults(data);
    setLoading(true);

    const tokenDataPromises = [];

    for (let i = 0; i < data.tokenBalances.length; i++) {
      const tokenData = alchemy.core.getTokenMetadata(
        data.tokenBalances[i].contractAddress
      );
      tokenDataPromises.push(tokenData);
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setHasQueried(true);
    setLoading(false);
  }
  return (
    <Box w="100vw">
      <Center>
        <Flex
          alignItems={'center'}
          justifyContent="center"
          flexDirection={'column'}
        >
          <Heading mb={0} fontSize={36}>
            ERC-20 Token Indexer
          </Heading>
          <Text>
            Plug in an address and this website will return all of its ERC-20
            token balances!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading mt={42}>
          Get all the ERC-20 token balances of this address:
        </Heading>
        <Input
          onChange={(e) => setUserAddress(e.target.value)}
          color="black"
          w="600px"
          borderRadius={10}
          p={4}
          bgColor="white"
          fontSize={24}
        />
        <Button fontSize={20} onClick={getTokenBalance} mt={36} bgColor="white">
          Check ERC-20 Token Balances
        </Button>

        <Heading my={36}>ERC-20 token balances:</Heading>

        {loading ? (
          <p>Loading...</p>
        ) : (

          hasQueried ? (
            <SimpleGrid w={'90vw'} columns={4} spacing={24}>
              {results.tokenBalances.map((e, i) => {
                return (
                  <Flex
                    flexDir={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    color="black"
                    bg="gray"
                    w={'60vw'}
                    key={e.id}
                  >
                    <Box>
                      <b>Symbol:</b> ${tokenDataObjects[i].symbol}&nbsp;
                    </Box>
                    <Box>
                      <b>Balance:</b>&nbsp;
                      {Utils.formatUnits(
                        e.tokenBalance,
                        tokenDataObjects[i].decimals
                      )}
                    </Box>
                  </Flex>
                );
              })}
            </SimpleGrid>
          ) : (
            'Please make a query! This may take a few seconds...'
          )
        )}
      </Flex>
    </Box>
  );
}

export default App;
