import gql from 'graph-tag';

export const GET_USER = gql`
    {
        user {
            _id
            username
            email
            bookCount
            savedBooks {
                bookID
                title
                authors
                description
                image
                link
            }
        }
    }
`;