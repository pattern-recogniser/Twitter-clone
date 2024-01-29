import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let tweetsDataToUse = []
// Get tweetsData from local if present, else using from data.js
// Overwrite tweetsData if present in localStorage
let localTweeetsData = localStorage.getItem("tweetsDataLocal")
if (localTweeetsData){
    tweetsDataToUse = JSON.parse(localTweeetsData)
}
else {
    tweetsDataToUse = tweetsData
}


// After every event, write/ update localStorage to reflect new tweetsData

document.addEventListener('click', function(e){
    const targetObj = e.target
    if(targetObj.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(targetObj.dataset.retweet){
        handleRetweetClick(targetObj.dataset.retweet)
    }
    else if(targetObj.dataset.reply){
        handleReplyClick(targetObj.dataset.reply)
    }
    else if(targetObj.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(targetObj.dataset.newReply){
        handleNewReplyClick(targetObj.dataset.newReply)
    }
    updateLocalStorage()
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsDataToUse.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsDataToUse.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){

    // Show replies if there are any
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsDataToUse.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}
function handleNewReplyClick(tweetId){
    const replyInput = document.getElementById(`reply-${tweetId}`)
    const targetTweetObj = tweetsDataToUse.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    let targetReplyObj = {
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: replyInput.value
    }
    targetTweetObj.replies.unshift(targetReplyObj)
    replyInput.value = ""
    render()
    document.getElementById(`replies-${tweetId}`).classList.remove('hidden')
    
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsDataToUse.forEach(function(tweet){
        
        let newReply = `
            <div class="tweet-reply reply-div">
                <img src="images/scrimbalogo.png" class="profile-pic">
                <textarea id="reply-${tweet.uuid}" placeholder="Post a reply"></textarea>
                <button class="reply-btn" data-new-reply="${tweet.uuid}" >Reply</button>
            </div>
        
        `

        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = newReply
        // Render a reply section always
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

function updateLocalStorage(){
    localStorage.setItem("tweetsDataLocal", JSON.stringify(tweetsDataToUse))
}

render()

