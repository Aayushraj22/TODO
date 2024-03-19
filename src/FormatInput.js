export const TabManager = {
    tabkey: 9,  // ascii value of tab-key

    isTabKey: function (keyevent) {
        return keyevent.keyCode === this.tabkey;
    },

    insertTab: function (element) {     // insert tab in the desired place 
        const value = element.value;
        const pos = this.getCaretPosition(element);
        const preText = value.substr(0, pos);
        const postText = value.substr(pos);

        element.value = preText + '\t' + postText;

        this.setCaretPosition(element, pos + 1);
    },

    enableTab: function (keyevent) {
        const element = keyevent.target;

        if (this.isTabKey(keyevent)) {
            this.insertTab(element);
            this.blockKeyEvent(keyevent)
        }
    },

    getCaretPosition: function (item) {
        let pos = 0;

        // Firefox, Chrome, IE9~ Support
        if (item.selectionStart || item.selectionStart === '0') {
            pos = item.selectionStart;
        }
        // ~IE9 Support (yet, not fully tested)
        else if (document.selection) {
            item.focus();
            var sel = document.selection.createRange();
            sel.moveStart('character', -item.value.length);
            pos = sel.text.length;
        }

        return pos;
    },

    setCaretPosition: function (item, pos) {
        // Firefox, Chrome, IE9~ Support
        if (item.setSelectionRange) {
            item.focus();
            item.setSelectionRange(pos, pos);
        }
        // ~IE9 Support
        else if (item.createTextRange) {
            var range = item.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    },

    // prevent the default behaviour of key-press, below code is compatible with all the browser(inclusive old brows)
    blockKeyEvent: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }

}