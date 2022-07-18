# Libraverse
Libraverse is a platform for writers and readers alike. Libraverse implements the use of several web3 technologies to help writers publish and keep their books.


## Working Demo
[Libraverse website](https://libraverse.adesuwa.dev)

## Technologies Used
### IPFS
Libraverse uses IPFS in several ways.

- To store and retrieve chapter content
- To store book/chapter cover images - Book/chapter metadata of a book or a chapter that is being sold is stored IPFS
- To store the metadata books and chapters that are being sold on the ethereum blockchain

### ERC1155 Tokens
After creating and publishing a book, a writer can create and ERC1155 tokens to sell. The writer can mint as many initial copies of the token as they like. Libraverse however, does not handle distribution or sale of tokens and leaves that up to the writer.
When a reader views a book that has been put for sale in this way, they will either get the book's content, or a notice if they do not have the ERC1155 token that was created and minted by the writer.

![User does not have the token required to read the book](/documentation/assets/book-notice_no-token.png);
