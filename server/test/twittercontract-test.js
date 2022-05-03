// need to import some dependencies such as chai and hardhat.

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Twitter Contract", function() {
  let Twitter;
  let twitter;
  let owner;
  
  //Let say here we have total number of 8 tweets and those are in following way:- 
  const TOTAL_NUM_NOT_MY_TWEETS = 5;
  const TOTAL_NUM_MY_TWEETS = 3;

  let totalTweets;
  let totalMyTweets;

  //here we are trying to tell what to do `before each unit tests`
  beforeEach(async function() {
    Twitter = await ethers.getContractFactory("TwitterContract"); // getting the contract and assigning it to the `Twitter` variable.
    [owner, addr1, addr2] = await ethers.getSigners(); // here we are testing our contract with more than one user/signers including owner.
    twitter = await Twitter.deploy(); // deploying the contract and assigning it to the `twitter` variable.

    // inititalizing the two arrays.
    totalTweets = []; 
    totalMyTweets = [];
    
    //Adding some dummy tweets to the contract and calculating "TOTAL_NUM_NOT_MY_TWEETS" 
    for(let i=0; i<TOTAL_NUM_NOT_MY_TWEETS; i++) {
      let tweet = {
        'tweetText': 'Random text with id:- ' + i,
        'username': addr1,
        'isDeleted': false
      };

      await twitter.connect(addr1).addTweet(tweet.tweetText, tweet.isDeleted);
      totalTweets.push(tweet);
    }

    //Adding some dummy tweets to the contract and calculating "TOTAL_NUM_MY_TWEETS"
    for(let i=0; i<TOTAL_NUM_MY_TWEETS; i++) {
      let tweet = {
        'username': owner,
        'tweetText': 'Random text with id:- ' + (TOTAL_NUM_NOT_MY_TWEETS+i),
        'isDeleted': false
      };

      await twitter.addTweet(tweet.tweetText, tweet.isDeleted);
      totalTweets.push(tweet);
      totalMyTweets.push(tweet);
    }
  });

  // Now testing our first method `i.e addTweet(...)` by adding some dummy tweet.  
  describe("Add Tweet", function() {
    it("should emit AddTweet event", async function() {
      let tweet = {
        'tweetText': 'New Tweet',
        'isDeleted': false
      };

      await expect(await twitter.addTweet(tweet.tweetText, tweet.isDeleted)
    ).to.emit(twitter, 'AddTweet').withArgs(owner.address, TOTAL_NUM_NOT_MY_TWEETS + TOTAL_NUM_MY_TWEETS);
    })
  });

  
  describe("Get Tweets", function() {
    // Now testing our second method `i.e getAllTweets()`.
    it("should return the correct number of total tweets", async function() {
      const tweetsFromChain = await twitter.getAllTweets();
      expect(tweetsFromChain.length).to.equal(TOTAL_NUM_NOT_MY_TWEETS+TOTAL_NUM_MY_TWEETS);
    })

    // Now testing our second method `i.e getMyTweets()`
    it("should return the correct number of all my tweets", async function() {
      const myTweetsFromChain = await twitter.getMyTweets();
      expect(myTweetsFromChain.length).to.equal(TOTAL_NUM_MY_TWEETS);
    })
  })

  // Now testing our second method `i.e deleteTweets()` 
  describe("Delete Tweet", function() {
    it("should emit delete tweet event", async function() {
      const TWEET_ID = 0;
      const TWEET_DELETED = true;

      await expect(
        twitter.connect(addr1).deleteTweet(TWEET_ID, TWEET_DELETED)
      ).to.emit(twitter, 'DeleteTweet').withArgs(TWEET_ID, TWEET_DELETED);
    })
  })
});