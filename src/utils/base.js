export default { 
    turnTime(time) {
        var finallTime;
        var num = Math.floor(time / 60);
        if (num < 1) {
            time < 10 ? time = '0' + time : time = time;
            finallTime = '0' + num + ':' + time;
        } else {
            time = time - num * 60;
            time < 10 ? time = '0' + time : time = time;
            num < 10 ? num = '0' + num : num = num;
            finallTime = num + ':' + time;
        }
        return finallTime;
    }
}