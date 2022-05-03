import React from "react";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Widgets from "./Widgets";
import "./App.css";

function App() {
  // for more simpler understanding of "useState()" read this :- https://www.w3schools.com/REACT/react_usestate.asp
  const [currentAccount, setCurrentAccount] = React.useState(''); // for storing account address. 
  const [correctNetwork, setCorrectNetwork] = React.useState(false); // for storing correct network connection(i.e Rinkeby in our case). 

  // Now creating a method for Calling Metamask to connect wallet on clicking Connect Wallet button(here we will show a button when the person is loged out so as to connect to the metamask)
  const connectWallet = async() => {
    try {
      const ethereum = window // for fetching ethereum from our window, for each event(such as addTweet() or deleteTweet())

      // for checking Metamask connection
      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }

      // Now, if we are connected to Metamask, then below code will check that whether we are connected to the correct network or not!, by using "chainID"(= 4 for Rinkeby Test Network)
      let chainId = await ethereum.request({ method: 'eth_chainId'})
      console.log('Connected to chain:' + chainId)

      const rinkebyChainId = '0x4'; // this variable is used for checking if the chainId starts with `0x4` which you can learn more here:-
      // "https://docs.metamask.io/guide/ethereum-provider.html#chain-ids"

      if (chainId !== rinkebyChainId) {
        alert('You are not connected to the Rinkeby Testnet!')
        setCorrectNetwork(false);
      } else {
        setCorrectNetwork(true);
      }

      // if we are connected to Metamask and also connected to right testnet (i.e Rinkeby) then fetch the account
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Found account', accounts[0])
      setCurrentAccount(accounts[0]);
    } catch (error) {      
      console.log('Error connecting to metamask', error);
    }
  }
    

  // for more simpler understanding on "useEffect(()=>{})" read this:- https://www.w3schools.com/REACT/react_useeffect.asp
  React.useEffect(() => {
    connectWallet();
  }, []);

  return (
    // BEM convention
    // below we used "Nested Conditional (ternary) operator" for more simpler understanding read this:- 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator#conditional_chains
    <div className="app">
      {// checking if the "currentAccount" is empty or not
          currentAccount === '' ? <button className='text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out' onClick={connectWallet}>
                                    Connect Wallet 
                                  </button>
        
        // then we check "correctNetwork"                      
        : correctNetwork        ? <div className="app">
                                    <Sidebar />
                                    <Feed />
                                    <Widgets />
                                  </div> 
        : <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
            <div>----------------------------------------</div>
            <div>Please connect to the Rinkeby Testnet</div>
            <div>and reload the page</div>
            <div>----------------------------------------</div>
          </div>
      }
    </div>

  );
}

export default App;
