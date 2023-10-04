class Player {

    constructor(videoElement, args, src=null) {
        this.mediaObject = document.querySelector(videoElement);
        this.args = args;
        this.setupMediaPlayer();
        this.src = src;
        if(this.src != null) {
            this.mediaObject.src = src;
        }
    }

    setupMediaPlayer() {
        if(this.args.autoplay === true) {
            this.mediaObject.autoplay = true;
        }
        if(this.args.loop === true) {
            this.mediaObject.loop = true;
        }
    }

    setSrc() {  

    }

    play() {
        this.mediaObject.play();
    }

    pause() {
        this.mediaObject.pause();
    }

    getCurrentTime() {
        return this.mediaObject.currentTime;
    }


}

//module.exports = Player;