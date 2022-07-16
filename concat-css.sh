mkdir dist/styles -p;
mkdir dist/assets/fonts -p;

rsync styles/library.blocks/fontawesome-free-6.1.1-web/ \
        dist/assets/fontawesome-free-6.1.1-web -r;

cat  \
        styles/library.blocks/fontawesome-free-6.1.1-web/css/all.min.css \
        styles/site-variables.colors.css \
        styles/common.blocks/general.css \
        styles/common.blocks/button/button.css \
        styles/common.blocks/tag.css \
        styles/common.blocks/form/form.css \
        styles/common.blocks/menu/menu.css \
        styles/common.blocks/popup/popup.css \
        styles/common.blocks/input-group/input-group.css \
        styles/common.blocks/input-group/input-group_minimalist.css \
        styles/common.blocks/text-editor/text-editor.css \
        styles/common.blocks/image-upload/image-upload.css \
        styles/common.blocks/book-cover/book-cover.css \
        styles/common.blocks/book-cover/book-cover_list-item.css \
        styles/common.blocks/book-cover/book-cover_thumbnail.css \
        styles/common.blocks/book-cover/home-page.book-cover.css \
        styles/common.blocks/token/token.css \
        styles/other.css \
        styles/book.page.css \
        styles/reader.css \
        > dist/styles/min.css
