export function isNull(object) {
    if (
        object === null ||
        typeof object === 'undefined' ||
        object === '' ||
        JSON.stringify(object) === '[]'
    ) {
        return true;
    }
    return false;
}

export function getRepetitionRate(obj){
    let repetitionRate = [];
    for (var  key in obj){
        let rate = obj[key];
        let fixRate = Number(rate * 100).toFixed(2);
        repetitionRate.push(fixRate);
    }
    return repetitionRate;
}