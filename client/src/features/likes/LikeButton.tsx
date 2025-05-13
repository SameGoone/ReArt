// client/src/features/likes/LikeButton.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { LikesInfo } from '../../app/models/likesInfo';
import agent from '../../app/api/agent';

interface Props {
    likesInfo: LikesInfo | null;
    size: number;
    postId: string;
    style?: React.CSSProperties;
    enabled?: boolean;
}

export default observer (function LikeButton({
    likesInfo,
    size,
    postId,
    style,
    enabled = true
}: Props) {
    const heartImage = likesInfo?.isLiked
        ? `/assets/likes/heart-filled.svg`
        : `/assets/likes/heart-empty.svg`;
    const textSize = Math.round(size * 0.6);
    const { postStore } = useStore();

    const handleLikeClick = () => {
        if (likesInfo?.isLiked) {
            agent.Likes.delete(postId)
                .then(likesInfo => {
                    postStore.updatePostLikes(postId, likesInfo);
                });
        }
        else {
            agent.Likes.create(postId)
                .then(likesInfo => {
                    postStore.updatePostLikes(postId, likesInfo);
                });
        }
    };

    return (
        <button onClick={handleLikeClick}
            disabled={!enabled}
            style={{
                display: 'flex',
                alignItems: 'center',
                border: 'none',
                background: 'none',
                padding: 0,
                cursor: 'pointer',
                ...style
        }}>
            <img src={heartImage} alt="Like" width={size} height={size} />
            <span style={{
                fontSize: `${textSize}px`,
                marginLeft: '0.25em',
                fontWeight: 'bold',
                color: likesInfo?.isLiked ? 'red' : 'inherit'
            }}>
                {likesInfo?.count || 0}
            </span>
        </button>
    );
});