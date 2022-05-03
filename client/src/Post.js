import React from "react";
import "./Post.css";
import Avatar from 'avataaars';
import { generateRandomAvatarOptions } from './avatar';
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatIcon from "@material-ui/icons/Repeat";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import PublishIcon from "@material-ui/icons/Publish";
import DeleteIcon from '@material-ui/icons/Delete';

const Post = React.forwardRef(
  (props, ref) => {
    
    return (
      <div className="post" ref={ref}>
        <div className="post__avatar">
        <Avatar
            style={{ width: '100px', height: '100px' }}
            avatarStyle='Circle'
            {...generateRandomAvatarOptions() }
          />
        </div>
        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
              <h3>
                {props.displayName}{" "}
              </h3>
            </div>
            <div className="post__headerDescription">
              <p>{props.text}</p>
            </div>
          </div>
          <div className="post__footer">
            <ChatBubbleOutlineIcon fontSize="small" />
            <RepeatIcon fontSize="small" />
            <FavoriteBorderIcon fontSize="small" />
            <PublishIcon fontSize="small" />
            {props.personal ? (
              <DeleteIcon fontSize="small" onClick={props.onClick}/>
            ) : ("")}
          </div>
        </div>
      </div>
    );
  }
);

export default Post;