import {tweetsData, updateTweetsData} from "./data.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';









document.addEventListener("click", function(e){

    if(e.target.dataset.like){
    handleLike(e.target.dataset.like);
    }
    else if (e.target.dataset.retweet){
    handleRetweet(e.target.dataset.retweet);
    
    } 
    else if (e.target.dataset.reply){

    handleReply(e.target.dataset.reply);
    }
    else if (e.target.id === "tweet-btn"){
    tweetBtnClick();
    } 
   
})



// function for handling like icon
function handleLike(clickedTweetId){
    
    //creating an object (tweetClickObj) that stores only that tweet 
    // which like btn has been clicked
 let tweetClickedObj = tweetsData.filter(tweet=>{
    return tweet.uuid === clickedTweetId;
 })[0]
  if (tweetClickedObj.isLiked){

    tweetClickedObj.likes--;
    // tweetClickedObj.isLiked = false ;
  }else {
    tweetClickedObj.likes++;
    // tweetClickedObj.isLiked = true ;
    }
    tweetClickedObj.isLiked = !tweetClickedObj.isLiked;
    updateTweetsData(clickedTweetId, tweetClickedObj.likes);
  renderTweets();
}



// function for handling retweet icon
function handleRetweet(clickedTweetId){
    

 let tweetClickedObj = tweetsData.filter(tweet=>{
    return tweet.uuid === clickedTweetId;
 })[0]
  if (tweetClickedObj.isRetweeted){

    tweetClickedObj.retweets--;
    tweetClickedObj.isRetweeted = false ; 
  }else {
    tweetClickedObj.retweets++;
    tweetClickedObj.isRetweeted = true ;
 }

renderTweets();
}



function handleReply(clickedTweetId){
    let tweetWithReply = document.getElementById(`replies-${clickedTweetId}`)
    tweetWithReply.classList.toggle("hidden");

    const tweetArea = document.getElementById("reply-tweet-area");
    const relpyTweetBtn = document.getElementById("reply-tweet-btn");

    relpyTweetBtn.addEventListener("click", function(){
   
    let tweetClickedObj = tweetsData.filter(tweet=>{
        return tweet.uuid === clickedTweetId;
     })[0]
    console.log(typeof(tweetClickedObj.replies))
   
    if(tweetArea.value){
        tweetClickedObj.replies.unshift(
            {
        handle: `Mona`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: tweetArea.value,
        }
        )
    };
    
    
    renderTweets();
    // tweetWithReply.classList.toggle("hidden");
   
});
}



// function for handling our tweet btn
function tweetBtnClick(){
    // const tweetBtn = document.getElementById("tweet-btn");
    const tweetArea = document.getElementById("tweet-area");
    if(tweetArea.value){
        // unshift pushes our data to tweetsdata array but at the end
        tweetsData.unshift({
        handle: `Mona`,
        profilePic: `images/scrimbalogo.png`,
        likes:1,
        retweets: 3,
        tweetText: tweetArea.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4(),
        })
    };
    // rendering out our nes set of tweetsdata
    
    renderTweets();
    tweetArea.value='';
}



// function for converting data and making html
// plus we have stored in all our icon the uuid of each post.
function tweetInnerhtml(){
   
    let tweetArray=  tweetsData.map(tweet=>{
        // condition for adding a class in icon like and calling it in our html in java
        let newLikeClass = tweet.isLiked ? "liked":"";
        // conditon for adding a class in icon retweet and calling it in our html in java
        let newRetweetClass = tweet.isRetweeted ? "retweeted":"";
        // adding replies where there are replies in our data.
        let replyTweetHtml=[]   
        if (tweet.replies.length > 0) {
            replyTweetHtml = tweet.replies.map((reply, index) => {
                let replyHtml = `<div class="tweet-reply">
                                    <div class="tweet-inner">
                                        <img src="${reply.profilePic}" class="profile-pic">
                                        <div>
                                            <p class="handle">${reply.handle}</p>
                                            <p class="tweet-text">${reply.tweetText}</p>
                                        </div>
                                    </div>
                                </div>`;
                if (index === tweet.replies.length -1) {
                    replyHtml += `<div class="tweet-reply">
                                    <img src="images/scrimbalogo.png" class="profile-pic">
                                    <textarea placeholder="What's happening?" id="reply-tweet-area"></textarea>
                                    <button id="reply-tweet-btn">Tweet</button>
                                </div>`;
                }
                return replyHtml;
            }).join("");
        }
    



       return `<div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="detail-tweet">
                            <span class="tweet-icon">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-icon">
                                <i class="fa-solid fa-heart ${newLikeClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-icon">
                                <i class="fa-solid fa-retweet ${newRetweetClass}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${replyTweetHtml }
                </div>   
   </div>`;
                 
    }).join("");
    return tweetArray

}

// function for taking html funtion and displaying it on the screen.
function renderTweets(){
    let feeds = document.getElementById("feed");
    return feeds.innerHTML= tweetInnerhtml();
}
renderTweets();

// Function to store data to local storage
// function storingData() {
//     localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
// }

// document.addEventListener("DOMContentLoaded", function() {
//     // Load data from localStorage and changing it back to array
//     let storedDataString = localStorage.getItem("tweetsData");
    
//     if(storedDataString){
//         tweetsData = JSON.parse(storedDataString);
//     }
    
//     // Render tweets
//     renderTweets();
// });