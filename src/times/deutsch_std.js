const words = [
    // 12 chars per line
    ['ES','K','IST','A','FÜNF','P'],
    ['ZEHN','K','VIERTEL'],
    ['ZWANZIG','MK','VOR'],
    ['L','NACH','M','HALB','KB'],
    ['EINS','ZWEI','DREI'],
    ['VIER','PM','FÜNF','TA'],
    ['SECHS','P','SIEBEN'],
    ['ACHT','RU','NEUN','LW'],
    ['ZEHN','PMA','ELF','LW'],
    ['TAZ','ZWÖLF','PAT','.']
];

const times = {
    minuteForNextHour: 25, // minute when the next hour is already spoken, e.g. 14:25 --> "foif vor halbi drüü"
    always: [[0,0],[0,2]], // always displayed words
    minutes: {
        0:  [],
        5: [[0,4],[3,1]],
        10: [[1,0],[3,1]],
        15: [[1,2],[3,1]],
        20: [[2,0],[3,1]],
        25: [[0,4],[2,2],[3,2]],
        30: [[3,2]],
        35: [[0,4],[3,1],[3,2]],
        40: [[2,0],[2,2]],
        45: [[1,2],[2,2]],
        50: [[1,0],[2,2]],
        55: [[0,4],[2,2]]
    },
    hours: {
        0: [[9,1]],
        1: [[4,0]],
        2: [[4,1]],
        3: [[4,3]],
        4: [[5,0]],
        5: [[5,2]],
        6: [[6,0]],
        7: [[6,2]],
        8: [[7,0]],
        9: [[7,2]],
        10: [[8,0]],
        11: [[8,2]]
    }
};
export default {
    times,
    words
};
