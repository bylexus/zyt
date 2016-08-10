const words = [
    // 12 chars per line
    ['IT\'S','A','TWENTY','.'],
    ['OV','TEN','M','FIVE','RA'],
    ['A','V','QUARTER','B','TO'],
    ['HALF','KL','PAST','PJ'],
    ['ONE','TWO','THREE','G'],
    ['FOUR','PM','FIVE','TA'],
    ['SIX','P','SEVEN','TEN'],
    ['EIGHT','RU','NINE','W'],
    ['ELEVEN','TWELVE']
];

const times = {
    minuteForNextHour: 35, // minute when the next hour is already spoken, e.g. 14:25 --> "foif vor halbi drüü"
    always: [[0,0]], // always displayed words
    minutes: {
        0:  [],
        5: [[1,3],[3,2]],
        10: [[1,1],[3,2]],
        15: [[2,0],[2,2],[3,2]],
        20: [[0,2],[3,2]],
        25: [[0,2],[1,3],[3,2]],
        30: [[3,0],[3,2]],
        35: [[0,2],[1,3],[2,4]],
        40: [[0,2],[2,4]],
        45: [[2,0],[2,2],[2,4]],
        50: [[1,1],[2,4]],
        55: [[1,3],[2,4]]
    },
    hours: {
        0: [[8,1]],
        1: [[4,0]],
        2: [[4,1]],
        3: [[4,2]],
        4: [[5,0]],
        5: [[5,2]],
        6: [[6,0]],
        7: [[6,2]],
        8: [[7,0]],
        9: [[7,2]],
        10: [[6,3]],
        11: [[8,0]]
    }
};
export default {
    times,
    words
};
