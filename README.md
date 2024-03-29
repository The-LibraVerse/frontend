# Libraverse
Libraverse is a platform for writers and readers alike. Libraverse implements the use of several web3 technologies to help writers publish and keep their books.


## Working Demo
[Libraverse website](https://libraverse.adesuwa.dev)

## Technologies Used
### IPFS
Libraverse uses IPFS to ensure that writers have access to their content even if the website goes down. It does this in several ways.

#### Store Chapter Content on IPFS
Libraverse stores the content of every chapter created on IPFS. See [Implementation](https://github.com/The-LibraVerse/frontend/blob/77c4b75675eace9e49f8257d2f12e11ce82204bd/shared_components/chapterEditor.vue.js#L36).

An author is always presented with the links to the content every time they view their book. Only a book's author will get these links.
Other users can only access the book on Libraverse.
<div>
<img style='width:400px' src="/documentation/assets/book-chapters-with-ipfs-urls.png" alt="IPFS urls for each chapter is presented to the author" />
<img style='width:400px' src="/documentation/assets/notice-and-chapter-list-no-ipfs.png" alt="Book chapter list: IPFS urls are not included to other users"/>
</div>

#### Store Book and Chapter Cover Images on IPFS
Libraverse stores book anad chapter cover images on IPFS.

#### Store Metadata Of Published Books
Libraverse uses [ERC1155s](#ERC1155_tokens) and IPFS to facilitate the "sale" of a book.
First, Libravere stores the metadata for the token on IPFS. A book can only be sold if it has been published. When a book is published, Libraverse creates a metadata following the ERC1155 metadata standard for the on IPFS. See [PublishBook](https://github.com/The-LibraVerse/server/blob/ce31698bbf20f87b2f0994037dad1dc288894b6c/src/books/book.js#L156) and [PublishChapter](https://github.com/The-LibraVerse/server/blob/ce31698bbf20f87b2f0994037dad1dc288894b6c/src/books/book.js#L156).
When an author clicks `Sell Book`, Libraverse creates a token on the ethereum blockchain, with the metadata uri of the book.

### ERC1155 Tokens
After creating and publishing a book, a writer can create and ERC1155 tokens to sell. The writer can mint as many initial copies of the token as they like. Libraverse however, does not handle distribution or sale of tokens and leaves that up to the writer.
When a reader views a book that has been put for sale in this way, they will either get the book's content, or a notice if they do not have the ERC1155 token that was created and minted by the writer.

The current ERC1155 token been used for the books is deployed on ropsten at [0x625B1D616078160D5Cb0E190cD55504Be32fdbF4](https://ropsten.etherscan.io/address/0x625B1D616078160D5Cb0E190cD55504Be32fdbF4#code)

![User does not have the token required to read the book](/documentation/assets/book-notice_no-token.png)

## Features
### Book Cover Creator
Libraverse has a basic image editor for creating book covers. A user can set a background image, or a backgroud color, and type some text over the background.
The book cover can be downloaded.
<div>
<img src="/documentation/assets/image-editor_bg_text.png" alt="Book Cover Image Creator: Blue background with black and orange text on it" />
</div>
