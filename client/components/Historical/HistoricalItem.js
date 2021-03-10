import {  Comment } from 'semantic-ui-react'

const HistoricalItem = (props) => {
    return (
        <Comment>
                <Comment.Content>
                    <Comment.Author as='a'>{props.item.voter}</Comment.Author>
                    <Comment.Metadata>
                    <div>{props.item.timestamp}</div>
                    </Comment.Metadata>
                    <Comment.Text> a voté pour « {props.item.proposal_title} »</Comment.Text>
                </Comment.Content>
        </Comment>
    )
}

export default HistoricalItem;