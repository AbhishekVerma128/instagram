import {React, useEffect, useState } from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { RiCloseLine } from "react-icons/ri";
import {  toast } from 'react-toastify';
import {Link} from "react-router-dom"
import {useNavigate } from "react-router-dom";
const MyfollowingPost = ()=>{
    const [allPost, setAllPost] = useState([]);
    const [comment, setComment] = useState("");
    const [showComment, setShowComment] = useState(false)
    const [commentPic, setCommentPic] = useState([]);
   // console.log(card);
    const navigate = useNavigate();
    useEffect(()=>{
        const token  = localStorage.getItem('jwt');
        if(!token){
            navigate('/signup');
        }
        //fetching all the posts of following users

        fetch("https://instagram-clone-trzg.onrender.com/myfollowingpost",{
            headers: {
                "Authorization": "Bearer " + token
            },
        } ).then(res => res.json())
        .then((result)=>{
            console.log(result);
            setAllPost(result.followingPost)})
        .catch(err=>console.log(err))
    },[])
    // view and hide comment
    const viewComments = (post)=>{
        if(showComment){
            setShowComment(false)
        }
        else{
            setShowComment(true)
            setCommentPic(post)
            //console.log(commentPic.comments);
        }
    }
     // toast function
     const notifyError = (msg) => toast.error(msg);
     const notifyMsg = (msg)=>toast.success(msg)
 
// like post
    const likePost = (id)=>{
        fetch("https://instagram-clone-trzg.onrender.com/likes", {
            method: "put",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt"),
            },
            body : JSON.stringify({
                postId:id
            })
        }).then(res=>res.json()).then((result)=>{
        //    console.log(result);
            const newData = allPost.map((post)=>{
                //console.log(result.likes);
                if(post._id===result.likes._id){
                    return result.likes
                }
                else{
                    return post;
                }
            })
            setAllPost(newData);
        }).catch(e=>console.log(e))
    }
// unlike post
    const unlikePost = (id) => {
        fetch("https://instagram-clone-trzg.onrender.com/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json()).then((result) =>{
           //console.log(result);
            const newData = allPost.map((post)=>{
                //console.log(post._id);
                if(post._id===result.likes._id){
                    return result.likes
                }
                else{
                    return post;
                }
            })
            setAllPost(newData);
        } ).catch(e => console.log(e))
    }
    // function to post comment
    const PostComment = (text, id)=>{
        // console.log(comment);
        fetch("https://instagram-clone-trzg.onrender.com/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                text: text,
                postId: id
            })
        }).then(res => res.json()).then((result) =>{
            ///console.log(result.newComment);
            setComment("")
            const newData = allPost.map((post)=>{
                if(post._id===result.newComment._id){
                    return result.newComment
                }
                else{
                    return post;
                }
            })
            notifyMsg("commented successully")
            setAllPost(newData);
           //console.log(result);
        } ).catch(e => console.log(e))
    }
   if(allPost){
    return(
        <div className="home">
            {/* card */}
            {allPost.map((post,index)=>{
                //console.log(post);
                return(
                    <div className="card">
                <div className="card-Header">
                    <div className="card-pic">
                        <img src={require('../../imgs/boy1.jpg')} alt="" />
                    </div>
                    <Link to={`/userProfile/${post.postedBy._id}`} style={{textDecoration: "none" , color: "black"}}>
                        <h5 >{post.postedBy.name}</h5>
                        </Link>
                </div>
                <div className="card-image">
                    <img src={post.photo} alt="" />
                </div>
                <div className="card-content">
                    {
                        post.likes.includes(JSON.parse(localStorage.getItem("user"))._id)?(<span onClick={()=>{unlikePost(post._id)}}><FavoriteIcon className="" style={{color: "red", fontSize: "35px", marginLeft: "10px" ,cursor: "pointer"}}/></span>)
                        :(<span ><FavoriteBorderIcon onClick={()=>{likePost(post._id)}} style={{fontSize: "35px",cursor: "pointer"}} /></span>)
                    }
                    <p>{post.likes.length} likes</p>
                    <p>{post.caption}</p>
                    <p onClick={()=>{viewComments(post)}} style={{fontWeight: "bold", cursor:'pointer'}}>view all comments</p>
                </div>
                <div className="card-comment">
                    <span><AddReactionIcon /></span>
                    <input type="text" placeholder='Add a comment...' value={comment} onChange={(e)=>{setComment(e.target.value)}} />
                    <button onClick={()=>{PostComment(comment, post._id)}} className="comment-btn">Post</button>
                </div>
            </div>
                )
            })}
            {/*show comment  */}
           {
            showComment && (
                 <div className="show-comment">
                <div className="comment-container">
                    <div className="post-pic">
                        <img src={commentPic.photo} alt="" />
                    </div>
                    <div className="comment-details">
                        {/* comment header */}
                        <div className="card-Header" >
                            <div className="card-pic">
                                <img src={require('../../imgs/boy1.jpg')} alt="" />
                            </div>
                            <h5>{commentPic.postedBy.name}</h5>
                        </div>
                        {/* comment section */}
                        <div className="comment-section">
                            {commentPic.comments.map((newcomment)=>{
                                return(
                                    <p className="comm"><span className="commenter" style={{fontWeight: "bolder"}}>
                                        {newcomment.postedBy.name}{" "}</span>
                                        <span className="commentText">{newcomment.comment}</span>
                                    </p>
                                );
                            })}
                        </div>
                        <div className="card-content">
                            <p>{commentPic.likes.length} likes</p>
                            <p>{commentPic.caption}</p>
                        </div>
                        {/* add comment */}
                        <div className="card-comment">
                            <span><AddReactionIcon /></span>
                            <input type="text" placeholder='Add a comment...' value={comment} onChange={(e) => { setComment(e.target.value) }} />
                            <button onClick={()=> {PostComment(comment,commentPic._id ); viewComments()} } className="comment-btn">Post</button>
                        </div>
                    </div>
                </div>
                {/* close comment */}
                <div className="close-comment" onClick={viewComments}>
                    <span style={{fontSize: "40px" , cursor: "pointer"}} ><RiCloseLine /></span>
                </div>
            </div>
            )
           }
        </div>
    )
   }
   
 }
 export default MyfollowingPost