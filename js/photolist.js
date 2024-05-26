class PhotoList {
    max_len = 50
    filler = 10
    refresh_val = 5
    init = false
    constructor(path) {
        this.path = path
        this.fileList = [
            "assets/temp.png",
            "assets/temp.png",
            "assets/temp.png",
            "assets/temp.png"
        ]
        // this.refresh_fileList()
    }


    // How to make popping and then concat on low number???

    async refresh_fileList() {
        var newFileList = await this.read_json() 
        var outFileList
        if (newFileList.length > 0) {
            var lastElement = this.fileList[this.fileList.length - 1]
            // console.log(lastElement)
            var lastElIdx = newFileList.indexOf(lastElement)
            if (lastElIdx < 0) {
                outFileList = newFileList
            }
            else {
                outFileList = this.fileList.concat(newFileList.slice(lastElIdx, newFileList.length - 1))
                if (newFileList.length - 1 - lastElIdx < this.filler - this.refresh_val) {
                    if (newFileList.length > this.max_len) {
                        outFileList = outFileList.concat(newFileList.slice(newFileList.length - this.max_len, newFileList.length))
                    }
                    else {
                        outFileList = outFileList.concat(newFileList)
                    }
                }
                // else {
                //     outFileList = this.fileList.concat(newFileList.slice(lastElIdx, newFileList.length - 1))
                // }
            }

            // outFileList = newFileList
            if (outFileList.length < this.filler) {
                var outFileListLength = outFileList.length
                while (outFileListLength < this.filler) {
                    outFileList = outFileList.concat(newFileList)
                    outFileListLength = outFileList.length
                }
            }
            // if (outFileList.length > this.max_len) {
            //     outFileList = outFileList.slice(outFileList.length - this.max_len, outFileList.length)
            // }
            // console.log(outFileList)

        }
        else {
            outFileList = this.fileList
            if (this.fileList.length < this.filler) {
                var outFileListLength = outFileList.length
                while (outFileListLength < this.filler) {
                    outFileList = outFileList.concat(newFileList)
                    outFileListLength = outFileList.length
                }
                outFileList = outFileList.slice(0, this.min_len)
            }
        }
        this.fileList = outFileList
    }

    async read_json() {
        let promises = await fetch('assets/file_list.json')
            .then(res => res.json())
            .catch((error) => [])
            .then(data => data)
        var content = await Promise.all(promises);
        return content
    }

    async getNext() {
        if (!this.init) {
            await this.refresh_fileList()
            this.init = true
        }
        // console.log(this.fileList)
        var elem = this.fileList.shift()
        if (this.fileList.length < this.refresh_val) {
            await this.refresh_fileList()
        }
        if (!elem.startsWith("assets/")) {
            elem = "assets/photos/".concat(elem)
        }
        return elem
    }

    async setNext(obj) {
        // console.log(obj)
        obj.src = await this.getNext()
    }

    async setNextAtHeight(obj, height) {
        obj.style.transform = 'translateY('.concat(height.toString()).concat('px)')
        console.log(obj)
        obj.children[0].src = await this.getNext()
        // console.log(obj.children.length)
        // let top = 0;
        // for (let i = 0; i < obj.children.length - 1; i++) {
        //     obj.children[i].children[0].src = obj.children[i + 1].children[0].src
        //     // console.log(obj.children[i])
        //     obj.children[i].style.transform = 'translate(0px, '.concat(top.toString()).concat('px)')
        //     top += heights[i]
        // }
        // obj.children[obj.children.length - 1].children[0].src = await this.getNext()
        // obj.children[obj.children.length - 1].style.transform = 'translate(0px, 0px)'
    }

    async shiftAndSetNext(obj, heights) {
        // obj.src = await this.getNext()
        // console.log(obj.children.length)
        let top = 0;
        for (let i = 0; i < obj.children.length - 1; i++) {
            obj.children[i].children[0].src = obj.children[i + 1].children[0].src
            // console.log(obj.children[i])
            obj.children[i].style.transform = 'translate(0px, '.concat(top.toString()).concat('px)')
            top += heights[i]
        }
        obj.children[obj.children.length - 1].children[0].src = await this.getNext()
        obj.children[obj.children.length - 1].style.transform = 'translate(0px, 0px)'
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
