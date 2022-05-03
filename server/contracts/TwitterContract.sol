// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.4;

/**
 * @title Twitter Contract
 * @dev Store & retrieve the value in a variable
 */

/**
 * Contract in Solidity is similar to a Class in C++. A Contract has the following properties.
 * Constructor − A special function declared with the `constructor` keyword which will be executed once per contract and is invoked when a contract is created.
 * State Variables − Variables per Contract to store the state of the contract.
 * Functions − Functions per Contract that can modify the state variables to alter the state of a contract.
 */
contract TwitterContract {
    /**
        Event is an inheritable member of a contract. An event is emitted, it stores the arguments passed in transaction logs.
        These logs are stored on the blockchain and are accessible using the address of the contract till the contract is present on the blockchain.
        An event generated is not accessible from within contracts, not even the one that has created and emitted them.   
     */

    // Declaring Events:-
    event AddTweet(address recipient, uint256 tweetId);
    event DeleteTweet(uint256 tweetId, bool isDeleted);

    // Lets define a new data type (i.e object in other programming language) using:-
    struct Tweet {
        uint256 id;
        address username;
        string tweetText;
        bool isDeleted;
    }

    Tweet[] private tweets; // Dynamic array declaration syntax: " type[] scope arrayName; " ---here data `type` is of `struct Tweet{...}`
    // "tweets" is "State Variable{Variables whose values are permanently stored in the contract storage in a compact way}"(i.e one of the 3 types of Variables in Solidity)
    // with "private scope/visibility {Private functions/ Variables can only be used internally and not even by derived contracts.}"

    /*
      Mapping of Tweet id to the wallet address of the user
    */
    mapping(uint256 => address) tweetToOwner; // syntax:- mapping(_KeyType => _ValueType)

    // _KeyType − can be any built-in type or bytes and string. No reference type or complex objects are allowed.
    // _ValueType − can be any type.
    // Mapping can only have one type of storage and is generally used for state variables.
    // Mapping can be marked `public` and Solidity automatically creates the `getter()` method for it.

    /* 
      Method to be called by our frontend when trying to add a new Tweet(i.e writing or creating a block on the blockchain,
      hence this will cost some gas fee that's why we used only `external` as scope/visibility and not `external view`)
    */
    // Basic `function` syntax:-
    /*  function function-name(parameter-list) scope returns(_Type _holdingType) {
            //statements
        } */
    /* here _holdingType can be 'storage' holds state variables persistently in the HDD or SDD and costs gas fee.
                             or 'memory' holds local variables defined within the function(...) temporarily in the RAM and costs no gas fee.*/
    // Below function has `external(i.e scope/visibility)` which means this function are meant to be called by other contracts.
    // They cannot be used for internal call. To call external function within contract this.function_name() call is required.
    // State variables cannot be marked as external..
    function addTweet(string memory tweetText, bool isDeleted) external {
        uint256 tweetId = tweets.length;
        // adding a Tweet(id=tweetId, address=msg.sender, tweetText=tweetText, isDeleted = isDeleted) to the 'tweets' array using `.push(...)`
        tweets.push(Tweet(tweetId, msg.sender, tweetText, isDeleted));
        tweetToOwner[tweetId] = msg.sender; // storing 'tweetId' in the `tweetToOwner` 'map'. Hence, (`tweetId`=>msg.sender) {i.e (uint256 => address)}.
        emit AddTweet(msg.sender, tweetId); // this event tells to add a new block to our blockchain using these data which costs some gas fee.
    }

    /* 
      Method to get all the Tweets(i.e viewing or reading which means not creating any block on the blockchain,
      hence this will not cost any gas fee that's why we used `external view` as scope/visibility and not `external`)
    */
    /* Below function has `external view(i.e scope of this function is only for external view or reading)` which means this function will throw ERROR/WARNING 
    if we want to execute the following functionalities using this function:-
        -Modifying state variables.
        -Emitting events.
        -Creating other contracts.
        -Using self-destruct.
        -Sending Ether via calls.
        -Calling any function which is not marked view or pure.
        -Using low-level calls.
        -Using inline assembly containing certain opcodes.
    Getter method are by default view functions.*/
    function getAllTweets() external view returns (Tweet[] memory) {
        Tweet[] memory temporary = new Tweet[](tweets.length); // creating new temporary array of type Tweet[] and of size equal to tweets array length.

        // below code is for counting the total number of non-deleted tweets done by all people..
        uint256 counter = 0;
        for (uint256 i = 0; i < tweets.length; i++) {
            if (tweets[i].isDeleted == false) {
                temporary[counter] = tweets[i];
                counter++;
            }
        }

        // below code is for getting all the non-deleted Tweets by all people.
        Tweet[] memory result = new Tweet[](counter);
        for (uint256 i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    /* 
      Method to get only your Tweets(i.e viewing or reading which means not creating any block on the blockchain,
      hence this will not cost any gas fee that's why we used `external view` as scope/visibility and not `external`)
    */
    function getMyTweets() external view returns (Tweet[] memory) {
        Tweet[] memory temporary = new Tweet[](tweets.length); // creating new temporary array of type Tweet[] and of size equal to tweets array length.

        // below code is for counting the total number of non-deleted tweets by me/owner i.e finding by `tweetToOwner` mapping.
        uint256 counter = 0;
        for (uint256 i = 0; i < tweets.length; i++) {
            if (tweetToOwner[i] == msg.sender && tweets[i].isDeleted == false) {
                temporary[counter] = tweets[i];
                counter++;
            }
        }

        // below code is for getting all the non-deleted Tweets by me/owner.
        Tweet[] memory result = new Tweet[](counter);
        for (uint256 i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    /*
      Method to Delete a Tweet(i.e writing or creating or deleting block on the blockchain,
      hence this will cost some gas fee that's why we used only `external` as scope/visibility and not `external view`)
    */
    function deleteTweet(uint256 tweetId, bool isDeleted) external {
        if (tweetToOwner[tweetId] == msg.sender) {
            tweets[tweetId].isDeleted = isDeleted;
            emit DeleteTweet(tweetId, isDeleted); // this event tells to delete the tweet from the blockchain
        }
    }
}